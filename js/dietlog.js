// ================= REGISTRO DE CAMBIOS DE DIETA (solo entrenador) =================
// Cada vez que se envía un plan a la app se compara con el anterior: qué comida, qué grupo,
// qué alimento y cuánto sube o baja. Se guarda en la tabla diet_log (solo coach; el cliente no la ve).
const DL_MEAL={breakfast:'Desayuno',midmorning:'Media mañana',lunch:'Comida',snack:'Merienda',dinner:'Cena'};
const DL_GRP={protein:'Proteína',carb:'Hidratos',fat:'Grasa',vegs:'Verduras',fruit:'Fruta'};
const DL_ORDER=['breakfast','midmorning','lunch','snack','dinner'];
let DL={id:null,list:null,f:'all',busy:false};

function dlNum(x){return Math.round(x*10)/10}
// "150 g Pollo (pechuga cruda) o 155 g Pavo" → [{n:'Pollo (pechuga cruda)',q:150,u:'g'},{n:'Pavo',q:155,u:'g'}]
function dlParse(str){
  return String(str||'').split(/\s+o\s+|\s+\/\s+/).map(s=>s.trim()).filter(Boolean).map(s=>{
    const m=s.match(/^(\d+(?:[.,]\d+)?)\s*(g|gr|ml|kg|l|ud|uds|unidad(?:es)?)?\s+(.+)$/i);
    if(!m)return {n:s,q:null,u:''};
    let u=(m[2]||'ud').toLowerCase();if(u==='gr')u='g';if(/^u/.test(u))u='ud';
    return {n:m[3].trim(),q:parseFloat(m[1].replace(',','.')),u};
  });
}
// Plan → {"lunch|carb": {n→{q,u}}, "breakfast|Batido": {...}}
function dlMap(plan){
  const out={};if(!plan)return out;
  const put=(key,strs)=>{const g=out[key]=out[key]||{};strs.forEach(s=>dlParse(s).forEach(it=>{let k=it.n,i=2;while(g[k])k=it.n+' #'+(i++);g[k]=it}))};
  ['lunch','dinner'].forEach(m=>{const x=plan[m];if(!x)return;Object.keys(DL_GRP).forEach(g=>put(m+'|'+g,x[g]||[]))});
  const opts=(m,list)=>(list||[]).forEach((o,i)=>put(m+'|'+(o.name||('Opción '+(i+1))),o.items||[]));
  opts('breakfast',plan.breakfast);
  ['midmorning','snack'].forEach(m=>opts(m,plan[m]&&plan[m].options));
  return out;
}
function dlDiff(a,b,d){
  const A=dlMap(a),B=dlMap(b),ch=[];
  new Set([...Object.keys(A),...Object.keys(B)]).forEach(key=>{
    const [m,g]=key.split('|');const x=A[key]||{},y=B[key]||{};
    new Set([...Object.keys(x),...Object.keys(y)]).forEach(n=>{
      const p=x[n],q=y[n];
      if(p&&q){if(p.q!==q.q||p.u!==q.u)ch.push({d,m,g,n,a:p.q,b:q.q,u:q.u||p.u})}
      else if(q)ch.push({d,m,g,n,a:null,b:q.q,u:q.u,add:1});
      else ch.push({d,m,g,n,a:p.q,b:null,u:p.u,del:1});
    });
  });
  return ch;
}
// kcal y macros por comida (del resumen que manda la Calculadora). Solo se muestran al entrenador.
function dlSum(plan){const o={};((plan&&plan.sum)||[]).forEach(s=>{o[s.m]={T:s.TM||{kcal:s.T},R:s.RM||(s.R!=null?{kcal:s.R}:null),off:s.off}});return o}
function dlTot(sum,d){const t={kcal:0,p:0,ch:0,f:0};let any=false;Object.values(sum).forEach(s=>{const v=s[d];if(v){any=true;['kcal','p','ch','f'].forEach(k=>t[k]+=v[k]||0)}});return any?t:null}

// Se llama al enviar un plan de la Calculadora (prev = plan anterior del cliente)
function dlRecord(prev,next,extra){
  if(!CUR||!next)return;
  const nota=(document.getElementById('dlNota')||{}).value||'';
  const ch=[];
  if(prev)ch.push(...dlDiff(prev&&prev.T&&prev.T.plan,next.T&&next.T.plan,'T'));
  let rNote='';
  if(next.R&&prev){const base=prev&&(prev.R||prev.T);ch.push(...dlDiff(base&&base.plan,next.R.plan,'R'));if(prev&&!prev.R)rNote='on'}
  else if(prev&&prev.R)rNote='off';
  const sa=dlSum(prev),sb=dlSum(next);
  const k=DL_ORDER.map(m=>({m,a:sa[m]||null,b:sb[m]||null}));
  const entry={src:'calc',first:!prev,mode:next.mode||'',rNote,ch,k,
    tot:{aT:dlTot(sa,'T'),bT:dlTot(sb,'T'),aR:dlTot(sa,'R'),bR:dlTot(sb,'R')},nota:nota.trim(),...(extra||{})};
  const same=prev&&!ch.length&&!rNote&&JSON.stringify(entry.tot.aT)===JSON.stringify(entry.tot.bT);
  if(same&&!entry.nota)return;
  if(same)entry.same=1;
  db.addDietLog(CUR.id,entry).then(()=>{const n=document.getElementById('dlNota');if(n)n.value='';DL.id=null;dlLoad()}).catch(()=>toast('No se ha podido guardar el registro de cambios'));
}
function dlRecordKcal(a,b){
  if(!CUR||a===b)return;
  db.addDietLog(CUR.id,{src:'kcal',ka:a||null,kb:b,ch:[],nota:((document.getElementById('dlNota')||{}).value||'').trim()}).then(()=>{DL.id=null;dlLoad()}).catch(()=>{});
}

