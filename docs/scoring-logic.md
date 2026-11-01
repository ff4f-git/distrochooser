# Linux Distrochooser – Scoring logic v2.0

**[Deutsch](bewertungslogik.md) · English**

## 1. Basic principle
The Distrochooser does not recommend the most popular distributions or personal favorites. It compares the user’s requirements with distributions’ strengths and weaknesses, particularly their underlying technical concept and the interaction of their components.

**The goal is clear differentiation, not an evenly distributed set of scores.**

## 2. Assigning points and deliberate differentiation

The scoring matrix is **not a general quality ranking**. It evaluates how well a distribution’s overall technical concept fits **a specific requirement**.

- **High positive scores:** Demonstrable special suitability or targeted integration for the use case.
- **Low positive scores:** Suitability with less pronounced advantages.
- **Zero points:** No particular advantage or disadvantage.
- **Negative scores:** Specific disadvantages relative to the requirement.
- **High negative scores:** A clear conflict between the requirement and the distribution’s concept.

**The spread between negative and positive scores is explicitly intentional for every question.** The mere technical possibility of performing a task does not justify a high rating. Otherwise, versatile general-purpose systems would almost always win regardless of the answers, leaving little room for specialized distributions.

The available scoring ranges are therefore **used as fully as actual differences in suitability justify**. Differences must not be invented or exaggerated. Fairness means **consistent, transparent criteria**, not similar scores. Only the combination of all answers produces the individual total. This allows both general-purpose and specialized systems to win.

**Rule for new distributions:** Evaluate each answer separately based on the specific concept, existing integration, and actual suitability—not popularity, relationship to an existing distribution, or a desired final position.

## 3. Questions and weighting

| Question | Scoring range | Criterion |
|---|---|---|
| 1. Main use | −10 to +10 per selection | Suitability for the use case |
| 2. Device type | Laptop: −15 to +15; others: −10 to +10 | Suitability for the type of device |
| 3. Device age | −10 to +10 | Hardware requirements |
| 4. Approach to the system | −20 to +20 | Desired setup and maintenance effort |
| 5. Appearance | −5 to +5 | Visual preferences; deliberately lower weighting |
| 6. Customization | −10 to +10 | Desired freedom to customize |
| 7. Recovery | −10 to +10 | Usable system recovery, integration, and setup effort (not data backup) |
| 8. Linux experience | −20 to +40 | Experience and reasonable level of personal responsibility |
| RAM follow-up | −10 to +10 | Resource requirements of older computers |
| GPU follow-up | 0 to +5 | Additional gaming suitability |

**These are allowed scoring ranges, not the actual minimum and maximum values present in each answer column.** Specific points are listed in the Excel matrix.

### Question 1 – Main use: “Everyday use”

**Criterion:** How suitable is the distribution as an everyday desktop system? Consider the included software, a coherent interaction model, usability after installation, and the ability to select required applications **during installation**.

**Installation effort itself is not evaluated.** The mere possibility of installing additional programs later does not justify a high score either. Well-equipped systems that are immediately usable receive higher ratings than deliberately minimal systems that require typical everyday applications to be added afterward.

**Arch Linux (self-built): +5 points.** With `archinstall`, users can select a desktop and additional packages during setup. The score recognizes that choice, rather than an assumed easy or difficult installation method or an imagined, individually optimized configuration.

**EndeavourOS KDE: +3 points.** EndeavourOS deliberately ships a minimal KDE setup, leaving more typical everyday software to the user. Its lower score relative to Arch concerns this software provision concept, not an assumption that EndeavourOS is fundamentally less capable.

**Rule for new distributions:** Distinguish between software already included, software selectable during installation, and applications that must be set up later. Scores must reflect the specific software provision concept; installation effort alone does not belong in this answer.

### Question 1 – Main use: “Office”

**Criterion:** How well does the **overall distribution concept** serve as an immediately usable office workstation? What counts is not merely the availability of LibreOffice or other office software, but the interaction of the desktop, applications, hardware detection, system services, and update model.

**Printers and scanners** are particularly important, including preferably automatic discovery and straightforward setup of **network devices**. Services and graphical administration tools needed for ordinary office tasks should ideally already be configured sensibly. If users must enable services through the terminal or add basic printing and scanning support, office suitability is reduced.

