const {chromium}=require('playwright');const fs=require('fs');
const R=require('path').resolve(__dirname,'..'),OUT=__dirname;
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1300,height:900}});
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
await p.evaluate(async()=>{const id=await db.createClient('c@t.com',{nombre:'Carlos Fuerza',objetivo:'ganar',dias:[1,3,5],sexo:'Hombre'},'2026-09-01');
  const id2=await db.createClient('d@t.com',{nombre:'Dana',objetivo:'perder',dias:[1,3,5]},'2026-10-20');
  await refreshList();await loadClient(id);coachSel=id;
  S.checkins.push({date:iso(daysAgo(2)),rev:false,peso:80});save();await flushSync();await refreshList();coachTab='ficha';renderCoach()});
await w(500);
console.log('lista:',(await p.$$eval('.citem .wkc',a=>a.map(x=>x.textContent))).join(' | '));
console.log('panel:',(await p.textContent('.wkp')).replace(/\s+/g,' '));
await p.screenshot({path:OUT+'/pl1.png'});
await p.click('text=La próxima es descarga');await w(300);
console.log('tras próxima:',(await p.textContent('.wkp-s:nth-child(3)')).replace(/\s+/g,' ').slice(0,90),'| admin',await p.evaluate(()=>FICHA.descargaAt));
await p.click('text=Esta semana es descarga');await w(300);
console.log('tras esta:',(await p.textContent('.citem.on .wkc')).replace(/\s+/g,' '));
// powerlifting
await p.click('.tabs button:text-is("Powerlifting")');await w(1500);
const f=p.frame({url:/pl\/index/});
console.log('pl nombre:',await f.inputValue('input[onchange*="nombre"]'));
await f.fill('input[onchange*="rm.sq"] >> nth=0','200');await f.press('input[onchange*="rm.sq"] >> nth=0','Tab');await w(1200);
console.log('guardado rm.sq:',await p.evaluate(()=>{const v=window.__mock.pl;return v&&Object.values(v)[0].rm.sq}));
await p.screenshot({path:OUT+'/pl2.png'});
// recargar: ir a ficha y volver
await p.click('.tabs button:text-is("Ficha")');await w(200);await p.click('.tabs button:text-is("Powerlifting")');await w(1500);
const f2=p.frame({url:/pl\/index/});console.log('tras volver rm.sq:',await f2.inputValue('input[onchange*="rm.sq"] >> nth=0'));
// cambiar de cliente
await p.click('.citem:has-text("Dana")');await w(800);await p.click('.tabs button:text-is("Powerlifting")');await w(1500);
console.log('Dana nombre:',await p.frame({url:/pl\/index/}).inputValue('input[onchange*="nombre"]'));
console.log('import visible',await p.frame({url:/pl\/index/}).isVisible('text=Importar del Planner'));console.log('ERR',errs);await b.close()})();
