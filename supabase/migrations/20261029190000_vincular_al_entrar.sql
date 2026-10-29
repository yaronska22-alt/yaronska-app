-- Si la cuenta ya existía antes de que Yaron pusiera ese email en una ficha, se vincula al entrar
create or replace function public.link_my_client() returns uuid
language plpgsql security definer set search_path = '' as $$
declare cid uuid; em text;
begin
  select id into cid from public.clients where user_id = (select auth.uid());
  if cid is not null then return cid; end if;
  select lower(email) into em from auth.users where id = (select auth.uid());
  update public.clients set user_id = (select auth.uid())
   where id = (select c.id from public.clients c where lower(c.email) = em and c.user_id is null order by c.created_at limit 1)
   returning id into cid;
  return cid;
end $$;
revoke execute on function public.link_my_client() from public, anon;
grant execute on function public.link_my_client() to authenticated;
