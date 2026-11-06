# Freiwillige Statistik / Optional statistics

## Deutsch

### Erstinstallation und Reihenfolge

**Aktueller Stand (November 2026):** Diese Anleitung umfasst die Statistik **und** die versionierte Katalogverwaltung. Die vollständige Einrichtung erfordert alle fünf SQL-Migrationen in Dateireihenfolge, beide Edge Functions und die Registrierung des anfänglichen Katalogs. Nur `submit-statistics` einzurichten reicht nicht mehr aus. Details zur Administration: [Distributionsverwaltung](administration.md).


**Wichtig:** Die SQL-Abfragen im Abschnitt „Auswertung“ erstellen **keine** Tabelle. Die komplette Migration steht in [`supabase/migrations/202610270001_statistics.sql`](../supabase/migrations/202610270001_statistics.sql). Sie wurde im **privaten Supabase SQL Editor** ausgeführt. Erst danach funktionieren Auswertungsabfragen auf `public.questionnaire_statistics`.

1. Supabase-Projekt in einer passenden Region anlegen. Keine Passwörter, Access Tokens oder Service-Role-Schlüssel in GitHub, Screenshots oder Chats veröffentlichen. GitHub mit Supabase zu verbinden deployt die Edge Function **nicht automatisch**.
2. Im Supabase SQL Editor **alle fünf Migrationsdateien in aufsteigender Reihenfolge** aus `supabase/migrations/` vollständig ausführen, nicht die `SELECT`-Abfragen aus dieser Anleitung. `202610270001_statistics.sql` erstellt `public.questionnaire_statistics`, aktiviert RLS, entzieht `anon` und `authenticated` Tabellenrechte, erstellt die nur für `service_role` ausführbare RPC-Funktion `record_statistics` und plant eine tägliche Löschung über `pg_cron`. Die Folgemigrationen aktualisieren öffentliche Rangliste und Gleichstandslogik; `202611010002_catalog_admin.sql` erstellt `distribution_releases`, `distribution_release_current` und die geschützte Aktivierungsfunktion. Migrationen nicht erneut blind auf eine bereits eingerichtete Datenbank anwenden.
3. Im Repository-Hauptordner unter Linux Git, Node.js und npm prüfen. Mit der CLI anmelden, Projekt verknüpfen und die vorhandene Funktion deployen:

   ```bash
   git clone https://github.com/ff4f-git/distrochooser.git
   cd distrochooser
   npx supabase login
   npx supabase link --project-ref PROJECT_REF
   npx supabase functions deploy submit-statistics --use-api
   npx supabase functions deploy catalog-admin --use-api
   ```

   Wenn das Repository bereits lokal existiert, stattdessen im vorhandenen Ordner `git pull` verwenden (vorher eigene Änderungen prüfen). `PROJECT_REF` durch die eigene Projekt-ID ersetzen. Bei der Anmeldung keine Tokens weitergeben. **Praxis-Hinweis (Linux):** Das normale Deployment scheiterte trotz vorhandener und lesbarer `supabase/functions/submit-statistics/index.ts` mit `entrypoint path does not exist`. `--use-api` hat die vier Dateien `index.ts`, `validate.js`, `model.json` und `gpu-bonus.json` erfolgreich hochgeladen. `supabase/functions/new hello-world` ist nicht erforderlich.
