// ================= OBJETIVOS SEMANALES (hábitos diarios + retos) y REGISTRO DIARIO CONFIGURABLE =================
// La semana va de revisión a revisión: empieza el día siguiente a su revisión (FICHA.revFis) y se cierra el día de la revisión.
// FICHA.objs = { '<inicio de semana ISO>': [{id,k:'d'|'s',t,m,ic}] }  (lo elige el entrenador; una semana sin lista hereda la última anterior)
// Lo que marca el cliente va en su diario: S.daily[día].obj={id:true} (hábito ese día) · .reto={id:true} (reto hecho ese día)
// Cierre de semana: S.daily[día en que cierra].cierre={w,r:{id:'ok'|'mid'|'no'},nota,at}
// FICHA.reg = lo que rellena cada día en «Hoy» (si no está, lo de siempre)

const REG_ITEMS=[['diet','🍽','Dieta cumplida'],['train','🏋','Entreno / descanso'],['steps','👟','Pasos'],['estres','😮‍💨','Estrés'],['energia','⚡','Energía'],['animo','🙂','Ánimo'],['hambre','🍴','Control del hambre'],['sueno','😴','Descanso']];
const REG_DEF=['diet','train','steps','estres','energia','animo'];
const REG_MINI={estres:'Estrés',energia:'Energía',animo:'Ánimo',hambre:'Hambre ok',sueno:'Descanso'};
const regList=()=>Array.isArray(FICHA&&FICHA.reg)?FICHA.reg:REG_DEF;
const regOn=k=>regList().includes(k);
function regToggle(k){const a=new Set(regList());a.has(k)?a.delete(k):a.add(k);FICHA.reg=REG_ITEMS.map(x=>x[0]).filter(x=>a.has(x));save();renderCoach()}

// Biblioteca de serie. [id, tipo d/s, texto, días meta (hábitos), icono]
const OBJ_CATS=[
 ['Comida','🍽',[['prot','d','Proteína en todas las comidas',7],['agua','d','Beber 2 litros de agua',6],['verd','d','Verdura en la comida y en la cena',6],['fruta','d','Fruta de postre en lugar de dulce',5],['sentado','d','Comer sentado y sin pantallas',5],['pesar','d','Pesar las cantidades de tu plan',6],['cena1h','d','Cenar al menos 1 hora antes de dormir',5],['desay','d','Desayunar lo de tu plan antes de salir de casa',5],
   ['compra','s','Hacer la compra con la lista de la app'],['mealprep','s','Hacer meal prep un día de la semana'],['recetas2','s','Probar 2 recetas nuevas del recetario'],['fuera','s','Decidir qué vas a pedir antes de comer fuera'],['alcohol2','s','Máximo 2 consumiciones de alcohol en la semana']]],
 ['Entreno','🏋',[['movil','d','10 minutos de movilidad',3],['snacks','d','3 snacks de movimiento',4],
   ['todos','s','Completar todos los entrenos de la semana'],['progreso','s','Subir peso o repeticiones en 2 ejercicios'],['video','s','Grabarte en un ejercicio y mandármelo para revisar la técnica'],['agenda','s','Apuntar en el calendario los días y la hora de tus entrenos']]],
 ['Pasos','👟',[['pasos','d','Llegar a tu objetivo de pasos',5],['paseo10','d','Paseo de 10 minutos después de comer o cenar',5],['escal','d','Escaleras en lugar de ascensor',5],
   ['paseo1h','s','Un paseo largo de 1 hora el fin de semana']]],
 ['Descanso','😴',[['dormir7','d','Dormir 7 horas o más',5],['hora','d','Acostarte a la misma hora',5],['pantalla','d','30 minutos sin pantallas antes de dormir',5],['cafe','d','Café solo hasta mediodía',6],
   ['habit','s','Dejar la habitación oscura, fresca y en silencio']]],
 ['Estrés y cabeza','🧠',[['resp','d','5 minutos de respiración 4-6',5],['bien','d','Apuntar 1 cosa que has hecho bien hoy',5],['descarga','d','Descarga mental en papel antes de dormir',4],['sinmovil','d','Paseo de 10 minutos sin móvil',4],
   ['riesgo','s','Apuntar en el móvil tus momentos de riesgo con la comida'],['antiatracon','s','Leer el Protocolo Antiatracón (Recursos › Tus bonus)']]],
 ['Organización','📅',[['registro','d','Rellenar tu seguimiento en la app',7],
   ['revision','s','Enviar la revisión a tiempo y con fotos'],['finde','s','Leer el bonus Fin de Semana Sin Culpa antes del viernes'],['kit','s','Ver los vídeos del Kit de Arranque'],['planfinde','s','Decidir el jueves qué planes tienes el finde y cómo los vas a encajar']]]];
