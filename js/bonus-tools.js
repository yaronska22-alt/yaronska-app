// ================= HERRAMIENTAS DE LOS BONUS =================
// Cada bonus del catálogo lleva tools:[…]. Aquí están sus botones y sus pantallas.
// Guardado del cliente (S.profile, sincroniza con su ficha y lo ve el entrenador):
//   bseen {bonus:{at, v:{ytId:1}}} · findePlan {w,planes,capricho,copas,at} · planB {com:[3],min,kg,cm,desc,at}
//   modo {k:'viaje'|'caotica',a,b,at} · maleta [ids marcados]

// ---- bonus visto y vídeos vistos
const bSeen=()=>{S.profile.bseen=S.profile.bseen||{};return S.profile.bseen};
function bMarkOpen(id){if(view!=='client')return;const s=bSeen();if(!s[id]){s[id]={at:new Date().toISOString(),v:{}};save()}}
function bVid(bid,y){const s=bSeen();const o=s[bid]=s[bid]||{at:new Date().toISOString(),v:{}};o.v=o.v||{};if(o.v[y])delete o.v[y];else o.v[y]=1;save();render()}
const bVidOn=(bid,y)=>!!((S.profile.bseen||{})[bid]&&S.profile.bseen[bid].v&&S.profile.bseen[bid].v[y]);
function bSeenTxt(b){const o=(S.profile.bseen||{})[b.id];const V=(b.videos||[]).filter(v=>ytId(v.yt));if(!o)return '👀 Aún no lo ha abierto';
  const n=V.filter(v=>o.v&&o.v[ytId(v.yt)]).length;return `👀 Abierto el ${fmtDM(o.at)}${V.length?` · vídeos vistos ${n}/${V.length}`:''}`}

// ---- objetivos que trae cada bonus: se añaden a su semana al dárselo
function bonusObjs(b){if(!b||!b.obj||!b.obj.length)return 0;const tw=objWk(iso(new Date())),nw=objAdd(tw,7);let n=0;
  const put=(w,L)=>{const E=objEdit(w);L.forEach(o=>{if(!E.some(x=>x.t.toLowerCase()===o.t.toLowerCase())){E.push({id:objId(),k:o.k,t:o.t,m:o.k==='d'?(o.m||5):0,b:b.id+(o.w?o.w:'')});n++}})};
  const w2=b.obj.filter(o=>o.w===2);
  put(tw,b.obj.filter(o=>o.w!==2));
  if(w2.length){objEdit(nw);FICHA.objs[nw]=FICHA.objs[nw].filter(o=>o.b!==b.id+'1');put(nw,w2)}
  return n}

// ---- botones de herramientas dentro del bonus y en Recursos
const TOOLS={
  cooked:{ic:'🔥',t:'Calculadora crudo → cocinado',s:'Cuánto pesar si ya está hecho',f:'openCooked()'},
  chuleta:{ic:'🍻',t:'Chuleta del finde',s:'Tus reglas en 1 pantalla',f:'openFindeCard()'},
  findeplan:{ic:'🗓️',t:'Mi plan del finde',s:'Rellénalo el jueves: 1 minuto',f:'openFindePlan()'},
  planb:{ic:'🛟',t:'Mi plan B',s:'Tus comodines y tu señal de alarma',f:'openPlanB()'},
  snack:{ic:'⏱️',t:'Snack de movimiento guiado',s:'3-5 minutos con temporizador',f:'openSnack()'},
  casarut:{ic:'🏠',t:'Mi rutina de casa en la app',s:'Pídesela a Yaron y regístrala en Entreno',f:'casaRut()'},
  viaje:{ic:'✈️',t:'Me voy de viaje',s:'Tus objetivos pasan a modo viaje',f:'openModo(\'viaje\')'},
  maleta:{ic:'🧳',t:'Checklist de la maleta',s:'Lo que no te puede faltar',f:'openMaleta()'},
  caotica:{ic:'⚡',t:'Activar semana caótica',s:'Tus objetivos pasan a los mínimos',f:'openModo(\'caotica\')'},
  menus:{ic:'🛒',t:'Menús de meal prep',s:'Pásalos a tu lista de la compra',f:'openMenus()'},
  sos:{ic:'🧯',t:'SOS: me viene ahora',s:'10 minutos guiados',f:'openSOS()'},
  resp:{ic:'🫁',t:'Respiración 4-6 guiada',s:'5 minutos para bajar revoluciones',f:'openResp()'}};
