# Scoring logic

**[Deutsch](bewertungslogik.md)** · [Current scores](scores-en.md) · [Excel scoring matrix](../data/punktematrix.xlsx)

Scores are **editorial suitability assessments**, not rankings of quality or popularity. They reflect how well a distribution fits a requirement **without unnecessary extra setup**. Clear differences between distributions are intentional.

- **Positive points:** particular suitability; **0:** neutral; **negative points:** a meaningful drawback.
- Selected use cases and answers to subsequent questions are added together. The RAM follow-up is conditional on device age; the GPU follow-up appears for gaming.
- GPU bonuses apply only to gaming. Designated neutral “don't know”/“no preference” answers score 0.
- The **three highest distinct totals** define recommendation ranks. Ties share a rank, so more than three results may be shown.
- Bars show relative scores, **not** compatibility percentages.

**Source of truth:** `data/distributions.json` is edited through [administration](administration.md). Score tables and the Excel matrix are generated outputs, not inputs.
