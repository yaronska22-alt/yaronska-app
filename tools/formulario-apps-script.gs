// ===== Yaronska App · enviar las respuestas del formulario de onboarding a la app =====
// Pegar en: Google Forms → ⋮ → Editor de secuencias de comandos. Luego ejecutar «instalar» una vez.
const URL_APP = 'https://gpiykjgziuxvjlmbgyds.supabase.co/functions/v1/formulario';
const SECRETO = 'PEGAR_AQUI_EL_CODIGO_SECRETO';
// Tu formulario «1. Formulario Entrenamiento Personalizado» (así funciona aunque el script esté en un proyecto aparte)
const FORM_ID = '141lo_t12B4ZVLwrEVruz268iIjniJGrNOaxwNnGaAAU';

// Sirve tanto si el script está en el FORMULARIO como en la HOJA de respuestas
function form_() {
  let f = null; try { f = FormApp.getActiveForm(); } catch (e) {}
  if (!f && FORM_ID) f = FormApp.openById(FORM_ID);
  if (!f) { try { const url = SpreadsheetApp.getActiveSpreadsheet().getFormUrl(); if (url) f = FormApp.openByUrl(url); } catch (e) {} }
  if (!f) throw new Error('No encuentro el formulario: pega el script desde el propio formulario (⋮ → Editor de secuencias de comandos).');
  return f;
}

// 1) Ejecuta PRIMERO esta: comprueba que la app recibe datos
function probarConexion() {
  const res = UrlFetchApp.fetch(URL_APP, { method: 'post', contentType: 'application/json', headers: { 'x-form-secret': SECRETO }, payload: JSON.stringify({ test: true }), muteHttpExceptions: true });
  const ok = res.getResponseCode() === 200;
  Logger.log(ok ? '✅ CONEXIÓN OK con la app · formulario: ' + form_().getTitle() : '❌ ERROR ' + res.getResponseCode() + ' ' + res.getContentText());
}

// Se ejecuta sola cada vez que alguien envía el formulario
function enviarRespuesta(e) { enviar_([fila_(e.response)]); }

// 2) Ejecuta después esta UNA vez: activa el envío automático
function instalar() {
  const f = form_();
  ScriptApp.getProjectTriggers().forEach(t => { if (t.getHandlerFunction() === 'enviarRespuesta') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('enviarRespuesta').forForm(f).onFormSubmit().create();
  Logger.log('✅ Listo: cada respuesta nueva de «' + f.getTitle() + '» llegará a la app.');
}

// 3) Opcional: manda a la app TODAS las respuestas que ya tienes (las repetidas se ignoran)
function enviarTodasLasRespuestas() {
  const L = form_().getResponses().map(fila_);
  for (let i = 0; i < L.length; i += 40) enviar_(L.slice(i, i + 40));
  Logger.log('Enviadas ' + L.length + ' respuestas.');
}

let SECCION_ = null;
function secciones_() {
  if (SECCION_) return SECCION_;
  SECCION_ = {}; let s = '';
  form_().getItems().forEach(it => {
    if (it.getType() === FormApp.ItemType.PAGE_BREAK) s = it.getTitle(); else SECCION_[it.getId()] = s;
  });
  return SECCION_;
}
function fila_(r) {
  const sec = secciones_();
  const answers = r.getItemResponses().map(ir => {
    const it = ir.getItem(); let a = ir.getResponse();
    if (Array.isArray(a)) a = a.map(x => Array.isArray(x) ? x.join(' / ') : x).join(', ');
    return { s: sec[it.getId()] || '', q: it.getTitle(), a: String(a == null ? '' : a) };
  });
  const buscar = re => { const x = answers.find(v => re.test(v.q)); return x ? x.a : ''; };
  return { id: r.getId(), at: r.getTimestamp().toISOString(), email: (r.getRespondentEmail() || buscar(/correo|e-?mail/i)).trim(), nombre: buscar(/nombre/i), answers };
}
function enviar_(list) {
  const res = UrlFetchApp.fetch(URL_APP, { method: 'post', contentType: 'application/json', headers: { 'x-form-secret': SECRETO }, payload: JSON.stringify({ responses: list }), muteHttpExceptions: true });
  Logger.log(res.getResponseCode() + ' ' + res.getContentText());
}
