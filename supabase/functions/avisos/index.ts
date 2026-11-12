// Avisos push de Yaronska App.
// - Lo llama pg_cron cada 15 min (cabecera x-cron-secret): víspera de la revisión, mañana de la revisión, chuleta del finde (viernes 18:00), objetivos de la semana (inicio y cierre) y registro diario.
// - Lo llama el entrenador desde el panel (con su sesión) para enviar un aviso de prueba, de revisión revisada o de logro a un cliente.
import { createClient } from "npm:@supabase/supabase-js@2.117.0";
import webpush from "npm:web-push@3.6.7";

const URL_ = Deno.env.get("SUPABASE_URL")!;
const SRV = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const db = createClient(URL_, SRV, { auth: { persistSession: false } });
const DOW = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

function madrid(d = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", weekday: "short", hour12: false }).formatToParts(d).map((x) => [x.type, x.value]));
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday as string);
  return { date: `${p.year}-${p.month}-${p.day}`, wd, min: (+p.hour % 24) * 60 + +p.minute };
}
const toMin = (hhmm: string, def: string) => { const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm || def) || /^(\d{1,2}):(\d{2})$/.exec(def)!; return +m[1] * 60 + +m[2]; };
const addDays = (d: string, n: number) => new Date(Date.parse(d + "T12:00:00Z") + n * 864e5).toISOString().slice(0, 10);
// Objetivos de una semana: los suyos o, si no tiene, los de la última semana anterior con lista
function objList(objs: Record<string, unknown> | undefined, wk: string): { t: string }[] {
  const O = objs || {}; if (Array.isArray(O[wk])) return O[wk] as { t: string }[];
  const prev = Object.keys(O).filter((k) => k < wk && Array.isArray(O[k])).sort().pop(); return prev ? O[prev] as { t: string }[] : [];
}
const inWin = (now: number, t: number) => now >= t && now < t + 15;