Well-integrated office and communication software, an understandable interface, and reliable operation for productive workflows also matter.

**Important distinction:** Selecting “Office” says **nothing** about Linux experience or willingness to tinker. Other questions assess those properties. This answer measures how much work the distribution already takes care of for the **specific office use case**. Demanding distributions are not penalized categorically; their actual integration and defaults determine the rating. The mere technical possibility of eventually configuring printers, scanners, and office software is insufficient for a high score.

**Rule for new distributions:** Check which office applications, print/scan tools, network discovery features, and required services are present or active after installation, and how easily the workstation can actually be used. Do not assume difficulties without specific evidence.

### Question 1 – Main use: “Gaming”

**Criterion:** How deliberately does the overall distribution concept support computer games? In particular, consider gaming focus and preconfiguration, kernel/Mesa/graphics driver integration, and support and setup for Steam, Proton, and other gaming tools.

**The pronounced spread is intentional:** Gaming-focused distributions receive a clear advantage over general-purpose distributions that can run games but whose system concept is less gaming-oriented. **Bazzite KDE, Nobara KDE, and CachyOS KDE each receive +10 points** for their targeted gaming focus. General-purpose distributions can receive good positive scores without reaching the maximum. Specific disadvantages in freshness, integration, or setup may justify negative scores.

**Distinction:** General gaming suitability is evaluated here; suitability for a **specific selected graphics card** is assessed exclusively through the conditional GPU follow-up (0 to +5). Do not award high scores solely because Steam can be installed.

**Rule for new distributions:** Check which gaming advantages are actually integrated or preconfigured and what setup is still required after installation. Reward specialization only when it results in concrete benefits.

### Question 1 – Main use: “Creative work”

**Criterion:** Practical suitability for image editing, video, audio, recording, and streaming. Evaluate integration of suitable applications, media codecs, multimedia libraries, and graphics support, as well as actual usability of demanding creative software. The mere ability to install applications later does not justify the maximum rating. Specific benefits for creative workflows matter more than general popularity or gaming suitability.

**Nobara KDE: +10 points.** The maximum rating is based on included media codecs, OBS Studio, and the ability to set up DaVinci Resolve using a one-click installer. This is a concrete integration benefit for this use case. **Bazzite KDE: 0 points** demonstrates the intended distinction: gaming specialization does not automatically mean creative specialization.

**Rule for new distributions:** Compare demonstrable multimedia integration and actual setup effort for creative workflows. Do not award points solely for theoretical installability or specialization in unrelated areas.

### Question 1 – Main use: “Development”

**Criterion:** Suitability as a productive software development platform, particularly development tools, toolchains, libraries, package management, containers, freshness, and freedom to design different development environments. **Development** means developing software *with* Linux, not experimenting with the operating system itself.

**Comparison of systems sharing a base:** Arch Linux receives **+10**, EndeavourOS KDE **+7**, and CachyOS KDE **+6**. For software development alone, the freely configurable Arch base offers a more direct starting point; the additional focuses of EndeavourOS and CachyOS do not provide a correspondingly large benefit here. This does not mean Arch is better for every use: gaming rankings may deliberately be reversed.

**Principle for all answers:** Each use case is **first evaluated separately** according to its actual advantages. For related distributions, check whether modifications add value for that specific use. Neither the original distribution nor specialized derivatives are automatically favored. Only the combination of answers determines the best overall compromise; there is no predetermined general-purpose winner.

**Rule for new distributions:** Compare productive developer workflows based on actual technical capabilities, not desktop appearance, mere editor availability, or a reputation as a developer distribution.

### Question 1 – Main use: “Experimenting”

**Criterion:** How suitable is a distribution for technically exploring **Linux itself**, modifying system components and services, and trying different operating concepts? Evaluate freedom, transparency, and the specific technical possibilities of the system architecture—not merely the ability to try new applications.

**Arch Linux and NixOS KDE: +10 points each.** Arch offers extensive freedom in building the system; NixOS offers a distinct declarative and reproducible configuration model. **Debian, openSUSE Tumbleweed, and EndeavourOS: +9 each** for their varied opportunities to engage technically with the system. **Bazzite KDE: −10**, because its deliberately more fixed, image-based base system restricts traditional direct system modifications. This is not a general quality judgment: Bazzite simultaneously receives +10 for gaming.

