const {chromium,devices}=require('playwright');const fs=require('fs');
const R=require('path').resolve(__dirname,'..'),OUT=__dirname;
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1200,height:900}});
await ctx.route('**/*',async r=>{const u=new URL(r.request().url());
  if(/fonts\.g/.test(u.hostname))return r.fulfill({status:200,body:''});if(!['app.test','localhost'].includes(u.hostname))return r.abort();
  let p=decodeURIComponent(u.pathname);if(p==='/')p='/index.html';
  if(p==='/js/db.js')return r.fulfill({path:OUT+'/mockdb.js',contentType:'text/javascript'});
  if(p==='/js/supabase-2.117.0.js')return r.fulfill({body:'',contentType:'text/javascript'});
  const f=R+p;if(fs.existsSync(f))return r.fulfill({path:f});return r.fulfill({status:404,body:'nf'})});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));const w=ms=>p.waitForTimeout(ms);
await p.goto('http://localhost/');await w(300);
await p.fill('#aE','yaronska22@gmail.com');await p.fill('#aP','coachpass1');await p.click('button:text-is("Entrar")');await w(500);
if(await p.isVisible('text=Ahora no'))await p.click('text=Ahora no');
await p.evaluate(async()=>{const id=await db.createClient('c@t.com',{nombre:'Cli',email:'c@t.com'},'2026-10-01');await db.insert('checkins',{client_id:id,fecha:'2026-10-01',data:{peso:80,r:{}}});await refreshList()});
await p.evaluate(()=>openPend());await w(500);console.log('pend bk:',(await p.textContent('.pendgrid')).includes('Copia de seguridad'));
await p.evaluate(()=>openBiz());await w(800);console.log('panel:',(await p.textContent('.bkpanel')).replace(/\s+/g,' ').slice(0,160));
const [dl]=await Promise.all([p.waitForEvent('download'),p.click('text=⬇️ Descargar copia')]);const fp=await dl.path();const j=JSON.parse(require('fs').readFileSync(fp,'utf8'));console.log('download:',dl.suggestedFilename(),Object.keys(j.tablas),j.tablas.clients.length,j.tablas.checkins.length);
// carpeta simulada (OPFS)
console.log('opfs:',await p.evaluate(async()=>{const d=await navigator.storage.getDirectory();d.queryPermission=async()=>'granted';d.requestPermission=async()=>'granted';BK.dir=d;await bkRun();const names=[];for await(const [n] of d.entries())names.push(n);const f=await d.getDirectoryHandle('fotos');const fn=[];for await(const [n] of f.entries())fn.push(n);return names.join(',')+' | fotos:'+fn.length+' | '+BK.msg}));
await p.screenshot({path:OUT+'/bk1.png'});
console.log('ERR',errs);await b.close()})();
