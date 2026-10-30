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
  stepsGoal:{get:()=>{const f=FICHA||FICHA_DEF;return +(isTrainToday()?f.pasosT:f.pasosR)||0}}});
// ¿Hoy entrena? Lo que marque el cliente hoy; si no, sus días fijos (en «rotación» no hay días fijos)
function isTrainToday(){try{const d=S&&S.daily&&S.daily[iso(new Date())];if(d&&d.tipo)return d.tipo==='T';if(d&&d.train===true)return true}catch(e){}const f=FICHA||FICHA_DEF;return f.diasModo!=='libre'&&(f.dias||[]).includes(new Date().getDay())}
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
const PROFILE_DEF={foto:'',nCheck:true,nDaily:true,nTrain:true,hora:'21:00',unid:'kg',consent:false};
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
const hBody=(n,h)=>({client_id:CUR.id,fecha:h.date,dia:h.day||null,ejercicio:n,sets:h.sets,nota:h.nota||null});
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
  d.logs.forEach(l=>{(S.hist[l.ejercicio]=S.hist[l.ejercicio]||[]).push({id:l.id,date:l.fecha,day:l.dia||'',sets:l.sets||[],nota:l.nota||'',ts:Date.parse(l.created_at)})});
  // Una pauta deja de mostrarse cuando el cliente ya ha entrenado ese ejercicio después de pautarla
  Object.entries(c.pautas||{}).forEach(([n,p])=>{const h=S.hist[n]||[];if(!p.ts||!h.some(x=>x.ts>p.ts))S.next[n]=p});
  FICHA=S.ficha;CUR={id:c.id,email:c.email};
  SNAP={client:J(clientRow()),admin:d.admin?J(adminRow()):null,profile:J({n:FICHA.nombre,t:FICHA.tel,p:S.profile}),w:{},c:{},d:{},h:{}};
  S.weights.forEach(w=>SNAP.w[w.id]=J(wBody(w)));S.checkins.forEach(x=>SNAP.c[x.id]=J(cBody(x)));
  Object.entries(S.daily).forEach(([k,v])=>SNAP.d[k]=J(v));Object.entries(S.hist).forEach(([n,a])=>a.forEach(h=>SNAP.h[h.id]=J(hBody(n,h))));
}
async function loadClient(id){
  const d=await db.loadClient(id,ME.role==='coach');fromDb(d);
  dayIdx=0;today={};ck={};dayType=isTrainToday()?'T':'R';wFrom='';wTo='';exSel='';sesSel='';planPrev=null;
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
      <div class="auth-links"><button type="button" onclick="showAuth('signup')">Es mi primera vez: crear mi cuenta</button><button type="button" onclick="showAuth('forgot')">He olvidado mi contraseña</button><a href="privacidad.html" target="_blank" rel="noopener" class="small muted">Política de privacidad</a></div>`,
    signup:`${AUTH_BRAND}<h1>Crea tu <em>cuenta</em></h1>${note}<p class="small muted">Usa el mismo email que le diste a Yaron.</p><form onsubmit="doSignup(event)">${f('aE','Email','email','email')}${f('aP','Contraseña (mín. 8 caracteres)','password','new-password')}${f('aP2','Repite la contraseña','password','new-password')}<label class="consent"><input type="checkbox" id="aOk" required> <span>He leído la <a href="privacidad.html" target="_blank" rel="noopener">política de privacidad</a> y acepto el tratamiento de mis datos, incluidos los de salud, para el seguimiento de mi programa.</span></label><button class="btn" type="submit">Crear mi cuenta</button></form>
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
  const sh=document.getElementById('sheet');if(!sh.hidden)return;
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
      await refreshList();if(CL.length){coachSel=CL[0].id;await loadClient(coachSel)}else{CUR=null;SNAP=null}loadPend().then(()=>{pendCount()});bkInit();
    }else{
      if(!ME.clientId)return showAuth('nolink');
      await loadClient(ME.clientId);
      if(!S.profile.consent){document.getElementById('auth').hidden=false;return showConsent()}
    }
  }catch(err){console.error(err);return showAuth('error','No se han podido cargar tus datos: '+authMsg(err))}
  if(RECOVERY)return showAuth('newpass','Escribe tu contraseña nueva.');
  document.getElementById('auth').hidden=true;document.getElementById('app').hidden=false;
  document.querySelector('.seg').hidden=ME.role!=='coach';document.getElementById('outBtn').hidden=ME.role!=='coach';
  document.getElementById('pkBtn').hidden=ME.role!=='coach'||!db.passkeySupported;
  const go0=new URLSearchParams(location.search).get('go');tab=['home','food','train','check','res'].includes(go0)?go0:'home';if(go0)history.replaceState(null,'',location.pathname);setView(ME.role==='coach'?'coach':'client');
  if(ME.role==='client'){pushSilent();seenStart()}
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
// Peso y % graso en la MISMA gráfica: peso a la izquierda (kg), % graso a la derecha (línea discontinua naranja)
function dualChart(A,B,opt){opt=opt||{};if(A.length<2&&B.length<2)return '<p class="small muted" style="margin:0">Hacen falta al menos 2 registros para dibujar la gráfica.</p>';
  const W=opt.w||340,H=opt.h||170,L=36,R=38,T=14,Bm=22;const all=A.concat(B).map(p=>p.d).sort();const t0=+new Date(all[0]+'T12:00'),t1=+new Date(all[all.length-1]+'T12:00');
  const x=d=>t1>t0?L+(new Date(d+'T12:00')-t0)/(t1-t0)*(W-L-R):(L+W-R)/2;
  const sc=P=>{const v=P.map(p=>p.v);let mn=Math.min(...v),mx=Math.max(...v);const pd=(mx-mn)*0.15||1;return [mn-pd,mx+pd]};
  const [a0,a1]=A.length?sc(A):[0,1],[b0,b1]=B.length?sc(B):[0,1];
  const ya=v=>T+(1-(v-a0)/(a1-a0))*(H-T-Bm),yb=v=>T+(1-(v-b0)/(b1-b0))*(H-T-Bm);
  const ca=opt.color||'#FFD60A',cb='#FF8C28';
  const grid=[0,.5,1].map(f=>{const y=T+f*(H-T-Bm);return `<line x1="${L}" x2="${W-R}" y1="${y}" y2="${y}" stroke="#2E2A24"/>${A.length?`<text x="${L-6}" y="${y+3}" text-anchor="end">${nf(a1-f*(a1-a0))}</text>`:''}${B.length?`<text x="${W-R+6}" y="${y+3}" fill="${cb}">${nf(b1-f*(b1-b0))}%</text>`:''}`}).join('');
  const ln=(P,y)=>P.map(p=>`${x(p.d).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
  const la=A.length?`<polygon points="${x(A[0].d)},${H-Bm} ${ln(A,ya)} ${x(A[A.length-1].d)},${H-Bm}" fill="${ca}" opacity=".10"/><polyline points="${ln(A,ya)}" fill="none" stroke="${ca}" stroke-width="2.2" stroke-linejoin="round"/>${A.map((p,i)=>`<circle cx="${x(p.d)}" cy="${ya(p.v)}" r="${i===A.length-1?4:2.5}" fill="${ca}"><title>${fdate(p.d)}: ${nf(p.v)} kg</title></circle>`).join('')}`:'';
  const lb=B.length?`<polyline points="${ln(B,yb)}" fill="none" stroke="${cb}" stroke-width="2" stroke-dasharray="5 4" stroke-linejoin="round"/>${B.map((p,i)=>`<rect x="${x(p.d)-3}" y="${yb(p.v)-3}" width="6" height="6" fill="${cb}" transform="rotate(45 ${x(p.d)} ${yb(p.v)})"><title>${fdate(p.d)}: ${nf(p.v)} % graso</title></rect>`).join('')}`:'';
  const lab=`<text x="${L}" y="${H-6}">${fdate(all[0])}</text><text x="${W-R}" y="${H-6}" text-anchor="end">${fdate(all[all.length-1])}</text>`;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Peso y % graso">${grid}${la}${lb}${lab}</svg>
  <div class="legend"><span><i style="background:${ca}"></i>Peso (kg)</span>${B.length?`<span><i class="dash" style="border-color:${cb}"></i>% graso</span>`:''}</div>`}
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
function setView(v){view=v;document.getElementById('app').classList.toggle('vc',v==='client');setTimeout(()=>{if(typeof placeCalc==='function')placeCalc()});document.getElementById('vClient').classList.toggle('on',v==='client');document.getElementById('vCoach').classList.toggle('on',v==='coach');
  document.getElementById('clientView').hidden=v!=='client';document.getElementById('coachView').hidden=v!=='coach';if(v==='coach')renderCoach();else render();window.scrollTo(0,0)}
function go(t){tab=t;render();window.scrollTo(0,0)}
let R_BUSY=false;
function render(){if(R_BUSY)return void setTimeout(render);R_BUSY=true;try{_render()}finally{R_BUSY=false}}
function _render(){
  document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));
  const el=document.getElementById('screen');
  el.classList.toggle('restmode',(tab==='food')&&dayType==='R');
  el.innerHTML=({home:vHome,food:vFood,train:vTrain,check:vCheck,res:vRes,perfil:vPerfil,cuest:vCuest})[tab]();
  if(tab==='perfil'){PK_AFTER=fillPk;fillPk()}
  if(tab==='train')draftApply();
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
    <div id="pushBox">${pushStatusHTML()}</div>
    ${sw('nCheck','Revisión semanal','La víspera y la mañana del '+CLIENT.checkDay.toLowerCase())}${sw('nDaily','Registro diario','Si no has apuntado tu día, te lo recuerdo')}
    <div class="field"><label for="ph">Hora del recordatorio diario</label><input id="ph" type="time" value="${esc(p.hora||'21:00')}" onchange="pSet('hora',this.value)"></div></section>
  <section class="pcard"><span class="lbl">Preferencias</span>
    <div class="field"><label for="pu">Unidades de peso</label><select id="pu" onchange="pSet('unid',this.value)" style="background:var(--surface);border:1px solid var(--line-2);border-radius:8px;padding:10px;color:var(--fg)"><option value="kg" ${p.unid==='kg'?'selected':''}>Kilos (kg)</option><option value="lb" ${p.unid==='lb'?'selected':''}>Libras (lb)</option></select></div></section>
  <section class="pcard"><span class="lbl">Privacidad</span>
    <label class="prow"><span>Acepto el tratamiento de mis datos de salud<small>Necesario para tu seguimiento · <a href="privacidad.html" target="_blank" rel="noopener">Política de privacidad</a></small></span><input class="sw" type="checkbox" ${p.consent?'checked':''} ${ME.role==='coach'?'disabled':''} onchange="consentToggle(this)" aria-label="Consentimiento de datos de salud"></label>
    <button class="btn ghost sm" type="button" onclick="pExport()">Descargar mis datos</button>
    <button class="btn ghost sm" type="button" onclick="window.open('https://wa.me/'+WA+'?text='+encodeURIComponent('Hola Yaron, quiero solicitar la baja del programa.'),'_blank')">Solicitar la baja del programa</button></section>
  <button class="btn ghost" type="button" onclick="logout()">Cerrar sesión</button>`;
}
function vHome(){
  const ph=phOf(FICHA,S.phase);const pct=Math.round(S.week/S.weeksPhase*100);
  const W=clientWeights();const first=W[0]||{peso:0},last=W[W.length-1]||{peso:0};const diff=last.peso-first.peso;const ok=goodDir(diff);
  return `<div class="hello-row"><div class="hello"><span class="lbl">${esc(CLIENT.program)}</span><h1>Hola, <em>${esc(CLIENT.first)}</em></h1></div><button class="me" type="button" onclick="go('perfil')" aria-label="Perfil y ajustes">${avHTML()}</button></div>
  ${revCard()}
  ${vRemind()}
  ${pushCard()}
  <section class="wchart" aria-label="Tu evolución">
    <div class="sec-h"><span class="lbl">Tu evolución · peso${FICHA.showFat?' y % graso':''}</span><span class="small muted">Objetivo: ${CLIENT.goal==='perder'?'perder grasa':'ganar músculo'}</span></div>
    ${!W.length?`<p class="small muted" style="margin:0">Aquí verás tu evolución en cuanto envíes tu primer check-in con tu peso.</p>`:`<div class="wstats"><div><small>${FICHA.wFrom?'Desde '+fdate(first.date):'Inicio'}</small><b>${nf(first.peso)} kg</b></div><div><small>Ahora</small><b>${nf(last.peso)} kg</b></div><div><small>Cambio</small><b class="${ok?'good':'badc'}">${diff>0?'+':''}${nf(diff)} kg</b></div></div>
    ${(()=>{const a=FICHA.wFrom||'',b=FICHA.wTo||'';const F=FICHA.showFat?fatSeries().filter(x=>(!a||x.date>=a)&&(!b||x.date<=b)):[];const P=W.map(w=>({d:w.date,v:w.peso}));
      return F.length?`${fatStats(F,FICHA.wFrom?'Desde '+fdate(F[0].date):'Inicio')}${dualChart(P,F.map(x=>({d:x.date,v:x.v})),{color:ok?'#7CE38B':'#FFD60A'})}`:lineChart(P,{u:' kg',label:'Evolución del peso',color:ok?'#7CE38B':'#FFD60A'})})()}
    <div class="verdict ${ok?'':'no'}">${ok?`Vas en la dirección correcta: ${nf(Math.abs(diff))} kg ${diff<0?'menos':'más'} desde que empezaste.`:'Esta semana toca ajustar: lo vemos en la revisión.'}</div>`}
  </section>
  ${streakCard()}
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
  const isTrain=isTrainToday();const tipoSet=!!(d.tipo||d.train===true);const libre=FICHA.diasModo==='libre';
  const week=[6,5,4,3,2,1,0].map(i=>{const dd=daysAgo(i);const v=S.daily[iso(dd)];let c='';if(v){const n=[v.diet,v.train===null?true:v.train,v.stepsOk].filter(Boolean).length;c=n===3?'full':n>0?'part':''}return `<span>${'DLMXJVS'[dd.getDay()]}<em class="${c}">${v?(c==='full'?'✓':'·'):''}</em></span>`}).join('');
  const tg=(key,ico,lbl)=>`<button type="button" class="tg ${t[key]?'on':''}" onclick="today.${key}=!(${JSON.stringify(!!t[key])});render()" aria-pressed="${!!t[key]}"><i>${t[key]?'✓':ico}</i>${lbl}</button>`;
  const mini=(key,lbl)=>`<span>${lbl}</span><div class="dots">${[1,2,3,4,5].map(n=>`<button type="button" class="${t[key]===n?'on':''}" onclick="today.${key}=${n};render()" aria-label="${lbl} ${n}">${n}</button>`).join('')}</div>`;
  return `<section class="daily" aria-label="Objetivos de hoy">
    <div class="daily-h"><h2>Hoy</h2><span class="small muted">${new Date().toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})} · ${isTrain?'día de entreno':'día de descanso'}</span></div>
    ${S.routine.length?`<button type="button" class="wkhome" onclick="trainTab='rutina';go('train')">${(()=>{const T=wkTrain();return `🏋️ <span>Entrenos de la semana: <b>${T.done} de ${T.target}</b></span><span class="wkdots">${Array.from({length:T.target},(_,i)=>`<i class="${i<T.done?'on':''}"></i>`).join('')}</span><small>${T.left?`Te ${T.left===1?'queda':'quedan'} ${T.left}`:'✅ Completada'}</small>`})()}</button>`:''}
    <div class="daytog"><span class="small muted">${libre&&!tipoSet?'¿Hoy entrenas?':'Hoy es'}</span><div class="seg2"><button type="button" class="chip ${isTrain&&(tipoSet||!libre)?'on':''}" onclick="setDayTipo('T')">🏋️ Día de entreno</button><button type="button" class="chip ${!isTrain&&(tipoSet||!libre)?'on':''}" onclick="setDayTipo('R')">🏠 Descanso</button></div></div>
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
function exSets(e){const a=[];for(let i=0;i<e.s;i++){const x=(e.sets||[])[i]||{};a.push({t:x.t||'',kg:x.kg||e.kg||'',reps:x.reps||e.r,rpe:x.rpe||e.rir,rest:x.rest||e.rest,nota:x.nota||''})}return a}
const detailed=e=>{const a=exSets(e);return a.some(x=>x.t||x.nota)||new Set(a.map(x=>x.kg+'|'+x.reps+'|'+x.rpe+'|'+x.rest)).size>1};
function blocksOf(ex){const out=[];let cur=null;ex.forEach((e,ei)=>{if(e.blk&&cur&&cur.letter===e.blk)cur.items.push({e,ei});else{cur={letter:e.blk||'',type:e.blkT||'',items:[{e,ei}]};out.push(cur)}});
  let n=0;out.forEach(b=>{n++;b.items.forEach((it,k)=>{it.label=b.letter&&b.items.length>1?b.letter+(k+1):String(n)})});return out}
const rpeTxt=e=>{const u=[...new Set(exSets(e).map(x=>x.rpe))].filter(Boolean);return u.length>1?u[0]+' → '+u.slice(1).map(x=>String(x).replace('RPE ','')).join(' → '):(u[0]||e.rir||'')};
function suggestion(e){
  if(/ s$/.test(e.r))return null;
  const h=(S.hist[e.n]||[]).filter(x=>x.sets&&x.sets.length);const last=h[h.length-1];if(!last)return null;
  const top=parseInt(String(e.r).split('-').pop())||10;const kg=Math.max(...last.sets.map(s=>s.kg));
  const done=last.sets.every(s=>s.reps>=top);
  return done?{kg:kg+(kg>=20?2.5:1),txt:`${e.r} reps`,why:'Llegaste al tope de repeticiones: sube peso'}:{kg,txt:`intenta +1 rep por serie`,why:'Mismo peso, busca una repetición más'};
}
function exCard(e,ei,label){
  const h=S.hist[e.n]||[];const last=h[h.length-1];const lastS=[...h].reverse().find(x=>x.sets&&x.sets.length);const det=detailed(e);const sg=det||e.kg?null:suggestion(e);const SS=exSets(e);const nx=S.next[e.n];
  const rk=exRank(e.n);
  return `<article class="ex"><div class="ex-h"><span class="ex-n">${esc(label)}</span><div><b>${esc(e.n)}</b><small>${esc(musOf(e))}</small>${rk?`<div style="margin-top:4px">${rankBadge(rk)}</div>`:''}</div>${e.vid&&!e.v?'':`<a class="vid" href="${esc(e.v||yt(e.n))}" target="_blank" rel="noopener">▶ Vídeo</a>`}</div>
    ${e.vid?exVid(e.vid):''}
    ${det?`<ol class="setplan">${SS.map((x,i)=>`<li><span class="sn">${i+1}</span>${x.t?`<em class="stag t-${x.t}">${esc((SET_T.find(t=>t[0]===x.t)||['',''])[1])}</em>`:''}<span>${x.kg?esc(String(x.kg).replace('.',','))+' kg × ':''}${esc(x.reps)}${/ s$/.test(x.reps)?'':' reps'}${x.rpe?' · '+esc(x.rpe):''}${x.rest?' · desc. '+esc(x.rest):''}</span>${x.nota?`<small>${esc(x.nota)}</small>`:''}</li>`).join('')}</ol>`
      :`<div class="presc"><span>${e.s} series</span>${e.kg?`<span><b>${esc(String(e.kg).replace('.',','))} kg</b></span>`:''}<span>${esc(e.r)}${/ s$/.test(e.r)?'':' reps'}</span><span>${esc(rpeTxt(e))}</span><span>Descanso ${esc(e.rest)}</span></div>`}
    ${e.aprox?`<div class="aprox"><b>Series de aproximación</b><span>${esc(e.aprox)}</span></div>`:''}
    ${nx&&nx.sets?`<div class="target" style="border-color:var(--ok);background:rgba(124,227,139,.08);flex-direction:column;align-items:stretch;gap:4px"><span>Pautado por Yaron${nx.nota?' · <small class="muted">'+esc(nx.nota)+'</small>':''}</span>${nx.sets.map((x,i)=>x.kg||x.reps||x.int?`<b style="color:var(--ok);font-size:13px">Serie ${i+1}${SS[i]&&SS[i].t?' · '+esc(SET_S[SS[i].t]||''):''}: ${[x.kg?esc(x.kg)+' kg':'',x.reps?'× '+esc(x.reps):'',x.int?'· '+esc(x.int):''].filter(Boolean).join(' ')}</b>`:'').join('')}</div>`
    :nx?`<div class="target" style="border-color:var(--ok);background:rgba(124,227,139,.08)"><span>Pautado por Yaron${nx.nota?' · <small class="muted">'+esc(nx.nota)+'</small>':''}</span><b style="color:var(--ok)">${[nx.kg?esc(nx.kg)+' kg':'',nx.reps?'× '+esc(nx.reps):'',nx.int?'· '+esc(nx.int):''].filter(Boolean).join(' ')}</b></div>`:sg?`<div class="target"><span>Objetivo hoy · <small class="muted">${esc(sg.why)}</small></span><b>${nf(sg.kg,1).replace(',0','')} kg · ${esc(sg.txt)}</b></div>`:''}
    <div class="sets2"><span class="h">#</span><span class="h">Semana pasada</span><span class="h">Kg</span><span class="h">Reps</span><span class="h">RIR real</span>
    ${SS.map((x,si)=>{const p=lastS&&(lastS.sets.find(z=>z.i===si)||(lastS.sets[si]&&lastS.sets[si].i===undefined?lastS.sets[si]:null));return `<span class="sidx">${si+1}${x.t&&SET_S[x.t]?`<small>${SET_S[x.t]}</small>`:''}</span><span class="prev">${p?`${nf(p.kg,1).replace(',0','')} kg × ${p.reps}<br>RIR ${p.rir??'—'}`:'—'}</span><input id="kg-${dayIdx}-${ei}-${si}" inputmode="decimal" placeholder="${nx&&nx.sets&&nx.sets[si]&&nx.sets[si].kg?esc(nx.sets[si].kg):nx&&nx.kg?esc(nx.kg):x.kg?esc(String(x.kg).replace('.',',')):p?nf(p.kg,1).replace(',0',''):'kg'}" aria-label="Kilos serie ${si+1}"><input id="rp-${dayIdx}-${ei}-${si}" inputmode="numeric" placeholder="${p?p.reps:'reps'}" aria-label="Repeticiones serie ${si+1}" onchange="restGo(${dayIdx},${ei},${si},this)"><input id="ri-${dayIdx}-${ei}-${si}" inputmode="numeric" placeholder="RIR" aria-label="RIR real serie ${si+1}">`}).join('')}</div>
    <details class="exnote"><summary>💬 Nota para Yaron <small class="muted">· cambio, dolor, molestia…</small></summary><textarea id="nt-${dayIdx}-${ei}" rows="2" placeholder="Ej.: molestia en el hombro derecho en la última serie / cambié a mancuernas porque la máquina estaba ocupada"></textarea><small class="muted">Se envía al guardar el entreno. Si hoy no has podido hacerlo, puedes guardar solo la nota.</small></details>
    ${last?`<div class="small muted">Última sesión: ${fdate(last.date)}${last.nota?` · <span class="y">tu nota: «${esc(last.nota)}»</span>`:''}</div>`:''}</article>`;
}
const OPT_TXT='Esta sesión es opcional: hazla si esta semana tienes tiempo y energía. Si no, no pasa nada, tu progreso no depende de ella.';
// ---- entrenos de la semana (lunes a domingo): hechos y los que quedan
function wkTrain(){const W=volWeek(0);const R=S.routine;const optN=new Set(R.filter(d=>d.opt).map(d=>d.d));const ses={};
  Object.values(S.hist).forEach(a=>a.forEach(h=>{if(h.date>=W.a&&h.date<=W.b&&h.sets&&h.sets.length){const k=h.date+'|'+(h.day||'');ses[k]={date:h.date,day:h.day||''}}}));
  const L=Object.values(ses);const req=L.filter(x=>!optN.has(x.day)),opt=L.filter(x=>optN.has(x.day));
  const nReq=R.filter(d=>!d.opt).length;const target=Math.max(1,+FICHA.diasSemana||nReq||1);const done=req.length;
  const dayDone=d=>{const x=L.filter(y=>y.day===d.d).sort((a,b)=>b.date.localeCompare(a.date))[0];return x?x.date:null};
  return {done,target,left:Math.max(0,target-done),opt:opt.length,dayDone}}
const wdName=dt=>new Date(dt+'T12:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric'});
function wkBar(){const T=wkTrain();if(!S.routine.length)return '';
  return `<div class="wkt ${T.left?'':'full'}"><div><span class="lbl">Entrenos de esta semana</span><b>${T.done} de ${T.target}${T.opt?` <small class="muted">+ ${T.opt} opcional</small>`:''}</b></div><div class="wkdots">${Array.from({length:T.target},(_,i)=>`<i class="${i<T.done?'on':''}"></i>`).join('')}</div><small>${T.left?`Te ${T.left===1?'queda':'quedan'} <b>${T.left}</b> entreno${T.left===1?'':'s'}`:'✅ ¡Semana completada!'}</small></div>`}
let trainTab='rutina';
const trainTabs=()=>`<div class="tabs">${[['rutina','Mi rutina'],['progreso','📈 Progreso'],['volumen','📊 Volumen'],['rangos','🏅 Rangos']].map(([k,l])=>`<button type="button" class="${trainTab===k?'on':''}" onclick="trainTab='${k}';render()">${l}</button>`).join('')}</div>`;
function vTrain(){
  if(trainTab==='rangos')return `<div class="hello"><span class="lbl">Entrenamiento</span><h1>Tus <em>rangos</em></h1></div>${trainTabs()}${vRanks()}`;
  if(trainTab==='progreso')return `<div class="hello"><span class="lbl">Entrenamiento</span><h1>Tu <em>progreso</em></h1></div>${trainTabs()}${vProgress()}`;
  if(trainTab==='volumen')return `<div class="hello"><span class="lbl">Entrenamiento</span><h1>Tu <em>volumen</em></h1></div>${trainTabs()}${vVolume(false)}`;
  const R=S.routine;if(!R.length)return `<div class="hello"><span class="lbl">Entrenamiento</span><h1>Tu <em>rutina</em></h1></div><div class="empty">Tu rutina aparecerá aquí en cuanto Yaron te la asigne.</div>`;if(dayIdx>=R.length)dayIdx=0;const d=R[dayIdx];const WK=wkTrain();
  return `<div class="hello"><span class="lbl">Entrenamiento</span><h1>Tu <em>rutina</em></h1></div>
  ${trainTabs()}
  ${wkBar()}
  <div class="daysel">${R.map((r,i)=>{const dn=WK.dayDone(r);return `<button type="button" class="chip ${r.opt?'opt':''} ${dn?'done':''} ${i===dayIdx?'on':''}" onclick="dayIdx=${i};render()">${dn?'✓ ':''}${esc(r.d.split('·')[0].trim())}${r.opt?' <small>(opcional)</small>':''}</button>`}).join('')}</div>
  <h2 style="font-size:19px">${esc(d.d)}${d.opt?' <span class="optb">Opcional</span>':''}</h2>
  ${d.opt?`<div class="band optband">${esc(d.optTxt||OPT_TXT)}</div>`:''}
  ${WK.dayDone(d)?`<div class="band donebar">✅ <b>Hecho</b> el ${esc(wdName(WK.dayDone(d)))}. Si lo repites, se guarda como otra sesión.</div>`:''}
  ${warmsOf(d).map((w,wi,a)=>`<article class="warm"><div class="ex-h"><span class="ex-n">🔥</span><div><b>${esc(w.t||('Calentamiento'+(a.length>1?' '+(wi+1):'')))}</b>${w.txt?`<small style="white-space:pre-line">${esc(w.txt)}</small>`:''}</div>${w.url?`<a class="vid" href="${esc(w.url)}" target="_blank" rel="noopener">▶ Vídeo</a>`:''}</div></article>`).join('')}
  ${blocksOf(d.ex).map(b=>b.letter&&b.items.length>1?`<section class="blk"><div class="blk-h"><b>${esc(blkName(b.type))} ${esc(b.letter)}</b><small>Haz ${b.items.map(x=>x.label).join(' + ')} seguidos, sin descanso entre ejercicios. Descansa ${esc(b.items[b.items.length-1].e.rest||'')} al acabar cada ronda.</small></div>${b.items.map(x=>exCard(x.e,x.ei,x.label)).join('')}</section>`:b.items.map(x=>exCard(x.e,x.ei,x.label)).join('')).join('')}
  <button class="btn" type="button" onclick="saveSession()">Guardar entreno</button>`;
}
function saveSession(){
  const d=S.routine[dayIdx];let any=false;const date=iso(new Date());const PRS=[];
  d.ex.forEach((e,ei)=>{const sets=[];const SS=exSets(e);for(let si=0;si<e.s;si++){const g=id=>document.getElementById(id).value.replace(',','.');const kg=parseFloat(g(`kg-${dayIdx}-${ei}-${si}`)),reps=parseInt(g(`rp-${dayIdx}-${ei}-${si}`)),rir=parseInt(g(`ri-${dayIdx}-${ei}-${si}`));if(kg>=0&&reps>0){const o={kg,reps,rir:isNaN(rir)?null:rir,i:si};if(SS[si].t)o.t=SS[si].t;sets.push(o)}}
    const ntEl=document.getElementById(`nt-${dayIdx}-${ei}`);const nota=ntEl?ntEl.value.trim():'';
    if(sets.length){const pr=prCheck(e.n,sets);if(pr)PRS.push(pr)}
    if(sets.length||nota){any=true;const o={date,day:d.d,sets,ts:Date.now()};if(nota)o.nota=nota;(S.hist[e.n]=S.hist[e.n]||[]).push(o);if(sets.length)delete S.next[e.n]}});
  if(!any){toast('Apunta al menos una serie (kg y reps) o una nota');return}
  rtStop();SAVED_AT=Date.now();draftClear();
  const k=iso(new Date());S.daily[k]=Object.assign({steps:0,diet:false,stepsOk:false,estres:0,energia:0,animo:0},S.daily[k]||{},{train:true,tipo:'T'});
  save();render();const ws=[...d.ex].some(e=>(S.hist[e.n]||[]).some(h=>h.date===date&&h.sets&&h.sets.length));if(ws)doneSheet(d,PRS);else toast('Nota enviada a Yaron');
}
// ---- récords personales: se comparan con todas las sesiones anteriores de ese ejercicio
function prCheck(n,sets){const H=(S.hist[n]||[]).filter(h=>h.sets&&h.sets.length);if(!H.length)return null;
  const val=s=>s.kg>0?e1rm(s):s.reps;const prev=Math.max(...H.flatMap(h=>h.sets.map(val)));const best=sets.reduce((b,s)=>val(s)>val(b)?s:b,sets[0]);const now=val(best);
  if(!(now>prev+(best.kg>0?0.25:0)))return null;
  return {n,kg:best.kg,reps:best.reps,bw:!(best.kg>0),now,prev,up:best.kg>0?now-prev:now-prev}}
function prHTML(P){return P&&P.length?`<div class="prbox"><b>🏆 ${P.length>1?P.length+' récords nuevos':'¡Récord nuevo!'}</b>${P.map(x=>`<span><b>${esc(x.n)}</b>: ${x.bw?x.reps+' reps (+'+nf(x.up,0)+')':nf(x.kg,1).replace(',0','')+' kg × '+x.reps+` <small class="muted">· 1RM est. ${nf(x.now,1).replace(',0','')} kg (+${nf(x.up,1).replace(',0','')})</small>`}</span>`).join('')}</div>`:''}
function doneSheet(d,PRS){const T=wkTrain();const sh=document.getElementById('sheet');
  const msg=d.opt?'Sesión opcional hecha: esto es un extra 🔥':T.left?`Te ${T.left===1?'queda':'quedan'} <b>${T.left}</b> entreno${T.left===1?'':'s'} esta semana.`:'¡Has completado todos los entrenos de la semana! 💪';
  sh.innerHTML=`<div class="sheet-in" role="dialog" aria-label="Entreno hecho"><div class="sheet-b donesh"><div class="donebig">✅</div><h2>¡Entreno hecho!</h2><p class="muted" style="margin:0">${esc(d.d)}</p>
    <div class="wkdots big">${Array.from({length:T.target},(_,i)=>`<i class="${i<T.done?'on':''}"></i>`).join('')}</div>
    <p style="margin:0;font-size:16px"><b>${T.done} de ${T.target}</b> esta semana${T.opt?` · + ${T.opt} opcional`:''}</p><p style="margin:0">${msg}</p>${prHTML(PRS)}
    <button class="btn" type="button" onclick="closeSheet();window.scrollTo({top:0,behavior:'smooth'})">Genial</button></div></div>`;
  sh.hidden=false;sh.onclick=e=>{if(e.target===sh)closeSheet()}}
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
  </form>${revHistory()}`;
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
  save();ck={};go('home');ckDoneSheet(date);
}
function ckDoneSheet(date){const sh=document.getElementById('sheet');const nm=(FICHA.nombre||'').trim().split(' ')[0];
  const msg=`¡Hola Yaron! 👋 Ya está todo preparado ✅ Te acabo de enviar mi revisión ${date===iso(new Date())?'de hoy':'del '+fdate(date)} por la app.${nm?' — '+nm:''}`;
  sh.innerHTML=`<div class="sheet-in" role="dialog" aria-label="Revisión enviada"><div class="sheet-b donesh"><div class="donebig">✅</div><h2>¡Revisión enviada!</h2>
    <p style="margin:0">Yaron ya tiene tus medidas, fotos y respuestas en la app.</p><p class="muted small" style="margin:0">Avísale para que la revise cuanto antes:</p>
    <a class="btn wa" href="https://wa.me/${WA}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener" onclick="setTimeout(closeSheet,400)">💬 Avisar a Yaron por WhatsApp</a>
    <button class="btn ghost" type="button" onclick="closeSheet()">Ahora no</button></div></div>`;
  sh.hidden=false;sh.onclick=e=>{if(e.target===sh)closeSheet()}}
