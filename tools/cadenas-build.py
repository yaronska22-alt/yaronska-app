# Genera bonus/cadenas.html y bonus/cadenas-enlaces.md a partir de tools/cadenas-data.py
import html, os, runpy
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = runpy.run_path(os.path.join(R, 'tools/cadenas-data.py'))
C, GEN = D['C'], D['GEN']
e = html.escape
def go(i): return f'href="#c-{i}" onclick="var t=document.getElementById(\'c-{i}\');if(t){{t.scrollIntoView({{behavior:\'smooth\',block:\'start\'}});return false}}"'
def card(i, name, tipo, url, best, also, avoid):
    img = f'<img class="cad-img" src="bonus/img/cadenas/{i}.jpg" alt="{e(best[0])}" loading="lazy" onerror="this.remove()">'
    link = f'<a class="cad-link" href="{e(url)}" target="_blank" rel="noopener">Ver la carta con fotos ↗</a>' if url else ''
    return f'''<div class="cad" id="c-{i}">{img}
  <div class="cad-h"><h3>{e(name)}</h3>{f'<span class="cad-t">{e(tipo)}</span>' if tipo else ''}</div>
  <div class="cad-best"><span>🥇 Tu mejor opción</span><b>{e(best[0])}</b><p>{e(best[1])}</p></div>
  <div class="cad-cols"><div><span class="cad-l ok">👍 También vale</span><ul>{''.join(f'<li>{e(x)}</li>' for x in also)}</ul></div>
  <div><span class="cad-l no">⛔ Evita</span><ul>{''.join(f'<li>{e(x)}</li>' for x in avoid)}</ul></div></div>{link}</div>'''
tipos = []
for c in C:
    if c[2] not in tipos: tipos.append(c[2])
idx = ''.join(f'<a class="cad-chip" {go(c[0])}>{e(c[1])}</a>' for c in C) + ''.join(f'<a class="cad-chip g" {go(g[0])}>{e(g[1])}</a>' for g in GEN)
body = ''
for t in tipos:
    body += f'<section><h2>{e(t)}</h2><div class="cad-grid">' + ''.join(card(*c[:2], '', c[3], c[4], c[5], c[6]) for c in C if c[2] == t) + '</div></section>'
body += '<section><h2>Sin cadena: cualquier restaurante de…</h2><div class="cad-grid">' + ''.join(card(g[0], g[1], '', '', g[2], g[3], g[4]) for g in GEN) + '</div></section>'
doc = f'''<article class="bdoc">
<header class="bd-cover">
  <span class="bd-tag">Bonus · Yaronska_Fit</span>
  <h1>Guía de <em>Cadenas</em></h1>
  <p class="bd-sub">Qué pedir en cada restaurante</p>
  <p>{len(C)} cadenas de España y {len(GEN)} tipos de restaurante. En cada una, tu mejor opción y cómo pedirla, lo que también vale y lo que mejor evitar.</p>
</header>

<section class="bd-box bd-y">
  <h2>En 1 minuto</h2>
  <ol class="bd-rules">
    <li><b>Pide suelto, no en menú.</b> El menú te mete patatas grandes y refresco sin que lo pidas.</li>
    <li><b>Cambia las patatas por ensalada</b> o compártelas.</li>
    <li><b>Bebida zero o agua.</b> Todas las cadenas tienen refresco zero y casi todas, cerveza 0,0.</li>
    <li><b>Salsas aparte</b> y usa la mitad. «Sin mayonesa» es la frase que más te ahorra.</li>
    <li><b>Pizza: 2-3 porciones, masa fina y sin borde de queso.</b> El resto, para otro día o para compartir.</li>
  </ol>
</section>

<section>
  <h2>Busca tu restaurante</h2>
  <div class="cad-idx">{idx}</div>
  <p class="bd-small">Las cartas cambian: si tu plato ya no está, busca el más parecido con la misma regla (proteína a la plancha, sin rebozar, sin bacon y salsa aparte).</p>
</section>
{body}
<footer class="bd-foot">Comer fuera no rompe tu plan. Pedir sin pensar, sí. · @Yaronska_Fit</footer>
</article>
'''
open(os.path.join(R, 'bonus/cadenas.html'), 'w').write(doc)
md = '# Guía de Cadenas · platos y enlaces\n\nEnlace = carta con fotos de esa cadena en Glovo (busca ahí el plato para sacar la imagen).\nGuarda cada imagen como `bonus/img/cadenas/<id>.jpg` (o pásamelas y las pongo yo).\n\n| id | Cadena | Plato estrella | Carta |\n|---|---|---|---|\n'
md += ''.join(f'| {c[0]} | {c[1]} | {c[4][0]} | {c[3]} |\n' for c in C)
md += ''.join(f'| {g[0]} | {g[1]} | {g[2][0]} | (genérico, foto libre) |\n' for g in GEN)
open(os.path.join(R, 'bonus/cadenas-enlaces.md'), 'w').write(md)
print('ok', len(C), len(GEN))
