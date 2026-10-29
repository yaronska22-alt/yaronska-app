# Yaronska App

App de clientes de **Yaronska_Fit**: plan dietético, entreno, check-ins, registro diario, recursos y panel del entrenador.

## Piezas
- **GitHub** (`yaronska22-alt/yaronska-app`): código y historial de cambios.
- **Supabase** (proyecto `yaronska-app`, región eu-west-1 · Irlanda): base de datos, accesos y archivos.
- **Cloudflare Pages**: publica la app automáticamente con cada cambio en `main` (dominio: app.yaronskafit.com). Cabeceras en `_headers`.

## Seguridad
- Cada cliente solo puede leer y escribir sus propios datos (RLS).
- Pagos, suscripción y notas comerciales (`client_admin`) solo los ve el entrenador.
- El cliente solo puede cambiar su nombre, email, teléfono y ajustes (`update_my_profile`).

## Base de datos
Las migraciones están en `supabase/migrations/`.

## Estructura
- `index.html` · `css/app.css` · `js/app.js` (pantallas) · `js/db.js` (conexión con Supabase)
- `data/plan.json` (planes por kcal y recetas) · `data/rutinas.json` (plantillas de entreno) · `img/recetas/`
- `tests/flujo-completo.js`: prueba automática de todo el recorrido (entrenador y cliente) con una base de datos simulada.

## Altas de clientes
Yaron da de alta al cliente (nombre + email) desde el panel. Solo ese email puede crear cuenta; cualquier otro queda bloqueado.

## Calculadora de dietas (pestaña «Dieta» del panel)
`calc/index.html` es la Calculadora original con dos líneas añadidas (`embed.css` y `embed.js`).
Guarda los datos de cada cliente en la tabla `diet_calc` y los alimentos personalizados en `coach_settings`.
Para meter una versión nueva: `python3 tools/actualizar-calculadora.py "Calculadora Dietas.html"`.
