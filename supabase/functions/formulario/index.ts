// Recibe las respuestas del formulario de onboarding (Google Forms → Apps Script) y las guarda para el entrenador.
// Autenticación: cabecera x-form-secret = app_secrets.form_secret. Nada se devuelve al formulario salvo "ok".
import { createClient } from "npm:@supabase/supabase-js@2.117.0";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "método" }, 405);
  const { data: sec } = await db.from("app_secrets").select("value").eq("key", "form_secret").maybeSingle();
  if (!sec || req.headers.get("x-form-secret") !== sec.value) return json({ error: "no autorizado" }, 401);
  const body = await req.json().catch(() => null);
  const list = Array.isArray(body?.responses) ? body.responses : body ? [body] : [];
  let saved = 0;
  for (const r of list.slice(0, 500)) {
    const answers = Array.isArray(r.answers) ? r.answers.slice(0, 200).map((a: Record<string, unknown>) => ({ s: String(a.s || "").slice(0, 200), q: String(a.q || "").slice(0, 500), a: String(a.a ?? "").slice(0, 5000) })) : [];
    const email = String(r.email || "").trim().toLowerCase().slice(0, 200) || null;
    const nombre = String(r.nombre || "").trim().slice(0, 200) || null;
    let client_id: string | null = null;
    if (email) {
      const { data: a } = await db.from("clients").select("id").eq("email", email).limit(1);
      const { data: b } = a && a.length ? { data: a } : await db.from("clients").select("id").eq("ficha->>email", email).limit(1);
      client_id = (b && b[0]?.id) || null;
    }
    const row = { response_id: String(r.id || "").slice(0, 200) || null, submitted_at: r.at || null, email, nombre, answers, client_id };
    const { error } = await db.from("form_responses").upsert(row, { onConflict: "response_id", ignoreDuplicates: true });
    if (!error) saved++; else console.error(error.message);
  }
  return json({ ok: true, saved });
});
