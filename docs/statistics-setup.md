# Freiwillige Statistik / Optional statistics

> **Stand / Status: 27.10.2026.** Datenbankmigration im Supabase-Projekt ausgeführt und Edge Function `submit-statistics` erfolgreich mit `--use-api` bereitgestellt (laut Betreiber-Test im Terminal). **Noch nicht verifiziert:** erfolgreicher Ende-zu-Ende-Test, RLS-/Cron-Prüfung, Datenschutzhinweise und Aktivierung der URL auf GitHub Pages. Keine produktive Erfassung behaupten.  
> **As of 27 October 2026:** Database migration applied and Edge Function deployed using `--use-api` (operator-reported terminal success). **Still pending:** end-to-end test, RLS/cron verification, privacy notice and enabling the public endpoint. Do not claim live collection.

## Deutsch

### Dateien und Reihenfolge

**Wichtig:** Die SQL-Abfragen im Abschnitt „Auswertung“ erstellen **keine** Tabelle. Die komplette Migration steht in [`supabase/migrations/202610270001_statistics.sql`](../supabase/migrations/202610270001_statistics.sql). Sie wurde im **privaten Supabase SQL Editor** ausgeführt. Erst danach funktionieren Auswertungsabfragen auf `public.questionnaire_statistics`.

1. Supabase-Projekt in einer passenden Region anlegen. Keine Passwörter, Access Tokens oder Service-Role-Schlüssel in GitHub, Screenshots oder Chats veröffentlichen. GitHub mit Supabase zu verbinden deployt die Edge Function **nicht automatisch**.
2. Im Supabase SQL Editor die **gesamte Migrationsdatei** ausführen, nicht die `SELECT`-Abfragen aus dieser Anleitung. Die Migration erstellt `public.questionnaire_statistics`, aktiviert RLS, entzieht `anon` und `authenticated` Tabellenrechte, erstellt die nur für `service_role` ausführbare RPC-Funktion `record_statistics` und plant eine tägliche Löschung über `pg_cron`.
3. Im Repository-Hauptordner unter Linux Git, Node.js und npm prüfen. Mit der CLI anmelden, Projekt verknüpfen und die vorhandene Funktion deployen:

   ```bash
   git clone https://github.com/ff4f-git/distrochooser.git
   cd distrochooser
   npx supabase login
   npx supabase link --project-ref PROJECT_REF
   npx supabase functions deploy submit-statistics --use-api
   ```

   Wenn das Repository bereits lokal existiert, stattdessen im vorhandenen Ordner `git pull` verwenden (vorher eigene Änderungen prüfen). `PROJECT_REF` durch die eigene Projekt-ID ersetzen. Bei der Anmeldung keine Tokens weitergeben. **Praxis-Hinweis (Linux):** Das normale Deployment scheiterte trotz vorhandener und lesbarer `supabase/functions/submit-statistics/index.ts` mit `entrypoint path does not exist`. `--use-api` hat die vier Dateien `index.ts`, `validate.js`, `model.json` und `gpu-bonus.json` erfolgreich hochgeladen. `supabase/functions/new hello-world` ist nicht erforderlich.
4. Im Supabase-Dashboard unter **Edge Functions** kontrollieren, ob `submit-statistics` angezeigt wird. Die öffentliche URL hat die Form `https://PROJECT_REF.supabase.co/functions/v1/submit-statistics`. In [`supabase/config.toml`](../supabase/config.toml) steht bewusst `verify_jwt = false`, damit freiwillige Beiträge ohne Benutzerkonto möglich sind. Das ist **keine** Missbrauchssicherung.
5. **Vor Freischaltung testen:** Eine `POST`-Anfrage mit Body `{}`, Header `Origin: https://ff4f-git.github.io` und `Content-Type: application/json` sollte mit HTTP 400 und `{"ok":false}` abgelehnt werden; dabei darf kein Datensatz entstehen. Ein fehlender oder fremder `Origin` sollte HTTP 403 liefern. Anschließend mit einem ausdrücklich genehmigten **gültigen** Testdatensatz Erfolg, identische Wiederholung (keine Doppelzählung), ungültige Eingaben, gesperrten öffentlichen Lesezugriff und Löschjob prüfen. Der Negativtest allein beweist noch nicht, dass Speicherung funktioniert.
6. **Cron und Zugriff prüfen** (privater SQL Editor):

   ```sql
   select jobid, jobname, schedule, active from cron.job
   where jobname = 'purge-questionnaire-statistics';
   select count(*) from public.questionnaire_statistics;
   ```

   Den tatsächlichen Joblauf in `cron.job_run_details` prüfen, sobald ein Lauf stattgefunden hat. Die Migration löscht täglich um 03:15 Uhr nach Datenbank-/Cron-Zeitzone Datensätze mit `submitted_on <= current_date - 89`. Backup- und Plattformprotokoll-Aufbewahrung sind separat zu prüfen. Für RLS und RPC-Rechte zusätzlich im Dashboard kontrollieren, dass `anon`/`authenticated` keine Lese-/Schreibrechte erhalten.
7. **Datenschutz vor Aktivierung:** Tatsächlichen Betreiber, Supabase-Anbieter und Region, Zweck, konkrete Felder, Einwilligung, Aufbewahrung, technische Verarbeitung von IP-Adressen und Log-Aufbewahrung in den Datenschutzhinweisen nennen. Die Anwendung speichert in der Statistik keine IP, keinen User-Agent, keinen Referrer und keine genaue Uhrzeit; die Infrastruktur kann solche Daten dennoch verarbeiten. Seltene Antwortprofile können unterscheidbar sein – keine vollständige Anonymität versprechen. Einwilligungstext in `assets/app.js` auf Deutsch und Englisch prüfen.
8. **Erst nach allen Prüfungen:** Nur die öffentliche Funktions-URL in [`assets/statistics-config.js`](../assets/statistics-config.js) eintragen und über GitHub Pages veröffentlichen. **Nie** den `SUPABASE_SERVICE_ROLE_KEY` im Frontend ablegen. `SUPABASE_URL` und `SUPABASE_SERVICE_ROLE_KEY` sind serverseitige Supabase-Funktionsumgebung; optional `STATISTICS_ORIGIN` (Standard `https://ff4f-git.github.io`). Vorher bleibt der Statistik-Button deaktiviert.

