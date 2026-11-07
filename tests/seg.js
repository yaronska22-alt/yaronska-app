const {chromium}=require('playwright');const fs=require('fs');
const R=require('path').resolve(__dirname,'..'),OUT=__dirname;
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1300,height:1000}});
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
await p.evaluate(async()=>{const id=await db.createClient('c@t.com',{nombre:'Víctor Luján',objetivo:'perder',dias:[1,3,5],sexo:'Hombre',altura:178,pasosT:10000,diasSemana:3},'2026-09-01');
  const id2=await db.createClient('d@t.com',{nombre:'Dana',objetivo:'perder',dias:[1,3,5]},'2026-10-01');
  await refreshList();await loadClient(id);coachSel=id;S.routine=clone(TEMPLATES[0].days);
  [['2026-09-07',95,102],['2026-11-02',90,94]].forEach(([d,p,c])=>S.checkins.push({date:d,peso:p,cintura:c,r:{},fotos:0,fotosP:[]}));
  for(let i=0;i<10;i++){const k=iso(daysAgo(i));if(i%3)S.daily[k]={steps:8000+i*300,diet:i%2==0,stepsOk:true,train:i%4==0,estres:2,energia:4,animo:4,at:new Date().toISOString()}}
  for(let i=0;i<20;i+=3){const k=iso(daysAgo(i));(S.hist['Press banca']=S.hist['Press banca']||[]).push({date:k,day:'Día 1',sets:[{kg:60,reps:8}]})}
  S.planCalc={source:'calc',fecha:iso(daysAgo(16)),T:{plan:{},ing:[]}};S.planOn=true;
  save();await flushSync();await refreshList();renderCoach()});
await w(600);
console.log('seg:',(await p.textContent('.kpis.segk')).replace(/\s+/g,' '));
console.log('lista:',(await p.$$eval('.citem .wkc',a=>a.map(x=>x.textContent))).join(' | '));
await (await p.$('.panel:has-text("Seguimiento de")')).screenshot({path:OUT+'/seg.png'});
await p.screenshot({path:OUT+'/seg2.png'});
await p.fill('.segr input >> nth=0','2026-10-01');await p.dispatchEvent('.segr input >> nth=0','change');await w(300);console.log('rango:',(await p.textContent('.kpis.segk')).replace(/\s+/g,' ').slice(0,520));console.log('persist',await p.evaluate(async()=>{await flushSync();const c=window.__mock.clients[0];return c.ficha.segFrom}));
console.log('ERR',errs);await b.close()})();