// ---- última conexión del cliente (para que el entrenador vea quién está activo)
setInterval(async()=>{if(!ME||ME.role!=='coach'||document.hidden)return;try{await refreshList();CL.forEach(c=>{const el=document.getElementById('seen-'+c.id);if(el)el.innerHTML=seenBadge(c.seen)})}catch(e){}},90000);
let seenT=0;function seenPing(){if(!ME||ME.role!=='client'||document.hidden)return;const n=Date.now();if(n-seenT<60000)return;seenT=n;db.touchSeen()}
let seenOn=false;function seenStart(){if(seenOn){seenPing();return}seenOn=true;seenPing();setInterval(seenPing,120000);document.addEventListener('visibilitychange',seenPing);['click','keydown','touchstart'].forEach(ev=>addEventListener(ev,seenPing,{passive:true}))}
function seenTxt(ts){if(!ts)return {t:'Nunca ha entrado',c:'never'};const m=(Date.now()-Date.parse(ts))/60000;
  if(m<5)return {t:'Activo ahora',c:'now'};if(m<60)return {t:'Hace '+Math.round(m)+' min',c:'recent'};const h=m/60;
  const d=new Date(ts);const hh=d.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
  if(iso(d)===iso(new Date()))return {t:'Hoy a las '+hh,c:'recent'};if(iso(d)===iso(daysAgo(1)))return {t:'Ayer a las '+hh,c:'old'};
  const dd=Math.floor(h/24);return {t:dd<7?'Hace '+dd+' días':'Hace '+(dd<30?Math.round(dd/7)+' sem.':Math.round(dd/30)+' meses'),c:dd>=7?'away':'old'}}
const seenBadge=ts=>{const x=seenTxt(ts);return `<span class="seen ${x.c}" title="${ts?new Date(ts).toLocaleString('es-ES'):''}">${x.c==='now'?'🟢 ':''}${esc(x.t)}</span>`};
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
    return {id:c.id,email:c.email,ficha:f,adm:a,linked:!!c.user_id,name:(f.nombre||'').trim()||c.email,foto:(c.prefs||{}).foto||'',fase:c.fase,semana:c.semana,
      renov:nextRenewal({renov:a.renovacion||'',tipo:a.tipo||'',alta:a.alta||''}),estado:a.estado||'active',seen:c.last_seen||null,...statusOf(L[c.id])}});
}
function coachItem(s){
  const live=CUR&&s.id===CUR.id;const name=live?CLIENT.name:s.name;const foto=live?S.profile.foto:s.foto;
  const ren=live?nextRenewal(FICHA):s.renov;const fase=live?S.phase:s.fase,sem=live?S.week:s.semana;
  return `<button type="button" class="citem ${s.id===coachSel?'on':''}" onclick="selectClient('${s.id}')"><span class="av">${foto?`<img src="${foto}" alt="">`:esc((name[0]||'?').toUpperCase())}</span><div><b>${esc(name)}</b><small>${esc(phOf(live?FICHA:s.ficha,fase).n)} · sem ${sem}</small>${ren?`<small style="display:block">Renueva: ${new Date(ren+'T12:00').toLocaleDateString('es-ES',{day:'numeric',month:'short'})}</small>`:''}${s.linked?`<small style="display:block" id="seen-${s.id}">${seenBadge(s.seen)}</small>`:''}</div><span class="st ${s.linked?s.st:'warn'}">${!s.linked?'Sin activar':s.st==='ok'?'Al día':s.st==='warn'?'Pendiente':'Revisar'}</span></button>`;
}
async function selectClient(id){
  if(CUR&&id===CUR.id&&!String(coachSel).startsWith('__'))return;if(CUR&&id===CUR.id){coachSel=id;renderCoach();return}
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
  const c=String(coachSel).startsWith('__')?null:CL.find(x=>CUR&&x.id===CUR.id);
  el.innerHTML=`<div class="coach">
  <aside class="clist" aria-label="Clientes"><button type="button" class="citem biz pendbtn ${coachSel==='__pend'?'on':''}" onclick="openPend()"><span class="av">📋</span><div><b>Pendientes de hoy</b><small>Revisiones, notas, inactivos y renovaciones</small></div>${PEND_N?`<span class="pendn">${PEND_N}</span>`:''}</button><button type="button" class="citem biz ${coachSel==='__biz'?'on':''}" onclick="openBiz()"><span class="av">📊</span><div><b>Mi negocio</b><small>Facturación, renovaciones y clientes</small></div></button><span class="lbl">Tus clientes · ${CL.length}</span>
    ${CL.map(coachItem).join('')}
    <button class="btn ghost sm" type="button" onclick="openInvite()">+ Nuevo cliente</button>
    <button class="btn ghost sm" type="button" onclick="openImport()">⇪ Importar de la Calculadora</button>
  </aside>
  <section class="cmain">
    ${coachSel==='__pend'?cPend():coachSel==='__biz'?cBiz():!c?`<div class="panel"><span class="lbl">Empieza aquí</span><p style="margin:0">Todavía no tienes clientes en la app. Pulsa <b>+ Nuevo cliente</b>, pon su nombre y su email, y envíale el mensaje con el enlace.</p></div>`:`
    <div class="chead"><div><span class="lbl">${esc(PROG().t)} · ${esc(phOf(FICHA,S.phase).n)} · semana ${S.week} de ${S.weeksPhase}</span><h1>${esc(CLIENT.name)}</h1>${c.linked?`<small class="muted">Última vez en la app: ${seenBadge(c.seen)}</small>`:''}${!c.linked?`<small class="muted">Aún no ha creado su cuenta · <button class="linkbtn" type="button" onclick="inviteMsg('${c.id}')">Reenviar invitación</button></small>`:''}</div><div class="row" style="justify-content:flex-end"><button class="btn ghost sm" type="button" onclick="openReport('report')">📄 Informe semanal</button><button class="btn ghost sm" type="button" onclick="openReport('cmp')">📸 Comparativa del físico</button><button class="btn ghost sm" type="button" onclick="openSocial()">📲 Imagen para redes</button><span class="st ${c.st}">${esc(c.t)}</span></div></div>
    <div class="panel"><span class="lbl">Programa, fase y semana · lo cambias tú cuando quieras</span><div class="range">
      <div class="field" style="flex:2"><label for="prS">Programa</label><select id="prS" onchange="FICHA.programa=this.value;S.phase=0;save();setTimeout(renderCoach)">${Object.entries(PROGS).map(([k,p])=>`<option value="${k}" ${progKey()===k?'selected':''}>${esc(p.t)}</option>`).join('')}</select></div>
      <div class="field" style="flex:2"><label for="phS">${PROG().w}</label><select id="phS" onchange="S.phase=+this.value;save();setTimeout(renderCoach)">${PH().map((p,i)=>`<option value="${i}" ${S.phase===i?'selected':''}>${PROG().w} ${i+1} · ${esc(p.n)}</option>`).join('')}</select></div>
      <div class="field"><label for="wkS">Semana actual</label><input id="wkS" type="number" min="1" max="52" value="${S.week}" onchange="S.week=Math.max(1,+this.value||1);if(S.week>S.weeksPhase)S.weeksPhase=S.week;save();setTimeout(renderCoach)"></div>
      <div class="field"><label for="wtS">Semanas de esta fase</label><input id="wtS" type="number" min="1" max="52" value="${S.weeksPhase}" onchange="S.weeksPhase=Math.max(S.week,+this.value||1);save();setTimeout(renderCoach)"></div></div>
      <p class="small muted" style="margin:0">Alarga o acorta la fase cambiando «Semanas de esta fase». El cliente lo ve al momento en su Inicio.</p></div>
    <div class="tabs">${T.map(([k,l])=>`<button type="button" class="${coachTab===k?'on':''}" onclick="coachTab='${k}';renderCoach()">${l}${k==='sesiones'&&exNotes(7).length?` <span class="ntc" title="Notas de los últimos 7 días">💬 ${exNotes(7).length}</span>`:''}</button>`).join('')}</div>
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
    await refreshList();await loadForms();coachSel=id;await loadClient(id);coachTab='ficha';renderCoach();inviteMsg(id);
  }catch(err){console.error(err);b.disabled=false;b.textContent='Dar de alta';toast('No se ha podido crear: '+authMsg(err))}
}
function inviteMsg(id){
  const c=CL.find(x=>x.id===id);if(!c)return;const url=APP_URL;
  if(CUR&&CUR.id===id&&FICHA.email)c.email=String(FICHA.email).trim().toLowerCase();
  if(/\.invalid$/.test(c.email)){toast('Antes, pon su email real en la Ficha (Datos generales → Email)');coachTab='ficha';if(CUR&&CUR.id===id)renderCoach();else selectClient(id);return}
  const tel=(CUR&&CUR.id===id?FICHA.tel:'').replace(/\D/g,'');
  const msg=`¡Capitán! Ya tienes lista tu app de Yaronska_Fit. Entra aquí: ${url}\n\nPulsa «Es mi primera vez: crear mi cuenta» y usa este email: ${c.email}\n\nAhí tendrás tu plan, tu rutina y tus revisiones.\n\nEsto es una guía básica para aprender a registrarte y guardar la página como si fuese una aplicación.\n\nTendrás que registrarte con el correo electrónico que te doy (el tuyo básicamente) y después pondrás la contraseña que quieras (después se puede cambiar).\n\nOtro apunte es que puedes poner el FACE ID para entrar sin fricciones 👌🏻`;
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
    ${(()=>{const F=fatSeries().filter(x=>x.date>=from&&x.date<=to);return `${F.length?fatStats(F,'Inicial · '+fdate(F[0].date)):''}${dualChart(R.map(w=>({d:w.date,v:w.peso})),F.map(x=>({d:x.date,v:x.v})),{w:560,h:220,color:ok?'#7CE38B':'#FFD60A'})}${F.length?`<p class="small muted" style="margin:0">% graso estimado con ${esc([...new Set(F.map(x=>BF_M[x.m]))].join(' · '))}.</p>`:`<p class="small muted" style="margin:0">Sin % graso en este rango: se calcula con cuello y cintura (y cadera en mujeres) del check-in, con el sexo, la altura y la edad de su Ficha.</p>`}`})()}`:'<p class="small muted">No hay pesos en ese rango.</p>'}
    <div class="seg2"><span class="small muted">En su gráfica el cliente ve:</span><button type="button" class="chip ${!FICHA.showFat?'on':''}" onclick="FICHA.showFat=false;save();renderCoach()">Solo peso</button><button type="button" class="chip ${FICHA.showFat?'on':''}" onclick="FICHA.showFat=true;save();renderCoach()">Peso y % graso</button></div>
  </div>
  <div class="panel"><span class="lbl">Todos los pesos del rango</span><div class="tbl-w"><table><thead><tr><th>Fecha</th><th>Peso</th><th>Cambio vs anterior</th><th>Cambio acumulado</th></tr></thead><tbody>
  ${R.map((w,i)=>{const d=i?w.peso-R[i-1].peso:0,a=w.peso-R[0].peso;return `<tr><td>${new Date(w.date+'T12:00').toLocaleDateString('es-ES')}</td><td>${nf(w.peso)} kg</td><td class="${i?(goodDir(d)?'good':'badc'):''}">${i?(d>0?'+':'')+nf(d):'—'}</td><td class="${i?(goodDir(a)?'good':'badc'):''}">${i?(a>0?'+':'')+nf(a):'—'}</td></tr>`}).reverse().join('')}</tbody></table></div></div>`;
}
const e1rm=s=>s.kg*(1+s.reps/30);
function cEj(){return `<div class="panel"><span class="lbl">📊 Volumen semanal por músculo</span>${vVolume(true)}</div>`+cEj0()+`<div class="panel"><span class="lbl">🏅 Rangos del cliente</span>${vRanks()}</div>`}
// orden: primero los ejercicios de su rutina actual, luego el resto
const hasSets=n=>(S.hist[n]||[]).some(h=>h.sets&&h.sets.length);
function exOrder(){const seen=new Set(),out=[];S.routine.forEach(d=>d.ex.forEach(e=>{if(hasSets(e.n)&&!seen.has(e.n)){seen.add(e.n);out.push(e.n)}}));Object.keys(S.hist).forEach(n=>{if(hasSets(n)&&!seen.has(n)){seen.add(n);out.push(n)}});return out}
function spark(v,col){if(v.length<2)return '';const W=120,H=34,mn=Math.min(...v),mx=Math.max(...v),r=mx-mn||1;const pts=v.map((x,i)=>`${(i*(W-4)/(v.length-1)+2).toFixed(1)},${(H-3-(x-mn)/r*(H-6)).toFixed(1)}`).join(' ');return `<svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}" vector-effect="non-scaling-stroke" fill="none" stroke="${col}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>`}
function vProgress(){
  const names=exOrder();const top=h=>h.sets.reduce((b,s)=>e1rm(s)>e1rm(b)?s:b,h.sets[0]);
  const cards=names.map(n=>{const H=S.hist[n].filter(h=>h.sets&&h.sets.length);if(!H.length)return '';const v=H.map(h=>e1rm(top(h)));const f=v[0],l=v[v.length-1];const pc=f?Math.round((l-f)/f*100):0;const ls=top(H[H.length-1]);
    return `<button type="button" class="pgc ${n===exSel?'on':''}" onclick="exSel=${esc(JSON.stringify(n))};render();setTimeout(()=>document.getElementById('exS')&&document.getElementById('exS').scrollIntoView({behavior:'smooth',block:'start'}),30)"><b>${esc(n)}</b><small class="muted">${H.length} sesi${H.length>1?'ones':'ón'} · última ${nf(ls.kg,1).replace(',0','')} kg × ${ls.reps}</small>${spark(v,pc>=0?'#7CE38B':'#FF6B5B')}<span class="pgp ${H.length<2?'':pc>=0?'good':'badc'}">${H.length<2?'Primera sesión':(pc>0?'+':'')+pc+' % fuerza'}</span></button>`}).join('');
  return `${names.length?`<section class="sec-h"><h2 style="font-size:16px">Tus ejercicios</h2></section><div class="pgrid2">${cards}</div><p class="small muted" style="margin:0">«% fuerza» compara tu 1RM estimado (con los kg y las reps de tu mejor serie) de la primera sesión con la última. Toca un ejercicio para ver su gráfica.</p>`:''}${cEj0(false)}`}