function toolBtn(k){const t=TOOLS[k];if(!t)return '';const on=(k==='viaje'||k==='caotica')&&modoNow()&&modoNow().k===k;
  return `<button class="cookbtn${on?' on':''}" type="button" onclick="${t.f}">${t.ic} ${on?(k==='viaje'?'Modo viaje activado':'Semana caótica activada'):t.t} <span>${on?'Toca para cambiarlo o quitarlo':t.s}</span></button>`}
function myTools(){const T=new Set(['cooked']);myBonus().forEach(b=>(b.tools||[]).forEach(t=>T.add(t)));T.delete('casarut');return [...T]}

let TM=null; // temporizador de la hoja abierta
function sheetOpen(h,label){clearInterval(TM);TM=null;const sh=document.getElementById('sheet');sh.innerHTML=`<div class="sheet-in" role="dialog" aria-label="${esc(label)}"><div class="sheet-b">${h}</div></div>`;sh.hidden=false;sh.onclick=e=>{if(e.target===sh)toolClose()}}
function toolClose(){clearInterval(TM);TM=null;closeSheet()}
const shHead=t=>`<div class="row" style="justify-content:space-between"><h2>${t}</h2><button class="btn ghost sm" type="button" onclick="toolClose()">Cerrar</button></div>`;
const mmss=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

// ---- plan del finde
const friOf=k=>{const d=new Date(k+'T12:00');d.setDate(d.getDate()+((5-d.getDay()+7)%7));return iso(d)};
function findePlanNow(){const p=S.profile.findePlan;return p&&p.w===friOf(iso(new Date()))?p:null}
function openFindePlan(){const p=findePlanNow()||{};
  sheetOpen(`${shHead('🗓️ Mi plan del finde')}<p class="small muted" style="margin:0">1 minuto. Decidirlo antes es lo que hace que el lunes no haya sustos. Yaron lo ve.</p>
  <div class="field"><label for="fpP">¿Qué planes tienes este finde?</label><textarea id="fpP" rows="2" placeholder="Cena con amigos el sábado, comida familiar el domingo…">${esc(p.planes||'')}</textarea></div>
  <div class="field"><label for="fpC">¿Qué te vas a dar? (elige 1 o 2)</label><textarea id="fpC" rows="2" placeholder="El postre del sábado y unas cañas">${esc(p.capricho||'')}</textarea></div>
  <div class="field"><label for="fpA">Máximo de copas o cervezas</label><input id="fpA" inputmode="numeric" value="${esc(p.copas??'')}" placeholder="Ej. 3"></div>
  <button class="btn" type="button" onclick="saveFindePlan()">Guardar mi plan</button>`,'Plan del finde')}
function saveFindePlan(){const v=id=>(document.getElementById(id)||{}).value||'';S.profile.findePlan={w:friOf(iso(new Date())),planes:v('fpP').trim(),capricho:v('fpC').trim(),copas:v('fpA').trim(),at:new Date().toISOString()};save();toolClose();toast('Plan del finde guardado 🍻');render()}

// ---- plan B (Libertad de por Vida)
function openPlanB(){const p=S.profile.planB||{};const c=p.com||[];
  sheetOpen(`${shHead('🛟 Mi plan B')}<p class="small muted" style="margin:0">Lo que harás si un día subes. Lo rellenas una vez y lo tienes siempre aquí. Yaron también lo ve.</p>
  <span class="lbl">Mis 3 comidas comodín</span><p class="small muted" style="margin:-6px 0 0">Te salen sin pensar y te mantienen.</p>
  ${[0,1,2].map(i=>`<div class="field"><input id="pbC${i}" value="${esc(c[i]||'')}" placeholder="${['Ej. Pollo con arroz y ensalada','Ej. Tortilla con pan y tomate','Ej. Pasta con atún y verdura'][i]}" aria-label="Comida comodín ${i+1}"></div>`).join('')}
  <div class="field"><label for="pbM">Mi entreno mínimo para semanas malas</label><input id="pbM" value="${esc(p.min||'')}" placeholder="Ej. 2 entrenos de 30 min + 6.000 pasos"></div>
  <div class="row" style="gap:10px"><div class="field" style="flex:1"><label for="pbK">Mi señal de alarma: peso (kg)</label><input id="pbK" inputmode="decimal" value="${esc(p.kg||'')}" placeholder="Ej. 78"></div><div class="field" style="flex:1"><label for="pbCm">o cintura (cm)</label><input id="pbCm" inputmode="decimal" value="${esc(p.cm||'')}" placeholder="Ej. 86"></div></div>
  <div class="field"><label for="pbD">Qué me suele hacer descarrilar y qué haré cuando pase</label><textarea id="pbD" rows="3" placeholder="Las cenas de trabajo: pediré con la regla de la carta…">${esc(p.desc||'')}</textarea></div>
  <button class="btn" type="button" onclick="savePlanB()">Guardar mi plan B</button>`,'Plan B')}