**Distinction:** “Development” evaluates the operating system as a programming platform; “Experimenting” evaluates the operating system itself as the object of learning and customization.

**Rule for new distributions:** Assess freedom and technical experimentation opportunities based on the specific system model. Deliberate restrictions can justify negative scores here even if they offer clear advantages for other uses.

### Question 2 – Device type

**Scoring range: laptop −15 to +15 points; desktop and mini PC remain −10 to +10.** Laptop integration carries more weight because power management, suspend and mobile hardware functions are central to daily use. Scores assess existing integration, not guaranteed compatibility with every device.

**“Desktop PC”:** A stationary desktop usually has no special power management or mobility requirements. Scores are therefore deliberately fairly close. Small advantages in support and integration of current desktop hardware are recognized; no artificially large gaps.

**“Laptop”:** Larger differences are justified here. Key criteria are battery life and power management, suspend/resume, hybrid graphics and GPU switching, Wi-Fi, Bluetooth, function keys, and integration of required system services. What matters is how well these features are available **after installation without additional manual setup**. The possibility of adding them later is no substitute for existing integration. Arch can offer these functions, but a typical basic Arch installation does not automatically configure all of them; hence its significantly lower laptop rating compared with more prepared systems.

**“Mini PC”:** Evaluate support for typical compact hardware, integrated graphics, hybrid graphics where applicable, suitable drivers, and power/system functions. Differences are usually less decisive than for laptops, so scores mostly express slight suitability tendencies rather than strong differentiation.

**“No device yet”:** All distributions receive **0 points**. Without a known device type, no justified device-specific preference can be inferred.

**Rule for new distributions:** Check the actual shipped or basic installation state and hardware integration that is genuinely enabled. Do not evaluate theoretical installability alone. For desktops and mini PCs, use only the spread real differences justify; clear laptop integration benefits may carry considerably more weight. Laptop scores were adopted on 1 November 2026; other device columns remain unchanged.

### Question 3 – Device age and RAM follow-up 

**Device age scoring range: −10 to +10 points.** Age indicates a broad technical tendency: for **under one year**, current kernels, drivers, and firmware are favored over conservative LTS versions; for **1–3 years**, all distributions are neutral (0 points); for **4–7 years**, resource-efficient systems receive moderate advantages; for **8+ years**, this preference is stronger. **Unknown** remains neutral (0 points). Not every old computer is assumed to be weak.

**RAM follow-up (−10 to +10 points):** The age question assesses technical tendencies, not exact hardware performance. The RAM follow-up appears exclusively for “8 years or older.”

- **4 GB or less:** Retain the existing strong RAM-based preference for resource-efficient systems.
- **8 GB:** Retain the existing moderate RAM-based differentiation.
- **16 GB:** Halve the magnitude of the age score (“8+ years” column); for odd values, round the remaining magnitude up (e.g. +5 → +3, −3 → −2). Additional RAM points = rounded remainder minus age points.
- **32 GB or more:** Fully offset the age score. Additional RAM points = negative age points. Device age + RAM = 0.
- **I don’t know:** 0 additional points; retain the age score.

Thus, with 32+ GB, lightweight systems are not favored because of age, and more extensive systems are not penalized for it. Other answers determine the recommendation. The RAM correction is a deliberately simplified approximation; it does not measure CPU/GPU performance. Values remain within −10 to +10.

### Question 4 – Approach to the system 

**This question is a central decision point.** The three answers deliberately have different actual scoring spreads even though the overall permitted range is −20 to +20. Fully using that range for every answer would be objectively inappropriate.

- **“Turn it on, use it, and worry as little as possible” (Q):** Selects uncomplicated, predictable systems requiring little operational and maintenance effort, independently of Linux experience. Stable releases and long-term support count positively; substantial personal responsibility and ongoing system maintenance count negatively. Linux Mint is the positive anchor (+20), self-built Arch the opposite (−20). Fedora (+6) and Tumbleweed (+2) sit closer to the middle. The approved Arch-family ordering is Arch −20, EndeavourOS −10, CachyOS −5, Omarchy 0, reflecting preconfiguration and the intended management workflow. Minimum −20, maximum +20, spread 40.

