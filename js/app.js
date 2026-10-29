let DATA=null;
const PHOTO=i=>'img/recetas/'+i+'.jpg';
const WA='34655694175';
const CLIENT={};
// Ficha del cliente (mismos campos que la Calculadora). Valores vacíos para clientes nuevos.
const FICHA_DEF={nombre:'',email:'',tel:'',sexo:'',nac:'',altura:'',objetivo:'perder',
  estado:'active',alta:'',tipo:'',renov:'',pago:'',cheat:'',pausa:'',baja:'',notasCom:'',
  tipoEntreno:'',diasSemana:'',dias:[],pasosT:'',pasosR:'',revFis:'Domingo',lastFis:'',revEnt:'',lastEnt:'',
  objLargo:'',patologias:'',alergias:'',intol:'',lesiones:'',medicacion:'',suplem:'',ciclo:'',histDietas:'',prefs:'',evitar:'',sueno:'',estres:'',motiv:'',
  omega3:'',vitD:'',b12:'',magnesio:'',vitC:'',hierro:'',calcio:'',zinc:'',folato:'',potasio:'',creatina:'',colageno:'',cafeina:'',multi:'no',supOtros:'',
  sal:'',sol:'',agua:'',cafe:'',alcohol:'',tabaco:'',aire:'',pantallas:'',lifeNotas:''};
// Campos que SOLO ve el entrenador: se guardan aparte (tabla client_admin) y el cliente nunca los recibe
const ADMIN_MAP={estado:'estado',alta:'alta',tipo:'tipo',renov:'renovacion',pago:'pago',cheat:'cheatmeals',pausa:'pausa',baja:'baja',notasCom:'notas'};
var FICHA=null;
Object.defineProperties(CLIENT,{
  program:{get:()=>PROG().n},
  name:{get:()=>(((FICHA||FICHA_DEF).nombre||'').trim()||'Cliente')},
  first:{get:()=>CLIENT.name.split(/\s+/)[0]},
  checkDay:{get:()=>(FICHA||FICHA_DEF).revFis||'Domingo'},
  goal:{get:()=>(FICHA||FICHA_DEF).objetivo},
  trainDays:{get:()=>(FICHA||FICHA_DEF).dias||[]},
  stepsGoal:{get:()=>{const f=FICHA||FICHA_DEF;return +((f.dias||[]).includes(new Date().getDay())?f.pasosT:f.pasosR)||0}}});
// Programas: cada cliente está en uno, con sus fases (o etapas en la fase libre)
const PROGS={
  perdida:{n:'Método Anti-Esfuerzo',t:'Pérdida de grasa',w:'Fase',ph:[
    {n:'Ignición metabólica',d:'Entreno de adaptación para maximizar el gasto y dieta pensada para activar el metabolismo. Aquí cae el grueso de la grasa.'},
    {n:'Moldeado griego',d:'El entreno se orienta a los músculos que quieres resaltar y la dieta acompaña al objetivo estético.'},
    {n:'Libertad de por vida',d:'Aprendes a gestionar dieta y entreno tú solo para que no haya rebote.'}]},
  musculo:{n:'Método Anti-Esfuerzo · Masa muscular',t:'Ganancia de masa muscular',w:'Fase',ph:[
    {n:'Cimientos de acero',d:'Optimizamos tu cuerpo para ganar la máxima masa muscular: creamos el entorno para que construyas músculo de forma súper eficiente.'},
    {n:'Ascenso al Olimpo',d:'Creamos las formas de tu cuerpo según tus gustos: trabajamos los músculos que tú quieres resaltar.'},
    {n:'Músculo sin caducidad',d:'Aprendes a mantener todo lo logrado sin perder físico ni rendimiento, gestionando tú solo dieta y entreno.'}]},
  libre:{n:'Fase libre',t:'Fase libre',w:'Etapa',ph:[
    {n:'Etapa de volumen',d:'Ganamos masa muscular con un superávit controlado y entreno enfocado en progresar.'},
    {n:'Etapa de definición',d:'Bajamos grasa manteniendo el músculo y el rendimiento.'},
    {n:'Etapa de adaptación',d:'Ajustamos dieta y entreno a tu día a día para consolidar lo logrado y preparar el siguiente objetivo.'}]}
};
const progKey=f=>{f=f||FICHA||FICHA_DEF;return PROGS[f.programa]?f.programa:(f.objetivo==='ganar'?'musculo':'perdida')};
const PROG=f=>PROGS[progKey(f)];
const PH=()=>PROG().ph;
const phOf=(f,i)=>{const P=PROG(f).ph;return P[Math.min(Math.max(0,i||0),P.length-1)]};
const RESOURCES=[
  {t:'Libro de recetas',d:'49 recetas con las cantidades de tu plan',u:'https://drive.google.com/file/d/13-43KrZG8mGIQNXs5WoVIqhy_aCev0g0/view',k:'PDF'},
  {t:'10 salsas fit',d:'Mucho sabor, pocas calorías',u:'https://drive.google.com/file/d/1Y9CGkn-OOomIIntNeOplIA3wenQGfiab/view',k:'PDF'},
  {t:'Guía para comer fuera',d:'Restaurantes sin romper el plan',u:'https://drive.google.com/file/d/1MXfIbHVysfkzJxs7SZblMfunqmpVv3ax/view',k:'PDF'},
  {t:'Guía de vacaciones',d:'Hotel y buffet sin agobios',u:'https://drive.google.com/file/d/1Ht_HyG8K86WqTBgYlXjionl9iWespQfG/view',k:'PDF'},
  {t:'Guía de medidas corporales',d:'Cómo medirte para la revisión',u:'https://drive.google.com/file/d/1uOVFw6omZxpxAX2Yr-OQjf8d51xX0l3K/view',k:'PDF'},
  {t:'Cinta métrica corporal',d:'La que necesitas para tus medidas · Amazon',u:'https://www.amazon.es/dp/B0B1JH9SFW',k:'🛒'},
  {t:'Guía del sueño',d:'Dormir mejor para perder más',u:'https://drive.google.com/file/d/1wwzz-jrqoWbnAXLocezH5YqF-v09naml/view',k:'PDF'},
  {t:'Guía del estrés',d:'Que la cabeza no te sabotee',u:'https://drive.google.com/file/d/1a-4JijUmsAcvmvg169n20Ub7WhSt0XXd/view',k:'PDF'}
];
const yt=n=>'https://www.youtube.com/results?search_query='+encodeURIComponent('como hacer '+n+' tecnica');
// Tus 18 planificaciones de Google Sheets (3. BOCETOS ENTRENOS PRO)
let TEMPLATES=[];
const clone=o=>JSON.parse(JSON.stringify(o));

// Escalas del check-in (pautas de Yaron)
const SCALES=[
 {k:'estres',t:'Nivel de estrés',o:['Estrés incapacitante: vivo varias situaciones estresantes que me resultan abrumadoras. Noto síntomas físicos graves y debilitantes, que a menudo me impiden hacer vida normal (problemas cardiacos, reacciones cutáneas, síndrome de intestino irritable…). Mis emociones son negativas y siento mucha desesperación.','Estrés alto: vivo situaciones muy estresantes y persistentes en varios frentes (trabajo, familia, pareja…). Mis emociones son predominantemente negativas, con ansiedad evidente. Noto síntomas físicos preocupantes que repercuten en mi salud. Me cuesta afrontar el día a día.','Estrés moderado: vivo situaciones estresantes en varios frentes (trabajo, familia, pareja…). Mis emociones fluctúan mucho y me noto en tensión a menudo. Noto algunos síntomas físicos aunque sean manejables (dolores musculares, cambios de apetito, problemas de sueño…).','Estrés bajo: vivo algunas situaciones estresantes temporales, con emociones controlables. A veces aparecen síntomas físicos leves (tensión muscular, dolor de cabeza o digestiones pesadas), pero son ocasionales. Gozo de buena salud general.','Sin estrés: no vivo situaciones estresantes, mis emociones son generalmente positivas, tengo muy buena salud y me siento muy bien.']},
 {k:'sueno',t:'Calidad del sueño',o:['Insomnio: tengo problemas graves de insomnio, pesadillas frecuentes y un sueño interrumpido a menudo.','Duermo mal: 4 noches o más durante la semana he tenido dificultad para conciliar el sueño y despertares nocturnos frecuentes en los que me cuesta volver a dormir.','Duermo regular: 4 noches o más duermo bien, pero hay otras en las que me despierto y me cuesta volver a dormir.','Duermo bien: no me cuesta conciliar el sueño y, aunque a veces me despierto por la noche, me vuelvo a dormir enseguida.','Duermo genial: tengo un sueño profundo y no tengo ninguna interrupción.']},
 {k:'cansancio',t:'Cansancio general',o:['Fatiga incapacitante: noto una fatiga generalizada extrema. Me siento completamente agotad@, incapaz de hacer vida normal y necesito descansar urgentemente.','Fatiga alta: siento un cansancio notable. No puedo mantener el rendimiento que me gustaría y tengo problemas de concentración.','Fatiga moderada: me siento cansad@ y con poca energía en algunos momentos del día. Cumplo con el día a día, pero me supone un esfuerzo extra.','Energía adecuada: me siento enérgic@, mi cansancio se ajusta a mi actividad y no necesito un esfuerzo extra para el día a día.','Energía óptima: me siento completamente descansad@ y llen@ de energía. Ningún síntoma de fatiga; cumplir con el día a día me resulta muy sencillo.']},
 {k:'hambre',t:'Nivel de hambre y saciedad',o:['Tengo muchísima hambre.','Tengo hambre, necesito más comida.','Estoy bien, me encuentro saciad@.','Me cuesta acabar la comida.','Me resulta muy difícil acabar la comida.']},
 {k:'motivacion',t:'Grado de motivación',o:['Me está resultando imposible cumplir el plan, no me siento bien y estoy perdiendo las ganas de continuar.','A veces dudo de mi progreso, siento que saco energías de donde no hay; sigo por compromiso, pero no siento ilusión.','Me siento un poco indiferente: cumplo el plan como un autómata porque sé que quiero seguir y que este es el camino.','Por lo general siento que estoy donde debo estar. Hay momentos más duros, pero me encanta lo que hago y estoy dispuest@ a afrontar lo que venga.','Me encanta mi preparación, lo estoy disfrutando muchísimo y me levanto todos los días pensando en que me voy a comer el mundo.']},
 {k:'recup',t:'Recuperación entre entrenos',o:['Sin recuperar: llego a todas las sesiones con agujetas fuertes o dolor articular, las agujetas me duran más de 72 h y he bajado peso o repeticiones en casi todos los ejercicios.','Mala recuperación: en 2 o más sesiones he llegado con agujetas o molestias de los días anteriores (48-72 h) y no he podido mantener los pesos o las repeticiones.','Recuperación justa: algún grupo muscular llegó cargado al siguiente entreno (agujetas de 24-48 h), pero he mantenido pesos y repeticiones.','Buena recuperación: las agujetas desaparecen en menos de 24-48 h, llego con fuerza a los entrenos y he igualado o mejorado mis marcas.','Recuperación perfecta: llego fresc@ a todas las sesiones, sin agujetas que limiten ni molestias, y he mejorado peso o repeticiones en casi todo.']},
 {k:'nutricion',t:'Seguimiento de la nutrición',o:['No he cumplido con nada.','No he cumplido las calorías durante 3 días o menos.','Sí he cumplido con las calorías, pero no con los intercambios o macros.','He cumplido con calorías e intercambios o macros, pero no con todas las pautas de selección de alimentos.','He cumplido con todo.']},
 {k:'entreno',t:'Seguimiento del entreno',o:['No he entrenado ningún día.','No he hecho 1-2 sesiones y/o no he cumplido nunca el RPE.','Me he dejado ejercicios por hacer en 1-2 sesiones y/o me he saltado el RPE más de 10 veces.','Me he saltado el RPE de 1 a 10 veces en la semana.','He entrenado todos los días y he cumplido con todo.']}
];
const URINE=[['#FBF7DC','1'],['#F7F0B0','2'],['#F2E78A','3'],['#EBD95F','4'],['#E2C43E','5'],['#D1A928','6'],['#B98A1C','7'],['#94661A','8']];
const MEAS=[['peso','Peso','kg'],['hs','Horas de sueño','h'],['cuello','Cuello','cm'],['torso','Torso / pecho','cm'],['biceps','Bíceps','cm'],['cintura','Cintura','cm'],['abdomen','Abdomen','cm'],['cadera','Cadera','cm'],['gluteo','Glúteo','cm'],['pierna','Pierna','cm'],['gemelo','Gemelo','cm']];

