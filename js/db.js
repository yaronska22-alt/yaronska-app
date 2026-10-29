// Capa de datos: todo lo que habla con Supabase pasa por aquí.
// La clave "publishable" es pública por diseño: la seguridad la ponen las reglas (RLS) de la base de datos.
const SUPABASE_URL = 'https://gpiykjgziuxvjlmbgyds.supabase.co';
const SUPABASE_KEY = 'sb_publishable_gQv24EzHgyXWlJdl7Lx30Q_mm6qX0nz';
// Dirección oficial de la app: la que reciben los clientes y la de los emails de acceso
const APP_URL = 'https://app.yaronskafit.com/';
window.APP_URL = APP_URL;

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, experimental: { passkey: true } }
});

const ok = ({ data, error }) => { if (error) throw error; return data; };

const db = {
  // ---------- acceso ----------
  async session() { return ok(await sb.auth.getSession()).session; },
  onAuth(cb) { return sb.auth.onAuthStateChange((ev, s) => cb(ev, s)); },
  async signIn(email, password) { return ok(await sb.auth.signInWithPassword({ email, password })); },
  async signUp(email, password) {
    return ok(await sb.auth.signUp({ email, password, options: { emailRedirectTo: APP_URL } }));
  },
  async resetPassword(email) {
    return ok(await sb.auth.resetPasswordForEmail(email, { redirectTo: APP_URL }));
  },
  async setPassword(password) { return ok(await sb.auth.updateUser({ password })); },
  async signOut() { await sb.auth.signOut(); },

  // ---------- Face ID / huella (passkeys) ----------
  passkeySupported: !!(window.PublicKeyCredential && navigator.credentials),
  async signInPasskey() { return ok(await sb.auth.signInWithPasskey()); },
  async registerPasskey() { return ok(await sb.auth.registerPasskey()); },
  async listPasskeys() { return ok(await sb.auth.passkey.list()) || []; },
  async deletePasskey(passkeyId) { ok(await sb.auth.passkey.delete({ passkeyId })); },

  // ---------- quién soy ----------
  async me(userId) {
    const prof = ok(await sb.from('profiles').select('role,email').eq('id', userId).maybeSingle());
    const role = prof && prof.role === 'coach' ? 'coach' : 'client';
    let clientId = null;
    if (role === 'client') {
      const c = ok(await sb.from('clients').select('id').eq('user_id', userId).maybeSingle());
      clientId = c ? c.id : null;
    }
    return { role, clientId };
  },

  // ---------- entrenador: lista de clientes ----------
  async listClients() {
    const clients = ok(await sb.from('clients').select('id,email,user_id,ficha,prefs,fase,semana,semanas_fase').order('created_at'));
    const admin = ok(await sb.from('client_admin').select('*'));
    const cks = ok(await sb.from('checkins').select('client_id,fecha').order('fecha', { ascending: false }));
    return { clients, admin, checkins: cks };
  },
  async createClient(email, ficha, alta) {
    const c = ok(await sb.from('clients').insert({ email: email.toLowerCase(), ficha }).select('id').single());
    ok(await sb.from('client_admin').insert({ client_id: c.id, estado: 'active', alta }));
    return c.id;
  },

  // ---------- datos completos de un cliente ----------
  async loadClient(id, withAdmin) {
    const [client, weights, checkins, daily, logs] = await Promise.all([
      sb.from('clients').select('*').eq('id', id).single(),
      sb.from('weights').select('id,fecha,peso').eq('client_id', id).order('fecha'),
      sb.from('checkins').select('id,fecha,data,created_at').eq('client_id', id).order('fecha'),
      sb.from('daily_logs').select('fecha,data').eq('client_id', id),
      sb.from('workout_logs').select('id,fecha,dia,ejercicio,sets,created_at').eq('client_id', id).order('fecha').order('id')
    ]).then(rs => rs.map(ok));
    const admin = withAdmin ? ok(await sb.from('client_admin').select('*').eq('client_id', id).maybeSingle()) : null;
    return { client, admin, weights, checkins, daily, logs };
  },
  // ---------- Calculadora de dietas (solo entrenador) ----------
  async getDietCalc(id) { const r = ok(await sb.from('diet_calc').select('data').eq('client_id', id).maybeSingle()); return r ? r.data : null; },
  async saveDietCalc(id, data) { ok(await sb.from('diet_calc').upsert({ client_id: id, data, updated_at: new Date().toISOString() })); },
  async getSetting(key) { const r = ok(await sb.from('coach_settings').select('value').eq('key', key).maybeSingle()); return r ? r.value : null; },
  async setSetting(key, value) { ok(await sb.from('coach_settings').upsert({ key, value, updated_at: new Date().toISOString() })); },
  async insertClientRow(row) { return ok(await sb.from('clients').insert(row).select('id').single()).id; },
  async insertMany(table, rows) { if (rows.length) ok(await sb.from(table).insert(rows)); },
  async deleteClient(id) { ok(await sb.from('clients').delete().eq('id', id)); },
  async templates() { return ok(await sb.from('templates').select('*').order('id')); },

  // ---------- escrituras ----------
  async updateClient(id, row) { ok(await sb.from('clients').update({ ...row, updated_at: new Date().toISOString() }).eq('id', id)); },
  async upsertAdmin(row) { ok(await sb.from('client_admin').upsert({ ...row, updated_at: new Date().toISOString() })); },
  async insert(table, row) { return ok(await sb.from(table).insert(row).select('id,created_at').single()); },
  async update(table, id, row) { ok(await sb.from(table).update(row).eq('id', id)); },
  async upsertDaily(row) { ok(await sb.from('daily_logs').upsert({ ...row, updated_at: new Date().toISOString() })); },
  async updateMyProfile(nombre, tel, prefs) {
    ok(await sb.rpc('update_my_profile', { p_nombre: nombre, p_email: null, p_tel: tel, p_prefs: prefs }));
  },

  // ---------- fotos privadas del check-in ----------
  async uploadPhoto(path, blob) { ok(await sb.storage.from('checkins').upload(path, blob, { contentType: 'image/jpeg', upsert: true })); },
  async photoUrls(paths) {
    if (!paths.length) return [];
    return ok(await sb.storage.from('checkins').createSignedUrls(paths, 3600)).map(x => x.signedUrl);
  }
};
window.db = db;
