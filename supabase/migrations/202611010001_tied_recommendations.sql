-- Variable-length top3 contains all recommendations in the first three score ranks.
-- Historical rows retain their original first choice; unknown historical ties are not inferred.
alter table public.questionnaire_statistics add column first_places jsonb;
alter table public.questionnaire_statistics add constraint first_places_array
  check (first_places is null or (jsonb_typeof(first_places) = 'array' and jsonb_array_length(first_places) > 0));

create or replace function public.record_statistics(entry jsonb) returns void
language plpgsql security definer set search_path = '' as $$
begin
  -- Serialize the cap check and insertion; retries with the same UUID are safe.
  perform pg_advisory_xact_lock(73219001);
  if exists (select 1 from public.questionnaire_statistics where submission_id = (entry->>'submission_id')::uuid) then return; end if;
  if (select count(*) from public.questionnaire_statistics where submitted_on = current_date) >= 1000 then
    raise exception 'Daily submission limit reached';
  end if;
  insert into public.questionnaire_statistics(submission_id,model_version,consent_version,language,answers,ram,gpu,top3,first_places)
  values ((entry->>'submission_id')::uuid,entry->>'model_version',entry->>'consent_version',entry->>'language',entry->'answers',entry->>'ram',entry->>'gpu',entry->'top3',entry->'first_places');
end $$;
revoke all on function public.record_statistics(jsonb) from public, anon, authenticated;
grant execute on function public.record_statistics(jsonb) to service_role;


-- Show the three most frequent first-choice recommendations from the first contribution.
-- Only aggregate recommendation names and counts are published; no individual answers.
create or replace function public.public_statistics()
returns jsonb language sql stable security definer set search_path = ''
as $$
with total as (
  select count(*)::integer as n from public.questionnaire_statistics
), counts as (
  select names.name, count(*)::integer as n
  from public.questionnaire_statistics s
  cross join lateral (
    select distinct value as name
    from jsonb_array_elements_text(
      coalesce(s.first_places, jsonb_build_array(s.top3->>0))
    )
  ) names
  where names.name is not null
  group by names.name
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