// ---- estado + sincronización con la base de datos (Supabase)
const pad2=n=>String(n).padStart(2,'0');
const iso=d=>`${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
const daysAgo=n=>{const d=new Date();d.setDate(d.getDate()-n);return d};
const PROFILE_DEF={foto:'',nCheck:true,nDaily:true,nTrain:true,hora:'20:00',unid:'kg',consent:false};
const emptyS=()=>({weights:[],checkins:[],hist:{},daily:{},routine:[],kcal:1800,restOn:true,planOn:false,next:{},phase:0,week:1,weeksPhase:4,ficha:clone(FICHA_DEF),profile:clone(PROFILE_DEF)});
let S=emptyS();FICHA=S.ficha;
let ME=null;        // {id,email,role,clientId}
let CUR=null;       // cliente cargado {id,email}
let CL=[];          // lista de clientes (entrenador)
let TPL_MINE=[];    // plantillas guardadas por el entrenador
let SNAP=null;
let RECOVERY=false,OFFER_PK=false; // llegó desde el email de "he olvidado mi contraseña"      // copia de lo último guardado, para enviar solo lo que cambia

function fichaPublic(){const o={};Object.keys(FICHA).forEach(k=>{if(!(k in ADMIN_MAP))o[k]=FICHA[k]});return o}
function clientRow(){return {email:(FICHA.email||CUR.email||'').trim().toLowerCase()||CUR.email,ficha:fichaPublic(),prefs:S.profile,fase:S.phase,semana:S.week,semanas_fase:S.weeksPhase,kcal:S.kcal,rest_on:S.restOn,plan:S.planCalc?S.planCalc:S.planOn?{auto:true,kcal:S.kcal}:null,rutina:S.routine,pautas:S.next}}
function adminRow(){const r={client_id:CUR.id};Object.entries(ADMIN_MAP).forEach(([k,col])=>{let v=FICHA[k];if(v===''||v==null)v=null;if(col==='pago'&&v!=null)v=+v;if(col==='cheatmeals'&&v!=null)v=Math.round(+v);r[col]=v});if(!r.estado)r.estado='active';return r}
const wBody=w=>({client_id:CUR.id,fecha:w.date,peso:w.peso});
const cBody=c=>{const {id,date,...data}=c;return {client_id:CUR.id,fecha:date,data}};
const hBody=(n,h)=>({client_id:CUR.id,fecha:h.date,dia:h.day||null,ejercicio:n,sets:h.sets});
const J=o=>JSON.stringify(o);

function fromDb(d){
  S=emptyS();const c=d.client;
  S.ficha=Object.assign(clone(FICHA_DEF),c.ficha||{});if(!Array.isArray(S.ficha.dias))S.ficha.dias=[];
  if(d.admin)Object.entries(ADMIN_MAP).forEach(([k,col])=>{S.ficha[k]=d.admin[col]==null?'':d.admin[col]});
  if(!S.ficha.email)S.ficha.email=c.email;
  S.profile=Object.assign(clone(PROFILE_DEF),c.prefs||{});
  S.phase=c.fase;S.week=c.semana;S.weeksPhase=c.semanas_fase;S.kcal=c.kcal;S.restOn=c.rest_on;S.planOn=!!c.plan;S.planCalc=c.plan&&c.plan.source==='calc'?c.plan:null;S.routine=c.rutina||[];
  S.weights=d.weights.map(w=>({id:w.id,date:w.fecha,peso:+w.peso}));
  S.checkins=d.checkins.map(x=>Object.assign({r:{}},x.data,{id:x.id,date:x.fecha}));
  d.daily.forEach(x=>{S.daily[x.fecha]=x.data});
  d.logs.forEach(l=>{(S.hist[l.ejercicio]=S.hist[l.ejercicio]||[]).push({id:l.id,date:l.fecha,day:l.dia||'',sets:l.sets,ts:Date.parse(l.created_at)})});
  // Una pauta deja de mostrarse cuando el cliente ya ha entrenado ese ejercicio después de pautarla
  Object.entries(c.pautas||{}).forEach(([n,p])=>{const h=S.hist[n]||[];if(!p.ts||!h.some(x=>x.ts>p.ts))S.next[n]=p});
  FICHA=S.ficha;CUR={id:c.id,email:c.email};
  SNAP={client:J(clientRow()),admin:d.admin?J(adminRow()):null,profile:J({n:FICHA.nombre,t:FICHA.tel,p:S.profile}),w:{},c:{},d:{},h:{}};
  S.weights.forEach(w=>SNAP.w[w.id]=J(wBody(w)));S.checkins.forEach(x=>SNAP.c[x.id]=J(cBody(x)));
  Object.entries(S.daily).forEach(([k,v])=>SNAP.d[k]=J(v));Object.entries(S.hist).forEach(([n,a])=>a.forEach(h=>SNAP.h[h.id]=J(hBody(n,h))));
}
async function loadClient(id){
  const d=await db.loadClient(id,ME.role==='coach');fromDb(d);
  dayIdx=0;today={};ck={};dayType=CLIENT.trainDays.includes(new Date().getDay())?'T':'R';wFrom='';wTo='';exSel='';sesSel='';planPrev=null;
}

async function sync(){
  if(!CUR||!SNAP)return;const snap=SNAP;
  if(ME.role==='coach'){
    const cr=J(clientRow());if(cr!==snap.client){await db.updateClient(CUR.id,JSON.parse(cr));snap.client=cr}
    const ar=J(adminRow());if(ar!==snap.admin){await db.upsertAdmin(JSON.parse(ar));snap.admin=ar}
    for(const t of TPL_MINE)if(!t.id){const r=await db.insert('templates',{nombre:t.name,descr:t.desc||null,days:t.days});t.id=r.id}
  }else{
    const pr=J({n:FICHA.nombre,t:FICHA.tel,p:S.profile});if(pr!==snap.profile){await db.updateMyProfile(FICHA.nombre||null,FICHA.tel||null,S.profile);snap.profile=pr}
  }
  for(const w of S.weights){const b=J(wBody(w));if(!w.id){const r=await db.insert('weights',JSON.parse(b));w.id=r.id;snap.w[w.id]=b}else if(snap.w[w.id]!==b){await db.update('weights',w.id,JSON.parse(b));snap.w[w.id]=b}}
  for(const x of S.checkins){const b=J(cBody(x));if(!x.id){const r=await db.insert('checkins',JSON.parse(b));x.id=r.id;snap.c[x.id]=b}else if(snap.c[x.id]!==b){await db.update('checkins',x.id,JSON.parse(b));snap.c[x.id]=b}}
  for(const [k,v] of Object.entries(S.daily)){const b=J(v);if(snap.d[k]!==b){await db.upsertDaily({client_id:CUR.id,fecha:k,data:v});snap.d[k]=b}}
  for(const [n,a] of Object.entries(S.hist))for(const h of a){const b=J(hBody(n,h));if(!h.id){const r=await db.insert('workout_logs',JSON.parse(b));h.id=r.id;h.ts=Date.parse(r.created_at)||h.ts;snap.h[h.id]=b}else if(snap.h[h.id]!==b){await db.update('workout_logs',h.id,JSON.parse(b));snap.h[h.id]=b}}
}
let syncChain=Promise.resolve(),syncTimer=null,PENDING=false,retryTimer=null;
function save(){PENDING=true;clearTimeout(syncTimer);syncTimer=setTimeout(runSync,400)}
function runSync(){
  clearTimeout(syncTimer);clearTimeout(retryTimer);
  syncChain=syncChain.then(sync).then(()=>{PENDING=false;setSaveState('ok')}).catch(e=>{console.error(e);setSaveState('err');toast('No se ha podido guardar. Lo reintento en unos segundos…');retryTimer=setTimeout(runSync,6000)});
  setSaveState('busy');return syncChain;
}
async function flushSync(){if(PENDING)await runSync()}
function setSaveState(s){const el=document.getElementById('saveState');if(!el)return;el.dataset.s=s;el.textContent=s==='busy'?'Guardando…':s==='err'?'Sin guardar':'Guardado'}
window.addEventListener('beforeunload',e=>{if(PENDING){e.preventDefault();e.returnValue=''}});

// ---- acceso (login, registro, contraseña)
function authMsg(e){const m=String(e&&(e.message||e.error_description||e)||'');
  if(/invalid login credentials/i.test(m))return 'Email o contraseña incorrectos.';
  if(/email not confirmed/i.test(m))return 'Antes de entrar, confirma tu email con el enlace que te enviamos al crear la cuenta.';
  if(/EMAIL_NO_INVITADO|database error saving new user/i.test(m))return 'Este email no está dado de alta. Escribe a Yaron para que te dé acceso.';
  if(/already registered|already been registered/i.test(m))return 'Ya tienes cuenta con este email: entra con tu contraseña.';
  if(/password should be|at least 6/i.test(m))return 'La contraseña debe tener al menos 8 caracteres.';
  if(/same password|different from the old/i.test(m))return 'La contraseña nueva debe ser distinta de la actual.';
  if(/rate limit|too many|security purposes/i.test(m))return 'Demasiados intentos seguidos. Espera unos minutos y vuelve a probar.';
  if(/failed to fetch|network/i.test(m))return 'Sin conexión. Revisa tu internet y vuelve a probar.';
  return m||'Algo ha fallado. Vuelve a intentarlo.';}
const AUTH_BRAND=`<div class="auth-brand">YARONSKA<b>_FIT</b></div>`;
function showAuth(mode,msg){
  document.getElementById('app').hidden=true;const el=document.getElementById('auth');el.hidden=false;
  const f=(id,l,t,ac)=>`<div class="field"><label for="${id}">${l}</label><input id="${id}" type="${t}" autocomplete="${ac}" required></div>`;
  const note=msg?`<p class="auth-msg">${esc(msg)}</p>`:'';
  const V={
    loading:`${AUTH_BRAND}<p class="muted" style="text-align:center">Cargando…</p>`,
    login:`${AUTH_BRAND}<h1>Entra en tu <em>app</em></h1>${note}<form onsubmit="doLogin(event)">${f('aE','Email','email','email')}${f('aP','Contraseña','password','current-password')}<button class="btn" type="submit">Entrar</button></form>
      ${db.passkeySupported?`<button class="btn ghost" type="button" onclick="doPasskey(this)">🔒 Entrar con Face ID / huella</button>`:''}
      <div class="auth-links"><button type="button" onclick="showAuth('signup')">Es mi primera vez: crear mi cuenta</button><button type="button" onclick="showAuth('forgot')">He olvidado mi contraseña</button></div>`,
    signup:`${AUTH_BRAND}<h1>Crea tu <em>cuenta</em></h1>${note}<p class="small muted">Usa el mismo email que le diste a Yaron.</p><form onsubmit="doSignup(event)">${f('aE','Email','email','email')}${f('aP','Contraseña (mín. 8 caracteres)','password','new-password')}${f('aP2','Repite la contraseña','password','new-password')}<button class="btn" type="submit">Crear mi cuenta</button></form>
      <div class="auth-links"><button type="button" onclick="showAuth('login')">Ya tengo cuenta: entrar</button></div>`,
    forgot:`${AUTH_BRAND}<h1>Recupera tu <em>contraseña</em></h1>${note}<form onsubmit="doForgot(event)">${f('aE','Email','email','email')}<button class="btn" type="submit">Enviarme el enlace</button></form>
      <div class="auth-links"><button type="button" onclick="showAuth('login')">Volver a entrar</button></div>`,
    newpass:`${AUTH_BRAND}<h1>Nueva <em>contraseña</em></h1>${note}<form onsubmit="doNewPass(event)">${f('aP','Contraseña nueva (mín. 8 caracteres)','password','new-password')}${f('aP2','Repítela','password','new-password')}<button class="btn" type="submit">Guardar y entrar</button></form>`,
    nolink:`${AUTH_BRAND}<h1>Casi <em>listo</em></h1><p class="auth-msg">Tu cuenta está creada pero todavía no está vinculada a tu programa. Escribe a Yaron y te lo activa en un momento.</p><a class="btn" href="https://wa.me/${WA}" target="_blank" rel="noopener">Escribir a Yaron</a><div class="auth-links"><button type="button" onclick="logout()">Cerrar sesión</button></div>`,
    error:`${AUTH_BRAND}<h1>Algo ha <em>fallado</em></h1>${note}<button class="btn" type="button" onclick="location.reload()">Reintentar</button>`
  };
  el.innerHTML=`<div class="auth-card">${V[mode]}</div>`;const first=el.querySelector('input');if(first)first.focus();
}
const busy=(e,on)=>{const b=e.target.querySelector('button[type=submit]');if(b){b.disabled=on;b.dataset.t=b.dataset.t||b.textContent;b.textContent=on?'Un momento…':b.dataset.t}};
async function doLogin(e){e.preventDefault();busy(e,true);try{const r=await db.signIn(document.getElementById('aE').value.trim(),document.getElementById('aP').value);OFFER_PK=true;await enter(r.user)}catch(err){showAuth('login',authMsg(err))}}
async function doSignup(e){e.preventDefault();const em=document.getElementById('aE').value.trim(),p=document.getElementById('aP').value,p2=document.getElementById('aP2').value;
  if(p.length<8)return showAuth('signup','La contraseña debe tener al menos 8 caracteres.');if(p!==p2)return showAuth('signup','Las contraseñas no coinciden.');
  busy(e,true);try{const r=await db.signUp(em,p);if(r.user&&Array.isArray(r.user.identities)&&!r.user.identities.length)return showAuth('login','Ya tienes cuenta con este email: entra con tu contraseña.');
    if(r.session)return enter(r.user);showAuth('login','¡Cuenta creada! Te hemos enviado un email para confirmarla. Ábrelo, pulsa el enlace y luego entra aquí.')}catch(err){showAuth('signup',authMsg(err))}}
async function doForgot(e){e.preventDefault();busy(e,true);try{await db.resetPassword(document.getElementById('aE').value.trim());showAuth('login','Si el email está dado de alta, te llegará un enlace para crear una contraseña nueva. Revisa también la carpeta de spam.')}catch(err){showAuth('forgot',authMsg(err))}}
async function doNewPass(e){e.preventDefault();const p=document.getElementById('aP').value,p2=document.getElementById('aP2').value;
  if(p.length<8)return showAuth('newpass','La contraseña debe tener al menos 8 caracteres.');if(p!==p2)return showAuth('newpass','Las contraseñas no coinciden.');
  busy(e,true);try{const r=await db.setPassword(p);RECOVERY=false;history.replaceState(null,'',location.pathname);await enter(r.user)}catch(err){showAuth('newpass',authMsg(err))}}
async function logout(){try{if(CALC.frame){await calcFlush();document.getElementById('calcWrap').hidden=true;CALC.forId=null}}catch(e){}try{await flushSync()}catch(e){}await db.signOut();ME=null;CUR=null;SNAP=null;S=emptyS();FICHA=S.ficha;showAuth('login')}

// ---- Face ID / huella (passkeys): entrar sin escribir la contraseña
function pkMsg(e){const m=String(e&&(e.code||e.message||e.name)||'');
  if(/NotAllowed|cancel|abort/i.test(m))return 'Cancelado. Puedes volver a intentarlo o entrar con tu contraseña.';
  if(/credential_not_found/i.test(m))return 'Este dispositivo no tiene Face ID activado para tu cuenta. Entra con tu contraseña y actívalo en tu perfil.';
  if(/credential_exists|InvalidState/i.test(m))return 'Este dispositivo ya tiene el Face ID activado.';
  if(/passkey_disabled/i.test(m))return 'El acceso con Face ID todavía no está activado. Entra con tu contraseña.';
  if(/too_many_passkeys/i.test(m))return 'Has llegado al máximo de dispositivos. Quita alguno antes de añadir otro.';
  return authMsg(e);}
async function doPasskey(btn){btn.disabled=true;try{const r=await db.signInPasskey();await enter(r.user)}catch(err){console.error(err);showAuth('login',pkMsg(err))}}
async function addPasskey(after){try{await db.registerPasskey();toast('Face ID activado en este dispositivo');try{localStorage.setItem('pk-ask-'+ME.id,'done')}catch(e){}}catch(err){console.error(err);toast(pkMsg(err))}if(after)after()}
async function delPasskey(id,after){try{await db.deletePasskey(id);toast('Dispositivo quitado')}catch(err){toast(pkMsg(err))}if(after)after()}
async function pkListHTML(){
  if(!db.passkeySupported)return '<p class="small muted" style="margin:0">Este navegador no permite Face ID ni huella.</p>';
  let L=[];try{L=await db.listPasskeys()}catch(e){return '<p class="small muted" style="margin:0">No se ha podido consultar. Inténtalo más tarde.</p>'}
  return `${L.length?L.map(k=>`<div class="prow"><span>🔒 ${esc(k.friendly_name||'Dispositivo')}<small>Activado el ${new Date(k.created_at).toLocaleDateString('es-ES')}${k.last_used_at?' · último uso '+new Date(k.last_used_at).toLocaleDateString('es-ES'):''}</small></span><button class="btn ghost sm" type="button" onclick="delPasskey('${esc(k.id)}',PK_AFTER)">Quitar</button></div>`).join(''):'<p class="small muted" style="margin:0">Aún no lo tienes activado en ningún dispositivo.</p>'}
  <button class="btn" type="button" onclick="addPasskey(PK_AFTER)">Activar Face ID / huella en este dispositivo</button>`;
}
let PK_AFTER=null;
async function fillPk(){const el=document.getElementById('pkBox');if(el)el.innerHTML=await pkListHTML()}
function openPkSheet(){const sh=document.getElementById('sheet');PK_AFTER=openPkSheet;
  sh.innerHTML=`<div class="sheet-in" role="dialog" aria-label="Face ID"><div class="sheet-b"><div class="row" style="justify-content:space-between"><h2>Face ID / huella</h2><button class="btn ghost sm" type="button" onclick="closeSheet()">Cerrar</button></div><p class="small muted" style="margin:0">Entra en la app sin escribir la contraseña. Se activa en cada móvil u ordenador por separado.</p><div id="pkBox" class="pcard"><p class="muted">Cargando…</p></div></div></div>`;
  sh.hidden=false;sh.onclick=e=>{if(e.target===sh)closeSheet()};fillPk()}
async function offerPasskey(){
  if(!db.passkeySupported)return;let k='';try{k=localStorage.getItem('pk-ask-'+ME.id)}catch(e){}if(k)return;
  let L=[];try{L=await db.listPasskeys()}catch(e){return}if(L.length)return;
  const sh=document.getElementById('sheet');
  sh.innerHTML=`<div class="sheet-in" role="dialog" aria-label="Activar Face ID"><div class="sheet-b"><h2>¿Entrar con Face ID la próxima vez?</h2><p class="small muted" style="margin:0">Así no tendrás que escribir la contraseña en este dispositivo. Lo puedes quitar cuando quieras desde tu perfil.</p>
    <div class="row"><button class="btn" type="button" onclick="addPasskey(closeSheet)">Sí, activar</button><button class="btn ghost" type="button" onclick="try{localStorage.setItem('pk-ask-'+ME.id,'no')}catch(e){};closeSheet()">Ahora no</button></div></div></div>`;
  sh.hidden=false;
}
async function enter(user){
  showAuth('loading');
  try{
    ME=Object.assign({id:user.id,email:user.email},await db.me(user.id));
    if(ME.role==='coach'){
      TPL_MINE=(await db.templates()).map(t=>({id:t.id,name:t.nombre,desc:t.descr||'',days:t.days}));
      await refreshList();if(CL.length){coachSel=CL[0].id;await loadClient(coachSel)}else{CUR=null;SNAP=null}
    }else{
      if(!ME.clientId)return showAuth('nolink');
      await loadClient(ME.clientId);
    }
  }catch(err){console.error(err);return showAuth('error','No se han podido cargar tus datos: '+authMsg(err))}
  if(RECOVERY)return showAuth('newpass','Escribe tu contraseña nueva.');
  document.getElementById('auth').hidden=true;document.getElementById('app').hidden=false;
  document.querySelector('.seg').hidden=ME.role!=='coach';document.getElementById('outBtn').hidden=ME.role!=='coach';
  document.getElementById('pkBtn').hidden=ME.role!=='coach'||!db.passkeySupported;
  tab='home';setView(ME.role==='coach'?'coach':'client');
  if(OFFER_PK){OFFER_PK=false;offerPasskey()}
}
async function boot(){
  showAuth('loading');
  try{const [d,t]=await Promise.all([fetch('data/plan.json').then(r=>r.json()),fetch('data/rutinas.json').then(r=>r.json())]);DATA=d;TEMPLATES=t}
  catch(e){return showAuth('error','No se ha podido cargar la app. Revisa tu conexión.')}
  db.onAuth((ev)=>{if(ev==='PASSWORD_RECOVERY'){RECOVERY=true;setTimeout(()=>showAuth('newpass','Escribe tu contraseña nueva.'))}});
  if(/type=recovery/.test(location.hash))return;
  try{const s=await db.session();if(s)await enter(s.user);else showAuth('login')}catch(e){showAuth('login')}
}
let view='client',tab='home',foodTab='plan',meal='lunch',dayType=CLIENT.trainDays.includes(new Date().getDay())?'T':'R',dayIdx=0,F={p:null,f:null,c:null},
  ck={},coachSel=0,coachTab='ficha',wFrom='',wTo='',exSel='',exMetric='kg',today={};
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nf=(n,d=1)=>Number(n).toFixed(d).replace('.',',');
const fdate=s=>{const d=new Date(s+'T12:00:00');return d.toLocaleDateString('es-ES',{day:'numeric',month:'short'})};
function toast(t){const el=document.getElementById('toast');el.textContent=t;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,2200)}

// ---- gráfica genérica (línea + área, ejes con min/max y fechas)
function lineChart(pts,opt){
  opt=opt||{};if(pts.length<2)return '<p class="small muted" style="margin:0">Hacen falta al menos 2 registros para dibujar la gráfica.</p>';
  const W=340,H=150,L=34,R=10,T=12,B=22;const vs=pts.map(p=>p.v);let mn=Math.min(...vs),mx=Math.max(...vs);const pad=(mx-mn)*0.15||1;mn-=pad;mx+=pad;
  const x=i=>L+i*(W-L-R)/(pts.length-1),y=v=>T+(1-(v-mn)/(mx-mn))*(H-T-B);
  const line=pts.map((p,i)=>`${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
  const col=opt.color||'#FFD60A';
  const grid=[0,.5,1].map(f=>{const v=mn+f*(mx-mn);return `<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="#2E2A24" stroke-width="1"/><text x="${L-6}" y="${y(v)+3}" text-anchor="end">${nf(v,opt.dec??1)}</text>`}).join('');
  const lab=`<text x="${L}" y="${H-6}">${fdate(pts[0].d)}</text><text x="${W-R}" y="${H-6}" text-anchor="end">${fdate(pts[pts.length-1].d)}</text>`;
  const dots=pts.map((p,i)=>`<circle cx="${x(i)}" cy="${y(p.v)}" r="${i===pts.length-1?4:2.5}" fill="${col}"><title>${fdate(p.d)}: ${nf(p.v,opt.dec??1)}${opt.u||''}</title></circle>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opt.label||'Gráfica')}">${grid}<polygon points="${x(0)},${H-B} ${line} ${x(pts.length-1)},${H-B}" fill="${col}" opacity=".12"/><polyline points="${line}" fill="none" stroke="${col}" stroke-width="2.2" stroke-linejoin="round"/>${dots}${lab}</svg>`;
}
const clientWeights=()=>{const W=allWeights();const a=FICHA.wFrom||'',b=FICHA.wTo||'';return W.filter(w=>(!a||w.date>=a)&&(!b||w.date<=b))};
const allWeights=()=>S.weights.concat(S.checkins.filter(c=>c.peso).map(c=>({date:c.date,peso:c.peso}))).sort((a,b)=>a.date.localeCompare(b.date));
const goodDir=d=>CLIENT.goal==='perder'?d<0:d>0;

// ---- buscador de recetas
const SRC={
  p:[['pollo','Pollo / pavo',/POLLO|PAVO/],['ternera','Ternera',/TERNERA/],['blanco','Pescado blanco',/PESCADO BLANCO|BACALAO|MERLUZA/],['azul','Salmón / pescado azul',/SALM|AZUL|CABALLA|SARDINA/],['atun','Atún',/AT[UÚ]N/],['huevo','Huevos / claras',/HUEVO|CLARAS/],['cerdo','Cerdo',/CERDO/],['embutido','Jamón / lomo',/JAM[OÓ]N|LOMO EMBUCHADO/]],
  f:[['aceite','AOVE',/ACEITE/],['aguacate','Aguacate',/AGUACATE/],['queso','Queso',/QUESO/],['fsecos','Frutos secos',/FRUTOS SECOS/],['aceitunas','Aceitunas',/ACEITUNAS/]],
  c:[['arroz','Arroz',/ARROZ/],['pasta','Pasta',/PASTA/],['patata','Patata / boniato',/PATATA|BONIATO/],['legumbre','Legumbres',/LEGUMBRE/],['pan','Pan',/\bPAN\b/],['tortilla','Tortillas',/TORTILLA/]]
};
function recipeHas(r,g,key){const def=SRC[g].find(x=>x[0]===key);const tag=(r.tags[g==='p'?0:g==='f'?1:2]||'').toUpperCase();return def[2].test(tag)}
function filtered(){return DATA.recipes.map((r,i)=>({r,i})).filter(({r})=>!/POSTRE/i.test(r.tags.join(' '))&&['p','f','c'].every(g=>!F[g]||recipeHas(r,g,F[g])))}

// ================= VISTA CLIENTE =================
function setView(v){view=v;setTimeout(()=>{if(typeof placeCalc==='function')placeCalc()});document.getElementById('vClient').classList.toggle('on',v==='client');document.getElementById('vCoach').classList.toggle('on',v==='coach');
  document.getElementById('clientView').hidden=v!=='client';document.getElementById('coachView').hidden=v!=='coach';if(v==='coach')renderCoach();else render();window.scrollTo(0,0)}
function go(t){tab=t;render();window.scrollTo(0,0)}
let R_BUSY=false;
function render(){if(R_BUSY)return void setTimeout(render);R_BUSY=true;try{_render()}finally{R_BUSY=false}}
function _render(){
  document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));
  const el=document.getElementById('screen');
  el.classList.toggle('restmode',(tab==='food')&&dayType==='R');
  el.innerHTML=({home:vHome,food:vFood,train:vTrain,check:vCheck,res:vRes,perfil:vPerfil})[tab]();
  if(tab==='perfil'){PK_AFTER=fillPk;fillPk()}
}

