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
await p.evaluate(async()=>{const id=await db.createClient('c@t.com',{nombre:'Cli',objetivo:'perder',dias:[1,3,5],diasSemana:3},'2026-10-01');await refreshList();await loadClient(id);S.routine=clone(TEMPLATES[0].days);
  const n=S.routine[0].ex[0].n;S.hist[n]=[{date:iso(daysAgo(7)),day:S.routine[0].d,sets:[{kg:60,reps:8}],ts:1}];
  for(let i=1;i<=6;i++)S.daily[iso(daysAgo(i))]={diet:true,stepsOk:true,steps:9000};
  for(let w=1;w<=3;w++)for(let d=0;d<3;d++){const dt=volWeek(-w).a;const x=new Date(dt+'T12:00');x.setDate(x.getDate()+d*2);(S.hist['Hist '+d]=S.hist['Hist '+d]||[]).push({date:iso(x),day:S.routine[d].d,sets:[{kg:10,reps:10}],ts:1})}
  save();await flushSync();setView('client');go('home');render()});
await p.setViewportSize({width:390,height:844});await w(200);
console.log('streak:',(await p.textContent('.streaks')).replace(/\s+/g,' '));
await p.evaluate(()=>{go('train');trainTab='rutina';dayIdx=0;render()});await w(200);
await p.fill('#kg-0-0-0','65');await p.fill('#rp-0-0-0','8');await p.click('text=Guardar entreno');await w(400);
console.log('sheet:',(await p.textContent('#sheet')).replace(/\s+/g,' '));await p.screenshot({path:OUT+'/pr1.png'});
await p.click('#sheet button:text-is("Genial")');await p.evaluate(()=>{go('home')});await w(200);await p.screenshot({path:OUT+'/pr2.png'});
console.log('ERR',errs);await b.close()})();
