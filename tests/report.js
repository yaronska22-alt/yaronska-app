const {chromium}=require('playwright');const fs=require('fs');
const R=require('path').resolve(__dirname,'..'),OUT=__dirname,LIB='/tmp/claude-0/-home-claude/683b9a98-d21e-5a0c-98ac-61836d0e415b/scratchpad/libs/';
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1280,height:900},acceptDownloads:true});
await ctx.route('**/*',async r=>{const u=new URL(r.request().url());
  if(/fonts\.g/.test(u.hostname))return r.fulfill({status:200,body:''});
  if(u.hostname==='cdnjs.cloudflare.com'){if(/html2canvas/.test(u.pathname))return r.fulfill({path:LIB+'html2canvas-1.4.1/package/dist/html2canvas.min.js'});if(/jspdf/.test(u.pathname))return r.fulfill({path:LIB+'jspdf-2.5.1/package/dist/jspdf.umd.min.js'})}
  if(u.hostname!=='app.test')return r.abort();
  let p=decodeURIComponent(u.pathname);if(p==='/')p='/index.html';
  if(p==='/js/db.js')return r.fulfill({path:OUT+'/mockdb.js',contentType:'text/javascript'});
  if(p==='/js/supabase-2.117.0.js')return r.fulfill({body:'',contentType:'text/javascript'});
  const f=R+p;if(fs.existsSync(f))return r.fulfill({path:f});return r.fulfill({status:404,body:'nf'})});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});const w=ms=>p.waitForTimeout(ms);
await p.goto('http://app.test/');await w(300);
await p.fill('#aE','yaronska22@gmail.com');await p.fill('#aP','coachpass1');await p.click('button:text-is("Entrar")');await w(500);
if(await p.isVisible('text=Ahora no'))await p.click('text=Ahora no');
await p.evaluate(async()=>{const id=await db.createClient('a@t.com',{nombre:'Ángel Rodríguez',objetivo:'perder',sexo:'Hombre',altura:173,edad:24,dias:[1,3,5]},'2026-08-01');
  const W=[[60,88,40,98],[46,87,40,96],[32,86,39.5,94],[18,85,39.5,92.5],[4,84.3,39,91]];
  for(const [d,kg,cu,ci] of W){const x=new Date();x.setDate(x.getDate()-d);await db.insert('checkins',{client_id:id,fecha:iso(x),data:{peso:kg,cuello:cu,cintura:ci,hs:7,r:{estres:3,sueno:4,cansancio:4,hambre:3,motivacion:5,recup:4,nutricion:4,entreno:5,orina:3},fotosP:d===60||d===4?[id+'/x/frontal-1.jpg',id+'/x/lateral-1.jpg',id+'/x/espalda-1.jpg']:[],fotos:3}})}
  await refreshList();coachSel=id;await loadClient(id);renderCoach()});
await p.click('text=📄 Informe semanal');await w(200);
await p.fill('#rpNotes','El peso empieza a bajar, un entorno más favorable a nivel de estrés nos permite bajar con más tranquilidad. El peso mejora, el porcentaje graso baja y las medidas van mejorando.');
await p.screenshot({path:OUT+'/rp0.png'});
const [dl]=await Promise.all([p.waitForEvent('download',{timeout:60000}),p.click('text=⬇️ Descargar PDF')]);
await dl.saveAs(OUT+'/informe.pdf');console.log('pdf',dl.suggestedFilename());
await p.click('text=📸 Comparativa del físico');await w(200);
const [dl2]=await Promise.all([p.waitForEvent('download',{timeout:60000}),p.click('text=⬇️ Descargar PDF')]);
await dl2.saveAs(OUT+'/comparativa.pdf');console.log('pdf2',dl2.suggestedFilename());
console.log('ERR',errs);await b.close()})();
