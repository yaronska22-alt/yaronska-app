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
  for(const [n,e] of [['Ana López','ana@t.com'],['Bea Ruiz','bea@t.com'],['Carlos','c@t.com']]){await db.createClient(e,{nombre:n,email:e,objetivo:'perder',dias:[1,3,5]},'2026-10-01');}
  const st=window.__mock;st.clients.forEach(c=>c.user_id='u-'+c.id);
  st.checkins.push({id:900,client_id:st.clients[0].id,fecha:iso(daysAgo(1)),data:{peso:70,r:{}}});
  st.checkins.push({id:901,client_id:st.clients[1].id,fecha:iso(daysAgo(2)),data:{peso:71,r:{},rev:{at:new Date().toISOString(),txt:'ok'}}});
  st.workout_logs.push({id:902,client_id:st.clients[1].id,fecha:iso(daysAgo(2)),dia:'Día 1',ejercicio:'Press banca',sets:[{kg:40,reps:8}],created_at:new Date().toISOString()});
  localStorage.setItem('mockdb',JSON.stringify(st));await refreshList();await selectClient(st.clients[0].id)});
await w(500);
const items=()=>p.$$eval('.clist .citem:not(.biz)',a=>a.map(x=>x.innerText.replace(/\s+/g,' ')));console.log(await items());console.log('lbl',await p.textContent('.clist .lbl'));
// Bea: pautar desde el lunes
await p.evaluate(async()=>{await selectClient(window.__mock.clients[1].id);coachTab='sesiones';renderCoach()});await w(400);
console.log('modo',await p.textContent('.pmode'));
await p.fill('#nk-0','45');await p.fill('#nr-0','8');await p.click('button:text-is("Pautar")');await w(500);
console.log('next',await p.evaluate(()=>JSON.stringify(S.next)),'| items',(await items()).join(' || '));
await p.evaluate(async()=>{await flushSync()});console.log('admin pautado',await p.evaluate(()=>window.__mock.client_admin.find(a=>a.client_id===window.__mock.clients[1].id).pautado_at));
console.log('nxOf cliente',await p.evaluate(()=>{view='client';const r=nxOf('Press banca');view='coach';return r?'visible':'oculto'}));
console.log('ERR',errs);await b.close()})();
