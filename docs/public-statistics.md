# Öffentliche Statistik / Public statistics

## Deutsch — aktueller Stand (27.10.2026)

Die Statistik ist auf [statistik.html](https://ff4f-git.github.io/distrochooser/statistik.html) öffentlich erreichbar. Die freiwillige Teilnahme ist **Opt-in**: Nur nach dem ausdrücklichen Klick auf „Ergebnis zur Statistik beitragen“ wird ein Datensatz an Supabase gesendet. Nach erfolgreichem Versand erscheint im Ergebnisbereich ein zusätzlicher Link „📊 Öffentliche Statistik ansehen“ im Stil der Fragebogen-Auswahl. Ohne Teilnahme bleibt dieser zusätzliche Link verborgen; der Link im Footer ist für alle sichtbar.

Die öffentliche Seite zeigt **ab dem ersten Beitrag** die Gesamtzahl und **maximal drei** Distributionen mit den meisten **Platz-1-Empfehlungen**. Ein Beitrag zählt genau eine Erstempfehlung (das erste Element der vom Server berechneten Top 3). Die Plätze 2 und 3 der **öffentlichen Rangliste** sind die zweit- und dritthäufigsten Erstempfehlungen über alle Beiträge hinweg, **nicht** die Zweit- und Drittplatzierungen innerhalb einzelner Fragebogenergebnisse. Bei Gleichstand entscheidet der Distributionsname alphabetisch. Solange weniger als drei verschiedene Erstempfehlungen vorliegen, werden entsprechend weniger Einträge angezeigt. Beiträge sind keine eindeutigen Personen und keine Abstimmungen für eine bevorzugte Distribution. Der Zeitraum umfasst ungefähr die letzten 90 Tage.

### Einrichtung / Migrationen

1. `supabase/migrations/202610270001_statistics.sql`: private Tabelle, sichere Schreib-RPC, RLS und täglicher Löschjob.
2. `supabase/migrations/202610270002_public_statistics.sql`: ursprüngliche öffentliche Aggregation mit Fünfer-Schwelle (**historisch**, nicht mehr der aktuelle Stand).
3. **`supabase/migrations/202610270003_top_three_from_first.sql`**: aktuelle Aggregation, ersetzt `public.public_statistics()` durch die Top-3-Rangliste **ab einem Beitrag**. Im Supabase SQL Editor ausführen, nachdem die vorherigen Migrationen angewendet wurden. Die Betreiberbestätigung für diesen Schritt liegt vor.
4. Die bestehende Edge Function `submit-statistics` bedient `POST` (Opt-in) und `GET` (öffentliche Aggregation). Für die reine SQL-Änderung ist **kein** erneutes Deployment nötig. Bei späteren Änderungen der Edge Function: `git pull && npx supabase functions deploy submit-statistics --use-api` im verknüpften lokalen Repository.

Die Rohdatentabelle bleibt für `anon` und `authenticated` gesperrt. Die `public_statistics()`-RPC darf nur die `service_role` ausführen; die Edge Function gibt ausschließlich aggregierte Namen und Häufigkeiten aus. **Datenschutzhinweis:** Die frühere Fünfer-Schwelle ist bewusst entfernt. Auch seltene Erstempfehlungen mit nur einem Beitrag sind jetzt öffentlich sichtbar. Die Ergebnisse sind deshalb nicht als anonymitätsgarantiert zu bezeichnen. Einzelne Antworten, RAM-/GPU-Angaben und vollständige Antwortprofile werden nicht öffentlich ausgegeben. Für operative Details siehe [Statistik-Anleitung](statistics-setup.md).

## English — current status (27 October 2026)

The [public dashboard](https://ff4f-git.github.io/distrochooser/statistik.html) is live. Contributions are strictly **opt-in**, sent only when the visitor clicks the contribution button after receiving recommendations. A questionnaire-style “View public statistics” link appears **after a successful contribution**; the footer link is always available.

Starting with the **first contribution**, the dashboard displays the total and up to **three most frequent first-choice distributions**. Each submission contributes one first-choice recommendation, not all three recommendations. Public ranks #2 and #3 are the second- and third-most frequent **first-choice** distributions across submissions, not the second and third recommendations within a single submission. Ties are sorted alphabetically. Fewer than three distinct first-choice distributions yield fewer rows. These are model-generated recommendations, **not user votes**, and submissions are not unique visitors. Data covers approximately 90 days.

Apply SQL migrations in order: `202610270001_statistics.sql` (private storage), `202610270002_public_statistics.sql` (original five-count threshold, historical), then **`202610270003_top_three_from_first.sql`** (current public aggregation from one contribution). The operator has confirmed running the final migration. The SQL-only change does **not** require redeploying the Edge Function. For future Edge Function changes, deploy using `npx supabase functions deploy submit-statistics --use-api`.

The public GET endpoint exposes aggregate recommendation names and counts only. Direct anonymous table access remains blocked. The previous minimum-five suppression **no longer applies**, so even a recommendation with a single contribution may be visible; this is not a formal anonymity guarantee. See [operations guide](statistics-setup.md).
