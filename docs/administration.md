# Distributionen verwalten

Der geschützte Bearbeitungszugang befindet sich unter [admin.html](../admin.html). Es gibt keinen separaten Tabelleneditor: Eine Distribution auswählen, Beschreibung und Werte unter den jeweiligen Fragen bearbeiten, unten **Speichern & veröffentlichen** wählen.

## Zugang

Ein kurzlebiger GitHub Fine-grained Personal Access Token benötigt ausschließlich Zugriff auf `ff4f-git/distrochooser` und **Contents: Read and write**. Das GitHub-Konto muss Schreibrecht für das Repository besitzen. Der Token wird nicht im Repository, Local Storage, Cookies oder in der Datenbank gespeichert. Der Browser hält ihn nur im Arbeitsspeicher; Abmelden oder Schließen der Seite entfernt ihn. Der Server prüft die GitHub-Rechte bei jedem Admin-Zugriff. Token niemals im Chat oder in Issues posten.

## Bearbeiten, hinzufügen und deaktivieren

- Alle acht Fragen einschließlich RAM-/GPU-Werten erscheinen mit ihren Antworttexten. Ganze Zahlen zwischen −100 und +100 sind erlaubt; neutrale Egal-/Unbekannt-Antworten bleiben 0.
- **Hinzufügen** erzeugt ein Formular mit leeren Punktfeldern. Alle Werte und deutsch/englischen Texte einschließlich drei Stärken ausfüllen. Eine eindeutige, dauerhafte ID vergeben. Die ID einer veröffentlichten Distribution ist unveränderlich.
- **In Empfehlungen anzeigen** deaktiviert oder aktiviert die Distribution. Deaktivieren ersetzt endgültiges Löschen: Frühere Versionen bleiben für bereits geöffnete Fragebögen und Statistiken verfügbar.
- Name, Beschreibungen und optionaler offizieller HTTPS-Link lassen sich ändern. Neue Distributionen erhalten zunächst ein neutrales Linux-Symbol.
- Es werden keine Änderungen gespeichert, bevor **Speichern & veröffentlichen** betätigt wird. Beim Verlassen mit ungespeicherten Änderungen erscheint eine Rückfrage.

## Ein Datenstand, alle Ausgaben

`data/distributions.json` enthält den vollständigen versionierten Katalog mit stabilen IDs, aktiv/inaktiv, Texten, Stärken, Symbolen, Punkten und GPU-Boni. Eine Veröffentlichung erzeugt daraus automatisch:

- `assets/model.json` und die entsprechende Statistikmodell-Kopie;
- beide GPU-Dateien, Beschreibungen und Symbole;
- `data/punktematrix.xlsx` als **Export**, nicht als Eingabequelle;
- `docs/scores-de.md` und `docs/scores-en.md` mit vollständigen aktuellen Punktetabellen.

Auch `bewertungslogik.md` und `scoring-logic.md` werden mit den aktuellen Tabellen erzeugt. Die bisherigen ausführlichen Begründungen bleiben unter `scoring-rationale-de.md` und `scoring-rationale-en.md` als redaktionelle Dokumente mit historischen Beispielen erhalten.

Die Edge Function `catalog-admin` erstellt einen Commit auf `main` und aktiviert danach denselben Katalog in einer Transaktion in Supabase. Erst dann meldet das Formular Erfolg. Bei einer Änderung auf `main` oder einer konkurrierenden Veröffentlichung wird ein veralteter Stand abgelehnt. Wenn nach dem Commit die Datenbank vorübergehend nicht erreichbar ist, kann derselbe Speichervorgang wiederholt werden; der identische Commit-Katalog wird dann aktiviert.

Die Website lädt einen vollständigen veröffentlichten Katalog über den öffentlichen Lesezugang der Funktion. Als Ausfallsicherung dient die vollständige statische Katalogdatei. Ein geöffneter Fragebogen behält seine Versionskennung. `submit-statistics` berechnet dessen Ergebnis mit genau dieser gespeicherten Version erneut. Neue Punktwerte benötigen dadurch **kein erneutes Edge-Function-Deployment**. Alte Versionen und bestehende Statistikdatensätze bleiben erhalten.

## Betrieb und Tests

Beide Funktionen werden mit `verify_jwt = false` bereitgestellt: `catalog-admin` prüft selbst GitHub-Schreibrechte; der öffentliche Lesezugriff liefert nur ohnehin öffentliche Katalogdaten. Schreibende Datenbankzugriffe sind ausschließlich mit dem serverseitigen Service-Key möglich. Tabellen und Aktivierungs-RPC sind für `anon` und `authenticated` gesperrt; RLS ist aktiv.

Neue Installation: Migration `202611010002_catalog_admin.sql` anwenden, initialen Katalog und den bisherigen Stand `2.2.0` als archivierte Version registrieren, beide Funktionen samt relativen Abhängigkeiten deployen. Die mitgelieferte `seed.json` bestimmt die unveränderliche Fragenstruktur. Keine Geheimnisse in den Client oder in Git schreiben.

Prüfen mit `node --test tests/*.test.mjs`. Die Tests kontrollieren unveränderte Ausgangswerte, Hinzufügen/Deaktivieren, Validierungsfehler, Versionsbindung, Ranggleichheit und Excel-Ausgabe. Die gespeicherten Statistikdaten werden durch Tests nicht verändert.