function savePlanB(){const v=id=>((document.getElementById(id)||{}).value||'').trim();const n=x=>{const f=parseFloat(x.replace(',','.'));return f>0?f:''};
  S.profile.planB={com:[0,1,2].map(i=>v('pbC'+i)),min:v('pbM'),kg:n(v('pbK')),cm:n(v('pbCm')),desc:v('pbD'),at:new Date().toISOString()};save();toolClose();toast('Plan B guardado 🛟');render()}
function planBAlarm(){const p=S.profile.planB;if(!p||!(p.kg||p.cm))return null;
  const W=allWeights();const lw=W.length?W[W.length-1]:null;const C=[...S.checkins].filter(c=>+c.cintura>0).sort((a,b)=>a.date.localeCompare(b.date));const lc=C.length?C[C.length-1]:null;
  if(p.kg&&lw&&lw.peso>=p.kg)return {t:`${nf(lw.peso,1)} kg (tu alarma: ${nf(p.kg,1)} kg)`,d:lw.date};
  if(p.cm&&lc&&+lc.cintura>=p.cm)return {t:`${nf(+lc.cintura,1)} cm de cintura (tu alarma: ${nf(p.cm,1)} cm)`,d:lc.date};return null}
function planBBanner(){if(!myBonus().some(b=>b.id==='libertad'))return '';const a=planBAlarm();if(!a)return '';
  return `<button type="button" class="objclose" onclick="openBonus('libertad')">🛟 Activa tu plan B <span>Has llegado a tu señal de alarma: ${esc(a.t)}. Dos semanas de vuelta a tu estructura.</span></button>`}

// ---- modos de la semana: viaje / semana caótica (cambian sus objetivos esas semanas)
const MODOS={
  viaje:{ic:'✈️',n:'Modo viaje',L:[{id:'mv1',k:'d',t:'Proteína en cada comida',m:6},{id:'mv2',k:'d',t:'Snack de movimiento al levantarte',m:4},{id:'mv3',k:'d',t:'Andar todo lo que puedas: llegar a tus pasos',m:4},{id:'mv4',k:'s',t:'2 entrenos express de 20 minutos'},{id:'mv5',k:'s',t:'Volver y hacer la compra el primer día'}]},
  caotica:{ic:'⚡',n:'Semana caótica',L:[{id:'mc1',k:'s',t:'2 entrenos de 20-30 minutos'},{id:'mc2',k:'d',t:'Mínimo 6.000 pasos',m:5},{id:'mc3',k:'d',t:'Proteína en cada comida',m:5},{id:'mc4',k:'d',t:'Dormir 7 horas o más',m:4},{id:'mc5',k:'s',t:'Tener en casa la despensa de emergencia'}]}};
function objMode(w){const m=S&&S.profile&&S.profile.modo;if(!m||!MODOS[m.k])return null;const a=objWk(m.a),b=objWk(m.b||m.a);return w>=a&&w<=b?{k:m.k,L:MODOS[m.k].L}:null}
function modoNow(){const m=S&&S.profile&&S.profile.modo;if(!m)return null;return objMode(objWk(iso(new Date())))?m:(m.b||m.a)>=iso(new Date())?m:null}
function openModo(k){const M=MODOS[k],m=modoNow();const on=m&&m.k===k;const today=iso(new Date());
  sheetOpen(`${shHead(M.ic+' '+M.n)}
  <p class="small muted" style="margin:0">${k==='viaje'?'Dime cuándo te vas y vuelves. Esas semanas tus objetivos pasan a los de viaje: lo mínimo para volver igual o mejor.':'Esta semana tus objetivos pasan a los mínimos. Con cumplir el 70 % ya cuenta. Yaron lo verá en tu ficha.'}</p>
  ${k==='viaje'?`<div class="row" style="gap:10px"><div class="field" style="flex:1"><label for="mdA">Me voy</label><input id="mdA" type="date" value="${esc(on?m.a:today)}"></div><div class="field" style="flex:1"><label for="mdB">Vuelvo</label><input id="mdB" type="date" value="${esc(on?m.b:objAdd(today,4))}"></div></div>`:''}
  <span class="lbl">Tus objetivos ${k==='viaje'?'esos días':'esta semana'}</span>
  <ul class="small" style="margin:0;padding-left:18px">${M.L.map(o=>`<li>${esc(o.t)}${o.k==='d'?` · ${o.m} de 7 días`:''}</li>`).join('')}</ul>
  <button class="btn" type="button" onclick="setModo('${k}')">${on?'Guardar cambios':'Activar'}</button>
  ${on?`<button class="btn ghost" type="button" onclick="setModo(null)">Quitar ${M.n.toLowerCase()}</button>`:''}`,M.n)}
