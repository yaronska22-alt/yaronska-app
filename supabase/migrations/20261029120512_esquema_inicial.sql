-- Perfiles: uno por usuario (Yaron = coach, clientes = client)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'client' check (role in ('coach','client')),
  email text,
  created_at timestamptz not null default now()
);

create or replace function public.is_coach() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'coach');
$$;

-- Clientes: lo que el cliente puede ver de sí mismo
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  email text not null,
  ficha jsonb not null default '{}'::jsonb,
  prefs jsonb not null default '{}'::jsonb,
  fase int not null default 0,
  semana int not null default 1,
  semanas_fase int not null default 4,
  kcal int not null default 1800,
  rest_on boolean not null default true,
  plan jsonb,
  rutina jsonb not null default '[]'::jsonb,
  pautas jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Datos solo del entrenador: suscripción, pagos, notas comerciales
create table public.client_admin (
  client_id uuid primary key references public.clients(id) on delete cascade,
  estado text not null default 'active' check (estado in ('active','paused','ended','trial')),
  alta date, tipo text, renovacion date, pago numeric(8,2), cheatmeals int,
  pausa date, baja date, notas text,
  updated_at timestamptz not null default now()
);

create table public.weights (
  id bigint generated always as identity primary key,
  client_id uuid not null references public.clients(id) on delete cascade,
  fecha date not null, peso numeric(5,2) not null,
  created_at timestamptz not null default now()
);
create index on public.weights(client_id, fecha);

create table public.checkins (
  id bigint generated always as identity primary key,
  client_id uuid not null references public.clients(id) on delete cascade,
  fecha date not null, data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index on public.checkins(client_id, fecha);

create table public.daily_logs (
  client_id uuid not null references public.clients(id) on delete cascade,
  fecha date not null, data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (client_id, fecha)
);

create table public.workout_logs (
  id bigint generated always as identity primary key,
  client_id uuid not null references public.clients(id) on delete cascade,
  fecha date not null, dia text, ejercicio text not null,
  sets jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index on public.workout_logs(client_id, ejercicio, fecha);

create table public.templates (
  id bigint generated always as identity primary key,
  nombre text not null, descr text, days jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.client_admin enable row level security;
alter table public.weights enable row level security;
alter table public.checkins enable row level security;
alter table public.daily_logs enable row level security;
alter table public.workout_logs enable row level security;
alter table public.templates enable row level security;

create or replace function public.my_client_id() returns uuid
language sql stable security definer set search_path = '' as $$
  select c.id from public.clients c where c.user_id = (select auth.uid());
$$;

create policy "perfil propio o coach" on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_coach()));
create policy "cliente ve su ficha" on public.clients for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_coach()));
create policy "coach gestiona clientes" on public.clients for all to authenticated
  using ((select public.is_coach())) with check ((select public.is_coach()));
create policy "solo coach" on public.client_admin for all to authenticated
  using ((select public.is_coach())) with check ((select public.is_coach()));
create policy "coach todo" on public.weights for all to authenticated using ((select public.is_coach())) with check ((select public.is_coach()));
create policy "cliente lo suyo" on public.weights for all to authenticated using (client_id = (select public.my_client_id())) with check (client_id = (select public.my_client_id()));
create policy "coach todo" on public.checkins for all to authenticated using ((select public.is_coach())) with check ((select public.is_coach()));
create policy "cliente lo suyo" on public.checkins for all to authenticated using (client_id = (select public.my_client_id())) with check (client_id = (select public.my_client_id()));
create policy "coach todo" on public.daily_logs for all to authenticated using ((select public.is_coach())) with check ((select public.is_coach()));
create policy "cliente lo suyo" on public.daily_logs for all to authenticated using (client_id = (select public.my_client_id())) with check (client_id = (select public.my_client_id()));
create policy "coach todo" on public.workout_logs for all to authenticated using ((select public.is_coach())) with check ((select public.is_coach()));
create policy "cliente lo suyo" on public.workout_logs for all to authenticated using (client_id = (select public.my_client_id())) with check (client_id = (select public.my_client_id()));
create policy "solo coach" on public.templates for all to authenticated using ((select public.is_coach())) with check ((select public.is_coach()));

-- El cliente solo puede cambiar su nombre, email, teléfono y sus ajustes
create or replace function public.update_my_profile(p_nombre text, p_email text, p_tel text, p_prefs jsonb)
returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.clients
     set ficha = ficha || jsonb_build_object('nombre', p_nombre, 'email', p_email, 'tel', p_tel),
         prefs = coalesce(p_prefs, prefs), updated_at = now()
   where user_id = (select auth.uid());
end $$;

-- Al registrarse: crea el perfil y vincula al cliente invitado por su email
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, email) values (new.id, new.email) on conflict do nothing;
  update public.clients set user_id = new.id where lower(email) = lower(new.email) and user_id is null;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

revoke execute on function public.update_my_profile(text,text,text,jsonb) from public, anon;
grant execute on function public.update_my_profile(text,text,text,jsonb) to authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
