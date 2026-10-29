revoke execute on function public.is_coach() from public, anon;
revoke execute on function public.my_client_id() from public, anon;
grant execute on function public.is_coach() to authenticated;
grant execute on function public.my_client_id() to authenticated;
