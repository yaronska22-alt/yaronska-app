const {chromium,devices}=require('playwright');const fs=require('fs');
const R=require('path').resolve(__dirname,'..'),OUT=__dirname;
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1200,height:900}});
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
await p.evaluate(async()=>{const id=await db.createClient('c@t.com',{nombre:'Cli',objetivo:'perder',dias:[1,3,5]},'2026-10-01');await refreshList();await loadClient(id);S.routine=clone(TEMPLATES[0].days);S.routine[0].ex[0].sets=[];S.routine[0].ex[0].rest='90 s';save();await flushSync();setView('client');go('train');trainTab='rutina';dayIdx=0;render()});
await p.setViewportSize({width:390,height:844});await w(300);
await p.fill('#kg-0-0-0','60');await p.fill('#rp-0-0-0','8');await p.press('#rp-0-0-0','Tab');await w(700);
console.log('bar pos:',await p.evaluate(()=>{const r=document.getElementById('rtBar').getBoundingClientRect();return [Math.round(r.top),Math.round(r.bottom),getComputedStyle(document.getElementById('rtBar')).pointerEvents]}));
// tocar un campo que queda debajo del temporizador
const el=await p.evaluate(()=>{const r=document.getElementById('rtBar').getBoundingClientRect();const x=document.elementFromPoint(60,r.top+20);return x&&x.tagName+'.'+x.className});console.log('debajo del bar:',el);
await p.fill('#kg-0-0-1','62');await p.evaluate(()=>{go('home')});await w(200);await p.evaluate(()=>{go('train')});await w(300);
console.log('draft:',await p.inputValue('#kg-0-0-0'),await p.inputValue('#rp-0-0-0'),await p.inputValue('#kg-0-0-1'));
await p.reload();await w(600);
await p.click('text=Guardar entreno').catch(()=>{});
console.log('ERR',errs);await b.close()})();