const OBJ_ALL=OBJ_CATS.flatMap(([c,ic,L])=>L.map(([id,k,t,m])=>({lib:id,k,t,m:m||0,ic})));
const objLib=id=>OBJ_ALL.find(x=>x.lib===id);

// ---- semanas
const DOW_ES=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
function revDow(){const i=DOW_ES.indexOf((FICHA&&FICHA.revFis)||'Domingo');return i<0?0:i}
const objAdd=(k,n)=>{const d=new Date(k+'T12:00');d.setDate(d.getDate()+n);return iso(d)};
function objWk(k){const d=new Date(k+'T12:00');const s=(revDow()+1)%7;d.setDate(d.getDate()-((d.getDay()-s+7)%7));return iso(d)}
const objDays=w=>Array.from({length:7},(_,i)=>objAdd(w,i));
function objList(w){const O=(FICHA&&FICHA.objs)||{};if(Array.isArray(O[w]))return {L:O[w],own:true,from:w};
  const prev=Object.keys(O).filter(k=>k<w&&Array.isArray(O[k])).sort().pop();return {L:prev?O[prev]:[],own:false,from:prev||null}}
const wkLbl=w=>{const a=new Date(w+'T12:00'),b=new Date(objAdd(w,6)+'T12:00');const f=d=>d.toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short'});return `${f(a)} → ${f(b)}`};

// ---- progreso
const habN=(w,id)=>objDays(w).filter(k=>S.daily[k]&&S.daily[k].obj&&S.daily[k].obj[id]).length;
const retoDay=(w,id)=>objDays(w).find(k=>S.daily[k]&&S.daily[k].reto&&S.daily[k].reto[id])||null;
function objCierre(w){for(let i=0;i<14;i++){const k=objAdd(w,i);const c=S.daily[k]&&S.daily[k].cierre;if(c&&c.w===w)return Object.assign({day:k},c)}return null}
function objAuto(w,o){if(o.k==='d'){const n=habN(w,o.id);return n>=(o.m||7)?'ok':n>=Math.ceil((o.m||7)/2)?'mid':'no'}return retoDay(w,o.id)?'ok':'no'}
function objRes(w){const {L}=objList(w);const ok=L.filter(o=>objAuto(w,o)==='ok').length;return {L,ok,n:L.length,c:objCierre(w)}}
const R_IC={ok:'✅',mid:'🟡',no:'❌'},R_TX={ok:'Conseguido',mid:'A medias',no:'No'};

// ---- cliente: tarjeta en Inicio
function objCard(){const k=dKey();const w=objWk(k);const {L}=objList(w);
  const tw=objWk(iso(new Date())),pw=objAdd(tw,-7),todayK=iso(new Date());
  const prevPend=objList(pw).L.length&&!objCierre(pw)&&todayK<=objAdd(tw,2)?pw:null; // 3 primeros días para cerrar la semana pasada
  if(!L.length&&!prevPend)return '';
  const isLast=todayK===objAdd(tw,6);const closed=objCierre(tw);
  const dayL=DSEL?new Date(k+'T12:00').toLocaleDateString('es-ES',{weekday:'short'}):'hoy';
  const H=L.filter(o=>o.k==='d'),R=L.filter(o=>o.k==='s');
  const dots=o=>objDays(w).map(d=>`<i class="${S.daily[d]&&S.daily[d].obj&&S.daily[d].obj[o.id]?'on':d>todayK?'fut':''}${d===k?' cur':''}"></i>`).join('');
  return `<section class="objc" aria-label="Objetivos de la semana">
    <div class="objc-h"><h2>🎯 Tus objetivos de la semana</h2><span class="small muted">${wkLbl(w)} · se cierra el día de tu revisión</span></div>
    ${prevPend?`<button type="button" class="objclose warn" onclick="openObjClose('${pw}')">📝 Cierra tu semana pasada <span>Dime cómo te han ido tus objetivos</span></button>`:''}
    ${H.length?`<div class="objsec"><span class="lbl">Cada día</span>${H.map(o=>{const on=!!(S.daily[k]&&S.daily[k].obj&&S.daily[k].obj[o.id]);const n=habN(w,o.id);return `<div class="objr ${on?'on':''}"><button type="button" class="objck" onclick="objTick('${o.id}')" aria-pressed="${on}" aria-label="${esc(o.t)} · ${dayL}">${on?'✓':''}</button><div><b>${esc(o.t)}</b><span class="objdots">${dots(o)}</span></div><small class="${n>=(o.m||7)?'good':''}">${n}/${o.m||7} días</small></div>`}).join('')}<p class="small muted" style="margin:0">Marca ${DSEL?'lo que cumpliste ese día':'lo que cumples hoy'}. La meta es el número de días de la semana.</p></div>`:''}
    ${R.length?`<div class="objsec"><span class="lbl">Retos de la semana</span>${R.map(o=>{const d=retoDay(w,o.id);return `<div class="objr ${d?'on':''}"><button type="button" class="objck" onclick="objReto('${o.id}')" aria-pressed="${!!d}" aria-label="${esc(o.t)}">${d?'✓':''}</button><div><b>${esc(o.t)}</b>${d?`<small class="muted">Hecho el ${new Date(d+'T12:00').toLocaleDateString('es-ES',{weekday:'long'})}</small>`:''}</div><small>${d?'🏁':''}</small></div>`}).join('')}</div>`:''}
    ${L.length&&w===tw?(closed?`<div class="objdone">✅ Semana cerrada · ${Object.values(closed.r||{}).filter(v=>v==='ok').length} de ${L.length} conseguidos <button type="button" class="linkbtn small" onclick="openObjClose('${tw}')">Editar</button></div>`:isLast?`<button type="button" class="objclose" onclick="openObjClose('${tw}')">📝 Cerrar mi semana <span>Hoy es tu revisión: dime cómo te ha ido</span></button>`:''):''}
  </section>`}
function objTick(id){const k=dKey();const d=S.daily[k]=Object.assign({},S.daily[k]||{});d.obj=Object.assign({},d.obj||{});if(d.obj[id])delete d.obj[id];else d.obj[id]=true;save();render()}
function objReto(id){const w=objWk(dKey());const done=retoDay(w,id);
  if(done){const d=S.daily[done]=Object.assign({},S.daily[done]);d.reto=Object.assign({},d.reto);delete d.reto[id]}
  else{const k=dKey();const d=S.daily[k]=Object.assign({},S.daily[k]||{});d.reto=Object.assign({},d.reto||{},{[id]:true});toast('¡Reto conseguido! 🏁')}
  save();render()}
let OCL=null;
function openObjClose(w){const {L}=objList(w);const c=objCierre(w);OCL={w,r:Object.assign({},...L.map(o=>({[o.id]:(c&&c.r&&c.r[o.id])||objAuto(w,o)}))),nota:(c&&c.nota)||'',day:c&&c.day};objCloseRender()}
function objCloseRender(){const sh=document.getElementById('sheet');const {w}=OCL;const {L}=objList(w);
  sh.innerHTML=`<div class="sheet-in" role="dialog" aria-label="Cerrar la semana"><div class="sheet-b"><div class="row" style="justify-content:space-between"><h2>📝 Cierra tu semana</h2><button class="btn ghost sm" type="button" onclick="closeSheet()">Cerrar</button></div>
  <p class="small muted" style="margin:0">${wkLbl(w)}. Te marco lo que dice tu registro; cámbialo si no es así.</p>
  ${L.map(o=>`<div class="objcl"><b>${esc(o.t)}</b><small class="muted">${o.k==='d'?`Marcado ${habN(w,o.id)} de ${o.m||7} días`:retoDay(w,o.id)?'Marcado como hecho':'Sin marcar'}</small><div class="seg2">${['ok','mid','no'].map(v=>`<button type="button" class="chip ${OCL.r[o.id]===v?'on':''}" onclick="OCL.r['${o.id}']='${v}';objCloseRender()">${R_IC[v]} ${R_TX[v]}</button>`).join('')}</div></div>`).join('')}
  <div class="field"><label for="oclN">¿Algo que quieras contarme de la semana? (opcional)</label><textarea id="oclN" rows="3" oninput="OCL.nota=this.value" placeholder="Qué te ha costado, qué te ha funcionado…">${esc(OCL.nota)}</textarea></div>
  <button class="btn" type="button" onclick="saveObjClose()">Enviar a Yaron</button></div></div>`;
  sh.hidden=false;sh.onclick=e=>{if(e.target===sh)closeSheet()}}
function saveObjClose(){const {w}=OCL;const k=OCL.day||iso(new Date());const d=S.daily[k]=Object.assign({},S.daily[k]||{});d.cierre={w,r:OCL.r,nota:OCL.nota.trim(),at:new Date().toISOString()};
  save();closeSheet();toast('Semana cerrada. ¡Gracias!');render()}

// ---- entrenador: pestaña de la Ficha
let OWK=null,OLIB=null,OLIB_LOAD=false;
function objLibMine(){if(OLIB===null&&!OLIB_LOAD){OLIB_LOAD=true;db.getSetting('objLib').then(v=>{OLIB=Array.isArray(v)?v:[];renderCoach()}).catch(()=>{OLIB=[]})}return OLIB||[]}
async function objLibSave(){try{await db.setSetting('objLib',OLIB)}catch(e){toast('No se ha podido guardar tu biblioteca')}}
function objEdit(w){FICHA.objs=FICHA.objs||{};if(!Array.isArray(FICHA.objs[w]))FICHA.objs[w]=objList(w).L.map(o=>Object.assign({},o));return FICHA.objs[w]}
const objId=()=>'o'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
function objAddItem(src){const w=OWK;const L=objEdit(w);if(L.some(o=>o.t.trim().toLowerCase()===src.t.trim().toLowerCase())){toast('Ya lo tiene esta semana');return}
  L.push({id:objId(),k:src.k,t:src.t.trim(),m:src.k==='d'?(+src.m||5):0});save();renderCoach();toast('Añadido a la semana')}
function objAddLib(id){const o=objLib(id)||objLibMine().find(x=>x.lib===id);if(o)objAddItem(o)}
function objSet(i,f,v){const L=objEdit(OWK);if(!L[i])return;L[i][f]=f==='m'?+v:v;save();if(f!=='t')renderCoach()}
function objDel(i){const L=objEdit(OWK);L.splice(i,1);save();renderCoach()}
function objNew(){const t=(document.getElementById('onT')||{}).value||'';const k=(document.getElementById('onK')||{}).value||'d';const m=(document.getElementById('onM')||{}).value||5;const keep=(document.getElementById('onS')||{}).checked;
  if(!t.trim()){toast('Escribe el objetivo');return}
  if(keep){const L=objLibMine();if(!L.some(x=>x.t.toLowerCase()===t.trim().toLowerCase())){L.push({lib:'u'+Date.now().toString(36),k,t:t.trim(),m:k==='d'?+m:0});OLIB=L;objLibSave()}}
  objAddItem({k,t,m})}
function objLibDel(id){OLIB=objLibMine().filter(x=>x.lib!==id);objLibSave();renderCoach()}
function objCopyPrev(){const w=OWK;const prev=objList(objAdd(w,-7));FICHA.objs=FICHA.objs||{};FICHA.objs[w]=prev.L.map(o=>Object.assign({},o));save();renderCoach();toast('Copiados de la semana anterior')}

// Sugerencias según sus datos: [id, motivo]
function objSug(){const f=FICHA,out=[];const n=v=>{const x=parseFloat(String(v??'').replace(',','.'));return isNaN(x)?null:x};const add=(id,why)=>{if(!out.some(x=>x[0]===id))out.push([id,why])};
  const days=Object.keys(S.daily).filter(k=>k>=iso(daysAgo(14))&&k<=iso(new Date()));const pct=key=>days.length?Math.round(days.filter(d=>S.daily[d][key]===true).length/days.length*100):null;
  const st=pct('stepsOk'),di=pct('diet');
  if(st!=null&&days.length>=5&&st<70){add('pasos',`Llega a sus pasos el ${st} % de los días`);add('paseo10','Para sumar pasos sin buscar tiempo extra')}
  if(di!=null&&days.length>=5&&di<75){add('compra',`Cumple la dieta el ${di} % de los días`);add('pesar','Para ajustar las cantidades')}
  if(n(f.sueno)!=null&&n(f.sueno)<7){add('dormir7',`Duerme ${f.sueno} h`);add('pantalla','Ayuda a dormirse antes')}
  if(n(f.estres)>=4){add('resp',`Estrés alto (${f.estres}/5)`);add('descarga','Para bajar revoluciones por la noche')}
  if(n(f.energia)!=null&&n(f.energia)<=2)add('dormir7',`Energía baja (${f.energia}/5)`);
  if(n(f.agua)!=null&&n(f.agua)<2)add('agua',`Bebe ${f.agua} L de agua al día`);
  if(n(f.cafe)>=4)add('cafe',`Toma ${f.cafe} cafés al día`);
  if(n(f.pantallas)>=4)add('pantalla',`${f.pantallas} h de pantallas al día`);
  if(n(f.alcohol)>=6)add('alcohol2',`${f.alcohol} unidades de alcohol a la semana`);
  if(/sí|a veces/i.test(f.noParar||'')||/^(1|2|4)/.test(f.atracones||'')){add('sentado','Le cuesta parar de comer');add('riesgo','Para detectar cuándo le pasa');add('prot','Más saciedad durante el día')}
  if(n(f.fuera)>=3)add('fuera',`Come fuera ${f.fuera} veces a la semana`);
  if(/10 min|siempre fuera/i.test((f.tiempoCocina||'')+' '+(f.cocina||'')))add('mealprep','Tiene poco tiempo para cocinar');
  if(/sentado/i.test(f.trabajoTipo||''))add('snacks','Trabaja sentado');
  if(/^no/i.test(f.haceEj||''))add('agenda','No entrenaba antes: crear el hábito');
  if(/todo|extra/i.test(f.alDejar||''))add('registro','Recuperaba el peso al dejarlo: constancia');
  if(S.checkins.length<2){add('registro','Está empezando');if((f.bonus||[]).includes('kit'))add('kit','Tiene el Kit de Arranque')}
  if((f.bonus||[]).includes('finde')&&!/^no$/i.test(f.haceEj||''))add('finde','Tiene el bonus Fin de Semana Sin Culpa');
  return out}

function objCoach(){if(!OWK)OWK=objWk(iso(new Date()));const w=OWK,tw=objWk(iso(new Date()));const {L,own,from}=objList(w);const mine=objLibMine();
  const name=esc((FICHA.nombre||'el cliente').split(' ')[0]);const inL=t=>L.some(o=>o.t.toLowerCase()===t.toLowerCase());
  const tag=w===tw?'Esta semana':w>tw?'Próxima':'Pasada';
  const res=o=>{const a=objAuto(w,o);const c=objCierre(w);const cr=c&&c.r&&c.r[o.id];return `<span class="small">${o.k==='d'?`${habN(w,o.id)}/${o.m||7} días`:retoDay(w,o.id)?'🏁 '+fmtDM(retoDay(w,o.id)):'Sin hacer'} ${w<tw?R_IC[a]:''}${cr?` · ${name}: ${R_IC[cr]}`:''}</span>`};
  const sug=objSug().filter(([id])=>!inL(objLib(id).t)).slice(0,8);
  const hist=Array.from({length:10},(_,i)=>objAdd(tw,-7*(i+1))).filter(x=>objList(x).L.length);
  return `<div class="panel"><span class="lbl">📝 Lo que rellena cada día en «Hoy»</span>
    <p class="small muted" style="margin:0">Elige qué ve ${name} en su registro diario. Lo que quites deja de aparecerle (lo que ya rellenó se queda guardado).</p>
    <div class="row" style="flex-wrap:wrap;gap:6px">${REG_ITEMS.map(([k,ic,l])=>`<button type="button" class="chip ${regOn(k)?'on':''}" onclick="regToggle('${k}')" aria-pressed="${regOn(k)}">${ic} ${l}</button>`).join('')}</div>
    <p class="small muted" style="margin:0">El día de entreno o descanso lo sigue marcando siempre: con eso cambian sus pasos objetivo y su plan de comidas.</p></div>
  <div class="panel"><div class="sec-h"><span class="lbl">🎯 Objetivos de ${name} · ${tag}</span><div class="row" style="gap:6px"><button class="btn ghost sm" type="button" onclick="OWK=objAdd(OWK,-7);renderCoach()" aria-label="Semana anterior">‹</button><span class="small">${wkLbl(w)}</span><button class="btn ghost sm" type="button" onclick="OWK=objAdd(OWK,7);renderCoach()" aria-label="Semana siguiente">›</button>${w!==tw?`<button class="btn ghost sm" type="button" onclick="OWK=null;renderCoach()">Hoy</button>`:''}</div></div>
    <p class="small muted" style="margin:0">La semana va de revisión a revisión (${esc(FICHA.revFis||'Domingo').toLowerCase()}). ${!own&&from?`Son los de la semana del ${fmtDM(from)}: si no cambias nada, se repiten. Si los tocas, el cambio vale desde esta semana.`:!L.length?'Aún no tiene objetivos. Elige de sugeridos, de la biblioteca o crea uno.':'Se repiten las semanas siguientes hasta que los cambies.'}</p>
    ${L.length?`<div class="objlist">${L.map((o,i)=>`<div class="objed"><span class="objk ${o.k}">${o.k==='d'?'Hábito diario':'Reto semanal'}</span><input value="${esc(o.t)}" aria-label="Texto del objetivo" onchange="objSet(${i},'t',this.value)">${o.k==='d'?`<select aria-label="Días meta" onchange="objSet(${i},'m',this.value)">${[1,2,3,4,5,6,7].map(d=>`<option value="${d}" ${(o.m||7)===d?'selected':''}>${d} de 7 días</option>`).join('')}</select>`:'<span></span>'}${res(o)}<button class="btn ghost sm" type="button" onclick="objDel(${i})" aria-label="Quitar">✕</button></div>`).join('')}</div>`:''}
    ${L.length>5?`<p class="small" style="margin:0;color:var(--warn)">Lleva ${L.length} objetivos: con más de 5 suele no cumplir ninguno.</p>`:''}
    ${!L.length&&objList(objAdd(w,-7)).L.length?`<button class="btn ghost sm" type="button" onclick="objCopyPrev()">Copiar los de la semana anterior</button>`:''}
    ${(()=>{const c=objCierre(w);return c?`<div class="objnote"><b>Su cierre de semana</b> (${fmtDM(c.day)})${c.nota?`<p>💬 ${esc(c.nota)}</p>`:'<p class="muted small">Sin comentarios</p>'}</div>`:w<tw&&L.length?'<p class="small muted" style="margin:0">No cerró esta semana.</p>':''})()}
  </div>
  ${sug.length?`<div class="panel"><span class="lbl">💡 Sugeridos para ${name}</span><div class="objlib">${sug.map(([id,why])=>{const o=objLib(id);return `<button type="button" class="objadd" onclick="objAddLib('${id}')"><b>+ ${esc(o.t)}</b><small>${o.k==='d'?`Hábito · ${o.m}/7 días`:'Reto semanal'} · ${esc(why)}</small></button>`}).join('')}</div></div>`:''}
  <div class="panel"><span class="lbl">📚 Biblioteca</span>
    ${mine.length?`<details open><summary><b>⭐ Mis objetivos</b></summary><div class="objlib">${mine.map(o=>`<div class="objadd mine${inL(o.t)?' in':''}"><button type="button" onclick="objAddLib('${o.lib}')" ${inL(o.t)?'disabled':''}><b>${inL(o.t)?'✓':'+'} ${esc(o.t)}</b><small>${o.k==='d'?`Hábito · ${o.m}/7 días`:'Reto semanal'}</small></button><button type="button" class="x" onclick="objLibDel('${o.lib}')" aria-label="Borrar de mi biblioteca">✕</button></div>`).join('')}</div></details>`:''}
    ${OBJ_CATS.map(([c,ic,X])=>`<details><summary><b>${ic} ${c}</b> <span class="small muted">${X.length}</span></summary><div class="objlib">${X.map(([id,k,t,m])=>`<button type="button" class="objadd${inL(t)?' in':''}" onclick="objAddLib('${id}')" ${inL(t)?'disabled':''}><b>${inL(t)?'✓':'+'} ${esc(t)}</b><small>${k==='d'?`Hábito · ${m}/7 días`:'Reto semanal'}</small></button>`).join('')}</div></details>`).join('')}
  </div>
  <div class="panel"><span class="lbl">✏️ Crear un objetivo</span>
    <div class="fgrid ftgrid"><div class="field wide"><label for="onT">Objetivo</label><input id="onT" placeholder="Ej. Llevar el táper al trabajo"></div>
    <div class="field"><label for="onK">Tipo</label><select id="onK" onchange="document.getElementById('onMw').hidden=this.value!=='d'"><option value="d">Hábito diario (lo marca cada día)</option><option value="s">Reto semanal (lo marca una vez)</option></select></div>
    <div class="field" id="onMw"><label for="onM">Meta</label><select id="onM">${[1,2,3,4,5,6,7].map(d=>`<option value="${d}" ${d===5?'selected':''}>${d} de 7 días</option>`).join('')}</select></div></div>
    <label class="small row" style="gap:6px"><input type="checkbox" id="onS" checked> Guardar también en mi biblioteca para usarlo con otros clientes</label>
    <button class="btn sm" type="button" onclick="objNew()">Añadir a la semana</button></div>
  ${hist.length?`<div class="panel"><span class="lbl">📈 Historial</span>${hist.map(x=>{const r=objRes(x);return `<details><summary><b>${wkLbl(x)}</b> · ${r.ok} de ${r.n} conseguidos${r.c?' · cerrada por '+name:' · sin cerrar'}</summary><div class="tbl-w"><table><tbody>${r.L.map(o=>{const a=objAuto(x,o),cr=r.c&&r.c.r&&r.c.r[o.id];return `<tr><td class="wrap">${esc(o.t)}</td><td>${o.k==='d'?`${habN(x,o.id)}/${o.m||7} días`:retoDay(x,o.id)?'Hecho':'Sin hacer'}</td><td>${R_IC[a]}</td><td>${cr?name+': '+R_IC[cr]+' '+R_TX[cr]:'—'}</td></tr>`}).join('')}</tbody></table></div>${r.c&&r.c.nota?`<p class="small">💬 ${esc(r.c.nota)}</p>`:''}</details>`}).join('')}</div>`:''}`}

// Resumen para el panel de seguimiento
function objKpi(){const tw=objWk(iso(new Date()));const {L}=objList(tw);const pw=objAdd(tw,-7);const P=objRes(pw);if(!L.length&&!P.n)return '';
  const H=L.filter(o=>o.k==='d'),R=L.filter(o=>o.k==='s');const hd=H.reduce((a,o)=>a+habN(tw,o.id),0),ht=H.reduce((a,o)=>a+(o.m||7),0);const rd=R.filter(o=>retoDay(tw,o.id)).length;
  return `<div class="kpi"><small>🎯 Objetivos esta semana</small><b>${L.length?`${L.filter(o=>objAuto(tw,o)==='ok').length} de ${L.length}`:'—'}</b><small class="muted">${H.length?`Hábitos: ${hd} de ${ht} días · `:''}${R.length?`Retos: ${rd} de ${R.length} · `:''}${P.n?`Semana pasada: ${P.ok}/${P.n}${P.c?' (cerrada)':' (sin cerrar)'}`:''}</small></div>`}
// Lo que marcó un día (para la tabla del diario del entrenador)
function objDayCell(k){const d=S.daily[k]||{};const L=objList(objWk(k)).L;const t=(o,p)=>`<span class="ok-chip y" title="${esc(o.t)}">${p}${esc(o.t.length>22?o.t.slice(0,21)+'…':o.t)}</span>`;
  const a=L.filter(o=>o.k==='d'&&d.obj&&d.obj[o.id]).map(o=>t(o,'✓ ')),b=L.filter(o=>o.k==='s'&&d.reto&&d.reto[o.id]).map(o=>t(o,'🏁 '));
  const H=L.filter(o=>o.k==='d').length;return (a.concat(b).join(' ')||'<span class="muted">—</span>')+(H?` <small class="muted">${a.length}/${H}</small>`:'')+(d.cierre?' <small>📝 cerró la semana</small>':'')}
