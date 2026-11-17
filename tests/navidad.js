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
await p.evaluate(async()=>{const a=await db.createClient('a@t.com',{nombre:'Ana López',objetivo:'perder',sexo:'Mujer',dias:[1,3,5]},'2026-10-01');await refreshList();await loadClient(a);coachSel=a;renderCoach()});
await p.click('.ftabs >> text=Bonus');await w(300);
await p.click('.brow:has-text("Navidad Sin Culpa") input');await w(400);
console.log('bonus:',await p.evaluate(()=>JSON.stringify([FICHA.bonus,window.__notify])));
console.log('fila:',(await p.textContent('.brow:has-text("Navidad")')).replace(/\s+/g,' '));
// como cliente
await p.setViewportSize({width:390,height:844});await p.evaluate(()=>{ME.role='client';setView('client');go('home')});await w(1200);
console.log('popup:',await p.isVisible('#navpop'));
await p.screenshot({path:OUT+'/nav1.png'});
await p.click('#navpop .np-later');await w(300);
await p.screenshot({path:OUT+'/nav2.png'});
await p.click('.xmas');await w(1500);
const f=p.frame({url:/navidad\.html/});console.log('iframe:',!!f, await f.textContent('#steplbl'),'nombre',await f.inputValue('#name'));
await f.click('#next');await w(300);
for(let i=0;i<4;i++){await f.click('#qopts .opt >> nth=0');await w(450)}
await f.click('#next');await w(200);await f.click('.mode.bajar');await f.click('#next');await w(200);
await f.click('#next');await w(200);await f.click('.gift >> nth=0');await f.click('#next');await w(200);
await f.click('#next');await w(200);await f.click('#next');await w(500);
console.log('paso',await f.textContent('#steplbl'),'guardado',await p.evaluate(()=>JSON.stringify(S.profile.navidad&&[S.profile.navidad.mode,S.profile.navidad.sweet,S.profile.navidad.red.length,S.profile.navidad.weeks.length])));
await f.click('button.cta');await w(300);
await p.screenshot({path:OUT+'/nav3.png'});
await p.click('#navov .navx');await w(400);
console.log('tarjeta:',(await p.textContent('.xmas')).replace(/\s+/g,' '));
await p.screenshot({path:OUT+'/nav4.png'});
// reabrir: restaura en Tu plan
await p.click('.xmas');await w(1500);const f2=p.frame({url:/navidad\.html/});console.log('reabre en:',await f2.textContent('#steplbl'));
await p.click('#navov .navx');await w(200);
await p.evaluate(()=>{ME.role='coach';setView('coach')});await w(300);await p.click('.ftabs >> text=Bonus').catch(()=>{});await w(300);
console.log('coach fila:',(await p.textContent('.brow:has-text("Navidad")')).replace(/\s+/g,' '));
console.log('ERR',errs);await b.close()})();
