# Linux Distrochooser – Concept v2.0

**[Deutsch](konzept.md) · English**

## The idea
We do **not want another distro chooser that favors its developer’s favorite distributions or whatever systems are currently hyped**. Instead, we aim to consider each distribution’s strengths and weaknesses as objectively as possible.

Appearance and preinstalled software are not the only factors. What matters is **the underlying technical concept and how its components work together**: for example, the update and maintenance model, package management, system architecture, security, and recovery. Many features can be added later, but integration and long-term maintenance effort vary.

Beginners **do not** need to know these technical terms. We translate the key requirements into eight simple questions. The answers and a deliberately selective scoring matrix produce three suitable recommendations—possibly including a distribution the visitor had never considered.

**Guiding principle: There is no single best Linux distribution. It depends on your requirements.**

### Where the idea came from

A key inspiration was **Chris Titus** and his response, in essence, to the question of which Linux distribution is best: **“It depends on …”** That thought crystallized an idea that had been taking shape for years: rather than repeatedly declaring the same distributions to be the best for everyone, start with the person and their needs. This became the foundation for a chooser that asks as few clear, approachable questions as possible while still offering meaningful, individualized recommendations. Linux knowledge should not be a prerequisite for getting a recommendation—the recommendation should help people take their first steps into Linux.

## Who is this chooser for?

Our primary audience is **Linux beginners, people switching operating systems, and anyone who doesn't yet know which distribution to choose**. Someone who already knows their preferred init system, package format, or release model can make a more targeted choice independently. Asking about those details up front would discourage the very people we want to welcome. Experienced users can use the tool too, but they should not determine how complicated the entry point becomes.

**Users should not have to understand Linux before choosing a distribution. The chooser should understand the user first.** We therefore ask about everyday needs, hardware, expectations, and willingness to maintain a system—not Linux terminology. The expertise lives in the scoring model behind the questions.

### Deliberately limited complexity

Linux is flexible: with enough expertise and effort, many distributions can be configured for very different tasks. So **“Can distribution X do this?”** is rarely the useful question. Instead we ask: **“How well do distribution X's design principles and typical setup and maintenance requirements suit this person?”** We evaluate practical suitability as a starting point, not every theoretically possible configuration.

Every additional question must meaningfully improve the recommendations. Including a question just because a technical distinction exists does not automatically make the tool better. **Keep it simple does not mean simplistic; it means selective:** a welcoming experience for beginners, with understandable differentiation behind the scenes. A recommendation should be an inviting first step, not a technical entrance exam.

## Eight main questions
1. **Main use:** Everyday tasks, office work, gaming, creative work, programming, experimenting (multiple selections).
2. **Device type:** Desktop, laptop, mini PC/other, or no device yet.
3. **Device age:** Devices at least eight years old trigger a RAM follow-up question.
4. **Approach to the system:** Simply use it, learn Linux, or configure it yourself.
5. **Appearance:** What kind of interface do you prefer?
6. **Customization:** How much should you be able to change?
7. **Recovery:** How important is the ability to undo changes?
8. **Linux experience:** Deliberately asked last.

The GPU question appears **only for gaming**. “I don’t know” is a valid answer and adds no GPU bonus.

## Scoring principles
- **Suitability over popularity:** No favorite distribution and no blanket ranking.
- **Clear differentiation:** Positive and negative scores reveal real differences; no artificially narrow, mostly positive ratings.
- **Relevance determines weight:** Fundamental requirements matter more than appearance, for example.
- **Experience does not imply a desire for maintenance work:** Experts may also prefer an uncomplicated system. The strong expert weighting accounts for demanding systems without making them automatic winners.
- **No steering toward a predetermined result:** The matrix is not adjusted to produce a particular winner.

The **specific scoring ranges, explanations, and calculation rules** are documented in [Scoring logic](scoring-logic.md); individual values are in the [Excel scoring matrix](../data/punktematrix.xlsx).

## Results and limitations
The tool displays **three recommendations** with brief descriptions and purely visual comparison bars. Results show **neither percentages nor point totals**. The bar for the highest total actually achieved is completely filled; the other bars use an internally shortened scale from 50 to 100% of that best score. The bars help compare rank and distance; they do not express the probability of suitability. Specific hardware, application, and game compatibility may need separate verification. Snapshots do not replace backups.

## Implementation
- **22 curated distribution variants**, deliberately excluding Manjaro.
- Local calculation in the browser, without an AI API or a dedicated scoring backend.
- Dark terminal appearance in navy and cyan, with progress, Back/Next, and restart.
- The live website retains the closing invitation **“Would you like to try Linux and switch?”** with **“Start an IT inquiry.”**

**KISS:** Eight understandable questions for visitors, with transparent, differentiated scoring behind the scenes.