function setModo(k){if(!k){delete S.profile.modo;save();toolClose();toast('Vuelves a tus objetivos normales');render();return}
  const t=iso(new Date());let a=t,b=objAdd(objWk(t),6);
  if(k==='viaje'){a=(document.getElementById('mdA')||{}).value||t;b=(document.getElementById('mdB')||{}).value||a;if(b<a)[a,b]=[b,a]}
  S.profile.modo={k,a,b,at:new Date().toISOString()};save();toolClose();toast(k==='viaje'?'✈️ Modo viaje activado. ¡Buen viaje!':'⚡ Semana caótica activada. Con el 70 % vale.');render()}

// ---- snack de movimiento guiado
const SNACKS=[
  {t:'☕ Al despertar',s:[['10 sentadillas',40],['10 gato-camello',40],['20 s de plancha',20],['Descansa',20],['10 sentadillas',40],['10 gato-camello',40],['20 s de plancha',20]]},
  {t:'💻 Entre tareas',s:[['15 sentadillas a la silla',45],['10 flexiones en la mesa',35],['30 s de marcha rápida',30],['Descansa',20],['15 sentadillas a la silla',45],['10 flexiones en la mesa',35],['30 s de marcha rápida',30]]},
  {t:'🍳 Mientras cocinas',s:[['20 elevaciones de talón',40],['10 zancadas atrás por pierna',60],['30 s de sentadilla en la pared',30],['Descansa',20],['20 elevaciones de talón',40],['30 s de sentadilla en la pared',30]]},
  {t:'📺 Antes de dormir',s:[['Movilidad de cadera',60],['Movilidad de espalda (gato-camello)',60],['Estira el pecho en el marco de la puerta',45],['Estira las piernas',60],['Respiración lenta',60]]}];
let SN=null;
function openSnack(i){SN={i:i??null,step:0,left:0,run:false};snackRender()}
function snackRender(){const sh=document.getElementById('sheet');
  if(SN.i===null){sheetOpen(`${shHead('⏱️ Snack de movimiento')}<p class="small muted" style="margin:0">Elige uno. Te marco cada ejercicio con el tiempo.</p><div class="blist">${SNACKS.map((x,i)=>`<button type="button" class="bitem" onclick="openSnack(${i})"><span class="ic">${x.t.split(' ')[0]}</span><div><b>${esc(x.t.slice(x.t.indexOf(' ')+1))}</b><small>${mmss(x.s.reduce((a,s)=>a+s[1],0))} min · ${x.s.filter(s=>s[0]!=='Descansa').length} bloques</small></div><span class="go">›</span></button>`).join('')}</div>`,'Snack de movimiento');return}
  const X=SNACKS[SN.i];const done=SN.step>=X.s.length;
  const body=`${shHead('⏱️ '+esc(X.t.slice(X.t.indexOf(' ')+1)))}
  ${done?`<div class="tbig">✅ ¡Hecho!</div><p class="small muted" style="margin:0;text-align:center">Snack completado. Si tienes el objetivo «snacks de movimiento», márcalo hoy en Inicio.</p><button class="btn" type="button" onclick="toolClose()">Cerrar</button>`
  :`<div class="tbig" id="tmT">${mmss(SN.left||X.s[SN.step][1])}</div><div class="tnow" id="tmN">${esc(X.s[SN.step][0])}</div>
  <ol class="tsteps">${X.s.map((s,i)=>`<li class="${i<SN.step?'ok':i===SN.step?'on':''}">${esc(s[0])} <small>${s[1]} s</small></li>`).join('')}</ol>
  <div class="row" style="gap:8px"><button class="btn" type="button" style="flex:1" onclick="snackGo()">${SN.run?'Pausa':SN.left?'Seguir':'Empezar'}</button><button class="btn ghost" type="button" onclick="snackNext()">Siguiente ›</button></div>`}`;
  const keep=!sh.hidden&&sh.querySelector('.sheet-b');if(keep){keep.innerHTML=body}else{const t=TM;sheetOpen(body,'Snack');TM=t}}
