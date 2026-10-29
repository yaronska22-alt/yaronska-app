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
await p.evaluate(async()=>{const id=await db.createClient('c@t.com',{nombre:'Cli',objetivo:'perder',dias:[1,3,5]},'2026-10-01');await refreshList();await loadClient(id);S.routine=clone(TEMPLATES[0].days);save();await flushSync();coachSel=id;coachTab='ficha';renderCoach()});
// fecha de nacimiento escribiendo
await p.click('#f-nac');await p.keyboard.type('12031994');await p.keyboard.press('Tab');await w(400);
console.log('nac:',await p.evaluate(()=>FICHA.nac),await p.evaluate(()=>document.activeElement.id),await p.evaluate(()=>{renderCoach();return document.querySelector('.kpis').innerText.replace(/\s+/g,' ')}),'| kpi edad:',(await p.textContent('.kpis')).replace(/\s+/g,' ').match(/Edad.{0,40}/)[0]);
await p.evaluate(()=>{coachTab='rutina';renderCoach()});
// ex0: 4 series, top set + back-off
await p.fill('#es-0-0','4');await p.dispatchEvent('#es-0-0','change');await w(100);
await p.click('.ed-ex >> nth=0 >> text=Series ▾');await w(100);
await p.selectOption('.setsed .sed-row:nth-child(2) select','top');await w(100);
await p.fill('.setsed .sed-row:nth-child(2) input >> nth=0','4-6');await p.dispatchEvent('.setsed .sed-row:nth-child(2) input >> nth=0','change');
await p.fill('.setsed .sed-row:nth-child(2) input >> nth=1','RPE 9');await p.dispatchEvent('.setsed .sed-row:nth-child(2) input >> nth=1','change');
for(const n of [3,4,5]){await p.selectOption(`.setsed .sed-row:nth-child(${n}) select`,'backoff');await w(80);await p.fill(`.setsed .sed-row:nth-child(${n}) input >> nth=3`,'-10 % del top set');await p.dispatchEvent(`.setsed .sed-row:nth-child(${n}) input >> nth=3`,'change')}
// superserie ex1+ex2
await p.selectOption('.ed-ex >> nth=1 >> select','A');await w(100);await p.selectOption('.ed-ex >> nth=2 >> select >> nth=0','A');await w(100);
await p.screenshot({path:OUT+'/r1.png',fullPage:true});
console.log('ex0:',JSON.stringify(await p.evaluate(()=>S.routine[0].ex[0].sets)).slice(0,300));
console.log('blk:',await p.evaluate(()=>S.routine[0].ex.slice(0,4).map(e=>(e.blk||'-')+'/'+(e.blkT||'')).join(' ')));
await p.selectOption('.blkbar select','biserie');await w(100);
await w(700);const st=await p.evaluate(()=>window.__mock);console.log('db rutina ex1 blkT:',st.clients[0].rutina[0].ex[1].blkT);
// vista cliente en móvil
await p.setViewportSize({width:390,height:844});await p.evaluate(()=>{setView('client');go('train')});await w(200);
await p.screenshot({path:OUT+'/r2.png',fullPage:true});
console.log('client blk header:',await p.textContent('.blk-h'));
console.log('labels:',await p.evaluate(()=>[...document.querySelectorAll('.ex-n')].slice(0,5).map(x=>x.textContent).join(',')));
// el cliente registra el entreno del día 1
await p.fill('#kg-0-0-0','100');await p.fill('#rp-0-0-0','5');await p.fill('#ri-0-0-0','1');
await p.fill('#kg-0-0-2','90');await p.fill('#rp-0-0-2','8');
await p.click('text=Guardar entreno');await w(800);
await p.setViewportSize({width:1200,height:900});await p.evaluate(()=>{setView('coach');coachTab='sesiones';renderCoach()});await w(200);
console.log('ses tipos:',await p.evaluate(()=>[...document.querySelectorAll('.cmain table')[0].querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ')).join(' | ')));
await p.fill('#nsk-0-0','102,5');await p.fill('#nsr-0-0','5');await p.fill('#nsk-0-1','92,5');await p.fill('#nn-0','Sube el top set');
await p.click('button:text-is("Pautar") >> nth=0');await w(800);
await p.screenshot({path:OUT+'/s1.png',fullPage:true});
console.log('pauta:',JSON.stringify(await p.evaluate(()=>S.next['Press máquina placas'])));
await p.setViewportSize({width:390,height:844});await p.evaluate(()=>{setView('client');go('train')});await w(200);
console.log('cliente ve:',(await p.textContent('.ex .target')).replace(/\s+/g,' '),'| placeholder s1:',await p.getAttribute('#kg-0-0-0','placeholder'));
await p.screenshot({path:OUT+'/s2.png'});
console.log('ERR',errs);await b.close()})();
