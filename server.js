// Servidor de Yaronska App para Railway.
// - Sirve la app (archivos estáticos) con las mismas cabeceras que tenía en Cloudflare.
// - Hace de puente con Supabase en /sb/*: el móvil del cliente solo habla con este servidor,
//   así los bloqueos de LaLiga a las IP de Cloudflare no le impiden entrar ni cargar datos.
// Sin dependencias: solo Node 20+.
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;
const SB = process.env.SB_URL || 'https://gpiykjgziuxvjlmbgyds.supabase.co';
const MAX_BODY = 25 * 1024 * 1024;

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.pdf': 'application/pdf' };
const PRIVATE = /^\/(\.git|node_modules|tests|supabase|tools|server\.js|package(-lock)?\.json|README\.md|_headers)(\/|$)/;

function baseHeaders(p) {
  const h = { 'X-Frame-Options': 'SAMEORIGIN', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Robots-Tag': 'noindex, nofollow',
    'Permissions-Policy': 'camera=(self), geolocation=(), microphone=()' };
  if (/^\/rec(\.html|\.webmanifest)?$/.test(p)) h['Permissions-Policy'] = 'camera=(self), microphone=(self), display-capture=(self), geolocation=()';
  if (/^\/ej\//.test(p) && !/index\.json$/.test(p)) h['Cache-Control'] = 'public, max-age=2592000';
  else if (/^\/img\//.test(p)) h['Cache-Control'] = 'public, max-age=604800';
  else h['Cache-Control'] = 'no-cache';
  return h;
}

function resolveFile(p) {
  if (p === '/' || p === '') return path.join(ROOT, 'index.html');
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT)) return null;
  if (fs.existsSync(f) && fs.statSync(f).isFile()) return f;
  if (!path.extname(p) && fs.existsSync(f + '.html')) return f + '.html';      // /rec → rec.html
  if (!path.extname(p)) return path.join(ROOT, 'index.html');                     // rutas de la app → index
  return null;
}

function serveStatic(req, res, p) {
  if (PRIVATE.test(p)) { res.writeHead(404); return res.end('No encontrado'); }
  const f = resolveFile(p);
  if (!f) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('No encontrado'); }
  const st = fs.statSync(f);
  const etag = `"${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"`;
  const type = TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream';
  const h = Object.assign(baseHeaders(p), { 'Content-Type': type, ETag: etag, 'Last-Modified': st.mtime.toUTCString() });
  if (req.headers['if-none-match'] === etag) { res.writeHead(304, h); return res.end(); }
  // vídeos: soporte de rangos (Safari los pide así)
  const range = req.headers.range;
  if (range && /video|octet/.test(type)) {
    const m = /bytes=(\d*)-(\d*)/.exec(range); let a = m && m[1] ? +m[1] : 0, b = m && m[2] ? +m[2] : st.size - 1;
    if (a >= st.size) { res.writeHead(416, { 'Content-Range': `bytes */${st.size}` }); return res.end(); }
    b = Math.min(b, st.size - 1);
    res.writeHead(206, Object.assign(h, { 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${a}-${b}/${st.size}`, 'Content-Length': b - a + 1 }));
    if (req.method === 'HEAD') return res.end();
    return fs.createReadStream(f, { start: a, end: b }).pipe(res);
  }
  const gz = /text|javascript|json|svg|manifest/.test(type) && /gzip/.test(req.headers['accept-encoding'] || '') && st.size > 1024;
  if (gz) { h['Content-Encoding'] = 'gzip'; h['Vary'] = 'Accept-Encoding'; } else { h['Content-Length'] = st.size; h['Accept-Ranges'] = 'bytes'; }
  res.writeHead(200, h);
  if (req.method === 'HEAD') return res.end();
  const s = fs.createReadStream(f);
  (gz ? s.pipe(zlib.createGzip({ level: 6 })) : s).pipe(res);
}

// ---- puente con Supabase
const HOP = new Set(['host', 'connection', 'keep-alive', 'proxy-connection', 'transfer-encoding', 'upgrade', 'content-length', 'accept-encoding', 'cookie']);
async function proxy(req, res, url) {
  try {
    const chunks = []; let size = 0;
    for await (const c of req) { size += c.length; if (size > MAX_BODY) { res.writeHead(413); return res.end('Demasiado grande'); } chunks.push(c); }
    const headers = {};
    for (const [k, v] of Object.entries(req.headers)) if (!HOP.has(k.toLowerCase())) headers[k] = v;
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    if (ip) headers['x-forwarded-for'] = ip;
    const target = SB + url.pathname.replace(/^\/sb/, '') + url.search;
    const r = await fetch(target, { method: req.method, headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks), redirect: 'manual' });
    const out = {};
    r.headers.forEach((v, k) => { if (!['content-encoding', 'content-length', 'transfer-encoding', 'connection', 'alt-svc', 'set-cookie'].includes(k)) out[k] = v; });
    if (out.location && out.location.startsWith(SB)) out.location = out.location.replace(SB, '/sb');
    out['cache-control'] = out['cache-control'] || 'no-store';
    const buf = Buffer.from(await r.arrayBuffer());
    out['content-length'] = buf.length;
    res.writeHead(r.status, out);
    res.end(req.method === 'HEAD' ? undefined : buf);
  } catch (e) {
    console.error('proxy', url.pathname, e.message);
    if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'No se ha podido conectar con la base de datos', message: e.message }));
  }
}

http.createServer((req, res) => {
  let url; try { url = new URL(req.url, 'http://x'); } catch (e) { res.writeHead(400); return res.end(); }
  const p = decodeURIComponent(url.pathname);
  if (p === '/health') { res.writeHead(200, { 'Content-Type': 'text/plain' }); return res.end('ok'); }
  // la app pregunta aquí si debe usar el puente
  if (p === '/sb-config.js') { res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-cache' }); return res.end("window.YS_SB=location.origin+'/sb';"); }
  if (p === '/sb' || p.startsWith('/sb/')) return proxy(req, res, url);
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); return res.end(); }
  serveStatic(req, res, p);
}).listen(PORT, () => console.log('Yaronska App en el puerto ' + PORT));