function snackGo(){if(SN.run){clearInterval(TM);TM=null;SN.run=false;snackRender();return}
  const X=SNACKS[SN.i];if(!SN.left)SN.left=X.s[SN.step][1];SN.run=true;snackRender();
  TM=setInterval(()=>{SN.left--;if(SN.left<=0){try{navigator.vibrate&&navigator.vibrate(200)}catch(e){}SN.step++;SN.left=SN.step<X.s.length?X.s[SN.step][1]:0;if(SN.step>=X.s.length){clearInterval(TM);TM=null;SN.run=false}snackRender();return}
    const el=document.getElementById('tmT');if(el)el.textContent=mmss(SN.left)},1000)}
function snackNext(){const X=SNACKS[SN.i];SN.step++;SN.left=SN.step<X.s.length?X.s[SN.step][1]:0;if(SN.step>=X.s.length){clearInterval(TM);TM=null;SN.run=false}snackRender()}
function casaRut(){window.open('https://wa.me/'+WA+'?text='+encodeURIComponent('Hola Yaron, esta semana entreno en casa. ¿Me pones la rutina de Fuerte en Casa en la app? Tengo: (cuerpo / gomas / mancuernas)'),'_blank')}

// ---- checklist de la maleta
const MALETA=[['goma','Una goma larga y una miniband'],['zapas','Zapatillas cómodas para andar'],['ropa','Ropa para 2 entrenos'],['prote','Proteína en polvo en una bolsita'],['barritas','2-3 barritas de proteína'],['fruta','Fruta para el trayecto'],['botella','Tu botella de agua'],['super','Mirado el súper y el gimnasio más cercanos'],['guias','Esta guía y la de Comer Fuera a mano en la app'],['bascula','Si es apartamento: báscula de cocina']];
function openMaleta(){const on=new Set(S.profile.maleta||[]);
  sheetOpen(`${shHead('🧳 Tu maleta')}<p class="small muted" style="margin:0">Marca lo que ya tienes. ${on.size}/${MALETA.length} listo.</p>
  <div class="mlist">${MALETA.map(([k,t])=>`<button type="button" class="objr ${on.has(k)?'on':''}" onclick="maletaTog('${k}')"><span class="objck">${on.has(k)?'✓':''}</span><div><b>${esc(t)}</b></div><small></small></button>`).join('')}</div>
  ${on.size?`<button class="btn ghost sm" type="button" onclick="S.profile.maleta=[];save();openMaleta()">Vaciar para el próximo viaje</button>`:''}`,'Maleta')}
function maletaTog(k){const a=new Set(S.profile.maleta||[]);a.has(k)?a.delete(k):a.add(k);S.profile.maleta=[...a];save();openMaleta()}

// ---- menús de meal prep → lista de la compra y recetas
const MENUS=[
  {t:'Semana 1 · Clásica',q:'pollo',c:['Pechuga de pollo','Ternera picada','Tomate triturado','Arroz','Patatas','Calabacín','Pimiento','Cebolla','Brócoli']},
  {t:'Semana 2 · Mediterránea',q:'merluza',c:['Lomo de cerdo','Merluza','Pasta','Garbanzos cocidos','Tomate','Pimiento','Cebolla','Calabacín','Espinacas']},
  {t:'Semana 3 · Mexicana',q:'fajita',c:['Pollo en tiras','Ternera picada','Alubias cocidas','Arroz','Tortillas de trigo','Pimientos','Cebolla','Maíz','Especias fajita']},
  {t:'Semana 4 · Oriental',q:'salmón',c:['Pavo en dados','Salmón','Arroz','Huevos','Brócoli','Zanahoria','Pimiento','Cebolleta','Salsa de soja baja en sal','Jengibre']}];
