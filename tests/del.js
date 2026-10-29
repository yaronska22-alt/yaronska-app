const {chromium}=require('playwright');const fs=require('fs');
const R=require('path').resolve(__dirname,'..'),OUT=__dirname;
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1280,height:900}});
await ctx.route('**/*',async r=>{const u=new URL(r.request().url());
  if(/fonts\.g/.test(u.hostname))return r.fulfill({status:200,body:''});if(u.hostname!=='app.test')return r.abort();
  let p=decodeURIComponent(u.pathname);if(p==='/')p='/index.html';
  if(p==='/js/db.js')return r.fulfill({path:OUT+'/mockdb.js',contentType:'text/javascript'});
  if(p==='/js/supabase-2.117.0.js')return r.fulfill({body:'',contentType:'text/javascript'});
  const f=R+p;if(fs.existsSync(f))return r.fulfill({path:f});return r.fulfill({status:404,body:'nf'})});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));const w=ms=>p.waitForTimeout(ms);
await p.goto('http://app.test/');await w(300);
await p.fill('#aE','yaronska22@gmail.com');await p.fill('#aP','coachpass1');await p.click('button:text-is("Entrar")');await w(500);
if(await p.isVisible('text=Ahora no'))await p.click('text=Ahora no');
await p.evaluate(async()=>{for(const n of ['Uno','Dos'])await db.createClient(n.toLowerCase()+'@t.com',{nombre:n},'2026-10-01');await refreshList();coachSel=CL[0].id;await loadClient(coachSel);renderCoach()});
p.once('dialog',d=>d.accept('Mal'));await p.click('text=Eliminar cliente');await w(300);console.log('mal:',await p.textContent('#toast'),await p.locator('.citem').count());
p.once('dialog',d=>d.accept('Uno'));await p.click('text=Eliminar cliente');await w(500);console.log('ok:',await p.textContent('#toast'),await p.locator('.citem').count(),await p.textContent('.chead h1'));
console.log('ERR',errs);await b.close()})();
