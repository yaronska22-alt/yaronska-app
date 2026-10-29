-- Solo pueden crear cuenta los emails que Yaron haya dado de alta como cliente
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.clients c where lower(c.email) = lower(new.email))
     and not exists (select 1 from public.profiles p where lower(p.email) = lower(new.email)) then
    raise exception 'EMAIL_NO_INVITADO';
  end if;
  insert into public.profiles(id, email) values (new.id, lower(new.email)) on conflict do nothing;
  update public.clients set user_id = new.id where lower(email) = lower(new.email) and user_id is null;
  return new;
end $$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Fotos de los check-ins: privadas (solo el cliente y Yaron)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('checkins', 'checkins', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
create policy "checkins coach" on storage.objects for all to authenticated
  using (bucket_id = 'checkins' and (select public.is_coach()))
  with check (bucket_id = 'checkins' and (select public.is_coach()));
create policy "checkins cliente lee" on storage.objects for select to authenticated
  using (bucket_id = 'checkins' and (storage.foldername(name))[1] = (select public.my_client_id())::text);
create policy "checkins cliente sube" on storage.objects for insert to authenticated
  with check (bucket_id = 'checkins' and (storage.foldername(name))[1] = (select public.my_client_id())::text);
