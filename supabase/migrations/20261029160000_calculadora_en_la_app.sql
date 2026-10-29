-- Datos de la Calculadora de dietas por cliente (constructor, protocolo, meal prep, lista de la compra). Solo el entrenador.
create table public.diet_calc (
  client_id uuid primary key references public.clients(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.diet_calc enable row level security;
create policy "solo coach" on public.diet_calc for all to authenticated
  using ((select public.is_coach())) with check ((select public.is_coach()));

-- Ajustes generales del entrenador (alimentos personalizados de la Calculadora, etc.)
create table public.coach_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.coach_settings enable row level security;
create policy "solo coach" on public.coach_settings for all to authenticated
  using ((select public.is_coach())) with check ((select public.is_coach()));