### Auswertung (nur privat)

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

Nur ein ausdrücklicher Klick nach dem Ergebnis übermittelt. Die Serverfunktion validiert Eingaben und berechnet die Top 3 selbst. Wiederholungen derselben Übertragungs-ID sind idempotent; nach einem Neuladen kann ein neuer Beitrag gezählt werden. **Gezählt werden Beiträge, nicht eindeutige Personen.** Origin-Prüfung und 1.000 Beiträge pro Tag begrenzen Missbrauch nur eingeschränkt; CORS ist keine Authentifizierung. Bei höherem Traffic serverseitige Ratenbegrenzung/Bot-Abwehr prüfen. Statistikdatensätze werden täglich gelöscht und sollen höchstens 90 Tage verbleiben; Backups/Logs separat behandeln. Bei Änderungen am Bewertungsmodell Client- und Servermodell gemeinsam aktualisieren und die Funktion erneut deployen. Lokale Tests: `node --test tests/statistics.test.mjs`. Diese ersetzen keine Live-Prüfung.

---

## English

### Setup and deployment

**Do not copy the reporting queries below to create the table.** Run the entire [SQL migration](../supabase/migrations/202610270001_statistics.sql) in the **private Supabase SQL Editor** first. It creates `public.questionnaire_statistics`, enables RLS, revokes public table permissions, grants the recording RPC only to `service_role`, and schedules daily deletion using `pg_cron`.

1. Create a Supabase project in an appropriate region. Keep passwords, access tokens and the service-role key private. Connecting GitHub does **not** automatically deploy the function.
2. From the repository root on Linux, use Git, Node.js, npm and the official CLI via `npx`:

   ```bash
   git clone https://github.com/ff4f-git/distrochooser.git
   cd distrochooser
   npx supabase login
   npx supabase link --project-ref PROJECT_REF
   npx supabase functions deploy submit-statistics --use-api
   ```

   If already cloned, use your existing directory and `git pull` after checking local changes. Replace `PROJECT_REF` with your project reference. On the operator's Linux system, normal deployment failed with `entrypoint path does not exist` even though `index.ts` existed and was readable. `--use-api` successfully uploaded `index.ts`, `validate.js`, `model.json` and `gpu-bonus.json`. Do not create a `hello-world` function.
3. Verify `submit-statistics` appears under **Supabase → Edge Functions**. Its public URL is `https://PROJECT_REF.supabase.co/functions/v1/submit-statistics`. [`supabase/config.toml`](../supabase/config.toml) sets `verify_jwt = false` to allow contributions without accounts; this does not prevent abuse.
4. **Test before enabling:** A `POST` with JSON `{}`, `Origin: https://ff4f-git.github.io`, and `Content-Type: application/json` should return HTTP 400 and `{"ok":false}` without inserting a row. Missing or unexpected origins should return HTTP 403. Then use an explicitly approved **valid** test submission to verify insertion, idempotent retry, invalid input rejection, denied public reads, and the deletion job. A rejected invalid request alone does not prove successful storage.
5. In the private SQL Editor verify the scheduled job and record count:

   ```sql
   select jobid, jobname, schedule, active from cron.job
   where jobname = 'purge-questionnaire-statistics';
   select count(*) from public.questionnaire_statistics;
   ```

   Inspect `cron.job_run_details` after the job has run. The migration schedules deletion at 03:15 in the database/cron time zone for rows with `submitted_on <= current_date - 89`. Verify RLS and denied `anon`/`authenticated` access; review provider logs and backups separately.
6. **Privacy review is mandatory before launch:** Publish accurate details about the operator, Supabase region, purpose, collected fields, consent, retention, technical IP processing and platform logs. No IP, user agent, referrer or exact timestamp is stored in the statistics table, but infrastructure may still process them. Rare answer combinations may be distinguishable; do not promise complete anonymity. Review the German and English consent text in `assets/app.js`.
7. **Only after verification**, put the public function URL in [`assets/statistics-config.js`](../assets/statistics-config.js) and publish the site. Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code. `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` belong in the Supabase function environment; optional `STATISTICS_ORIGIN` defaults to `https://ff4f-git.github.io`. Until the URL is configured, the contribution button stays disabled.

### Private reporting

Use the three SQL reporting queries in the German section above in the **private** SQL Editor only. They show top recommendations by model version, answer combinations with at least five submissions, and per-question answer counts. Answer codes are in `assets/model.json`. Never expose raw rows or a public read API; keep model versions separate. The five-submission threshold applies only to the grouped-combinations query.

### Limitations and maintenance

Only an explicit post-result click submits answers. The server validates input and recomputes the top three. Retries with the same submission ID are idempotent, but reloading may create another contribution. Counts measure **submissions, not unique visitors**. Origin checking and a global limit of 1,000 submissions/day are basic controls, not authentication or robust bot protection. Add server-side rate limiting or bot mitigation if needed. Daily deletion targets retention of no more than 90 days; provider logs and backups require separate review. Keep client and server scoring models in sync and redeploy after model changes. Run `node --test tests/statistics.test.mjs` locally, then perform live database and endpoint checks.
