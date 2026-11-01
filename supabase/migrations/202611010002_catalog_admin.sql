-- Versioned publication records. Browser roles have no table or RPC access.
create table public.distribution_releases (
  version text primary key,
  catalog jsonb not null,
  github_commit text,
  published_by text not null,
  published_at timestamptz not null default now()
);
create table public.distribution_release_current (
  singleton boolean primary key default true check (singleton),
  version text not null references public.distribution_releases(version)
);
alter table public.distribution_releases enable row level security;
alter table public.distribution_release_current enable row level security;
revoke all on public.distribution_releases,public.distribution_release_current from public,anon,authenticated;
grant select,insert,update on public.distribution_releases,public.distribution_release_current to service_role;

create function public.activate_distribution_release(expected_version text, new_catalog jsonb, commit_sha text, actor text)
returns text language plpgsql security invoker set search_path = '' as $$
declare previous text; next_version text := new_catalog->>'version';
begin
  perform pg_advisory_xact_lock(73219002);
  select version into previous from public.distribution_release_current where singleton;
  if previous is distinct from expected_version then raise exception 'Publication conflict'; end if;
  if next_version is null or next_version !~ '^catalog-[0-9a-f]{64}$' then raise exception 'Invalid version'; end if;
  insert into public.distribution_releases(version,catalog,github_commit,published_by)
    values(next_version,new_catalog,commit_sha,actor) on conflict(version) do nothing;
  insert into public.distribution_release_current(singleton,version) values(true,next_version)
    on conflict(singleton) do update set version=excluded.version;
  return next_version;
end $$;
revoke all on function public.activate_distribution_release(text,jsonb,text,text) from public,anon,authenticated;
grant execute on function public.activate_distribution_release(text,jsonb,text,text) to service_role;
