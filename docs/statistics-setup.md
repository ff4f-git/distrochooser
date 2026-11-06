# Supabase einrichten / Supabase setup

**[Deutsch](#deutsch) · [English](#english)**

## Deutsch

### Neuinstallation

1. Supabase-Projekt erstellen. Im **privaten SQL Editor** alle fünf Dateien aus [`supabase/migrations/`](../supabase/migrations/) **in Dateinamen-Reihenfolge** ausführen. Voraussetzung: die für den Statistik-Löschjob verwendete `pg_cron`-Erweiterung ist verfügbar. Bereits ausgeführte Migrationen nicht erneut blind anwenden.
2. Git, Node.js und npm installieren; im Repository-Verzeichnis anmelden, Projekt verknüpfen und **beide** Funktionen bereitstellen:

   ```bash
   git clone https://github.com/ff4f-git/distrochooser.git
   cd distrochooser
   npx supabase login
   npx supabase link --project-ref PROJECT_REF
   npx supabase functions deploy submit-statistics --use-api
   npx supabase functions deploy catalog-admin --use-api
   ```

   `PROJECT_REF` ersetzen. `--use-api` umgeht ein beim lokalen Deployment beobachtetes Entrypoint-Problem. In [`supabase/config.toml`](../supabase/config.toml) steht für beide Funktionen `verify_jwt = false`: Die Admin-Schreibrechte werden stattdessen über GitHub geprüft; die Statistik ist freiwillig und öffentlich erreichbar.
3. **Katalog initialisieren (nur neue Datenbank):** Den vollständigen Katalog aus [`data/distributions.json`](../data/distributions.json) in `public.distribution_releases` speichern (`version`, `catalog`, `github_commit`, `published_by`). `github_commit` muss zum gespeicherten Katalogstand passen. Anschließend `public.distribution_release_current` auf genau diese Version setzen (`singleton = true`). Beides ausschließlich im privaten SQL Editor. Bei Übernahme historischer Beiträge zusätzlich die tatsächlich verwendeten alten Katalogversionen archivieren.
4. **Prüfen:** Beide Edge Functions sind erreichbar. Der öffentliche GET-Zugriff von `catalog-admin` liefert den initialisierten Katalog. Ein ungültiger Statistik-POST mit `Origin: https://ff4f-git.github.io` wird abgelehnt, ohne einen Datensatz anzulegen. Danach mit einem ausdrücklich genehmigten gültigen Testbeitrag Speicherung und Wiederholungs-Schutz prüfen. Der öffentliche Datenbankzugriff auf Rohdaten muss gesperrt bleiben.
5. **Datenschutz und Freigabe:** Region, Betreiber, Einwilligung, Aufbewahrung, Infrastruktur-Logs und mögliche Identifizierbarkeit seltener Antwortkombinationen prüfen. Nur die **öffentliche** Funktions-URL in [`assets/statistics-config.js`](../assets/statistics-config.js) verwenden. **Nie** `SUPABASE_SERVICE_ROLE_KEY` oder GitHub-Tokens im Frontend ablegen.

### Betrieb

- `SUPABASE_URL` und `SUPABASE_SERVICE_ROLE_KEY` sind serverseitige Funktionsumgebung. Optional: `STATISTICS_ORIGIN` (Standard `https://ff4f-git.github.io`).
- `public.questionnaire_statistics` enthält freiwillige Beiträge; der tägliche Löschjob begrenzt die Aufbewahrung auf ungefähr 90 Tage. Beiträge sind **keine eindeutigen Nutzer**. Die [öffentliche Statistik](../statistik.html) zeigt die häufigsten **Erstplatzierungen**, einschließlich geteilter Erstplätze, ab dem ersten Beitrag.
- Prüfen im privaten SQL Editor:

  ```sql
  select version from public.distribution_release_current where singleton = true;
  select jobname, schedule, active from cron.job
  where jobname = 'purge-questionnaire-statistics';
  select count(*) from public.questionnaire_statistics;
  ```

- Katalog und Punkte über [`admin.html`](../admin.html) veröffentlichen. **Kein erneutes Deployment** bei reinen Punkteänderungen; Funktionscode- oder Schemaänderungen benötigen Deployment bzw. Migration. Tests: `node --test tests/*.test.mjs`.

## English

### Fresh installation

1. Create a Supabase project. Run **all five** files in [`supabase/migrations/`](../supabase/migrations/) **in filename order** in the **private SQL Editor**. The statistics cleanup requires `pg_cron`. Do not blindly rerun migrations on an existing database.
2. Install Git, Node.js and npm. From the repository root, sign in, link the project and deploy **both** functions:

   ```bash
   git clone https://github.com/ff4f-git/distrochooser.git
   cd distrochooser
   npx supabase login
   npx supabase link --project-ref PROJECT_REF
   npx supabase functions deploy submit-statistics --use-api
   npx supabase functions deploy catalog-admin --use-api
   ```

   Replace `PROJECT_REF`. `--use-api` avoids an observed local entrypoint deployment error. Both functions use `verify_jwt = false` in [`supabase/config.toml`](../supabase/config.toml); catalog writes instead require verified GitHub permissions.
3. **Initialize the catalog (new database only):** Store the complete [`data/distributions.json`](../data/distributions.json) in `public.distribution_releases` with its exact `version`, `catalog`, matching `github_commit` and `published_by`. Set the singleton row in `public.distribution_release_current` to that version. Use the private SQL Editor only. If migrating historical submissions, archive the corresponding historical catalogs too.
4. **Verify:** Both functions are reachable; public `catalog-admin` GET returns the current catalog. An invalid statistics POST with `Origin: https://ff4f-git.github.io` is rejected without insertion. Test a valid consented submission and idempotent retry. Public database access to raw records must remain denied.
5. **Privacy and launch:** Review operator identity, region, consent, retention, infrastructure logs and possible identifiability of rare answer patterns. Configure only the **public** endpoint in [`assets/statistics-config.js`](../assets/statistics-config.js). Never expose service-role keys or GitHub tokens in the frontend.

### Operations

- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` belong to the server-side function environment. Optional `STATISTICS_ORIGIN` defaults to `https://ff4f-git.github.io`.
- Optional contributions are stored in `public.questionnaire_statistics` and purged daily after approximately 90 days. Submissions are **not unique people**. The [public dashboard](../statistik.html) counts the most frequent **first-place recommendations**, including tied first places, starting with the first submission.
- In the private SQL Editor, check the current release, cleanup job and row count using the SQL queries in the German section above.
- Publish scoring changes through [`admin.html`](../admin.html), **without redeploying** Edge Functions. Deploy/migrate when changing function code or schema. Run `node --test tests/*.test.mjs`.
