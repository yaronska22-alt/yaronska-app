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
await p.evaluate(async()=>{const id=await db.createClient('c@t.com',{nombre:'Cli',objetivo:'perder',dias:[1,3,5]},'2026-10-01');await refreshList();await loadClient(id);coachSel=id;
  S.routine=clone(TEMPLATES[0].days);S.hist[S.routine[0].ex[0].n]=[{date:iso(daysAgo(1)),day:S.routine[0].d,sets:[{kg:60,reps:8,i:0},{kg:60,reps:8,i:1},{kg:60,reps:7,i:2}],ts:Date.now()-1000}];save();await flushSync();coachTab='sesiones';renderCoach()});
await w(400);const n=await p.evaluate(()=>S.routine[0].ex[0].n);console.log('ej',n,'series rutina',await p.evaluate(()=>S.routine[0].ex[0].s));
console.log('filas',await p.$$eval('.ptbl tbody tr',a=>a.length));

await p.selectOption('#nst-0-0','top');await p.fill('#nsk-0-0','70');await p.fill('#nsr-0-0','5');
await p.click('text=+ Añadir serie');await w(200);console.log('filas tras añadir',await p.$$eval('.ptbl tbody tr',a=>a.length),'valor conservado',await p.inputValue('#nsk-0-0'),'tipo nueva',await p.$eval('#nst-0-2',e=>e.value));
await p.click('button:text-is("Pautar")');await w(300);
console.log('next',await p.evaluate(n=>JSON.stringify(S.next[n]),n));
await p.click('text=👁️ Ver su próxima semana como el cliente');await w(500);
console.log('banner',(await p.textContent('.prevbar')).replace(/\s+/g,' '));console.log('caja',(await p.textContent('.target').catch(()=>'NO')).replace(/\s+/g,' '));
await p.screenshot({path:OUT+'/prev1.png'});await p.click('#bSaveSes');await w(300);
await p.click('text=Volver al panel');await w(300);console.log('vuelta',await p.evaluate(()=>view+' '+coachTab+' '+PREV_FROM));
console.log('ERR',errs);await b.close()})();