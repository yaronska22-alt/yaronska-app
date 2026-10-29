create extension if not exists pg_cron;
create extension if not exists pg_net;
create table public.push_subs (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  endpoint text not null unique, p256dh text not null, auth text not null, ua text,
  created_at timestamptz not null default now()
);
alter table public.push_subs enable row level security;
create policy "mis dispositivos" on public.push_subs for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "coach ve dispositivos" on public.push_subs for select to authenticated using ((select public.is_coach()));
create table public.push_log (
  client_id uuid not null references public.clients(id) on delete cascade,
  kind text not null, fecha date not null, sent_at timestamptz not null default now(),
  primary key (client_id, kind, fecha)
);
alter table public.push_log enable row level security;
create policy "coach ve avisos" on public.push_log for select to authenticated using ((select public.is_coach()));
-- Claves del servidor (VAPID y secreto del cron). Los valores NO están en el repositorio.
create table public.app_secrets (key text primary key, value text not null);
alter table public.app_secrets enable row level security;
revoke all on public.app_secrets from anon, authenticated;
-- Programación (cada 15 min): cron.schedule('avisos-yaronska','*/15 * * * *', net.http_post a /functions/v1/avisos con cabecera x-cron-secret)
