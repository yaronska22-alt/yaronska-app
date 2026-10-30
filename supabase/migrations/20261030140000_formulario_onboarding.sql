create table if not exists public.form_responses (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  submitted_at timestamptz,
  response_id text unique,
  email text,
  nombre text,
  answers jsonb not null default '[]'::jsonb,
  client_id uuid references public.clients(id) on delete set null,
  imported_at timestamptz
);
alter table public.form_responses enable row level security;
create policy "coach todo" on public.form_responses for all using ((select public.is_coach())) with check ((select public.is_coach()));
create index if not exists form_responses_email_idx on public.form_responses (lower(email));
-- el código secreto (form_secret) vive en app_secrets, no en el repositorio
