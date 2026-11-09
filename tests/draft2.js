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
  S.routine=clone(TEMPLATES[0].days);save();await flushSync();setView('client');go('train');dayIdx=0;render()});
await w(300);
const typeIn=async(id,v)=>{await p.fill('#'+id,v);};
await typeIn('rp-0-0-0','10');await typeIn('rp-0-1-0','12');
await p.click('.daysel button >> nth=1');await w(200);await typeIn('rp-1-0-0','8');
await p.click('.daysel button >> nth=0');await w(200);
console.log('1) volver al día 1:',await p.inputValue('#rp-0-0-0'),await p.inputValue('#rp-0-1-0'),'kg guardado:',await p.evaluate(()=>DRAFT['kg-0-0-0']||'(vacío)'));
await p.evaluate(()=>go('food'));await w(200);await p.evaluate(()=>go('train'));await w(300);
console.log('2) tras cambiar de pestaña, día:',await p.evaluate(()=>dayIdx),'valor',await p.inputValue('#rp-0-0-0'));
await p.click('.daysel button >> nth=1');await w(200);await p.click('#bSaveSes');await w(1300);
await p.evaluate(()=>{closeSheet&&closeSheet();dayIdx=0;render()});await w(200);
console.log('3) tras guardar día 2, día 1 sigue:',await p.inputValue('#rp-0-0-0'),await p.inputValue('#rp-0-1-0'));
// recarga de página (como cerrar la app)
await w(2000);await p.reload();await w(800);await p.evaluate(async()=>{await loadClient(CL[0]?CL[0].id:coachSel);setView('client');go('train');dayIdx=0;render()});await w(400);
console.log('4) tras cerrar y abrir:',await p.inputValue('#rp-0-0-0'),'| en nube:',await p.evaluate(()=>!!(S.profile.draft&&S.profile.draft.v['rp-0-0-0'])));
// borrador de ayer sin guardar -> se guarda solo
await p.evaluate(()=>{const D=draftGet();D._d=iso(daysAgo(1));ME.role='client';draftFinalize();ME.role='coach'});await w(300);
console.log('5) auto-guardado de ayer:',await p.evaluate(()=>JSON.stringify(Object.entries(S.hist).map(([n,a])=>a.map(h=>n+'@'+h.date+':'+h.sets.map(s=>s.kg+'x'+s.reps).join(','))).flat())),'| borrador vacío:',await p.evaluate(()=>drKeys(draftGet()).length===0));
console.log('ERR',errs);await b.close()})();
