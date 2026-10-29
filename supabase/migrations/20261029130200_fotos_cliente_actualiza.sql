create policy "checkins cliente actualiza" on storage.objects for update to authenticated
  using (bucket_id = 'checkins' and (storage.foldername(name))[1] = (select public.my_client_id())::text)
  with check (bucket_id = 'checkins' and (storage.foldername(name))[1] = (select public.my_client_id())::text);
