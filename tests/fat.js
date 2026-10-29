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
await p.evaluate(async()=>{const id=await db.createClient('a@t.com',{nombre:'Ana',objetivo:'perder',sexo:'Hombre',altura:178,nac:'1994-03-01',dias:[1,3,5]},'2026-10-01');
  const W=[[60,85,40,95],[46,84,40,93],[32,83,39.5,91],[18,82,39.5,89.5],[4,81,39,88]];
  for(const [d,kg,cu,ci] of W){const x=new Date();x.setDate(x.getDate()-d);await db.insert('checkins',{client_id:id,fecha:iso(x),data:{peso:kg,cuello:cu,cintura:ci,r:{}}})}
  const tpl=clone(TEMPLATES[0].days);tpl[0].ex.unshift({n:'Dominadas',m:'Espalda',s:2,r:'6-8',rir:'RIR 2',rest:'2 min',v:''},{n:'Press banca',m:'Pecho',s:2,r:'6-8',rir:'RIR 2',rest:'2 min',v:''},{n:'Plancha',m:'Abdomen',s:2,r:'45 s',rir:'',rest:'1 min',v:''});
  for(const [n,sets] of [['Dominadas',[{kg:10,reps:8}]],['Press banca',[{kg:90,reps:6}]],['Press máquina placas',[{kg:80,reps:10}]],['Jalón al pecho',[{kg:70,reps:10}]],['Curl bíceps',[{kg:30,reps:10}]],['Extensión cuádriceps',[{kg:60,reps:12}]],['Plancha',[{kg:0,reps:60}]],['Prensa de discos',[{kg:200,reps:10}]]]){const x=new Date();x.setDate(x.getDate()-3);await db.insert('workout_logs',{client_id:id,fecha:iso(x),dia:'Día 1',ejercicio:n,sets})}
  await refreshList();coachSel=id;await loadClient(id);S.routine=tpl;save();renderCoach()});
await p.click('.tabs >> text=Peso');await w(200);
await p.screenshot({path:OUT+'/fat0.png',fullPage:true});console.log('legend:',await p.textContent('.legend'));
await p.click('text=Peso y % graso');await w(300);
await p.click('.tabs >> text=Ejercicios');await w(200);await p.screenshot({path:OUT+'/rk0.png',fullPage:true});
console.log('rangos coach:',(await p.textContent('.rklist')).replace(/\s+/g,' ').slice(0,400));
await p.setViewportSize({width:390,height:844});await p.evaluate(()=>{setView('client');go('home')});await w(200);
await p.screenshot({path:OUT+'/fat1.png',fullPage:true});
await p.evaluate(()=>{go('train')});await p.click('text=🏅 Mis rangos');await w(200);await p.screenshot({path:OUT+'/rk1.png',fullPage:true});
console.log('ERR',errs);await b.close()})();