function cEj0(coach=true){const rr=coach?'renderCoach()':'render()';
  const names=exOrder();if(!names.length)return `<div class="panel"><p class="small muted" style="margin:0">${coach?'Aún no ha registrado entrenos.':'Cuando registres tus entrenos, aquí verás cómo mejoras en cada ejercicio.'}</p></div>`;if(!exSel||!S.hist[exSel])exSel=names[0];const HN=S.hist[exSel]||[];const H=HN.filter(h=>h.sets&&h.sets.length);
  const best=h=>h.sets.reduce((b,s)=>e1rm(s)>e1rm(b)?s:b,h.sets[0]);
  const M={kg:{l:'Peso (serie top)',f:h=>Math.max(...h.sets.map(s=>s.kg)),u:' kg'},reps:{l:'Repeticiones totales',f:h=>h.sets.reduce((a,s)=>a+s.reps,0),u:' reps',dec:0},rm:{l:'Intensidad · 1RM estimado',f:h=>e1rm(best(h)),u:' kg'},rir:{l:'RIR medio',f:h=>{const r=h.sets.filter(s=>s.rir!=null);return r.length?r.reduce((a,s)=>a+s.rir,0)/r.length:0},u:'',dec:1}};
  const m=M[exMetric];const pts=H.map(h=>({d:h.date,v:m.f(h)}));const ch=pts.length>1?pts[pts.length-1].v-pts[0].v:0;
  return `<div class="panel"><div class="range"><div class="field"><label for="exS">Ejercicio</label><select id="exS" onchange="exSel=this.value;${rr}">${names.map(n=>`<option ${n===exSel?'selected':''}>${esc(n)}</option>`).join('')}</select></div></div>
    <div class="mtabs">${Object.entries(M).map(([k,v])=>`<button type="button" class="chip ${exMetric===k?'on':''}" onclick="exMetric='${k}';${rr}">${v.l}</button>`).join('')}</div>
    <div class="kpis"><div class="kpi"><small>Primera sesión</small><b>${pts.length?nf(pts[0].v,m.dec??1)+m.u:'—'}</b></div><div class="kpi"><small>Última sesión</small><b>${pts.length?nf(pts[pts.length-1].v,m.dec??1)+m.u:'—'}</b></div><div class="kpi"><small>Mejora</small><b class="${(exMetric==='rir'?ch<=0:ch>=0)?'good':'badc'}">${ch>0?'+':''}${nf(ch,m.dec??1)}${m.u}</b></div><div class="kpi"><small>Sesiones</small><b>${pts.length}</b></div></div>
    ${lineChart(pts,{u:m.u,dec:m.dec??1,label:m.l})}
  </div>
  <div class="panel"><span class="lbl">Sesiones de ${esc(exSel)}</span><div class="tbl-w"><table><thead><tr><th>Fecha</th><th>Series (kg × reps · RIR)</th><th>1RM est.</th>${HN.some(h=>h.nota)?'<th>Nota</th>':''}</tr></thead><tbody>${HN.slice().reverse().map(h=>`<tr><td>${new Date(h.date+'T12:00').toLocaleDateString('es-ES')}</td><td class="wrap">${h.sets.length?h.sets.map(s=>`${nf(s.kg,1).replace(',0','')}×${s.reps}${s.rir!=null?' · '+s.rir:''}`).join(' &nbsp;|&nbsp; '):'<span class="muted">Sin series</span>'}</td><td>${h.sets.length?nf(e1rm(best(h)))+' kg':'—'}</td>${HN.some(h=>h.nota)?`<td class="wrap">${h.nota?'💬 '+esc(h.nota):''}</td>`:''}</tr>`).join('')}</tbody></table></div></div>`;
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
  const addBtn=`<div class="panel"><div class="sec-h"><div><span class="lbl">Añadir o editar revisiones</span><p class="small muted" style="margin:0">Mete tú el peso, los perímetros y las fotos de cualquier revisión, también la del inicio. Cuentan para sus gráficas, el % graso y la comparativa del físico.</p></div><button class="btn sm" type="button" onclick="openAddPhotos('')">＋ Añadir revisión</button></div></div>`;
  if(!cks.length)return addBtn+'<div class="panel"><p class="small muted" style="margin:0">Todavía no hay check-ins de este cliente.</p></div>';
  return addBtn+`<div class="panel"><span class="lbl">Check-ins recibidos</span><div class="tbl-w"><table class="cktbl"><thead><tr><th class="stk">Fecha</th>${MEAS.map(m=>`<th>${m[1]}</th>`).join('')}${SCALES.map(s=>`<th>${s.t}</th>`).join('')}<th>Orina</th><th>Fotos</th><th>Comentario</th></tr></thead><tbody>
  ${cks.map(k=>`<tr><td class="stk"><div class="ckd"><b>${new Date(k.date+'T12:00').toLocaleDateString('es-ES')}</b><span class="ckacts"><button class="btn sm ${k.rev?'ghost rvdone':''}" type="button" onclick="openRev('${k.date}')">${k.rev?'✅ Revisada':'📝 Revisar'}</button><button class="btn ghost sm" type="button" onclick="openAddPhotos('${k.date}')" aria-label="Editar revisión">✏️ Editar</button><button class="btn ghost sm del" type="button" onclick="askDelCheck('${k.date}')" aria-label="Borrar revisión">🗑</button></span></div></td>${MEAS.map(m=>`<td>${k[m[0]]??'—'}</td>`).join('')}${SCALES.map(s=>`<td>${k.r[s.k]?k.r[s.k]+' / 5':'—'}</td>`).join('')}<td>${k.r.orina||'—'}</td><td style="white-space:nowrap">${k.fotosP&&k.fotosP.length?`<button class="btn ghost sm" type="button" onclick='viewPhotos(${JSON.stringify(k.fotosP)})'>Ver ${k.fotosP.length}</button> `:''}${k.fotosP&&k.fotosP.length?'':'<span class="muted">—</span>'}</td><td class="ckcom">${esc(k.nota||'')}</td></tr>`).join('')}</tbody></table></div></div>`;
}
let openSets=new Set();
const RX=(di,ei)=>S.routine[di].ex[ei];
function exEdit(di,ei,k,v){const e=RX(di,ei);
  if(k==='s'){const n=Math.max(1,Math.min(15,parseInt(v)||1));const a=exSets(e);while(a.length<n)a.push(Object.assign({},a[a.length-1]||{t:'',reps:e.r,rpe:e.rir,rest:e.rest,nota:''},{t:''}));e.s=n;e.sets=a.slice(0,n);save();renderCoach();return}
  if(['r','rir','rest','kg'].includes(k)){const f={r:'reps',rir:'rpe',rest:'rest',kg:'kg'}[k];const old=e[k];e.sets=exSets(e).map(x=>(!x.t&&(x[f]===old||!x[f]))?Object.assign(x,{[f]:v}):x)}
  e[k]=v;save();if(k==='m'||k==='n')renderCoach()}
function setEdit(di,ei,si,k,v){const e=RX(di,ei);e.sets=exSets(e);e.sets[si][k]=v;save();if(k==='t')renderCoach()}
function blkEdit(di,ei,v){const d=S.routine[di];const e=d.ex[ei];e.blk=v||'';
  if(v){const mates=d.ex.filter(x=>x.blk===v);const t=(mates.find(x=>x!==e&&x.blkT)||{}).blkT||(mates.length>=4?'circuito':mates.length===3?'triserie':'superserie');mates.forEach(x=>x.blkT=t)}else delete e.blkT;
  save();renderCoach()}
