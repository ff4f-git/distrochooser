-- Show the three most frequent first-choice recommendations from the first contribution.
-- Only aggregate recommendation names and counts are published; no individual answers.
create or replace function public.public_statistics()
returns jsonb language sql stable security definer set search_path = ''
as $$
with total as (
  select count(*)::integer as n from public.questionnaire_statistics
), counts as (
  select s.top3->>0 as name, count(*)::integer as n
  from public.questionnaire_statistics s
  where s.top3->>0 is not null
  group by s.top3->>0
), leaders as (
  select name, n from counts order by n desc, name limit 3
)
select jsonb_build_object(
  'total', (select n from total),
  'minimum', 1,
  'topRecommendations', coalesce((select jsonb_agg(jsonb_build_object('name',name,'count',n) order by n desc,name) from leaders), '[]'::jsonb)
)
$$;
revoke all on function public.public_statistics() from public, anon, authenticated;
grant execute on function public.public_statistics() to service_role;
