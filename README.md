# Yaronska App

App de clientes de **Yaronska_Fit**: plan dietético, entreno, check-ins, registro diario, recursos y panel del entrenador.

## Piezas
- **GitHub** (`yaronska22-alt/yaronska-app`): código y historial de cambios.
- **Supabase** (proyecto `yaronska-app`, región eu-west-1 · Irlanda): base de datos, accesos y archivos.
- **Netlify**: publica la app automáticamente con cada cambio en `main`.

## Seguridad
- Cada cliente solo puede leer y escribir sus propios datos (RLS).
- Pagos, suscripción y notas comerciales (`client_admin`) solo los ve el entrenador.
- El cliente solo puede cambiar su nombre, email, teléfono y ajustes (`update_my_profile`).

## Base de datos
Las migraciones están en `supabase/migrations/`.