function blkType(di,l,v){S.routine[di].ex.forEach(x=>{if(x.blk===l)x.blkT=v});save();renderCoach()}
function moveEx(di,ei,dir){const a=S.routine[di].ex;const j=ei+dir;if(j<0||j>=a.length)return;[a[ei],a[j]]=[a[j],a[ei]];openSets=new Set();save();renderCoach()}
const DAYC=['#FFD60A','#6FD3FF','#7CE38B','#FF6FA8','#FF8C28','#B57BFF','#FF6B5B'];let shutDays=new Set();
function togDay(i){shutDays.has(i)?shutDays.delete(i):shutDays.add(i);renderCoach()}
function togSets(k){openSets.has(k)?openSets.delete(k):openSets.add(k);renderCoach()}
function cRutina(){
  const all=TEMPLATES.concat(TPL_MINE);const sel=(v,opts,on,lab)=>`<select onchange="${on}" aria-label="${lab}">${opts.map(([k,l])=>`<option value="${esc(k)}" ${String(v||'')===k?'selected':''}>${esc(l)}</option>`).join('')}</select>`;
  return `<div class="panel"><span class="lbl">Asignar rutina preparada · un clic</span>
    <div class="tpl">${all.map((t,i)=>`<button type="button" class="tplc" onclick="assignTpl(${i})"><b>${esc(t.name)}</b><small>${esc(t.desc||'')} · ${t.days.length} días · ${t.days.reduce((a,d)=>a+d.ex.length,0)} ejercicios</small><span class="small y">Asignar →</span></button>`).join('')}</div>
    <p class="small muted" style="margin:0">Se copia al cliente y luego la ajustas aquí abajo sin tocar la plantilla original.</p></div>
  <div class="panel"><div class="sec-h"><span class="lbl">Rutina actual del cliente</span><div class="row"><button class="btn ghost sm" type="button" onclick="saveAsTpl()">Guardar como plantilla</button><button class="btn ghost sm" type="button" onclick="setView('client');go('train')">Ver como el cliente</button></div></div>
  <p class="small muted" style="margin:0"><b style="color:var(--fg)">Bloque:</b> pon la misma letra a ejercicios seguidos para hacer superseries, biseries o circuitos. <b style="color:var(--fg)">Series ▾:</b> detalla cada serie (top set, back-off, drop set…).</p>
  ${S.routine.map((d,di)=>{const used=[...new Set(d.ex.map(x=>x.blk).filter(Boolean))];const LB={};blocksOf(d.ex).forEach(b=>b.items.forEach(it=>LB[it.ei]=it.label));const shut=shutDays.has(di);return `<div class="panel edday ${d.opt?'isopt':''}" style="--dc:${DAYC[di%DAYC.length]}"><div class="edday-h"><span class="daypill">Día ${di+1}</span><input aria-label="Nombre del día" id="dn-${di}" value="${esc(d.d)}" onchange="S.routine[${di}].d=this.value;save()" style="flex:1;min-width:0;background:transparent;border:0;border-bottom:1px solid var(--line-2);padding:6px 0;font-family:var(--display);font-weight:800;font-size:16px;text-transform:uppercase"><small class="muted daysum">${d.ex.length} ejercicios · ${d.ex.reduce((a,e)=>a+effSets(e),0)} series</small><button type="button" class="mini" id="dfold-${di}" onclick="togDay(${di})" aria-expanded="${!shut}">${shut?'▾ Abrir':'▴ Plegar'}</button><button type="button" class="chip ${d.opt?'on':''}" id="dopt-${di}" onclick="S.routine[${di}].opt=!S.routine[${di}].opt;save();renderCoach()" aria-pressed="${!!d.opt}">☆ Opcional</button><button class="btn ghost sm" type="button" onclick="S.routine.splice(${di},1);save();renderCoach()">Quitar día</button></div>
    ${shut?'':`<div class="edday-b">
    ${d.opt?`<label class="ef optmsg"><small>Sesión opcional · mensaje para el cliente</small><input id="dom-${di}" value="${esc(d.optTxt||'')}" placeholder="${esc(OPT_TXT)}" onchange="S.routine[${di}].optTxt=this.value.trim();save()"></label>`:''}
    <div class="warmlist">${warmsOf(d).map((w,wi)=>`<div class="warmed"><label class="ef"><small>🔥 Calentamiento ${wi+1} · nombre</small><input value="${esc(w.t||'')}" placeholder="Movilidad de hombro" onchange="warmEdit(${di},${wi},'t',this.value)"></label><label class="ef"><small>Qué tiene que hacer</small><textarea rows="2" placeholder="2 vueltas: 10 rotaciones + 10 aperturas con banda" onchange="warmEdit(${di},${wi},'txt',this.value)">${esc(w.txt||'')}</textarea></label><label class="ef"><small>Vídeo (YouTube)</small><input value="${esc(w.url||'')}" placeholder="https://youtu.be/…" onchange="warmEdit(${di},${wi},'url',this.value)"></label><button class="x" type="button" aria-label="Quitar calentamiento" onclick="warmDel(${di},${wi})">×</button></div>`).join('')}<button class="btn ghost sm" type="button" onclick="warmAdd(${di})">+ Añadir calentamiento</button></div>
    ${used.length?`<div class="blkbar">${used.map(l=>{const t=(d.ex.find(x=>x.blk===l)||{}).blkT;return `<label>Bloque ${l} ${sel(t,BLK_T,`blkType(${di},'${l}',this.value)`,'Tipo de bloque '+l)}</label>`}).join('')}</div>`:''}
        ${d.ex.map((e,ei)=>{const k=di+'-'+ei;const op=openSets.has(k);const det=detailed(e);return `<div class="ed-ex ${e.blk?'inblk':''}"><div class="ed-h"><span class="exnum">${esc(LB[ei]||String(ei+1))}</span>${e.vid?`<img class="edthumb" src="${EJ}${esc(e.vid)}.jpg" alt="" loading="lazy">`:''}<b>${esc(e.n)}</b><button type="button" class="mini vidb ${e.vid?'on':''}" id="lib-${k}" onclick="openLib(${di},${ei})">🎞 ${e.vid?'Cambiar vídeo':'Vídeo de la biblioteca'}</button><small class="muted">${esc(musOf(e))} · ${effSets(e)} series${e.blk?` · <span class="y">${esc(blkName(e.blkT))} ${esc(e.blk)}</span>`:''}</small></div><div class="ed-row"><label class="ef nm"><small>Ejercicio</small><input id="en-${k}" value="${esc(e.n)}" onchange="exEdit(${di},${ei},'n',this.value)"></label><label class="ef mu"><small>Músculo</small><select id="em-${k}" onchange="exEdit(${di},${ei},'m',this.value)" aria-label="Músculo principal">${musOpts(e)}</select></label><label class="ef vu"><small>Vídeo (enlace)</small><input id="ev-${k}" value="${esc(e.v||'')}" placeholder="https://youtu.be/…" onchange="exEdit(${di},${ei},'v',this.value)"></label><label class="ef"><small>Series</small><input id="es-${k}" value="${e.s}" inputmode="numeric" onchange="exEdit(${di},${ei},'s',this.value)"></label><label class="ef"><small>Peso (kg)</small><input id="ek-${k}" value="${esc(e.kg||'')}" inputmode="decimal" placeholder="—" onchange="exEdit(${di},${ei},'kg',this.value.replace(',','.').trim())"></label><label class="ef"><small>Reps</small><input id="er-${k}" value="${esc(e.r)}" onchange="exEdit(${di},${ei},'r',this.value)"></label><label class="ef"><small>RIR / RPE</small><input id="ei-${k}" value="${esc(e.rir)}" onchange="exEdit(${di},${ei},'rir',this.value)"></label><label class="ef"><small>Descanso</small><input id="et-${k}" value="${esc(e.rest)}" onchange="exEdit(${di},${ei},'rest',this.value)"></label><label class="ef"><small>Bloque</small>${sel(e.blk,[['','—']].concat(BLK_L.map(l=>[l,l])),`blkEdit(${di},${ei},this.value)`,'Bloque')}</label>
      <div class="acts"><button type="button" class="mini ${det?'on':''}" onclick="togSets('${k}')" aria-expanded="${op}">Series ${op?'▴':'▾'}</button><button type="button" class="mini" onclick="moveEx(${di},${ei},-1)" aria-label="Subir">↑</button><button type="button" class="mini" onclick="moveEx(${di},${ei},1)" aria-label="Bajar">↓</button><button class="x" type="button" aria-label="Quitar" onclick="S.routine[${di}].ex.splice(${ei},1);openSets=new Set();save();renderCoach()">×</button></div><label class="ef ap"><small>Series de aproximación (sin vídeo)</small><input id="ea-${k}" value="${esc(e.aprox||'')}" placeholder="1×10 al 40 % · 1×5 al 60 % · 1×3 al 80 %" onchange="exEdit(${di},${ei},'aprox',this.value)"></label></div>
      ${op?`<div class="setsed"><div class="sed-row small muted"><span>Serie</span><span>Tipo</span><span>Kg</span><span>Reps</span><span>RIR / RPE</span><span>Descanso</span><span>Nota para el cliente</span></div>${exSets(e).map((x,si)=>`<div class="sed-row"><span class="sidx">${si+1}</span>${sel(x.t,SET_T,`setEdit(${di},${ei},${si},'t',this.value)`,'Tipo de serie '+(si+1))}<input value="${esc(x.kg)}" inputmode="decimal" placeholder="—" onchange="setEdit(${di},${ei},${si},'kg',this.value.replace(',','.').trim())" aria-label="Kg serie ${si+1}"><input value="${esc(x.reps)}" onchange="setEdit(${di},${ei},${si},'reps',this.value)" aria-label="Reps serie ${si+1}"><input value="${esc(x.rpe)}" onchange="setEdit(${di},${ei},${si},'rpe',this.value)" aria-label="RIR o RPE serie ${si+1}"><input value="${esc(x.rest)}" onchange="setEdit(${di},${ei},${si},'rest',this.value)" aria-label="Descanso serie ${si+1}"><input value="${esc(x.nota)}" placeholder="${x.t==='backoff'?'-10 % del top set':x.t==='drop'?'Baja un 20-25 % y al fallo':''}" onchange="setEdit(${di},${ei},${si},'nota',this.value)" aria-label="Nota serie ${si+1}"></div>`).join('')}</div>`:''}</div>`}).join('')}
    <button class="btn ghost sm" type="button" onclick="S.routine[${di}].ex.push({n:'Nuevo ejercicio',m:'',s:3,r:'10-12',rir:'RIR 2',rest:'90 s',v:''});save();renderCoach()">+ Añadir ejercicio</button></div>`}</div>`}).join('')}
  <button class="btn sm" type="button" onclick="S.routine.push({d:'Día '+String.fromCharCode(65+S.routine.length)+' · nuevo',ex:[]});save();renderCoach()">+ Añadir día</button></div>
  ${S.routine.length?`<div class="panel"><div class="sec-h"><span class="lbl">📊 Volumen pautado a la semana</span><button class="btn ghost sm" type="button" onclick="coachTab='ejercicios';renderCoach()">Ver lo que hace →</button></div>${volPlanChips()}</div>`:''}`;
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
  setTimeout(()=>{if(CUR)db.pushCount(CUR.id).then(n=>{const e=document.getElementById('pushCnt');if(e)e.textContent=`Dispositivos con avisos activados: ${n}${n?'':' · el cliente tiene que activarlos en su app'}`}).catch(()=>{})});
  const f=FICHA;const ren=nextRenewal(f);const dleft=ren?Math.round((new Date(ren+'T12:00')-new Date())/864e5):null;
  const m=SUBM[f.tipo]||1;const age=f.nac?Math.floor((new Date()-new Date(f.nac+'T12:00'))/31557600000):(+f.edad||null);
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
  ${formPanel()}
  <div class="panel"><span class="lbl">Datos generales</span>${grid(inp('nombre','Nombre')+inp('email','Email','email')+inp('tel','Teléfono / WhatsApp','tel')+sel('sexo','Sexo',[['Hombre','Hombre'],['Mujer','Mujer']])+inp('nac','Fecha de nacimiento','date')+(FICHA.nac?'':inp('edad','Edad (si no tienes la fecha)','n'))+inp('altura','Altura (cm)','n')+sel('objetivo','Objetivo',[['perder','Perder grasa'],['ganar','Ganar músculo']]))}</div>
  <div class="panel"><span class="lbl">📅 Suscripción y cheatmeals</span>${grid(sel('estado','Estado',EST)+inp('alta','Fecha de alta','date')+sel('tipo','Tipo de suscripción',[['','—']].concat(SUBT))+inp('renov','Fecha de renovación (vacío = automática)','date')+inp('pago','Pago actual (€)','n')+inp('cheat','Cheatmeals / semana','n')+inp('pausa','Fecha de pausa (si aplica)','date')+inp('baja','Fecha de baja (si aplica)','date')+ta('notasCom','Notas comerciales / historial'))}
    <div class="sec-h" style="margin-top:6px"><span class="lbl">💶 Cobros registrados</span><button class="btn sm" type="button" onclick="payForm()">+ Registrar cobro</button></div>
    <div id="payBox">${payList()}</div></div>
  <div class="panel"><span class="lbl">🏋️ Entrenamiento, pasos y revisiones</span>
    <div class="field"><label>Cómo entrena</label><div class="seg2"><button type="button" class="chip ${f.diasModo!=='libre'?'on':''}" onclick="FICHA.diasModo='fijo';save();setTimeout(renderCoach)">📅 Días fijos</button><button type="button" class="chip ${f.diasModo==='libre'?'on':''}" onclick="FICHA.diasModo='libre';save();setTimeout(renderCoach)">🔄 Rotación (elige cada día)</button></div><small class="muted">${f.diasModo==='libre'?'Cada día el cliente marca en su Inicio si entrena o descansa; con eso cambian su objetivo de pasos y su plan de comidas.':'Los días marcados abajo son de entreno. Aun así, el cliente puede cambiar el día en su Inicio si un día entrena o descansa fuera de lo previsto.'}</small></div>
    <div class="field" ${f.diasModo==='libre'?'hidden':''}><label>Días de entrenamiento</label><div class="chips">${WD.map((d,i)=>{const gi=(i+1)%7;return `<button type="button" class="chip ${f.dias.includes(gi)?'on':''}" onclick="fDay(${gi})">${d.slice(0,3)}</button>`}).join('')}</div></div>
    ${grid(inp('pasosT','👟 Pasos objetivo · día de entreno','n')+inp('pasosR','👟 Pasos objetivo · día sin entreno','n')+inp('tipoEntreno','¿Qué trabaja? (tipo de entrenamiento)')+inp('diasSemana','Nº días entrena por semana','n')+sel('revFis','Día revisión físico / peso',days)+inp('avisoV','🔔 Aviso la víspera (hora)','time')+inp('avisoD','🔔 Aviso el día de la revisión (hora)','time')+inp('lastFis','Última revisión físico','date')+sel('revEnt','Día revisión entreno',days)+inp('lastEnt','Última revisión entreno','date'))}
    <p class="small muted" style="margin:0">El cliente ve en su Inicio el objetivo de pasos que toca según el día (entreno o descanso). Avisos de la revisión: la víspera a las ${esc(f.avisoV||'20:00')} y el mismo día a las ${esc(f.avisoD||'06:00')} (si aún no la ha enviado).</p>
    <div class="row"><span class="small" id="pushCnt">Dispositivos con avisos activados: …</span><button class="btn ghost sm" type="button" onclick="testPushC()">🔔 Enviar aviso de prueba</button></div></div>
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
function exNotes(days){const lim=iso(daysAgo(days));const out=[];Object.entries(S.hist).forEach(([n,a])=>a.forEach(h=>{if(h.nota&&h.date>=lim)out.push({n,date:h.date,day:h.day,nota:h.nota})}));return out.sort((a,b)=>b.date.localeCompare(a.date))}
function cSes(){
  const L=sessions();if(!L.length)return '<div class="panel"><p class="small muted" style="margin:0">Aún no hay sesiones guardadas.</p></div>';
  if(!sesSel||!L.find(x=>x.date+'|'+x.day===sesSel))sesSel=L[0].date+'|'+L[0].day;const se=L.find(x=>x.date+'|'+x.day===sesSel);
  const inS='style="width:72px;background:var(--bg);border:1px solid var(--line-2);border-radius:6px;padding:6px;text-align:center"';
  const NT=exNotes(30);
  return `${NT.length?`<div class="panel"><span class="lbl">💬 Notas del cliente · últimos 30 días</span><div class="ntlist">${NT.map(x=>`<button type="button" class="ntrow ${x.date+'|'+(x.day||'')===sesSel?'on':''}" onclick="sesSel=${esc(JSON.stringify(x.date+'|'+(x.day||'')))};renderCoach()"><small class="muted">${new Date(x.date+'T12:00').toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short'})} · ${esc(x.n)}</small><span>${esc(x.nota)}</span></button>`).join('')}</div></div>`:''}<div class="panel"><div class="range"><div class="field"><label for="sesS">Sesión</label><select id="sesS" onchange="sesSel=this.value;renderCoach()">${L.map(x=>`<option value="${esc(x.date+'|'+x.day)}" ${x.date+'|'+x.day===sesSel?'selected':''}>${new Date(x.date+'T12:00').toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short'})} · ${esc(x.day||'Entreno')} · ${x.items.length} ejercicios</option>`).join('')}</select></div></div>
    <p class="small muted" style="margin:0">Corrige lo que ha rellenado si hace falta y pauta su próximo entreno: lo verá en verde como «Pautado por Yaron». Si el ejercicio tiene series detalladas (top set, back-off…), pautas cada serie por separado.</p></div>
  ${se.items.map(({n,hi,h},k)=>{const nx=S.next[n]||{};const re=routineEx(n,h.day);const plan=re?exSets(re):[];const det=re&&detailed(re);const nm=esc(n).replace(/'/g,"\\'");
    const blk=re&&re.blk?`<span class="stag" style="background:var(--surface-2);color:var(--y)">${esc(blkName(re.blkT))} ${esc(re.blk)}</span>`:'';
    const tOf=(st,si)=>st.t!==undefined?st.t:(plan[st.i??si]||{}).t||'';
    return `<div class="panel"><div class="sec-h"><b style="font-size:15px">${esc(n)} ${blk}</b><span class="small muted">${h.sets.length?h.sets.length+' series':'Sin series · solo nota'}</span></div>${h.nota?`<div class="cnote">💬 <b>Nota del cliente:</b> ${esc(h.nota)}</div>`:''}
    <div class="tbl-w"><table><thead><tr><th>Serie</th><th>Tipo</th><th>Pautado</th><th>Kg</th><th>Reps</th><th>RIR real</th></tr></thead><tbody>${h.sets.map((st,si)=>{const pl=plan[st.i??si]||{};return `<tr><td>${(st.i??si)+1}</td><td>${setTag(tOf(st,si))||'<span class="muted">Normal</span>'}</td><td class="small muted">${esc([pl.reps,pl.rpe].filter(Boolean).join(' · '))}</td>${['kg','reps','rir'].map(f=>`<td><input id="sx-${k}-${si}-${f}" value="${st[f]??''}" inputmode="decimal" ${inS} onchange="editSet('${nm}',${hi},${si},'${f}',this.value)" aria-label="${f} serie ${si+1}"></td>`).join('')}</tr>`}).join('')}</tbody></table></div>
    <span class="lbl" style="margin-top:4px">Pautar próximo entreno</span>
    ${det?`<div class="tbl-w"><table><thead><tr><th>Serie</th><th>Tipo</th><th>Kg</th><th>Reps</th><th>RIR / RPE</th></tr></thead><tbody>${plan.map((pl,si)=>{const v=(nx.sets||[])[si]||{};const lastS=h.sets.find(x=>(x.i??-1)===si)||h.sets[si]||{};return `<tr><td>${si+1}</td><td>${setTag(pl.t)||'<span class="muted">Normal</span>'}</td><td><input id="nsk-${k}-${si}" value="${esc(v.kg||'')}" placeholder="${lastS.kg??''}" inputmode="decimal" ${inS}></td><td><input id="nsr-${k}-${si}" value="${esc(v.reps||'')}" placeholder="${esc(pl.reps||'')}" ${inS}></td><td><input id="nsi-${k}-${si}" value="${esc(v.int||'')}" placeholder="${esc(pl.rpe||'')}" ${inS}></td></tr>`}).join('')}</tbody></table></div>
      <div class="range"><div class="field" style="flex:2"><label for="nn-${k}">Nota para el cliente</label><input id="nn-${k}" value="${esc(nx.nota||'')}" placeholder="Top set a 100 kg y back-offs al 90 %"></div><button class="btn sm" type="button" onclick="setNext('${nm}',${k},${plan.length})">Pautar</button></div>`
    :`<div class="range"><div class="field"><label for="nk-${k}">Kg</label><input id="nk-${k}" value="${esc(nx.kg||'')}" inputmode="decimal" placeholder="${h.sets.length?Math.max(...h.sets.map(x=>x.kg)):''}"></div><div class="field"><label for="nr-${k}">Reps objetivo</label><input id="nr-${k}" value="${esc(nx.reps||'')}" placeholder="p. ej. 10-12"></div><div class="field"><label for="ni-${k}">RIR / RPE objetivo</label><input id="ni-${k}" value="${esc(nx.int||'')}" placeholder="RIR 2 · RPE 8"></div><div class="field" style="flex:2"><label for="nn-${k}">Nota para el cliente</label><input id="nn-${k}" value="${esc(nx.nota||'')}" placeholder="Baja el peso y controla la bajada"></div>
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
  ${restPanel()}
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
  const mode=FICHA.dietMode==='td'?'td':'lineal';
  if(mode==='td'&&!restHasCuts()){toast('Indica qué baja en los días sin entreno (o elige «Igual todos los días»)');return}
  CALC.exportCb=d=>{
    if(!d||d.error){toast(d&&d.error||'No se ha podido exportar el plan');return}
    S.planCalc=d;S.planOn=true;S.restOn=mode==='td'&&!!d.R;save();renderCoach();
    toast(S.restOn?'Plan enviado: el cliente ve días de entreno y sin entreno':'Plan enviado: el cliente ve el mismo plan todos los días');
  };
  calcPost({type:'export',opts:{mode,cfg:FICHA.restCfg||{}}});
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
    nombre:c.name||'',email:'',tel:'',edad:n(d.age),sexo:d.sex==='female'?'Mujer':d.sex==='male'?'Hombre':'',nac:n(p.fechaNacimiento),altura:n(d.height),objetivo:(parseFloat(d.goal)||0)>0?'ganar':'perder',
    tipoEntreno:n(p.tipoEntreno),diasSemana:n(p.diasSemana||d.trainingDays),dias:[],pasosT:n(d.steps),pasosR:n(d.steps),
    revFis:n(p.revFisicoDay)||'Domingo',lastFis:n(p.lastRevFisico),revEnt:n(p.revEntrenoDay),lastEnt:n(p.lastRevEntreno),
    objLargo:n(p.objetivo),patologias:n(p.patologias),alergias:n(p.alergias),intol:n(p.intolerancias),lesiones:n(p.lesiones),medicacion:n(p.medicacion),suplem:n(p.suplementacion),ciclo:n(p.ciclo),histDietas:n(p.historialDietas),prefs:n(p.preferencias),evitar:n(p.alimentosEvitar),sueno:n(p.horasSueno),estres:n(p.estres),motiv:n(p.motivacion),
    omega3:n(p.supOmega3),vitD:n(p.supVitD),b12:n(p.supVitB12),magnesio:n(p.supMagnesio),vitC:n(p.supVitC),hierro:n(p.supHierro),calcio:n(p.supCalcio),zinc:n(p.supZinc),folato:n(p.supFolato),potasio:n(p.supPotasio),creatina:n(p.supCreatina),colageno:n(p.supColageno),cafeina:n(p.supCafeina),multi:p.supMulti==='yes'?'yes':'no',supOtros:n(p.supOtros),
    sal:n(p.lifeSal),sol:n(p.lifeSol),agua:n(p.lifeAgua),cafe:n(p.lifeCafe),alcohol:n(p.lifeAlcohol),tabaco:n(p.lifeTabaco),aire:n(p.lifeAire),pantallas:n(p.lifePantallas),lifeNotas:n(p.lifeNotas)})}
function impAdmin(id,c){const p=c.profile||{};const dt=v=>/^\d{4}-\d{2}-\d{2}/.test(v||'')?String(v).slice(0,10):null;const num=v=>v===''||v==null||isNaN(+v)||+v===0?null:+v;
  return {client_id:id,estado:['active','paused','ended','trial'].includes(p.subStatus)?p.subStatus:'active',alta:dt(p.subStartDate)||dt(c.createdAt),tipo:p.subType||null,renovacion:dt(p.subRenewalDate),pago:num(p.subPayment),cheatmeals:num(p.subCheatmeals)==null?null:Math.round(+p.subCheatmeals),pausa:dt(p.subPauseDate),baja:dt(p.subEndDate),notas:p.subNotes||null}}
function impChecks(id,c){return (c.measurements||[]).filter(m=>m.date).map(m=>{const v=x=>x===null||x===undefined||x===''||isNaN(+x)?undefined:+x;
  const sc=[['Energía',m.energia],['Hambre',m.hambre],['Sueño',m.sueno],['Ánimo',m.animo]].filter(x=>x[1]!=null&&x[1]!=='').map(x=>x[0]+' '+x[1]+'/10').join(' · ');
  const data={peso:v(m.peso),cuello:v(m.cuello),torso:v(m.torso),cintura:v(m.cintura),cadera:v(m.cadera),gluteo:v(m.gluteo),biceps:v(m.brazoD),pierna:v(m.piernaD),grasa:v(m.grasa),fotos:0,r:{},importado:true,nota:[m.notas,sc,m.grasa?('Grasa estimada '+m.grasa+' %'):''].filter(Boolean).join(' — ')};
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

// Calentamientos del día (varios). Compatibilidad con el formato antiguo de uno solo (d.warm)
function warmsOf(d){if(!d.warms){d.warms=d.warm&&(d.warm.txt||d.warm.url)?[{t:'',txt:d.warm.txt||'',url:d.warm.url||''}]:[]}return d.warms.filter(w=>w&&(w.t||w.txt||w.url||ME&&ME.role==='coach'&&view==='coach'))}
function warmEdit(di,wi,k,v){const d=S.routine[di];warmsOf(d);d.warms[wi][k]=v.trim();delete d.warm;save()}
function warmAdd(di){const d=S.routine[di];warmsOf(d);d.warms.push({t:'',txt:'',url:''});delete d.warm;save();renderCoach()}
function warmDel(di,wi){const d=S.routine[di];warmsOf(d);d.warms.splice(wi,1);delete d.warm;save();renderCoach()}

// ================= % GRASO =================
// Fórmula de la Marina de EE. UU. (cuello, cintura y altura; cadera en mujeres), la que usa la calculadora de FitGeneration.
// Si faltan medidas: el % que traía la Calculadora o, si no, Deurenberg (IMC + edad + sexo).
function bfNavy(sex,h,neck,waist,hip){if(!(h>0&&neck>0&&waist>0))return null;
  if(sex==='Mujer'){if(!(hip>0))return null;const x=waist+hip-neck;return x>0?495/(1.29579-0.35004*Math.log10(x)+0.22100*Math.log10(h))-450:null}
  const x=waist-neck;return x>0?495/(1.0324-0.19077*Math.log10(x)+0.15456*Math.log10(h))-450:null}
function bfDeur(sex,h,kg,age){if(!(h>0&&kg>0&&age>0)||!sex)return null;const imc=kg/((h/100)**2);return 1.2*imc+0.23*age-10.8*(sex==='Mujer'?0:1)-5.4}
const ageAt=(nac,date)=>nac?Math.floor((new Date(date+'T12:00')-new Date(nac+'T12:00'))/31557600000):(+FICHA.edad||null);
const BF_M={navy:'medidas (cuello, cintura'+'…)',calc:'Calculadora',imc:'IMC + edad'};
function fatSeries(){const sex=FICHA.sexo,h=+FICHA.altura;
  return S.checkins.map(c=>{let v=null,m='';const nv=sex?bfNavy(sex,h,+c.cuello,+(c.cintura||c.abdomen),+c.cadera):null;
    if(nv!=null&&isFinite(nv)){v=nv;m='navy'}else if(c.grasa!=null&&!isNaN(+c.grasa)){v=+c.grasa;m='calc'}else{const d=bfDeur(sex,h,+c.peso,ageAt(FICHA.nac,c.date));if(d!=null){v=d;m='imc'}}
    return v!=null&&v>2&&v<70?{date:c.date,v:Math.round(v*10)/10,m}:null}).filter(Boolean).sort((a,b)=>a.date.localeCompare(b.date))}
function fatBlock(R,opt){opt=opt||{};if(R.length<1)return opt.coach?`<p class="small muted" style="margin:0">Sin datos de % graso en este rango. Se calcula con cuello + cintura (+ cadera en mujeres) del check-in, más sexo y altura de la Ficha.</p>`:'';
  const f=R[0],l=R[R.length-1],d=l.v-f.v,ok=d<=0;const ms=[...new Set(R.map(x=>x.m))].map(m=>BF_M[m]).join(' · ');
  return `<div class="wstats"><div><small>${opt.from||'Inicio'}</small><b>${nf(f.v)} %</b></div><div><small>Ahora</small><b>${nf(l.v)} %</b></div><div><small>Cambio</small><b class="${ok?'good':'badc'}">${d>0?'+':''}${nf(d)} %</b></div></div>
  ${lineChart(R.map(x=>({d:x.date,v:x.v})),Object.assign({u:' %',label:'% graso',color:ok?'#7CE38B':'#FF8C28'},opt.chart||{}))}
  <p class="small muted" style="margin:0">Estimado con ${esc(ms)}.</p>`}

// ================= RANGOS DE FUERZA =================
// Rango orientativo por ejercicio según 1RM estimado relativo al peso corporal (ajustado a 75 kg), sexo y tipo de ejercicio.
// Familias: carga externa (kg y reps), peso corporal (dominadas, fondos: tu peso + lastre), muchas reps (flexiones, abdominales) y tiempo (plancha).
const RANKS=[['Hierro','#7A7A7A'],['Bronce','#B87333'],['Plata','#C9D1D9'],['Oro','#FFD60A'],['Rubí','#E0115F'],['Esmeralda','#2ECC71'],['Diamante','#6FD3FF'],['Campeón','#B57BFF']];
const OLIMPO=['Olimpo','#FFF3B0'];
const RX_PAT=[
  // [regex, familia, anclas hombre (principiante→élite), grupo, factor mujer]  · acepta abreviaturas (Elev Lat, Ext Cuads, Manc, Máq…) y erratas habituales
  [/dominad|chin.?up|pull.?up/i,'bw',[1.0,1.17,1.33,1.55,1.8],'Espalda',0.85],
  [/fondos|dips?\b/i,'bw',[1.03,1.25,1.45,1.7,2.0],'Pecho',0.85],
  [/flexion|push.?up/i,'reps',[5,15,30,45,65],'Pecho',0.5],
  [/plancha|plank/i,'time',[20,45,90,150,240],'Core',0.9],
  [/crunch|abdom|sit.?up|elevaci[oó]n de piernas|rueda/i,'reps',[10,25,40,60,80],'Core',0.85],
  [/rum[a-z]*o\b|rumano|rdl|r[ií]gidas|stiff/i,'load',[0.6,1.0,1.35,1.8,2.2],'Piernas',0.75],
  [/buenos d[ií]as|good.?morning/i,'load',[0.4,0.7,1.0,1.3,1.6],'Piernas',0.75],
  [/peso muerto|deadlift/i,'load',[1.0,1.5,1.85,2.4,2.9],'Piernas',0.75],
  [/\bhip\b|puente de gl/i,'load',[0.75,1.25,1.75,2.5,3.25],'Piernas',0.8],
  [/gemelo|calf|s[oó]leo/i,'load',[0.75,1.25,1.75,2.5,3.25],'Piernas',0.75],
  [/prensa|leg.?press/i,'load',[1.5,2.25,3.0,4.0,5.0],'Piernas',0.75],
  [/sentadilla|squat|hack|p[eé]ndul|b[uú]lgara|zancada/i,'load',[0.75,1.25,1.5,2.0,2.5],'Piernas',0.75],
  [/ext[\wáéíóú]*\.? (de )?cu[aá]d|leg.?ext/i,'load',[0.4,0.65,0.9,1.2,1.5],'Piernas',0.75],
  [/curl\s*(isq|femoral|femorales)|isquio|leg.?curl|femoral/i,'load',[0.3,0.5,0.7,0.95,1.2],'Piernas',0.75],
  [/a[bd]{1,2}uctor/i,'load',[0.5,0.8,1.1,1.5,1.9],'Piernas',0.8],
  [/tr[ií]ceps?\b|katana|franc[eé]s|patada|pushdown|copa|skull/i,'load',[0.2,0.35,0.5,0.7,0.9],'Brazos',0.65],
  [/apertura|pec.?k?.?deck|peck|contractor|cruce de polea|crossover|fly/i,'load',[0.3,0.5,0.75,1.0,1.3],'Pecho',0.65],
  [/press (militar|hombro)|militar|overhead|arnold|nuca/i,'load',[0.35,0.5,0.7,0.9,1.1],'Hombros',0.65],
  [/press|pren+s+\b|banca|bench/i,'load',[0.55,0.8,1.05,1.4,1.75],'Pecho',0.65],
  [/elev[\wáéíóú]*\.? ?(es )?(lat|front)|p[aá]jaro|face.?pull|posterior/i,'load',[0.05,0.09,0.13,0.18,0.24],'Hombros',0.7],
  [/jal[oó]n|pulldown|pull.?over/i,'load',[0.55,0.8,1.0,1.25,1.5],'Espalda',0.7],
  [/remo|row/i,'load',[0.5,0.75,0.95,1.2,1.5],'Espalda',0.7],
  [/curl|b[ií]ceps|martillo/i,'load',[0.2,0.35,0.5,0.7,0.9],'Brazos',0.65]
];
// si el nombre no encaja con ningún patrón, se usa el músculo del ejercicio (el de «Músculo» en la Rutina o el deducido del nombre)
const RX_FALL={'Pecho':['load',[0.4,0.65,0.9,1.2,1.5],'Pecho',0.65],'Espalda':['load',[0.5,0.75,0.95,1.2,1.5],'Espalda',0.7],'Hombro':['load',[0.15,0.25,0.35,0.5,0.65],'Hombros',0.65],
  'Bíceps':['load',[0.2,0.35,0.5,0.7,0.9],'Brazos',0.65],'Tríceps':['load',[0.2,0.35,0.5,0.7,0.9],'Brazos',0.65],'Antebrazo':['load',[0.15,0.25,0.35,0.5,0.65],'Brazos',0.65],
  'Cuádriceps':['load',[0.75,1.25,1.75,2.4,3.0],'Piernas',0.75],'Glúteo':['load',[0.6,1.0,1.5,2.1,2.8],'Piernas',0.8],'Isquios':['load',[0.3,0.5,0.7,0.95,1.2],'Piernas',0.75],
  'Gemelos':['load',[0.75,1.25,1.75,2.5,3.25],'Piernas',0.75],'Abductor':['load',[0.5,0.8,1.1,1.5,1.9],'Piernas',0.8],'Aductor':['load',[0.5,0.8,1.1,1.5,1.9],'Piernas',0.8],
  'Abdomen':['reps',[10,25,40,60,80],'Core',0.85],'Lumbar':['load',[0.3,0.5,0.75,1.0,1.3],'Espalda',0.75]};
const MUSC_G={'Pecho':'Pecho','Espalda':'Espalda','Hombro':'Hombros','Hombros':'Hombros','Bíceps':'Brazos','Tríceps':'Brazos','Antebrazo':'Brazos','Cuádriceps':'Piernas','Isquios':'Piernas','Glúteo':'Piernas','Gemelos':'Piernas','Abductor':'Piernas','Abdomen':'Core','Core':'Core'};
const GROUPS=['Pecho','Espalda','Hombros','Brazos','Piernas','Core'];
function exPattern(n){let r=RX_PAT.find(p=>p[0].test(n));if(!r){const re=routineEx(n);const m=volMuscle(n,re&&re.m);const f=RX_FALL[m];if(!f)return null;r=[null].concat(f)}let A=r[2].slice();
  if(r[1]==='load'&&/mancuerna|\bmanc\b|\bdb\b/i.test(n)&&!/curl|b[ií]ceps|martillo|elev|tr[ií]ceps?\b|katana|franc|patada|p[aá]jaro|face/i.test(n))A=A.map(x=>x*0.4);
  if(r[1]==='load'&&/unilat/i.test(n))A=A.map(x=>x*0.5);
  if(r[1]==='load'&&/m[aá]q|multipower|smith|placas/i.test(n)&&/press|remo|row|militar/i.test(n))A=A.map(x=>x*1.15);
  return {fam:r[1],A,g:r[3],fem:r[4]}}
function lvlOf(r,A){const P=[[0,0],[A[0],1],[A[1],2],[A[2],3],[A[3],4],[A[4],5]];if(r<=0)return 0;
  for(let i=1;i<P.length;i++)if(r<=P[i][0])return P[i-1][1]+(r-P[i-1][0])/(P[i][0]-P[i-1][0]);
  return Math.min(5.6,5+(r-A[4])/((A[4]-A[3])||1))}
function tierOf(L){const x=(L-0.6)*24/5.2;const idx=Math.max(0,Math.min(24,Math.floor(x)));const frac=idx>=24?1:Math.max(0,Math.min(1,x-idx));
  const rk=idx>=24?OLIMPO:RANKS[Math.floor(idx/3)];const div=idx>=24?'':['I','II','III'][idx%3];return {idx,frac,name:rk[0]+(div?' '+div:''),base:rk[0],color:rk[1],next:idx>=24?null:(idx+1>=24?OLIMPO[0]:RANKS[Math.floor((idx+1)/3)][0]+' '+['I','II','III'][(idx+1)%3])}}
// ---- personalización: peso corporal del día de cada sesión, sexo y edad
// Escala alométrica (peso^0,67): a más peso corporal, más kg absolutos pero menos kg por kilo de peso; así un cliente de 60 kg y uno de 100 kg se miden con la misma vara.
const ALLO=bw=>Math.pow(bw/75,0.33);
// Coeficiente de edad (tipo McCulloch) a partir de los 40 años
const AGE_K=[[40,1],[45,1.05],[50,1.13],[55,1.21],[60,1.32],[65,1.45],[70,1.59],[75,1.75],[80,1.95]];
function ageK(age){if(!(age>40))return 1;for(let i=1;i<AGE_K.length;i++)if(age<=AGE_K[i][0]){const[a0,k0]=AGE_K[i-1],[a1,k1]=AGE_K[i];return k0+(age-a0)/(a1-a0)*(k1-k0)}return AGE_K[AGE_K.length-1][1]}
function bwAt(date){const W=allWeights();if(!W.length)return null;let r=null;for(const w of W){if(w.date<=date)r=w;else break}return (r||W[0]).peso}
const curAge=()=>ageAt(FICHA.nac,iso(new Date()));
function setScore(fam,s,bw,ak){const kg=+s.kg||0,reps=+s.reps||0;ak=ak||1;if(!(reps>0))return 0;
  if(fam==='load'){if(!(kg>0)||!(bw>0))return 0;return kg*(1+reps/30)/bw*ALLO(bw)*ak}
  if(fam==='bw'){if(!(bw>0))return 0;return (bw+kg)*(1+reps/30)/bw*ALLO(bw)*ak}
  if(fam==='reps')return reps*(bw>0?ALLO(bw):1)*ak;
  return reps*ak}
function lvlInv(L,A){const P=[[0,0],[A[0],1],[A[1],2],[A[2],3],[A[3],4],[A[4],5]];if(L<=0)return 0;
  for(let i=1;i<P.length;i++)if(L<=P[i][1])return P[i-1][0]+(L-P[i-1][1])*(P[i][0]-P[i-1][0]);
  return A[4]+(L-5)*((A[4]-A[3])||1)}
// qué necesita para el siguiente rango, con SU peso corporal actual y su edad
function nextTarget(fam,A,idx,bw,ak,reps,n){if(idx>=24)return '';const L=(idx+1)*5.2/24+0.6+1e-6;const sc=lvlInv(L,A)/(ak||1);
  if(fam==='load'){if(!bw)return '';const r=Math.max(1,Math.min(12,reps||5));const step=/mancuerna|\bdb\b/i.test(n)?1:2.5;const kg=Math.ceil(sc/ALLO(bw)*bw/(1+r/30)/step)*step;return `${nf(kg,1).replace(',0','')} kg × ${r}`}
  if(fam==='bw'){if(!bw)return '';const f=sc/ALLO(bw);const r=Math.max(1,Math.min(12,reps||5));const tot=f*bw/(1+r/30);const extra=Math.ceil((tot-bw)/1.25)*1.25;
    if(extra>0)return `+${nf(extra,2).replace(/,?0+$/,'')} kg de lastre × ${r}`;return `${Math.max(1,Math.ceil(30*(f-1)))} reps con tu peso`}
  if(fam==='reps')return `${Math.ceil(sc/(bw?ALLO(bw):1))} reps`;
  return `${Math.ceil(sc)} s`}
function exRank(n){const P=exPattern(n);if(!P)return null;const H=(S.hist[n]||[]).filter(h=>h.sets&&h.sets.length);if(!H.length)return null;
  const W=allWeights();const bwNow=W.length?W[W.length-1].peso:null;if((P.fam==='load'||P.fam==='bw')&&!bwNow)return null;
  const A=FICHA.sexo==='Mujer'?P.A.map(x=>x*P.fem):P.A;const lim=iso(daysAgo(56));
  let best=0,recent=0,bestReps=0;H.forEach(h=>{const bw=bwAt(h.date)||bwNow;const ak=ageK(ageAt(FICHA.nac,h.date));let hs=0,hr=0;h.sets.forEach(s=>{const v=setScore(P.fam,s,bw,ak);if(v>hs){hs=v;hr=+s.reps||0}});if(hs>best){best=hs;bestReps=hr}if(h.date>=lim&&hs>recent)recent=hs});
  const sc=Math.max(recent,best*0.85);if(!(sc>0))return null;const L=lvlOf(sc,A);const T=tierOf(L);
  const re=routineEx(n);const g=(re&&MUSC_G[re.m])||P.g;return Object.assign({n,L,g,goal:!T.next?'':(()=>{const need=lvlInv((T.idx+1)*5.2/24+0.6+1e-6,A);const ak=ageK(curAge());const nowBest=Math.max(0,...H.filter(h=>h.date>=lim).flatMap(h=>h.sets.map(s=>setScore(P.fam,s,bwNow,ak))));return nowBest>=need?'repite tu mejor marca con tu peso actual y subes':nextTarget(P.fam,A,T.idx,bwNow,ak,bestReps,n)})()},T)}
function allRanks(){const ex=Object.keys(S.hist).map(exRank).filter(Boolean).sort((a,b)=>b.L-a.L);
  const groups=GROUPS.map(g=>{const xs=ex.filter(e=>e.g===g);if(!xs.length)return null;const L=xs.reduce((a,e)=>a+e.L,0)/xs.length;return Object.assign({g,count:xs.length,L},tierOf(L))}).filter(Boolean);
  const glob=ex.length>=5&&groups.length?Object.assign({L:groups.reduce((a,x)=>a+x.L,0)/groups.length},tierOf(groups.reduce((a,x)=>a+x.L,0)/groups.length)):null;
  return {ex,groups,glob}}
function rankBadge(t,big){return `<span class="rk ${big?'big':''}" style="--rk:${t.color}"><svg viewBox="0 0 24 28" aria-hidden="true"><path d="M12 1l10 4v8c0 7-4.5 11.5-10 14C6.5 24.5 2 20 2 13V5z"/></svg><b>${esc(t.name)}</b></span>`}
function rankBar(t,noNext){return `<div class="rkbar"><span style="width:${Math.round(t.frac*100)}%;background:${t.color}"></span></div>${noNext?'':`<small class="muted">${t.next?'Siguiente: '+esc(t.next):'Rango máximo'}</small>`}`}
function vRanks(){
  const R=allRanks();const W=allWeights();
  if(!R.ex.length)return `<div class="empty">${W.length?'Aún no hay rangos: registra tus entrenos y aquí verás tu nivel en cada ejercicio.':'Para calcular tus rangos necesitamos tu peso: llegará con tu primer check-in.'}</div>`;
  const bwN=W.length?W[W.length-1]:null;const ag=curAge();
  const per=`<div class="rkper"><span class="lbl">Rangos personalizados con</span><div class="vchips"><span class="vchip">⚖️ <b>${bwN?nf(bwN.peso):'—'} kg</b> ${bwN?'· '+fdate(bwN.date):''}</span><span class="vchip">${FICHA.sexo==='Mujer'?'♀ Mujer':FICHA.sexo==='Hombre'?'♂ Hombre':'Sexo sin indicar'}</span><span class="vchip">${ag?ag+' años':'Edad sin indicar'}</span></div></div>`;
  return `${per}${R.glob?`<section class="rkhero" style="--rk:${R.glob.color}">${rankBadge(R.glob,true)}<div><span class="lbl">Rango global</span><b>${esc(R.glob.name)}</b>${rankBar(R.glob)}</div></section>`:`<div class="band">Tu <b>rango global</b> aparece cuando tengas al menos 5 ejercicios con rango (llevas ${R.ex.length}).</div>`}
  <section class="sec-h"><h2>Por grupo muscular</h2></section>
  <div class="rkgrid">${R.groups.map(g=>`<div class="rkcard">${rankBadge(g)}<b>${esc(g.g)}</b><small class="muted">${g.count} ejercicio${g.count>1?'s':''}</small>${rankBar(g)}</div>`).join('')}</div>
  <section class="sec-h"><h2>Por ejercicio</h2></section>
  <div class="rklist">${R.ex.map(e=>`<div class="rkrow">${rankBadge(e)}<div><b>${esc(e.n)}</b>${rankBar(e,!!e.goal)}${e.goal?`<small class="rkgoal">🎯 Para <b>${esc(e.next)}</b>: ${esc(e.goal)}</small>`:''}</div></div>`).join('')}</div>
  <p class="small muted" style="margin:0">Rangos hechos a tu medida: cada sesión se compara con el peso corporal que tenías ese día (el del check-in más cercano), con tu sexo y, a partir de los 40 años, con tu edad. Se usa una escala alométrica: no es lo mismo levantar 100 kg pesando 60 que pesando 100, y así cada uno se mide con su vara. El 🎯 te dice qué levantar con tu peso actual para subir al siguiente rango. Dominadas y fondos cuentan tu peso + lastre; flexiones y abdominales, las repeticiones; la plancha, los segundos. Si un día rindes peor, tu rango se mantiene.</p>`;
}

// ================= VOLUMEN SEMANAL POR MÚSCULO =================
// Cuenta series efectivas (no cuenta las de aproximación) por músculo principal del ejercicio.
const MUSCLES=['Pecho','Espalda','Hombro','Bíceps','Tríceps','Antebrazo','Cuádriceps','Isquios','Glúteo','Gemelos','Abductor','Aductor','Abdomen','Lumbar','Otro'];
const MUS_NORM={'Hombros':'Hombro','Core':'Abdomen','Abdominales':'Abdomen','Gluteo':'Glúteo','Glúteos':'Glúteo','Biceps':'Bíceps','Triceps':'Tríceps','Cuadriceps':'Cuádriceps','Isquiotibiales':'Isquios','Femoral':'Isquios','Gemelo':'Gemelos','Dorsal':'Espalda'};
const MUS_RX=[
  [/curl\s*(de\s*)?(isq|femoral)|femoral|isquio|rumano|rdl|buenos d[ií]as|good.?morning|n[oó]rdico/i,'Isquios'],
  [/hip.?thrust|puente de gl|gl[uú]te|kickback|patada de gl/i,'Glúteo'],
  [/abductor/i,'Abductor'],[/aductor/i,'Aductor'],
  [/gemelo|calf|s[oó]leo/i,'Gemelos'],
  [/crunch|abdominal|plancha|plank|rueda|elevaci[oó]n(es)? de piernas|pallof|sit.?up|hollow/i,'Abdomen'],
  [/hiperextensi|lumbar/i,'Lumbar'],
  [/sentadilla|squat|prensa|leg.?press|hack|p[eé]ndulo|b[uú]lgara|zancada|lunge|ext[\wáéíóú]*\.? (de )?cu[aá]driceps|leg.?ext|step.?up|sissy/i,'Cuádriceps'],
  [/peso muerto|deadlift/i,'Isquios'],
  [/antebrazo|mu[ñn]eca|wrist/i,'Antebrazo'],
  [/tr[ií]ceps|franc[eé]s|katana|patada|pushdown|copa|skull|jm press|press cerrado/i,'Tríceps'],
  [/curl|b[ií]ceps|martillo/i,'Bíceps'],
  [/militar|hombro|overhead|arnold|elevaci[oó]n(es)? (lateral|frontal)|lateral|p[aá]jaro|face.?pull|posterior|deltoid|upright|remo al ment[oó]n/i,'Hombro'],
  [/dominad|chin.?up|pull.?up|jal[oó]n|pulldown|pull.?over|remo|row|dorsal|espalda|encogimiento|shrug/i,'Espalda'],
  [/banca|bench|press|apertura|pec.?deck|contractor|cruce|fly|fondos|dips?\b|flexi[oó]n|push.?up|pecho/i,'Pecho']
];
const musGuess=n=>{const r=MUS_RX.find(x=>x[0].test(n||''));return r?r[1]:''};
function volMuscle(n,m){m=(m||'').trim();m=MUS_NORM[m]||m;return m||musGuess(n)||'Otro'}
const musOf=e=>volMuscle(e.n,e.m);
function musOpts(e){const g=musGuess(e.n);const cur=MUS_NORM[e.m]||e.m||'';const list=cur&&!MUSCLES.includes(cur)?MUSCLES.concat(cur):MUSCLES;
  return `<option value="" ${!cur?'selected':''}>Auto${g?': '+g:''}</option>`+list.map(m=>`<option ${cur===m?'selected':''}>${esc(m)}</option>`).join('')}
const effSets=e=>exSets(e).filter(x=>x.t!=='aprox').length;
function volPlan(){const per={};let tot=0;const RD=S.routine.filter(d=>!d.opt);const nd=RD.length;
  RD.forEach(d=>d.ex.forEach(e=>{const k=musOf(e),c=effSets(e);per[k]=(per[k]||0)+c}));
  const f=FICHA||{};const ds=+f.diasSemana||(f.diasModo!=='libre'?(f.dias||[]).length:0)||nd;const fac=nd?ds/nd:1;
  Object.keys(per).forEach(k=>{per[k]=Math.round(per[k]*fac*10)/10;tot+=per[k]});
  return {per,tot:Math.round(tot*10)/10,nd,ds,fac}}
function volWeek(off){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7)+7*off);const e=new Date(d);e.setDate(e.getDate()+6);return {a:iso(d),b:iso(e),da:d,db:e}}
function volDone(a,b){const per={};let tot=0,ses=new Set();
  Object.entries(S.hist).forEach(([n,H])=>{const re=routineEx(n);const m=volMuscle(n,re&&re.m);
    H.forEach(h=>{if(h.date>=a&&h.date<=b){const c=(h.sets||[]).filter(s=>s.t!=='aprox').length;if(c){per[m]=(per[m]||0)+c;tot+=c;ses.add(h.date)}}})});
  return {per,tot,ses:ses.size}}
const vnum=x=>nf(x,1).replace(',0','');
let volWk=0,volMus='';
function volPlanChips(){const P=volPlan();const ks=Object.keys(P.per).sort((a,b)=>P.per[b]-P.per[a]);
  if(!ks.length)return '<p class="small muted" style="margin:0">Añade ejercicios para ver el volumen.</p>';
  return `<div class="vchips">${ks.map(k=>`<span class="vchip"><b>${vnum(P.per[k])}</b> ${esc(k)}</span>`).join('')}</div>
  <p class="small muted" style="margin:0">Series efectivas por semana (sin contar las de aproximación) · total <b style="color:var(--fg)">${vnum(P.tot)}</b>.${P.fac!==1?` La rutina tiene ${P.nd} días y entrena ${P.ds} por semana, así que se escala ×${vnum(P.fac)}.`:''} ${S.routine.some(d=>d.opt)?' Las sesiones opcionales no cuentan en lo pautado (si las hace, sí suman en lo hecho).':''} El músculo de cada ejercicio lo eliges en «Músculo»; en «Auto» se deduce del nombre.</p>`}
function vVolume(coach){
  const rr=coach?'renderCoach()':'render()';const P=volPlan();const W=volWeek(volWk);const D=volDone(W.a,W.b);
  if(!S.routine.length&&!Object.keys(S.hist).length)return `<div class="empty">${coach?'Cuando tenga rutina y registre entrenos, aquí verás sus series por músculo.':'Cuando tengas rutina y registres entrenos, aquí verás tus series por músculo.'}</div>`;
  const ks=[...new Set(Object.keys(P.per).concat(Object.keys(D.per)))].sort((a,b)=>(P.per[b]||D.per[b]||0)-(P.per[a]||D.per[a]||0)||MUSCLES.indexOf(a)-MUSCLES.indexOf(b));
  const mx=Math.max(1,...ks.map(k=>Math.max(P.per[k]||0,D.per[k]||0)));
  const fd=d=>d.toLocaleDateString('es-ES',{day:'numeric',month:'short'});
  const pct=P.tot?Math.round(D.tot/P.tot*100):null;
  const bars=ks.map(k=>{const p=P.per[k]||0,d=D.per[k]||0;const st=p?(d>=p?'ok':''):'';return `<div class="vrow"><b>${esc(k)}</b><div class="vtrack"><span class="vfill ${st}" style="width:${(d/mx*100).toFixed(1)}%"></span>${p?`<i class="vplan" style="left:${(p/mx*100).toFixed(1)}%" title="Pautadas: ${vnum(p)}"></i>`:''}</div><span class="vnum">${vnum(d)}${p?`<small> / ${vnum(p)}</small>`:''}</span></div>`}).join('');
  // tendencia: últimas 8 semanas
  if(volMus&&!ks.includes(volMus))volMus='';
  const N=8,wk=[];for(let i=N-1;i>=0;i--){const w=volWeek(volWk-i);const dd=volDone(w.a,w.b);wk.push({w,v:volMus?(dd.per[volMus]||0):dd.tot})}
  const pl=volMus?(P.per[volMus]||0):P.tot;
  const CW=340,CH=160,L=26,R=8,T=16,B=24;const top=Math.max(1,pl,...wk.map(x=>x.v))*1.12;const bw=(CW-L-R)/N;const y=v=>T+(1-v/top)*(CH-T-B);
  const svg=`<svg class="chart" viewBox="0 0 ${CW} ${CH}" role="img" aria-label="Series por semana">
    ${[0,.5,1].map(f=>`<line x1="${L}" x2="${CW-R}" y1="${y(top*f/1.12)}" y2="${y(top*f/1.12)}" stroke="#2E2A24"/><text x="${L-5}" y="${y(top*f/1.12)+3}" text-anchor="end">${Math.round(top*f/1.12)}</text>`).join('')}
    ${wk.map((x,i)=>{const cx=L+i*bw+bw*.18,w=bw*.64;const cur=i===N-1;return `<rect x="${cx.toFixed(1)}" y="${y(x.v).toFixed(1)}" width="${w.toFixed(1)}" height="${(CH-B-y(x.v)).toFixed(1)}" rx="3" fill="#FFD60A" opacity="${cur?1:.55}"><title>Semana del ${fd(x.w.da)}: ${vnum(x.v)} series</title></rect>${x.v?`<text x="${(cx+w/2).toFixed(1)}" y="${(y(x.v)-4).toFixed(1)}" text-anchor="middle" fill="#E8E5DF">${vnum(x.v)}</text>`:''}<text x="${(cx+w/2).toFixed(1)}" y="${CH-8}" text-anchor="middle">${x.w.da.getDate()}/${x.w.da.getMonth()+1}</text>`}).join('')}
    ${pl?`<line x1="${L}" x2="${CW-R}" y1="${y(pl)}" y2="${y(pl)}" stroke="#7CE38B" stroke-width="1.5" stroke-dasharray="5 4"/>`:''}</svg>`;
  return `<div class="volnav"><button type="button" class="mini" onclick="volWk--;${rr}" aria-label="Semana anterior">‹</button><div><b>${volWk===0?'Esta semana':volWk===-1?'Semana pasada':'Semana del '+fd(W.da)}</b><small class="muted">${fd(W.da)} – ${fd(W.db)}</small></div><button type="button" class="mini" onclick="volWk=Math.min(0,volWk+1);${rr}" aria-label="Semana siguiente" ${volWk>=0?'disabled':''}>›</button></div>
  <div class="kpis"><div class="kpi"><small>Series hechas</small><b>${vnum(D.tot)}</b></div><div class="kpi"><small>Series pautadas / semana</small><b>${P.tot?vnum(P.tot):'—'}</b></div><div class="kpi"><small>Cumplimiento</small><b class="${pct===null?'':pct>=90?'good':pct>=60||volWk===0?'':'badc'}">${pct===null?'—':pct+' %'}</b></div><div class="kpi"><small>Días entrenados</small><b>${D.ses}</b></div></div>
  <div class="vbars">${bars||'<p class="small muted" style="margin:0">Sin datos esta semana.</p>'}</div>
  <div class="vleg small muted"><span><i class="lg f"></i>Series hechas</span><span><i class="lg p"></i>Pautadas por semana</span></div>
  <section class="sec-h" style="margin-top:6px"><h2 style="font-size:16px">Evolución · últimas ${N} semanas</h2></section>
  <div class="mtabs">${['',...ks].map(k=>`<button type="button" class="chip ${volMus===k?'on':''}" onclick="volMus='${k}';${rr}">${k?esc(k):'Todos'}</button>`).join('')}</div>
  ${svg}
  <p class="small muted" style="margin:0">Cuenta las series registradas de cada ejercicio en su músculo principal (no cuenta las de aproximación). La línea verde discontinua es lo pautado por semana${S.routine.some(d=>d.opt)?' (sin la sesión opcional, que si se hace suma en lo hecho)':''}.</p>`;
}

function fatStats(F,from){const f=F[0],l=F[F.length-1],d=l.v-f.v;return `<div class="wstats fat"><div><small>% graso · ${esc(from)}</small><b>${nf(f.v)} %</b></div><div><small>% graso ahora</small><b>${nf(l.v)} %</b></div><div><small>Cambio</small><b class="${d<=0?'good':'badc'}">${d>0?'+':''}${nf(d)} %</b></div></div>`}

// ---- el entrenador sube fotos a una revisión (también fotos antiguas, p. ej. las del inicio)
function askDelCheck(date){const c=S.checkins.find(x=>x.date===date);if(!c)return;const sh=document.getElementById('sheet');
  const det=[c.peso?nf(c.peso)+' kg':'',MEAS.filter(m=>m[2]==='cm'&&c[m[0]]).length?MEAS.filter(m=>m[2]==='cm'&&c[m[0]]).length+' perímetros':'',c.fotosP&&c.fotosP.length?c.fotosP.length+' fotos':''].filter(Boolean).join(' · ');
  sh.innerHTML=`<div class="sheet-in" role="dialog" aria-label="Borrar revisión"><div class="sheet-b"><h2>🗑 ¿Borrar esta revisión?</h2>
    <p style="margin:0">Revisión del <b>${new Date(date+'T12:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</b>${det?` · <span class="muted">${esc(det)}</span>`:''}</p>
    <p class="small muted" style="margin:0">Se borra entera: peso, perímetros, respuestas y fotos. Desaparece de sus gráficas y no se puede deshacer.</p>
    <div class="row"><button class="btn danger" type="button" id="delCkBtn" onclick="delCheck('${date}')">Sí, borrar</button><button class="btn ghost" type="button" onclick="closeSheet()">Cancelar</button></div></div></div>`;
  sh.hidden=false;sh.onclick=e=>{if(e.target===sh)closeSheet()}}
async function delCheck(date){const c=S.checkins.find(x=>x.date===date);if(!c)return;const b=document.getElementById('delCkBtn');if(b){b.disabled=true;b.textContent='Borrando…'}
  try{await flushSync();if(c.id){await db.del('checkins',c.id);delete SNAP.c[c.id]}try{await db.removePhotos(c.fotosP||[])}catch(e){console.warn(e)}
    S.checkins=S.checkins.filter(x=>x!==c);closeSheet();toast('Revisión borrada');renderCoach()}
  catch(e){console.error(e);toast('No se ha podido borrar: '+authMsg(e));if(b){b.disabled=false;b.textContent='Sí, borrar'}}}
const REV_M=MEAS.filter(m=>m[0]==='peso'||m[2]==='cm');
function openAddPhotos(date){
  const c=date?S.checkins.find(x=>x.date===date):null;const sh=document.getElementById('sheet');
  const v=k=>c&&c[k]!=null&&c[k]!==''?String(c[k]).replace('.',','):'';
  sh.innerHTML=`<div class="sheet-in" role="dialog" aria-label="Revisión"><div class="sheet-b"><div class="row" style="justify-content:space-between"><h2>📋 ${date?'Editar revisión':'Añadir revisión'}</h2><button class="btn ghost sm" type="button" onclick="closeSheet()">Cerrar</button></div>
  <form class="form" onsubmit="savePhotos(event,'${date}')">
    ${date?`<p class="small muted" style="margin:0">Revisión del <b style="color:var(--fg)">${new Date(date+'T12:00').toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'})}</b>. Cambia lo que quieras: las fotos nuevas sustituyen a las de ese mismo tipo.</p>`
      :`<div class="field"><label for="apD">Fecha de la revisión</label><input id="apD" type="date" required max="${iso(new Date())}"></div>
        <p class="small muted" style="margin:0">Si ya hay una revisión en esa fecha, se completa con lo que pongas aquí.</p>`}
    <span class="lbl">Peso y perímetros <small class="muted" style="text-transform:none;letter-spacing:0">· todo opcional</small></span>
    <div class="revgrid">${REV_M.map(m=>`<div class="field"><label for="apm-${m[0]}">${esc(m[1])} (${m[2]})</label><input id="apm-${m[0]}" inputmode="decimal" value="${esc(v(m[0]))}" placeholder="—"></div>`).join('')}</div>
    <span class="lbl">Fotos del físico <small class="muted" style="text-transform:none;letter-spacing:0">· opcional</small></span>
    <div class="photos">${['Frontal','Lateral','Espalda'].map(t=>`<label class="ph" data-k="${t.toLowerCase()}"><span style="font-size:20px">＋</span>${t}<input type="file" accept="image/*" onchange="pickPhoto(this)" aria-label="Foto ${t}"></label>`).join('')}</div>
    <button class="btn" type="submit">Guardar revisión</button></form></div></div>`;
  sh.hidden=false;sh.onclick=e=>{if(e.target===sh)closeSheet()};
}
async function savePhotos(e,date){
  e.preventDefault();const btn=e.target.querySelector('button[type=submit]');
  const labs=[...e.target.querySelectorAll('.ph')].filter(l=>l._file);
  const vals={};let bad='';REV_M.forEach(m=>{const el=document.getElementById('apm-'+m[0]);if(!el)return;const t=el.value.trim();if(t===''){vals[m[0]]=null;return}const n=parseFloat(t.replace(',','.'));if(isNaN(n)||n<=0)bad=m[1];else vals[m[0]]=n});
  if(bad){toast('Revisa el valor de '+bad);return}
  let d=date;if(!d){d=document.getElementById('apD').value;if(!d){toast('Pon la fecha');return}}
  let c=S.checkins.find(x=>x.date===d);
  const any=labs.length||Object.values(vals).some(x=>x!=null);
  if(!c&&!any){toast('Pon al menos un dato o una foto');return}
  btn.disabled=true;btn.textContent='Guardando…';
  try{
    const paths={};for(const l of labs){const k=l.dataset.k;const blob=await shrink(l._file,1600);const path=`${CUR.id}/${d}/${k}-${Date.now()}.jpg`;await db.uploadPhoto(path,blob);paths[k]=path}
    if(!c){c={date:d,r:{},fotos:0,fotosP:[],nota:'Revisión añadida por Yaron'};S.checkins.push(c);S.checkins.sort((a,b)=>a.date.localeCompare(b.date))}
    Object.entries(vals).forEach(([k,x])=>{if(x==null){if(date)delete c[k]}else c[k]=x});
    if(labs.length){const keep=(c.fotosP||[]).filter(p=>!Object.keys(paths).some(k=>p.includes('/'+k+'-')));c.fotosP=keep.concat(Object.values(paths));c.fotos=c.fotosP.length}
    save();await flushSync();toast('Revisión guardada');closeSheet();renderCoach();
  }catch(err){console.error(err);toast('No se ha podido guardar: '+authMsg(err));btn.disabled=false;btn.textContent='Guardar revisión'}
}

// ================= MI NEGOCIO: facturación, ticket medio, renovaciones =================
let PAYS=null; // todos los cobros (entrenador)
async function loadPays(force){if(PAYS&&!force)return PAYS;try{PAYS=(await db.payments()).map(p=>Object.assign(p,{importe:+p.importe}))}catch(e){PAYS=[]}return PAYS}
function payList(){if(!PAYS){loadPays().then(()=>{const b=document.getElementById('payBox');if(b)b.innerHTML=payList()});return '<p class="small muted">Cargando…</p>'}
  const L=PAYS.filter(p=>CUR&&p.client_id===CUR.id).slice().reverse();
  if(!L.length)return `<p class="small muted" style="margin:0">Sin cobros registrados. Mientras no registres ninguno, «Mi negocio» estima sus cobros con su fecha de alta, el tipo de suscripción y el pago actual.</p>`;
  return `<div class="tbl-w"><table><thead><tr><th>Fecha</th><th>Concepto</th><th>Importe</th><th>Nota</th><th></th></tr></thead><tbody>${L.map(p=>`<tr><td>${new Date(p.fecha+'T12:00').toLocaleDateString('es-ES')}</td><td>${p.concepto==='alta'?'Alta':p.concepto==='renovacion'?'Renovación':'Otro'}</td><td>${nf(p.importe,0)} €</td><td class="wrap">${esc(p.nota||'')}</td><td><button class="x" type="button" aria-label="Borrar cobro" onclick="payDel(${p.id})">×</button></td></tr>`).join('')}</tbody></table></div>`}
function payForm(){const sh=document.getElementById('sheet');const has=PAYS&&PAYS.some(p=>p.client_id===CUR.id);
  sh.innerHTML=`<div class="sheet-in" role="dialog" aria-label="Registrar cobro"><div class="sheet-b"><div class="row" style="justify-content:space-between"><h2>💶 Registrar cobro · ${esc(CLIENT.name)}</h2><button class="btn ghost sm" type="button" onclick="closeSheet()">Cerrar</button></div>
  <form class="form" onsubmit="paySave(event)"><div class="fgrid"><div class="field"><label for="pyD">Fecha</label><input id="pyD" type="date" value="${iso(new Date())}" required></div><div class="field"><label for="pyI">Importe (€)</label><input id="pyI" inputmode="decimal" value="${esc(FICHA.pago||'')}" required></div></div>
  <div class="field"><label for="pyC">Concepto</label><select id="pyC" style="background:var(--surface);border:1px solid var(--line-2);border-radius:8px;padding:10px;color:var(--fg)"><option value="renovacion" ${has||(FICHA.alta&&FICHA.alta<iso(daysAgo(7)))?'selected':''}>Renovación</option><option value="alta" ${has||(FICHA.alta&&FICHA.alta<iso(daysAgo(7)))?'':'selected'}>Alta (primer pago)</option><option value="otro">Otro</option></select></div>
  <div class="field"><label for="pyN">Nota (opcional)</label><input id="pyN" placeholder="Transferencia, Bizum…"></div>
  <label class="prow"><span>Mover la próxima renovación un periodo<small>Según su tipo de suscripción (${esc((SUBT.find(x=>x[0]===FICHA.tipo)||['','sin tipo'])[1])})</small></span><input class="sw" type="checkbox" id="pyR" ${SUBM[FICHA.tipo]?'checked':''}></label>
  <button class="btn" type="submit">Guardar cobro</button></form></div></div>`;sh.hidden=false;sh.onclick=e=>{if(e.target===sh)closeSheet()}}
async function paySave(e){e.preventDefault();const imp=parseFloat(String(document.getElementById('pyI').value).replace(',','.'));if(!(imp>0)){toast('Pon el importe');return}
  const row={client_id:CUR.id,fecha:document.getElementById('pyD').value,importe:imp,concepto:document.getElementById('pyC').value,nota:document.getElementById('pyN').value.trim()||null};
  try{const r=await db.addPayment(row);(PAYS=PAYS||[]).push(Object.assign(r,{importe:+r.importe}));PAYS.sort((a,b)=>a.fecha.localeCompare(b.fecha));
    if(document.getElementById('pyR').checked&&SUBM[FICHA.tipo]){const base=nextRenewal(FICHA)||row.fecha;const d=new Date(base+'T12:00');if(base<=row.fecha||!FICHA.renov){d.setMonth(d.getMonth()+SUBM[FICHA.tipo])}FICHA.renov=iso(d);if(!FICHA.alta)FICHA.alta=row.fecha;save()}
    toast('Cobro registrado');closeSheet();renderCoach()}catch(err){toast('No se ha podido guardar: '+authMsg(err))}}
async function payDel(id){if(!confirm('¿Borrar este cobro?'))return;try{await db.delPayment(id);PAYS=PAYS.filter(p=>p.id!==id);renderCoach()}catch(e){toast(authMsg(e))}}
async function openBiz(){try{await flushSync()}catch(e){}coachSel='__biz';document.querySelector('.cmain').innerHTML='<p class="muted">Calculando…</p>';await Promise.all([refreshList(),loadPays(true)]);renderCoach()}
const mAdd=(d,m)=>{const x=new Date(d+'T12:00');x.setMonth(x.getMonth()+m);return iso(x)};
const mDiff=(a,b)=>(new Date(b+'T12:00')-new Date(a+'T12:00'))/(30.44*864e5);
function bizClients(){const today=iso(new Date());
  return CL.map(c=>{const a=c.adm||{};const m=SUBM[a.tipo]||1;const pago=+a.pago||0;const alta=a.alta||(c.ficha&&c.ficha.alta)||'';
    const end=a.estado==='ended'?(a.baja||a.renovacion||today):a.estado==='paused'?(a.pausa||today):today;
    const real=(PAYS||[]).filter(p=>p.client_id===c.id);let pays,est=false;
    // Cobros registrados + estimación de los periodos anteriores al primer cobro registrado
    const firstReal=real.length?real[0].fecha:'9999';pays=[];
    if(alta&&pago>0){let d=alta,i=0;while(d<=end&&d<=today&&d<firstReal&&i<120){pays.push({fecha:d,importe:pago,concepto:i?'renovacion':'alta'});est=true;d=mAdd(d,m);i++}}
    real.forEach(p=>pays.push({fecha:p.fecha,importe:p.importe,concepto:p.concepto==='alta'&&pays.length?'renovacion':p.concepto}));
    const months=alta?Math.max(0,mDiff(alta,end>today?today:end)):null;
    return {c,a,m,pago,alta,end,pays,est,months,renewals:pays.filter(p=>p.concepto==='renovacion').length,firstDue:alta?mAdd(alta,m):null}})}
function cBiz(){
  const B=bizClients();const today=iso(new Date());const ym=today.slice(0,7);
  const act=B.filter(x=>x.a.estado==='active'||x.a.estado==='trial'),pau=B.filter(x=>x.a.estado==='paused'),end=B.filter(x=>x.a.estado==='ended');
  const P=B.flatMap(x=>x.pays.map(p=>Object.assign({n:x.c.name,est:x.est},p)));
  const month=P.filter(p=>p.fecha.slice(0,7)===ym).reduce((s,p)=>s+p.importe,0);
  const mrr=act.reduce((s,x)=>s+x.pago/x.m,0);
  const tick=P.length?P.reduce((s,p)=>s+p.importe,0)/P.length:0;
  const tickAct=act.filter(x=>x.pago>0);const tickA=tickAct.length?tickAct.reduce((s,x)=>s+x.pago,0)/tickAct.length:0;
  const dur=B.filter(x=>x.months!=null);const avgDur=dur.length?dur.reduce((s,x)=>s+x.months,0)/dur.length:0;
  const elig=B.filter(x=>x.firstDue&&x.firstDue<=today&&x.pago>0);const renewed=elig.filter(x=>x.renewals>0);
  const rate=elig.length?renewed.length/elig.length*100:null;const totalRen=B.reduce((s,x)=>s+x.renewals,0);
  const ltv=dur.length?B.reduce((s,x)=>s+x.pays.reduce((a,p)=>a+p.importe,0),0)/B.length:0;
  const months=Array.from({length:12},(_,i)=>{const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-11+i);const k=iso(d).slice(0,7);return {k,v:P.filter(p=>p.fecha.slice(0,7)===k).reduce((s,p)=>s+p.importe,0)}});
  const mx=Math.max(1,...months.map(x=>x.v));const MN=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  const bars=`<svg class="chart" viewBox="0 0 720 220" role="img" aria-label="Facturación por mes">${months.map((x,i)=>{const h=Math.round(x.v/mx*160);const X=20+i*58;return `<rect x="${X}" y="${180-h}" width="40" height="${h}" rx="3" fill="${x.k===ym?'#FFD60A':'#6b5d10'}"><title>${x.k}: ${nf(x.v,0)} €</title></rect>${x.v?`<text x="${X+20}" y="${174-h}" text-anchor="middle" style="fill:#ddd">${nf(x.v,0)}</text>`:''}<text x="${X+20}" y="198" text-anchor="middle">${MN[+x.k.slice(5)-1]}</text>`}).join('')}</svg>`;
  const lim=mAdd(today,1);const up=act.map(x=>({x,d:nextRenewal({renov:x.a.renovacion||'',tipo:x.a.tipo||'',alta:x.alta})})).filter(o=>o.d&&o.d<=lim).sort((a,b)=>a.d.localeCompare(b.d));
  const upSum=up.reduce((s,o)=>s+o.x.pago,0);const late=up.filter(o=>o.d<today);
  const byType=SUBT.map(([k,l])=>({l,n:act.filter(x=>x.a.tipo===k).length})).filter(o=>o.n);
  const estN=B.filter(x=>x.est).length;
  const k=(l,v,s,cls)=>`<div class="kpi"><small>${l}</small><b class="${cls||''}">${v}</b>${s?`<small>${s}</small>`:''}</div>`;
  return `<div class="chead"><div><span class="lbl">Panel general</span><h1>Mi negocio</h1></div></div>
  ${bkPanel()}
  <div class="kpis">${k('Facturado este mes',nf(month,0)+' €',new Date().toLocaleDateString('es-ES',{month:'long',year:'numeric'}))}${k('Ingreso recurrente mensual',nf(mrr,0)+' €/mes','Lo que generan tus activos al mes')}${k('Ticket medio',nf(tickA,0)+' €',`por cobro (${nf(tick,0)} € de media histórica)`)}${k('Valor medio por cliente',nf(ltv,0)+' €','Total cobrado ÷ clientes')}</div>
  <div class="kpis">${k('Clientes activos',act.length,`${pau.length} pausados · ${end.length} bajas · ${B.length} en total`)}${k('Duración media',nf(avgDur,1)+' meses','Desde el alta hasta hoy o hasta la baja')}${k('Renovaciones',totalRen,'Cobros de renovación en total')}${k('% de renovación',rate==null?'—':nf(rate,0)+' %',`${renewed.length} de ${elig.length} clientes renovaron al menos una vez`,rate==null?'':rate>=60?'good':rate>=40?'':'badc')}</div>
  <div class="panel"><span class="lbl">Facturación de los últimos 12 meses</span>${bars}</div>
  <div class="panel"><div class="sec-h"><span class="lbl">Renovaciones de los próximos 30 días</span><b>${nf(upSum,0)} € previstos</b></div>
    ${up.length?`<div class="tbl-w"><table><thead><tr><th>Cliente</th><th>Fecha</th><th>Importe</th><th>Tipo</th></tr></thead><tbody>${up.map(o=>`<tr><td><button class="linkbtn" type="button" onclick="coachTab='ficha';selectClient('${o.x.c.id}')">${esc(o.x.c.name)}</button></td><td class="${o.d<today?'badc':''}">${new Date(o.d+'T12:00').toLocaleDateString('es-ES',{day:'numeric',month:'short'})}${o.d<today?' · vencida':''}</td><td>${o.x.pago?nf(o.x.pago,0)+' €':'—'}</td><td>${esc((SUBT.find(t=>t[0]===o.x.a.tipo)||['','—'])[1])}</td></tr>`).join('')}</tbody></table></div>`:'<p class="small muted" style="margin:0">Ninguna en los próximos 30 días.</p>'}
    ${late.length?`<p class="small badc" style="margin:0">${late.length} renovación${late.length>1?'es':''} vencida${late.length>1?'s':''}: registra el cobro en su Ficha o cambia su estado.</p>`:''}</div>
  <div class="panel"><span class="lbl">Activos por tipo de suscripción</span><div class="kpis">${byType.map(o=>k(o.l,o.n)).join('')||'<p class="small muted">Sin datos.</p>'}</div></div>
  <p class="small muted" style="margin:0">${estN?`⚠️ ${estN} cliente${estN>1?'s':''} con cobros sin registrar: esos cobros se estiman con la fecha de alta, el tipo de suscripción y el pago actual de su Ficha. Para que todo sea exacto, registra cada cobro en su Ficha (💶 Registrar cobro).`:'Todas las cifras salen de los cobros que has registrado.'}</p>`;
}

// ---- consentimiento RGPD (datos de salud): obligatorio para usar la app
const CONSENT_V='2026-10-29';
function showConsent(){
  document.getElementById('app').hidden=true;const el=document.getElementById('auth');el.hidden=false;
  el.innerHTML=`<div class="auth-card">${AUTH_BRAND}<h1>Antes de <em>empezar</em></h1>
    <p class="auth-msg">Para hacer tu seguimiento, Yaron necesita tratar <b>datos de salud</b>: peso, medidas, fotos de tu físico, lesiones, alergias, medicación, sueño, estrés… Solo los veis tú y él, se guardan en servidores de la Unión Europea y puedes retirar este permiso cuando quieras desde tu perfil.</p>
    <label class="consent"><input type="checkbox" id="cOk"> <span>He leído la <a href="privacidad.html" target="_blank" rel="noopener">política de privacidad</a> y doy mi <b>consentimiento explícito</b> para el tratamiento de mis datos de salud para el seguimiento de mi programa.</span></label>
    <button class="btn" type="button" onclick="acceptConsent(this)">Aceptar y entrar</button>
    <div class="auth-links"><button type="button" onclick="logout()">Ahora no, salir</button></div></div>`;
}
async function acceptConsent(b){if(!document.getElementById('cOk').checked){toast('Marca la casilla para continuar');return}
  b.disabled=true;S.profile.consent=true;S.profile.consentAt=new Date().toISOString();S.profile.consentV=CONSENT_V;save();
  try{await flushSync()}catch(e){}
  document.getElementById('auth').hidden=true;document.getElementById('app').hidden=false;document.querySelector('.seg').hidden=true;document.getElementById('outBtn').hidden=true;document.getElementById('pkBtn').hidden=true;seenStart();
  tab='home';setView('client');if(OFFER_PK){OFFER_PK=false;offerPasskey()}}
function consentToggle(el){if(!el.checked){if(!confirm('Si retiras el consentimiento, Yaron no podrá seguir tratando tus datos de salud ni hacer tu seguimiento, y no podrás usar la app hasta que lo vuelvas a dar. ¿Retirarlo?')){el.checked=true;return}
  S.profile.consent=false;S.profile.consentAt=new Date().toISOString();save();flushSync().then(()=>showConsent())}}

// ---- Cómo come el cliente: igual todos los días, o entreno / descanso con bajadas a mano
const R_MEALS=[['breakfast','Desayuno'],['midmorning','Almuerzo'],['lunch','Comida'],['snack','Merienda'],['dinner','Cena']];
const R_MAC=[['protein','Proteína'],['fat','Grasas'],['carb','Hidratos'],['fruit','Fruta']];
const restHasCuts=()=>Object.values(FICHA.restCfg||{}).some(m=>Object.values(m||{}).some(v=>+v>0));
let restPrev=null;
function restPanel(){
  const td=FICHA.dietMode==='td';const C=FICHA.restCfg||{};const tot=R_MEALS.reduce((s,[m])=>s+R_MAC.reduce((a,[g])=>a+(+((C[m]||{})[g])||0),0),0);
  return `<div class="panel"><div class="sec-h"><span class="lbl">Cómo come este cliente</span><div class="seg2"><button type="button" class="chip ${!td?'on':''}" onclick="setDietMode('lineal')">🍽️ Igual todos los días</button><button type="button" class="chip ${td?'on':''}" onclick="setDietMode('td')">🏋️ Entreno · 🏠 sin entreno</button></div></div>
  ${td?`<p class="small muted" style="margin:0">Los días sin entreno solo baja lo que pongas aquí (kcal que quitas). Todo lo demás queda igual que los días de entreno. Ejemplo: en la cena, −100 kcal de hidratos.</p>
    <div class="tbl-w"><table class="rcfg"><thead><tr><th>Comida</th>${R_MAC.map(([,l])=>`<th>${l} (−kcal)</th>`).join('')}<th>Total</th></tr></thead><tbody>
    ${R_MEALS.map(([m,l])=>{const r=C[m]||{};const t=R_MAC.reduce((a,[g])=>a+(+r[g]||0),0);return `<tr><td>${l}</td>${R_MAC.map(([g])=>`<td><input inputmode="numeric" value="${r[g]?esc(r[g]):''}" placeholder="0" onchange="restSet('${m}','${g}',this.value)" aria-label="${l} ${g}"></td>`).join('')}<td><b>${t?'−'+t:'—'}</b></td></tr>`}).join('')}
    </tbody><tfoot><tr><td colspan="5"><b>Total del día</b></td><td><b class="y">${tot?'−'+tot+' kcal':'—'}</b></td></tr></tfoot></table></div>
    <div class="row"><button class="btn ghost sm" type="button" onclick="restPreview()">👁️ Ver cómo queda</button><span class="small muted">Después pulsa «Enviar plan a la app».</span></div><div id="restPrev">${restPrev||''}</div>`
  :`<p class="small muted" style="margin:0">El cliente verá un solo plan, sin selector de día de entreno o descanso.</p>`}</div>`}
function setDietMode(m){FICHA.dietMode=m;restPrev=null;if(m==='lineal'&&S.planCalc){S.restOn=false}else if(m==='td'&&S.planCalc&&S.planCalc.R&&S.planCalc.mode==='td'){S.restOn=true}save();renderCoach();
  if(S.planCalc)toast(m==='lineal'?'El cliente ya ve el mismo plan todos los días':S.restOn?'El cliente ya ve entreno / sin entreno':'Configura las bajadas y pulsa «Enviar plan a la app»')}
function restSet(m,g,v){const C=FICHA.restCfg=FICHA.restCfg||{};C[m]=C[m]||{};const n=Math.max(0,Math.round(+String(v).replace(',','.')||0));if(n)C[m][g]=n;else delete C[m][g];restPrev=null;save();setTimeout(renderCoach)}
function restPreview(){if(!CALC.ready||CALC.forId!==(CUR&&CUR.id)){toast('Espera a que cargue la Calculadora');return}
  CALC.exportCb=d=>{if(!d||d.error){toast(d&&d.error||'No se ha podido calcular');return}
    const rows=d.sum.filter(x=>x.T);const TT=rows.reduce((s,x)=>s+x.T,0),RR=rows.reduce((s,x)=>s+(x.R??x.T),0);
    restPrev=`<div class="tbl-w"><table><thead><tr><th>Comida</th><th>Entreno</th><th>Sin entreno</th><th>Diferencia</th></tr></thead><tbody>${rows.map(x=>{const l=(R_MEALS.find(r=>r[0]===x.m)||['',x.m])[1];const r=x.R??x.T;return `<tr><td>${l}</td><td>${x.T} kcal</td><td>${r} kcal</td><td class="${r<x.T?'good':''}">${r-x.T?(r-x.T)+' kcal':'='}</td></tr>`}).join('')}<tr><td><b>Día</b></td><td><b>${TT} kcal</b></td><td><b>${RR} kcal</b></td><td><b>${RR-TT} kcal</b></td></tr></tbody></table></div><p class="small muted" style="margin:0">Kcal aproximadas de una opción tipo por comida. Solo lo ves tú: el cliente nunca ve calorías.</p>`;
    renderCoach()};
  calcPost({type:'export',opts:{mode:'td',cfg:FICHA.restCfg||{},preview:true}})}

// ================= AVISOS (NOTIFICACIONES) =================
const pushOK=()=>'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone=()=>navigator.standalone===true||matchMedia('(display-mode: standalone)').matches;
const b64u=s=>{const p='='.repeat((4-s.length%4)%4);const b=atob((s+p).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from([...b].map(c=>c.charCodeAt(0)))};
let SWREG=null;
if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').then(r=>SWREG=r).catch(()=>{});
function pushState(){if(isIOS()&&!isStandalone())return 'ios-install';if(!pushOK())return 'unsupported';return Notification.permission}
function pushCard(){if(ME.role!=='client')return '';const st=pushState();let k='';try{k=localStorage.getItem('push-hide')}catch(e){}
  if(st==='granted'||st==='unsupported'||k)return '';
  if(st==='ios-install')return `<div class="remind"><span class="ic">🔔</span><div><b>Activa los avisos de tu revisión</b><small>En iPhone: pulsa Compartir ⬆️ → «Añadir a pantalla de inicio», abre la app desde ese icono y vuelve aquí.</small></div><button class="btn ghost sm" type="button" onclick="pushHide()">✕</button></div>`;
  if(st==='denied')return '';
  return `<div class="remind soon"><span class="ic">🔔</span><div><b>Activa los avisos</b><small>Te aviso la víspera y la mañana de tu revisión semanal para que no se te pase.</small></div><button class="btn sm" type="button" onclick="pushEnable()">Activar</button></div>`}
function pushHide(){try{localStorage.setItem('push-hide','1')}catch(e){}render()}
function pushStatusHTML(){if(ME.role!=='client')return '<p class="small muted" style="margin:0">Vista de entrenador: los avisos los activa el cliente en su móvil.</p>';const st=pushState();
  if(st==='granted')return `<p class="small" style="margin:0;color:var(--ok)">✓ Avisos activados en este móvil</p>`;
  if(st==='ios-install')return `<p class="small muted" style="margin:0">En iPhone, primero añade la app a tu pantalla de inicio (Compartir → «Añadir a pantalla de inicio») y ábrela desde ahí para poder activar los avisos.</p>`;
  if(st==='unsupported')return `<p class="small muted" style="margin:0">Este navegador no permite avisos.</p>`;
  if(st==='denied')return `<p class="small muted" style="margin:0">Has bloqueado los avisos. Actívalos en los ajustes del móvil (Notificaciones → Yaronska) y vuelve a entrar.</p>`;
  return `<button class="btn sm" type="button" onclick="pushEnable()">🔔 Activar avisos en este móvil</button>`}
async function pushSubscribe(){const reg=SWREG||await navigator.serviceWorker.ready;let sub=await reg.pushManager.getSubscription();
  if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(db.VAPID)});
  await db.savePushSub(sub.toJSON(),CUR.id);return sub}
async function pushEnable(){if(pushState()==='ios-install'||!pushOK()){toast('Primero añade la app a tu pantalla de inicio');return}
  try{const p=await Notification.requestPermission();if(p!=='granted'){toast('Sin permiso no te puedo avisar. Puedes activarlo en los ajustes del móvil.');render();return}
    await pushSubscribe();toast('Avisos activados ✓');render()}catch(e){console.error(e);toast('No se han podido activar los avisos: '+(e.message||e))}}
async function pushSilent(){try{if(pushOK()&&Notification.permission==='granted'&&CUR)await pushSubscribe()}catch(e){}}
async function testPushC(){try{const r=await db.testPush(CUR.id);toast(r&&r.sent?`Aviso enviado a ${r.sent} dispositivo${r.sent>1?'s':''}`:'Este cliente aún no ha activado los avisos en su móvil')}catch(e){toast('No se ha podido enviar: '+authMsg(e))}}

// ---- ordenador: ver la app del cliente en grande o como en el móvil
function applyMobile(){let m=false;try{m=localStorage.getItem('ys-mobile')==='1'}catch(e){}document.body.classList.toggle('mobile-mode',m);const b=document.getElementById('mobBtn');if(b)b.textContent=m?'🖥️ Ver en grande':'📱 Ver como en el móvil'}
function toggleMobile(){let m=document.body.classList.contains('mobile-mode');try{localStorage.setItem('ys-mobile',m?'0':'1')}catch(e){}applyMobile();window.scrollTo(0,0)}
applyMobile();

function setDayTipo(t){const k=iso(new Date());S.daily[k]=Object.assign({},S.daily[k]||{},{tipo:t});if(t==='R'&&S.daily[k].train===true)S.daily[k].train=false;dayType=t;if(today.train!==undefined&&t==='R')delete today.train;save();render()}

// ---- barrita de desplazamiento horizontal (para que se intuya que se puede deslizar)
const HS_SEL='.tabs,.tbl-w,.hscroll';
function hsbUpd(el){const bar=el.nextElementSibling;if(!bar||!bar.classList.contains('hsb'))return;const i=bar.firstChild;const r=el.clientWidth/el.scrollWidth;i.style.width=(r*100).toFixed(1)+'%';i.style.left=(el.scrollLeft/el.scrollWidth*100).toFixed(1)+'%'}
function hsbScan(){document.querySelectorAll(HS_SEL).forEach(el=>{let bar=el.nextElementSibling;const has=bar&&bar.classList.contains('hsb');const need=el.offsetParent&&el.scrollWidth>el.clientWidth+4;
  if(!need){if(has)bar.remove();return}
  if(!has){bar=document.createElement('div');bar.className='hsb';bar.setAttribute('aria-hidden','true');bar.innerHTML='<i></i>';el.after(bar)}
  if(!el._hsb){el._hsb=1;el.addEventListener('scroll',()=>hsbUpd(el),{passive:true})}hsbUpd(el)})}
let hsbRaf=0;const hsbQ=()=>{if(hsbRaf)return;hsbRaf=requestAnimationFrame(()=>{hsbRaf=0;hsbScan()})};
const domQuiet=n=>n&&n.nodeType===1&&(n.id==='rtBar'||n.closest&&(n.closest('#rtBar')||n.closest('.toast')||n.classList.contains('hsb')));
let domRaf=0;new MutationObserver(ms=>{if(ms.every(m=>domQuiet(m.target)||([...m.addedNodes,...m.removedNodes].every(domQuiet)&&(m.addedNodes.length||m.removedNodes.length))))return;if(domRaf)return;domRaf=requestAnimationFrame(()=>{domRaf=0;hsbScan();vidScan()})}).observe(document.body,{childList:true,subtree:true});
let rzT=0;addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(hsbQ,200)});
// cabecera fija: el contenido empieza justo debajo
(()=>{const h=document.querySelector('.top');if(!h||!window.ResizeObserver)return;new ResizeObserver(()=>document.documentElement.style.setProperty('--toph',h.offsetHeight+'px')).observe(h)})();

// ================= BIBLIOTECA DE VÍDEOS DE EJERCICIOS =================
// Los MP4 viven en /ej/ (servidos por Cloudflare con la app). ej/index.json: [{i:id, n:nombre, o:nombre original, g:grupo, s:'3D'|'2D'}]
const EJ='ej/';let LIB=null,libQ='',libG='',libS='',libPick=null,libTo=null;
function exVid(id){return `<div class="exvid ${/^3d\//.test(id)?'dk':''}"><video data-src="${EJ}${esc(id)}.mp4" poster="${EJ}${esc(id)}.jpg" muted loop playsinline preload="none" aria-label="Demostración del ejercicio"></video></div>`}
// solo se reproducen los vídeos que están en pantalla
const typing=()=>{const a=document.activeElement;return a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)};
const VIO=window.IntersectionObserver?new IntersectionObserver(es=>es.forEach(x=>{const v=x.target;if(x.isIntersecting&&x.intersectionRatio>=0.5&&!typing()){if(!v.src)v.src=v.dataset.src;const p=v.play();if(p&&p.catch)p.catch(()=>{})}else v.pause()}),{threshold:[0,0.5]}):null;
document.addEventListener('focusin',e=>{if(/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))document.querySelectorAll('video[data-src]').forEach(v=>v.pause())});
function vidScan(){document.querySelectorAll('video[data-src]:not([data-io])').forEach(v=>{v.dataset.io=1;if(VIO)VIO.observe(v);else{v.src=v.dataset.src;v.autoplay=true}})}

const nrm=t=>(t||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]/g,' ');
const STOP=new Set(['de','con','en','el','la','los','las','a','al','y','com','na','no','do','da','e','em','para','por']);
const toks=t=>nrm(t).split(/\s+/).filter(w=>w&&!STOP.has(w));
const stem=w=>w.length>4&&/es$/.test(w)?w.slice(0,-2):w.length>3&&/s$/.test(w)?w.slice(0,-1):w;
const SYN={banca:['pecho','plano'],placas:['maquina'],pajaro:['invers','pajaro'],trasero:['invers'],posterior:['invers','posterior'],frances:['tumbado'],copa:['encima'],katana:['encima'],cajon:['step','cajon'],crunch:['abdominal','crunch'],hiperextension:['hiperextension','lumbar'],deltoide:['hombro'],dorsal:['jalon','dorsal'],empuje:['press'],cuadricep:['cuadricep','extension'],femoral:['femoral'],isquio:['femoral','isquio','rumano'],gemelo:['gemelo'],trapecio:['encogimiento'],remo:['remo'],sentadilla:['sentadilla'],multipower:['smith'],mancuerna:['mancuerna'],polea:['polea'],dominada:['dominada'],jalon:['jalon'],pulldown:['jalon','pulldown'],hip:['hip'],thrust:['thrust'],puente:['puente','hip'],abductor:['abduc'],aductor:['aduc'],elevacione:['elevacion'],laterale:['lateral'],peck:['peck','aperturas'],contractor:['peck','aperturas'],cruce:['cruce'],predicador:['scott'],biceps:['curl','bicep'],tricep:['tricep']};
function libScore(x,q){const T=toks(q).map(stem);if(!T.length)return 1;const W=toks(x.n+' '+(x.o||'')).map(stem),Cw=toks(x.c||'').map(stem);const N=toks(x.n).length;let sc=0,hit=0;
  T.forEach(t=>{const alts=[t].concat(SYN[t]||[]);let best=0;alts.forEach(a=>{const m=(w,f)=>{if(w===a)best=Math.max(best,3*f);else if(w.startsWith(a)&&a.length>=3)best=Math.max(best,2*f);else if(a.length>=5&&w.includes(a))best=Math.max(best,1*f)};W.forEach(w=>m(w,1));Cw.forEach(w=>m(w,.4))});sc+=best;if(best)hit++});
  if(!hit)return 0;return sc/T.length+(hit===T.length?1:0)-Math.max(0,N-T.length)*0.08+(x.c?0:0.05)-(x.g==='Circuitos y variaciones'?1:0)}
async function loadLib(){if(LIB)return LIB;try{const r=await fetch(EJ+'index.json',{cache:'no-cache'});LIB=r.ok?await r.json():[]}catch(e){LIB=[]}return LIB}
async function openLib(di,ei){libTo=[di,ei];const e=RX(di,ei);libQ=e.n||'';libG='';libPick=e.vid||null;
  const sh=document.getElementById('sheet');sh.innerHTML='<div class="sheet-in libsheet"><div class="sheet-b"><p class="muted">Cargando biblioteca…</p></div></div>';sh.hidden=false;sh.onclick=x=>{if(x.target===sh)closeSheet()};
  await loadLib();libRender()}
function libRender(){const sh=document.getElementById('sheet');if(!libTo)return;const e=RX(libTo[0],libTo[1]);
  if(!LIB.length){sh.innerHTML=`<div class="sheet-in libsheet"><div class="sheet-b"><div class="row" style="justify-content:space-between"><h2>Biblioteca de vídeos</h2><button class="btn ghost sm" type="button" onclick="closeSheet()">Cerrar</button></div><p class="muted" style="margin:0">La biblioteca todavía está vacía.</p></div></div>`;return}
  const G=[...new Set(LIB.map(x=>x.g))].sort();
  const res=libRes();
  const pk=libPick&&LIB.find(x=>x.i===libPick);
  sh.innerHTML=`<div class="sheet-in libsheet" role="dialog" aria-label="Biblioteca de vídeos"><div class="sheet-b">
    <div class="row" style="justify-content:space-between"><h2>🎞 Vídeo para «${esc(e.n)}»</h2><button class="btn ghost sm" type="button" onclick="closeSheet()">Cerrar</button></div>
    ${pk?`<div class="libprev"><video class="${pk.s==='3D'?'dk':''}" src="${EJ}${esc(pk.i)}.mp4" poster="${EJ}${esc(pk.i)}.jpg" muted loop playsinline autoplay></video><div><b>${esc(pk.n)}</b>${pk.c?`<small>${esc(pk.c)}</small>`:''}<small class="muted">${esc(pk.g)} · ${pk.s==='3D'?'Vídeo 3D de técnica':'Animación'}</small><div class="row"><button class="btn sm" type="button" id="libUse" onclick="libUse()">Usar este vídeo</button>${e.vid?`<button class="btn ghost sm" type="button" onclick="libClear()">Quitar vídeo</button>`:''}</div></div></div>`:''}
    <div class="field"><label for="libQ">Buscar</label><input id="libQ" value="${esc(libQ)}" placeholder="press banca, sentadilla, remo…" oninput="libQ=this.value;clearTimeout(window._lq);window._lq=setTimeout(libList,150)" autocomplete="off"></div>
    <div class="mtabs libfmt">${[['','Todos los formatos'],['3D','🎥 Vídeo 3D de técnica'],['2D','Animación']].map(([k,l])=>`<button type="button" class="chip ${libS===k?'on':''}" data-s="${k}" onclick="libS='${k}';libList()">${l}</button>`).join('')}</div>
    <div class="mtabs libgrp">${['',...G].map(g=>`<button type="button" class="chip ${libG===g?'on':''}" data-g="${esc(g)}" onclick="libG=${esc(JSON.stringify(g))};libList()">${g?esc(g):'Todos'}</button>`).join('')}</div>
    <small class="muted" id="libCount">${res.length}${res.length>=150?'+':''} vídeos</small>
    <div id="libGrid" class="libgrid">${libGrid(res)}</div></div></div>`;
}
function libGrid(res){return res.length?res.map(x=>`<button type="button" class="libc ${x.i===libPick?'on':''}" onclick="libPick=${esc(JSON.stringify(x.i))};libRender()"><img class="${x.s==='3D'?'dk':''}" src="${EJ}${esc(x.i)}.jpg" alt="" loading="lazy">${x.s==='3D'?'<em class="b3d">3D</em>':''}<span>${esc(x.n)}</span>${x.c?`<small class="cue">${esc(x.c)}</small>`:''}<small>${esc(x.g)}${x.s?' · '+(x.s==='3D'?'Vídeo 3D técnica':'Animación'):''}</small></button>`).join(''):'<p class="muted small" style="margin:0">Nada con esa búsqueda. Prueba con otra palabra.</p>'}
function libRes(){return LIB.map(x=>({x,sc:libScore(x,libQ)})).filter(r=>r.sc>0&&(!libG||r.x.g===libG)&&(!libS||r.x.s===libS)).sort((a,b)=>b.sc-a.sc||a.x.n.localeCompare(b.x.n)||(a.x.s<b.x.s?1:-1)).slice(0,150).map(r=>r.x)}
function libList(){const res=libRes();const el=document.getElementById('libGrid');if(el)el.innerHTML=libGrid(res);const c=document.getElementById('libCount');if(c)c.textContent=res.length+(res.length>=150?'+':'')+' vídeos';document.querySelectorAll('.libsheet .mtabs.libgrp .chip').forEach(c=>c.classList.toggle('on',c.dataset.g===libG));document.querySelectorAll('.libsheet .mtabs.libfmt .chip').forEach(c=>c.classList.toggle('on',c.dataset.s===libS))}
function libUse(){const e=RX(libTo[0],libTo[1]);e.vid=libPick;save();closeSheet();renderCoach();toast('Vídeo asignado')}
function libClear(){const e=RX(libTo[0],libTo[1]);delete e.vid;libPick=null;save();closeSheet();renderCoach();toast('Vídeo quitado')}

// ---- aviso de versión nueva: si se ha publicado una actualización, ofrece recargar
(()=>{let base=null;const sig=async()=>{try{const rs=await Promise.all(['js/app.js','css/app.css'].map(u=>fetch(u,{method:'HEAD',cache:'no-store'})));return rs.map(r=>r.headers.get('etag')||r.headers.get('last-modified')||'').join('|')}catch(e){return null}};
  const show=()=>{if(document.getElementById('updBar'))return;const d=document.createElement('div');d.id='updBar';d.className='updbar';d.innerHTML='<span>Hay una versión nueva de la app</span><button class="btn sm" type="button">Actualizar</button>';d.querySelector('button').onclick=async()=>{try{await flushSync()}catch(e){}location.reload()};document.body.appendChild(d)};
  const check=async()=>{const s=await sig();if(!s||s==='|')return;if(base===null){base=s;return}if(s!==base)show()};
  check();setInterval(check,5*60*1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});})();

// ================= RESPUESTA A LA REVISIÓN =================
function ckPrev(date){const L=S.checkins.filter(x=>x.date<date);return L[L.length-1]||null}
function openRev(date){const c=S.checkins.find(x=>x.date===date);if(!c)return;const pv=ckPrev(date);const sh=document.getElementById('sheet');const rv=c.rev||{};
  const rows=MEAS.filter(m=>c[m[0]]!=null||(pv&&pv[m[0]]!=null)).map(m=>{const a=c[m[0]],b=pv?pv[m[0]]:null;const d=a!=null&&b!=null?a-b:null;
    return `<tr><td>${esc(m[1])}</td><td>${b!=null?nf(b,1)+' '+m[2]:'—'}</td><td><b>${a!=null?nf(a,1)+' '+m[2]:'—'}</b></td><td class="${d==null?'':m[0]==='hs'?(d>=0?'good':'badc'):(m[0]==='peso'?goodDir(d):d<=0)?'good':'badc'}">${d==null?'':(d>0?'+':'')+nf(d,1)}</td></tr>`}).join('');
  const sc=SCALES.filter(x=>c.r&&c.r[x.k]).map(x=>`<span class="vchip">${esc(x.t)}: <b>${c.r[x.k]}/5</b></span>`).join('');
  sh.innerHTML=`<div class="sheet-in revsheet" role="dialog" aria-label="Revisar"><div class="sheet-b"><div class="row" style="justify-content:space-between"><h2>📝 Revisión del ${fdate(date)}</h2><button class="btn ghost sm" type="button" onclick="closeSheet()">Cerrar</button></div>
    ${rows?`<div class="tbl-w"><table><thead><tr><th></th><th>Anterior${pv?' · '+fdate(pv.date):''}</th><th>Esta</th><th>Cambio</th></tr></thead><tbody>${rows}</tbody></table></div>`:''}
    ${sc?`<div class="vchips">${sc}</div>`:''}
    ${c.nota?`<div class="cnote">💬 <b>Su comentario:</b> ${esc(c.nota)}</div>`:''}
    ${c.fotosP&&c.fotosP.length?`<button class="btn ghost sm" type="button" onclick='viewPhotos(${JSON.stringify(c.fotosP)})'>📷 Ver sus ${c.fotosP.length} fotos</button>`:''}
    <div class="field"><label for="rvT">Tu valoración para ${esc(CLIENT.first||'el cliente')}</label><textarea id="rvT" rows="5" placeholder="Muy buena semana: has bajado 0,6 kg y la cintura sigue bajando. Esta semana subimos pasos a 10.000 y mantenemos la dieta.">${esc(rv.txt||'')}</textarea></div>
    <div class="field"><label for="rvU">Vídeo o audio (opcional · enlace de Yaronska Rec, Drive, Loom…)</label><input id="rvU" type="url" value="${esc(rv.url||'')}" placeholder="https://…"></div>
    <label class="chkrow"><input type="checkbox" id="rvN" ${rv.at?'':'checked'}> Avisarle con una notificación en el móvil</label>
    ${rv.at?`<p class="small muted" style="margin:0">Revisada el ${new Date(rv.at).toLocaleString('es-ES',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}${rv.seen?' · ✓ el cliente ya la ha leído':' · el cliente aún no la ha abierto'}.</p>`:''}
    <div class="row"><button class="btn" type="button" id="rvSave" onclick="saveRev('${date}')">${rv.at?'Guardar cambios':'✅ Marcar como revisada'}</button>${rv.at?`<button class="btn ghost" type="button" onclick="unRev('${date}')">Quitar «revisada»</button>`:''}</div></div></div>`;
  sh.hidden=false;sh.onclick=e=>{if(e.target===sh)closeSheet()}}
async function saveRev(date){const c=S.checkins.find(x=>x.date===date);if(!c)return;const txt=document.getElementById('rvT').value.trim(),url=document.getElementById('rvU').value.trim(),nt=document.getElementById('rvN').checked;
  if(url&&!/^https?:\/\//i.test(url)){toast('El enlace debe empezar por https://');return}
  const b=document.getElementById('rvSave');b.disabled=true;b.textContent='Guardando…';
  const old=c.rev||{};c.rev={at:old.at||new Date().toISOString(),txt,url};if(old.at&&(old.txt!==txt||old.url!==url)){c.rev.at=new Date().toISOString()}
  try{save();await flushSync();
    if(nt){try{const r=await db.notify(CUR.id,'revisada',txt?txt.slice(0,120):'Entra en la app para ver sus comentarios.');toast(r&&r.sent?'Revisada y avisado en su móvil':'Revisada · no tiene los avisos activados en el móvil')}catch(e){toast('Revisada (no se pudo enviar el aviso)')}}else toast('Revisión guardada');
    closeSheet();if(PEND)pendMark(CUR.id,date);renderCoach()}
  catch(e){console.error(e);toast('No se ha podido guardar: '+authMsg(e));b.disabled=false;b.textContent='Guardar'}}
async function unRev(date){const c=S.checkins.find(x=>x.date===date);if(!c)return;delete c.rev;save();await flushSync();closeSheet();if(PEND){const k=PEND.ck.find(x=>x.client_id===CUR.id&&x.fecha===date);if(k)k.rev=null;pendCount()}renderCoach()}
// cliente: la última revisión revisada que aún no ha leído
function lastRev(){const L=S.checkins.filter(x=>x.rev&&(x.rev.txt||x.rev.url));return L[L.length-1]||null}
function revCard(){const c=lastRev();if(!c)return '';const seen=c.rev.seen&&c.rev.seen>=c.rev.at;
  return `<section class="revcard ${seen?'seen':''}" aria-label="Respuesta de Yaron"><div class="sec-h"><span class="lbl">📝 Yaron ha revisado tu revisión del ${fdate(c.date)}</span>${seen?'':'<span class="pendn">Nuevo</span>'}</div>
    ${c.rev.txt?`<p style="margin:0;white-space:pre-line">${esc(c.rev.txt)}</p>`:''}
    <div class="row">${c.rev.url?`<a class="btn sm" href="${esc(c.rev.url)}" target="_blank" rel="noopener">▶ Ver el vídeo de Yaron</a>`:''}${seen?'':`<button class="btn ghost sm" type="button" onclick="revSeen('${c.date}')">Entendido 👍</button>`}</div></section>`}
function revSeen(date){const c=S.checkins.find(x=>x.date===date);if(!c||!c.rev)return;c.rev.seen=new Date().toISOString();save();render()}
function revHistory(){const L=S.checkins.filter(x=>x.rev&&(x.rev.txt||x.rev.url)).slice().reverse();if(!L.length)return '';
  return `<section class="sec-h"><h2 style="font-size:16px">Respuestas de Yaron</h2></section><div class="revlist">${L.map(c=>`<details class="revitem"><summary><b>${fdate(c.date)}</b>${c.peso?` · ${nf(c.peso)} kg`:''}</summary>${c.rev.txt?`<p style="margin:6px 0 0;white-space:pre-line">${esc(c.rev.txt)}</p>`:''}${c.rev.url?`<a class="btn ghost sm" style="margin-top:6px" href="${esc(c.rev.url)}" target="_blank" rel="noopener">▶ Ver vídeo</a>`:''}</details>`).join('')}</div>`}

// ================= PENDIENTES DE HOY =================
let PEND=null,PEND_N=0;
async function loadPend(){try{PEND=await db.pending(iso(daysAgo(21)));await loadForms();pendCount()}catch(e){console.error(e)}}
const activeCL=()=>CL.filter(c=>!['paused','ended'].includes(c.estado));
function pendData(){const P=PEND||{ck:[],wl:[]};const A=new Set(activeCL().map(c=>c.id));const nm=id=>(CL.find(c=>c.id===id)||{}).name||'—';const lim7=iso(daysAgo(7));
  const rev=P.ck.filter(x=>!x.rev&&A.has(x.client_id)).map(x=>({id:x.client_id,n:nm(x.client_id),date:x.fecha}));
  const notes=P.wl.filter(x=>x.nota&&x.fecha>=lim7&&A.has(x.client_id)).map(x=>({id:x.client_id,n:nm(x.client_id),date:x.fecha,ej:x.ejercicio,nota:x.nota,solo:!(x.sets&&x.sets.length)}));
  const lastTr={};P.wl.forEach(x=>{if(x.sets&&x.sets.length&&(!lastTr[x.client_id]||x.fecha>lastTr[x.client_id]))lastTr[x.client_id]=x.fecha});
  const now=Date.now();const inact=activeCL().filter(c=>c.linked&&(!c.seen||now-Date.parse(c.seen)>3*864e5||!lastTr[c.id]||lastTr[c.id]<lim7)).map(c=>({id:c.id,n:c.name,seen:c.seen,tr:lastTr[c.id]||null,noApp:!c.seen||now-Date.parse(c.seen)>3*864e5}));
  const noLink=activeCL().filter(c=>!c.linked).map(c=>({id:c.id,n:c.name}));
  const t=iso(new Date()),t7=iso(new Date(Date.now()+7*864e5));const ren=activeCL().filter(c=>c.renov&&c.renov<=t7).map(c=>({id:c.id,n:c.name,date:c.renov,late:c.renov<t})).sort((a,b)=>a.date.localeCompare(b.date));
  const late=activeCL().filter(c=>c.linked&&c.st==='bad').map(c=>({id:c.id,n:c.name,t:c.t}));
  return {rev,notes,inact,noLink,ren,late}}
function pendCount(){const d=pendData();PEND_N=d.rev.length+d.notes.length+FORMS.filter(f=>!f.imported_at).length;const el=document.querySelector('.pendbtn');if(el){let b=el.querySelector('.pendn');if(PEND_N){if(!b){b=document.createElement('span');b.className='pendn';el.appendChild(b)}b.textContent=PEND_N}else if(b)b.remove()}}
function pendMark(id,date){if(!PEND)return;const k=PEND.ck.find(x=>x.client_id===id&&x.fecha===date);if(k)k.rev={at:new Date().toISOString()};pendCount()}
async function openPend(){try{await flushSync()}catch(e){}coachSel='__pend';const m=document.querySelector('.cmain');if(m)m.innerHTML='<p class="muted">Cargando…</p>';await Promise.all([refreshList(),loadPend()]);renderCoach()}
async function goCl(id,tab,fn){await selectClient(id);coachSel=id;coachTab=tab;renderCoach();if(fn)setTimeout(fn,60)}
function cPend(){const d=pendData();const fd=x=>new Date(x+'T12:00').toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short'});
  const box=(ico,t,list,empty,row)=>`<div class="panel pendbox"><div class="sec-h"><span class="lbl">${ico} ${t}</span><span class="pcount ${list.length?'on':''}">${list.length}</span></div>${list.length?`<div class="plist">${list.map(row).join('')}</div>`:`<p class="small muted" style="margin:0">${empty}</p>`}</div>`;
  const nmq=x=>esc(JSON.stringify(x));
  return `<div class="chead"><div><span class="lbl">${new Date().toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})}</span><h1>Pendientes de hoy</h1></div><button class="btn ghost sm" type="button" onclick="openPend()">↻ Actualizar</button></div>
  <div class="pendgrid">
  ${box('📝','Revisiones sin revisar',d.rev,'Todo revisado 👌',x=>`<button type="button" class="pitem" onclick='goCl(${nmq(x.id)},"checkins",()=>openRev(${nmq(x.date)}))'><b>${esc(x.n)}</b><small>Enviada el ${fd(x.date)}</small><span class="y">Revisar →</span></button>`)}
  ${box('🩹','Notas de los entrenos · 7 días',d.notes,'Nadie ha dejado notas esta semana.',x=>`<button type="button" class="pitem" onclick='goCl(${nmq(x.id)},"sesiones")'><b>${esc(x.n)} · <span class="muted">${esc(x.ej)}</span></b><small>${fd(x.date)}${x.solo?' · no hizo el ejercicio':''}</small><span class="pnote">«${esc(x.nota)}»</span></button>`)}
  ${box('😴','Clientes poco activos',d.inact,'Todos activos esta semana 💪',x=>`<button type="button" class="pitem" onclick='goCl(${nmq(x.id)},"diario")'><b>${esc(x.n)}</b><small>${x.noApp?'App: '+seenTxt(x.seen).t.toLowerCase():'Entra en la app'} · ${x.tr?'último entreno '+fd(x.tr):'sin entrenos registrados en 3 semanas'}</small></button>`)}
  ${box('⏰','Revisiones atrasadas',d.late,'Nadie lleva más de 15 días sin revisión.',x=>`<button type="button" class="pitem" onclick='goCl(${nmq(x.id)},"checkins")'><b>${esc(x.n)}</b><small>${esc(x.t)}</small></button>`)}
  ${box('🔁','Renovaciones · próximos 7 días',d.ren,'Ninguna renovación esta semana.',x=>`<button type="button" class="pitem" onclick='goCl(${nmq(x.id)},"ficha")'><b>${esc(x.n)}</b><small class="${x.late?'badc':''}">${x.late?'Vencida el ':'Renueva el '}${fd(x.date)}</small></button>`)}
  ${(()=>{const L=FORMS.filter(f=>!f.imported_at);return L.length?box('🆕','Formularios de onboarding nuevos',L,'',x=>{const c=x.client_id&&CL.find(k=>k.id===x.client_id);return `<button type="button" class="pitem" onclick='${c?`goCl(${nmq(x.client_id)},"ficha")`:`formNewClient(${x.id})`}'><b>${esc(x.nombre||x.email||'Sin nombre')}</b><small>${fd((x.submitted_at||x.created_at).slice(0,10))} · ${esc(x.email||'sin email')}</small><span class="y">${c?'Ver y pasar a la Ficha →':'Aún no es cliente · darle de alta →'}</span></button>`}):''})()}
  ${!BK.last||Date.now()-Date.parse(BK.last)>48*3600e3?`<div class="panel pendbox"><div class="sec-h"><span class="lbl">💾 Copia de seguridad</span><span class="pcount on">!</span></div><button type="button" class="pitem" onclick="openBiz()"><b>${BK.last?'Última copia: '+esc(seenTxt(BK.last).t.toLowerCase()):'Aún no has hecho ninguna copia'}</b><small>${BK.dir?'Pulsa para hacerla ahora':'Elige la carpeta de Google Drive en «Mi negocio»'}</small></button></div>`:''}
  ${d.noLink.length?box('✉️','Sin activar la cuenta',d.noLink,'',x=>`<button type="button" class="pitem" onclick='inviteMsg(${nmq(x.id)})'><b>${esc(x.n)}</b><small>Aún no ha creado su cuenta · reenviar invitación</small></button>`):''}
  </div>`}

// ================= RACHAS =================
function dayStreak(){const ok=d=>d&&d.diet===true&&d.stepsOk===true;let n=0,i=ok(S.daily[iso(new Date())])?0:1;
  for(;i<400;i++){if(ok(S.daily[iso(daysAgo(i))]))n++;else break}
  let best=0,cur=0;Object.keys(S.daily).sort().forEach((k,j,a)=>{const prevOk=j&&((new Date(k+'T12:00')-new Date(a[j-1]+'T12:00'))/864e5===1);if(ok(S.daily[k])){cur=prevOk&&cur?cur+1:1;best=Math.max(best,cur)}else cur=0});return {n,best:Math.max(best,n)}}
function weekStreak(){const optN=new Set(S.routine.filter(d=>d.opt).map(d=>d.d));const nReq=S.routine.filter(d=>!d.opt).length;const target=Math.max(1,+FICHA.diasSemana||nReq||1);
  const cnt=off=>{const W=volWeek(off);const ses=new Set();Object.values(S.hist).forEach(a=>a.forEach(h=>{if(h.date>=W.a&&h.date<=W.b&&h.sets&&h.sets.length&&!optN.has(h.day))ses.add(h.date+'|'+h.day)}));return ses.size};
  let n=0;const cur=cnt(0)>=target;for(let o=-1;o>-60;o--){if(cnt(o)>=target)n++;else break}return {n:n+(cur?1:0),cur}}
function streakCard(){if(view!=='client'&&!S)return '';const D=dayStreak(),W=weekStreak();if(D.n<2&&W.n<1)return '';
  return `<section class="streaks">${D.n>=2?`<div class="stk1"><span class="fire">🔥</span><div><b>${D.n} días seguidos</b><small>cumpliendo dieta y pasos${D.best>D.n?` · tu mejor racha: ${D.best}`:''}</small></div></div>`:''}${W.n>=1?`<div class="stk1"><span class="fire">💪</span><div><b>${W.n} semana${W.n>1?'s':''} seguida${W.n>1?'s':''}</b><small>completando todos tus entrenos</small></div></div>`:''}</section>`}

// ================= TEMPORIZADOR DE DESCANSO =================
function restSec(t){t=String(t||'').toLowerCase().replace(',','.');let m;
  if((m=/(\d+):(\d{1,2})/.exec(t)))return +m[1]*60+ +m[2];
  if((m=/(\d+(?:\.\d+)?)\s*(?:-\s*\d+(?:\.\d+)?)?\s*(min|m\b|')/.exec(t)))return Math.round(+m[1]*60);
  if((m=/(\d+)\s*(?:-\s*\d+)?\s*(s|seg|")/.exec(t)))return +m[1];
  if((m=/^\s*(\d+)\s*$/.exec(t)))return +m[1]>10?+m[1]:+m[1]*60;return 0}
let RT=null;
const rtSound=()=>{try{return localStorage.getItem('rtSound')!=='0'}catch(e){return true}};
let SAVED_AT=0;function restGo(di,ei,si,el){setTimeout(()=>{if(Date.now()-SAVED_AT<1500)return;restGo2(di,ei,si,el)},350)}
function restGo2(di,ei,si,el){if(!el||!el.value.trim()||!document.body.contains(el))return;const d=S.routine[di];if(!d)return;const e=d.ex[ei];if(!e)return;
  if(e.blk){const mates=d.ex.map((x,i)=>({x,i})).filter(o=>o.x.blk===e.blk);if(mates.length>1&&mates[mates.length-1].i!==ei)return}
  const x=exSets(e)[si]||{};const sec=restSec(x.rest||e.rest);if(!sec)return;
  const last=si===e.s-1;const next=last?(d.ex[ei+1]?d.ex[ei+1].n:''):`Serie ${si+2} de ${e.n}`;
  if(RT)clearInterval(RT.iv);RT={end:Date.now()+sec*1000,total:sec,next,done:false};rtTick();RT.iv=setInterval(rtTick,500);try{if(window.AudioContext&&!window._ac)window._ac=new AudioContext()}catch(e){}}
function rtBeep(){if(!rtSound())return;try{const ac=window._ac||new AudioContext();window._ac=ac;[0,0.25,0.5].forEach((t,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=i===2?1175:880;g.gain.setValueAtTime(.0001,ac.currentTime+t);g.gain.exponentialRampToValueAtTime(.4,ac.currentTime+t+.02);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+t+.2);o.connect(g).connect(ac.destination);o.start(ac.currentTime+t);o.stop(ac.currentTime+t+.22)})}catch(e){}}
function rtTick(){if(!RT)return;let el=document.getElementById('rtBar');
  if(!el||el.dataset.done!==String(!!RT.done)){if(!el){el=document.createElement('div');el.id='rtBar';el.className='rtbar';document.body.appendChild(el);document.body.classList.add('rt-on')}
    el.dataset.done=String(!!RT.done);el.innerHTML=`<div class="rtfill"></div><div class="rtin"><b class="rtt"></b><small class="rts"></small></div><div class="rtbtns">${RT.done?'':`<button type="button" onclick="rtAdd(-15)" aria-label="Quitar 15 segundos">−15</button><button type="button" onclick="rtAdd(15)" aria-label="Añadir 15 segundos">+15</button>`}<button type="button" class="snd" onclick="rtSnd()" aria-label="Sonido"></button><button type="button" onclick="rtStop()" aria-label="Cerrar temporizador">✕</button></div>`}
  const left=Math.max(0,Math.ceil((RT.end-Date.now())/1000));
  if(left<=0&&!RT.done){RT.done=true;try{navigator.vibrate&&navigator.vibrate([300,120,300,120,500])}catch(e){}rtBeep();setTimeout(()=>{if(RT&&RT.done)rtStop()},6000);return rtTick()}
  const t=el.querySelector('.rtt'),sm=el.querySelector('.rts'),f=el.querySelector('.rtfill'),sn=el.querySelector('.snd');
  const txt=RT.done?'💥 ¡A por ella!':`⏱ ${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`;if(t.textContent!==txt)t.textContent=txt;t.classList.toggle('go',RT.done);
  const st=RT.done?(RT.next||'Siguiente serie'):'Descanso'+(RT.next?' · luego: '+RT.next:'');if(sm.textContent!==st)sm.textContent=st;
  f.style.width=(RT.total?Math.min(100,(1-left/RT.total)*100):100)+'%';const si=rtSound()?'🔔':'🔕';if(sn.textContent!==si)sn.textContent=si}
function rtAdd(s){if(!RT)return;RT.end+=s*1000;RT.total=Math.max(1,RT.total+s);rtTick()}
function rtSnd(){try{localStorage.setItem('rtSound',rtSound()?'0':'1')}catch(e){}rtTick()}
function rtStop(){if(RT)clearInterval(RT.iv);RT=null;const el=document.getElementById('rtBar');if(el)el.remove();document.body.classList.remove('rt-on')}

// ================= CUESTIONARIO INICIAL =================
// [clave, pregunta, tipo, opciones, campo de la Ficha al que se pasa]
const CUEST=[
 {t:'Datos personales y físicos',ico:'👤',q:[
  ['nombre','Nombre completo','text',null,'nombre'],['nac','Fecha de nacimiento','date',null,'nac'],['genero','Género','choice',['Hombre','Mujer','Prefiero no decir'],'sexo'],
  ['altura','Altura (cm)','num',null,'altura'],['peso','Peso actual (kg)','num'],['pesoObj','Peso objetivo (kg)','num'],['grasa','% de grasa estimado (si lo sabes)','num'],
  ['trabajo','Ocupación / trabajo','text'],['ciudad','Ciudad','text'],['tel','Teléfono / Instagram','text',null,'tel'],['origen','¿Cómo me encontraste?','choice',['Instagram','Recomendación','Google','Otro']]]},
 {t:'Historial médico',ico:'🩺',q:[
  ['diag','¿Tienes algún diagnóstico médico relevante? (hipercolesterolemia, hipotiroidismo, diabetes, SOP…)','area',null,'patologias'],['medic','Medicación actual (nombre y dosis)','area',null,'medicacion'],
  ['alerg','Alergias alimentarias','text',null,'alergias'],['intol','Intolerancias alimentarias','text',null,'intol'],
  ['lesion','Lesiones actuales o crónicas (dónde, cuándo empezó, si limita tu actividad)','area',null,'lesiones'],['supl','Suplementación actual (nombre, dosis, frecuencia)','area',null,'suplem'],
  ['ciclo','Solo si aplica: ciclo menstrual / menopausia. ¿Ciclo regular? ¿Anticonceptivos? ¿Perimenopausia o menopausia?','area',null,'ciclo']]},
 {t:'Hábitos alimentarios',ico:'🍽',q:[
  ['comidas','¿Cuántas comidas haces al día?','text'],['horarios','Horarios aproximados de comidas','text'],['gusta','Alimentos que te GUSTAN o te apetecen (sé específico/a)','area',null,'prefs'],
  ['noGusta','Alimentos que NO te gustan o no quieres comer','area',null,'evitar'],['fuera','¿Comes fuera de casa? ¿Cuántas veces a la semana y en qué contexto?','area'],
  ['agua','Litros de agua al día (aprox.)','text',null,'agua'],['alcohol','¿Consumes alcohol? ¿Con qué frecuencia?','text',null,'alcohol']]},
 {t:'Entrenamiento y actividad',ico:'🏋️',q:[
  ['entreno','¿Qué entrenamiento haces actualmente? (tipo, días por semana, duración)','area',null,'tipoEntreno'],['exp','Experiencia en el gimnasio','choice',['Principiante (<1 año)','Intermedio (1-3 años)','Avanzado (>3 años)']],
  ['disp','¿Qué días puedes entrenar y cuánto tiempo tienes por sesión?','area'],['material','¿Qué material tienes disponible?','choice',['Gimnasio completo','Gym básico','Casa con material','Solo peso corporal']],
  ['pasos','Pasos diarios aproximados','text'],['deporte','¿Practicas algún deporte extra?','text']]},
 {t:'Psicología alimentaria',ico:'🧠',q:[
  ['dietas','¿Has hecho dietas antes? ¿Cuáles? ¿Qué resultado tuviste?','area',null,'histDietas'],['control','¿Sientes que pierdes el control con la comida en algún momento?','choice',['Nunca','Pocas veces','A veces','Con frecuencia']],
  ['cuando','¿Cuándo ocurre más? (noche, fines de semana, estrés…)','text'],['cuerpo','Relación con tu cuerpo ahora mismo (1 = muy mal · 10 = muy bien)','scale'],
  ['evita','¿Evitas situaciones por tu aspecto físico? (playa, fotos, ropa…)','area']]},
 {t:'Objetivos y expectativas',ico:'🎯',q:[
  ['objetivo','¿Cuál es tu objetivo principal? (lo más específico posible)','area',null,'objLargo'],['porque','¿Por qué ahora? ¿Qué te ha llevado a buscar asesoramiento en este momento?','area'],
  ['espera','¿Qué esperas de la asesoría Yaronska? ¿Qué necesitas de mí como coach?','area'],['miedo','¿Cuál es tu mayor obstáculo o miedo de cara a este proceso?','area'],
  ['compromiso','¿Cuánto tiempo estás dispuesto/a a comprometerte?','choice',['1 mes','3 meses','6 meses','+6 meses']],['entorno','¿Tienes pareja, familia o amigos que puedan influir en tu adherencia? Cuéntame.','area'],
  ['extra','Añade cualquier cosa que creas relevante y que no te haya preguntado','area']]}];
const cuestOf=()=>S.profile.cuest||{a:{},step:0,done:false};
function cuestCard(){const c=cuestOf();if(c.done||!(FICHA.cuestOn||(!S.checkins.length&&FICHA.cuestOn!==false)))return '';const n=CUEST.reduce((a,x)=>a+x.q.length,0),f=Object.values(c.a||{}).filter(v=>v!==''&&v!=null).length;
  return `<section class="cuestcard"><div><span class="lbl">Primer paso</span><b>📋 Rellena tu cuestionario inicial</b><small>${f?`Llevas ${f} de ${n} respuestas · continúa donde lo dejaste`:'Unos 10 minutos. Con esto Yaron personaliza tu plan desde el primer día.'}</small></div><button class="btn sm" type="button" onclick="go('cuest')">${f?'Continuar':'Empezar'}</button></section>`}
function vCuest(){const c=cuestOf();const st=Math.min(c.step||0,CUEST.length-1);const sec=CUEST[st];const a=c.a||{};
  const fld=([k,t,ty,op])=>{const v=a[k]??'';const id='cq-'+k;
    if(ty==='choice')return `<div class="field"><label>${esc(t)}</label><div class="chips">${op.map(o=>`<button type="button" class="chip ${v===o?'on':''}" onclick="cuestSet('${k}',${esc(JSON.stringify(o))},true)">${esc(o)}</button>`).join('')}</div></div>`;
    if(ty==='scale')return `<div class="field"><label>${esc(t)}</label><div class="scale10">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<button type="button" class="${+v===n?'on':''}" onclick="cuestSet('${k}',${n},true)">${n}</button>`).join('')}</div></div>`;
    if(ty==='area')return `<div class="field"><label for="${id}">${esc(t)}</label><textarea id="${id}" rows="3" onchange="cuestSet('${k}',this.value)">${esc(v)}</textarea></div>`;
    return `<div class="field"><label for="${id}">${esc(t)}</label><input id="${id}" ${ty==='date'?'type="date"':ty==='num'?'inputmode="decimal"':''} value="${esc(v)}" onchange="cuestSet('${k}',this.value)"></div>`};
  return `<div class="hello"><span class="lbl">Cuestionario inicial · ${st+1} de ${CUEST.length}</span><h1>${sec.ico} <em>${esc(sec.t)}</em></h1></div>
  <div class="cqbar">${CUEST.map((x,i)=>`<i class="${i<st?'done':i===st?'on':''}"></i>`).join('')}</div>
  ${st===0?`<p class="small muted" style="margin:0">Cuanto más honesto/a y detallado/a seas, mejor podrá Yaron personalizar tu plan. No hay respuestas correctas ni incorrectas y todo es confidencial. Puedes dejarlo a medias y seguir luego.</p>`:''}
  <form class="form" onsubmit="event.preventDefault();cuestNext(1)">${sec.q.map(fld).join('')}
  <div class="row cqnav">${st?`<button class="btn ghost" type="button" onclick="cuestNext(-1)">← Atrás</button>`:`<button class="btn ghost" type="button" onclick="cuestLater()">Seguir más tarde</button>`}<button class="btn" type="submit">${st===CUEST.length-1?'✅ Enviar a Yaron':'Siguiente →'}</button></div></form>`}
function cuestGrab(){document.querySelectorAll('[id^="cq-"]').forEach(el=>{const k=el.id.slice(3);const c=cuestOf();c.a=c.a||{};c.a[k]=el.value.trim();S.profile.cuest=c})}
function cuestSet(k,v,re){const c=cuestOf();c.a=c.a||{};c.a[k]=typeof v==='string'?v.trim():v;S.profile.cuest=c;save();if(re){cuestGrab();render()}}
function cuestNext(d){cuestGrab();const c=cuestOf();if(d>0&&c.step>=CUEST.length-1){c.done=true;c.at=new Date().toISOString();S.profile.cuest=c;save();go('home');toast('¡Gracias! Yaron ya tiene tu cuestionario');return}
  c.step=Math.max(0,Math.min(CUEST.length-1,(c.step||0)+d));S.profile.cuest=c;save();render();window.scrollTo(0,0)}
function cuestLater(){cuestGrab();save();go('home')}
// entrenador: ver respuestas y pasarlas a la Ficha
function cuestPanel(){const c=(S.profile||{}).cuest;if(!c||!c.a||!Object.keys(c.a).length)return `<div class="panel"><div class="sec-h"><span class="lbl">📋 Cuestionario inicial</span><label class="chkrow"><input type="checkbox" ${(FICHA.cuestOn||(!S.checkins.length&&FICHA.cuestOn!==false))?'checked':''} onchange="FICHA.cuestOn=this.checked;save();renderCoach()"> Pedírselo en su Inicio</label></div><p class="small muted" style="margin:0">Aún no lo ha rellenado. A los clientes nuevos (sin revisiones) les sale solo como primer paso en su Inicio; a los que ya tenías, solo si marcas la casilla.</p></div>`;
  const a=c.a;return `<div class="panel"><div class="sec-h"><span class="lbl">📋 Cuestionario inicial ${c.done?`· enviado el ${new Date(c.at).toLocaleDateString('es-ES')}`:'· a medias'}</span><button class="btn sm" type="button" onclick="cuestToFicha()">⇩ Pasar datos a la Ficha</button></div>
    ${CUEST.map(sec=>{const rows=sec.q.filter(q=>a[q[0]]!==''&&a[q[0]]!=null);return rows.length?`<details class="cqsec" ${sec===CUEST[0]?'open':''}><summary>${sec.ico} ${esc(sec.t)} <small class="muted">· ${rows.length}/${sec.q.length}</small></summary><dl>${rows.map(q=>`<dt>${esc(q[1])}</dt><dd>${esc(String(a[q[0]]))}</dd>`).join('')}</dl></details>`:''}).join('')}
    <p class="small muted" style="margin:0">«Pasar datos a la Ficha» rellena sus datos personales, médicos y de hábitos solo en los campos que estén vacíos, y añade su peso inicial si aún no tiene ninguno. No pisa nada de lo que ya hayas escrito tú.</p></div>`}
function cuestToFicha(){const c=(S.profile||{}).cuest;if(!c)return;const a=c.a;let n=0;
  CUEST.forEach(sec=>sec.q.forEach(([k,,ty,,f])=>{if(!f)return;let v=a[k];if(v===''||v==null)return;if(f==='sexo'&&!['Hombre','Mujer'].includes(v))return;if(f==='altura')v=String(v).replace(',','.');
    if(FICHA[f]===''||FICHA[f]==null){FICHA[f]=v;n++}}));
  const pe=parseFloat(String(a.peso||'').replace(',','.'));if(pe>0&&!allWeights().length){S.checkins.push({date:(c.at||new Date().toISOString()).slice(0,10),r:{},fotos:0,fotosP:[],nota:'Peso del cuestionario inicial',peso:pe});S.checkins.sort((x,y)=>x.date.localeCompare(y.date));n++}
  save();toast(n?`${n} dato${n>1?'s':''} pasado${n>1?'s':''} a la Ficha`:'La Ficha ya tenía esos datos');renderCoach()}

// ================= COPIAS DE SEGURIDAD =================
// Se guardan en una carpeta del ordenador del entrenador (p. ej. dentro de Google Drive para ordenador, que la sube sola a Drive).
const BK={dir:null,last:null,busy:false,msg:''};
const idb=(()=>{let P=null;const open=()=>P||(P=new Promise((r,j)=>{const q=indexedDB.open('yaronska-bk',1);q.onupgradeneeded=()=>q.result.createObjectStore('kv');q.onsuccess=()=>r(q.result);q.onerror=()=>j(q.error)}));
  return {get:async k=>{const d=await open();return new Promise(r=>{const q=d.transaction('kv').objectStore('kv').get(k);q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)})},
    set:async(k,v)=>{const d=await open();return new Promise(r=>{const t=d.transaction('kv','readwrite');t.objectStore('kv').put(v,k);t.oncomplete=()=>r();t.onerror=()=>r()})}}})();
const bkFS=()=>!!window.showDirectoryPicker;
async function bkInit(){try{BK.dir=await idb.get('dir');BK.last=await idb.get('last')}catch(e){}
  if(BK.dir&&(!BK.last||Date.now()-Date.parse(BK.last)>20*3600e3)){try{if(await BK.dir.queryPermission({mode:'readwrite'})==='granted')await bkRun(true)}catch(e){console.warn(e)}}}
function bkPanel(){const ago=BK.last?seenTxt(BK.last).t.replace('Activo ahora','Hace un momento'):'Nunca';const due=!BK.last||Date.now()-Date.parse(BK.last)>26*3600e3;
  return `<div class="panel bkpanel"><div class="sec-h"><div><span class="lbl">💾 Copias de seguridad</span><p class="small muted" style="margin:0">Última copia: <b class="${due?'badc':'good'}">${esc(ago)}</b>${BK.dir?` · carpeta «${esc(BK.dir.name)}»`:''}</p></div>
    <div class="row">${bkFS()?`<button class="btn ${BK.dir?'ghost':''} sm" type="button" onclick="bkPick()">${BK.dir?'Cambiar carpeta':'📁 Elegir carpeta de Google Drive'}</button>`:''}${BK.dir?`<button class="btn sm" type="button" onclick="bkRun()" ${BK.busy?'disabled':''}>${BK.busy?'Guardando…':'Hacer copia ahora'}</button>`:''}<button class="btn ghost sm" type="button" onclick="bkDownload()">⬇️ Descargar copia</button></div></div>
    ${BK.msg?`<p class="small" style="margin:0">${esc(BK.msg)}</p>`:''}
    <p class="small muted" style="margin:0">${bkFS()?`Elige una carpeta dentro de <b>Google Drive</b> de tu ordenador (p. ej. «Mi unidad\\Copias Yaronska App»). Cada día que abras la app como entrenador se guarda sola una copia con todos los datos (clientes, fichas, dietas, rutinas, revisiones, entrenos, cobros) y las fotos nuevas, y Google Drive la sube a la nube. Se guardan las copias de los últimos 30 días.`:'Tu navegador no permite guardar en una carpeta automáticamente (usa Chrome o Edge en el ordenador). Mientras, puedes descargar la copia y guardarla en Google Drive.'}</p></div>`}
async function bkPick(){try{const d=await window.showDirectoryPicker({id:'yaronska-bk',mode:'readwrite'});BK.dir=d;await idb.set('dir',d);await bkRun()}catch(e){if(e.name!=='AbortError')toast('No se ha podido usar esa carpeta')}}
async function bkData(){const d=await db.exportAll();return {app:'Yaronska App',version:1,fecha:new Date().toISOString(),tablas:d}}
async function bkRun(silent){if(BK.busy)return;BK.busy=true;if(!silent&&coachSel==='__biz')renderCoach();
  try{const dir=BK.dir;if((await dir.queryPermission({mode:'readwrite'}))!=='granted'&&(await dir.requestPermission({mode:'readwrite'}))!=='granted')throw new Error('Sin permiso para la carpeta');
    const data=await bkData();const name=`yaronska-copia-${iso(new Date())}.json`;
    const fh=await dir.getFileHandle(name,{create:true});const w=await fh.createWritable();await w.write(JSON.stringify(data));await w.close();
    // fotos: solo las que aún no estén guardadas
    const pd=await dir.getDirectoryHandle('fotos',{create:true});let nf2=0;
    for(const pth of data.tablas._photos||[]){const fname=pth.replace(/\//g,'__');try{await pd.getFileHandle(fname);continue}catch(e){}
      try{const b=await db.photoBlob(pth);const h=await pd.getFileHandle(fname,{create:true});const ww=await h.createWritable();await ww.write(b);await ww.close();nf2++}catch(e){console.warn('foto',pth,e)}}
    // borrar copias de más de 30 días
    const lim=iso(daysAgo(30));for await(const [n,h] of dir.entries()){const m=/^yaronska-copia-(\d{4}-\d{2}-\d{2})\.json$/.exec(n);if(m&&m[1]<lim){try{await dir.removeEntry(n)}catch(e){}}}
    BK.last=new Date().toISOString();await idb.set('last',BK.last);BK.msg=`✅ Copia guardada: ${name}${nf2?` · ${nf2} foto${nf2>1?'s':''} nueva${nf2>1?'s':''}`:''}`;if(!silent)toast('Copia de seguridad guardada')}
  catch(e){console.error(e);BK.msg='⚠️ No se ha podido hacer la copia: '+(e.message||e);if(!silent)toast('No se ha podido hacer la copia')}
  finally{BK.busy=false;if(coachSel==='__biz')renderCoach()}}
async function bkDownload(){try{toast('Preparando la copia…');const data=await bkData();const b=new Blob([JSON.stringify(data)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=`yaronska-copia-${iso(new Date())}.json`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);
  if(!BK.dir){BK.last=new Date().toISOString();await idb.set('last',BK.last)}}catch(e){console.error(e);toast('No se ha podido preparar la copia')}}

// ================= FORMULARIO DE ONBOARDING (Google Forms) =================
// Las respuestas llegan solas (Apps Script → función «formulario») y se asocian al cliente por su email.
let FORMS=[];
async function loadForms(){try{FORMS=await db.formResponses()}catch(e){FORMS=[];return}
  for(const f of FORMS){if(f.client_id||!f.email)continue;const c=CL.find(k=>(k.email||'').toLowerCase()===f.email||((k.ficha||{}).email||'').toLowerCase()===f.email);if(c){f.client_id=c.id;try{await db.updateForm(f.id,{client_id:c.id})}catch(e){}}}}
const formOf=id=>FORMS.find(f=>f.client_id===id);
const fAns=(f,re)=>{const x=(f.answers||[]).find(a=>re.test(a.q));return x&&x.a&&!/^\s*$/.test(x.a)?x.a.trim():''};
function formPanel(){const f=CUR&&formOf(CUR.id);
  if(!f){const free=FORMS.filter(x=>!x.client_id);return `<div class="panel"><span class="lbl">📋 Formulario de onboarding</span><p class="small muted" style="margin:0">Aún no ha llegado su formulario. Se enlaza solo cuando lo rellene con el mismo email que tiene en su Ficha (${esc(FICHA.email||CUR.email||'—')}).</p>
    ${free.length?`<div class="field"><label for="fLink">¿Lo rellenó con otro email? Enlázalo a mano</label><div class="row"><select id="fLink" style="flex:1">${free.map(x=>`<option value="${x.id}">${esc((x.nombre||'Sin nombre')+' · '+(x.email||'sin email')+' · '+fdate((x.submitted_at||x.created_at).slice(0,10)))}</option>`).join('')}</select><button class="btn sm" type="button" onclick="formLink()">Enlazar</button></div></div>`:''}</div>`}
  const secs=[];(f.answers||[]).forEach(a=>{if(!a.a||!String(a.a).trim())return;let s=secs.find(x=>x.s===a.s);if(!s){s={s:a.s,L:[]};secs.push(s)}s.L.push(a)});
  return `<div class="panel"><div class="sec-h"><span class="lbl">📋 Formulario de onboarding · ${new Date(f.submitted_at||f.created_at).toLocaleDateString('es-ES')}${f.imported_at?' · ✅ pasado a la Ficha':''}</span><div class="row"><button class="btn sm" type="button" onclick="formToFicha()">⇩ Pasar datos a la Ficha</button></div></div>
    ${secs.map((x,i)=>`<details class="cqsec" ${i<2?'open':''}><summary>${esc(x.s||'Respuestas')} <small class="muted">· ${x.L.length}</small></summary><dl>${x.L.map(a=>`<dt>${esc(a.q)}</dt><dd>${esc(a.a)}</dd>`).join('')}</dl></details>`).join('')}
    <p class="small muted" style="margin:0">«Pasar datos a la Ficha» rellena solo los campos vacíos (nombre, edad, sexo, altura, teléfono, salud, alergias, suplementos, tabaco, alcohol, sueño, alimentos, objetivo, días de entreno…) y añade su peso como revisión inicial si aún no tiene ninguno. No pisa nada de lo que ya hayas escrito.</p></div>`}
async function formLink(){const id=+document.getElementById('fLink').value;const f=FORMS.find(x=>x.id===id);if(!f)return;f.client_id=CUR.id;try{await db.updateForm(id,{client_id:CUR.id})}catch(e){toast('No se ha podido enlazar');return}toast('Formulario enlazado');pendCount();renderCoach()}
function formNum(t,min,max){const m=String(t||'').replace(/(\d),(\d)/g,'$1.$2').match(/\d+(?:\.\d+)?/g)||[];for(const x of m){const n=+x;if(n>=min&&n<=max)return n}return null}
async function formToFicha(){const f=CUR&&formOf(CUR.id);if(!f)return;let n=0;const set=(k,v)=>{if(v===''||v==null)return;if(FICHA[k]===''||FICHA[k]==null||(Array.isArray(FICHA[k])&&!FICHA[k].length)){FICHA[k]=v;n++}};
  set('nombre',fAns(f,/nombre y apellidos/i));
  const ed=formNum(fAns(f,/^\W*\d*\.?\s*edad\b/i),10,99);if(ed)set('edad',String(ed));
  const sp=fAns(f,/sexo y peso/i);if(/mujer|femen|chica/i.test(sp))set('sexo','Mujer');else if(/hombre|mascul|chico|var[oó]n/i.test(sp))set('sexo','Hombre');
  let al=formNum(fAns(f,/^\W*\d*\.?\s*altura/i),1,250);if(al&&al<3)al=Math.round(al*100);if(al)set('altura',String(al));
  set('tel',fAns(f,/tel[eé]fono/i));
  set('patologias',[fAns(f,/patolog/i),(()=>{const x=fAns(f,/anal[ií]tica/i);return x&&!/^no\b/i.test(x)?'Analíticas: '+x:''})()].filter(Boolean).join(' · '));
  set('medicacion',fAns(f,/medi.?aci[oó]n|medicaci/i));set('lesiones',fAns(f,/lesi[oó]n|limitaci[oó]n f[ií]sica/i));
  set('alergias',fAns(f,/alergias/i));set('suplem',fAns(f,/suplement/i));set('tabaco',fAns(f,/fumas/i));set('alcohol',fAns(f,/alcohol/i));set('sueno',fAns(f,/horas duermes/i));
  set('prefs',fAns(f,/alimentos que te gustan/i));set('evitar',fAns(f,/alimentos que no te gustan/i));
  const ob=fAns(f,/objetivo principal/i);if(/ganar masa/i.test(ob)&&FICHA.objetivo!=='ganar'&&!FICHA._objSet){FICHA.objetivo='ganar';n++}
  set('objLargo',[fAns(f,/meta espec[ií]fica/i),(()=>{const x=fAns(f,/en cu[aá]nto tiempo/i);return x?'Plazo: '+x:''})()].filter(Boolean).join(' · '));
  const dsem=formNum(fAns(f,/cu[aá]ntos d[ií]as por semana puedes entrenar/i),1,7);if(dsem)set('diasSemana',String(dsem));
  const dd=fAns(f,/qu[eé] d[ií]as de la semana/i);if(dd){const D=['domingo','lunes','martes','mi[eé]rcoles','jueves','viernes','s[aá]bado'];const arr=D.map((x,i)=>new RegExp(x,'i').test(dd)?i:-1).filter(i=>i>=0);if(arr.length&&!(FICHA.dias||[]).length){FICHA.dias=arr;n++}}
  set('tipoEntreno',fAns(f,/si haces ejercicio/i));
  const pe=formNum(sp,30,300);if(pe&&!allWeights().length){S.checkins.push({date:(f.submitted_at||f.created_at).slice(0,10),r:{},fotos:0,fotosP:[],nota:'Peso del formulario de onboarding',peso:pe});S.checkins.sort((a,b)=>a.date.localeCompare(b.date));n++}
  f.imported_at=new Date().toISOString();try{await db.updateForm(f.id,{imported_at:f.imported_at})}catch(e){}
  save();toast(n?`${n} dato${n>1?'s':''} pasado${n>1?'s':''} a la Ficha`:'La Ficha ya tenía esos datos');pendCount();renderCoach()}
function formNewClient(id){const f=FORMS.find(x=>x.id===id);if(!f)return;openInvite();setTimeout(()=>{const g=k=>document.getElementById(k);if(g('nN'))g('nN').value=fAns(f,/nombre y apellidos/i)||f.nombre||'';if(g('nE'))g('nE').value=f.email||'';if(g('nT'))g('nT').value=fAns(f,/tel[eé]fono/i);if(g('nO')&&/ganar masa/i.test(fAns(f,/objetivo principal/i)))g('nO').value='ganar'},30)}

// ---- borrador del entreno: lo que el cliente va apuntando se conserva aunque cambie de día, de pestaña o cierre la app sin guardar
const DRAFT_RX=/^(kg|rp|ri)-\d+-\d+-\d+$|^nt-\d+-\d+$/;
const draftKey=()=>CUR?`ys-draft-${CUR.id}-${iso(new Date())}`:null;
let DRAFT=null,draftT=0;
function draftGet(){if(DRAFT)return DRAFT;try{DRAFT=JSON.parse(localStorage.getItem(draftKey())||'{}')}catch(e){DRAFT={}}return DRAFT}
document.addEventListener('input',e=>{const t=e.target;if(!t.id||!DRAFT_RX.test(t.id)||!CUR)return;const D=draftGet();if(t.value.trim())D[t.id]=t.value;else delete D[t.id];clearTimeout(draftT);draftT=setTimeout(()=>{try{localStorage.setItem(draftKey(),JSON.stringify(D))}catch(e){}},400)});
function draftApply(){const D=draftGet();Object.entries(D).forEach(([id,v])=>{const el=document.getElementById(id);if(el&&!el.value)el.value=v})}
function draftClear(){const k=draftKey();DRAFT={};try{localStorage.removeItem(k)}catch(e){}}
