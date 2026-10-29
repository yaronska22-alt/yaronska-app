// Mock en memoria de js/db.js con las mismas reglas que la base de datos real
window.APP_URL='http://app.test/';
(function(){
const K='mockdb';const st=JSON.parse(localStorage.getItem(K)||'null')||{users:[{id:'u-coach',email:'yaronska22@gmail.com',pass:'coachpass1',role:'coach'}],clients:[],client_admin:[],weights:[],checkins:[],daily_logs:[],workout_logs:[],templates:[],files:{},seq:1,session:null};
const persist=()=>localStorage.setItem(K,JSON.stringify(st));window.__mock=st;window.__persist=persist;
const me=()=>st.users.find(u=>st.session&&u.id===st.session);
const isCoach=()=>me()&&me().role==='coach';
const myClient=()=>{const u=me();const c=u&&st.clients.find(c=>c.user_id===u.id);return c&&c.id};
const can=(cid)=>isCoach()||cid===myClient();
const deny=m=>{throw new Error('RLS: '+m)};
const nid=()=>st.seq++;const now=()=>new Date().toISOString();
let authCb=null;
window.db={
  async session(){const u=me();return u?{user:{id:u.id,email:u.email}}:null},
  onAuth(cb){authCb=cb},
  async signIn(email,password){const u=st.users.find(u=>u.email===email.toLowerCase());if(!u||u.pass!==password)throw new Error('Invalid login credentials');st.session=u.id;persist();return {user:{id:u.id,email:u.email}}},
  async signUp(email,password){email=email.toLowerCase();if(st.users.find(u=>u.email===email))return {user:{identities:[]},session:null};
    if(!st.clients.find(c=>c.email===email))throw new Error('Database error saving new user');
    const u={id:'u-'+nid(),email,pass:password,role:'client'};st.users.push(u);st.clients.forEach(c=>{if(c.email===email&&!c.user_id)c.user_id=u.id});persist();return {user:{id:u.id,email,identities:[{}]},session:null}},
  async resetPassword(){},async setPassword(p){const u=me();u.pass=p;persist();return {user:{id:u.id,email:u.email}}},
  async signOut(){st.session=null;persist()},
  passkeySupported:true,
  async registerPasskey(){const u=me();st.pk=st.pk||[];if(st.pk.find(k=>k.user===u.id))throw Object.assign(new Error('x'),{code:'webauthn_credential_exists'});const k={id:'pk-'+nid(),user:u.id,friendly_name:'iCloud Keychain',created_at:now()};st.pk.push(k);persist();return k},
  async signInPasskey(){const k=(st.pk||[])[0];if(!k)throw Object.assign(new Error('x'),{code:'webauthn_credential_not_found'});const u=st.users.find(x=>x.id===k.user);st.session=u.id;persist();return {user:{id:u.id,email:u.email}}},
  async listPasskeys(){return (st.pk||[]).filter(k=>k.user===me().id)},
  async deletePasskey(id){st.pk=st.pk.filter(k=>k.id!==id);persist()},
  async me(uid){const u=st.users.find(x=>x.id===uid);const role=u.role;let clientId=null;if(role==='client'){const c=st.clients.find(c=>c.user_id===uid);clientId=c?c.id:null}return {role,clientId}},
  async listClients(){if(!isCoach())deny('list');return {clients:st.clients.map(c=>({...c})),admin:st.client_admin.map(a=>({...a})),checkins:st.checkins.map(c=>({client_id:c.client_id,fecha:c.fecha})).sort((a,b)=>b.fecha.localeCompare(a.fecha))}},
  async createClient(email,ficha,alta){if(!isCoach())deny('create');const id='c-'+nid();st.clients.push({id,user_id:null,email,ficha,prefs:{},fase:0,semana:1,semanas_fase:4,kcal:1800,rest_on:true,plan:null,rutina:[],pautas:{},created_at:now()});st.client_admin.push({client_id:id,estado:'active',alta});persist();return id},
  async loadClient(id,withAdmin){if(!can(id))deny('load');const c=st.clients.find(c=>c.id===id);const f=(t)=>st[t].filter(x=>x.client_id===id).map(x=>JSON.parse(JSON.stringify(x)));
    if(withAdmin&&!isCoach())deny('admin');
    return {client:JSON.parse(JSON.stringify(c)),admin:withAdmin?(st.client_admin.find(a=>a.client_id===id)||null):null,weights:f('weights').sort((a,b)=>a.fecha.localeCompare(b.fecha)),checkins:f('checkins'),daily:f('daily_logs'),logs:f('workout_logs')}},
  async getDietCalc(id){if(!isCoach())deny('calc');st.calc=st.calc||{};return st.calc[id]||null},
  async saveDietCalc(id,data){if(!isCoach())deny('calc');st.calc=st.calc||{};st.calc[id]=JSON.parse(JSON.stringify(data));persist()},
  async getSetting(k){if(!isCoach())deny('set');return (st.settings||{})[k]||null},
  async setSetting(k,v){if(!isCoach())deny('set');st.settings=st.settings||{};st.settings[k]=v;persist()},
  async insertClientRow(row){if(!isCoach())deny('ins');const id='c-'+nid();st.clients.push(Object.assign({id,user_id:null,created_at:now()},JSON.parse(JSON.stringify(row))));persist();return id},
  async insertMany(t,rows){rows.forEach(r=>{if(!can(r.client_id))deny('many');st[t].push({id:nid(),created_at:now(),...JSON.parse(JSON.stringify(r))})});persist()},
  async deleteClient(id){if(!isCoach())deny('del');st.clients=st.clients.filter(c=>c.id!==id);['client_admin','weights','checkins','daily_logs','workout_logs'].forEach(t=>st[t]=st[t].filter(x=>x.client_id!==id));persist()},
  async templates(){if(!isCoach())deny('tpl');return st.templates},
  async updateClient(id,row){if(!isCoach())deny('updateClient');Object.assign(st.clients.find(c=>c.id===id),JSON.parse(JSON.stringify(row)));window.__writes=(window.__writes||0)+1;persist()},
  async upsertAdmin(row){if(!isCoach())deny('admin');const a=st.client_admin.find(a=>a.client_id===row.client_id);if(a)Object.assign(a,row);else st.client_admin.push(row);persist()},
  async insert(t,row){if(t==='templates'){if(!isCoach())deny('tpl')}else if(!can(row.client_id))deny('insert '+t);const r={id:nid(),created_at:now(),...JSON.parse(JSON.stringify(row))};st[t].push(r);persist();return {id:r.id,created_at:r.created_at}},
  async update(t,id,row){const r=st[t].find(x=>x.id===id);if(!can(r.client_id))deny('update');Object.assign(r,JSON.parse(JSON.stringify(row)));persist()},
  async upsertDaily(row){if(!can(row.client_id))deny('daily');const r=st.daily_logs.find(x=>x.client_id===row.client_id&&x.fecha===row.fecha);if(r)Object.assign(r,row);else st.daily_logs.push(row);persist()},
  async updateMyProfile(n,t,p){const c=st.clients.find(c=>c.user_id===me().id);if(n!=null)c.ficha.nombre=n;if(t!=null)c.ficha.tel=t;if(p)c.prefs=p;persist()},
  async uploadPhoto(path,blob){if(!isCoach()&&path.split('/')[0]!==myClient())deny('storage');st.files[path]=blob.size;persist()},
  async photoUrls(paths){return paths.map((p,i)=>'/img/recetas/'+((p.length+i)%40)+'.jpg')}
};})();
