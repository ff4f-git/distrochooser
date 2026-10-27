# Public statistics / Öffentliche Statistik

## Einrichtung (DE)
1. SQL aus `supabase/migrations/202610270002_public_statistics.sql` einmal im Supabase SQL Editor ausführen.
2. Auf dem Linux-Rechner im geklonten Repository `git pull` ausführen.
3. `npx supabase functions deploy submit-statistics --use-api` ausführen (Projekt muss verknüpft sein).
4. `https://ff4f-git.github.io/distrochooser/statistik.html` aufrufen. Unter fünf Beiträgen erscheinen noch keine Werte.

Die öffentliche GET-Schnittstelle gibt nur aggregierte Daten aus. Die Datenbanktabelle bleibt für anonyme Nutzer gesperrt. Jede einzelne Top-1-Gruppe muss mindestens fünf Einträge haben. **Wichtig:** Der Schwellenwert schützt vor kleinen Gruppen, bietet aber keine formale Anonymitätsgarantie. Die aggregierte Gesamtzahl wird erst ab fünf Beiträgen gezeigt.

## Setup (EN)
1. Run `supabase/migrations/202610270002_public_statistics.sql` once in the Supabase SQL Editor.
2. Run `git pull` in your local repository.
3. Run `npx supabase functions deploy submit-statistics --use-api` (linked project).
4. Visit `https://ff4f-git.github.io/distrochooser/statistik.html`. Counts stay hidden until five contributions exist.

The public GET endpoint returns aggregates only. Anonymous database table access remains blocked. Each first-choice group must have at least five entries.
