# Freiwillige Statistik / Optional statistics

## Status
Die Oberfläche und der Servercode sind vorbereitet. Solange `assets/statistics-config.js` eine leere URL enthält, bleibt der Button deaktiviert. Es findet keine Statistikübertragung statt. GitHub Pages kann die Datenbank und Serverfunktion nicht selbst betreiben.

## Einrichtung (Supabase)
1. Ein Supabase-Projekt anlegen und Region sowie Betriebsprotokoll-Aufbewahrung passend wählen. Keine Zugangsschlüssel in GitHub oder im Chat veröffentlichen.
2. Im privaten SQL Editor `supabase/migrations/202610270001_statistics.sql` ausführen. Die Migration aktiviert RLS, entzieht öffentlichen Datenzugriff und richtet tägliche Löschung ein. Prüfen, dass der Cron-Job erfolgreich läuft.
3. Mit der offiziellen Supabase CLI das Projekt verbinden (`supabase login`, `supabase link --project-ref PROJECT_REF`). Die Funktion `supabase functions deploy submit-statistics` aus dem Repository-Hauptverzeichnis deployen. `config.toml` erlaubt bewusst Aufrufe ohne Benutzerkonto; der Handler validiert Inhalt, Größe und Origin.
4. Die öffentliche Funktions-URL `https://PROJECT_REF.supabase.co/functions/v1/submit-statistics` in `assets/statistics-config.js` setzen. Der Service-Role-Schlüssel bleibt ausschließlich in Supabase. `SUPABASE_URL` und `SUPABASE_SERVICE_ROLE_KEY` werden dort als Funktionsumgebung bereitgestellt. Optional `STATISTICS_ORIGIN` setzen (Standard `https://ff4f-git.github.io`).
5. Vor Aktivierung die Datenschutzhinweise um den konkreten Betreiber, Supabase-Projekt/Region, Zweck, Datenfelder, Speicherfrist und die tatsächliche Verarbeitung von IP-Adressen und Betriebsprotokollen ergänzen. Der Einwilligungstext steht zweisprachig in `assets/app.js`. Keine vollständige Anonymität zusagen: seltene Antwortprofile und Infrastrukturprotokolle sind zu berücksichtigen.
6. Einen ausdrücklich freigegebenen Testdatensatz senden; Erfolg, identische Wiederholung, Fehlerfall, öffentlichen Lesezugriff und Löschjob prüfen. Erst dann die URL-Änderung veröffentlichen. Die echten Antworten normaler Besucher werden niemals automatisch gesendet.

## Auswertung
Im privaten Supabase SQL Editor:

```sql
-- Erstempfehlungen je Modellversion
select model_version, top3->>0 as recommendation, count(*)
from public.questionnaire_statistics group by 1,2 order by count(*) desc;

-- Häufige Antwortkombinationen mit den zugehörigen Top 3
select model_version, answers, ram, gpu, top3, count(*)
from public.questionnaire_statistics
group by 1,2,3,4,5 having count(*) >= 5 order by count(*) desc;

-- Einzelne Antworten je Frage (Fragenpositionen beginnen bei 1)
select model_version, question_number, answer_code, count(*)
from public.questionnaire_statistics,
 lateral jsonb_array_elements(answers) with ordinality as q(selected, question_number),
 lateral jsonb_array_elements_text(q.selected) as a(answer_code)
group by 1,2,3 order by 2, count(*) desc;
```

Die Codes stehen in `assets/model.json`. Seltene Kombinationen werden durch `having count(*) >= 5` ausgeblendet; einzelne Antwortzählungen bleiben privat. Kein öffentliches Dashboard und keine öffentliche Lese-API. Modellversionen bei Auswertungen getrennt halten.

## Grenzen und Wartung
- Nur ein bewusster Klick sendet. Keine vorangekreuzte Auswahl, kein automatischer Upload beim Ergebnis oder Sprachwechsel.
- Antwortreihenfolgen werden normalisiert; nicht zutreffende RAM-/GPU-Angaben werden verworfen. Der Server berechnet die Top 3 aus seiner Modellkopie selbst.
- Eine zufällige Übertragungs-ID gilt nur je Antwortprofil und geöffneter Seite. Wiederholungen nach Netzfehlern sind idempotent. Ein Neuladen kann erneut zählen; es werden weder Personen noch eindeutige Besucher gezählt.
- Origin-Prüfung und ein globales Limit von 1.000 Beiträgen/Tag begrenzen Missbrauch, verhindern aber keine gezielten gefälschten Beiträge. CORS ist keine Authentifizierung. Bei mehr öffentlichem Traffic vor Aktivierung zusätzliche serverseitige Ratenbegrenzung/Bot-Abwehr vorsehen. Das Tageslimit kann bei Angriffen auch ehrliche Beiträge blockieren.
- Keine IP, User-Agent, Referrer oder genaue Uhrzeit im Datensatz. Der Dienst sieht die IP technisch trotzdem; Plattformprotokolle separat konfigurieren. Datensätze werden täglich gelöscht, sodass sie höchstens 90 Tage verbleiben; Backups/Plattformprotokolle separat prüfen.
- Bei Bewertungsänderungen die Modellversion im Client und Validator erhöhen und beide JSON-Kopien unter `supabase/functions/submit-statistics/` gemeinsam aktualisieren/deployen.
- Prüfungen: `node --test tests/statistics.test.mjs`. Backend-Deployment und PostgreSQL-Checks sind zusätzlich im Zielprojekt erforderlich.

## English setup summary
The client and backend are implemented but collection is disabled until a real endpoint is configured. Create a Supabase project, run the SQL migration privately, link the project with the official CLI and deploy `submit-statistics`. Set only the public function URL in `assets/statistics-config.js`; never publish the service-role key. Review the bilingual consent text and publish privacy information covering the actual operator, region, operational logs and retention before enabling collection. Verify insertion, retry deduplication, denied public reads and the daily deletion job in the deployed project.

Only an explicit post-result click submits data. The server validates answer codes and recomputes recommendations. Reports above show top recommendations, common profiles and individual answers; run them privately. There is no public read endpoint. The daily cap and origin validation are basic abuse controls, not proof of a real visitor. Counts represent voluntary submissions, not unique people. Records are retained for at most 90 days; provider logs and backups require separate configuration. No live end-to-end test is possible until a Supabase project is connected and deployed.
