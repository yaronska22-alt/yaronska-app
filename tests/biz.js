const {chromium}=require('playwright');const fs=require('fs');
const R=require('path').resolve(__dirname,'..'),OUT=__dirname;const FILE=process.argv[2];
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1280,height:900}});
await ctx.route('**/*',async r=>{const u=new URL(r.request().url());
  if(/fonts\.g/.test(u.hostname))return r.fulfill({status:200,body:''});if(u.hostname!=='app.test')return r.abort();
  let p=decodeURIComponent(u.pathname);if(p==='/')p='/index.html';
  if(p==='/js/db.js')return r.fulfill({path:OUT+'/mockdb.js',contentType:'text/javascript'});
  if(p==='/js/supabase-2.117.0.js')return r.fulfill({body:'',contentType:'text/javascript'});
  const f=R+p;if(fs.existsSync(f))return r.fulfill({path:f});return r.fulfill({status:404,body:'nf'})});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());const w=ms=>p.waitForTimeout(ms);
await p.goto('http://app.test/');await w(300);
await p.fill('#aE','yaronska22@gmail.com');await p.fill('#aP','coachpass1');await p.click('button:text-is("Entrar")');await w(500);
if(await p.isVisible('text=Ahora no'))await p.click('text=Ahora no');
await p.click('text=⇪ Importar de la Calculadora');await p.setInputFiles('.sheet input[type=file]',FILE);await w(2500);
await p.click('#impGo');await p.waitForFunction(()=>document.getElementById('impGo').textContent==='Hecho',null,{timeout:180000});await p.click('.sheet >> text=Cerrar');
await p.click('text=Mi negocio');await w(800);await p.screenshot({path:OUT+'/biz.png',fullPage:true});
console.log((await p.textContent('.cmain')).replace(/\s+/g,' ').slice(0,700));
// registrar cobro
await p.click('.citem >> text=DANIEL LOZANO');await w(500);await p.click('text=+ Registrar cobro');await p.click('text=Guardar cobro');await w(500);
console.log('cobros daniel:',(await p.textContent('#payBox')).replace(/\s+/g,' ').slice(0,150),'| renov:',await p.evaluate(()=>FICHA.renov));
await p.click('text=Mi negocio');await w(800);console.log('aviso:',(await p.textContent('.cmain')).replace(/\s+/g,' ').slice(-200));
console.log('ERR',errs);await b.close()})();
