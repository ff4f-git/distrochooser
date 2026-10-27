-- No public read/write policies. Only the server's service role can submit.
create table public.questionnaire_statistics (
  submission_id uuid primary key,
  submitted_on date not null default current_date,
  model_version text not null,
  consent_version text not null,
  language text not null check (language in ('de','en')),
  answers jsonb not null,
  ram text,
  gpu text,
  top3 jsonb not null
);
alter table public.questionnaire_statistics enable row level security;
revoke all on public.questionnaire_statistics from anon, authenticated;

create function public.record_statistics(entry jsonb) returns void
language plpgsql security definer set search_path = '' as $$
begin
  -- Serialize the cap check and insertion; retries with the same UUID are safe.
  perform pg_advisory_xact_lock(73219001);
  if exists (select 1 from public.questionnaire_statistics where submission_id = (entry->>'submission_id')::uuid) then return; end if;
  if (select count(*) from public.questionnaire_statistics where submitted_on = current_date) >= 1000 then
    raise exception 'Daily submission limit reached';
  end if;
  insert into public.questionnaire_statistics(submission_id,model_version,consent_version,language,answers,ram,gpu,top3)
  values ((entry->>'submission_id')::uuid,entry->>'model_version',entry->>'consent_version',entry->>'language',entry->'answers',entry->>'ram',entry->>'gpu',entry->'top3');
end $$;
revoke all on function public.record_statistics(jsonb) from public, anon, authenticated;
grant execute on function public.record_statistics(jsonb) to service_role;

create index questionnaire_statistics_day on public.questionnaire_statistics(submitted_on);
create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule('purge-questionnaire-statistics', '15 3 * * *',
  $$delete from public.questionnaire_statistics where submitted_on <= current_date - 89$$);

-- Run these queries privately in the Supabase SQL editor. Never expose raw rows.
-- select top3->>0 as recommendation, count(*) from public.questionnaire_statistics group by 1 order by 2 desc;
-- select model_version, answers, ram, gpu, top3, count(*) from public.questionnaire_statistics
-- group by 1,2,3,4,5 having count(*) >= 5 order by count(*) desc;
