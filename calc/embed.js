// Puente entre la Calculadora de dietas y la app (modo integrado: ?embed=1).
// La Calculadora funciona igual que en el ordenador; solo cambia DÓNDE guarda:
// en vez de en el navegador/carpeta, envía cada cambio a la app, que lo guarda en Supabase.
(function(){
  if(!/[?&]embed=1/.test(location.search))return;
  document.documentElement.classList.add('ys-embed');
  const ORIGIN=location.origin;
  const send=m=>parent.postMessage(Object.assign({ys:true},m),ORIGIN);
  // Fotos del libro de recetas: las de la app
  window.YS_RECIPE_PHOTOS=Array.from({length:49},(_,i)=>ORIGIN+'/img/recetas/'+i+'.jpg');
  // Guardado → app
  let t=null;
  window.persist=function(){
    clearTimeout(t);
    t=setTimeout(()=>{const c=getCurrent();if(c)send({type:'save',client:JSON.parse(JSON.stringify(c)),customFoods:customFoods})},500);
    try{updateSavedIndicator&&updateSavedIndicator(true)}catch(e){}
  };
  window.scheduleFileAutoSave=function(){};
  // Exportar el protocolo al formato de la app del cliente
  function scaled(p,f){
    const q=JSON.parse(JSON.stringify(p));if(f>=1)return q;
    ['breakfast','midmorning','snack'].forEach(k=>{const m=q[k];if(m&&m.options)m.options.forEach(o=>{o.items=(o.items||[]).map(it=>ysRestItem(it,f))})});
    ['lunch','dinner'].forEach(k=>{const m=q[k];if(!m)return;['protein','fat','carb','fruit'].forEach(g=>{if(m[g]&&m[g].options)m[g].options=m[g].options.map(o=>ysRestOpt(o,f))})});
    return q;
  }
  function planOf(p){
    const opt=m=>{if(!m)return {options:[],note:''};pv2EnsureOptMeal(m);return {note:m.note||'',options:(m.options||[]).map(o=>({name:o.name||'',items:(o.items||[]).map(it=>it.alts.map(pv2AltText).join(' / ')),notes:o.notes||''}))}};
    const mac=m=>{pv2EnsureVegs(m);const g=k=>((m[k]&&m[k].options)||[]).map(pv2OptText);return {protein:g('protein'),fat:g('fat'),carb:g('carb'),vegs:g('vegs'),fruit:g('fruit'),veg:m.veg||''}};
    const bf=opt(p.breakfast);
    return {breakfast:bf.options,bfNote:bf.note,midmorning:opt(p.midmorning),snack:opt(p.snack),lunch:mac(p.lunch),dinner:mac(p.dinner)};
  }
  function ingOf(p){
    let old;try{old=YS_BK_F;YS_BK_F=1}catch(e){}
    const out=YS_RECIPES.map(r=>{const dessert=/postre/i.test(r.tags.join(' '));return r.ing.map(t=>{const x=ysBkIngredient(p,t,dessert);return [x.html,x.cls]})});
    try{YS_BK_F=old}catch(e){}
    return out;
  }
  window.ysExportForApp=function(){
    const c=getCurrent();if(!c||!c.protocol||c.protocol.v!==2)return {error:'Este cliente aún no tiene protocolo dietético. Créalo en «Protocolo dietético» (por ejemplo con «Cargar plantilla Yaronska»).'};
    const p=c.protocol;const RI=ysRestInfo(p);
    const T=JSON.parse(JSON.stringify(p));const R=RI.f<1?scaled(p,RI.f):null;
    return {source:'calc',fecha:new Date().toISOString().slice(0,10),T:{plan:planOf(T),ing:ingOf(T)},R:R?{plan:planOf(R),ing:ingOf(R)}:null};
  };
  // Mensajes de la app
  window.addEventListener('message',e=>{
    if(e.origin!==ORIGIN||!e.data||!e.data.ys)return;const m=e.data;
    if(m.type==='load'){
      clients=[m.client];customFoods=Array.isArray(m.customFoods)?m.customFoods:[];currentClientId=m.client.id;
      try{migrateClients()}catch(x){}
      try{renderClients()}catch(x){}
      showClient();switchTab(m.tab||'protocol');
      send({type:'loaded'});
    }
    if(m.type==='export'){send({type:'export',data:window.ysExportForApp()})}
    if(m.type==='tab'){switchTab(m.tab)}
  });
  function ready(){send({type:'ready'})}
  if(document.readyState==='complete')setTimeout(ready,50);else window.addEventListener('load',()=>setTimeout(ready,50));
})();
