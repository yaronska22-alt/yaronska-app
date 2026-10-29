create or replace function public.update_my_profile(p_nombre text, p_email text, p_tel text, p_prefs jsonb)
returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.clients
     set ficha = ficha || jsonb_strip_nulls(jsonb_build_object('nombre', p_nombre, 'tel', p_tel)),
         prefs = coalesce(p_prefs, prefs),
         updated_at = now()
   where user_id = (select auth.uid());
end $$;
revoke execute on function public.update_my_profile(text,text,text,jsonb) from public, anon;
grant execute on function public.update_my_profile(text,text,text,jsonb) to authenticated;