function openMenus(){const ex=new Set(SHOP().extra.map(x=>x.toLowerCase()));
  sheetOpen(`${shHead('🛒 Menús de meal prep')}<p class="small muted" style="margin:0">Las cantidades son las de tu plan. Añade la compra a tu lista y mira recetas parecidas ya ajustadas a ti.</p>
  ${MENUS.map((m,i)=>{const all=m.c.every(x=>ex.has(x.toLowerCase()));return `<div class="objcl"><b>${esc(m.t)}</b><small class="muted">${esc(m.c.join(' · '))}</small><div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn sm${all?' ghost':''}" type="button" onclick="menuShop(${i})" ${all?'disabled':''}>${all?'✓ En tu lista':'🛒 Añadir a mi lista'}</button><button class="btn ghost sm" type="button" onclick="menuRec(${i})">📖 Ver recetas</button></div></div>`}).join('')}`,'Menús')}
function menuShop(i){const C=SHOP();const ex=new Set(C.extra.map(x=>x.toLowerCase()));let n=0;MENUS[i].c.forEach(x=>{if(!ex.has(x.toLowerCase())){C.extra.push(x);n++}});save();toast(n?`${n} productos añadidos a tu lista de la compra`:'Ya estaban en tu lista');openMenus()}
function menuRec(i){toolClose();BSEL=null;tab='food';foodTab='recetas';RCAT='all';RQ=MENUS[i].q;render();window.scrollTo(0,0)}

// ---- SOS antiatracón
const SOS=[['Para. No te digas «no»: dite «dentro de 10 minutos».','Las ganas suben y bajan como una ola. Vamos a dejar que pase.'],['Bebe un vaso grande de agua o una infusión.',''],['Sal de la cocina.','Da un paseo corto, dúchate o llama a alguien.'],['Respira despacio.','Coge aire en 4 segundos y suéltalo en 6. Aquí tienes la respiración guiada.'],['Pregúntate qué necesitas.','¿Es hambre de verdad, o es cansancio, nervios o aburrimiento?']];
let SOS_ST=null;
function openSOS(){SOS_ST={left:600,step:0};sosRender();clearInterval(TM);TM=setInterval(()=>{SOS_ST.left--;if(SOS_ST.left<=0){clearInterval(TM);TM=null;SOS_ST.left=0;sosRender();return}const el=document.getElementById('tmT');if(el)el.textContent=mmss(SOS_ST.left)},1000)}
function sosRender(){const end=SOS_ST.left<=0;const sh=document.getElementById('sheet');
  const body=`${shHead('🧯 SOS')}
  ${end?`<div class="tbig">✅ 10 minutos</div><p style="margin:0">Lo has conseguido. Si sigues con hambre de verdad, <b>come algo de verdad</b>: una comida pequeña con proteína, sentado y en un plato. Sin culpa.</p>`
  :`<div class="tbig" id="tmT">${mmss(SOS_ST.left)}</div><p class="small muted" style="margin:-6px 0 0;text-align:center">Dentro de 10 minutos decides. Ahora, esto:</p>`}
  <ol class="tsteps">${SOS.map((s,i)=>`<li class="${i<SOS_ST.step?'ok':i===SOS_ST.step&&!end?'on':''}" onclick="SOS_ST.step=${i+1};sosRender()"><b>${esc(s[0])}</b>${s[1]?`<small>${esc(s[1])}</small>`:''}${i===3?` <button class="btn ghost sm" type="button" onclick="event.stopPropagation();openResp(1)">🫁 Respirar ahora</button>`:''}</li>`).join('')}</ol>
  <p class="small muted" style="margin:0">Toca cada paso al hacerlo. Si te pasa a menudo, cuéntaselo a Yaron.</p>
  <a class="btn ghost" href="https://wa.me/${WA}?text=${encodeURIComponent('Hola Yaron, estoy teniendo un momento difícil con la comida.')}" target="_blank" rel="noopener">💬 Escribir a Yaron</a>`;
  const b=!sh.hidden&&sh.querySelector('.sheet-b');if(b&&sh.querySelector('[aria-label="SOS"]'))b.innerHTML=body;else{const t=TM;sheetOpen(body,'SOS');TM=t}}

// ---- respiración 4-6 guiada
let RS=null;
function openResp(fromSos){clearInterval(TM);RS={left:300,t:0,run:false,sos:!!fromSos};
  sheetOpen(`${shHead('🫁 Respiración 4-6')}<p class="small muted" style="margin:0">Coge aire por la nariz mientras el círculo crece (4 s) y suéltalo por la boca mientras se encoge (6 s).</p>
  <div class="breath"><div class="bcirc" id="bC"></div><b id="bL">Pulsa empezar</b></div><div class="tbig" id="tmT">5:00</div>
  <button class="btn" type="button" id="bBtn" onclick="respGo()">Empezar</button>${RS.sos?`<button class="btn ghost" type="button" onclick="openSOS()">‹ Volver al SOS</button>`:''}`,'Respiración')}
function respGo(){const btn=document.getElementById('bBtn'),C=document.getElementById('bC'),L=document.getElementById('bL');
  if(RS.run){clearInterval(TM);TM=null;RS.run=false;C.classList.remove('run');btn.textContent='Seguir';L.textContent='En pausa';return}
  RS.run=true;btn.textContent='Pausa';C.classList.add('run');const tick=()=>{const p=RS.t%10;L.textContent=p<4?'Coge aire…':'Suéltalo…';C.dataset.ph=p<4?'in':'out'};tick();
  TM=setInterval(()=>{RS.t++;RS.left--;tick();const el=document.getElementById('tmT');if(el)el.textContent=mmss(Math.max(0,RS.left));if(RS.left<=0){clearInterval(TM);TM=null;RS.run=false;C.classList.remove('run');L.textContent='✅ Hecho. Así de fácil.';btn.textContent='Otra vez';RS.left=300;RS.t=0}},1000)}

// ---- turnos: resalta su turno en el documento
function turnosMark(html){const t=String((FICHA&&FICHA.turnos)||'').toLowerCase();const k=/mañana|manana/.test(t)?'manana':/tarde/.test(t)?'tarde':/noche/.test(t)?'noche':/rotat/.test(t)?'rotativo':'';
  if(!k)return html;return html.replace(`data-t="${k}"`,`data-t="${k}" class="tmine"`).replace('<h2><span>2</span> Reparto según tu turno</h2>',`<h2><span>2</span> Reparto según tu turno</h2><p class="tmine-n">👉 Tu turno según tu ficha: <b>${esc(FICHA.turnos)}</b>. Lo tienes marcado en amarillo.</p>`)}

// ---- para el entrenador: resumen de lo que ha rellenado en sus bonus
function bonusKpi(){const out=[];const B=myBonusCoach();
  if(B.includes('finde')){const p=S.profile.findePlan;const cur=p&&p.w===friOf(iso(new Date()));out.push(`<div class="kpi"><small>🗓️ Plan del finde</small><b style="font-size:15px">${cur?'Rellenado':'—'}</b><small class="muted">${cur?esc([p.planes,p.capricho&&'Se da: '+p.capricho,p.copas&&'Máx. '+p.copas+' copas'].filter(Boolean).join(' · ')):'Aún no ha hecho el de este finde'}</small></div>`)}
  if(B.includes('libertad')){const p=S.profile.planB;const a=planBAlarm();out.push(`<div class="kpi"><small>🛟 Plan B</small><b class="${a?'badc':''}" style="font-size:15px">${a?'🚨 En su señal de alarma':p?'Rellenado':'—'}</b><small class="muted">${p?esc([a&&a.t,p.kg&&'Alarma '+p.kg+' kg',p.cm&&p.cm+' cm',p.min&&'Mínimo: '+p.min].filter(Boolean).join(' · ')):'Aún no lo ha rellenado'}</small></div>`)}
  const m=modoNow();if(m)out.push(`<div class="kpi"><small>${MODOS[m.k].ic} ${MODOS[m.k].n}</small><b style="font-size:15px">Activado</b><small class="muted">${m.k==='viaje'?`Del ${fmtDM(m.a)} al ${fmtDM(m.b)}`:'Esta semana'} · lo activó el ${fmtDM(m.at)}</small></div>`);
  return out.join('')}
function myBonusCoach(){return bonusIds()}
function modoChip(prefs){const m=prefs&&prefs.modo;if(!m||!MODOS[m.k])return '';const t=iso(new Date());if((m.b||m.a)<t&&objWk(t)>objWk(m.b||m.a))return '';return `<i class="wk-n">${MODOS[m.k].ic} ${m.k==='viaje'?'De viaje':'Semana caótica'}</i>`}