4. Im Supabase-Dashboard unter **Edge Functions** kontrollieren, ob **beide Funktionen** `submit-statistics` und `catalog-admin` angezeigt werden. Die öffentliche URL hat die Form `https://PROJECT_REF.supabase.co/functions/v1/submit-statistics`. In [`supabase/config.toml`](../supabase/config.toml) steht bewusst `verify_jwt = false`, damit freiwillige Beiträge ohne Benutzerkonto möglich sind. Das ist **keine** Missbrauchssicherung.
5. **Katalog initialisieren:** Nach den Migrationen den vollständigen Katalog aus `data/distributions.json` als Eintrag in `public.distribution_releases` registrieren und `public.distribution_release_current` auf dessen `version` setzen. `github_commit` muss den zu dieser Katalogversion gehörenden GitHub-Commit bezeichnen; den Commit nicht schätzen. Für eine neue, noch leere Installation beide Einträge im privaten SQL Editor anlegen, niemals im Browser. Die Datenbank benötigt genau eine aktuelle Version. Eine bereits laufende Installation darf nicht erneut initialisiert werden. Danach die öffentliche GET-Antwort von `catalog-admin` mit dem JSON-Katalog vergleichen. Für spätere Änderungen ausschließlich den geschützten Admin-Editor verwenden.
6. **Vor Freischaltung testen:** Eine `POST`-Anfrage mit Body `{}`, Header `Origin: https://ff4f-git.github.io` und `Content-Type: application/json` sollte mit HTTP 400 und `{"ok":false}` abgelehnt werden; dabei darf kein Datensatz entstehen. Ein fehlender oder fremder `Origin` sollte HTTP 403 liefern. Anschließend mit einem ausdrücklich genehmigten **gültigen** Testdatensatz Erfolg, identische Wiederholung (keine Doppelzählung), ungültige Eingaben, gesperrten öffentlichen Lesezugriff und Löschjob prüfen. Der Negativtest allein beweist noch nicht, dass Speicherung funktioniert.
7. **Cron und Zugriff prüfen** (privater SQL Editor):

   ```sql
   select jobid, jobname, schedule, active from cron.job
   where jobname = 'purge-questionnaire-statistics';
   select count(*) from public.questionnaire_statistics;
   ```

   Den tatsächlichen Joblauf in `cron.job_run_details` prüfen, sobald ein Lauf stattgefunden hat. Die Migration löscht täglich um 03:15 Uhr nach Datenbank-/Cron-Zeitzone Datensätze mit `submitted_on <= current_date - 89`. Backup- und Plattformprotokoll-Aufbewahrung sind separat zu prüfen. Für RLS und RPC-Rechte zusätzlich im Dashboard kontrollieren, dass `anon`/`authenticated` keine Lese-/Schreibrechte erhalten.
8. **Datenschutz vor Aktivierung:** Tatsächlichen Betreiber, Supabase-Anbieter und Region, Zweck, konkrete Felder, Einwilligung, Aufbewahrung, technische Verarbeitung von IP-Adressen und Log-Aufbewahrung in den Datenschutzhinweisen nennen. Die Anwendung speichert in der Statistik keine IP, keinen User-Agent, keinen Referrer und keine genaue Uhrzeit; die Infrastruktur kann solche Daten dennoch verarbeiten. Seltene Antwortprofile können unterscheidbar sein – keine vollständige Anonymität versprechen. Einwilligungstext in `assets/app.js` auf Deutsch und Englisch prüfen.
9. **Für neue Installationen erst nach allen Prüfungen:** Nur die öffentliche Funktions-URL in [`assets/statistics-config.js`](../assets/statistics-config.js) eintragen und über GitHub Pages veröffentlichen. **Nie** den `SUPABASE_SERVICE_ROLE_KEY` im Frontend ablegen. `SUPABASE_URL` und `SUPABASE_SERVICE_ROLE_KEY` sind serverseitige Supabase-Funktionsumgebung; optional `STATISTICS_ORIGIN` (Standard `https://ff4f-git.github.io`). Vorher bleibt der Statistik-Button deaktiviert.

### Öffentliche Rangliste

Die Seite [statistik.html](../statistik.html) zeigt ab dem **ersten freiwilligen Beitrag** die Gesamtzahl und maximal drei Distributionen, sortiert nach der Häufigkeit ihrer **Erstempfehlung** (`top3[0]`), bei Gleichstand alphabetisch. Die Plätze 2 und 3 dieser Rangliste sind ebenfalls Erstempfehlungen aus anderen Beiträgen – nicht die internen Plätze 2 und 3 jedes einzelnen Ergebnisses. Der Link im Footer ist immer sichtbar; der zusätzliche Button im Ergebnisbereich erscheint erst nach erfolgreicher Übermittlung. Die Werte zählen Beiträge, nicht einzelne Besucher.

Nach der Basismigration `202610270001_statistics.sql` wurden `202610270002_public_statistics.sql` (historische Fünfer-Schwelle) und zuletzt **`202610270003_top_three_from_first.sql`** ausgeführt. Nur die letzte Definition von `public.public_statistics()` ist maßgeblich. **Die Fünfer-Schwelle gilt für die öffentliche Rangliste nicht mehr.** Auch ein einzelner Beitrag kann eine Distribution sichtbar machen; keine formale Anonymitätsgarantie. Die Tabelle selbst bleibt privat und die RPC für `service_role` reserviert. Die Edge Function stellt die Aggregate über GET bereit. Für diese SQL-Änderung ist kein erneutes Function-Deployment nötig. Details: [Öffentliche Statistik](public-statistics.md).

### Auswertung 

