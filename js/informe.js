// ================= INFORME SEMANAL (PDF) Y COMPARATIVA DEL FÍSICO =================
// Mismo diseño que el informe de la Calculadora: A4 negro, franja amarilla, Jost/Onest.
function rpCss(){return `
.ysr-page{width:794px;height:1123px;background:#0a0a0a;position:relative;overflow:hidden;font-family:Onest,Arial,sans-serif;color:#fff;box-sizing:border-box}
.ysr-page *{box-sizing:border-box}
.ysr-top{height:44px;background:#FFD60A;color:#000;display:flex;align-items:center;justify-content:center;font-family:Jost,Arial,sans-serif;font-weight:600;letter-spacing:1.5px;font-size:12px;position:relative;text-transform:uppercase}
.ysr-top .r{position:absolute;right:40px;font-size:9px;letter-spacing:1px}
.ysr-stripe{position:absolute;left:0;top:44px;bottom:30px;width:8px;background:#FFD60A}
.ysr-body{padding:12px 40px 0 44px}
.ysr-kicker{color:#FFD60A;font-size:10px;letter-spacing:.6px;text-transform:uppercase}
.ysr-name{font-family:Jost,Arial,sans-serif;font-weight:600;font-size:36px;text-transform:uppercase;line-height:1.05;margin:4px 0 6px}
.ysr-week{color:#FFD60A;font-family:Jost,Arial,sans-serif;font-weight:600;font-size:16px;text-transform:uppercase}
.ysr-date{color:#aaa;font-size:12px;margin-left:16px}
.ysr-rule{height:3px;background:#FFD60A;margin:12px 0}
.ysr-sec{display:flex;align-items:baseline;justify-content:space-between;margin:2px 0 8px}
.ysr-sec .h{font-family:Jost,Arial,sans-serif;font-weight:600;font-size:15px;text-transform:uppercase;letter-spacing:.5px}
.ysr-sec .k{color:#FFD60A;font-size:9px;text-transform:uppercase;letter-spacing:.6px}
.ysr-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:10px}
.ysr-card{background:#1a1a1a;border-left:3px solid #FFD60A;padding:7px 10px 8px}
.ysr-card.muted{border-left-color:#333}.ysr-card.fat{border-left-color:#FF8C28}
.ysr-card .l{font-size:8.5px;color:#bbb;text-transform:uppercase;letter-spacing:.4px}
.ysr-card .v{font-family:Jost,Arial,sans-serif;font-size:22px;line-height:1.15}
.ysr-card .v.dim{color:#999}
.ysr-chart{border:2px dashed #FFD60A;padding:10px}
.ysr-chart img{width:100%;display:block}
.ysr-trend{display:flex;align-items:center;gap:30px;margin:10px 0 0}
.ysr-trend .l{color:#FFD60A;font-size:10px;text-transform:uppercase;letter-spacing:.6px}
.ysr-trend .v{color:#FFD60A;font-family:Jost,Arial,sans-serif;font-size:17px;text-transform:uppercase}
.ysr-thin{height:1px;background:#FFD60A;opacity:.7;margin:12px 0 10px}
.ysr-notes{background:#151515;border-left:3px solid #FFD60A;padding:10px 14px;font-size:11.5px;line-height:1.55;white-space:pre-wrap}
.ysr-grid{display:grid;grid-template-columns:1fr 1fr;column-gap:26px}
.ysr-row{display:grid;grid-template-columns:1fr 54px;gap:10px;align-items:start;padding:5px 0 6px;border-bottom:1px solid #1e1e1e}
.ysr-row .t{font-size:9.5px;text-transform:uppercase;color:#ddd;letter-spacing:.3px;margin-bottom:4px}
.ysr-bar{display:flex;gap:3px;height:10px;background:#000}.ysr-seg{flex:1;height:100%}
.ysr-row .s{font-size:8px;color:#aaa;margin-top:3px}
.ysr-row .n{font-family:Jost,Arial,sans-serif;color:#FFD60A;font-size:15px;text-align:right;line-height:1;white-space:nowrap}
.ysr-foot{position:absolute;bottom:10px;left:0;right:0;text-align:center;font-size:8.5px;color:#aaa}
.ysr-cmp-h{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:8px}
.ysr-cmp-h>div{background:#1a1a1a;border-left:3px solid #FFD60A;padding:7px 10px}
.ysr-cmp-h .l{font-size:8.5px;color:#bbb;text-transform:uppercase}.ysr-cmp-h .v{font-family:Jost,Arial,sans-serif;font-size:17px;text-transform:uppercase}
.ysr-pair{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px}
.ysr-rowlab{font-family:Jost,Arial,sans-serif;font-weight:600;font-size:13px;text-transform:uppercase;color:#FFD60A;margin:2px 0 5px}
.ysr-ph{position:relative;background:#141414;height:330px;display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid #2a2a2a}
.ysr-ph img{max-width:100%;max-height:100%;object-fit:contain;display:block}
.ysr-ph .tag{position:absolute;left:0;top:0;background:#FFD60A;color:#000;font-family:Jost,Arial,sans-serif;font-weight:600;font-size:10px;padding:3px 8px;text-transform:uppercase}
.ysr-ph .none{color:#666;font-size:11px}
.ysr-diff{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.ysr-diff>div{background:#1a1a1a;padding:6px 9px}.ysr-diff .l{font-size:8.5px;color:#bbb;text-transform:uppercase}.ysr-diff .v{font-family:Jost,Arial,sans-serif;font-size:16px}
.ysr-diff .g{color:#7CE38B}.ysr-diff .b{color:#FF8C28}
`}
const RP_D=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],RP_M=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const rpLong=s=>{const d=new Date(s+'T12:00');return RP_D[d.getDay()]+', '+d.getDate()+' '+RP_M[d.getMonth()]+' '+d.getFullYear()};
const rpKg=v=>v==null||isNaN(v)?'—':nf(v)+' kg';
const rpSgn=(v,u)=>v==null||isNaN(v)?'—':(v>0?'+':v<0?'−':'')+nf(Math.abs(v))+(u||' kg');
function rpBar(f5){let h='';for(let i=0;i<5;i++){const f=Math.max(0,Math.min(1,f5-i))*100;h+=`<div class="ysr-seg" style="background:linear-gradient(to right,#FFD60A ${f}%,#F6D9A9 ${f}%)"></div>`}return `<div class="ysr-bar">${h}</div>`}
const rpScoreTxt=v=>v<=1.5?'Muy por debajo · prioridad esta semana':v<=2.5?'Por debajo de lo esperado':v<=3.5?'Aceptable, con margen de mejora':v<=4.5?'Todo en orden':'Excelente';
function rpWellRows(c){const r=c.r||{};const rows=[];
  SCALES.forEach(s=>{if(r[s.k])rows.push({t:s.t,v:+r[s.k],txt:rpScoreTxt(+r[s.k])})});
  if(r.orina){const v=Math.max(1,Math.min(5,5-(r.orina-1)*4/7));rows.push({t:'Hidratación (color orina)',v,txt:urineTxt(r.orina),n:r.orina+' / 8'})}
  if(c.hs){const v=Math.min(5,c.hs/8*5);rows.push({t:'Horas de sueño',v,txt:c.hs<6?'Descanso insuficiente':c.hs<7?'Justo, hay margen de mejora':'Descanso correcto',n:nf(c.hs)+' h'})}
  return rows}
