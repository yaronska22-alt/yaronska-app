-- Cobros de cada cliente (altas y renovaciones). Solo el entrenador.
create table public.payments (
  id bigint generated always as identity primary key,
  client_id uuid not null references public.clients(id) on delete cascade,
  fecha date not null,
  importe numeric(8,2) not null,
  concepto text not null default 'renovacion' check (concepto in ('alta','renovacion','otro')),
  nota text,
  created_at timestamptz not null default now()
);
create index on public.payments(client_id, fecha);
alter table public.payments enable row level security;
create policy "solo coach" on public.payments for all to authenticated
  using ((select public.is_coach())) with check ((select public.is_coach()));