async function dlLoad(){
  if(!CUR||DL.busy)return;
  if(DL.id===CUR.id&&DL.list){dlPaint();return}
  DL.busy=true;const id=CUR.id;
  try{const l=await db.dietLog(id);if(CUR&&CUR.id===id){DL.id=id;DL.list=l}}catch(e){DL.list=[];DL.id=id}
  DL.busy=false;dlPaint();
}
function dlDel(rid){if(!confirm('¿Borrar esta entrada del registro?'))return;db.delDietLog(rid).then(()=>{DL.list=DL.list.filter(x=>x.id!==rid);dlPaint()})}
function dlFilter(f){DL.f=f;dlPaint()}

function dlQty(q,u){return q==null?'—':(dlNum(q)+(u&&u!=='ud'?' '+u:u==='ud'?' ud':''))}
function dlLine(c){
  const where=`${DL_MEAL[c.m]||c.m} › ${DL_GRP[c.g]||c.g}`;
  if(c.add)return `<li class="dl-add"><span class="dl-w">${esc(where)}</span> ➕ <b>${esc(c.n)}</b> ${esc(dlQty(c.b,c.u))}</li>`;
  if(c.del)return `<li class="dl-del"><span class="dl-w">${esc(where)}</span> ➖ <b>${esc(c.n)}</b> <s>${esc(dlQty(c.a,c.u))}</s></li>`;
  const dd=(c.b||0)-(c.a||0),pct=c.a?Math.round(dd/c.a*100):null;
  return `<li class="${dd>0?'dl-up':'dl-down'}"><span class="dl-w">${esc(where)}</span> <b>${esc(c.n)}</b> ${esc(dlQty(c.a,c.u))} → ${esc(dlQty(c.b,c.u))} <span class="dl-d">${dd>0?'▲ +':'▼ '}${dlNum(dd)}${c.u&&c.u!=='ud'?' '+c.u:''}${pct!=null?` (${pct>0?'+':''}${pct}%)`:''}</span></li>`;
}
function dlTotTxt(a,b){
  if(!b)return '';const f=(v,k)=>Math.round(v[k]);
  if(!a)return `${f(b,'kcal')} kcal · P ${f(b,'p')} · H ${f(b,'ch')} · G ${f(b,'f')}`;
  const d=k=>{const x=f(b,k)-f(a,k);return x?` <span class="${x>0?'dl-upt':'dl-downt'}">(${x>0?'+':''}${x})</span>`:''};
  return `${f(b,'kcal')} kcal${d('kcal')} · P ${f(b,'p')}${d('p')} · H ${f(b,'ch')}${d('ch')} · G ${f(b,'f')}${d('f')}`;
}
function dlMealK(e){
  // kcal por comida que han cambiado (solo entrenador)
  return (e.k||[]).map(x=>{const a=x.a&&x.a.T&&Math.round(x.a.T.kcal),b=x.b&&x.b.T&&Math.round(x.b.T.kcal);if(a==null||b==null||a===b)return '';
    const d=b-a;return `<span class="chip ${d>0?'dl-upc':'dl-downc'}">${esc(DL_MEAL[x.m])} ${a}→${b} (${d>0?'+':''}${d})</span>`}).filter(Boolean).join('');
}
function dlEntry(e){
  const d=e.data||{};const f=DL.f;
  const dt=new Date(e.at);const when=dt.toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'})+' · '+dt.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
  if(d.src==='kcal'){if(f!=='all')return '';return `<div class="dl-e"><div class="dl-h"><b>${esc(when)}</b><span class="chip">Plan automático</span><button class="btn ghost sm" type="button" onclick="dlDel(${e.id})" aria-label="Borrar">✕</button></div>
    <ul class="dl-l"><li class="${(d.kb||0)>(d.ka||0)?'dl-up':'dl-down'}">Kcal del plan: ${d.ka||'—'} → <b>${d.kb}</b></li></ul>${d.nota?`<p class="dl-n">📝 ${esc(d.nota)}</p>`:''}</div>`}
  const ch=(d.ch||[]).filter(c=>f==='all'||c.m===f);
  if(f!=='all'&&!ch.length)return '';
  const by={T:[],R:[]};ch.forEach(c=>(by[c.d]||by.T).push(c));
  const sec=(k,lbl)=>by[k].length?`<div class="dl-s">${lbl}</div><ul class="dl-l">${by[k].sort((a,b)=>DL_ORDER.indexOf(a.m)-DL_ORDER.indexOf(b.m)).map(dlLine).join('')}</ul>`:'';
  const tt=d.tot||{};
  const hasR=tt.bR||tt.aR;
  return `<div class="dl-e"><div class="dl-h"><b>${esc(when)}</b>${d.first?'<span class="chip">Primer plan</span>':''}${d.same?'<span class="chip">Sin cambios en cantidades</span>':''}${d.first?'':`<span class="dl-c">${(d.ch||[]).length} cambio${(d.ch||[]).length===1?'':'s'}</span>`}<button class="btn ghost sm" type="button" onclick="dlDel(${e.id})" aria-label="Borrar">✕</button></div>
    ${tt.bT?`<div class="dl-t"><span class="lbl">Entreno</span> ${dlTotTxt(tt.aT,tt.bT)}</div>`:''}
    ${hasR&&tt.bR?`<div class="dl-t"><span class="lbl">Sin entreno</span> ${dlTotTxt(tt.aR,tt.bR)}</div>`:''}
    ${f==='all'?`<div class="dl-k">${dlMealK(d)}</div>`:''}
    ${d.rNote==='on'?'<p class="dl-n">🔀 Activados los días sin entreno (comparado con el plan anterior)</p>':d.rNote==='off'?'<p class="dl-n">🔀 Quitados los días sin entreno: mismo plan todos los días</p>':''}
    ${d.first?'':sec('T',hasR?'Días de entreno':'Todos los días')+sec('R','Días sin entreno')}
    ${d.nota?`<p class="dl-n">📝 ${esc(d.nota)}</p>`:''}</div>`;
}
// Acumulado: kcal por comida del primer plan registrado frente al último (día de entreno)
function dlAcum(){
  const L=(DL.list||[]).filter(e=>e.data&&e.data.src==='calc'&&(e.data.k||[]).some(x=>x.b));if(L.length<2)return '';
  const last=L[0].data,first=L[L.length-1].data;
  const st=m=>{const x=first.k.find(y=>y.m===m);return x&&(x.a||x.b)};
  const rows=DL_ORDER.map(m=>{const a=st(m),b=(last.k.find(y=>y.m===m)||{}).b;const ka=a&&a.T&&Math.round(a.T.kcal),kb=b&&b.T&&Math.round(b.T.kcal);
    if(!ka&&!kb)return '';const d=(kb||0)-(ka||0);
    const n=L.reduce((s,e)=>s+(e.data.ch||[]).filter(c=>c.m===m).length,0);
    return `<tr><td>${DL_MEAL[m]}</td><td>${ka??'—'}</td><td>${kb??'—'}</td><td class="${d>0?'dl-upt':d<0?'dl-downt':''}">${d>0?'+':''}${d}</td><td>${n}</td></tr>`}).join('');
  const ta=first.tot&&(first.tot.aT||first.tot.bT),tb=last.tot&&last.tot.bT;
  return `<details class="dl-acc"><summary>Acumulado desde ${esc(new Date(L[L.length-1].at).toLocaleDateString('es-ES',{day:'numeric',month:'short'}))} (días de entreno)</summary>
    <table class="dl-tab"><thead><tr><th>Comida</th><th>kcal inicio</th><th>kcal ahora</th><th>Δ</th><th>Toques</th></tr></thead><tbody>${rows}</tbody></table>
    ${ta&&tb?`<div class="dl-t">Total: ${dlTotTxt(ta,tb)}</div>`:''}</details>`;
}
function dlPaint(){
  const box=document.getElementById('dlBox');if(!box)return;
  if(!DL.list||DL.id!==(CUR&&CUR.id)){box.innerHTML='<p class="small muted">Cargando registro…</p>';return}
  const chips=[['all','Todo'],...DL_ORDER.map(m=>[m,DL_MEAL[m]])].map(([k,l])=>`<button type="button" class="chip${DL.f===k?' on':''}" onclick="dlFilter('${k}')">${l}</button>`).join('');
  const body=DL.list.map(dlEntry).filter(Boolean).join('');
  box.innerHTML=DL.list.length?`${dlAcum()}<div class="row dl-f">${chips}</div>${body||'<p class="small muted">Sin cambios en esta comida.</p>'}`:'<p class="small muted">Todavía no hay cambios registrados. Se apuntan solos cada vez que pulsas «Enviar plan a la app».</p>';
}
function dlPanel(){
  setTimeout(dlLoad,0);
  return `<div class="panel" id="dlPanel"><div class="sec-h"><div><span class="lbl">Solo tú lo ves</span><b style="display:block;font-size:15px">📜 Registro de cambios de dieta</b></div></div>
    <div class="field"><label class="small muted" for="dlNota">Motivo del próximo cambio (opcional, se guarda al enviar)</label>
    <input id="dlNota" type="text" maxlength="200" placeholder="Ej.: estancado 2 semanas, bajo hidratos en cena"></div>
    <div id="dlBox"><p class="small muted">Cargando registro…</p></div></div>`;
}