| Distribution | Q |
|---|---:|
| Linux Mint Cinnamon | +20 |
| Linux Mint Xfce | +20 |
| Zorin OS Core | +18 |
| Ubuntu GNOME | +17 |
| Kubuntu | +17 |
| Debian GNOME | +18 |
| Debian KDE | +18 |
| Fedora Workstation | +6 |
| Fedora KDE | +6 |
| openSUSE Leap KDE | +18 |
| openSUSE Tumbleweed KDE | +2 |
| MX Linux Xfce | +17 |
| Linux Lite | +17 |
| elementary OS | +13 |
| Pop!_OS COSMIC | +9 |
| Bazzite KDE | +15 |
| Nobara KDE | +3 |
| CachyOS KDE | -5 |
| EndeavourOS KDE | -10 |
| Arch Linux (Eigenbau) | -20 |
| NixOS KDE | -5 |
| Omarchy | 0 |

- **“Learn” – medium weighting (positive values up to +10):** This means *gradually learning Linux*, not “having to fix as much as possible yourself.” A low entry barrier, understandable documentation, a helpful community, and opportunities to explore more deeply later count positively. Arch and NixOS are technically educational but less suitable for a gentle introduction. **Agreed corrections:** Debian GNOME +3 → **+6**, Debian KDE +3 → **+6** (good learning foundation and documentation); Bazzite KDE +10 → **+5** (easy entry, but the atomic base restricts traditional base-system modifications). All other learning scores remain unchanged.
- **“Tinker” – deliberately low weighting (−5 to +5):** The preference is for customization freedom and deep system modifications. Arch, EndeavourOS, and NixOS receive +5; Bazzite receives −5 due to restrictions on traditional base-system changes. The narrow spread is *intentional*: the desire to tinker should influence the overall recommendation less strongly than the desire for a system that simply works. Customization and Linux experience are also considered in later questions. **No score changes.**

**Rule for new distributions:** For “Learn,” evaluate educational suitability and entry barriers, not maximum technical complexity. For “Tinker,” evaluate the actual freedom of the system model. Preserve the deliberately different weights.

### Question 5 – Appearance 

**Scoring range: −5 to +5 points.** Visual and ergonomic preferences are supplementary criteria that may affect close results without overriding technical suitability. Evaluate the **intended or shipped desktop concept**, not the theoretical possibility of installing a different desktop later.

- **“Classic”:** A familiar Windows-like desktop with a start menu, taskbar, panels, and traditional window handling. Cinnamon and Xfce each receive **+5**; KDE Plasma receives **+4** for its modern interpretation of the classic desktop concept.
- **“Modern”:** Favor distinctive, contemporary design and interaction concepts such as COSMIC, Pantheon, or Hyprland. KDE Plasma also receives **+4** here because it combines classic interaction with modern design. Cinnamon and Xfce receive lower ratings than these concepts.
- **“No preference”:** **0 points for all distributions**; without a visual preference, the interface should not affect the result.

**Rule for new distributions:** Assess the default desktop and its intended interaction concept. KDE may score well for both classic and modern. Preserve the deliberately low weighting and neutral “No preference” answer. **All values remain unchanged.**

### Question 6 – Customization 

**Scoring range: −10 to +10 points.** What matters is **how well the distribution supports the desired degree of customization**. Evaluate both effort and attainable freedom in the desktop, interaction, window management, theming, and workflows. The number of graphical settings dialogs is not the only consideration. Changes using simple keyboard shortcuts or prepared selection menus also count as straightforward.

- **“Easy”:** Change as much as possible with as little effort as possible. **Omarchy +10** for extensive theme and wallpaper selection directly accessible through keyboard shortcuts; **Zorin +10** for prepared layout options; **COSMIC +9** and **Mint Cinnamon +9** for accessible customization. Also **Bazzite KDE +9**: its atomic base does not prevent extensive, easily accessible KDE desktop customization. **Arch −10**, because a self-built system cannot be assumed to include a similarly prepared working environment.
- **“Moderate”:** Extensive desktop and workflow changes without building everything yourself. **COSMIC +10** for accessible configuration; KDE-based distributions often receive **+6 to +7** for their versatile settings.
- **“Extensive”:** As few limits as possible when designing the entire working environment yourself. **Arch +10** for freely assembling it, **NixOS +10** for deep and reproducible configuration, **Omarchy +10** for extensive Hyprland, keyboard, and workflow customization. KDE distributions mostly score highly too. Technical capabilities of the underlying system configuration may count **insofar as they enable interaction and workflow customization**.

