// Libros de recetas por categoría (recetario ampliado) con las cantidades del plan del cliente.
(function(){
  const ORIGIN=location.origin;
  function mealMac(p,m){const meal=p[m];const t={kcal:0};if(!meal)return t;
    const add=a=>{if(a){const x=pv2Macros(a);t.kcal+=x.kcal||0}};
    if(m==='lunch'||m==='dinner'){pv2EnsureVegs(meal);['protein','fat','carb','fruit','vegs'].forEach(g=>{const o=meal[g]&&meal[g].options&&meal[g].options[0];if(!o)return;
      if(o.type==='salad'){(o.parts||[]).forEach(add);return}if(o.type==='eggs'&&o.base)add(o.base);if(o.alts)add(o.alts[0])});return t}
    pv2EnsureOptMeal(meal);const O=meal.options||[];if(!O.length)return t;O.forEach(x=>(x.items||[]).forEach(it=>{if(it.alts)add(it.alts[0])}));t.kcal/=O.length;return t}
  function sumOf(p){return ['breakfast','midmorning','lunch','snack','dinner'].map(m=>({m,T:Math.round(mealMac(p,m).kcal),R:null}))}
  window.ysPrintRecipeBookMenu=function(){
    const c=getCurrent();
    if(!c||!c.protocol||c.protocol.v!==2){alert('Primero carga o crea el protocolo dietético de este cliente.');return}
    let ov=document.getElementById('ysBookMenu');if(ov)ov.remove();
    ov=document.createElement('div');ov.id='ysBookMenu';
    ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';
    const btn='display:flex;justify-content:space-between;width:100%;text-align:left;background:#141210;border:1px solid #3A352E;border-radius:8px;padding:10px 12px;margin-bottom:6px;cursor:pointer;color:#fff;font-family:inherit;font-size:14px;';
    ov.innerHTML=`<div style="background:#0A0907;border:1px solid #3A352E;border-top:4px solid #FFD60A;border-radius:12px;max-width:460px;width:100%;max-height:90vh;overflow:auto;padding:18px;">
      <h3 style="margin:0 0 4px;">📖 ¿Qué libro de recetas?</h3>
      <p style="font-size:12px;color:#A8A49C;margin:0 0 12px;">Todos salen con las cantidades del plan de ${escapeHtml(c.name)}.</p>
      <button type="button" data-k="yf" style="${btn}border-color:#FFD60A"><b>⭐ Recetas Yaronska</b><span style="color:#A8A49C">${YS_RECIPES.length}</span></button>
      <div id="ysBookCats" style="color:#A8A49C;font-size:12px;padding:6px 0">Cargando recetario…</div>
      <button type="button" data-k="x" style="${btn}justify-content:center;background:transparent">Cancelar</button></div>`;
    document.body.appendChild(ov);
    ov.onclick=e=>{const b=e.target.closest('button');if(e.target===ov||(b&&b.dataset.k==='x')){ov.remove();return}if(!b)return;ov.remove();
      if(b.dataset.k==='yf')printRecipeBook();else ysAskRestMode(()=>ysPrintCatBook(+b.dataset.k))};
    YSR.load(ORIGIN+'/').then(D=>{document.getElementById('ysBookCats').outerHTML=D.cats.map((n,i)=>`<button type="button" data-k="${i}" style="${btn}"><span>${YSR.icon({c:i})} ${escapeHtml(n)}</span><span style="color:#A8A49C">${D.r.filter(r=>r.c===i).length}</span></button>`).join('')})
      .catch(()=>{const el=document.getElementById('ysBookCats');if(el)el.textContent='No se ha podido cargar el recetario ampliado (necesita conexión).'});
  };
  window.ysPrintCatBook=async function(ci){
    const c=getCurrent();const p=c.protocol;
    const w=window.open('','recipeBook'+ci,'width=1000,height=900');
    if(!w){alert('El navegador ha bloqueado la ventana emergente. Permítela y vuelve a pulsar.');return}
    w.document.write('<p style="font-family:Arial;padding:30px">Preparando el libro…</p>');
    const D=await YSR.load(ORIGIN+'/');
    const RI=ysRestInfo(p);const T=YSR.targets({sum:sumOf(p)});const fR=RI.f<1?RI.f:0;
    const list=D.r.filter(r=>r.c===ci);const cat=D.cats[ci];
    const head=`<div class="top"><span>YARONSKA<b>_FIT</b></span><span>${escapeHtml(cat)} · ${escapeHtml(c.name)}</span></div>`;
    const page=(r,i)=>{const P=YSR.portion(r,T);const L=YSR.lines(r,P,fR);
      return `<section class="page">${head}<div class="rec">
      <div class="ph">${r.img?`<img src="${ORIGIN}/img/recetas2/${r.id}.jpg" alt="">`:`<span class="ico">${YSR.icon(r)}</span>`}<span class="num">${String(i+1).padStart(2,'0')}</span><span class="time">⏱ ${r.min?r.min+' min · ':''}${escapeHtml(r.dif||'')}</span></div>
      <h2>${escapeHtml(r.t)}</h2>
      <div class="chips">${r.tags.map((t,k)=>t?`<span class="chip c${k}">${escapeHtml(t)}</span>`:'').join('')}</div>
      <div class="vegb">${P.txt}</div>
      <div class="cols"><div><div class="lbl">Ingredientes</div><ul class="ing">${L.map(x=>`<li class="${x.c}">${x.h}</li>`).join('')}</ul></div>
      <div><div class="lbl">Preparación</div><ol class="st">${r.st.map((s,k)=>`<li><i>${k+1}</i><span>${escapeHtml(s)}</span></li>`).join('')}</ol>
      ${r.nt?`<div class="note"><b>💡 Consejo</b> ${escapeHtml(r.nt)}</div>`:''}</div></div></div>
      <div class="foot">@Yaronska_Fit · #ComeConGusto · ${i+2}</div></section>`};
    const idx=list.map((r,i)=>`<li><i>${String(i+1).padStart(2,'0')}</i>${escapeHtml(r.t)}</li>`).join('');
    const cover=`<section class="page cover">${head}<h1>${escapeHtml(cat)}</h1><div class="who">Plan de ${escapeHtml(c.name)}</div>
      <p class="lead">Las cantidades ya están ajustadas a tu plan. ${fR?'Si un alimento tiene dos cantidades, la segunda es para los días sin entreno.':''} Las especias y hierbas, al gusto.</p>
      <div class="lbl">Las ${list.length} recetas</div><ol class="idx${list.length>60?' c3':''}">${idx}</ol><div class="foot">@Yaronska_Fit · #ComeConGusto</div></section>`;
    const html=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${escapeHtml(cat)} - ${escapeHtml(c.name)} - Yaronska_Fit</title>
    <link href="https://fonts.googleapis.com/css2?family=Jost:wght@600;800;900&family=Onest:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
    @page{size:A4;margin:0}*{box-sizing:border-box;margin:0;padding:0}
    html,body{background:#0A0907;-webkit-print-color-adjust:exact;print-color-adjust:exact}body{font-family:Onest,Arial,sans-serif;color:#fff}
    .page{width:210mm;height:297mm;position:relative;overflow:hidden;background:#0A0907;page-break-after:always;padding:15mm 10mm 11mm 13mm}
    .page::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2.2mm;background:#FFD60A}
    .top{position:absolute;left:0;right:0;top:0;height:9mm;background:#FFD60A;color:#000;display:flex;justify-content:space-between;align-items:center;padding:0 10mm 0 13mm;font-family:Jost,Arial,sans-serif;font-weight:800;font-size:8.5pt;letter-spacing:.14em;text-transform:uppercase}
    .foot{position:absolute;left:13mm;right:10mm;bottom:4mm;text-align:center;font-family:Jost,Arial,sans-serif;font-weight:600;font-size:7pt;letter-spacing:.16em;text-transform:uppercase;color:#6E6A63}
    .ph{position:relative;height:78mm;background:radial-gradient(circle at 30% 20%,#2a2410,#0f0e0b 70%);border-radius:3mm;overflow:hidden;margin-bottom:5mm;display:flex;align-items:center;justify-content:center}
    .ph img{width:100%;height:100%;object-fit:cover}.ph .ico{font-size:60pt}.ph::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1.2mm;background:#FFD60A}
    .num{position:absolute;left:3mm;top:3mm;background:#FFD60A;color:#000;font-family:Jost,Arial,sans-serif;font-weight:900;font-size:11pt;padding:1mm 2.6mm;border-radius:1mm}
    .time{position:absolute;right:3mm;top:3mm;background:rgba(10,9,7,.82);font-family:Jost,Arial,sans-serif;font-weight:600;font-size:8pt;padding:1.2mm 2.6mm;border-radius:5mm}
    h2{font-family:Jost,Arial,sans-serif;font-weight:800;font-size:17pt;line-height:1.08;text-transform:uppercase;margin-bottom:2.6mm}
    .chips{display:flex;flex-wrap:wrap;gap:1.4mm;margin-bottom:3mm}.chip{font-family:Jost,Arial,sans-serif;font-weight:800;font-size:7pt;letter-spacing:.08em;text-transform:uppercase;padding:.9mm 2.2mm;border-radius:.8mm}
    .chip.c0{background:#FFD60A;color:#000}.chip.c1{border:.3mm solid #FFD60A;color:#FFD60A}.chip.c2{border:.3mm solid #A8A49C;color:#E8E5DF}
    .vegb{background:#1E1B17;border-left:1mm solid #7CE38B;border-radius:0 1.5mm 1.5mm 0;padding:2.2mm 3mm;font-size:8.6pt;line-height:1.4;color:#E8E5DF;margin-bottom:4mm}
    .cols{display:grid;grid-template-columns:.9fr 1.1fr;gap:6mm}
    .lbl{font-family:Jost,Arial,sans-serif;font-weight:800;font-size:7.6pt;letter-spacing:.2em;text-transform:uppercase;color:#FFD60A;margin:0 0 2mm}
    ul.ing{list-style:none}ul.ing li{font-size:8.6pt;line-height:1.35;padding:1.1mm 0;border-bottom:.2mm solid #26221D;color:#E8E5DF}
    ul.ing li.veg{color:#A8A49C;border:0}ul.ing small{color:#8D887F}ul.ing .q{font-family:Jost,Arial,sans-serif;font-weight:800;color:#FFD60A}ul.ing .alt{color:#7CE38B;font-size:7.6pt}ul.ing .alt .q{color:#7CE38B}
    ol.st{list-style:none;counter-reset:s}ol.st li{display:flex;gap:2.4mm;font-size:8.4pt;line-height:1.4;margin-bottom:2mm;color:#E8E5DF}
    ol.st i{font-style:normal;flex:none;width:5mm;height:5mm;border-radius:50%;background:#FFD60A;color:#000;font-family:Jost,Arial,sans-serif;font-weight:900;font-size:7.4pt;display:flex;align-items:center;justify-content:center}
    .note{margin-top:3mm;background:#1E1B17;border-radius:1.5mm;padding:2.2mm 3mm;font-size:8pt;line-height:1.4;color:#E8E5DF}.note b{color:#FFD60A}
    .cover h1{font-family:Jost,Arial,sans-serif;font-weight:900;font-size:40pt;line-height:1;text-transform:uppercase;color:#FFD60A;margin:14mm 0 4mm}
    .cover .who{font-family:Jost,Arial,sans-serif;font-weight:800;font-size:13pt;text-transform:uppercase;letter-spacing:.1em;margin-bottom:5mm}
    .cover .lead{font-size:10pt;line-height:1.5;color:#E8E5DF;margin-bottom:7mm;max-width:160mm}
    ol.idx{list-style:none;columns:2;column-gap:8mm}ol.idx li{font-size:7.6pt;line-height:1.3;padding:.7mm 0;break-inside:avoid;color:#E8E5DF;display:flex;gap:2mm}ol.idx i{font-style:normal;color:#FFD60A;font-weight:700;flex:none}ol.idx.c3{columns:3;column-gap:5mm}ol.idx.c3 li{font-size:6.6pt;padding:.5mm 0}
    </style></head><body>${cover}${list.map(page).join('')}</body></html>`;
    w.document.open();w.document.write(html);w.document.close();
  };
})();
