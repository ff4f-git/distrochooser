# Distributionsverwaltung

[Admin-Oberfläche](../admin.html) · [Supabase-Einrichtung](statistics-setup.md)

## Bearbeiten

1. Mit einem **kurzlebigen GitHub Fine-grained Token** anmelden: Repository `ff4f-git/distrochooser`, Berechtigung **Contents: Read and write**. Token nie veröffentlichen oder im Repository speichern.
2. Unter **Distributionen** Namen, Texte (DE/EN), drei Stärken je Sprache, Links und Aktivierung pflegen.
3. Unter **Fragen & Punkte** die acht Fragen und Zusatzfragen RAM/GPU bearbeiten. Jede Distribution ist eine Zeile; ganze Punktwerte von −100 bis +100 sind zulässig. Neutrale Antworten bleiben 0.
4. **Speichern & veröffentlichen** erzeugt einen GitHub-Commit und aktiviert dieselbe Katalogversion in Supabase. Änderungen verwerfen setzt den Entwurf zurück.

Neue Distributionen benötigen eine eindeutige, dauerhafte ID, vollständige Texte und alle Punktwerte. Deaktivierte Distributionen bleiben im Katalog, erscheinen aber nicht in neuen Empfehlungen. Löschungen werden erst beim Veröffentlichen wirksam.

## Daten und Veröffentlichung

**Einzige redaktionelle Quelle:** `data/distributions.json`. Automatisch erzeugt werden Website-/Statistikmodelle, GPU-Boni, Beschreibungen, Symbole und die [Excel-Matrix](../data/punktematrix.xlsx). **Diese Ausgaben nicht einzeln bearbeiten.**

`catalog-admin` veröffentlicht die Dateien auf GitHub und aktiviert die Katalogversion in Supabase. Die Website verwendet die veröffentlichte Version; die statische JSON-Datei ist ein Fallback. `submit-statistics` prüft freiwillige Beiträge anhand der zugehörigen archivierten Version. **Reine Punkte- und Katalogänderungen benötigen kein Edge-Function-Deployment.**

## Betrieb

Bei einer **Neuinstallation** alle fünf SQL-Migrationen in Reihenfolge anwenden, beide Edge Functions deployen und den ersten Katalogstand registrieren: [Schrittfolge](statistics-setup.md). Bestehende Installationen nicht neu initialisieren.

Tests: `node --test tests/*.test.mjs`. Der GitHub-Token bleibt nur während der Sitzung im Browser; Datenbank-Service-Schlüssel gehören ausschließlich auf den Server.