**Important distinction from Question 4:** “Tinker” asks about the *desire to engage with changes*; Question 6 asks about the *desired extent and accessibility of customization*. A distribution scoring highly for both “Easy” **and** “Extensive” is not contradictory: **Easy to customize does not mean limited customization.** Omarchy is a deliberate example. Conversely, Arch can be extensively customizable without being easily customizable before preparation. Bazzite’s base-system tinkering restrictions (Question 4) must be distinguished from KDE desktop customization (Question 6).

**Rule for new distributions:** Evaluate each of the three answer columns separately by actual effort, available tools, and attainable freedom. Do not equate “easy” with “superficial” or “extensive” with “difficult.” **All scores remain unchanged.**

### Question 7 – System recovery

These scores concern restoring the **operating system** after problematic updates or configuration changes, not backing up personal files. The approved main model (`assets/model.json`) is authoritative.

- **Very important (Z):** +10 for especially well-integrated rollback, +5 for accessible but limited recovery, 0 without a sufficiently strong built-in advantage. No negative scores were approved for this answer.
- **Would be useful (AA):** +5 for integrated or easily configured recovery, 0 for noticeable setup effort, −5 for exceptionally high setup effort compared with other distributions.
- **Not important (AB):** 0 for all distributions, so recovery preferences do not affect the ranking.

| Distribution | Z: Very important | AA: Would be useful | AB: Not important |
|---|---:|---:|---:|
| Linux Mint Cinnamon | +5 | +5 | 0 |
| Linux Mint Xfce | +5 | +5 | 0 |
| Zorin OS Core | 0 | 0 | 0 |
| Ubuntu GNOME | 0 | 0 | 0 |
| Kubuntu | 0 | 0 | 0 |
| Debian GNOME | 0 | 0 | 0 |
| Debian KDE | 0 | 0 | 0 |
| Fedora Workstation | 0 | 0 | 0 |
| Fedora KDE | 0 | 0 | 0 |
| openSUSE Leap KDE | +10 | +5 | 0 |
| openSUSE Tumbleweed KDE | +10 | +5 | 0 |
| MX Linux Xfce | 0 | +5 | 0 |
| Linux Lite | 0 | 0 | 0 |
| elementary OS | 0 | 0 | 0 |
| Pop!_OS COSMIC | 0 | 0 | 0 |
| Bazzite KDE | +10 | +5 | 0 |
| Nobara KDE | 0 | 0 | 0 |
| CachyOS KDE | +5 | +5 | 0 |
| EndeavourOS KDE | 0 | 0 | 0 |
| Arch Linux (Eigenbau) | 0 | -5 | 0 |
| NixOS KDE | +5 | +5 | 0 |
| Omarchy | 0 | +5 | 0 |

openSUSE's integrated Snapper recovery and Bazzite's atomic rollback receive the highest Z scores. Mint's Timeshift setup, CachyOS's snapshot approach and NixOS generations receive +5. Arch Linux (custom installation) receives −5 only for AA due to the substantial manual setup effort. A filesystem supporting snapshots alone does not guarantee a usable recovery path.

### Question 8 – Linux experience 

**Scoring range: −20 to +40 points.** This question is a deliberately strongly weighted **adjustment for user experience**. The Distrochooser primarily targets non-experts, so several earlier questions reward preconfiguration, low maintenance, and an easy introduction. Experienced users may deliberately prefer a less preconfigured but freely customizable foundation. An expert answer should prevent these distributions from being pushed out of the top three by the beginner-oriented baseline weighting.

