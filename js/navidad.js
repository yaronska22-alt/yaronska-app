// ================= BONUS NAVIDEÑO: Navidad Sin Culpa =================
// bonus/navidad.html (plan interactivo) se abre a pantalla completa. Guarda el plan del cliente en S.profile.navidad
// {name,answers,mode,red[],sweet,got[],weeks[{from,to,por,postres}],prof,sweetTxt,at,sent}.
// Aviso: tarjeta navideña con nieve en Inicio + ventana con nieve la primera vez + push al dárselo.
const NAV_END='2027-01-08';
const navOn=()=>typeof myBonus==='function'&&myBonus().some(b=>b.id==='navidad');
const navMe=()=>view==='client'&&ME&&ME.role!=='coach';
function navSnow(n){let h='';for(let i=0;i<n;i++){const l=(i*37)%100,sz=3+(i*7)%5,d=7+(i*13)%9,dl=-((i*29)%14),dx=((i*17)%40)-20;h+=`<i style="left:${l}%;width:${sz}px;height:${sz}px;animation-duration:${d}s;animation-delay:${dl}s;--dx:${dx}px"></i>`}return `<div class="xsnow" aria-hidden="true">${h}</div>`}
function openNavidad(){closeNavidad();const o=document.createElement('div');o.id='navov';o.setAttribute('role','dialog');o.setAttribute('aria-label','Navidad Sin Culpa');
  o.innerHTML=`<iframe src="bonus/navidad.html?app=1&v=1" title="Navidad Sin Culpa"></iframe><button type="button" class="navx" onclick="closeNavidad()" aria-label="Cerrar">✕</button>`;
  document.body.appendChild(o);document.body.style.overflow='hidden'}
function closeNavidad(){const o=document.getElementById('navov');if(o){o.remove();document.body.style.overflow='';if(view==='client')render()}}
window.addEventListener('message',e=>{if(e.origin!==location.origin||!e.data||!e.data.ys)return;
  const f=document.querySelector('#navov iframe');if(!f||e.source!==f.contentWindow)return;
  if(e.data.type==='navidad-ready'){f.contentWindow.postMessage({ys:true,type:'navidad-load',plan:(S.profile&&S.profile.navidad)||null,name:(CLIENT&&CLIENT.first)||''},location.origin);return}
  if(e.data.type==='navidad'&&e.data.plan){if(!navMe()){if(e.data.sent)toast('Vista del cliente: no se guarda');return}
    const p=e.data.plan;S.profile=S.profile||{};const old=S.profile.navidad||{};
    S.profile.navidad=Object.assign({},p,{at:new Date().toISOString(),sent:e.data.sent?new Date().toISOString():old.sent||null});save();
    if(e.data.sent)toast('🎄 Plan enviado a Yaron')}});
// porciones de esta semana según su plan guardado
function navWeekNow(){const p=S.profile&&S.profile.navidad;if(!p||!p.weeks)return null;const t=iso(new Date());return p.weeks.find(w=>t>=w.from&&t<=w.to)||null}
function navCard(){if(view!=='client'||!navOn()||iso(new Date())>NAV_END)return '';
  const seen=(S.profile.bseen||{}).navidad,p=S.profile.navidad;
  if(!seen&&navMe()&&!S.profile.navPop&&!navCard.shown){navCard.shown=true;setTimeout(navPopup,700)}
  if(!seen||!p||!p.mode)return `<button type="button" class="xmas" onclick="openBonus('navidad')">${navSnow(26)}<span class="xm-ic" aria-hidden="true">🎁</span><span class="xm-t"><small>Regalo de Navidad de Yaron</small><b>Navidad Sin Culpa</b><span>Come turrón estas navidades y llega a enero igual o con menos grasa. Hazte tu plan en 3 minutos.</span></span><span class="xm-go">${seen?'Terminar mi plan':'Abrir mi regalo'} ›</span></button>`;
  const w=navWeekNow();
  return `<button type="button" class="xmas sm" onclick="openBonus('navidad')">${navSnow(14)}<span class="xm-ic" aria-hidden="true">🎄</span><span class="xm-t"><small>Tu Navidad Sin Culpa · ${p.mode==='bajar'?'Seguir bajando':'Mantener'}</small><b>${w?`Esta semana: ${w.por} ${w.por===1?'porción':'porciones'} de turrón${w.postres?` + ${w.postres} postre${w.postres>1?'s':''} de día rojo`:''}`:(p.weeks&&p.weeks[0]&&iso(new Date())<p.weeks[0].from?'Tu plan está listo: empieza el 1 de diciembre':'Tu plan de Navidad')}</b><span>En plato, sentado y después de comer. Si te pasas, «Me he pasado» dentro del plan.</span></span><span class="xm-go">Ver ›</span></button>`}
function navPopup(){if(!navMe()||!navOn()||document.getElementById('navpop'))return;S.profile.navPop=new Date().toISOString();save();
  const d=document.createElement('div');d.id='navpop';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-labelledby','navpopT');
  d.innerHTML=`${navSnow(60)}<div class="np-in"><div class="np-tree" aria-hidden="true">🎄</div><small>Regalo de Navidad de Yaron</small><h2 id="navpopT">Navidad <b>Sin Culpa</b></h2><p>Come turrón estas navidades y llega a enero igual o con menos grasa. Sin prohibidos, sin compensar y sin cardio de castigo.</p><p class="np-s">En 3 minutos te llevas tu plan: tus días rojos, tu cupo de turrón semana a semana y qué hacer si te pasas.</p><button type="button" class="np-go" onclick="navPopClose();openBonus('navidad')">🎁 Abrir mi regalo</button><button type="button" class="np-later" onclick="navPopClose()">Luego</button></div>`;
  d.onclick=e=>{if(e.target===d)navPopClose()};document.body.appendChild(d);const b=d.querySelector('.np-go');b&&b.focus()}
function navPopClose(){const d=document.getElementById('navpop');if(d)d.remove()}
// entrenador
function navCoachTxt(){const p=S.profile&&S.profile.navidad,seen=(S.profile.bseen||{}).navidad;
  if(!p||!p.mode)return `<small class="muted" style="display:block">${seen?'👀 Lo ha abierto el '+fmtDM(seen.at)+' · aún no ha terminado su plan':'👀 Aún no lo ha abierto'}</small>`;
  return `<small style="display:block" class="good">🎄 Plan hecho${p.sent?' y enviado':''} el ${fmtDM(p.at)} · ${p.mode==='bajar'?'Seguir bajando':'Mantener'} · ${esc(p.prof||'')}</small><small class="muted" style="display:block">${(p.red||[]).length} días rojos · ${esc(p.sweetTxt||'')}</small>`}
function navPush(){if(!CUR||!db.notify)return;db.notify(CUR.id,'navidad','Te he dejado un regalo en la app: tu plan para comer turrón y llegar a enero sin engordar. Ábrelo y hazlo en 3 minutos.','🎄 Tienes un regalo de Navidad')
  .then(r=>toast(r&&r.sent?'🎄 Aviso navideño enviado a su móvil':'🎄 Bonus dado · no tiene los avisos activados en el móvil: lo verá al abrir la app')).catch(()=>{})}