// ---- Aviso de revisión semanal (día que pones en la Ficha)
const DOW=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
function revInfo(){
  const di=DOW.indexOf(CLIENT.checkDay);const now=new Date();now.setHours(12,0,0,0);
  let diff=(di-now.getDay()+7)%7;const next=new Date(now);next.setDate(now.getDate()+diff);
  const since=new Date(now);since.setDate(now.getDate()-((now.getDay()-di+7)%7||0));
  const doneToday=S.checkins.some(c=>c.date===iso(now));
  const last=S.checkins.length?S.checkins[S.checkins.length-1].date:'';
  return {diff,next,doneToday,last};
}
function vRemind(){
  const r=revInfo();const fd=d=>d.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'short'});
  if(r.doneToday)return `<div class="remind done"><span class="ic">✅</span><div><b>Revisión enviada</b><small>Yaron ya tiene tu peso, medidas y fotos. La próxima: ${fd(new Date(r.next.getTime()+7*864e5))}.</small></div></div>`;
  if(r.diff===0)return `<div class="remind now"><span class="ic">📏</span><div><b>Hoy toca tu revisión</b><small>Peso en ayunas tras ir al baño, medidas con la cinta y fotos con la misma luz.</small></div><button class="btn sm" type="button" onclick="go('check')">Hacerla</button></div>`;
  if(r.diff===1)return `<div class="remind soon"><span class="ic">⏰</span><div><b>Mañana toca revisión</b><small>Pésate nada más levantarte, tras ir al baño y antes de comer o beber. Ten la cinta métrica a mano.</small></div></div>`;
  return `<div class="remind"><span class="ic">📅</span><div><b>Próxima revisión: ${fd(r.next)}</b><small>En ${r.diff} días · peso, medidas y fotos.</small></div></div>`;
}
// ---- Perfil y ajustes del cliente
function avHTML(cls=''){const f=S.profile.foto;return f?`<img src="${f}" alt="Foto de perfil de ${esc(CLIENT.name)}">`:esc(CLIENT.first[0]||'?')}
function pSet(k,v){S.profile[k]=v;save()}
function pName(k,v){FICHA[k]=v.trim();save()}
function pPhoto(inp){const f=inp.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');const z=256;c.width=c.height=z;const s=Math.min(im.width,im.height);c.getContext('2d').drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,z,z);S.profile.foto=c.toDataURL('image/jpeg',.82);save();toast('Foto actualizada');render()};im.src=rd.result};rd.readAsDataURL(f)}
async function pPass(){const a=document.getElementById('pw1').value,b=document.getElementById('pw2').value,c=document.getElementById('pw3').value;
  if(!a){toast('Escribe tu contraseña actual');return}if(b.length<8){toast('La nueva debe tener al menos 8 caracteres');return}if(b!==c){toast('Las contraseñas no coinciden');return}
  try{await db.signIn(ME.email,a)}catch(e){toast('La contraseña actual no es correcta');return}
  try{await db.setPassword(b);['pw1','pw2','pw3'].forEach(i=>document.getElementById(i).value='');toast('Contraseña cambiada')}catch(e){toast('No se ha podido cambiar: '+authMsg(e))}}
async function pForgot(){try{await db.resetPassword(ME.email);toast('Te hemos enviado un email para crear una contraseña nueva')}catch(e){toast(authMsg(e))}}
function pExport(){const d={nombre:CLIENT.name,email:FICHA.email,telefono:FICHA.tel,pesos:S.weights,checkins:S.checkins,diario:S.daily,entrenos:S.hist};
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(d,null,2)],{type:'application/json'}));a.download='mis-datos-yaronska.json';document.body.appendChild(a);a.click();a.remove()}
function vPerfil(){
  const p=S.profile;const sw=(k,l,s)=>`<label class="prow"><span>${l}${s?`<small>${s}</small>`:''}</span><input class="sw" type="checkbox" ${p[k]?'checked':''} onchange="pSet('${k}',this.checked)" aria-label="${esc(l)}"></label>`;
  const inp=(id,l,t,v,on)=>`<div class="field"><label for="${id}">${l}</label><input id="${id}" type="${t}" value="${esc(v||'')}" ${on?`onchange="${on}"`:''} autocomplete="off"></div>`;
  return `<div class="hello-row"><div class="hello"><span class="lbl">Tu cuenta</span><h1>Perfil y <em>ajustes</em></h1></div><button class="btn ghost sm" type="button" onclick="go('home')">← Inicio</button></div>
  <section class="pcard" style="align-items:center;text-align:center">
    <div class="me bigav">${avHTML()}</div>
    <label class="btn sm" style="cursor:pointer">${p.foto?'Cambiar foto':'Subir foto'}<input type="file" accept="image/*" hidden onchange="pPhoto(this)"></label>
    ${p.foto?`<button class="btn ghost sm" type="button" onclick="S.profile.foto='';save();render()">Quitar foto</button>`:''}
    <small class="muted">Yaron también la verá en su panel.</small>${ME.role==='coach'?'<small class="muted">(Estás viendo la app de este cliente como entrenador.)</small>':''}</section>
  <section class="pcard"><span class="lbl">Datos personales</span>
    ${inp('pn','Nombre y apellidos','text',FICHA.nombre,"pName('nombre',this.value);render()")}<div class="field"><label>Email de acceso</label><input value="${esc(ME.email||FICHA.email)}" disabled></div>${inp('pt','Teléfono / WhatsApp','tel',FICHA.tel,"pName('tel',this.value)")}
    <small class="muted">Para cambiar el email de acceso, escríbeme. Tu plan y tus fechas los gestiono yo.</small></section>
  <section class="pcard"><span class="lbl">Contraseña</span>
    ${inp('pw1','Contraseña actual','password','')}${inp('pw2','Nueva contraseña (mín. 8 caracteres)','password','')}${inp('pw3','Repite la nueva','password','')}
    <button class="btn" type="button" onclick="pPass()">Cambiar contraseña</button>
    <button class="btn ghost sm" type="button" onclick="pForgot()">He olvidado mi contraseña</button></section>
  <section class="pcard"><span class="lbl">Face ID / huella</span><div id="pkBox"><p class="small muted" style="margin:0">Cargando…</p></div></section>
  <section class="pcard"><span class="lbl">Recordatorios</span>
    ${sw('nCheck','Revisión semanal','El día anterior y el mismo '+CLIENT.checkDay.toLowerCase())}${sw('nDaily','Registro diario','Pasos, dieta, entreno y cómo te sientes')}${sw('nTrain','Días de entreno','Aviso con tu sesión del día')}
    <div class="field"><label for="ph">Hora de los avisos</label><input id="ph" type="time" value="${esc(p.hora)}" onchange="pSet('hora',this.value)"></div></section>
  <section class="pcard"><span class="lbl">Preferencias</span>
    <div class="field"><label for="pu">Unidades de peso</label><select id="pu" onchange="pSet('unid',this.value)" style="background:var(--surface);border:1px solid var(--line-2);border-radius:8px;padding:10px;color:var(--fg)"><option value="kg" ${p.unid==='kg'?'selected':''}>Kilos (kg)</option><option value="lb" ${p.unid==='lb'?'selected':''}>Libras (lb)</option></select></div></section>
  <section class="pcard"><span class="lbl">Privacidad</span>
    ${sw('consent','Acepto el tratamiento de mis datos de salud','Necesario para que Yaron pueda pautarte dieta y entreno')}
    <button class="btn ghost sm" type="button" onclick="pExport()">Descargar mis datos</button>
    <button class="btn ghost sm" type="button" onclick="window.open('https://wa.me/'+WA+'?text='+encodeURIComponent('Hola Yaron, quiero solicitar la baja del programa.'),'_blank')">Solicitar la baja del programa</button></section>
  <button class="btn ghost" type="button" onclick="logout()">Cerrar sesión</button>`;
}
function vHome(){
  const ph=phOf(FICHA,S.phase);const pct=Math.round(S.week/S.weeksPhase*100);
  const W=clientWeights();const first=W[0]||{peso:0},last=W[W.length-1]||{peso:0};const diff=last.peso-first.peso;const ok=goodDir(diff);
  return `<div class="hello-row"><div class="hello"><span class="lbl">${esc(CLIENT.program)}</span><h1>Hola, <em>${esc(CLIENT.first)}</em></h1></div><button class="me" type="button" onclick="go('perfil')" aria-label="Perfil y ajustes">${avHTML()}</button></div>
  ${vRemind()}
  <section class="wchart" aria-label="Tu evolución">
    <div class="sec-h"><span class="lbl">Tu evolución · peso</span><span class="small muted">Objetivo: ${CLIENT.goal==='perder'?'perder grasa':'ganar músculo'}</span></div>
    ${!W.length?`<p class="small muted" style="margin:0">Aquí verás tu evolución en cuanto envíes tu primer check-in con tu peso.</p>`:`<div class="wstats"><div><small>${FICHA.wFrom?'Desde '+fdate(first.date):'Inicio'}</small><b>${nf(first.peso)} kg</b></div><div><small>Ahora</small><b>${nf(last.peso)} kg</b></div><div><small>Cambio</small><b class="${ok?'good':'badc'}">${diff>0?'+':''}${nf(diff)} kg</b></div></div>
    ${lineChart(W.map(w=>({d:w.date,v:w.peso})),{u:' kg',label:'Evolución del peso',color:ok?'#7CE38B':'#FFD60A'})}
    <div class="verdict ${ok?'':'no'}">${ok?`Vas en la dirección correcta: ${nf(Math.abs(diff))} kg ${diff<0?'menos':'más'} desde que empezaste.`:'Esta semana toca ajustar: lo vemos en la revisión.'}</div>`}
  </section>
  ${vDaily()}
  <section class="phase" aria-label="Fase actual">
    <div class="phase-top"><span class="lbl">${PROG().w} ${Math.min(S.phase,PH().length-1)+1} de ${PH().length}</span><span class="small muted">Semana ${S.week} de ${S.weeksPhase}</span></div>
    <h2>${esc(ph.n)}</h2><div class="bar"><span style="width:${pct}%"></span></div>
    <div class="steps3">${PH().map((p,i)=>`<div class="${i<S.phase?'done':i===S.phase?'now':''}">${i+1} · ${esc(p.n)}</div>`).join('')}</div>
  </section>
  <a class="wa-btn" href="https://wa.me/${WA}?text=${encodeURIComponent('¡Hola Yaron! Tengo una duda: ')}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.6 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.1.3.6 1 1.4 1.7 1 .9 1.8 1.1 2.1 1.3.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l2 .9c.3.1.4.2.5.3.1.2.1.8-.2 1.5z"/></svg><span>¿Dudas? Escríbeme por WhatsApp<small>Sin horarios · te respondo lo antes posible</small></span></a>`;
}
function vDaily(){
  const k=iso(new Date());const d=S.daily[k]||{};const t=Object.assign({steps:'',diet:null,train:null,stepsOk:null,estres:0,energia:0,animo:0},d,today);
  const isTrain=CLIENT.trainDays.includes(new Date().getDay());
  const week=[6,5,4,3,2,1,0].map(i=>{const dd=daysAgo(i);const v=S.daily[iso(dd)];let c='';if(v){const n=[v.diet,v.train===null?true:v.train,v.stepsOk].filter(Boolean).length;c=n===3?'full':n>0?'part':''}return `<span>${'DLMXJVS'[dd.getDay()]}<em class="${c}">${v?(c==='full'?'✓':'·'):''}</em></span>`}).join('');
  const tg=(key,ico,lbl)=>`<button type="button" class="tg ${t[key]?'on':''}" onclick="today.${key}=!(${JSON.stringify(!!t[key])});render()" aria-pressed="${!!t[key]}"><i>${t[key]?'✓':ico}</i>${lbl}</button>`;
  const mini=(key,lbl)=>`<span>${lbl}</span><div class="dots">${[1,2,3,4,5].map(n=>`<button type="button" class="${t[key]===n?'on':''}" onclick="today.${key}=${n};render()" aria-label="${lbl} ${n}">${n}</button>`).join('')}</div>`;
  return `<section class="daily" aria-label="Objetivos de hoy">
    <div class="daily-h"><h2>Hoy</h2><span class="small muted">${new Date().toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})} · ${isTrain?'día de entreno':'día de descanso'}</span></div>
    <div class="stepsrow"><div class="field"><label for="dSteps">Pasos de hoy${CLIENT.stepsGoal?` · objetivo ${CLIENT.stepsGoal.toLocaleString('es-ES')} (${isTrain?'día de entreno':'día de descanso'})`:''}</label><input id="dSteps" inputmode="numeric" placeholder="Ej. 8.500" value="${esc(t.steps)}" oninput="today.steps=this.value.replace(/\\D/g,'');today.stepsOk=${CLIENT.stepsGoal?'(+today.steps)>='+CLIENT.stepsGoal:'(+today.steps)>0'}"></div></div>
    <div class="toggles">${tg('diet','🍽','Dieta')}${tg('train','🏋',isTrain?'Entreno':'Descanso ok')}${tg('stepsOk','👟','Pasos')}</div>
    <div class="mini">${mini('estres','Estrés')}${mini('energia','Energía')}${mini('animo','Ánimo')}</div>
    <p class="small muted" style="margin:0">1 = muy mal · 5 = genial</p>
    <button class="btn" type="button" onclick="saveDaily()">OK, guardar mi día</button>
    <div class="week" aria-label="Últimos 7 días">${week}</div>
  </section>`;
}
function saveDaily(){const k=iso(new Date());const prev=S.daily[k]||{};const v=Object.assign({steps:'',diet:false,train:false,stepsOk:false,estres:0,energia:0,animo:0},prev,today);v.steps=+v.steps||0;S.daily[k]=v;today={};save();toast('Día guardado');render()}
function vFood(){
  if(!S.planOn)return `<div class="hello"><span class="lbl">Alimentación</span><h1>Tus <em>comidas</em></h1></div><div class="empty">Tu plan aparecerá aquí en cuanto Yaron lo prepare.</div>`;
  if(!S.restOn)dayType='T';
  return `<div class="hello"><span class="lbl">Alimentación</span><h1>Tus <em>comidas</em></h1></div>
  ${S.restOn?`<div class="daytype" role="radiogroup" aria-label="Tipo de día"><button type="button" class="t ${dayType==='T'?'on':''}" onclick="dayType='T';render()" aria-pressed="${dayType==='T'}"><b>🏋️ Día de entreno</b><small>Comes un poco más</small></button><button type="button" class="r ${dayType==='R'?'on':''}" onclick="dayType='R';render()" aria-pressed="${dayType==='R'}"><b>🏠 Día de descanso</b><small>Comes un poco menos</small></button></div>`:''}
  <div class="tabs" role="tablist"><button type="button" class="${foodTab==='plan'?'on':''}" onclick="foodTab='plan';render()">Mi plan</button><button type="button" class="${foodTab==='recetas'?'on':''}" onclick="foodTab='recetas';render()">Recetas</button></div>
  ${foodTab==='plan'?vPlan():vRecipes()}`;
}
const nearK=k=>Math.min(3200,Math.max(1300,Math.round(k/50)*50));
const kT=()=>S.kcal,kR=()=>S.restOn?S.kcal-250:S.kcal;
const VAR=()=>S.planCalc?(dayType==='R'&&S.planCalc.R?S.planCalc.R:S.planCalc.T):DATA.V[nearK(dayType==='R'&&S.restOn?kR():kT())];
const PLAN=()=>VAR().plan;
function optMeal(m,t){if(!m||(!m.options.length&&!m.note))return '';
  return `<section class="sec-h"><h2>${esc(t)}</h2></section>${m.options.length?`<div class="hscroll">${m.options.map(b=>`<article class="bfc"><h3>${esc(b.name)}</h3><ul>${b.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>${b.notes?`<p class="small muted" style="margin:6px 0 0">${esc(b.notes)}</p>`:''}</article>`).join('')}</div>`:''}${m.note?`<div class="band">${esc(m.note)}</div>`:''}`}
