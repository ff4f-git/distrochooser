# Bewertungslogik / Scoring logic

## Deutsch

Der Distrochooser bewertet die **Eignung einer Linux-Distribution für die ausgewählten Anforderungen**. Die Punkte sind redaktionelle Einschätzungen, keine allgemeine Qualitäts- oder Beliebtheitsrangliste. Bewertet wird vor allem, wie gut eine Distribution ohne unnötige Nacharbeit passt.

- **Positive Punkte** sprechen für die Eignung, **negative Punkte** für einen Nachteil; **0** ist neutral. Die Bewertungen sind ganze Zahlen von −100 bis +100.
- Die Punktwerte aller ausgewählten Antworten werden **addiert**. Es handelt sich nicht um Prozentwerte.
- Die **RAM-Zusatzfrage** wird bei der entsprechenden Auswahl zum Rechneralter berücksichtigt; der **GPU-Bonus** fließt nur ein, wenn Gaming als Einsatzzweck ausgewählt wurde.
- Vorgesehene neutrale Antworten wie „Egal“ oder „Weiß ich nicht“ erhalten **0 Punkte**.
- Es werden nur **aktive Distributionen** berücksichtigt. Die Ergebnisse werden nach Gesamtpunktzahl absteigend sortiert.
- Die **drei höchsten unterschiedlichen Gesamtpunktzahlen** bilden die Empfehlungsränge. Bei Gleichstand teilen sich Distributionen einen Rang; deshalb können mehr als drei Ergebnisse erscheinen.
- Die Ergebnisbalken sind **relative Vergleiche**, keine Kompatibilitätsprozente oder Hardwaregarantie.

**Datenquelle:** [`data/distributions.json`](../data/distributions.json). Dort liegen die konkreten Bewertungen; sie werden über die [Distributionsverwaltung](administration.md) gepflegt. Die Punktetabelle wird nicht zusätzlich als Markdown oder Excel dupliziert.

---

## English

Distrochooser scores **how well a Linux distribution fits the selected requirements**. Scores are editorial assessments, not a general quality or popularity ranking. The focus is on suitability without unnecessary extra configuration.

- **Positive scores** indicate a good fit, **negative scores** indicate a drawback, and **0** is neutral. Scores are integers from −100 to +100.
- Scores for all selected answers are **added together**; they are not percentages.
- The **RAM follow-up** is included when the relevant computer-age answer is selected; the **GPU bonus** applies only when gaming is selected as a use case.
- Designated neutral answers such as “No preference” or “I don't know” score **0**.
- Only **active distributions** are considered. Results are sorted by total score, highest first.
- The **three highest distinct totals** define the recommendation ranks. Tied distributions share a rank, so more than three results may be shown.
- Result bars show **relative comparisons**, not compatibility percentages or guaranteed hardware support.

**Source of truth:** [`data/distributions.json`](../data/distributions.json). Actual scores are maintained through [distribution administration](administration.md); no duplicate Markdown or Excel score tables are generated.
