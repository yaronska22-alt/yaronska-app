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
const ids=await p.evaluate(async()=>{const a=await db.createClient('a@t.com',{nombre:'Ana López',objetivo:'perder',sexo:'Mujer',nac:'1990-05-01',altura:165,dias:[1,3,5]},'2026-10-01');await refreshList();await loadClient(a);coachSel=a;renderCoach();return [a]});
await p.click('.ftabs >> text=Bonus');await w(300);await p.click('text=Todos');await w(300);
console.log('en preparación:',await p.locator('.brow:has-text("En preparación")').count());
await p.setViewportSize({width:390,height:844});await p.evaluate(()=>{setView('client');go('res')});await w(300);
for(const id of ['libertad','casa','viaje','caotica','meal','atracon','turnos','descanso']){
  await p.evaluate(i=>{BSEL=null;BTAB[i]='doc';openBonus(i)},id);await w(700);
  const t=(await p.textContent('#bread')).replace(/\s+/g,' ');
  const hrefs=await p.$$eval('.bitem.doc a',a=>a.map(x=>x.getAttribute('href')));
  const st=await p.evaluate(h=>Promise.all(h.map(x=>fetch(x).then(r=>r.status))),hrefs);
  console.log(id,'|',t.slice(0,60),'|',hrefs.join(','),st.join(','),'| rel',await p.locator('section.sec-h:has-text("También") + .blist .bitem').count());
  if(id==='descanso'){await p.click('.bitem.doc:has-text("Guía del estrés") >> text=Leer');await w(500);console.log(' estres imgs',await p.locator('#bread img').count())}
}
await p.evaluate(()=>{BSEL=null;openBonus('casa')});await w(700);await p.screenshot({path:OUT+'/bn1.png'});
await p.evaluate(()=>{BSEL=null;openBonus('finde')});await w(500);console.log('eventos pdf',await p.$$eval('.bitem.doc a',a=>a.map(x=>x.getAttribute('href')).join(',')));
console.log('ERR',errs);await b.close()})();
