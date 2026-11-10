// Recetario ampliado (data/recetas.json): cantidades ajustadas al plan de cada cliente.
// Lo usan la app (pestaña Recetas) y la Calculadora (libros PDF por categoría).
// - Comidas, desayunos, snacks y batidos: la receta se escala a 1 persona con las kcal de esa comida de su plan.
// - Postres, repostería, salsas y snacks por tandas: receta entera + cuántas raciones le tocan.
// - Bebidas: 1 ración tal cual.
(function(g){
  const CAT_ICON=['🍳','🍗','🥩','🐟','🍝','🥗','🥦','🍲','🥜','🥤','🍮','🥐','🍹','🫙'];
  const MEAL_TXT={b:'tu desayuno',l:'tu comida o cena',s:'tu merienda',x:''};
  let DATA=null,LOADING=null;
  function load(base){
    if(DATA)return Promise.resolve(DATA);
    if(!LOADING)LOADING=fetch((base||'')+'data/recetas.json').then(r=>{if(!r.ok)throw new Error('recetas '+r.status);return r.json()}).then(d=>{
      d.r.forEach((r,i)=>{r.i=i;r.cat=d.cats[r.c];r.s=norm(r.t+' '+r.ing.map(x=>x[0]).join(' '))});DATA=d;return d}).catch(e=>{LOADING=null;throw e});
    return LOADING;
  }
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
  // kcal objetivo por comida. ctx: {sum:[{m,T,R,off}], rest:bool, kcal:number}
  function targets(ctx){
    ctx=ctx||{};const S=ctx.sum,R=!!ctx.rest;
    const k=m=>{if(!S)return 0;const x=S.find(z=>z.m===m);if(!x||x.off)return 0;return (R&&x.R!=null?x.R:x.T)||0};
    if(S&&S.length){const lu=k('lunch'),di=k('dinner'),bf=k('breakfast'),sn=k('snack'),mm=k('midmorning');
      const tot=S.reduce((a,x)=>a+(x.off?0:((R&&x.R!=null?x.R:x.T)||0)),0);
      return {b:bf||tot*.25,l:(lu&&di)?(lu+di)/2:(lu||di||tot*.3),s:sn||mm||tot*.1}}
    const K=(+ctx.kcal||2000)*(ctx.rest&&ctx.restF?ctx.restF:1);
    return {b:K*.25,l:K*.3,s:K*.1};
  }
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function portion(r,T){
    const kc=r.k[0]||0;
    if(r.m==='x'&&!r.b)return {mode:'fixed',f:1,txt:'1 ración'};
    if(r.b){
      if(r.m==='x')return {mode:'batch',f:1,rac:1,txt:`Receta para ${r.serv} raciones · 1 ración por toma`};
      const t=T[r.m]||T.s||200;const rac=kc>0?clamp(Math.round(t/kc*2)/2,.5,3):1;
      return {mode:'batch',f:1,rac,txt:`Receta para ${r.serv} raciones · <b>a ti te toca ${fmtN(rac)} ración${rac>1?'es':''}</b> en ${MEAL_TXT[r.m]||'tu merienda'}`};
    }
    const t=T[r.m]||0;const f=kc>0&&t>0?clamp(t/kc,.5,2.5):1;
    return {mode:'scaled',f,txt:`Cantidades para 1 persona ajustadas a ${MEAL_TXT[r.m]||'tu plan'}`};
  }
  const fmtN=v=>{const s=(Math.round(v*10)/10).toString().replace('.',',');return s};
  function q(v,u){
    if(u==='ud'){const n=Math.max(1,Math.round(v/50));return n+(n===1?' huevo':' huevos')}
    let r;if(v<1)r=Math.round(v*10)/10;else if(v<10)r=Math.round(v*2)/2;else if(v<60)r=Math.round(v);else if(v<200)r=Math.round(v/5)*5;else r=Math.round(v/10)*10;
    return fmtN(r)+' '+(u||'g');
  }
  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
  // líneas de ingredientes: [{h:html,c:'has'|'' }]
  function lines(r,P,fR){
    const per=P.mode==='batch'?1:1/r.serv;const out=[],gusto=[];
    const sc=P.mode==='scaled';
    r.ing.forEach(([n,g,u,qt,sp,note])=>{
      if(sc&&note&&/\d/.test(note.replace(/\d+(?:[.,]\d+)?\s*(cm|mm|°C|min)/g,'')))note='';
      if(note)note=note.charAt(0).toLowerCase()+note.slice(1);
      const nm=esc(n)+(note?` <small>(${esc(note)})</small>`:'');
      if(g==null||g===0){if(sc){gusto.push(n);return}out.push({h:(qt&&!/al gusto/i.test(qt)?`<span class="q">${esc(qt)}</span> `:'')+nm,c:''});return}
      const v=g*per*P.f;
      if(sc&&(sp||(v<2&&!/levadura|bicarbonato|gelatina|proteína/i.test(n)))){gusto.push(n);return}
      if(sp&&P.mode==='batch'){out.push({h:`<span class="q">${esc(qt||q(v,u))}</span> ${nm}`,c:''});return}
      if(u==='ud'){out.push({h:`<span class="q">${q(v,u)}</span>${note?` <small>(${esc(note)})</small>`:''}`+(fR&&fR<1&&sc?` <span class="alt">· descanso: <span class="q">${q(v*fR,u)}</span></span>`:''),c:'has'});return}
      let h=`<span class="q">${q(v,u)}</span> ${nm}`;
      if(fR&&fR<1&&sc)h+=` <span class="alt">· descanso: <span class="q">${q(v*fR,u)}</span></span>`;
      out.push({h,c:'has'});
    });
    if(gusto.length)out.push({h:'<b>Al gusto:</b> '+esc([...new Set(gusto)].join(', ')),c:'veg'});
    return out;
  }
  function photo(r,base){return r.img?(base||'')+'img/recetas2/'+r.id+'.jpg':''}
  function icon(r){return CAT_ICON[r.c]||'🍽️'}
  function search(D,{cat,q,fn}){
    const Q=norm(q).split(/\s+/).filter(Boolean);
    return D.r.filter(r=>(cat==null||cat==='all'||r.c===cat)&&Q.every(w=>r.s.includes(w))&&(!fn||fn(r)));
  }
  g.YSR={load,targets,portion,lines,photo,icon,search,norm,q,get data(){return DATA}};
})(typeof window!=='undefined'?window:globalThis);
