const {chromium}=require('playwright');const fs=require('fs');
const R=require('path').resolve(__dirname,'..'),OUT=__dirname;
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1100,height:900}});
await ctx.route('**/*',async r=>{const u=new URL(r.request().url());
  if(u.hostname!=='app.test')return r.abort();
  let p=decodeURIComponent(u.pathname);
  if(p==='/harness.html')return r.fulfill({contentType:'text/html',body:`<!doctype html><body style="margin:0"><iframe id="f" src="/calc/index.html?embed=1" style="width:100%;height:880px;border:0"></iframe><script>
  window.msgs=[];addEventListener('message',e=>{msgs.push(e.data);if(e.data.type==='ready'){document.getElementById('f').contentWindow.postMessage({ys:true,type:'load',client:{id:'x1',name:'José Prueba',desc:'',createdAt:new Date().toISOString(),data:{sex:'male',age:32,height:178,weight:82,activity:1.55,trainingDays:4,steps:8000,metabolism:1,meals:4,goal:-0.15,dietType:'standard',proteinPerKg:1.8},notes:'',history:[],mealPlan:null,measurements:[]},customFoods:[]},location.origin)}});</script>`});
  const f=R+p;if(fs.existsSync(f))return r.fulfill({path:f});return r.fulfill({status:404,body:'nf'})});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>{errs.push('DIALOG: '+d.message().slice(0,120));d.dismiss()});
await p.goto('http://app.test/harness.html');await p.waitForTimeout(2500);
const f=p.frame({url:/calc/});
console.log('msgs',JSON.stringify(await p.evaluate(()=>msgs.map(m=>m.type))));
await p.screenshot({path:OUT+'/c1.png'});
console.log('client name in calc:',await f.textContent('#currentClientName'));
// cargar plantilla Yaronska en protocolo
const btns=await f.$$eval('#tab-protocol button',bs=>bs.map(b=>b.textContent.trim()).slice(0,20));console.log('protocol buttons:',btns);
const ex=await f.evaluate(()=>ysExportForApp());
console.log('export keys',Object.keys(ex),'R?',!!ex.R,JSON.stringify(ex.T.plan).slice(0,600));
console.log('ing0',JSON.stringify(ex.T.ing[0]).slice(0,300));console.log('ingR0',ex.R&&JSON.stringify(ex.R.ing[0]).slice(0,200));
console.log('mid',JSON.stringify(ex.T.plan.midmorning).slice(0,300));
await f.click('text=🛒 Lista de la compra (todas las opciones)');await p.waitForTimeout(600);await p.screenshot({path:OUT+'/c2.png'});
await f.evaluate(()=>closeModal&&document.querySelectorAll('.modal-bg.active').forEach(m=>m.classList.remove('active')));
await f.click('text=🍱 Meal prep');await p.waitForTimeout(600);await p.screenshot({path:OUT+'/c3.png'});
console.log('ERR',errs);await b.close()})();
