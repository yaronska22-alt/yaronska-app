const {chromium,devices}=require('playwright');const fs=require('fs');
const R=require('path').resolve(__dirname,'..'),OUT=__dirname;
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({...devices['iPhone 13']});
await ctx.route('**/*',async r=>{const u=new URL(r.request().url());
  if(/fonts\.g/.test(u.hostname))return r.fulfill({status:200,body:''});if(u.hostname!=='app.test')return r.abort();
  let p=decodeURIComponent(u.pathname);if(p==='/')p='/index.html';
  if(p==='/js/db.js')return r.fulfill({path:OUT+'/mockdb.js',contentType:'text/javascript'});
  if(p==='/js/supabase-2.117.0.js')return r.fulfill({body:'',contentType:'text/javascript'});
  const f=R+p;if(fs.existsSync(f))return r.fulfill({path:f});return r.fulfill({status:404,body:'nf'})});
const p=await ctx.newPage();const w=ms=>p.waitForTimeout(ms);
await p.goto('http://app.test/');await w(300);
await p.evaluate(()=>{localStorage.clear()});await p.reload();await w(300);
// set up: coach creates client with rutina+plan, then client logs in
await p.fill('#aE','yaronska22@gmail.com');await p.fill('#aP','coachpass1');await p.click('button:text-is("Entrar")');await w(500);
if(await p.isVisible('text=Ahora no'))await p.click('text=Ahora no');
await p.evaluate(async()=>{const id=await db.createClient('c@t.com',{nombre:'Cli',objetivo:'perder',dias:[1,3,5],pasosT:8000,pasosR:8000},'2026-10-01');await refreshList();await loadClient(id);S.routine=clone(TEMPLATES[0].days);S.planOn=true;save();await flushSync()});
const check=async n=>{const r=await p.evaluate(()=>{const W=document.documentElement.clientWidth;const bad=[...document.querySelectorAll('body *')].filter(e=>{const b=e.getBoundingClientRect();return b.right>W+1&&b.width>0}).slice(0,6).map(e=>e.tagName+'.'+e.className+' '+Math.round(e.getBoundingClientRect().right));return {sw:document.documentElement.scrollWidth,W,bad}});console.log(n,JSON.stringify(r))};
await p.evaluate(()=>{setView('client');go('home')});await check('home');
for(const t of ['food','train','check','res','perfil']){await p.evaluate(t=>go(t),t);await w(100);await check(t)}
await b.close()})();