```sql
-- Erstempfehlungen je Modellversion
select model_version, top3->>0 as recommendation, count(*)
from public.questionnaire_statistics group by 1,2 order by count(*) desc;

-- Häufige Antwortkombinationen und Top 3 (mindestens fünf)
select model_version, answers, ram, gpu, top3, count(*)
from public.questionnaire_statistics
group by 1,2,3,4,5 having count(*) >= 5 order by count(*) desc;

-- Antworten je Fragenposition (ab 1)
select model_version, question_number, answer_code, count(*)
from public.questionnaire_statistics,
 lateral jsonb_array_elements(answers) with ordinality as q(selected, question_number),
 lateral jsonb_array_elements_text(q.selected) as a(answer_code)
group by 1,2,3 order by 2, count(*) desc;
```

Antwortcodes stehen in `assets/model.json`. Ergebnisse je Modellversion getrennt auswerten; keine Rohdaten oder Einzeldatensätze öffentlich machen. `having count(*) >= 5` schützt nur diese eine Aggregation, nicht automatisch alle anderen Abfragen.

### Grenzen und Wartung

Nur ein ausdrücklicher Klick nach dem Ergebnis übermittelt. Die Serverfunktion validiert Eingaben und berechnet die Top 3 selbst. Wiederholungen derselben Übertragungs-ID sind idempotent; nach einem Neuladen kann ein neuer Beitrag gezählt werden. **Gezählt werden Beiträge, nicht eindeutige Personen.** Origin-Prüfung und 1.000 Beiträge pro Tag begrenzen Missbrauch nur eingeschränkt; CORS ist keine Authentifizierung. Bei höherem Traffic serverseitige Ratenbegrenzung/Bot-Abwehr prüfen. Statistikdatensätze werden täglich gelöscht und sollen höchstens 90 Tage verbleiben; Backups/Logs separat behandeln. **Bei reinen Katalog- und Punkteänderungen ist kein erneutes Deployment nötig:** Der Admin-Editor veröffentlicht GitHub-Dateien und aktiviert eine neue Katalogversion in Supabase. Die Statistikfunktion lädt den gespeicherten Katalog zur eingereichten Modellversion. Ein Deployment ist bei Änderungen am Funktionscode, an der Datenbankstruktur oder an den API-Verträgen erforderlich. Lokale Tests: `node --test tests/statistics.test.mjs`. Diese ersetzen keine Live-Prüfung.

---

## English

### Setup and deployment

**Current setup (November 2026):** Install the statistics **and** versioned catalog administration together: run all five SQL migrations in filename order, deploy both Edge Functions, and initialize the current catalog release. The statistics-only setup below is not sufficient on its own. See [catalog administration](administration.md).


**Do not copy the reporting queries below to create the table.** Run all five files in [`supabase/migrations/`](../supabase/migrations/) in filename order in the **private Supabase SQL Editor** on a new installation. It creates `public.questionnaire_statistics`, enables RLS, revokes public table permissions, grants the recording RPC only to `service_role`, and schedules daily deletion using `pg_cron`.

1. Create a Supabase project in an appropriate region. Keep passwords, access tokens and the service-role key private. Connecting GitHub does **not** automatically deploy the function.
2. From the repository root on Linux, use Git, Node.js, npm and the official CLI via `npx`:

   ```bash
   git clone https://github.com/ff4f-git/distrochooser.git
   cd distrochooser
   npx supabase login
   npx supabase link --project-ref PROJECT_REF
   npx supabase functions deploy submit-statistics --use-api
   npx supabase functions deploy catalog-admin --use-api
   ```

   If already cloned, use your existing directory and `git pull` after checking local changes. Replace `PROJECT_REF` with your project reference. On the operator's Linux system, normal deployment failed with `entrypoint path does not exist` even though `index.ts` existed and was readable. `--use-api` successfully uploaded `index.ts`, `validate.js`, `model.json` and `gpu-bonus.json`. Do not create a `hello-world` function.
