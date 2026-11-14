-- Registro de cambios de dieta por cliente (qué comida, qué alimento, cuánto sube o baja). Solo el entrenador.
create table public.diet_log (
  id bigint generated always as identity primary key,
  client_id uuid not null references public.clients(id) on delete cascade,
  at timestamptz not null default now(),
  data jsonb not null default '{}'::jsonb
);
create index on public.diet_log(client_id, at desc);
alter table public.diet_log enable row level security;
create policy "solo coach" on public.diet_log for all to authenticated
  using ((select public.is_coach())) with check ((select public.is_coach()));
