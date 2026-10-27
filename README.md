# Linux Distrochooser

**[Deutsch](#deutsch) · [English](#english)**

A bilingual, browser-based Linux distribution recommender. Answer a few questions and discover three Linux distributions that may suit your hardware, experience, and preferences.

> **Live demo:** https://ff4f-git.github.io/distrochooser/

---

## Deutsch

![Linux Distrochooser – deutsche Terminal-Oberfläche](docs/images/distrochooser.jpg)

### Finde ein Linux, das zu dir passt

Linux bietet viele Möglichkeiten – aber welche Distribution passt zu deinem Alltag? **Linux Distrochooser** hilft dir, diese Frage spielerisch und nachvollziehbar zu beantworten. Statt eine beliebige Rangliste anzuzeigen, fragt das Tool nach deinen Anforderungen und vergleicht sie mit einem redaktionell gepflegten Bewertungsmodell.

**Das bietet der Distrochooser:**

- Acht Fragen zu Einsatzzweck, Hardware, Bedienung, Gestaltung, Anpassbarkeit, Wiederherstellung und Linux-Erfahrung.
- Zwei bedingte Zusatzfragen zu Arbeitsspeicher und Grafikkarte.
- Eine Auswahl aus **22 Distributionsvarianten**.
- Drei Empfehlungen mit kurzen Erläuterungen und relativer visueller Einordnung.
- Umschaltbare Oberfläche auf **Deutsch und Englisch**, auch während des Fragebogens.
- Eine transparente Punktematrix und eine dokumentierte Bewertungslogik.
- Freiwillige Ergebnisstatistik nach dem Test mit öffentlicher Top-3-Rangliste.

### Wie entstehen die Empfehlungen?

Jede Antwort ist mit Gewichtungen für die berücksichtigten Distributionen verknüpft. Der Distrochooser addiert diese Werte und berücksichtigt bei Gaming gegebenenfalls die Grafikkarte. Anschließend werden die drei höchsten Ergebnisse angezeigt. Die Balken dienen der **relativen Darstellung**, nicht als objektive Qualitäts- oder Kompatibilitätsprozente.

Die Gewichtungen sind bewusst redaktionelle Einschätzungen. Sie können sich mit der Entwicklung von Distributionen ändern und ersetzen keine eigene Recherche, insbesondere bei Treibern, Hardware-Kompatibilität und Spielen mit Anti-Cheat.

**Freiwillige Statistik (Stand 27.10.2026):** Live und erfolgreich getestet: Beiträge werden ausschließlich nach ausdrücklichem Klick auf „Ergebnis zur Statistik beitragen“ übertragen. Nach erfolgreichem Beitrag erscheint ein zusätzlicher Link „Öffentliche Statistik ansehen“ im Ergebnisbereich; der Footer-Link ist immer sichtbar. Die [öffentliche Statistik](statistik.html) zeigt ab dem ersten Beitrag die Gesamtzahl und maximal drei Distributionen, sortiert nach Häufigkeit ihrer **Erstplatzierung** (bei Gleichstand alphabetisch). Es handelt sich um Empfehlungen des Modells, nicht um Nutzerstimmen für eine Distribution. Die Statistik umfasst etwa 90 Tage und ist nicht repräsentativ. [Betrieb und Einrichtung (DE/EN)](docs/statistics-setup.md) · [Öffentliche Auswertung](docs/public-statistics.md).

Mehr dazu: [Konzept](docs/konzept.md) · [Bewertungslogik](docs/bewertungslogik.md) · [Punktematrix](data/punktematrix.xlsx)

---

## English

![Linux Distrochooser – English terminal interface](docs/images/distrochooser-en.jpg)

### Find a Linux distribution that fits you

Linux offers a wealth of choices, but where should you start? **Linux Distrochooser** is an interactive questionnaire that helps you explore distributions based on your needs, rather than presenting a generic popularity ranking.

**Features:**

- Eight questions covering usage, hardware, ease of use, appearance, customization, recovery options, and Linux experience.
- Two conditional follow-up questions about RAM and graphics hardware.
- **22 distribution variants** to compare.
- Three recommendations with brief explanations and relative visual comparisons.
- A **German/English** language switch that works throughout the questionnaire.
- An inspectable scoring matrix and documentation of the recommendation model.
- Optional post-result statistics contribution with a public top-three ranking.

### How does it work?

Each answer contributes weighted points to the included distributions. Gaming-related answers may also include a graphics-hardware adjustment. The three highest-scoring distributions are then shown. The visual bars express **relative scores**, not objective quality or compatibility percentages.

Weights reflect editorial judgment and may change as distributions evolve. Always verify hardware, driver, and game compatibility independently, especially for multiplayer games with anti-cheat systems.

**Optional statistics (27 October 2026):** Live and tested. Only an explicit click submits a result. After a successful contribution, a “View public statistics” link appears in the results; the footer link remains available to everyone. The [public dashboard](statistik.html) displays the total and up to three most frequent **first-choice recommendations** starting with the first contribution (alphabetical tie-break). These are model recommendations, not votes for a distribution. Figures cover approximately 90 days and are not representative. [Operations guide](docs/statistics-setup.md) · [Public statistics](docs/public-statistics.md).

For a closer look, see the [concept](docs/concept.md), [scoring documentation](docs/scoring-logic.md), and [scoring matrix](data/punktematrix.xlsx).

---

## Project structure / Projektstruktur

```text
index.html                  Web application / Webanwendung
assets/app.js               Questionnaire, language switch, scoring, results
assets/styles.css           Visual design / Gestaltung
assets/icons.js             Distribution icon mappings
data/punktematrix.xlsx      Source scoring matrix / Punktematrix
assets/model.json           Distribution points and German questions
assets/gpu-bonus.json       Gaming GPU adjustments
assets/questions-en.json    English questions and answer labels
assets/descriptions-de.json German result descriptions
assets/descriptions-en.json English result descriptions
assets/statistics-config.js  Active public statistics endpoint
supabase/migrations/         Private storage and public aggregation SQL migrations
supabase/functions/          Server-side submission handler / Serverfunktion
docs/statistics-setup.md     Bilingual setup and operations / Anleitung DE/EN
statistik.html                Public statistics dashboard / Öffentliche Statistik
datenschutz.html             Privacy notice / Datenschutzhinweise
docs/public-statistics.md    Public dashboard configuration / Einrichtung
docs/                       Concept and scoring notes / Dokumentation
```

**Technology / Technik:** Vanilla HTML, CSS, and JavaScript modules. No framework or user account required for the questionnaire. Recommendations run entirely in the browser using local JSON assets loaded through HTTP(S). The optional statistics feature uses a separate Supabase database and Edge Function only when explicitly enabled and submitted by a visitor.

**License / Lizenz:** No open-source license has been granted yet. All rights reserved until a license is explicitly added.