3. Verify **both** `submit-statistics` and `catalog-admin` appear under **Supabase → Edge Functions**. Its public URL is `https://PROJECT_REF.supabase.co/functions/v1/submit-statistics`. [`supabase/config.toml`](../supabase/config.toml) sets `verify_jwt = false` to allow contributions without accounts; this does not prevent abuse.
4. **Initialize the catalog:** Register the complete `data/distributions.json` as a release in `public.distribution_releases`, then set the singleton row in `public.distribution_release_current` to that exact version. Use the matching GitHub commit as `github_commit`; do not guess it. Do this in the private SQL Editor only on a new, empty installation, never on an existing published database. Verify that the public `catalog-admin` GET endpoint returns the matching catalog. Subsequent edits must use the protected administration page.
5. **Test before enabling:** A `POST` with JSON `{}`, `Origin: https://ff4f-git.github.io`, and `Content-Type: application/json` should return HTTP 400 and `{"ok":false}` without inserting a row. Missing or unexpected origins should return HTTP 403. Then use an explicitly approved **valid** test submission to verify insertion, idempotent retry, invalid input rejection, denied public reads, and the deletion job. A rejected invalid request alone does not prove successful storage.
6. In the private SQL Editor verify the scheduled job and record count:

   ```sql
   select jobid, jobname, schedule, active from cron.job
   where jobname = 'purge-questionnaire-statistics';
   select count(*) from public.questionnaire_statistics;
   ```

   Inspect `cron.job_run_details` after the job has run. The migration schedules deletion at 03:15 in the database/cron time zone for rows with `submitted_on <= current_date - 89`. Verify RLS and denied `anon`/`authenticated` access; review provider logs and backups separately.
7. **Privacy review is mandatory before launch:** Publish accurate details about the operator, Supabase region, purpose, collected fields, consent, retention, technical IP processing and platform logs. No IP, user agent, referrer or exact timestamp is stored in the statistics table, but infrastructure may still process them. Rare answer combinations may be distinguishable; do not promise complete anonymity. Review the German and English consent text in `assets/app.js`.
8. **For new installations, only after verification**, put the public function URL in [`assets/statistics-config.js`](../assets/statistics-config.js) and publish the site. Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code. `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` belong in the Supabase function environment; optional `STATISTICS_ORIGIN` defaults to `https://ff4f-git.github.io`. Until the URL is configured, the contribution button stays disabled.

### Public ranking 

The [public dashboard](../statistik.html) shows the total and up to three most frequent **first-choice recommendations** (`top3[0]`) starting with the first voluntary contribution; ties are alphabetical. Public ranks #2 and #3 refer to other first-choice recommendations, not the second and third recommendations within each result. Counts are submissions, not unique visitors. The footer link is always visible; the additional results-page link appears only after a successful opt-in submission.

The migrations are `202610270001_statistics.sql` (private table), `202610270002_public_statistics.sql` (historical five-count rule), and **`202610270003_top_three_from_first.sql`** (current RPC). The five-count public suppression has been removed; a one-count recommendation can be published, so there is no anonymity guarantee. Raw table access remains private. The Edge Function serves aggregate data over GET, and a SQL-only update needs no redeployment. See [public statistics](public-statistics.md).

### Private reporting

Use the three SQL reporting queries in the German section above in the **private** SQL Editor only. They show top recommendations by model version, answer combinations with at least five submissions, and per-question answer counts. Answer codes are in `assets/model.json`. Never expose raw rows or a public read API; keep model versions separate. The five-submission threshold applies only to the grouped-combinations query.

### Limitations and maintenance

Only an explicit post-result click submits answers. The server validates input and recomputes the top three. Retries with the same submission ID are idempotent, but reloading may create another contribution. Counts measure **submissions, not unique visitors**. Origin checking and a global limit of 1,000 submissions/day are basic controls, not authentication or robust bot protection. Add server-side rate limiting or bot mitigation if needed. Daily deletion targets retention of no more than 90 days; provider logs and backups require separate review. **Score/catalog edits no longer require an Edge Function redeployment:** the admin page publishes a new catalog version to GitHub and Supabase; statistics submissions are checked against their archived model version. Redeploy when changing function code, database schema or API contracts. Run `node --test tests/statistics.test.mjs` locally, then perform live database and endpoint checks.


## Version 2.2.0: Gleichstände / ties

Vor dem aktualisierten Client zuerst `supabase/migrations/202611010001_tied_recommendations.sql` anwenden, danach `submit-statistics` mit der neuen Modellkopie und `validate.js` neu deployen. Das Feld `top3` enthält alle Empfehlungen der ersten drei Rangstufen; `first_places` enthält alle geteilten Erstplatzierungen. Die öffentliche Statistik zählt diese jeweils einmal, die Teilnahme weiterhin nur einmal. Historische Beiträge bleiben unverändert.

Apply the new SQL migration and redeploy the Edge Function before publishing the updated client. The archived legacy model version is 2.2.0. For new installations also apply `202611010002_catalog_admin.sql`, initialize the catalog release, and deploy `catalog-admin`. Live deployment is separate from repository commits.
