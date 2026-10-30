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
await p.evaluate(async()=>{const st=window.__mock;st.form_responses=[{id:1,created_at:new Date().toISOString(),submitted_at:'2026-10-29T10:00:00Z',response_id:'r1',email:'laura@t.com',nombre:'Laura Gómez',client_id:null,imported_at:null,answers:[
 {s:'SECCIÓN 1 - Datos Básicos',q:'1. Nombre y Apellidos',a:'Laura Gómez'},{s:'SECCIÓN 1 - Datos Básicos',q:'2. Edad',a:'34 años'},{s:'SECCIÓN 1 - Datos Básicos',q:'3. Sexo y Peso',a:'Mujer, 72,5 kg'},{s:'SECCIÓN 1 - Datos Básicos',q:'4. Altura',a:'1,65'},
 {s:'SECCIÓN 1 - Datos Básicos',q:'5. Teléfono',a:'600111222'},{s:'SECCIÓN 1 - Datos Básicos',q:'6. Correo Electrónico',a:'laura@t.com'},
 {s:'Sección 3 - Salud',q:'1. ¿Tienes alguna patología diagnosticada actual o crónica?',a:'Hipotiroidismo'},{s:'Sección 3 - Salud',q:'2. ¿Tomas mediación actualmente? ¿Cuál y para qué?',a:'Eutirox 50'},
 {s:'Sección 3 - Salud',q:'4. ¿Tienes alergias o intolerancias alimentarias?',a:'Lactosa'},{s:'Sección 3 - Salud',q:'5. ¿Te has hecho analíticas en los últimos 12 meses? Si sí, algún valor alterado?',a:'Ferritina baja'},
 {s:'Sección 6',q:'5. Alimentos que te gustan (escribe todos los que quieras, sin filtro)',a:'Arroz, pollo, fresas'},{s:'Sección 6',q:'6. Alimentos que NO te gustan / no quieres comer',a:'Brócoli'},
 {s:'Sección 8',q:'1. ¿Cuántos días por semana puedes entrenar de forma realista?',a:'4'},{s:'Sección 8',q:'2. ¿Qué días de la semana tienes más disponibilidad?',a:'Lunes, Miércoles, Viernes, Sábado'},
 {s:'Sección 9',q:'1. ¿Cuál es tu objetivo principal?',a:'Perder Grasa'},{s:'Sección 9',q:'2. ¿Tienes una meta específica en mente?',a:'Perder 8 kg'},{s:'Sección 9',q:'3. ¿En cuánto tiempo te gustaría lograrlo, siendo realista?',a:'5 meses'}]}];localStorage.setItem('mockdb',JSON.stringify(st));await openPend()});
await w(500);console.log('pend:',(await p.textContent('.pendgrid')).replace(/\s+/g,' ').slice(0,200));
await p.click('text=Aún no es cliente · darle de alta →');await w(300);console.log('invite:',await p.inputValue('#nN'),await p.inputValue('#nE'),await p.inputValue('#nT'));
await p.click('button:text("Dar de alta")');await w(1200);if(await p.isVisible('text=Cerrar'))await p.click('.sheet >> text=Cerrar');
await p.evaluate(()=>{coachTab='ficha';renderCoach()});await w(300);
console.log('panel:',(await p.textContent('.cqsec')).replace(/\s+/g,' ').slice(0,120));
await p.click('text=⇩ Pasar datos a la Ficha');await w(600);
console.log('ficha:',await p.evaluate(()=>JSON.stringify({n:FICHA.nombre,ed:FICHA.edad,sx:FICHA.sexo,al:FICHA.altura,tel:FICHA.tel,pat:FICHA.patologias,med:FICHA.medicacion,ale:FICHA.alergias,pr:FICHA.prefs,ev:FICHA.evitar,ds:FICHA.diasSemana,dias:FICHA.dias,obj:FICHA.objLargo,w:allWeights()})));
await p.screenshot({path:OUT+'/f1.png'});
console.log('imported:',await p.evaluate(()=>window.__mock.form_responses[0].imported_at?1:0),'client:',await p.evaluate(()=>window.__mock.form_responses[0].client_id));
console.log('ERR',errs);await b.close()})();
