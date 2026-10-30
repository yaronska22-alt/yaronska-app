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
await f.evaluate(()=>openShoppingList('protocol'));await w(500);
console.log('btn',await f.isVisible('#ysShopApp'));
await f.evaluate(()=>document.getElementById('ysShopApp').click());await w(1200);
st=await p.evaluate(()=>window.__mock);const cl2=st.clients.find(c=>c.id===ids[0]);const sh=cl2.plan&&cl2.plan.shop;
console.log('shop en DB:',sh&&sh.periodo,sh&&sh.modo,sh&&sh.sections.length,JSON.stringify(sh&&sh.sections[0].items.slice(0,3)));
console.log('coach note:',(await p.textContent('#calcWrap, .cmain')).match(/Enviada el[^·]*· [^.]*/)?.[0]);
await f.evaluate(()=>closeModal('shoppingListModal'));
// reenviar plan no debe perder la lista
await p.click('text=📲 Enviar plan a la app');await w(900);st=await p.evaluate(()=>window.__mock);console.log('lista tras reenviar plan:',!!st.clients.find(c=>c.id===ids[0]).plan.shop);
await p.setViewportSize({width:390,height:844});await p.evaluate(()=>{setView('client');go('food');foodTab='compra';render()});await w(500);
console.log('cliente:',(await p.textContent('.shop')).replace(/\s+/g,' ').slice(0,400));
await p.click('.shc >> nth=0');await w(200);
await p.screenshot({path:OUT+'/shop2.png'});
console.log('ERR',errs);await b.close()})();
