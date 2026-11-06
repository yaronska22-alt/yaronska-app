const {chromium}=require('playwright');const fs=require('fs');
const R=require('path').resolve(__dirname,'..'),OUT=__dirname;
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:430,height:900}});
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
await p.evaluate(async()=>{const id=await db.createClient('c@t.com',{nombre:'Cli',objetivo:'perder',dias:[1,3,5]},'2026-10-01');await refreshList();await loadClient(id);coachSel=id;
  S.routine=clone(TEMPLATES[0].days);const d=S.routine[0];const dd=iso(new Date());// hoy (viernes) mismo semana
  S.hist[d.ex[0].n]=[{date:dd,day:d.d,sets:[{kg:60,reps:8,i:0}],ts:Date.now()-1000}];save();await flushSync();setView('client');go('train');trainTab='rutina';dayIdx=0;render()});
await w(500);
const cnt=()=>p.evaluate(()=>{const T=wkTrain();return T.done+'/'+T.target});
console.log('antes',await cnt());
console.log('banner:',(await p.textContent('.donebar')).replace(/\s+/g,' ').slice(0,200));
console.log('select:',await p.$eval('#sesD',e=>e.options[e.selectedIndex].text),'| boton:',await p.textContent('#bSaveSes'));
await p.fill('#rp-0-1-0','10');await p.click('#bSaveSes');await w(1200);
console.log('después',await cnt(),'| toast:',await p.evaluate(()=>document.querySelector('.toast')?.textContent||''));
console.log('hist ej1',await p.evaluate(()=>JSON.stringify(S.hist[S.routine[0].ex[1].n])));
// corregir ej0 mismo día: reemplaza, no duplica
await p.fill('#rp-0-0-0','9');await p.click('#bSaveSes');await w(1200);
console.log('ej0 entradas',await p.evaluate(()=>S.hist[S.routine[0].ex[0].n].length),'reps',await p.evaluate(()=>S.hist[S.routine[0].ex[0].n][0].sets.map(x=>x.reps).join()),'cuenta',await cnt());
// entreno nuevo eligiendo otro día
await p.selectOption('#sesD',{index:1});console.log('boton nuevo:',await p.textContent('#bSaveSes'));
await p.fill('#rp-0-0-0','8');await p.click('#bSaveSes');await w(1200);console.log('tras nuevo',await cnt());
console.log('ERR',errs);await b.close()})();
