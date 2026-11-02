const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.pathname==='/js/db.js')return r.fulfill({path:__dirname+'/mockdb.js',contentType:'text/javascript'});if(u.hostname==='127.0.0.1')return r.continue();return r.fulfill({status:200,body:''})});
await p.goto('http://127.0.0.1:8099/');await p.waitForTimeout(800);console.log('YS_SB',await p.evaluate(()=>window.YS_SB));
await p.fill('#aE','yaronska22@gmail.com');await p.fill('#aP','coachpass1');await p.click('button:text-is("Entrar")');await p.waitForTimeout(800);
console.log('coach ok',await p.isVisible('.clist'));console.log('ERR',errs);await b.close()})();