- **“Beginner”:** Favor well-prepared, understandable systems with low entry barriers and accessible help (e.g. Mint, Zorin, and Linux Lite at +10). Arch and NixOS receive −10 because they require more prior knowledge and personal responsibility as starting points.
- **“Intermediate”:** More self-management, more frequent updates, and flexible technical concepts are reasonable and may count positively. Tumbleweed, CachyOS, and Omarchy receive +10, Fedora +9, EndeavourOS +8. Arch still receives −4: intermediate experience does not necessarily imply wanting to build a system largely yourself.
- **“Expert”:** **Arch Linux and Debian GNOME/KDE each receive +40; EndeavourOS KDE and CachyOS KDE each receive +35**. In the project’s assessment, Arch and Debian are particularly suitable foundations for experienced users who deliberately shape their own systems; the Arch-based alternatives receive a slight five-point reduction relative to self-built Arch. This is a targeted expert preference for Arch (self-built), not a general quality penalty. NixOS, Omarchy, and Tumbleweed receive +25 so that other demanding concepts remain competitive. Beginner-focused distributions are sometimes pushed back significantly (e.g. Mint, Zorin, and Linux Lite at −20). The wide spread is **intentional**, so plausible, technically demanding distributions lead expert test cases. However, there is **no hard-coded winner**: other answers still determine the specific order and possible alternatives.

**Rule for new distributions:** Do not reward technical difficulty alone. What matters is whether the distribution provides a useful foundation for the respective experience level. Preserve the targeted adjustment for experts without steering every expert answer to the same distribution regardless of use and hardware. The existing matrix was judged plausible across different answer combinations; **no score changes**.

### GPU follow-up – gaming only 

**Scoring range: 0 to +5 points per distribution.** This question appears only if **“Gaming”** was selected in Question 1. It refines the general gaming suitability already assessed there according to graphics type, but must not dominate it.

- **Nvidia:** Advantage for particularly well-prepared proprietary driver integration and setup; Pop!_OS and Nobara receive +5.
- **AMD:** Advantage for a current kernel/Mesa/graphics stack and gaming-oriented integration; Bazzite, Nobara, and CachyOS receive +5.
- **Intel:** Current kernels, Mesa, and integrated graphics support count; Fedora, Tumbleweed, and gaming specialists lead with +5.
- **Hybrid graphics:** Also consider cooperation between multiple GPUs and practical switching; Pop!_OS and Nobara receive +5.
- **“I don’t know”:** All distributions receive **0 points**; unknown hardware must not generate an artificial preference.

**Rule for new distributions:** Check actual driver and graphics integration for the selected GPU type, not merely theoretical Linux compatibility. Retain the small additional bonus of at most +5; general gaming specialization remains in Question 1. **All GPU values remain unchanged.**

## 6. Calculation and results
For each distribution, points from all selected answers are added. For main use, **all** selected uses count. There is no hidden averaging.

All distributions in the **first three distinct score groups** are displayed. Tied distributions share a rank; catalog order is retained within each rank. Total points remain internal; **final results display neither point totals nor percentages**. The first bar corresponds to the highest total actually achieved and is always full. The remaining bars show their relationship to that best score on a **purely visual scale internally shortened to 50–100%**: bar width = max(0, min(100, (total points / best score − 0.5) × 200)), provided best score > 0. The scale and formula are not shown to users. Ties do not change total scores.

**Criterion:** The winner should be the distribution whose overall package best matches the answers, rather than a predetermined distribution. *It depends.*


<!-- Result ranking rule, 2026-11-01 -->
### Tied result ranks

The first three distinct scores define ranks 1, 2 and 3. All tied distributions share a rank; no rank is skipped. Scores 90, 90, 80, 70 yield ranks 1, 1, 2, 3. More than three recommendations may therefore appear. Ties do not change scores.


### Adopted laptop column I (1 November 2026)

Approved project ratings following the joint review. Bazzite receives +9 and EndeavourOS +6. These ratings are not measurements of battery life or hardware compatibility.

| Distribution | Points |
|---|---:|
| Linux Mint Cinnamon | +9 |
| Linux Mint Xfce | +8 |
| Zorin OS Core | +9 |
| Ubuntu GNOME | +12 |
| Kubuntu | +11 |
| Debian GNOME | +6 |
| Debian KDE | +5 |
| Fedora Workstation | +12 |
| Fedora KDE | +11 |
| openSUSE Leap KDE | +5 |
| openSUSE Tumbleweed KDE | +9 |
| MX Linux Xfce | +5 |
| Linux Lite | +3 |
| elementary OS | +11 |
| Pop!_OS COSMIC | +15 |
| Bazzite KDE | +9 |
| Nobara KDE | +3 |
| CachyOS KDE | +6 |
| EndeavourOS KDE | +6 |
| Arch Linux (Eigenbau) | -11 |
| NixOS KDE | -8 |
| Omarchy | +11 |
