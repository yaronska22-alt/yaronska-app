"""Mete una versión nueva de «Calculadora Dietas.html» en la app.
Uso: python3 tools/actualizar-calculadora.py "ruta/Calculadora Dietas.html"
Copia el archivo a calc/index.html y le añade el puente con la app (embed.css + embed.js)."""
import sys
s=open(sys.argv[1],encoding='utf-8').read()
if 'embed.js' not in s:
    s=s.replace('</head>','<link rel="stylesheet" href="embed.css">\n</head>',1)
    i=s.rindex('</body>');s=s[:i]+'<script src="embed.js"></script>\n'+s[i:]
open('calc/index.html','w',encoding='utf-8').write(s)
print('calc/index.html actualizado')