// gráfica (SVG → PNG para el PDF)
function rpChartPng(A,B){return new Promise(res=>{
  let svg=dualChart(A,B,{w:700,h:250});svg=svg.slice(0,svg.indexOf('</svg>')+6);
  svg=svg.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="500" ').replace('>',`><style>text{font:10px Onest,Arial,sans-serif;fill:#aaa}</style><rect width="100%" height="100%" fill="#0a0a0a"/>`);
  const im=new Image();im.onload=()=>{const cv=document.createElement('canvas');cv.width=1400;cv.height=500;const g=cv.getContext('2d');g.drawImage(im,0,0,1400,500);res(cv.toDataURL('image/png'))};im.onerror=()=>res('');
  im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)})}
async function rpPhotos(c){const P={};const paths=(c&&c.fotosP)||[];if(!paths.length)return P;
  let urls=[];try{urls=await db.photoUrls(paths)}catch(e){return P}
  await Promise.all(paths.map(async(p,i)=>{const k=/frontal/.test(p)?'frontal':/lateral/.test(p)?'lateral':/espalda/.test(p)?'espalda':'otra'+i;
    try{const b=await (await fetch(urls[i])).blob();P[k]=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(b)})}catch(e){}}));return P}
const rpPhotoCks=()=>S.checkins.filter(c=>c.fotosP&&c.fotosP.length).slice().sort((a,b)=>a.date.localeCompare(b.date));
function rpWeek(date){const W=allWeights();const start=FICHA.alta||(W[0]&&W[0].date);if(!start)return 1;return Math.max(1,Math.floor((new Date(date+'T12:00')-new Date(start+'T12:00'))/6048e5)+1)}
function rpTrend(c){const W=allWeights().filter(w=>w.date<=c.date);if(W.length<2)return 'Primera medición';
  const last=W.slice(-4);const d=last[last.length-1].peso-last[0].peso;const d1=W[W.length-1].peso-W[W.length-2].peso;const lose=CLIENT.goal==='perder';
  if(Math.abs(d)<=0.4)return Math.abs(d1)<=0.3?'Estable':d1<0?'Estable con indicios descendentes':'Estable con indicios ascendentes';
  return d<0?(lose?'Descendente · vamos bien':'Bajando'):(lose?'Subiendo':'Ascendente · vamos bien')}
