const {chromium}=require('playwright');const fs=require('fs');
const R=require('path').resolve(__dirname,'..'),OUT=__dirname;
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1280,height:900}});
await ctx.route('**/*',async r=>{const u=new URL(r.request().url());
  if(/fonts\.g/.test(u.hostname))return r.fulfill({status:200,body:''});if(u.hostname!=='app.test')return r.abort();
  let p=decodeURIComponent(u.pathname);if(p==='/')p='/index.html';
  if(p==='/js/db.js')return r.fulfill({path:OUT+'/mockdb.js',contentType:'text/javascript'});
  if(p==='/js/supabase-2.117.0.js')return r.fulfill({body:'',contentType:'text/javascript'});
  if(p.endsWith('/'))p+='index.html';
  const f=R+p;if(fs.existsSync(f))return r.fulfill({path:f});return r.fulfill({status:404,body:'nf'})});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>{d.accept()});const w=ms=>p.waitForTimeout(ms);
await p.goto('http://app.test/');await w(300);
await p.fill('#aE','yaronska22@gmail.com');await p.fill('#aP','coachpass1');await p.click('button:text-is("Entrar")');await w(500);
if(await p.isVisible('text=Ahora no'))await p.click('text=Ahora no');
const id=await p.evaluate(async()=>{const a=await db.createClient('a@t.com',{nombre:'Ana López',objetivo:'perder',sexo:'Mujer',nac:'1990-05-01',altura:165,dias:[1,3,5]},'2026-10-01');await refreshList();await loadClient(a);coachSel=a;renderCoach();return a});
await p.click('.tabs >> text=Dieta');await w(3000);
const f=p.frame({url:/calc/});
await f.click('text=⚡ Cargar plantilla Yaronska');await w(1500);
await p.click('text=📲 Enviar plan a la app');await w(1200);
console.log('tras 1º:',(await p.textContent('#dlBox')).replace(/\s+/g,' ').slice(0,200));
// tocar cantidades en el protocolo
const info=await f.evaluate(()=>{const c=getCurrent();const P=c.protocol;const out=[];
  const a=P.lunch.carb.options[1].alts[0];out.push(JSON.stringify(a).slice(0,150));
  for(const k in a){if(typeof a[k]==='number'&&/g|qty|amount/i.test(k)){a[k]=Math.round(a[k]*1.25);out.push(k)}}
  const d=P.dinner.protein.options[0].alts[0];for(const k in d){if(typeof d[k]==='number'&&/g|qty|amount/i.test(k)){d[k]=Math.round(d[k]*0.8)}}
  P.lunch.fat.options.pop();persist();return out});
console.log('mod',info);
await p.fill('#dlNota','Estancada 2 semanas: subo hidratos comida, bajo proteína cena');
await p.click('text=📲 Enviar plan a la app');await w(1500);
console.log('tras 2º:',(await p.textContent('#dlBox')).replace(/\s+/g,' ').slice(0,900));
await p.locator('#dlPanel').scrollIntoViewIfNeeded();await p.locator('#dlPanel').screenshot({path:OUT+'/dl1.png'});
await p.click('#dlPanel >> button.chip:text-is("Cena")');await w(200);
console.log('filtro cena:',(await p.textContent('#dlBox')).replace(/\s+/g,' ').slice(0,400));
// cliente no puede leer diet_log
console.log('ERR',errs);await b.close()})();