async function secrets() {
  const { data } = await db.from("app_secrets").select("key,value");
  const s: Record<string, string> = {}; (data || []).forEach((r) => (s[r.key] = r.value)); return s;
}
async function sendTo(clientId: string, payload: Record<string, unknown>) {
  const { data: subs } = await db.from("push_subs").select("id,endpoint,p256dh,auth").eq("client_id", clientId);
  let ok = 0;
  for (const s of subs || []) {
    try { await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify(payload), { TTL: 6 * 3600, urgency: "high" }); ok++; }
    catch (e) { const code = (e as { statusCode?: number }).statusCode; if (code === 404 || code === 410) await db.from("push_subs").delete().eq("id", s.id); console.error("push", code, (e as Error).message); }
  }
  return ok;
}
async function once(clientId: string, kind: string, fecha: string) {
  const { data, error } = await db.from("push_log").insert({ client_id: clientId, kind, fecha }).select("kind");
  return !error && data && data.length > 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const S = await secrets();
  webpush.setVapidDetails("mailto:yaronska22@gmail.com", S.vapid_public, S.vapid_private);
  const body = await req.json().catch(() => ({}));

  // ---- avisos desde el panel del entrenador (prueba, revisión revisada, logro)
  if (req.headers.get("x-cron-secret") !== S.cron_secret) {
    const auth = req.headers.get("Authorization") || "";
    const u = createClient(URL_, ANON, { global: { headers: { Authorization: auth } } });
    const { data: me } = await u.auth.getUser();
    if (!me?.user) return json({ error: "no autorizado" }, 401);
    const { data: prof } = await db.from("profiles").select("role").eq("id", me.user.id).maybeSingle();
    if (prof?.role !== "coach" || !body.client_id) return json({ error: "no autorizado" }, 403);
    const msg = body.kind === "revisada"
      ? { title: "📝 Yaron ha revisado tu revisión", body: String(body.msg || "Entra en la app para ver sus comentarios.").slice(0, 140), url: "/?go=home", tag: "revisada" }
      : body.kind === "logro"
      ? { title: String(body.title || "🏆 ¡Enhorabuena!").slice(0, 60), body: String(body.msg || "").slice(0, 140), url: "/?go=home", tag: "logro" }
      : { title: "🔔 Aviso de prueba", body: "Así te llegarán los avisos de tu revisión semanal.", url: "/", tag: "prueba" };
    const n = await sendTo(body.client_id, msg);
    return json({ sent: n });
  }

  // ---- avisos programados
  const now = madrid(); const tomorrowWd = (now.wd + 1) % 7;
  const { data: clients } = await db.from("clients").select("id,ficha,prefs,client_admin(estado)").not("user_id", "is", null);
  const { data: subs } = await db.from("push_subs").select("client_id");
  const withSub = new Set((subs || []).map((s) => s.client_id));
  const { data: cks } = await db.from("checkins").select("client_id").eq("fecha", now.date);
  const { data: dls } = await db.from("daily_logs").select("client_id,data").eq("fecha", now.date);
  const ago8 = new Date(Date.parse(now.date + "T12:00:00Z") - 8 * 864e5).toISOString().slice(0, 10);
  const { data: dl8 } = await db.from("daily_logs").select("client_id,data").gte("fecha", ago8);
  const closed = new Set((dl8 || []).filter((x) => x.data && x.data.cierre && x.data.cierre.w).map((x) => x.client_id + "|" + x.data.cierre.w));
  const ckToday = new Set((cks || []).map((x) => x.client_id)), dlToday = new Set((dls || []).filter((x) => (x.data || {}).at).map((x) => x.client_id)); // solo cuenta si ha rellenado el seguimiento (no basta con guardar un entreno)
  const out: string[] = [];
  for (const c of clients || []) {
    if (!withSub.has(c.id)) continue;
    const f = c.ficha || {}, p = c.prefs || {};
    const adm = Array.isArray(c.client_admin) ? c.client_admin[0] : c.client_admin;
    if (adm && ["paused", "ended"].includes(adm.estado)) continue;
    const first0 = String(f.nombre || "").trim().split(/\s+/)[0] || "";const first = first0 ? first0[0].toUpperCase() + first0.slice(1).toLowerCase() : "";
    const revDay = DOW.indexOf(f.revFis || "Domingo");
    let sent = false;
    if (p.nCheck !== false && revDay >= 0) {
      if (tomorrowWd === revDay && inWin(now.min, toMin(f.avisoV, "20:00")) && await once(c.id, "vispera", now.date)) {
        await sendTo(c.id, { title: "📏 Mañana toca revisión", body: `${first ? first + ", m" : "M"}añana pésate nada más levantarte, tras ir al baño y antes de comer o beber. Ten la cinta métrica a mano.`, url: "/?go=home", tag: "revision" }); sent = true; out.push(c.id + ":vispera");
      }
      if (now.wd === revDay && !ckToday.has(c.id) && inWin(now.min, toMin(f.avisoD, "06:00")) && await once(c.id, "dia", now.date)) {
        await sendTo(c.id, { title: "📏 Hoy toca tu revisión", body: "Peso en ayunas tras ir al baño, medidas con la cinta y fotos con la misma luz. Envíala desde la app 💪", url: "/?go=check", tag: "revision" }); sent = true; out.push(c.id + ":dia");
      }
    }
    // viernes por la tarde: chuleta del finde (clientes con el bonus Fin de Semana Sin Culpa)
    if (!sent && now.wd === 5 && p.nFinde !== false && Array.isArray(f.bonus) && f.bonus.includes("finde") && inWin(now.min, toMin(p.horaFinde, "18:00")) && await once(c.id, "finde", now.date)) {
      await sendTo(c.id, { title: "🍻 Llega el finde", body: `${first ? first + ", r" : "R"}ecuerda tus reglas: no llegues con hambre, proteína + verdura + un hidrato, agua entre copas y el lunes, plan normal.`, url: "/?go=finde", tag: "finde" }); sent = true; out.push(c.id + ":finde");
    }
    // objetivos de la semana (la semana va de revisión a revisión): primer día de la semana y cierre el día de la revisión
    if (!sent && p.nObj !== false && revDay >= 0) {
      const start = (revDay + 1) % 7, back = (now.wd - start + 7) % 7, wk = addDays(now.date, -back);
      const L = objList(f.objs, wk);
      if (L.length && back === 0 && inWin(now.min, toMin(p.horaObj, "09:00")) && await once(c.id, "obj_ini", now.date)) {
        await sendTo(c.id, { title: "🎯 Tus objetivos de esta semana", body: `${first ? first + ", e" : "E"}sta semana vamos a por: ${L.slice(0, 3).map((o: { t: string }) => o.t.toLowerCase()).join(" · ")}${L.length > 3 ? "…" : ""}`, url: "/?go=home", tag: "objetivos" }); sent = true; out.push(c.id + ":obj_ini");
      } else if (L.length && back === 6 && !closed.has(c.id + "|" + wk) && inWin(now.min, toMin(p.horaObjFin, "19:00")) && await once(c.id, "obj_fin", now.date)) {
        await sendTo(c.id, { title: "📝 Cierra tu semana", body: `${first ? first + ", ¿" : "¿"}cómo te han ido tus objetivos? Márcalos en la app en 1 minuto.`, url: "/?go=home", tag: "objetivos" }); sent = true; out.push(c.id + ":obj_fin");
      }
    }
    if (!sent && p.nDaily !== false && !dlToday.has(c.id) && inWin(now.min, toMin(p.hora, "21:30")) && await once(c.id, "diario", now.date)) {
      await sendTo(c.id, { title: "✅ ¿Cómo ha ido hoy?", body: `${first ? first + ", r" : "R"}ellena tu seguimiento de hoy: entreno, comidas, pasos y cómo te has sentido. Te lleva 20 segundos.`, url: "/?go=home", tag: "diario" }); out.push(c.id + ":diario");
    }
  }
  return json({ at: now, sent: out });
});