function vPlan(){
  const P=PLAN(),m=P[meal];const list=arr=>`<div class="opts">${arr.map(t=>`<div>${esc(t)}</div>`).join('')}</div>`;
  return `<section class="sec-h"><h2>Desayunos</h2><span class="dtag">${dayType==='R'?'Descanso':'Entreno'}</span></section>
  <div class="hscroll">${P.breakfast.map(b=>`<article class="bfc"><h3>${esc(b.name)}</h3><ul>${b.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>${b.notes?`<p class="small muted" style="margin:6px 0 0">${esc(b.notes)}</p>`:''}</article>`).join('')}</div>
  ${P.bfNote?`<p class="small muted" style="margin:0">${esc(P.bfNote)}</p>`:''}
  ${optMeal(P.midmorning,'Almuerzo / post entreno')}${optMeal(P.snack,'Merienda')}
  <div class="tabs"><button type="button" class="${meal==='lunch'?'on':''}" onclick="meal='lunch';render()">Comida</button><button type="button" class="${meal==='dinner'?'on':''}" onclick="meal='dinner';render()">Cena</button></div>
  <p class="small muted" style="margin:0">Elige <b style="color:var(--fg)">una opción de cada</b>: proteína + grasa + hidrato. Todas valen lo mismo.</p>
  <div class="macro"><div class="macro-h"><span class="pill p-prot">Proteína</span></div>${list(m.protein)}</div>
  <div class="macro"><div class="macro-h"><span class="pill p-fat">Grasa</span></div>${list(m.fat)}</div>
  <div class="macro"><div class="macro-h"><span class="pill p-carb">Hidratos</span></div>${list(m.carb)}</div>
  <div class="band"><b style="color:var(--ok)">Añade siempre verdura</b>${esc((m.vegs&&m.vegs.length?m.vegs.slice(0,8).join(' · '):m.veg||'Verdura al gusto'))}</div>
  ${m.fruit&&m.fruit.length?`<div class="band fruit"><b class="y">Postre · fruta a elegir</b>${esc(m.fruit.join(' · '))}</div>`:''}`;
}
function vRecipes(){
  const res=filtered();
  const chips=(g,cls)=>SRC[g].map(([k,l])=>`<button type="button" class="chip ${cls} ${F[g]===k?'on':''}" onclick="F.${g}=F.${g}==='${k}'?null:'${k}';render()">${esc(l)}</button>`).join('');
  return `<section class="finder" aria-label="Buscador de recetas">
    <div><span class="lbl">1 · ¿Qué proteína te apetece?</span><div class="chips" style="margin-top:7px">${chips('p','')}</div></div>
    <div><span class="lbl">2 · ¿Y de grasa?</span><div class="chips" style="margin-top:7px">${chips('f','f')}</div></div>
    <div><span class="lbl">3 · ¿Y de hidrato?</span><div class="chips" style="margin-top:7px">${chips('c','c')}</div></div>
  </section>
  <div class="sec-h"><span class="count">${res.length} receta${res.length===1?'':'s'} · cantidades de <b style="color:${dayType==='R'?'var(--ok)':'var(--y)'}">${dayType==='R'?'día de descanso':'día de entreno'}</b></span>${F.p||F.f||F.c?`<button class="btn ghost sm" type="button" onclick="F={p:null,f:null,c:null};render()">Quitar filtros</button>`:''}</div>
  ${res.length?`<div class="rgrid">${res.map(({r,i})=>`<button class="rcard" type="button" onclick="openRecipe(${i})"><img src="${PHOTO(i)}" alt="${esc(r.t)}" loading="lazy"><div><b>${esc(r.t)}</b><small>⏱ ${esc(r.time)}</small></div></button>`).join('')}</div>`
  :`<div class="empty">No hay recetas con esa combinación exacta. Quita uno de los filtros para ver más.</div>`}`;
}
function openRecipe(i){
  const r=DATA.recipes[i];const sh=document.getElementById('sheet');const ing=VAR().ing[i].map(x=>({h:x[0],c:x[1]}));
  sh.innerHTML=`<div class="sheet-in ${dayType==='R'?'restmode':''}" role="dialog" aria-label="${esc(r.t)}"><div class="sheet-img"><img src="${PHOTO(i)}" alt=""><button class="sheet-x" type="button" aria-label="Cerrar" onclick="closeSheet()">×</button></div>
  <div class="sheet-b"><div class="row"><span class="lbl">⏱ ${esc(r.time)}</span><span class="dtag">${dayType==='R'?'🏠 Día de descanso':'🏋️ Día de entreno'}</span></div><h2>${esc(r.t)}</h2>
  <div class="row">${r.tags.map((t,k)=>`<span class="pill ${['p-prot','p-fat','p-carb'][k]||'p-carb'}">${esc(t)}</span>`).join('')}</div>
  <span class="lbl">Ingredientes · cantidades de tu plan</span><ul class="ilist">${ing.map(x=>`<li class="${x.c}">${x.h}</li>`).join('')}</ul>
  <span class="lbl">Preparación</span><ol class="slist">${r.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
  ${r.note?`<div class="note"><b class="y">Nota · </b>${esc(r.note)}</div>`:''}</div></div>`;
  sh.hidden=false;sh.onclick=e=>{if(e.target===sh)closeSheet()};
}
function closeSheet(){document.getElementById('sheet').hidden=true}
// Progresión: si la semana pasada llegó al tope de reps en todas las series → +2,5 kg; si no, mismo peso y +1 rep
// ---- series detalladas (top set, back-off…) y bloques (superseries, biseries…)
const SET_T=[['','Normal'],['aprox','Aproximación'],['top','Top set'],['backoff','Back-off'],['drop','Drop set'],['rp','Rest-pause'],['amrap','AMRAP'],['myo','Myo-reps'],['cluster','Cluster']];
const SET_S={aprox:'Aprox',top:'Top',backoff:'B-off',drop:'Drop',rp:'R-P',amrap:'AMRAP',myo:'Myo',cluster:'Clust'};
const BLK_T=[['superserie','Superserie'],['biserie','Biserie'],['triserie','Triserie'],['circuito','Circuito'],['gigante','Serie gigante']];
const BLK_L='ABCDEFGH'.split('');
const blkName=t=>(BLK_T.find(x=>x[0]===t)||['','Bloque'])[1];
function exSets(e){const a=[];for(let i=0;i<e.s;i++){const x=(e.sets||[])[i]||{};a.push({t:x.t||'',reps:x.reps||e.r,rpe:x.rpe||e.rir,rest:x.rest||e.rest,nota:x.nota||''})}return a}
const detailed=e=>{const a=exSets(e);return a.some(x=>x.t||x.nota)||new Set(a.map(x=>x.reps+'|'+x.rpe+'|'+x.rest)).size>1};
function blocksOf(ex){const out=[];let cur=null;ex.forEach((e,ei)=>{if(e.blk&&cur&&cur.letter===e.blk)cur.items.push({e,ei});else{cur={letter:e.blk||'',type:e.blkT||'',items:[{e,ei}]};out.push(cur)}});
  let n=0;out.forEach(b=>{n++;b.items.forEach((it,k)=>{it.label=b.letter&&b.items.length>1?b.letter+(k+1):String(n)})});return out}
const rpeTxt=e=>{const u=[...new Set(exSets(e).map(x=>x.rpe))].filter(Boolean);return u.length>1?u[0]+' → '+u.slice(1).map(x=>String(x).replace('RPE ','')).join(' → '):(u[0]||e.rir||'')};
function suggestion(e){
  if(/ s$/.test(e.r))return null;
  const h=(S.hist[e.n]||[]);const last=h[h.length-1];if(!last||!last.sets.length)return null;
  const top=parseInt(String(e.r).split('-').pop())||10;const kg=Math.max(...last.sets.map(s=>s.kg));
  const done=last.sets.every(s=>s.reps>=top);
  return done?{kg:kg+(kg>=20?2.5:1),txt:`${e.r} reps`,why:'Llegaste al tope de repeticiones: sube peso'}:{kg,txt:`intenta +1 rep por serie`,why:'Mismo peso, busca una repetición más'};
}
function exCard(e,ei,label){
  const h=S.hist[e.n]||[];const last=h[h.length-1];const det=detailed(e);const sg=det?null:suggestion(e);const SS=exSets(e);const nx=S.next[e.n];
  return `<article class="ex"><div class="ex-h"><span class="ex-n">${esc(label)}</span><div><b>${esc(e.n)}</b><small>${esc(e.m)}</small></div><a class="vid" href="${esc(e.v||yt(e.n))}" target="_blank" rel="noopener">▶ Vídeo</a></div>
    ${det?`<ol class="setplan">${SS.map((x,i)=>`<li><span class="sn">${i+1}</span>${x.t?`<em class="stag t-${x.t}">${esc((SET_T.find(t=>t[0]===x.t)||['',''])[1])}</em>`:''}<span>${esc(x.reps)}${/ s$/.test(x.reps)?'':' reps'}${x.rpe?' · '+esc(x.rpe):''}${x.rest?' · desc. '+esc(x.rest):''}</span>${x.nota?`<small>${esc(x.nota)}</small>`:''}</li>`).join('')}</ol>`
      :`<div class="presc"><span>${e.s} series</span><span>${esc(e.r)}${/ s$/.test(e.r)?'':' reps'}</span><span>${esc(rpeTxt(e))}</span><span>Descanso ${esc(e.rest)}</span></div>`}
    ${e.aprox?`<div class="aprox"><b>Series de aproximación</b><span>${esc(e.aprox)}</span></div>`:''}
    ${nx&&nx.sets?`<div class="target" style="border-color:var(--ok);background:rgba(124,227,139,.08);flex-direction:column;align-items:stretch;gap:4px"><span>Pautado por Yaron${nx.nota?' · <small class="muted">'+esc(nx.nota)+'</small>':''}</span>${nx.sets.map((x,i)=>x.kg||x.reps||x.int?`<b style="color:var(--ok);font-size:13px">Serie ${i+1}${SS[i]&&SS[i].t?' · '+esc(SET_S[SS[i].t]||''):''}: ${[x.kg?esc(x.kg)+' kg':'',x.reps?'× '+esc(x.reps):'',x.int?'· '+esc(x.int):''].filter(Boolean).join(' ')}</b>`:'').join('')}</div>`
    :nx?`<div class="target" style="border-color:var(--ok);background:rgba(124,227,139,.08)"><span>Pautado por Yaron${nx.nota?' · <small class="muted">'+esc(nx.nota)+'</small>':''}</span><b style="color:var(--ok)">${[nx.kg?esc(nx.kg)+' kg':'',nx.reps?'× '+esc(nx.reps):'',nx.int?'· '+esc(nx.int):''].filter(Boolean).join(' ')}</b></div>`:sg?`<div class="target"><span>Objetivo hoy · <small class="muted">${esc(sg.why)}</small></span><b>${nf(sg.kg,1).replace(',0','')} kg · ${esc(sg.txt)}</b></div>`:''}
    <div class="sets2"><span class="h">#</span><span class="h">Semana pasada</span><span class="h">Kg</span><span class="h">Reps</span><span class="h">RIR real</span>
    ${SS.map((x,si)=>{const p=last&&(last.sets.find(z=>z.i===si)||(last.sets[si]&&last.sets[si].i===undefined?last.sets[si]:null));return `<span class="sidx">${si+1}${x.t&&SET_S[x.t]?`<small>${SET_S[x.t]}</small>`:''}</span><span class="prev">${p?`${nf(p.kg,1).replace(',0','')} kg × ${p.reps}<br>RIR ${p.rir??'—'}`:'—'}</span><input id="kg-${dayIdx}-${ei}-${si}" inputmode="decimal" placeholder="${nx&&nx.sets&&nx.sets[si]&&nx.sets[si].kg?esc(nx.sets[si].kg):nx&&nx.kg?esc(nx.kg):p?nf(p.kg,1).replace(',0',''):'kg'}" aria-label="Kilos serie ${si+1}"><input id="rp-${dayIdx}-${ei}-${si}" inputmode="numeric" placeholder="${p?p.reps:'reps'}" aria-label="Repeticiones serie ${si+1}"><input id="ri-${dayIdx}-${ei}-${si}" inputmode="numeric" placeholder="RIR" aria-label="RIR real serie ${si+1}">`}).join('')}</div>
    ${last?`<div class="small muted">Última sesión: ${fdate(last.date)}</div>`:''}</article>`;
}
function vTrain(){
  const R=S.routine;if(!R.length)return `<div class="hello"><span class="lbl">Entrenamiento</span><h1>Tu <em>rutina</em></h1></div><div class="empty">Tu rutina aparecerá aquí en cuanto Yaron te la asigne.</div>`;if(dayIdx>=R.length)dayIdx=0;const d=R[dayIdx];
  return `<div class="hello"><span class="lbl">Entrenamiento</span><h1>Tu <em>rutina</em></h1></div>
  <div class="daysel">${R.map((r,i)=>`<button type="button" class="chip ${i===dayIdx?'on':''}" onclick="dayIdx=${i};render()">${esc(r.d.split('·')[0].trim())}</button>`).join('')}</div>
  <h2 style="font-size:19px">${esc(d.d)}</h2>
  ${d.warm&&(d.warm.txt||d.warm.url)?`<article class="warm"><div class="ex-h"><span class="ex-n">🔥</span><div><b>Calentamiento</b>${d.warm.txt?`<small style="white-space:pre-line">${esc(d.warm.txt)}</small>`:''}</div>${d.warm.url?`<a class="vid" href="${esc(d.warm.url)}" target="_blank" rel="noopener">▶ Vídeo</a>`:''}</div></article>`:''}
  ${blocksOf(d.ex).map(b=>b.letter&&b.items.length>1?`<section class="blk"><div class="blk-h"><b>${esc(blkName(b.type))} ${esc(b.letter)}</b><small>Haz ${b.items.map(x=>x.label).join(' + ')} seguidos, sin descanso entre ejercicios. Descansa ${esc(b.items[b.items.length-1].e.rest||'')} al acabar cada ronda.</small></div>${b.items.map(x=>exCard(x.e,x.ei,x.label)).join('')}</section>`:b.items.map(x=>exCard(x.e,x.ei,x.label)).join('')).join('')}
  <button class="btn" type="button" onclick="saveSession()">Guardar entreno</button>`;
}
function saveSession(){
  const d=S.routine[dayIdx];let any=false;const date=iso(new Date());
  d.ex.forEach((e,ei)=>{const sets=[];const SS=exSets(e);for(let si=0;si<e.s;si++){const g=id=>document.getElementById(id).value.replace(',','.');const kg=parseFloat(g(`kg-${dayIdx}-${ei}-${si}`)),reps=parseInt(g(`rp-${dayIdx}-${ei}-${si}`)),rir=parseInt(g(`ri-${dayIdx}-${ei}-${si}`));if(kg>=0&&reps>0){const o={kg,reps,rir:isNaN(rir)?null:rir,i:si};if(SS[si].t)o.t=SS[si].t;sets.push(o)}}
    if(sets.length){any=true;(S.hist[e.n]=S.hist[e.n]||[]).push({date,day:d.d,sets,ts:Date.now()});delete S.next[e.n]}});
  if(!any){toast('Apunta al menos una serie (kg y reps)');return}
  const k=iso(new Date());S.daily[k]=Object.assign({steps:0,diet:false,stepsOk:false,estres:0,energia:0,animo:0},S.daily[k]||{},{train:true});
  save();toast('Entreno guardado');render();
}
function vCheck(){
  return `<div class="hello"><span class="lbl">Revisión semanal · ${esc(CLIENT.checkDay)}</span><h1>Tu <em>check-in</em></h1></div>
  <form class="form" onsubmit="sendCheck(event)">
    <span class="lbl">Peso y medidas</span>
    <div class="mgrid">${MEAS.map(([k,l,u])=>`<div class="field"><label for="m-${k}">${l} (${u})</label><input id="m-${k}" inputmode="decimal" ${k==='peso'?'required':''}></div>`).join('')}</div>
    <p class="small muted" style="margin:-4px 0 0">Mídete siempre igual: en ayunas, mismo día y misma hora. Si tienes dudas, mira la Guía de medidas en Recursos.</p>
    <span class="lbl">Cómo ha ido la semana</span>
    ${SCALES.map(s=>{const v=ck[s.k];return `<div class="sel ${v?'done':''}"><label for="s-${s.k}">${s.t}</label><select id="s-${s.k}" onchange="ck.${s.k}=+this.value;this.closest('.sel').classList.add('done');this.nextElementSibling.textContent=SCALES.find(x=>x.k==='${s.k}').o[this.value-1]"><option value="">Elige del 1 al 5…</option>${s.o.map((o,i)=>`<option value="${i+1}" ${v===i+1?'selected':''}>${i+1} · ${esc(o.split(/[:.]/)[0])}</option>`).join('')}</select><p>${v?esc(s.o[v-1]):'1 = peor · 5 = mejor. Al elegir verás la descripción completa.'}</p></div>`}).join('')}
    <div class="sel ${ck.orina?'done':''}"><label>Hidratación · color de tu orina</label>
      <div class="urine" role="radiogroup" aria-label="Color de la orina">${URINE.map(([c,n])=>`<button type="button" style="background:${c}" class="${ck.orina===+n?'on':''}" onclick="ck.orina=${n};this.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('on'));this.classList.add('on');document.getElementById('urTxt').textContent=urineTxt(${n});this.closest('.sel').classList.add('done')" aria-label="Color ${n}">${n}</button>`).join('')}</div>
      <div class="ulegend"><span><b class="good">1-3 · Hidratado</b>Sigue así.</span><span><b style="color:var(--warn)">4-5 · Algo deshidratado</b>Bebe un poco más durante el día.</span><span><b class="badc">6-8 · Deshidratado</b>Bebe agua ya, sí o sí.</span></div>
      <p id="urTxt">${ck.orina?urineTxt(ck.orina):'Fíjate en el color a lo largo de la semana (no en la primera de la mañana).'}</p></div>
    <div><span class="lbl">Fotos de la semana</span><div class="photos" style="margin-top:8px">${['Frontal','Lateral','Espalda'].map((t,i)=>`<label class="ph"><span style="font-size:20px">＋</span>${t}<input type="file" accept="image/*" onchange="pickPhoto(this)" aria-label="Foto ${t}"></label>`).join('')}</div><p class="lock" style="margin:6px 0 0">🔒 Solo las vemos tú y yo.</p></div>
    <div class="field"><label for="ckNota">¿Cómo ha ido la semana? Lo mejor, lo más difícil, dudas…</label><textarea id="ckNota"></textarea></div>
    <button class="btn" type="submit">Enviar check-in</button>
  </form>`;
}
function urineTxt(n){return n<=3?'Hidratado: vas bien.':n<=5?'Algo deshidratado: bebe un poco más durante el día.':'Deshidratado: bebe agua ya, sí o sí.'}
function pickPhoto(inp){const f=inp.files[0];if(!f)return;inp.closest('.ph')._file=f;const r=new FileReader();r.onload=()=>{const lab=inp.closest('.ph');let img=lab.querySelector('img');if(!img){img=document.createElement('img');img.alt='';lab.prepend(img)}img.src=r.result;lab.dataset.ok=1};r.readAsDataURL(f)}
async function sendCheck(e){
  e.preventDefault();const btn=e.target.querySelector('button[type=submit]');
  const m={};MEAS.forEach(([k])=>{const v=parseFloat(document.getElementById('m-'+k).value.replace(',','.'));if(!isNaN(v))m[k]=v});
  const labs=[...document.querySelectorAll('.ph')].filter(l=>l._file);const date=iso(new Date());const paths=[];
  btn.disabled=true;btn.textContent='Enviando…';
  try{for(let i=0;i<labs.length;i++){const blob=await shrink(labs[i]._file,1600);const path=`${CUR.id}/${date}/${['frontal','lateral','espalda'][[...document.querySelectorAll('.ph')].indexOf(labs[i])]||i}-${Date.now()}.jpg`;await db.uploadPhoto(path,blob);paths.push(path)}}
  catch(err){btn.disabled=false;btn.textContent='Enviar check-in';toast('No se han podido subir las fotos. Revisa tu conexión e inténtalo de nuevo.');return}
  S.checkins.push(Object.assign({date,fotos:paths.length,fotosP:paths,nota:document.getElementById('ckNota').value,r:Object.assign({},ck)},m));
  save();ck={};toast('Check-in enviado a Yaron');go('home');
}
function shrink(file,max){return new Promise((res,rej)=>{const im=new Image();im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height));const c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);c.toBlob(b=>b?res(b):rej(new Error('foto')),'image/jpeg',.85);URL.revokeObjectURL(im.src)};im.onerror=rej;im.src=URL.createObjectURL(file)})}
function vRes(){
  return `<div class="hello"><span class="lbl">Recursos</span><h1>Tus <em>guías</em></h1></div>
  <div class="rlist">${RESOURCES.map(r=>`<a class="ritem" href="${r.u}" target="_blank" rel="noopener"><span class="ic">${r.k}</span><div><b>${esc(r.t)}</b><small>${esc(r.d)}</small></div></a>`).join('')}</div>
  <section class="sec-h"><h2>Tu programa</h2><span class="small muted">${esc(PROG().t)}</span></section>
  <div class="rlist">${PH().map((p,i)=>`<div class="ritem ${i===S.phase?'now':''}"><span class="ic o">0${i+1}</span><div><b>${esc(p.n)}${i===S.phase?' <span class="dtag">Ahora</span>':''}</b><small>${esc(p.d)}</small></div></div>`).join('')}</div>`;
}

