# Eigene Distrochooser-Instanz verwalten

[Supabase-Einrichtung](statistics-setup.md) · [Konzept](konzept.md)

## Einrichtung nach Fork oder Download

1. Das Projekt in ein **eigenes GitHub-Repository** forken oder hochladen und die Website selbst hosten.
2. Ein **eigenes Supabase-Projekt** gemäß [Installationsanleitung](statistics-setup.md) einrichten.
3. Die fest eingetragenen Projektadressen anpassen:
   - `supabase/functions/catalog-admin/index.ts`: `REPO` auf `eigener-name/eigenes-repo` und `ORIGIN` auf den Ursprung der eigenen Website setzen.
   - `supabase/functions/submit-statistics/index.ts`: `STATISTICS_ORIGIN` für die eigene Website setzen.
   - `assets/admin.js`, `assets/catalog-client.js` und `assets/statistics-config.js`: die Supabase-Funktions-URLs durch die URLs des **eigenen Projekts** ersetzen.
4. Beide Edge Functions deployen und den initialen Katalog in Supabase registrieren (siehe Installationsanleitung).
5. Für das **eigene Repository** einen GitHub Fine-grained Token mit **Contents: Read and write** erstellen. Den Token nur im Admin-Panel der eigenen Website verwenden, nicht in Code oder Konfiguration speichern.

## Änderungen veröffentlichen

1. Im eigenen `admin.html` den GitHub-Token eingeben.
2. Unter **Distributionen** Stammdaten, DE/EN-Texte, Stärken und Aktivierung bearbeiten.
3. Unter **Fragen & Punkte** die Bewertungen für Fragen, RAM und GPU anpassen.
4. **Speichern & veröffentlichen** schreibt die aktualisierte `data/distributions.json` und die benötigten Laufzeitdateien in das eigene GitHub-Repository und aktiviert dieselbe Katalogversion im eigenen Supabase-Projekt.

Die JSON-Datei ist die **einzige Datenquelle** für die Bewertungen. Die daraus erzeugten Laufzeitdateien nicht einzeln bearbeiten. Für reine Punkteänderungen ist kein erneutes Edge-Function-Deployment erforderlich.

Tests: `node --test tests/*.test.mjs`. GitHub-Tokens gehören nicht ins Repository; der Supabase-Service-Schlüssel bleibt ausschließlich serverseitig.
