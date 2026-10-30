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
await p.evaluate(async()=>{
  for(const [n,e] of [['Ana López','ana@t.com'],['Bea Ruiz','bea@t.com']]){const id=await db.createClient(e,{nombre:n,email:e,objetivo:'perder',dias:[1,3,5]},'2026-10-01');}
  await refreshList();
  const st=window.__mock;st.clients[0].user_id='u-x';st.clients[0].last_seen=new Date(Date.now()-5*864e5).toISOString();
  st.checkins.push({id:900,client_id:st.clients[0].id,fecha:iso(daysAgo(1)),data:{peso:70,cintura:80,r:{},nota:'Buena semana'},created_at:new Date().toISOString()});
  st.checkins.push({id:901,client_id:st.clients[0].id,fecha:iso(daysAgo(8)),data:{peso:71,cintura:81,r:{}},created_at:new Date().toISOString()});
  st.workout_logs.push({id:902,client_id:st.clients[0].id,fecha:iso(daysAgo(2)),dia:'Día 1',ejercicio:'Press banca',sets:[{kg:40,reps:8}],nota:'Molestia en el hombro',created_at:new Date().toISOString()});
  localStorage.setItem('mockdb',JSON.stringify(st));
  await openPend()});
await w(400);
await w(400);
const t=()=>p.$$eval('.pendbox',a=>a.slice(0,2).map(x=>x.innerText.replace(/\s+/g,' ').slice(0,160)));
console.log('antes',await t());await p.screenshot({path:OUT+'/ps1.png'});
await p.click('text=Dejar solo la última');await w(500);console.log('solo última',await t());
await p.click('.pendbox >> nth=1 >> .pskip');await w(500);console.log('nota quitada',await t(),'badge',await p.textContent('.pendbtn'));
console.log('rev intacta:',await p.evaluate(()=>JSON.stringify(window.__mock.checkins.map(c=>c.data.rev||null))),'notify',await p.evaluate(()=>JSON.stringify(window.__notify||null)));
await p.evaluate(()=>openPend());await w(400);console.log('recarga',await t());
await p.screenshot({path:OUT+'/ps2.png'});console.log('ERR',errs);await b.close()})();
