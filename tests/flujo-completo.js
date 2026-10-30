const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const R=require('path').resolve(__dirname,'..'),OUT=__dirname;
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1200,height:900}});
await ctx.route('**/*',async r=>{const u=new URL(r.request().url());
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com')return r.fulfill({status:200,body:''});
  if(u.hostname!=='app.test')return r.abort();
  let p=decodeURIComponent(u.pathname);if(p==='/')p='/index.html';
  if(p==='/js/db.js')return r.fulfill({path:OUT+'/mockdb.js',contentType:'text/javascript'});
  if(p==='/js/supabase-2.117.0.js')return r.fulfill({body:'',contentType:'text/javascript'});
  const f=R+p;if(fs.existsSync(f))return r.fulfill({path:f});return r.fulfill({status:404,body:'nf'})});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text())});
const shot=n=>p.screenshot({path:OUT+'/'+n+'.png'});const wait=ms=>p.waitForTimeout(ms);
const log=(...a)=>console.log(...a);
const noPk=async()=>{if(await p.isVisible('#cOk')){await p.check('#cOk');await p.click('text=Aceptar y entrar');await p.waitForTimeout(1200)}if(await p.isVisible('button:text-is("Ahora no")'))await p.click('button:text-is("Ahora no")')};
await p.goto('http://app.test/');await wait(500);
log('1 login visible:',await p.isVisible('#aE'));await shot('t1-login');
await p.fill('#aE','yaronska22@gmail.com');await p.fill('#aP','mal');await p.click('button:text-is("Entrar")');await wait(300);
log('1b msg:',await p.textContent('.auth-msg'));
await p.fill('#aE','yaronska22@gmail.com');await p.fill('#aP','coachpass1');await p.click('button:text-is("Entrar")');await wait(500);await noPk();
log('2 coach empty:',(await p.textContent('.cmain')).slice(0,80));await shot('t2-coach-empty');
await p.click('text=+ Nuevo cliente');await p.fill('#nN','José Martínez');await p.fill('#nE','Jose@Test.com');await p.fill('#nT','+34 611 22 33 44');await p.click('text=Dar de alta');await wait(600);
log('3 invite:',(await p.textContent('.sheet .note')).slice(0,120));await shot('t3-invite');
await p.click('.sheet >> text=Cerrar');
// ficha: pago, tipo, pasos, dias
await p.fill('#f-pago','180');await p.dispatchEvent('#f-pago','change');await p.selectOption('#f-tipo','quarterly');await wait(100);
await p.fill('#f-pasosT','8000');await p.dispatchEvent('#f-pasosT','change');await p.fill('#f-pasosR','10000');await p.dispatchEvent('#f-pasosR','change');
for(const d of ["Lun","Mié","Vie"]){await p.click(`.cmain .chip:text-is("${d}")`);await wait(100)}
await p.fill('#f-alergias','Frutos secos');await p.dispatchEvent('#f-alergias','change');log('  FICHA.alergias now',await p.evaluate(()=>FICHA.alergias),await p.evaluate(()=>J(clientRow()).includes('Frutos')));
await wait(900);
let st=await p.evaluate(()=>window.__mock);
const c=st.clients[0];log('4 db ficha has pago?',('pago' in c.ficha),'alergias',c.ficha.alergias,'dias',JSON.stringify(c.ficha.dias),'admin',JSON.stringify(st.client_admin[0]));
// rutina + plan
await p.click('.tabs >> text=Rutina');await p.click('.tplc >> nth=0');await wait(200);
await p.evaluate(()=>{S.kcal=2000;S.planOn=true;save()});await wait(900);
st=await p.evaluate(()=>window.__mock);log('5 rutina dias',st.clients[0].rutina.length,'plan',JSON.stringify(st.clients[0].plan),'kcal',st.clients[0].kcal);
await shot('t5-coach');
// salir y registrar cliente
await p.click('#outBtn');await wait(300);
await p.click('text=Es mi primera vez: crear mi cuenta');console.log('casilla registro:',await p.isVisible('#aOk'));await p.check('#aOk');await p.fill('#aE','otro@test.com');await p.fill('#aP','clave1234');await p.fill('#aP2','clave1234');await p.click('button:text("Crear mi cuenta")');await wait(300);
log('6 no invitado:',await p.textContent('.auth-msg'));
await p.fill('#aE','jose@test.com');await p.fill('#aP','clave1234');await p.fill('#aP2','clave1234');await p.check('#aOk');await p.click('button:text("Crear mi cuenta")');await wait(300);
log('7 registro:',await p.textContent('.auth-msg'));
await p.fill('#aE','jose@test.com');await p.fill('#aP','clave1234');await p.click('button:text-is("Entrar")');await wait(600);await noPk();
await p.setViewportSize({width:420,height:900});
log('8 hola:',await p.textContent('.hello h1'),'| seg hidden',await p.isHidden('.seg'),'| pasos:',await p.textContent('label[for=dSteps]'));await shot('t8-client-home');
await p.fill('#dSteps','9000');await p.click('text=Dieta');await p.click('text=OK, guardar mi día');await wait(800);
await p.click('.nav >> text=Comidas');await shot('t9-food');log('9 food has opts:',await p.isVisible('.opts'));
await p.click('.nav >> text=Entreno');
await p.fill('#kg-0-0-0','40');await p.fill('#rp-0-0-0','10');await p.fill('#ri-0-0-0','2');await p.click('text=Guardar entreno');await p.waitForTimeout(250);if(await p.isVisible('#sheet button:text-is("Genial")'))await p.click('#sheet button:text-is("Genial")');await wait(800);
await p.click('.nav >> text=Check-in');await p.fill('#m-peso','82,4');await p.fill('#m-cintura','90');
await p.setInputFiles('.ph >> nth=0 >> input',R+'/img/recetas/0.jpg');await p.fill('#ckNota','Buena semana');await p.click('text=Enviar check-in');await wait(1200);
await shot('t10-after-check');
await p.click('.me');await p.fill('#pn','José Martínez López');await p.dispatchEvent('#pn','change');await wait(900);
st=await p.evaluate(()=>window.__mock);
log('10 db: weights',st.weights.length,'checkins',st.checkins.length,JSON.stringify(st.checkins[0]&&st.checkins[0].data).slice(0,160),'files',Object.keys(st.files),'daily',JSON.stringify(st.daily_logs),'logs',st.workout_logs.length,'nombre',st.clients[0].ficha.nombre,'consent',st.clients[0].prefs.consent);
log('   home after:',(await p.evaluate(()=>{go('home');return document.querySelector('.wstats')?.innerText.replace(/\n/g,' ')})));
// cliente no debe ver pagos
log('11 S.ficha.pago visible to client:',JSON.stringify(await p.evaluate(()=>FICHA.pago)));
await p.click('text=Perfil y ajustes').catch(()=>{});await p.evaluate(()=>go('perfil'));await p.click('text=Cerrar sesión');await wait(400);
// coach otra vez
await p.setViewportSize({width:1200,height:900});
await p.fill('#aE','yaronska22@gmail.com');await p.fill('#aP','coachpass1');await p.click('button:text-is("Entrar")');await wait(600);await noPk();
log('12 list:',(await p.textContent('.clist')).replace(/\s+/g,' '));
await p.click('.tabs >> text=Check-ins');await shot('t12-coach-checks');await p.click('text=Ver 1');await wait(300);log('   photos:',await p.locator('.pgrid img').count());await p.click('.sheet >> text=Cerrar');
await p.click('.tabs >> text=Sesiones');await p.fill('#nk-0','42,5');await p.fill('#nr-0','8-10');await p.click('button:text-is("Pautar") >> nth=0');await wait(800);
st=await p.evaluate(()=>window.__mock);log('13 pautas',JSON.stringify(st.clients[0].pautas));
await p.click('.tabs >> text=Peso');await shot('t13-peso');
await p.click('.tabs >> text=Diario');log('14 diario:',(await p.textContent('.cmain table tbody')).slice(0,80));
log('ERRORS',errs);await b.close();})();
