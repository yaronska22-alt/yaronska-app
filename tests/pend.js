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
console.log('pend:',(await p.textContent('.pendgrid')).replace(/\s+/g,' ').slice(0,600));
console.log('badge:',await p.textContent('.pendbtn'));
await p.screenshot({path:OUT+'/p1.png',fullPage:true});
await p.click('.pitem >> nth=0');await w(800);
console.log('rev sheet:',(await p.textContent('#sheet')).replace(/\s+/g,' ').slice(0,300));
await p.fill('#rvT','Muy buena semana, -1 kg. Seguimos igual.');await p.fill('#rvU','https://drive.google.com/x');
await p.screenshot({path:OUT+'/p2.png'});
await p.click('#rvSave');await w(900);
console.log('db rev:',await p.evaluate(()=>JSON.stringify(window.__mock.checkins.find(c=>c.id===900).data.rev)),'notify:',await p.evaluate(()=>JSON.stringify(window.__notify)));
console.log('badge2:',await p.textContent('.pendbtn'),'| boton:',await p.$$eval('.cktbl tr',a=>a.map(r=>r.innerText.slice(0,40).replace(/\s+/g,' '))));
await p.setViewportSize({width:390,height:844});await p.evaluate(()=>{setView('client');go('home');render()});await w(300);
await p.screenshot({path:OUT+'/p3.png'});console.log('card:',(await p.textContent('.revcard')).replace(/\s+/g,' '));
await p.click('text=Entendido 👍');await w(800);console.log('seen:',await p.evaluate(()=>JSON.stringify(window.__mock.checkins.find(c=>c.id===900).data.rev.seen?1:0)));
await p.evaluate(()=>{go('check')});await w(200);console.log('hist:',(await p.textContent('.revlist')).replace(/\s+/g,' '));
console.log('ERR',errs);await b.close()})();
