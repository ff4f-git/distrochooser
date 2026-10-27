-- Run once in Supabase SQL Editor. Only the service role may execute this aggregate.
-- Suppress the total below five contributions and any recommendation count below five.
create or replace function public.public_statistics()
returns jsonb language sql stable security definer set search_path = ''
as $$
with total as (
  select count(*)::integer as n from public.questionnaire_statistics
), counts as (
  select s.top3->>0 as name, count(*)::integer as n
  from public.questionnaire_statistics s
  group by s.top3->>0
), safe as (
  select name, n from counts where n >= 5 and name is not null
)
select jsonb_build_object(
  'total', case when (select n from total) >= 5 then (select n from total) else null end,
  'minimum', 5,
  'topRecommendations', coalesce((select jsonb_agg(jsonb_build_object('name',name,'count',n) order by n desc,name) from safe), '[]'::jsonb)
)
$$;
revoke all on function public.public_statistics() from public, anon, authenticated;
grant execute on function public.public_statistics() to service_role;
