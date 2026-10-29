const {chromium}=require('playwright');const fs=require('fs');
const R=require('path').resolve(__dirname,'..'),OUT=__dirname;
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1440,height:900}});
await ctx.route('**/*',async r=>{const u=new URL(r.request().url());
  if(/fonts\.g/.test(u.hostname))return r.fulfill({status:200,body:''});if(u.hostname!=='app.test')return r.abort();
  let p=decodeURIComponent(u.pathname);if(p==='/')p='/index.html';
  if(p==='/js/db.js')return r.fulfill({path:OUT+'/mockdb.js',contentType:'text/javascript'});
  if(p==='/js/supabase-2.117.0.js')return r.fulfill({body:'',contentType:'text/javascript'});
  const f=R+p;if(fs.existsSync(f))return r.fulfill({path:f});return r.fulfill({status:404,body:'nf'})});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));const w=ms=>p.waitForTimeout(ms);
await p.goto('http://app.test/');await w(300);
await p.fill('#aE','yaronska22@gmail.com');await p.fill('#aP','coachpass1');await p.click('button:text-is("Entrar")');await w(500);
if(await p.isVisible('button:text-is("Ahora no")'))await p.click('button:text-is("Ahora no")');
await p.evaluate(async()=>{const id=await db.createClient('a@t.com',{nombre:'Ana López',objetivo:'perder',sexo:'Mujer',altura:165,edad:30,dias:[1,3,5],pasosT:8000,pasosR:10000},'2026-08-01');
  for(const [d,kg] of [[40,70],[30,69.2],[20,68.8],[10,68.1],[3,67.6]]){const x=new Date();x.setDate(x.getDate()-d);await db.insert('checkins',{client_id:id,fecha:iso(x),data:{peso:kg,r:{}}})}
  await refreshList();coachSel=id;await loadClient(id);S.routine=clone(TEMPLATES[0].days);S.planOn=true;save();renderCoach()});
await p.screenshot({path:OUT+'/desk0.png'});
await p.click('#vClient');await w(300);await p.screenshot({path:OUT+'/desk1.png'});
console.log('mobBtn visible:',await p.isVisible('#mobBtn'));
await p.click('#mobBtn');await w(300);await p.screenshot({path:OUT+'/desk2.png'});
await p.click('#mobBtn');await p.evaluate(()=>go('train'));await w(200);await p.screenshot({path:OUT+'/desk3.png'});
await p.click('#vCoach');await w(200);console.log('mobBtn en coach:',await p.isVisible('#mobBtn'));
console.log('ERR',errs);await b.close()})();
