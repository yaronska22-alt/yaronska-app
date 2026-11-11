// Genera bonus/pdf/<id>.pdf a partir de bonus/<id>.html (mismo contenido que se lee en la app).
// Uso: node tools/bonus-pdf.js [id ...]   (sin ids: todos los que tienen documento)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const R=path.resolve(__dirname,'..');
const css=fs.readFileSync(R+'/bonus/bonus.css','utf8');
const ids=process.argv.slice(2).length?process.argv.slice(2):fs.readdirSync(R+'/bonus').filter(f=>/\.html$/.test(f)).map(f=>f.replace('.html',''));
(async()=>{const b=await chromium.launch();const p=await b.newPage();
  for(const id of ids){const body=fs.readFileSync(R+'/bonus/'+id+'.html','utf8');
    const html=`<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><style>${css}
      @page{size:A4;margin:16mm 14mm 16mm 16mm}
      html,body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0}
      .bdoc{--bfg:#111;--bmut:#5F5A52;--bsur:#F7F5EF;--blin:#E3DFD4;color:#111}
      .bd-card p{color:#2B2824}.bd-table td:nth-child(2){color:#111;font-weight:700;background:#FFF6C2}
      .bd-faq dt{color:#111;border-left:3px solid var(--by);padding-left:8px}.bd-foot{color:#111}
      .bd-tag{color:#111;background:var(--by);padding:2px 8px;border-radius:4px;align-self:flex-start}
      .bd-cover{background:#0A0907;color:#fff;border-radius:14px;padding:26mm 12mm 12mm;border-left:0;box-shadow:inset 0 -8px 0 var(--by)}
      .bd-cover p{color:#E8E5DF}.bd-cover .bd-sub{color:var(--by)}.bd-cover .bd-tag{color:#000}
      body{font-family:Onest,Arial,Helvetica,sans-serif}
      .bdoc{font-size:11.5pt;gap:16px}.bdoc h1{font-size:34pt}.bdoc h2{font-size:15pt}
      section,.bd-card,.bd-box,.bd-table tr,.bd-faq dt,.bd-faq dd{break-inside:avoid}
      .bdoc h2{break-after:avoid}
      .bd-grid{grid-template-columns:1fr 1fr}
    </style></head><body>${body}</body></html>`;
    await p.setContent(html,{waitUntil:'load'});
    await p.pdf({path:R+'/bonus/pdf/'+id+'.pdf',format:'A4',printBackground:true,margin:{top:'16mm',bottom:'16mm',left:'16mm',right:'14mm'},
      displayHeaderFooter:true,headerTemplate:'<div></div>',footerTemplate:'<div style="width:100%;font-size:7pt;font-family:Arial;color:#8a857c;text-align:center;letter-spacing:2px">YARONSKA_FIT · <span class="pageNumber"></span></div>'});
    console.log('PDF',id,fs.statSync(R+'/bonus/pdf/'+id+'.pdf').size);
  }await b.close()})();
