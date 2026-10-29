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
  // historial: varias semanas
  const add=(n,date,c)=>{(S.hist[n]=S.hist[n]||[]).push({date,day:'',sets:Array.from({length:c},()=>({kg:40,reps:10,rir:2})),ts:Date.now()})};
  const d0=new Date();for(let w=0;w<6;w++){S.routine.forEach((d,di)=>d.ex.forEach((e,ei)=>{if((ei+w)%4)return;const dt=new Date(d0);dt.setDate(dt.getDate()-7*w-((d0.getDay()+6)%7)+di*2);if(dt>d0)return;add(e.n,iso(dt),e.s-(w%2))}))}
  save();await flushSync();coachSel=id;coachTab='rutina';renderCoach()});
console.log('plan:',await p.evaluate(()=>JSON.stringify(volPlan())));
await p.selectOption('#em-0-0','Glúteo');await w(200);
console.log('after m:',await p.evaluate(()=>S.routine[0].ex[0].m+' '+JSON.stringify(volPlan().per)));
await p.screenshot({path:OUT+'/v1.png',fullPage:true});
await p.evaluate(()=>{coachTab='ejercicios';renderCoach()});await w(200);
await p.screenshot({path:OUT+'/v2.png',fullPage:true});
await p.click('.volnav .mini >> nth=0');await w(100);console.log('nav:',await p.textContent('.volnav'));
await p.click('.mtabs .chip >> nth=1');await w(100);
await p.setViewportSize({width:390,height:844});await p.evaluate(()=>{volWk=0;volMus='';setView('client');go('train');trainTab='volumen';render()});await w(200);
await p.screenshot({path:OUT+'/v3.png',fullPage:true});
console.log('guess:',await p.evaluate(()=>['Hip thrust con barra','Curl femoral tumbado','Curl bíceps barra','Press militar','Remo con barra','Sentadilla','Elevación de piernas colgado','Elevaciones laterales','Press francés','Peso muerto rumano','Fondos'].map(n=>n+'='+musGuess(n)).join(' | ')));
console.log('ERR',errs);await b.close()})();
