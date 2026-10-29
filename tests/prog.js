const {chromium}=require('playwright');const fs=require('fs');
const R=require('path').resolve(__dirname,'..'),OUT=__dirname;
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1280,height:900}});
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
await p.evaluate(async()=>{const id=await db.createClient('a@t.com',{nombre:'Ana',objetivo:'perder',dias:[1,3,5]},'2026-10-01');
  const W=[[60,82],[53,81.5],[46,81],[39,80.2],[32,79.9],[25,79.4],[18,79],[11,78.6],[4,78.1]];
  for(const [d,kg] of W){const x=new Date();x.setDate(x.getDate()-d);await db.insert('checkins',{client_id:id,fecha:iso(x),data:{peso:kg,r:{}}})}
  await refreshList();coachSel=id;await loadClient(id);S.routine=clone(TEMPLATES[0].days);save();renderCoach()});
// programa músculo, fase 2
await p.selectOption('#prS','musculo');await w(200);await p.selectOption('#phS','1');await w(200);
console.log('cabecera:',await p.textContent('.chead .lbl'),'| lista:',(await p.textContent('.citem small')));
// rango de peso
await p.click('.tabs >> text=Peso');await w(100);
const d25=await p.evaluate(()=>{const x=new Date();x.setDate(x.getDate()-25);return iso(x)});
await p.fill('#wF',d25);await p.dispatchEvent('#wF','change');await w(200);await p.click('text=📌 Que vea solo este rango');await w(200);
console.log('pin:',(await p.textContent('.pinbar')).replace(/\s+/g,' '));
// rutina: calentamiento + aproximación
await p.click('.tabs >> text=Rutina');await w(100);
await p.fill('.warmed textarea >> nth=0','5 min bici + movilidad');await p.dispatchEvent('.warmed textarea >> nth=0','change');
await p.fill('.warmed input >> nth=0','https://youtu.be/abc');await p.dispatchEvent('.warmed input >> nth=0','change');
await p.fill('#ea-0-0','1×10 al 40 % · 1×5 al 60 %');await p.dispatchEvent('#ea-0-0','change');await w(800);
await p.screenshot({path:OUT+'/p0.png',fullPage:true});
// cliente
await p.setViewportSize({width:390,height:844});await p.evaluate(()=>{setView('client');go('home')});await w(200);
console.log('home:',(await p.textContent('.wstats')).replace(/\s+/g,' '),'|',(await p.textContent('.phase')).replace(/\s+/g,' '),'| saludo:',await p.textContent('.hello .lbl'));
await p.evaluate(()=>go('train'));await w(100);console.log('warm:',(await p.textContent('.warm')).replace(/\s+/g,' '),'| aprox:',await p.textContent('.aprox'));
await p.screenshot({path:OUT+'/p1.png'});
await p.evaluate(()=>go('res'));await w(100);console.log('res:',(await p.textContent('#screen')).replace(/\s+/g,' ').slice(-330));
await p.screenshot({path:OUT+'/p2.png',fullPage:true});
await p.evaluate(()=>{FICHA.programa='libre';S.phase=2;go('res')});console.log('libre:',(await p.textContent('#screen')).replace(/\s+/g,' ').slice(-260));
console.log('ERR',errs);await b.close()})();