// ================= PANEL ENTRENADOR =================
// ---- lista de clientes del entrenador (datos reales)
function statusOf(last){if(!last)return {st:'warn',t:'Sin check-ins'};const d=Math.round((new Date(iso(new Date())+'T12:00')-new Date(last+'T12:00'))/864e5);return d<=8?{st:'ok',t:'Al día'}:d<=15?{st:'warn',t:'Check-in pendiente'}:{st:'bad',t:d+' días sin check-in'}}
async function refreshList(){
  const {clients,admin,checkins}=await db.listClients();
  const A={};admin.forEach(a=>A[a.client_id]=a);const L={};checkins.forEach(c=>{if(!L[c.client_id])L[c.client_id]=c.fecha});
  CL=clients.map(c=>{const a=A[c.id]||{};const f=c.ficha||{};
    return {id:c.id,email:c.email,ficha:f,linked:!!c.user_id,name:(f.nombre||'').trim()||c.email,foto:(c.prefs||{}).foto||'',fase:c.fase,semana:c.semana,
      renov:nextRenewal({renov:a.renovacion||'',tipo:a.tipo||'',alta:a.alta||''}),estado:a.estado||'active',...statusOf(L[c.id])}});
}
function coachItem(s){
  const live=CUR&&s.id===CUR.id;const name=live?CLIENT.name:s.name;const foto=live?S.profile.foto:s.foto;
  const ren=live?nextRenewal(FICHA):s.renov;const fase=live?S.phase:s.fase,sem=live?S.week:s.semana;
  return `<button type="button" class="citem ${s.id===coachSel?'on':''}" onclick="selectClient('${s.id}')"><span class="av">${foto?`<img src="${foto}" alt="">`:esc((name[0]||'?').toUpperCase())}</span><div><b>${esc(name)}</b><small>${esc(phOf(live?FICHA:s.ficha,fase).n)} · sem ${sem}</small>${ren?`<small style="display:block">Renueva: ${new Date(ren+'T12:00').toLocaleDateString('es-ES',{day:'numeric',month:'short'})}</small>`:''}</div><span class="st ${s.linked?s.st:'warn'}">${!s.linked?'Sin activar':s.st==='ok'?'Al día':s.st==='warn'?'Pendiente':'Revisar'}</span></button>`;
}
async function selectClient(id){
  if(CUR&&id===CUR.id)return;
  try{await flushSync()}catch(e){}
  coachSel=id;document.querySelector('.cmain').innerHTML='<p class="muted">Cargando…</p>';
  try{await loadClient(id)}catch(e){toast('No se ha podido cargar el cliente');console.error(e)}
  renderCoach();
}
let RC_BUSY=false;
function renderCoach(){if(RC_BUSY)return void setTimeout(renderCoach);RC_BUSY=true;try{_renderCoach()}finally{RC_BUSY=false}}
function _renderCoach(){setTimeout(placeCalc);
  const el=document.getElementById('coachView');
  const T=[['ficha','Ficha'],['dieta','Dieta'],['peso','Peso'],['sesiones','Sesiones'],['ejercicios','Ejercicios'],['diario','Diario'],['checkins','Check-ins'],['rutina','Rutina']];
  const c=CL.find(x=>CUR&&x.id===CUR.id);
  el.innerHTML=`<div class="coach">
  <aside class="clist" aria-label="Clientes"><span class="lbl">Tus clientes · ${CL.length}</span>
    ${CL.map(coachItem).join('')}
    <button class="btn ghost sm" type="button" onclick="openInvite()">+ Nuevo cliente</button>
    <button class="btn ghost sm" type="button" onclick="openImport()">⇪ Importar de la Calculadora</button>
  </aside>
  <section class="cmain">
    ${!c?`<div class="panel"><span class="lbl">Empieza aquí</span><p style="margin:0">Todavía no tienes clientes en la app. Pulsa <b>+ Nuevo cliente</b>, pon su nombre y su email, y envíale el mensaje con el enlace.</p></div>`:`
    <div class="chead"><div><span class="lbl">${esc(PROG().t)} · ${esc(phOf(FICHA,S.phase).n)} · semana ${S.week} de ${S.weeksPhase}</span><h1>${esc(CLIENT.name)}</h1>${!c.linked?`<small class="muted">Aún no ha creado su cuenta · <button class="linkbtn" type="button" onclick="inviteMsg('${c.id}')">Reenviar invitación</button></small>`:''}</div><span class="st ${c.st}">${esc(c.t)}</span></div>
    <div class="panel"><span class="lbl">Programa, fase y semana · lo cambias tú cuando quieras</span><div class="range">
      <div class="field" style="flex:2"><label for="prS">Programa</label><select id="prS" onchange="FICHA.programa=this.value;S.phase=0;save();setTimeout(renderCoach)">${Object.entries(PROGS).map(([k,p])=>`<option value="${k}" ${progKey()===k?'selected':''}>${esc(p.t)}</option>`).join('')}</select></div>
      <div class="field" style="flex:2"><label for="phS">${PROG().w}</label><select id="phS" onchange="S.phase=+this.value;save();setTimeout(renderCoach)">${PH().map((p,i)=>`<option value="${i}" ${S.phase===i?'selected':''}>${PROG().w} ${i+1} · ${esc(p.n)}</option>`).join('')}</select></div>
      <div class="field"><label for="wkS">Semana actual</label><input id="wkS" type="number" min="1" max="52" value="${S.week}" onchange="S.week=Math.max(1,+this.value||1);if(S.week>S.weeksPhase)S.weeksPhase=S.week;save();setTimeout(renderCoach)"></div>
      <div class="field"><label for="wtS">Semanas de esta fase</label><input id="wtS" type="number" min="1" max="52" value="${S.weeksPhase}" onchange="S.weeksPhase=Math.max(S.week,+this.value||1);save();setTimeout(renderCoach)"></div></div>
      <p class="small muted" style="margin:0">Alarga o acorta la fase cambiando «Semanas de esta fase». El cliente lo ve al momento en su Inicio.</p></div>
    <div class="tabs">${T.map(([k,l])=>`<button type="button" class="${coachTab===k?'on':''}" onclick="coachTab='${k}';renderCoach()">${l}</button>`).join('')}</div>
    ${({ficha:cFicha,dieta:cDieta,peso:cPeso,sesiones:cSes,ejercicios:cEj,diario:cDiario,checkins:cChecks,rutina:cRutina,plan:cDieta})[coachTab]()}`}
  </section></div>`;
}
// ---- dar de alta un cliente nuevo
function openInvite(){
  const sh=document.getElementById('sheet');
  sh.innerHTML=`<div class="sheet-in" role="dialog" aria-label="Nuevo cliente"><div class="sheet-b"><div class="row" style="justify-content:space-between"><h2>Nuevo cliente</h2><button class="btn ghost sm" type="button" onclick="closeSheet()">Cerrar</button></div>
    <form class="form" onsubmit="createClient(event)">
      <div class="field"><label for="nN">Nombre y apellidos</label><input id="nN" required autocomplete="off"></div>
      <div class="field"><label for="nE">Email (con el que creará su cuenta)</label><input id="nE" type="email" required autocomplete="off"></div>
      <div class="field"><label for="nT">Teléfono / WhatsApp (opcional)</label><input id="nT" type="tel" placeholder="+34 600 000 000" autocomplete="off"></div>
      <div class="field"><label for="nO">Objetivo</label><select id="nO" style="background:var(--surface);border:1px solid var(--line-2);border-radius:8px;padding:10px;color:var(--fg)"><option value="perder">Perder grasa</option><option value="ganar">Ganar músculo</option></select></div>
      <button class="btn" type="submit">Dar de alta</button></form></div></div>`;
  sh.hidden=false;sh.onclick=e=>{if(e.target===sh)closeSheet()};document.getElementById('nN').focus();
}
async function createClient(e){
  e.preventDefault();const b=e.target.querySelector('button[type=submit]');
  const nombre=document.getElementById('nN').value.trim(),email=document.getElementById('nE').value.trim().toLowerCase(),tel=document.getElementById('nT').value.trim(),objetivo=document.getElementById('nO').value;
  if(CL.some(c=>c.email===email)){toast('Ya tienes un cliente con ese email');return}
  b.disabled=true;b.textContent='Creando…';
  try{
    try{await flushSync()}catch(x){}
    const f={};Object.keys(FICHA_DEF).forEach(k=>{if(!(k in ADMIN_MAP))f[k]=FICHA_DEF[k]});Object.assign(f,{nombre,email,tel,objetivo});
    const id=await db.createClient(email,f,iso(new Date()));
    await refreshList();coachSel=id;await loadClient(id);coachTab='ficha';renderCoach();inviteMsg(id);
  }catch(err){console.error(err);b.disabled=false;b.textContent='Dar de alta';toast('No se ha podido crear: '+authMsg(err))}
}
function inviteMsg(id){
  const c=CL.find(x=>x.id===id);if(!c)return;const url=APP_URL;
  if(/\.invalid$/.test(c.email)){toast('Antes, pon su email real en la Ficha (Datos generales → Email)');coachTab='ficha';if(CUR&&CUR.id===id)renderCoach();else selectClient(id);return}
  const tel=(CUR&&CUR.id===id?FICHA.tel:'').replace(/\D/g,'');
  const msg=`¡Capitán! Ya tienes lista tu app de Yaronska_Fit. Entra aquí: ${url}\n\nPulsa «Es mi primera vez: crear mi cuenta» y usa este email: ${c.email}\n\nAhí tendrás tu plan, tu rutina y tus revisiones.`;
  const sh=document.getElementById('sheet');
  sh.innerHTML=`<div class="sheet-in" role="dialog" aria-label="Invitación"><div class="sheet-b"><div class="row" style="justify-content:space-between"><h2>Envíale el acceso</h2><button class="btn ghost sm" type="button" onclick="closeSheet()">Cerrar</button></div>
    <p class="small muted" style="margin:0">Solo podrá crear la cuenta con <b style="color:var(--fg)">${esc(c.email)}</b>. Cualquier otro email queda bloqueado.</p>
    <div class="note" style="white-space:pre-wrap">${esc(msg)}</div>
    <div class="row"><a class="btn" href="https://wa.me/${tel}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">Enviar por WhatsApp</a><button class="btn ghost" type="button" onclick="navigator.clipboard.writeText(${esc(JSON.stringify(msg))}).then(()=>toast('Mensaje copiado'))">Copiar mensaje</button></div></div></div>`;
  sh.hidden=false;sh.onclick=e=>{if(e.target===sh)closeSheet()};
}
// ---- fotos privadas de un check-in
async function viewPhotos(paths){
  const sh=document.getElementById('sheet');sh.innerHTML='<div class="sheet-in"><div class="sheet-b"><p class="muted">Cargando fotos…</p></div></div>';sh.hidden=false;sh.onclick=e=>{if(e.target===sh)closeSheet()};
  try{const urls=await db.photoUrls(paths);sh.innerHTML=`<div class="sheet-in" role="dialog" aria-label="Fotos del check-in"><div class="sheet-b"><div class="row" style="justify-content:space-between"><h2>Fotos del check-in</h2><button class="btn ghost sm" type="button" onclick="closeSheet()">Cerrar</button></div><div class="pgrid">${urls.map(u=>`<a href="${esc(u)}" target="_blank" rel="noopener"><img src="${esc(u)}" alt="Foto del check-in"></a>`).join('')}</div></div></div>`}
  catch(e){sh.innerHTML='<div class="sheet-in"><div class="sheet-b"><p>No se han podido cargar las fotos.</p><button class="btn ghost sm" type="button" onclick="closeSheet()">Cerrar</button></div></div>'}
}
function cPeso(){
  const W=allWeights();if(!W.length)return '<div class="panel"><p class="small muted" style="margin:0">Aún no hay pesos. Llegarán con sus check-ins.</p></div>';const from=wFrom||W[0].date,to=wTo||W[W.length-1].date;
  const R=W.filter(w=>w.date>=from&&w.date<=to);
  const f=R[0],l=R[R.length-1];const diff=R.length?l.peso-f.peso:0;const ok=goodDir(diff);
  return `<div class="panel"><div class="range">
      <div class="field"><label for="wF">Desde</label><input type="date" id="wF" value="${from}" onchange="wFrom=this.value;renderCoach()"></div>
      <div class="field"><label for="wT">Hasta</label><input type="date" id="wT" value="${to}" onchange="wTo=this.value;renderCoach()"></div>
      <button class="btn ghost sm" type="button" onclick="wFrom='';wTo='';renderCoach()">Ver todo</button></div>
    <div class="pinbar"><div><small class="muted">El cliente ve en su gráfica:</small> <b>${FICHA.wFrom||FICHA.wTo?`${FICHA.wFrom?'desde el '+fdate(FICHA.wFrom):'desde el inicio'} ${FICHA.wTo?'hasta el '+fdate(FICHA.wTo):'hasta hoy (se va actualizando)'}`:'todo, desde el inicio hasta hoy'}</b></div>
      <div class="row"><button class="btn sm" type="button" onclick="pinRange()">📌 Que vea solo este rango</button>${FICHA.wFrom||FICHA.wTo?`<button class="btn ghost sm" type="button" onclick="FICHA.wFrom='';FICHA.wTo='';save();renderCoach()">Que lo vea todo</button>`:''}</div></div>
    ${R.length?`<div class="kpis"><div class="kpi"><small>Peso inicial · ${fdate(f.date)}</small><b>${nf(f.peso)} kg</b></div><div class="kpi"><small>Peso actual · ${fdate(l.date)}</small><b>${nf(l.peso)} kg</b></div><div class="kpi"><small>${diff<=0?'Peso perdido':'Peso ganado'}</small><b class="${ok?'good':'badc'}">${diff>0?'+':''}${nf(diff)} kg</b></div><div class="kpi"><small>Media semanal</small><b>${R.length>1?(diff>0?'+':'')+nf(diff/((new Date(l.date)-new Date(f.date))/6048e5||1),2):'—'} kg</b></div></div>
    ${lineChart(R.map(w=>({d:w.date,v:w.peso})),{u:' kg',label:'Peso en el rango',color:ok?'#7CE38B':'#FFD60A'})}`:'<p class="small muted">No hay pesos en ese rango.</p>'}
  </div>
  <div class="panel"><span class="lbl">Todos los pesos del rango</span><div class="tbl-w"><table><thead><tr><th>Fecha</th><th>Peso</th><th>Cambio vs anterior</th><th>Cambio acumulado</th></tr></thead><tbody>
  ${R.map((w,i)=>{const d=i?w.peso-R[i-1].peso:0,a=w.peso-R[0].peso;return `<tr><td>${new Date(w.date+'T12:00').toLocaleDateString('es-ES')}</td><td>${nf(w.peso)} kg</td><td class="${i?(goodDir(d)?'good':'badc'):''}">${i?(d>0?'+':'')+nf(d):'—'}</td><td class="${i?(goodDir(a)?'good':'badc'):''}">${i?(a>0?'+':'')+nf(a):'—'}</td></tr>`}).reverse().join('')}</tbody></table></div></div>`;
}
const e1rm=s=>s.kg*(1+s.reps/30);
function cEj(){
  const names=Object.keys(S.hist);if(!names.length)return '<div class="panel"><p class="small muted" style="margin:0">Aún no ha registrado entrenos.</p></div>';if(!exSel||!S.hist[exSel])exSel=names[0];const H=S.hist[exSel]||[];
  const best=h=>h.sets.reduce((b,s)=>e1rm(s)>e1rm(b)?s:b,h.sets[0]);
  const M={kg:{l:'Peso (serie top)',f:h=>Math.max(...h.sets.map(s=>s.kg)),u:' kg'},reps:{l:'Repeticiones totales',f:h=>h.sets.reduce((a,s)=>a+s.reps,0),u:' reps',dec:0},rm:{l:'Intensidad · 1RM estimado',f:h=>e1rm(best(h)),u:' kg'},rir:{l:'RIR medio',f:h=>{const r=h.sets.filter(s=>s.rir!=null);return r.length?r.reduce((a,s)=>a+s.rir,0)/r.length:0},u:'',dec:1}};
  const m=M[exMetric];const pts=H.map(h=>({d:h.date,v:m.f(h)}));const ch=pts.length>1?pts[pts.length-1].v-pts[0].v:0;
  return `<div class="panel"><div class="range"><div class="field"><label for="exS">Ejercicio</label><select id="exS" onchange="exSel=this.value;renderCoach()">${names.map(n=>`<option ${n===exSel?'selected':''}>${esc(n)}</option>`).join('')}</select></div></div>
    <div class="mtabs">${Object.entries(M).map(([k,v])=>`<button type="button" class="chip ${exMetric===k?'on':''}" onclick="exMetric='${k}';renderCoach()">${v.l}</button>`).join('')}</div>
    <div class="kpis"><div class="kpi"><small>Primera sesión</small><b>${pts.length?nf(pts[0].v,m.dec??1)+m.u:'—'}</b></div><div class="kpi"><small>Última sesión</small><b>${pts.length?nf(pts[pts.length-1].v,m.dec??1)+m.u:'—'}</b></div><div class="kpi"><small>Mejora</small><b class="${(exMetric==='rir'?ch<=0:ch>=0)?'good':'badc'}">${ch>0?'+':''}${nf(ch,m.dec??1)}${m.u}</b></div><div class="kpi"><small>Sesiones</small><b>${pts.length}</b></div></div>
    ${lineChart(pts,{u:m.u,dec:m.dec??1,label:m.l})}
  </div>
  <div class="panel"><span class="lbl">Sesiones de ${esc(exSel)}</span><div class="tbl-w"><table><thead><tr><th>Fecha</th><th>Series (kg × reps · RIR)</th><th>1RM est.</th></tr></thead><tbody>${H.slice().reverse().map(h=>`<tr><td>${new Date(h.date+'T12:00').toLocaleDateString('es-ES')}</td><td class="wrap">${h.sets.map(s=>`${nf(s.kg,1).replace(',0','')}×${s.reps}${s.rir!=null?' · '+s.rir:''}`).join(' &nbsp;|&nbsp; ')}</td><td>${nf(e1rm(best(h)))} kg</td></tr>`).join('')}</tbody></table></div></div>`;
}
function cDiario(){
  const rows=Object.keys(S.daily).sort().reverse().slice(0,14);
  const c=v=>v===null||v===undefined?'<span class="muted">—</span>':`<span class="ok-chip ${v?'y':'n'}">${v?'✓':'✗'}</span>`;
  const n=rows.length;const pct=k=>n?Math.round(rows.filter(r=>S.daily[r][k]).length/rows.filter(r=>S.daily[r][k]!==null&&S.daily[r][k]!==undefined).length*100)||0:0;
  return `<div class="kpis"><div class="kpi"><small>Dieta cumplida</small><b>${pct('diet')} %</b></div><div class="kpi"><small>Entrenos cumplidos</small><b>${pct('train')} %</b></div><div class="kpi"><small>Días con pasos</small><b>${pct('stepsOk')} %</b></div><div class="kpi"><small>Pasos medios</small><b>${n?Math.round(rows.reduce((a,r)=>a+(+S.daily[r].steps||0),0)/n).toLocaleString('es-ES'):'—'}</b></div></div>
  <div class="panel"><span class="lbl">Últimos ${n} días</span><div class="tbl-w"><table><thead><tr><th>Día</th><th>Dieta</th><th>Entreno</th><th>Pasos</th><th>Estrés</th><th>Energía</th><th>Ánimo</th></tr></thead><tbody>
  ${rows.map(r=>{const d=S.daily[r];return `<tr><td>${new Date(r+'T12:00').toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short'})}</td><td>${c(d.diet)}</td><td>${c(d.train)}</td><td>${(+d.steps||0).toLocaleString('es-ES')} ${c(d.stepsOk)}</td><td>${d.estres||'—'}</td><td>${d.energia||'—'}</td><td>${d.animo||'—'}</td></tr>`}).join('')}</tbody></table></div></div>`;
}
function cChecks(){
  const cks=S.checkins.slice().reverse();
  if(!cks.length)return '<div class="panel"><p class="small muted" style="margin:0">Todavía no hay check-ins de este cliente.</p></div>';
  return `<div class="panel"><span class="lbl">Check-ins recibidos</span><div class="tbl-w"><table><thead><tr><th>Fecha</th>${MEAS.map(m=>`<th>${m[1]}</th>`).join('')}${SCALES.map(s=>`<th>${s.t}</th>`).join('')}<th>Orina</th><th>Fotos</th><th>Comentario</th></tr></thead><tbody>
  ${cks.map(k=>`<tr><td>${new Date(k.date+'T12:00').toLocaleDateString('es-ES')}</td>${MEAS.map(m=>`<td>${k[m[0]]??'—'}</td>`).join('')}${SCALES.map(s=>`<td>${k.r[s.k]?k.r[s.k]+' / 5':'—'}</td>`).join('')}<td>${k.r.orina||'—'}</td><td>${k.fotosP&&k.fotosP.length?`<button class="btn ghost sm" type="button" onclick='viewPhotos(${JSON.stringify(k.fotosP)})'>Ver ${k.fotosP.length}</button>`:'—'}</td><td class="wrap">${esc(k.nota)}</td></tr>`).join('')}</tbody></table></div></div>`;
}
let openSets=new Set();
const RX=(di,ei)=>S.routine[di].ex[ei];
function exEdit(di,ei,k,v){const e=RX(di,ei);
  if(k==='s'){const n=Math.max(1,Math.min(15,parseInt(v)||1));const a=exSets(e);while(a.length<n)a.push(Object.assign({},a[a.length-1]||{t:'',reps:e.r,rpe:e.rir,rest:e.rest,nota:''},{t:''}));e.s=n;e.sets=a.slice(0,n);save();renderCoach();return}
  if(['r','rir','rest'].includes(k)){const f={r:'reps',rir:'rpe',rest:'rest'}[k];const old=e[k];e.sets=exSets(e).map(x=>(!x.t&&(x[f]===old||!x[f]))?Object.assign(x,{[f]:v}):x)}
  e[k]=v;save()}
function setEdit(di,ei,si,k,v){const e=RX(di,ei);e.sets=exSets(e);e.sets[si][k]=v;save();if(k==='t')renderCoach()}
function blkEdit(di,ei,v){const d=S.routine[di];const e=d.ex[ei];e.blk=v||'';
  if(v){const mates=d.ex.filter(x=>x.blk===v);const t=(mates.find(x=>x!==e&&x.blkT)||{}).blkT||(mates.length>=4?'circuito':mates.length===3?'triserie':'superserie');mates.forEach(x=>x.blkT=t)}else delete e.blkT;
  save();renderCoach()}
function blkType(di,l,v){S.routine[di].ex.forEach(x=>{if(x.blk===l)x.blkT=v});save();renderCoach()}
function moveEx(di,ei,dir){const a=S.routine[di].ex;const j=ei+dir;if(j<0||j>=a.length)return;[a[ei],a[j]]=[a[j],a[ei]];openSets=new Set();save();renderCoach()}
function togSets(k){openSets.has(k)?openSets.delete(k):openSets.add(k);renderCoach()}
function cRutina(){
  const all=TEMPLATES.concat(TPL_MINE);const sel=(v,opts,on,lab)=>`<select onchange="${on}" aria-label="${lab}">${opts.map(([k,l])=>`<option value="${esc(k)}" ${String(v||'')===k?'selected':''}>${esc(l)}</option>`).join('')}</select>`;
  return `<div class="panel"><span class="lbl">Asignar rutina preparada · un clic</span>
    <div class="tpl">${all.map((t,i)=>`<button type="button" class="tplc" onclick="assignTpl(${i})"><b>${esc(t.name)}</b><small>${esc(t.desc||'')} · ${t.days.length} días · ${t.days.reduce((a,d)=>a+d.ex.length,0)} ejercicios</small><span class="small y">Asignar →</span></button>`).join('')}</div>
    <p class="small muted" style="margin:0">Se copia al cliente y luego la ajustas aquí abajo sin tocar la plantilla original.</p></div>
  <div class="panel"><div class="sec-h"><span class="lbl">Rutina actual del cliente</span><div class="row"><button class="btn ghost sm" type="button" onclick="saveAsTpl()">Guardar como plantilla</button><button class="btn ghost sm" type="button" onclick="setView('client');go('train')">Ver como el cliente</button></div></div>
  <p class="small muted" style="margin:0"><b style="color:var(--fg)">Bloque:</b> pon la misma letra a ejercicios seguidos para hacer superseries, biseries o circuitos. <b style="color:var(--fg)">Series ▾:</b> detalla cada serie (top set, back-off, drop set…).</p>
  ${S.routine.map((d,di)=>{const used=[...new Set(d.ex.map(x=>x.blk).filter(Boolean))];return `<div class="panel" style="background:var(--bg)"><div class="row"><input aria-label="Nombre del día" id="dn-${di}" value="${esc(d.d)}" onchange="S.routine[${di}].d=this.value;save()" style="flex:1;min-width:0;background:transparent;border:0;border-bottom:1px solid var(--line-2);padding:6px 0;font-family:var(--display);font-weight:800;font-size:16px;text-transform:uppercase"><button class="btn ghost sm" type="button" onclick="S.routine.splice(${di},1);save();renderCoach()">Quitar día</button></div>
    <div class="warmed"><label class="ef"><small>🔥 Calentamiento del día (lo que tiene que hacer)</small><textarea rows="2" placeholder="5 min bici suave + movilidad de cadera y hombro" onchange="warmEdit(${di},'txt',this.value)">${esc((d.warm||{}).txt||'')}</textarea></label><label class="ef"><small>Vídeo del calentamiento (YouTube)</small><input value="${esc((d.warm||{}).url||'')}" placeholder="https://youtu.be/…" onchange="warmEdit(${di},'url',this.value)"></label></div>
    ${used.length?`<div class="blkbar">${used.map(l=>{const t=(d.ex.find(x=>x.blk===l)||{}).blkT;return `<label>Bloque ${l} ${sel(t,BLK_T,`blkType(${di},'${l}',this.value)`,'Tipo de bloque '+l)}</label>`}).join('')}</div>`:''}
        ${d.ex.map((e,ei)=>{const k=di+'-'+ei;const op=openSets.has(k);const det=detailed(e);return `<div class="ed-ex ${e.blk?'inblk':''}"><div class="ed-row"><label class="ef nm"><small>Ejercicio</small><input id="en-${k}" value="${esc(e.n)}" onchange="exEdit(${di},${ei},'n',this.value)"></label><label class="ef vu"><small>Vídeo (enlace)</small><input id="ev-${k}" value="${esc(e.v||'')}" placeholder="https://youtu.be/…" onchange="exEdit(${di},${ei},'v',this.value)"></label><label class="ef"><small>Series</small><input id="es-${k}" value="${e.s}" inputmode="numeric" onchange="exEdit(${di},${ei},'s',this.value)"></label><label class="ef"><small>Reps</small><input id="er-${k}" value="${esc(e.r)}" onchange="exEdit(${di},${ei},'r',this.value)"></label><label class="ef"><small>RIR / RPE</small><input id="ei-${k}" value="${esc(e.rir)}" onchange="exEdit(${di},${ei},'rir',this.value)"></label><label class="ef"><small>Descanso</small><input id="et-${k}" value="${esc(e.rest)}" onchange="exEdit(${di},${ei},'rest',this.value)"></label><label class="ef"><small>Bloque</small>${sel(e.blk,[['','—']].concat(BLK_L.map(l=>[l,l])),`blkEdit(${di},${ei},this.value)`,'Bloque')}</label>
      <div class="acts"><button type="button" class="mini ${det?'on':''}" onclick="togSets('${k}')" aria-expanded="${op}">Series ${op?'▴':'▾'}</button><button type="button" class="mini" onclick="moveEx(${di},${ei},-1)" aria-label="Subir">↑</button><button type="button" class="mini" onclick="moveEx(${di},${ei},1)" aria-label="Bajar">↓</button><button class="x" type="button" aria-label="Quitar" onclick="S.routine[${di}].ex.splice(${ei},1);openSets=new Set();save();renderCoach()">×</button></div><label class="ef ap"><small>Series de aproximación (sin vídeo)</small><input id="ea-${k}" value="${esc(e.aprox||'')}" placeholder="1×10 al 40 % · 1×5 al 60 % · 1×3 al 80 %" onchange="exEdit(${di},${ei},'aprox',this.value)"></label></div>
      ${op?`<div class="setsed"><div class="sed-row small muted"><span>Serie</span><span>Tipo</span><span>Reps</span><span>RIR / RPE</span><span>Descanso</span><span>Nota para el cliente</span></div>${exSets(e).map((x,si)=>`<div class="sed-row"><span class="sidx">${si+1}</span>${sel(x.t,SET_T,`setEdit(${di},${ei},${si},'t',this.value)`,'Tipo de serie '+(si+1))}<input value="${esc(x.reps)}" onchange="setEdit(${di},${ei},${si},'reps',this.value)" aria-label="Reps serie ${si+1}"><input value="${esc(x.rpe)}" onchange="setEdit(${di},${ei},${si},'rpe',this.value)" aria-label="RIR o RPE serie ${si+1}"><input value="${esc(x.rest)}" onchange="setEdit(${di},${ei},${si},'rest',this.value)" aria-label="Descanso serie ${si+1}"><input value="${esc(x.nota)}" placeholder="${x.t==='backoff'?'-10 % del top set':x.t==='drop'?'Baja un 20-25 % y al fallo':''}" onchange="setEdit(${di},${ei},${si},'nota',this.value)" aria-label="Nota serie ${si+1}"></div>`).join('')}</div>`:''}</div>`}).join('')}
    <button class="btn ghost sm" type="button" onclick="S.routine[${di}].ex.push({n:'Nuevo ejercicio',m:'',s:3,r:'10-12',rir:'RIR 2',rest:'90 s',v:''});save();renderCoach()">+ Añadir ejercicio</button></div>`}).join('')}
  <button class="btn sm" type="button" onclick="S.routine.push({d:'Día '+String.fromCharCode(65+S.routine.length)+' · nuevo',ex:[]});save();renderCoach()">+ Añadir día</button></div>`;
}


// ---- Ficha del cliente
const SUBM={monthly:1,bimonthly:2,quarterly:3,semester:6,annual:12};
const SUBT=[['monthly','Mensual (1 mes)'],['bimonthly','Bimensual (2 meses)'],['quarterly','Trimestral (3 meses)'],['semester','Semestral (6 meses)'],['annual','Anual (12 meses)'],['custom','Personalizado']];
const EST=[['active','🟢 Activo'],['paused','🟠 Pausado'],['ended','⚫ Baja'],['trial','🔵 Prueba']];
const WD=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
function nextRenewal(f){
  if(f.renov)return f.renov;const m=SUBM[f.tipo];if(!f.alta||!m)return '';
  const d=new Date(f.alta+'T12:00');const now=new Date();while(d<=now)d.setMonth(d.getMonth()+m);return iso(d);
}
const F_RERENDER=['nombre','revFis','tipo','alta','renov','pago','estado','objetivo','nac','pasosT','pasosR'];
function fBlur(k){if(F_RERENDER.includes(k))setTimeout(renderCoach)}
function fSet(k,v,t){FICHA[k]=t==='n'?(v===''?'':parseFloat(String(v).replace(',','.'))):v;save();if(t!=='date'&&['nombre','revFis','tipo','alta','renov','pago','estado','objetivo','nac','pasosT','pasosR'].includes(k))setTimeout(renderCoach)}
function fDay(i){const a=FICHA.dias;const j=a.indexOf(i);if(j>=0)a.splice(j,1);else a.push(i);a.sort();FICHA.diasSemana=a.length;save();setTimeout(renderCoach)}
function cFicha(){
  const f=FICHA;const ren=nextRenewal(f);const dleft=ren?Math.round((new Date(ren+'T12:00')-new Date())/864e5):null;
  const m=SUBM[f.tipo]||1;const age=f.nac?Math.floor((new Date()-new Date(f.nac+'T12:00'))/31557600000):null;
  let bd='';if(f.nac){const b=new Date(f.nac+'T12:00');const n=new Date();b.setFullYear(n.getFullYear());if(b<n)b.setFullYear(n.getFullYear()+1);bd=Math.round((b-n)/864e5)}
  const inp=(k,l,t='text',ph='')=>`<div class="field"><label for="f-${k}">${l}</label><input id="f-${k}" type="${t==='n'?'number':t}" step="any" value="${esc(f[k])}" placeholder="${esc(ph)}" onchange="fSet('${k}',this.value,'${t}')"${t==='date'?` onblur="fBlur('${k}')"`:''}></div>`;
  const sel=(k,l,opts)=>`<div class="field"><label for="f-${k}">${l}</label><select id="f-${k}" onchange="fSet('${k}',this.value)" style="background:var(--surface);border:1px solid var(--line-2);border-radius:8px;padding:10px;color:var(--fg)">${opts.map(([v,t])=>`<option value="${esc(v)}" ${String(f[k])===String(v)?'selected':''}>${esc(t)}</option>`).join('')}</select></div>`;
  const ta=(k,l)=>`<div class="field" style="grid-column:1/-1"><label for="f-${k}">${l}</label><textarea id="f-${k}" onchange="fSet('${k}',this.value)">${esc(f[k])}</textarea></div>`;
  const grid=h=>`<div class="fgrid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">${h}</div>`;
  const days=[['',' —']].concat(WD.map(d=>[d,d]));
  return `<div class="kpis">
    <div class="kpi"><small>Estado</small><b style="font-size:17px">${esc((EST.find(e=>e[0]===f.estado)||['',''])[1])}</b></div>
    <div class="kpi"><small>Pago · ${esc((SUBT.find(x=>x[0]===f.tipo)||['','—'])[1])}</small><b>${f.pago?nf(f.pago,0)+' €':'—'}</b><small>${f.pago&&SUBM[f.tipo]?nf(f.pago/m,0)+' €/mes':''}</small></div>
    <div class="kpi"><small>Próxima renovación</small><b class="${dleft!=null&&dleft<=7?'badc':dleft!=null&&dleft<=21?'':'good'}" style="${dleft!=null&&dleft>7&&dleft<=21?'color:var(--warn)':''}">${ren?new Date(ren+'T12:00').toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'}):'—'}</b><small>${dleft!=null?(dleft>=0?'en '+dleft+' días':'vencida hace '+(-dleft)+' días'):''}</small></div>
    <div class="kpi"><small>Edad</small><b>${age!=null?age+' años':'—'}</b><small>${bd!==''?'🎂 cumple en '+bd+' días':''}</small></div></div>
  <div class="panel"><span class="lbl">Datos generales</span>${grid(inp('nombre','Nombre')+inp('email','Email','email')+inp('tel','Teléfono / WhatsApp','tel')+sel('sexo','Sexo',[['Hombre','Hombre'],['Mujer','Mujer']])+inp('nac','Fecha de nacimiento','date')+inp('altura','Altura (cm)','n')+sel('objetivo','Objetivo',[['perder','Perder grasa'],['ganar','Ganar músculo']]))}</div>
  <div class="panel"><span class="lbl">📅 Suscripción y cheatmeals</span>${grid(sel('estado','Estado',EST)+inp('alta','Fecha de alta','date')+sel('tipo','Tipo de suscripción',[['','—']].concat(SUBT))+inp('renov','Fecha de renovación (vacío = automática)','date')+inp('pago','Pago actual (€)','n')+inp('cheat','Cheatmeals / semana','n')+inp('pausa','Fecha de pausa (si aplica)','date')+inp('baja','Fecha de baja (si aplica)','date')+ta('notasCom','Notas comerciales / historial'))}</div>
  <div class="panel"><span class="lbl">🏋️ Entrenamiento, pasos y revisiones</span>
    <div class="field"><label>Días de entrenamiento</label><div class="chips">${WD.map((d,i)=>{const gi=(i+1)%7;return `<button type="button" class="chip ${f.dias.includes(gi)?'on':''}" onclick="fDay(${gi})">${d.slice(0,3)}</button>`}).join('')}</div></div>
    ${grid(inp('pasosT','👟 Pasos objetivo · día de entreno','n')+inp('pasosR','👟 Pasos objetivo · día sin entreno','n')+inp('tipoEntreno','¿Qué trabaja? (tipo de entrenamiento)')+inp('diasSemana','Nº días entrena por semana','n')+sel('revFis','Día revisión físico / peso',days)+inp('lastFis','Última revisión físico','date')+sel('revEnt','Día revisión entreno',days)+inp('lastEnt','Última revisión entreno','date'))}
    <p class="small muted" style="margin:0">El cliente ve en su Inicio el objetivo de pasos que toca según el día (entreno o descanso).</p></div>
  <div class="panel"><span class="lbl">Perfil clínico</span>${grid(ta('objLargo','Objetivo del cliente')+inp('patologias','Patologías diagnosticadas')+inp('alergias','Alergias')+inp('intol','Intolerancias')+inp('lesiones','Lesiones / limitaciones físicas')+inp('medicacion','Medicación actual')+inp('suplem','Suplementación actual')+inp('ciclo','Ciclo menstrual / menopausia (si aplica)')+inp('histDietas','Historial de dietas previas')+inp('prefs','Preferencias alimentarias')+inp('evitar','Alimentos a evitar')+inp('sueno','Horas de sueño habituales','n')+inp('estres','Nivel de estrés (1-10)','n')+inp('motiv','Nivel de motivación (1-10)','n'))}</div>
  <div class="panel"><span class="lbl">💊 Suplementación estructurada</span>${grid(inp('omega3','Omega-3 EPA+DHA (g/día)','n')+inp('vitD','Vitamina D (UI/día)','n')+inp('b12','Vitamina B12 (µg/día)','n')+inp('magnesio','Magnesio (mg/día)','n')+inp('vitC','Vitamina C (mg/día)','n')+inp('hierro','Hierro (mg/día)','n')+inp('calcio','Calcio (mg/día)','n')+inp('zinc','Zinc (mg/día)','n')+inp('folato','Folato (µg/día)','n')+inp('potasio','Potasio (mg/día)','n')+inp('creatina','Creatina (g/día)','n')+inp('colageno','Colágeno (g/día)','n')+inp('cafeina','Cafeína (mg/día)','n')+sel('multi','Multivitamínico',[['no','No'],['yes','Sí']])+ta('supOtros','Otros suplementos'))}</div>
  <div class="panel"><span class="lbl">🌞 Estilo de vida diario</span>${grid(inp('sal','Sal añadida (g/día)','n')+inp('sol','Exposición al sol (min/día)','n')+inp('agua','Agua (litros/día)','n')+inp('cafe','Café (tazas/día)','n')+inp('alcohol','Alcohol (UI/semana)','n')+inp('tabaco','Tabaco (cig/día)','n')+inp('aire','Tiempo al aire libre (min/día)','n')+inp('pantallas','Pantallas (h/día)','n')+ta('lifeNotas','Notas de estilo de vida'))}</div>
  <div class="panel" style="border-color:rgba(255,107,91,.35)"><span class="lbl" style="color:var(--bad)">Zona peligrosa</span><p class="small muted" style="margin:0">Borra al cliente y todos sus datos de la app (ficha, pesos, check-ins, entrenos y dieta). No se puede deshacer. Si solo ha terminado el programa, mejor cambia su estado a «Baja».</p><button class="btn ghost sm" type="button" style="color:var(--bad);border-color:var(--bad)" onclick="delClient()">Eliminar cliente</button></div>`;
}
// Sesiones: ver lo que rellenó, corregirlo y pautar el siguiente entreno
let sesSel='';
function sessions(){const m={};Object.entries(S.hist).forEach(([n,arr])=>arr.forEach((h,hi)=>{const k=h.date+'|'+(h.day||'');(m[k]=m[k]||{date:h.date,day:h.day||'',items:[]}).items.push({n,hi,h})}));return Object.values(m).sort((a,b)=>b.date.localeCompare(a.date))}
function routineEx(n,day){let f=null;S.routine.forEach(d=>d.ex.forEach(e=>{if(e.n===n&&(!f||d.d===day))f=e}));return f}
const setTag=t=>t?`<em class="stag t-${t}">${esc((SET_T.find(x=>x[0]===t)||['',t])[1])}</em>`:'';
function cSes(){
  const L=sessions();if(!L.length)return '<div class="panel"><p class="small muted" style="margin:0">Aún no hay sesiones guardadas.</p></div>';
  if(!sesSel||!L.find(x=>x.date+'|'+x.day===sesSel))sesSel=L[0].date+'|'+L[0].day;const se=L.find(x=>x.date+'|'+x.day===sesSel);
  const inS='style="width:72px;background:var(--bg);border:1px solid var(--line-2);border-radius:6px;padding:6px;text-align:center"';
  return `<div class="panel"><div class="range"><div class="field"><label for="sesS">Sesión</label><select id="sesS" onchange="sesSel=this.value;renderCoach()">${L.map(x=>`<option value="${esc(x.date+'|'+x.day)}" ${x.date+'|'+x.day===sesSel?'selected':''}>${new Date(x.date+'T12:00').toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short'})} · ${esc(x.day||'Entreno')} · ${x.items.length} ejercicios</option>`).join('')}</select></div></div>
    <p class="small muted" style="margin:0">Corrige lo que ha rellenado si hace falta y pauta su próximo entreno: lo verá en verde como «Pautado por Yaron». Si el ejercicio tiene series detalladas (top set, back-off…), pautas cada serie por separado.</p></div>
  ${se.items.map(({n,hi,h},k)=>{const nx=S.next[n]||{};const re=routineEx(n,h.day);const plan=re?exSets(re):[];const det=re&&detailed(re);const nm=esc(n).replace(/'/g,"\\'");
    const blk=re&&re.blk?`<span class="stag" style="background:var(--surface-2);color:var(--y)">${esc(blkName(re.blkT))} ${esc(re.blk)}</span>`:'';
    const tOf=(st,si)=>st.t!==undefined?st.t:(plan[st.i??si]||{}).t||'';
    return `<div class="panel"><div class="sec-h"><b style="font-size:15px">${esc(n)} ${blk}</b><span class="small muted">${h.sets.length} series</span></div>
    <div class="tbl-w"><table><thead><tr><th>Serie</th><th>Tipo</th><th>Pautado</th><th>Kg</th><th>Reps</th><th>RIR real</th></tr></thead><tbody>${h.sets.map((st,si)=>{const pl=plan[st.i??si]||{};return `<tr><td>${(st.i??si)+1}</td><td>${setTag(tOf(st,si))||'<span class="muted">Normal</span>'}</td><td class="small muted">${esc([pl.reps,pl.rpe].filter(Boolean).join(' · '))}</td>${['kg','reps','rir'].map(f=>`<td><input id="sx-${k}-${si}-${f}" value="${st[f]??''}" inputmode="decimal" ${inS} onchange="editSet('${nm}',${hi},${si},'${f}',this.value)" aria-label="${f} serie ${si+1}"></td>`).join('')}</tr>`}).join('')}</tbody></table></div>
    <span class="lbl" style="margin-top:4px">Pautar próximo entreno</span>
    ${det?`<div class="tbl-w"><table><thead><tr><th>Serie</th><th>Tipo</th><th>Kg</th><th>Reps</th><th>RIR / RPE</th></tr></thead><tbody>${plan.map((pl,si)=>{const v=(nx.sets||[])[si]||{};const lastS=h.sets.find(x=>(x.i??-1)===si)||h.sets[si]||{};return `<tr><td>${si+1}</td><td>${setTag(pl.t)||'<span class="muted">Normal</span>'}</td><td><input id="nsk-${k}-${si}" value="${esc(v.kg||'')}" placeholder="${lastS.kg??''}" inputmode="decimal" ${inS}></td><td><input id="nsr-${k}-${si}" value="${esc(v.reps||'')}" placeholder="${esc(pl.reps||'')}" ${inS}></td><td><input id="nsi-${k}-${si}" value="${esc(v.int||'')}" placeholder="${esc(pl.rpe||'')}" ${inS}></td></tr>`}).join('')}</tbody></table></div>
      <div class="range"><div class="field" style="flex:2"><label for="nn-${k}">Nota para el cliente</label><input id="nn-${k}" value="${esc(nx.nota||'')}" placeholder="Top set a 100 kg y back-offs al 90 %"></div><button class="btn sm" type="button" onclick="setNext('${nm}',${k},${plan.length})">Pautar</button></div>`
    :`<div class="range"><div class="field"><label for="nk-${k}">Kg</label><input id="nk-${k}" value="${esc(nx.kg||'')}" inputmode="decimal" placeholder="${Math.max(...h.sets.map(x=>x.kg))}"></div><div class="field"><label for="nr-${k}">Reps objetivo</label><input id="nr-${k}" value="${esc(nx.reps||'')}" placeholder="p. ej. 10-12"></div><div class="field"><label for="ni-${k}">RIR / RPE objetivo</label><input id="ni-${k}" value="${esc(nx.int||'')}" placeholder="RIR 2 · RPE 8"></div><div class="field" style="flex:2"><label for="nn-${k}">Nota para el cliente</label><input id="nn-${k}" value="${esc(nx.nota||'')}" placeholder="Baja el peso y controla la bajada"></div>
    <button class="btn sm" type="button" onclick="setNext('${nm}',${k},0)">Pautar</button></div>`}</div>`}).join('')}`;
}
function editSet(n,hi,si,f,v){const x=parseFloat(String(v).replace(',','.'));S.hist[n][hi].sets[si][f]=isNaN(x)?null:x;save();toast('Corregido')}
function setNext(n,k,ns){const g=id=>{const el=document.getElementById(id);return el?el.value.trim():''};const nota=g('nn-'+k);
  if(ns){const sets=[];for(let si=0;si<ns;si++)sets.push({kg:g(`nsk-${k}-${si}`),reps:g(`nsr-${k}-${si}`),int:g(`nsi-${k}-${si}`)});
    if(!nota&&!sets.some(x=>x.kg||x.reps||x.int))delete S.next[n];else S.next[n]={sets,nota,ts:Date.now()}}
  else{const kg=g('nk-'+k),reps=g('nr-'+k),int=g('ni-'+k);if(!kg&&!reps&&!nota&&!int)delete S.next[n];else S.next[n]={kg,reps,nota,int,ts:Date.now()}}
  save();toast('Pautado para el próximo entreno');renderCoach()}
// Plan automático según kcal (tu forma de trabajar: plantilla Yaronska escalada)
let planPrev=null;
function cPlan(){
  const k=planPrev??S.kcal;const v=DATA.V[nearK(k)].plan;
  return `<div class="panel"><span class="lbl">Plan automático</span>
    <div class="range"><div class="field"><label for="pk">Kcal del día de entreno</label><input id="pk" type="number" min="1300" max="3200" step="50" value="${k}" oninput="planPrev=+this.value;document.getElementById('pkPrev').innerHTML=planPreview(+this.value)"></div>
    <div class="field"><label for="pr">Días sin entreno</label><select id="pr"><option value="1" ${S.restOn?'selected':''}>−250 kcal (come menos)</option><option value="0" ${!S.restOn?'selected':''}>Mismo plan todos los días</option></select></div>
    <button class="btn sm" type="button" onclick="applyPlan()">Generar y asignar plan</button></div>
    <p class="small muted" style="margin:0">Parte de tu plantilla Yaronska (6 desayunos, comida y cena por macros, fruta y verdura) y ajusta todas las cantidades a las kcal que pongas, redondeando como lo haces tú. El cliente lo ve en su app en cuanto lo asignas.</p></div>
  <div class="panel" id="pkPrev">${planPreview(k)}</div>`;
}
function planPreview(k){
  const v=DATA.V[nearK(k)].plan;
  return `<span class="lbl">Vista previa · ${nearK(k)} kcal</span><div class="kpis"><div class="kpi"><small>Desayuno · ${esc(v.breakfast[0].name)}</small><b style="font-size:14px">${esc(v.breakfast[0].items.slice(0,2).join(' · '))}</b></div><div class="kpi"><small>Proteína comida</small><b style="font-size:14px">${esc(v.lunch.protein[0])}</b></div><div class="kpi"><small>Hidrato comida</small><b style="font-size:14px">${esc(v.lunch.carb[0])}</b></div><div class="kpi"><small>Grasa comida</small><b style="font-size:14px">${esc(v.lunch.fat[0])}</b></div></div>`;
}
function applyPlan(){const k=+document.getElementById('pk').value;if(!(k>=1300&&k<=3200)){toast('Pon unas kcal entre 1300 y 3200');return}S.kcal=nearK(k);S.planOn=true;S.planCalc=null;S.restOn=document.getElementById('pr').value==='1';planPrev=null;save();toast('Plan de '+S.kcal+' kcal asignado');renderCoach()}
function assignTpl(i){const t=TEMPLATES.concat(TPL_MINE)[i];S.routine=clone(t.days);dayIdx=0;save();toast('Rutina «'+t.name+'» asignada');renderCoach()}
function saveAsTpl(){const n=TPL_MINE.length+1;TPL_MINE.push({name:'Mi plantilla '+n,desc:'Guardada desde un cliente',days:clone(S.routine)});save();toast('Guardada como «Mi plantilla '+n+'»');renderCoach()}
boot();

// ================= CALCULADORA DE DIETAS DENTRO DEL PANEL =================
// La Calculadora original (calc/index.html) va en un marco que no se recarga al cambiar de pestaña.
// Guarda sus datos de cada cliente en la tabla diet_calc; «Enviar plan a la app» pasa el protocolo al cliente.
let CALC={frame:null,ready:false,forId:null,saveT:null,pending:null,exportCb:null,full:false};
function calcWrap(){let w=document.getElementById('calcWrap');if(!w){w=document.createElement('div');w.id='calcWrap';w.hidden=true;
  w.innerHTML=`<div class="calc-bar"><span class="lbl" style="color:var(--y)">Calculadora · <span id="calcWho"></span></span><button class="btn ghost sm" type="button" onclick="calcFull(false)">✕ Salir de pantalla completa</button></div>`;
  document.body.appendChild(w)}return w}
function cDieta(){
  const pl=S.planCalc?`Enviado el ${new Date(S.planCalc.fecha+'T12:00').toLocaleDateString('es-ES')}${S.planCalc.R?' · con días sin entreno':''}`:S.planOn?`Plan antiguo (automático)`:'Ninguno todavía';
  return `<div class="panel"><div class="sec-h"><div><span class="lbl">Plan que ve el cliente en su app</span><b style="display:block;font-size:15px">${esc(pl)}</b></div>
    <div class="row"><button class="btn sm" type="button" onclick="calcSend()">📲 Enviar plan a la app</button><button class="btn ghost sm" type="button" onclick="calcFull(true)">⛶ Pantalla completa</button><button class="btn ghost sm" type="button" onclick="setView('client');go('food')">Ver como el cliente</button></div></div>
    <p class="small muted" style="margin:0">Es tu Calculadora, igual que en el ordenador: Plan calculado, Constructor de comidas y Protocolo dietético, con lista de la compra, meal prep, impresión y libro de recetas. Se guarda sola. Cuando el protocolo esté listo, pulsa <b style="color:var(--fg)">Enviar plan a la app</b> y el cliente lo verá en «Comidas» (con días sin entreno si los tienes activados).</p></div>
  <div id="calcSlot" class="calc-slot"><p class="muted" id="calcLoading">Cargando la Calculadora…</p></div>`;
}
function placeCalc(){
  const w=calcWrap();const slot=document.getElementById('calcSlot');
  const show=view==='coach'&&coachTab==='dieta'&&slot&&CUR;
  if(!show&&!CALC.full){w.hidden=true;return}
  if(!CALC.frame){const f=document.createElement('iframe');f.src='calc/index.html?embed=1';f.title='Calculadora de dietas';f.className='calc-frame';CALC.frame=f;w.appendChild(f)}
  w.hidden=false;document.getElementById('calcWho').textContent=CLIENT.name;
  if(!CALC.full&&slot){const r=slot.getBoundingClientRect();w.style.top=(r.top+window.scrollY)+'px';w.style.left=(r.left+window.scrollX)+'px';w.style.width=r.width+'px'}
  if(CALC.ready&&CUR&&CALC.forId!==CUR.id&&!CALC.busy)calcLoad();
}
window.addEventListener('resize',()=>{if(CALC.frame)placeCalc()});
function calcFull(on){CALC.full=on;const w=calcWrap();w.classList.toggle('full',on);document.body.classList.toggle('noscroll',on);if(!on){setTimeout(placeCalc)}else placeCalc()}
function calcPost(m){CALC.frame.contentWindow.postMessage(Object.assign({ys:true},m),location.origin)}
function ageOf(nac){if(!nac)return null;return Math.floor((new Date()-new Date(nac+'T12:00'))/31557600000)}
async function calcLoad(){
  if(!CUR||!CALC.ready)return;const id=CUR.id;CALC.forId=id;
  await calcFlush();
  let data=null,foods=[];
  try{[data,foods]=await Promise.all([db.getDietCalc(id),db.getSetting('customFoods')])}catch(e){toast('No se ha podido cargar la dieta: '+authMsg(e));return}
  if(CALC.forId!==id)return;
  const W=allWeights();const lastW=W.length?W[W.length-1].peso:null;
  if(!data){data={id,name:CLIENT.name,desc:'',createdAt:new Date().toISOString(),
    data:{sex:FICHA.sexo==='Mujer'?'female':'male',age:ageOf(FICHA.nac)||30,height:+FICHA.altura||175,weight:lastW||75,activity:1.55,trainingDays:(FICHA.dias||[]).length||4,steps:+FICHA.pasosT||8000,metabolism:1,meals:4,goal:FICHA.objetivo==='ganar'?'0.10':'-0.15',dietType:'standard',proteinPerKg:1.8},
    notes:'',history:[],mealPlan:null,measurements:[]}}
  data.id=id;data.name=CLIENT.name;
  calcPost({type:'load',client:data,customFoods:Array.isArray(foods)?foods:[],tab:'protocol'});
}
async function calcFlush(){if(CALC.pending){clearTimeout(CALC.saveT);const p=CALC.pending;CALC.pending=null;try{await db.saveDietCalc(p.id,p.client);if(p.foods)await db.setSetting('customFoods',p.foods)}catch(e){CALC.pending=p;toast('No se ha podido guardar la dieta. Lo reintento…');CALC.saveT=setTimeout(calcFlush,6000)}}}
window.addEventListener('message',e=>{
  if(e.origin!==location.origin||!e.data||!e.data.ys||!CALC.frame||e.source!==CALC.frame.contentWindow)return;const m=e.data;
  if(m.type==='ready'&&CALC.readyCb){const cb=CALC.readyCb;CALC.readyCb=null;CALC.ready=true;cb();return}
  if(m.type==='ready'){CALC.ready=true;const l=document.getElementById('calcLoading');if(l)l.remove();calcLoad()}
  if(m.type==='loaded'&&CALC.loadedCb){const cb=CALC.loadedCb;CALC.loadedCb=null;cb()}
  if(m.type==='loaded'){const l=document.getElementById('calcLoading');if(l)l.remove()}
  if(m.type==='save'&&m.client&&m.client.id){CALC.pending={id:m.client.id,client:m.client,foods:m.customFoods};setSaveState('busy');clearTimeout(CALC.saveT);CALC.saveT=setTimeout(()=>calcFlush().then(()=>setSaveState('ok')),800)}
  if(m.type==='export'&&CALC.exportCb){const cb=CALC.exportCb;CALC.exportCb=null;cb(m.data)}
});
function calcSend(){
  if(!CALC.ready||CALC.forId!==(CUR&&CUR.id)){toast('Espera a que cargue la Calculadora');return}
  CALC.exportCb=d=>{
    if(!d||d.error){toast(d&&d.error||'No se ha podido exportar el plan');return}
    S.planCalc=d;S.planOn=true;S.restOn=!!d.R;save();renderCoach();
    toast(d.R?'Plan enviado: el cliente ya lo ve (entreno y descanso)':'Plan enviado: el cliente ya lo ve');
  };
  calcPost({type:'export'});
}

// ================= IMPORTAR CLIENTES DESDE LA CALCULADORA (coaching-data.json) =================
let IMP=null;
function openImport(){
  const sh=document.getElementById('sheet');
  sh.innerHTML=`<div class="sheet-in" role="dialog" aria-label="Importar clientes"><div class="sheet-b"><div class="row" style="justify-content:space-between"><h2>Importar de la Calculadora</h2><button class="btn ghost sm" type="button" onclick="closeSheet()">Cerrar</button></div>
    <p class="small muted" style="margin:0">Elige tu archivo de guardado <b style="color:var(--fg)">coaching-data.json</b> (carpeta «Copias Calculadora»). Se pasan la ficha, suscripción y pagos, el historial de pesos y medidas, la dieta completa de la Calculadora y su plan a la app del cliente. Los clientes que ya estén en la app (mismo nombre) se saltan.</p>
    <label class="btn" style="cursor:pointer">Elegir archivo<input type="file" accept=".json,application/json" hidden onchange="readImport(this)"></label><div id="impBox"></div></div></div>`;
  sh.hidden=false;sh.onclick=e=>{if(e.target===sh&&!(IMP&&IMP.running))closeSheet()};
}
function readImport(inp){const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{
  let d;try{d=JSON.parse(r.result)}catch(e){toast('Ese archivo no es una copia válida de la Calculadora');return}
  if(!d||!Array.isArray(d.clients)){toast('Ese archivo no tiene clientes de la Calculadora');return}
  const have=new Set(CL.map(c=>c.name.trim().toLowerCase()));
  IMP={d,running:false};const ST={active:'🟢 Activo',paused:'🟠 Pausado',ended:'⚫ Baja',trial:'🔵 Prueba'};
  document.getElementById('impBox').innerHTML=`<div class="pcard" style="margin-top:10px">${d.clients.map((c,i)=>{const dup=have.has(String(c.name||'').trim().toLowerCase());const pr=c.profile||{};return `<label class="prow"><span>${esc(c.name)}<small>${ST[pr.subStatus]||''}${c.protocol&&c.protocol.v===2?' · con protocolo':' · sin protocolo'}${dup?' · ya está en la app':''}</small></span><input class="sw" type="checkbox" data-i="${i}" ${dup?'disabled':'checked'}></label>`}).join('')}</div>
    <button class="btn" id="impGo" type="button" onclick="runImport()">Importar seleccionados</button><p class="small muted" id="impLog" style="margin:0"></p>`;
};r.readAsText(f)}
const impSlug=s=>String(s||'cliente').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'.').replace(/^\.|\.$/g,'')||'cliente';
function impFicha(c){const p=c.profile||{},d=c.data||{};const n=v=>v===undefined||v===null?'':v;
  return Object.assign({},(()=>{const o={};Object.keys(FICHA_DEF).forEach(k=>{if(!(k in ADMIN_MAP))o[k]=FICHA_DEF[k]});return o})(),{
    nombre:c.name||'',email:'',tel:'',sexo:d.sex==='female'?'Mujer':d.sex==='male'?'Hombre':'',nac:n(p.fechaNacimiento),altura:n(d.height),objetivo:(parseFloat(d.goal)||0)>0?'ganar':'perder',
    tipoEntreno:n(p.tipoEntreno),diasSemana:n(p.diasSemana||d.trainingDays),dias:[],pasosT:n(d.steps),pasosR:n(d.steps),
    revFis:n(p.revFisicoDay)||'Domingo',lastFis:n(p.lastRevFisico),revEnt:n(p.revEntrenoDay),lastEnt:n(p.lastRevEntreno),
    objLargo:n(p.objetivo),patologias:n(p.patologias),alergias:n(p.alergias),intol:n(p.intolerancias),lesiones:n(p.lesiones),medicacion:n(p.medicacion),suplem:n(p.suplementacion),ciclo:n(p.ciclo),histDietas:n(p.historialDietas),prefs:n(p.preferencias),evitar:n(p.alimentosEvitar),sueno:n(p.horasSueno),estres:n(p.estres),motiv:n(p.motivacion),
    omega3:n(p.supOmega3),vitD:n(p.supVitD),b12:n(p.supVitB12),magnesio:n(p.supMagnesio),vitC:n(p.supVitC),hierro:n(p.supHierro),calcio:n(p.supCalcio),zinc:n(p.supZinc),folato:n(p.supFolato),potasio:n(p.supPotasio),creatina:n(p.supCreatina),colageno:n(p.supColageno),cafeina:n(p.supCafeina),multi:p.supMulti==='yes'?'yes':'no',supOtros:n(p.supOtros),
    sal:n(p.lifeSal),sol:n(p.lifeSol),agua:n(p.lifeAgua),cafe:n(p.lifeCafe),alcohol:n(p.lifeAlcohol),tabaco:n(p.lifeTabaco),aire:n(p.lifeAire),pantallas:n(p.lifePantallas),lifeNotas:n(p.lifeNotas)})}
function impAdmin(id,c){const p=c.profile||{};const dt=v=>/^\d{4}-\d{2}-\d{2}/.test(v||'')?String(v).slice(0,10):null;const num=v=>v===''||v==null||isNaN(+v)||+v===0?null:+v;
  return {client_id:id,estado:['active','paused','ended','trial'].includes(p.subStatus)?p.subStatus:'active',alta:dt(p.subStartDate)||dt(c.createdAt),tipo:p.subType||null,renovacion:dt(p.subRenewalDate),pago:num(p.subPayment),cheatmeals:num(p.subCheatmeals)==null?null:Math.round(+p.subCheatmeals),pausa:dt(p.subPauseDate),baja:dt(p.subEndDate),notas:p.subNotes||null}}
function impChecks(id,c){return (c.measurements||[]).filter(m=>m.date).map(m=>{const v=x=>x===null||x===undefined||x===''||isNaN(+x)?undefined:+x;
  const sc=[['Energía',m.energia],['Hambre',m.hambre],['Sueño',m.sueno],['Ánimo',m.animo]].filter(x=>x[1]!=null&&x[1]!=='').map(x=>x[0]+' '+x[1]+'/10').join(' · ');
  const data={peso:v(m.peso),cuello:v(m.cuello),torso:v(m.torso),cintura:v(m.cintura),cadera:v(m.cadera),gluteo:v(m.gluteo),biceps:v(m.brazoD),pierna:v(m.piernaD),fotos:0,r:{},importado:true,nota:[m.notas,sc,m.grasa?('Grasa estimada '+m.grasa+' %'):''].filter(Boolean).join(' — ')};
  Object.keys(data).forEach(k=>data[k]===undefined&&delete data[k]);return {client_id:id,fecha:String(m.date).slice(0,10),data}})}
function calcEnsure(){return new Promise(res=>{if(CALC.frame&&CALC.ready)return res();if(!CALC.frame){const f=document.createElement('iframe');f.src='calc/index.html?embed=1';f.title='Calculadora de dietas';f.className='calc-frame';CALC.frame=f;calcWrap().appendChild(f)}CALC.readyCb=res})}
function calcExportFor(client){return new Promise((res)=>{const t=setTimeout(()=>res(null),15000);CALC.loadedCb=()=>{CALC.exportCb=d=>{clearTimeout(t);res(d)};calcPost({type:'export'})};calcPost({type:'load',client,customFoods:[],tab:'protocol'})})}
async function runImport(){
  if(!IMP||IMP.running)return;const sel=[...document.querySelectorAll('#impBox input[data-i]:checked')].map(x=>IMP.d.clients[+x.dataset.i]);if(!sel.length){toast('Marca al menos un cliente');return}
  IMP.running=true;const btn=document.getElementById('impGo');btn.disabled=true;const log=document.getElementById('impLog');
  try{await flushSync()}catch(e){}try{await calcFlush()}catch(e){}
  CALC.busy=true;await calcEnsure();let okN=0;const fails=[];
  if(Array.isArray(IMP.d.customFoods)&&IMP.d.customFoods.length){try{const cur=await db.getSetting('customFoods')||[];const ids=new Set(cur.map(f=>f.id));await db.setSetting('customFoods',cur.concat(IMP.d.customFoods.filter(f=>!ids.has(f.id))))}catch(e){}}
  for(let i=0;i<sel.length;i++){const c0=sel[i];log.textContent=`Importando ${i+1} de ${sel.length}: ${c0.name}…`;
    try{
      const c=JSON.parse(JSON.stringify(c0));(c.measurements||[]).forEach(m=>{['photoFront','photoSide','photoBack'].forEach(k=>{if(m[k])m[k]=null})});
      const ficha=impFicha(c);const email=`pendiente.${impSlug(c.name)}.${Math.random().toString(36).slice(2,6)}@yaronskafit.invalid`;ficha.email=email;
      const hasProto=!!(c0.protocol&&c0.protocol.v===2);
      const id=await db.insertClientRow({email,ficha,prefs:{},fase:0,semana:1,semanas_fase:4,kcal:1800,rest_on:true,plan:null,rutina:[],pautas:{}});
      await db.upsertAdmin(impAdmin(id,c));
      await db.insertMany('checkins',impChecks(id,c));
      c.id=id;CALC.forId=id;
      let plan=null;if(hasProto){const ex=await calcExportFor(c);if(ex&&!ex.error)plan=ex}
      await db.saveDietCalc(id,c);
      if(plan)await db.updateClient(id,{plan,rest_on:!!plan.R});
      okN++;
    }catch(e){console.error(e);fails.push(c0.name)}
  }
  CALC.busy=false;CALC.forId=null;IMP.running=false;
  log.innerHTML=`<b style="color:var(--ok)">Importados: ${okN}</b>${fails.length?` · <b class="badc">Fallaron: ${esc(fails.join(', '))}</b>`:''}. Pon el email real de cada uno en su Ficha antes de invitarle.`;
  btn.textContent='Hecho';
  await refreshList();if(!CUR&&CL.length){coachSel=CL[0].id;await loadClient(coachSel)}renderCoach();
}

async function delClient(){
  if(!CUR)return;const n=CLIENT.name;const t=prompt(`Para eliminar a ${n} y TODOS sus datos, escribe su nombre exactamente:`);
  if(t===null)return;if(t.trim()!==n.trim()){toast('El nombre no coincide. No se ha borrado nada.');return}
  try{SNAP=null;PENDING=false;CALC.pending=null;await db.deleteClient(CUR.id);toast('Cliente eliminado');CUR=null;await refreshList();if(CL.length){coachSel=CL[0].id;await loadClient(coachSel)}else{S=emptyS();FICHA=S.ficha}coachTab='ficha';renderCoach()}
  catch(e){toast('No se ha podido eliminar: '+authMsg(e))}
}

function pinRange(){const W=allWeights();if(!W.length)return;const last=W[W.length-1].date;const a=wFrom||'',b=wTo||'';
  FICHA.wFrom=a&&a>W[0].date?a:'';FICHA.wTo=b&&b<last?b:'';save();toast(FICHA.wFrom||FICHA.wTo?'Listo: el cliente solo ve ese rango':'El rango era todo: el cliente lo ve completo');renderCoach()}

function warmEdit(di,k,v){const d=S.routine[di];d.warm=Object.assign({txt:'',url:''},d.warm||{},{[k]:v.trim()});save()}
