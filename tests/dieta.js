const {chromium}=require('playwright');const fs=require('fs');
const R=require('path').resolve(__dirname,'..'),OUT=__dirname;
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1280,height:900}});
await ctx.route('**/*',async r=>{const u=new URL(r.request().url());
  if(/fonts\.g/.test(u.hostname))return r.fulfill({status:200,body:''});if(u.hostname!=='app.test')return r.abort();
  let p=decodeURIComponent(u.pathname);if(p==='/')p='/index.html';
  if(p==='/js/db.js')return r.fulfill({path:OUT+'/mockdb.js',contentType:'text/javascript'});
  if(p==='/js/supabase-2.117.0.js')return r.fulfill({body:'',contentType:'text/javascript'});
  if(p.endsWith('/'))p+='index.html';
  const f=R+p;if(fs.existsSync(f))return r.fulfill({path:f});return r.fulfill({status:404,body:'nf'})});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>{errs.push('DIALOG '+d.message().slice(0,100));d.dismiss()});const w=ms=>p.waitForTimeout(ms);
await p.goto('http://app.test/');await w(300);
await p.fill('#aE','yaronska22@gmail.com');await p.fill('#aP','coachpass1');await p.click('button:text-is("Entrar")');await w(500);
if(await p.isVisible('text=Ahora no'))await p.click('text=Ahora no');
const ids=await p.evaluate(async()=>{const a=await db.createClient('a@t.com',{nombre:'Ana López',objetivo:'perder',sexo:'Mujer',nac:'1990-05-01',altura:165,dias:[1,3,5]},'2026-10-01');const b2=await db.createClient('b@t.com',{nombre:'Bruno Gil',objetivo:'ganar',sexo:'Hombre',dias:[1,2,4,5]},'2026-10-01');await refreshList();await loadClient(a);coachSel=a;renderCoach();return [a,b2]});
await p.click('.tabs >> text=Dieta');await w(3000);
const f=p.frame({url:/calc/});
console.log('calc name:',await f.textContent('#currentClientName'),'| sex:',await f.inputValue('#sex'),'age',await f.inputValue('#age'),'goal',await f.inputValue('#goal'));
await p.screenshot({path:OUT+'/d1.png'});
// cambia gramos en el protocolo para provocar guardado
await f.click('text=⚡ Cargar plantilla Yaronska');await w(800);
await w(1500);let st=await p.evaluate(()=>window.__mock);console.log('saved calc for',Object.keys(st.calc||{}),'has protocol',!!(st.calc&&st.calc[ids[0]]&&st.calc[ids[0]].protocol));
await p.click('text=📲 Enviar plan a la app');await w(900);
st=await p.evaluate(()=>window.__mock);const cl=st.clients.find(c=>c.id===ids[0]);console.log('plan en DB:',cl.plan&&cl.plan.source,!!(cl.plan&&cl.plan.R),'rest_on',cl.rest_on);
// cambiar de cliente con la calculadora abierta
await p.click('.citem >> text=Bruno Gil');await w(2000);
console.log('calc ahora:',await f.textContent('#currentClientName'),'goal',await f.inputValue('#goal'));
// otra pestaña: la calculadora se oculta
await p.click('.tabs >> text=Peso');await w(200);console.log('oculta en Peso:',await p.isHidden('#calcWrap'));
await p.click('.citem >> text=Ana López');await w(800);
// vista cliente
await p.setViewportSize({width:390,height:844});await p.evaluate(()=>{setView('client');go('food')});await w(400);
console.log('wrap oculto en vista cliente:',await p.isHidden('#calcWrap'));
await p.screenshot({path:OUT+'/d2.png',fullPage:true});
console.log('comidas:',(await p.textContent('#screen')).replace(/\s+/g,' ').slice(0,300));
await p.click('text=Recetas');await p.click('.rcard >> nth=0');await w(200);console.log('receta:',(await p.textContent('.ilist')).slice(0,120));
console.log('ERR',errs);await b.close()})();