// ---- ventana de opciones
let RP=null;
function openReport(mode){
  const cks=S.checkins.slice().sort((a,b)=>a.date.localeCompare(b.date));if(!cks.length){toast('Este cliente aún no tiene check-ins');return}
  const pcs=rpPhotoCks();const last=cks[cks.length-1];
  RP={mode:mode||'report',ck:last.date,a:pcs.length?pcs[0].date:'',b:pcs.length?pcs[pcs.length-1].date:'',cmp:pcs.length>1,fat:!!FICHA.showFat,well:true};
  const opt=(L,v)=>L.map(c=>`<option value="${c.date}" ${c.date===v?'selected':''}>${new Date(c.date+'T12:00').toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}${c.peso?' · '+nf(c.peso)+' kg':''}${c.fotosP&&c.fotosP.length?' · 📷':''}</option>`).join('');
  const isR=RP.mode==='report';const from=iso(daysAgo(70));
  const sh=document.getElementById('sheet');
  sh.innerHTML=`<div class="sheet-in" role="dialog" aria-label="Informe"><div class="sheet-b"><div class="row" style="justify-content:space-between"><h2>${isR?'📄 Informe semanal':'📸 Comparativa del físico'}</h2><button class="btn ghost sm" type="button" onclick="closeSheet()">Cerrar</button></div>
  <form class="form" onsubmit="event.preventDefault();makeReport(this.querySelector('button[type=submit]'))">
  ${isR?`<div class="fgrid"><div class="field"><label for="rpCk">Revisión</label><select id="rpCk">${opt(cks,RP.ck)}</select></div><div class="field"><label for="rpWk">Semana</label><input id="rpWk" type="number" min="1" value="${rpWeek(RP.ck)}"></div>
    <div class="field"><label for="rpGoal">Peso objetivo (kg)</label><input id="rpGoal" inputmode="decimal" value="${esc(FICHA.pesoObj||'')}" placeholder="Vacío = No hay"></div><div class="field"><label for="rpFrom">Gráfica desde</label><input id="rpFrom" type="date" value="${FICHA.wFrom||from}"></div></div>
    <div class="field"><label for="rpTr">Tendencia</label><input id="rpTr" value="${esc(rpTrend(last))}"></div>
    <div class="field"><label for="rpNotes">Valoración y notas</label><textarea id="rpNotes" rows="5" placeholder="Cómo ha ido la semana, qué mejora, qué ajustamos…"></textarea></div>
    <label class="prow"><span>Mostrar % graso en la gráfica</span><input class="sw" type="checkbox" id="rpFat" ${RP.fat?'checked':''}></label>
    <label class="prow"><span>Incluir valoración de hábitos y bienestar<small>Estrés, sueño, energía, hambre, motivación, recuperación, seguimiento… del check-in</small></span><input class="sw" type="checkbox" id="rpWell" checked></label>
    <label class="prow"><span>Incluir comparativa del físico<small>${pcs.length>1?'Fotos de una fecha frente a otra, en una segunda página':'Hacen falta al menos 2 check-ins con fotos'}</small></span><input class="sw" type="checkbox" id="rpCmp" ${RP.cmp?'checked':''} ${pcs.length>1?'':'disabled'} onchange="document.getElementById('rpCmpBox').hidden=!this.checked"></label>`:''}
  <div id="rpCmpBox" ${isR&&!RP.cmp?'hidden':''}>${pcs.length>1?`<div class="fgrid"><div class="field"><label for="rpA">Antes</label><select id="rpA">${opt(pcs,RP.a)}</select></div><div class="field"><label for="rpB">Después</label><select id="rpB">${opt(pcs,RP.b)}</select></div></div>`:`<p class="small muted">Hacen falta al menos 2 check-ins con fotos para comparar.</p>`}</div>
  <button class="btn" type="submit" ${!isR&&pcs.length<2?'disabled':''}>⬇️ Descargar PDF</button></form></div></div>`;
  sh.hidden=false;sh.onclick=e=>{if(e.target===sh)closeSheet()};
}
function rpLoadLibs(){const L=src=>new Promise((r,j)=>{const s=document.createElement('script');s.src=src;s.onload=r;s.onerror=()=>j(new Error('No se pudo cargar '+src));document.head.appendChild(s)});
  return Promise.all([window.html2canvas?1:L('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),window.jspdf?1:L('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')])}
const rpHead=(kicker,week,date)=>`<div class="ysr-top">Yaronska · @Yaronska_Fit<span class="r">${esc(kicker)}</span></div><div class="ysr-stripe"></div><div class="ysr-body">
  <div class="ysr-kicker">${esc(kicker)}</div><div class="ysr-name">${esc(CLIENT.name)}</div><div>${week?`<span class="ysr-week">Semana ${week}</span>`:''}<span class="ysr-date">${date}</span></div><div class="ysr-rule"></div>`;
const rpFoot='<div class="ysr-foot">yaronska22@gmail.com · @Yaronska_Fit · #ComeConGusto · Documento privado</div>';
async function rpCmpPage(aD,bD,week){
  const A=S.checkins.find(c=>c.date===aD),B=S.checkins.find(c=>c.date===bD);const [PA,PB]=await Promise.all([rpPhotos(A),rpPhotos(B)]);
  const F=fatSeries();const fa=(F.find(x=>x.date===aD)||{}).v,fb=(F.find(x=>x.date===bD)||{}).v;
  const ph=(P,k,lab)=>`<div class="ysr-ph">${P[k]?`<img src="${P[k]}" alt="">`:'<span class="none">Sin foto</span>'}<span class="tag">${lab}</span></div>`;
  const keys=[['frontal','Frontal'],['lateral','Lateral'],['espalda','Espalda']].filter(([k])=>PA[k]||PB[k]);
  const fd=d=>new Date(d+'T12:00').toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'});
  const dif=(k,u,inv)=>{const a=A[k],b=B[k];if(a==null||b==null)return '';const d=b-a;const good=CLIENT.goal==='perder'||inv?d<=0:d>=0;return `<div><div class="l">${k==='peso'?'Peso':k[0].toUpperCase()+k.slice(1)}</div><div class="v ${good?'g':'b'}">${rpSgn(d,u)}</div></div>`};
  const weeks=Math.max(0,Math.round((new Date(bD)-new Date(aD))/6048e5));
  return `<div class="ysr-page">${rpHead('Comparativa del físico',week,`· ${weeks} semana${weeks===1?'':'s'} de diferencia`)}
    <div class="ysr-cmp-h"><div><div class="l">Antes</div><div class="v">${fd(aD)}${A.peso?' · '+rpKg(A.peso):''}</div></div><div><div class="l">Después</div><div class="v">${fd(bD)}${B.peso?' · '+rpKg(B.peso):''}</div></div></div>
    ${keys.length?[[PA,'Antes · '+fd(aD)],[PB,'Después · '+fd(bD)]].map(([P,t])=>`<div class="ysr-rowlab">${t}</div><div class="ysr-pair">${keys.map(([k,l])=>ph(P,k,l)).join('')}</div>`).join(''):'<p style="color:#aaa">No hay fotos en esas revisiones.</p>'}
    <div class="ysr-diff">${dif('peso',' kg')}${fa!=null&&fb!=null?`<div><div class="l">% graso</div><div class="v ${fb-fa<=0?'g':'b'}">${rpSgn(fb-fa,' %')}</div></div>`:''}${dif('cintura',' cm',true)}${dif('cadera',' cm',true)}</div>
  </div>${rpFoot}</div>`;
}
async function makeReport(btn){
  const t=btn.textContent;btn.disabled=true;btn.textContent='Generando…';
  try{
    const pages=[];const isR=RP.mode==='report';let fname;
    if(isR){
      const ckD=document.getElementById('rpCk').value,week=+document.getElementById('rpWk').value||1,goal=parseFloat(String(document.getElementById('rpGoal').value).replace(',','.'));
      const from=document.getElementById('rpFrom').value,tr=document.getElementById('rpTr').value.trim(),notes=document.getElementById('rpNotes').value.trim();
      const showFat=document.getElementById('rpFat').checked,well=document.getElementById('rpWell').checked,cmp=document.getElementById('rpCmp').checked;
      FICHA.pesoObj=isNaN(goal)?'':goal;save();
      const c=S.checkins.find(x=>x.date===ckD);const W=allWeights().filter(w=>w.date<=ckD);const cur=W.length?W[W.length-1]:null;const prev=W.length>1?W[W.length-2]:null;
      const Wr=W.filter(w=>!from||w.date>=from);const F=showFat?fatSeries().filter(x=>x.date<=ckD&&(!from||x.date>=from)):[];
      const png=Wr.length+F.length>1?await rpChartPng(Wr.map(w=>({d:w.date,v:w.peso})),F.map(x=>({d:x.date,v:x.v}))):'';
      const fc=F.length?F[F.length-1].v:null;const rows=well?rpWellRows(c||{}):[];const half=Math.ceil(rows.length/2);
      const row=r=>`<div class="ysr-row"><div><div class="t">${esc(r.t)}</div>${rpBar(r.v)}<div class="s">${esc(r.txt)}</div></div><div class="n">${r.n||nf(r.v,1)+' / 5'}</div></div>`;
      pages.push(`<div class="ysr-page">${rpHead('Informe semanal',week,'· Revisión: '+rpLong(ckD))}
        <div class="ysr-sec"><div class="h">Evolución del peso${F.length?' y % graso':''}</div></div>
        <div class="ysr-cards"><div class="ysr-card"><div class="l">Peso actual</div><div class="v">${rpKg(cur&&cur.peso)}</div></div>
          <div class="ysr-card ${isNaN(goal)?'muted':''}"><div class="l">Peso objetivo</div><div class="v ${isNaN(goal)?'dim':''}">${isNaN(goal)?'No hay':rpKg(goal)}</div></div>
          ${fc!=null?`<div class="ysr-card fat"><div class="l">% graso</div><div class="v">${nf(fc)} %</div></div>`:`<div class="ysr-card muted"><div class="l">Vs semana anterior</div><div class="v">${rpSgn(cur&&prev?cur.peso-prev.peso:null)}</div></div>`}
          <div class="ysr-card muted"><div class="l">Cambio total</div><div class="v">${rpSgn(cur&&W[0]&&W.length>1?cur.peso-W[0].peso:null)}</div></div></div>
        ${png?`<div class="ysr-chart"><img src="${png}" alt=""><div style="font-size:9px;color:#aaa;text-align:center;margin-top:5px"><span style="color:#FFD60A">━</span> Peso (kg)${F.length?' &nbsp; <span style="color:#FF8C28">┅</span> % graso':''}</div></div>`:''}
        <div class="ysr-trend"><span class="l">Tendencia</span><span class="v">>>> ${esc(tr||'—')}</span></div>
        <div class="ysr-thin"></div>
        ${notes?`<div class="ysr-sec"><div class="h">Valoración y notas</div></div><div class="ysr-notes">${esc(notes)}</div>`:''}
        ${rows.length?`<div class="ysr-sec" style="margin-top:12px"><div class="h">Hábitos y bienestar</div><div class="k">Del check-in de esta semana</div></div><div class="ysr-grid"><div>${rows.slice(0,half).map(row).join('')}</div><div>${rows.slice(half).map(row).join('')}</div></div>`:''}
      </div>${rpFoot}</div>`);
      if(cmp){const a=document.getElementById('rpA').value,b=document.getElementById('rpB').value;pages.push(await rpCmpPage(a<b?a:b,a<b?b:a,week))}
      fname=`Informe semanal - ${CLIENT.name} - Semana ${week}.pdf`;
    }else{
      const a=document.getElementById('rpA').value,b=document.getElementById('rpB').value;pages.push(await rpCmpPage(a<b?a:b,a<b?b:a,0));
      fname=`Comparativa del físico - ${CLIENT.name}.pdf`;
    }
    await rpLoadLibs();
    const host=document.createElement('div');host.style.cssText='position:fixed;left:-10000px;top:0;width:794px;z-index:-1';host.innerHTML='<style>'+rpCss()+'</style>'+pages.join('');document.body.appendChild(host);
    try{if(document.fonts&&document.fonts.ready)await document.fonts.ready;
      await Promise.all([...host.querySelectorAll('img')].map(im=>im.complete?1:new Promise(r=>{im.onload=im.onerror=r})));
      const pdf=new window.jspdf.jsPDF({unit:'mm',format:'a4',orientation:'portrait'});const els=host.querySelectorAll('.ysr-page');
      for(let i=0;i<els.length;i++){const cv=await window.html2canvas(els[i],{scale:2,backgroundColor:'#0a0a0a',useCORS:true,logging:false,width:794,height:1123,windowWidth:794});if(i)pdf.addPage();pdf.addImage(cv.toDataURL('image/jpeg',0.92),'JPEG',0,0,210,297)}
      const bl=pdf.output('blob');const a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download=fname;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),20000);toast('PDF descargado');closeSheet();
    }finally{host.remove()}
  }catch(e){console.error(e);toast('No se ha podido generar el PDF: '+(e.message||e))}
  finally{btn.disabled=false;btn.textContent=t}
}

// ================= IMAGEN ANTES / DESPUÉS PARA REDES =================
let SO=null;
function openSocial(){const pcs=rpPhotoCks();if(pcs.length<2){toast('Hacen falta al menos 2 revisiones con fotos');return}
  SO={a:pcs[0].date,b:pcs[pcs.length-1].date,pose:'frontal',fmt:'post',kg:true,wk:true,face:false,name:false,img:{}};
  const opt=v=>pcs.map(c=>`<option value="${c.date}" ${c.date===v?'selected':''}>${new Date(c.date+'T12:00').toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'})}${c.peso?' · '+nf(c.peso)+' kg':''}</option>`).join('');
  const sw=(id,l,on)=>`<label class="prow"><span>${l}</span><input class="sw" type="checkbox" id="${id}" ${on?'checked':''} onchange="soDraw()"></label>`;
  const sh=document.getElementById('sheet');
  sh.innerHTML=`<div class="sheet-in sosheet" role="dialog" aria-label="Imagen para redes"><div class="sheet-b"><div class="row" style="justify-content:space-between"><h2>📲 Antes / después para redes</h2><button class="btn ghost sm" type="button" onclick="closeSheet()">Cerrar</button></div>
    <div class="sogrid"><div class="soform">
      <div class="fgrid"><div class="field"><label for="soA">Antes</label><select id="soA" onchange="soDraw(1)">${opt(SO.a)}</select></div><div class="field"><label for="soB">Después</label><select id="soB" onchange="soDraw(1)">${opt(SO.b)}</select></div></div>
      <div class="field"><label>Foto</label><div class="chips" id="soPose">${[['frontal','Frontal'],['lateral','Lateral'],['espalda','Espalda']].map(([k,l])=>`<button type="button" class="chip ${k==='frontal'?'on':''}" data-k="${k}" onclick="SO.pose='${k}';document.querySelectorAll('#soPose .chip').forEach(c=>c.classList.toggle('on',c.dataset.k==='${k}'));soDraw()">${l}</button>`).join('')}</div></div>
      <div class="field"><label>Formato</label><div class="chips" id="soFmt"><button type="button" class="chip on" data-k="post" onclick="SO.fmt='post';document.querySelectorAll('#soFmt .chip').forEach(c=>c.classList.toggle('on',c.dataset.k==='post'));soDraw()">Post 4:5</button><button type="button" class="chip" data-k="story" onclick="SO.fmt='story';document.querySelectorAll('#soFmt .chip').forEach(c=>c.classList.toggle('on',c.dataset.k==='story'));soDraw()">Historia 9:16</button></div></div>
      ${sw('soKg','Mostrar el cambio de peso',true)}${sw('soWk','Mostrar las semanas',true)}${sw('soName','Mostrar su nombre',false)}${sw('soFace','Tapar la cara (difumina la parte de arriba)',false)}
      <label class="prow" style="border-color:var(--y)"><span>Tengo su permiso para publicarlo<small>Sin su consentimiento expreso no se puede publicar</small></span><input class="sw" type="checkbox" id="soOk" ${FICHA.redesOk?'checked':''} onchange="FICHA.redesOk=this.checked;save();soBtns()"></label>
      <div class="row"><button class="btn" type="button" id="soDl" onclick="soSave()">⬇️ Descargar imagen</button><button class="btn ghost" type="button" id="soSh" onclick="soShare()" ${navigator.canShare?'':'hidden'}>Compartir</button></div>
    </div><div class="soprev"><canvas id="soCv"></canvas><small class="muted" id="soMsg">Cargando fotos…</small></div></div></div></div>`;
  sh.hidden=false;sh.onclick=e=>{if(e.target===sh)closeSheet()};soBtns();soDraw(1)}
function soBtns(){const ok=document.getElementById('soOk').checked;['soDl','soSh'].forEach(id=>{const b=document.getElementById(id);if(b)b.disabled=!ok})}
async function soLoad(date){if(SO.img[date])return SO.img[date];const c=S.checkins.find(x=>x.date===date);const P=await rpPhotos(c);const out={};
  await Promise.all(Object.entries(P).map(([k,src])=>new Promise(r=>{const im=new Image();im.onload=()=>{out[k]=im;r()};im.onerror=r;im.src=src})));SO.img[date]=out;return out}
async function soDraw(reload){if(!SO)return;const g=id=>document.getElementById(id);SO.a=g('soA').value;SO.b=g('soB').value;SO.kg=g('soKg').checked;SO.wk=g('soWk').checked;SO.name=g('soName').checked;SO.face=g('soFace').checked;
  const msg=g('soMsg');if(reload)msg.textContent='Cargando fotos…';const [IA,IB]=await Promise.all([soLoad(SO.a),soLoad(SO.b)]);
  const W=1080,H=SO.fmt==='story'?1920:1350;const cv=g('soCv');if(!cv)return;cv.width=W;cv.height=H;const x=cv.getContext('2d');
  const F=getComputedStyle(document.body).fontFamily||'Arial';const D=getComputedStyle(document.documentElement).getPropertyValue('--display').trim()||F;
  x.fillStyle='#0A0907';x.fillRect(0,0,W,H);
  // cabecera
  const top=SO.fmt==='story'?150:90;x.textBaseline='alphabetic';
  x.font=`800 44px ${D}`;x.fillStyle='#fff';const t1='YARONSKA';const w1=x.measureText(t1).width;x.font=`800 44px ${D}`;const w2=x.measureText('_FIT').width;
  x.fillText(t1,(W-w1-w2)/2,top);x.fillStyle='#FFD60A';x.fillText('_FIT',(W-w1-w2)/2+w1,top);
  x.font=`800 30px ${D}`;x.fillStyle='#A8A49C';const sub=SO.name?(CLIENT.name||'').toUpperCase():'TRANSFORMACIÓN REAL';x.textAlign='center';x.fillText(sub,W/2,top+52);x.textAlign='left';
  // fotos
  const pad=40,gap=20,py=top+90,ph=H-py-(SO.fmt==='story'?380:300),pw=(W-pad*2-gap)/2;
  const cover=(im,dx,dy,dw,dh)=>{if(!im){x.fillStyle='#1E1B17';x.fillRect(dx,dy,dw,dh);x.fillStyle='#6E6A63';x.font=`600 28px ${F}`;x.textAlign='center';x.fillText('Sin foto',dx+dw/2,dy+dh/2);x.textAlign='left';return}
    const r=Math.max(dw/im.width,dh/im.height);const sw=dw/r,sh=dh/r;const sx=(im.width-sw)/2,sy=Math.max(0,(im.height-sh)*0.35);
    x.save();x.beginPath();x.roundRect?x.roundRect(dx,dy,dw,dh,24):x.rect(dx,dy,dw,dh);x.clip();x.drawImage(im,sx,sy,sw,sh,dx,dy,dw,dh);
    if(SO.face){x.filter='blur(28px)';x.drawImage(im,sx,sy,sw,sh*0.2,dx,dy,dw,dh*0.2);x.filter='none';x.fillStyle='rgba(10,9,7,.25)';x.fillRect(dx,dy,dw,dh*0.2)}x.restore()};
  cover(IA[SO.pose],pad,py,pw,ph);cover(IB[SO.pose],pad+pw+gap,py,pw,ph);
  const lab=(t,cx,col)=>{x.font=`800 30px ${D}`;const tw=x.measureText(t).width+40;x.fillStyle=col;x.beginPath();const lx=cx-tw/2,ly=py+ph-70;x.roundRect?x.roundRect(lx,ly,tw,50,25):x.rect(lx,ly,tw,50);x.fill();x.fillStyle='#0A0907';x.textAlign='center';x.fillText(t,cx,ly+36);x.textAlign='left'};
  lab('ANTES',pad+pw/2,'#ffffff');lab('DESPUÉS',pad+pw+gap+pw/2,'#FFD60A');
  // datos
  const A=S.checkins.find(c=>c.date===SO.a),B=S.checkins.find(c=>c.date===SO.b);const wk=Math.max(1,Math.round((new Date(SO.b)-new Date(SO.a))/6048e5));
  const facts=[];if(SO.kg&&A.peso&&B.peso){const d=B.peso-A.peso;facts.push([(d>0?'+':'')+nf(d,1)+' kg','PESO'])}
  if(SO.wk)facts.push([wk+'','SEMANA'+(wk>1?'S':'')]);
  const fy=py+ph+(SO.fmt==='story'?120:95);
  if(facts.length){const cw=W/facts.length;facts.forEach(([v,l],i)=>{const cx=cw*i+cw/2;x.textAlign='center';x.font=`800 76px ${D}`;x.fillStyle='#FFD60A';x.fillText(v,cx,fy);x.font=`700 24px ${D}`;x.fillStyle='#A8A49C';x.fillText(l,cx,fy+40)});x.textAlign='left'}
  x.fillStyle='#FFD60A';x.fillRect(0,H-12,W,12);x.textAlign='center';x.font=`700 28px ${F}`;x.fillStyle='#ffffff';x.fillText('@Yaronska_Fit · Método Anti-Esfuerzo',W/2,H-(SO.fmt==='story'?110:50));x.textAlign='left';
  msg.textContent=(!IA[SO.pose]||!IB[SO.pose])?'Falta la foto '+SO.pose+' en alguna de las dos revisiones.':'Vista previa · se descarga en '+W+'×'+H+' px';}
function soBlob(){return new Promise(r=>document.getElementById('soCv').toBlob(r,'image/jpeg',0.92))}
const soName=()=>`antes-despues-${(CLIENT.first||'cliente').toLowerCase()}-${SO.b}.jpg`;
async function soSave(){if(!document.getElementById('soOk').checked){toast('Marca que tienes su permiso');return}const b=await soBlob();const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=soName();document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}
async function soShare(){const b=await soBlob();const f=new File([b],soName(),{type:'image/jpeg'});try{if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],title:'Antes y después'});else soSave()}catch(e){}}
