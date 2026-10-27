# Linux Distrochooser Distrochooser – Bewertungslogik v2.0

**Deutsch · [English](scoring-logic.md)**

## 1. Grundprinzip
Der Distrochooser empfiehlt nicht die beliebtesten Distributionen oder persönliche Favoriten. Er vergleicht die Anforderungen des Nutzers mit den Stärken und Schwächen der Distributionen – insbesondere ihrem technischen Grundkonzept und dem Zusammenspiel ihrer Bestandteile.

**Ziel ist eine klare Selektion, keine möglichst gleichmäßige Punkteverteilung.**

## 2. Punktevergabe und bewusste Selektion

Die Punktematrix ist **kein allgemeines Qualitätsranking**. Sie bewertet, wie gut das technische Gesamtkonzept einer Distribution zu **einer konkreten Anforderung** passt.

- **Hohe Pluspunkte:** Nachweisbare besondere Eignung oder gezielte Integration für den Anwendungsfall.
- **Geringe Pluspunkte:** Eignung mit weniger ausgeprägten Vorteilen.
- **Null Punkte:** Kein besonderer Vor- oder Nachteil.
- **Minuspunkte:** Konkrete Nachteile gegenüber der Anforderung.
- **Hohe Minuspunkte:** Deutlicher Widerspruch zwischen Anforderung und Distributionskonzept.

**Die Spreizung zwischen Minus- und Pluspunkten ist bei allen Fragen ausdrücklich beabsichtigt.** Dass eine Aufgabe technisch irgendwie möglich ist, rechtfertigt noch keine hohe Wertung. Sonst würden vielseitige Allrounder unabhängig von den Antworten fast immer gewinnen, und spezialisierte Distributionen kämen kaum zum Zug.

Die vorgesehenen Punktebereiche werden daher **so weit ausgeschöpft, wie es die tatsächlichen Eignungsunterschiede rechtfertigen**. Unterschiede dürfen nicht künstlich erfunden oder übertrieben werden. Fairness bedeutet **gleiche, nachvollziehbare Maßstäbe**, nicht ähnliche Punktzahlen. Erst die Kombination aller Antworten liefert die individuelle Gesamtwertung. Damit können sowohl Allrounder als auch Spezialisten gewinnen.

**Regel für neue Distributionen:** Jede Antwort einzeln anhand des konkreten Konzepts, der vorhandenen Integration und der tatsächlichen Eignung bewerten; nicht nach Beliebtheit, Verwandtschaft mit einer bestehenden Distribution oder einer gewünschten Endplatzierung.

## 3. Fragen und Gewichtung

| Frage | Bewertungsrahmen | Bewertungsmaßstab |
|---|---|---|
| 1. Hauptnutzung | −10 bis +10 je Auswahl | Eignung für den Einsatzzweck |
| 2. Gerätetyp | −10 bis +10 | Eignung für die Geräteart |
| 3. Gerätealter | −10 bis +10 | Anforderungen an die Hardware |
| 4. Umgang mit dem System | −20 bis +20 | Gewünschter Einrichtungs- und Wartungsaufwand |
| 5. Aussehen | −5 bis +5 | Optische Vorlieben; bewusst schwächer gewichtet |
| 6. Anpassung | −10 bis +10 | Gewünschte Gestaltungsfreiheit |
| 7. Wiederherstellung | −10 bis +10 | Praktisch nutzbare Systemwiederherstellung, Integration und Einrichtungsaufwand (keine Datensicherung) |
| 8. Linux-Erfahrung | −20 bis +40 | Erfahrung und zumutbare Eigenverantwortung |
| RAM-Zusatzfrage | −10 bis +10 | Ressourcenbedarf älterer Rechner |
| GPU-Zusatzfrage | 0 bis +5 | Zusätzliche Gaming-Eignung |

**Die Bereiche sind Bewertungsrahmen, nicht die tatsächlich vorkommenden Minimal- und Maximalwerte jeder Antwortspalte.** Die konkreten Punkte stehen in der Excel-Matrix.

### Frage 1 – Hauptnutzung: Antwort „Alltag“

**Bewertungsmaßstab:** Wie gut eignet sich die Distribution als alltäglich genutztes Desktop-System? Berücksichtigt werden die vorhandene Softwareausstattung, ein schlüssiges Bedienkonzept, die Nutzbarkeit nach der Installation und die Möglichkeit, benötigte Anwendungen bereits **während der Installation** auszuwählen.

**Der Installationsaufwand selbst wird nicht bewertet.** Auch die bloße Möglichkeit, irgendwann zusätzliche Programme nachzuinstallieren, begründet keine hohe Punktzahl. Gut ausgestattete, direkt nutzbare Systeme werden höher bewertet als bewusst schlanke Systeme, bei denen typische Alltagsanwendungen erst nachträglich ergänzt werden müssen.

**Arch Linux (Eigenbau): +5 Punkte.** Mit `archinstall` können Desktop und weitere Pakete bereits bei der Einrichtung ausgewählt werden. Die Bewertung würdigt diese Auswahlmöglichkeit, nicht einen vermeintlich besonders einfachen oder schwierigen Installationsweg und auch keine unterstellte, individuell optimierte Wunschkonfiguration.

**EndeavourOS KDE: +3 Punkte.** EndeavourOS liefert bewusst eine schlanke KDE-Grundausstattung; weitere typische Alltagssoftware wird stärker dem Nutzer überlassen. Der geringere Wert gegenüber Arch bezieht sich auf dieses Ausstattungskonzept, nicht darauf, dass EndeavourOS grundsätzlich weniger leistungsfähig wäre.

**Regel für neue Distributionen:** Unterscheiden zwischen bereits mitgelieferter Software, bei der Installation auswählbarer Software und erst nachträglich einzurichtenden Anwendungen. Die Punkte müssen das konkrete Ausstattungskonzept widerspiegeln; der reine Installationsaufwand gehört nicht in diese Antwort.

### Frage 1 – Hauptnutzung: Antwort „Office“

**Bewertungsmaßstab:** Wie gut eignet sich das **gesamte Distributionskonzept** als unmittelbar nutzbarer Büroarbeitsplatz? Nicht nur die Verfügbarkeit von LibreOffice oder anderer Bürosoftware zählt, sondern das Zusammenspiel von Desktop, Anwendungen, Hardwareerkennung, Systemdiensten und Aktualisierungsmodell.

Besonders wichtig sind **Drucker und Scanner**, einschließlich möglichst automatischer Erkennung und unkomplizierter Einrichtung von **Netzwerkgeräten**. Für gewöhnliche Büroaufgaben sollten benötigte Dienste und grafische Verwaltungswerkzeuge möglichst bereits sinnvoll eingerichtet sein. Müssen Nutzer erst über die Konsole Dienste aktivieren oder grundlegende Druck- und Scanfunktionen nachrüsten, mindert das die Office-Eignung.

Hinzu kommen gut integrierte Büro- und Kommunikationssoftware, ein verständliches Bedienkonzept und ein verlässlicher Betrieb für produktive Arbeitsabläufe.

**Wichtige Abgrenzung:** Wer „Office“ auswählt, sagt damit **nichts** über Linux-Erfahrung oder Bastelbereitschaft aus. Diese Eigenschaften werden in anderen Fragen bewertet. Hier zählt, wie viel Arbeit die Distribution für den **konkreten Office-Einsatzzweck** bereits abnimmt. Anspruchsvolle Distributionen werden nicht pauschal bestraft; ausschlaggebend sind ihre tatsächlich vorhandene Integration und Voreinstellung. Die bloße technische Möglichkeit, Drucker, Scanner und Bürosoftware irgendwann einzurichten, genügt nicht für eine hohe Wertung.

**Regel für neue Distributionen:** Prüfen, welche Bürosoftware, Druck-/Scan-Werkzeuge, Netzwerkerkennung und erforderlichen Dienste nach der Installation vorhanden beziehungsweise aktiv sind und wie einfach der Büroarbeitsplatz tatsächlich nutzbar ist. Keine Schwierigkeiten unterstellen, die nicht konkret belegt sind.

### Frage 1 – Hauptnutzung: Antwort „Gaming“

**Bewertungsmaßstab:** Wie gezielt unterstützt das gesamte Distributionskonzept Computerspiele? Wir berücksichtigen insbesondere Gaming-Ausrichtung und Vorkonfiguration, die Integration von Kernel, Mesa und Grafiktreibern sowie die Unterstützung und Einrichtung von Steam, Proton und weiteren Gaming-Werkzeugen.

**Die deutliche Spreizung ist gewollt:** Gaming-spezialisierte Distributionen erhalten einen klaren Vorsprung vor allgemeinen Distributionen, auf denen Spiele zwar ebenfalls laufen, deren Systemkonzept aber weniger auf Gaming ausgerichtet ist. **Bazzite KDE, Nobara KDE und CachyOS KDE erhalten jeweils +10 Punkte** aufgrund ihrer gezielten Gaming-Ausrichtung. Allgemeine Distributionen können gute Pluspunkte erhalten, ohne die Höchstwertung erreichen zu müssen. Konkrete Nachteile bei Aktualität, Integration oder Einrichtung können Minuspunkte rechtfertigen.

**Abgrenzung:** Die grundsätzliche Gaming-Eignung wird hier bewertet; die Eignung für eine **konkret ausgewählte Grafikkarte** ausschließlich über die bedingte GPU-Zusatzfrage (0 bis +5). Nicht allein deshalb hohe Punkte vergeben, weil Steam installierbar ist.

**Regel für neue Distributionen:** Prüfen, welche Gaming-Vorteile tatsächlich integriert oder vorkonfiguriert sind und welche Einrichtung nach der Installation noch nötig ist. Spezialisierung nur dann belohnen, wenn sie sich in konkreten Vorteilen niederschlägt.

### Frage 1 – Hauptnutzung: Antwort „Kreativ“

**Bewertungsmaßstab:** Praktische Eignung für Bildbearbeitung, Video, Audio, Aufnahme und Streaming. Bewertet werden die Integration geeigneter Anwendungen, Media-Codecs, Multimedia-Bibliotheken und Grafikunterstützung sowie die tatsächliche Nutzbarkeit anspruchsvoller Kreativsoftware. Die bloße Möglichkeit, Anwendungen nachzuinstallieren, begründet noch keine Höchstwertung. Konkrete Vorteile für kreative Arbeitsabläufe zählen stärker als allgemeine Beliebtheit oder Gaming-Eignung.

**Nobara KDE: +10 Punkte.** Die Höchstwertung beruht auf mitgelieferten Media-Codecs, OBS Studio und der Möglichkeit, DaVinci Resolve über einen One-Klick-Installer einzurichten. Das ist ein konkreter Integrationsvorteil für diesen Einsatzzweck. **Bazzite KDE: 0 Punkte** zeigt die gewollte Trennung: Eine Gaming-Spezialisierung ist nicht automatisch eine Kreativ-Spezialisierung.

**Regel für neue Distributionen:** Nachweisbare Multimedia-Integration und den realen Einrichtungsaufwand für kreative Workflows vergleichen; keine Punkte allein für die theoretische Installierbarkeit oder für fachfremde Spezialisierungen.

### Frage 1 – Hauptnutzung: Antwort „Entwicklung“

**Bewertungsmaßstab:** Eignung als produktive Plattform für Softwareentwicklung, insbesondere Entwicklungswerkzeuge, Toolchains, Bibliotheken, Paketverwaltung, Container, Aktualität und Freiheit zur Gestaltung unterschiedlicher Entwicklungsumgebungen. **Entwicklung** meint Software *mit* Linux entwickeln, nicht am Betriebssystem selbst experimentieren.

**Vergleich bei gemeinsamer Basis:** Arch Linux erhält **+10**, EndeavourOS KDE **+7** und CachyOS KDE **+6**. Für reine Softwareentwicklung bietet die frei gestaltbare Arch-Basis einen direkteren Ausgangspunkt; die zusätzlichen Ausrichtungen von EndeavourOS und CachyOS liefern hierfür keinen entsprechend großen Mehrwert. Das bedeutet nicht, dass Arch für alle Nutzungsarten besser ist: Bei Gaming kann sich die Rangfolge bewusst umkehren.

**Grundsatz für alle Antworten:** Jede Nutzungsart wird **zuerst einzeln** nach ihren tatsächlichen Vorteilen bewertet. Bei verwandten Distributionen prüfen wir, ob Anpassungen für genau diese Nutzung einen Mehrwert bieten. Wir bevorzugen weder pauschal die Ursprungsdistribution noch pauschal spezialisierte Ableger. Erst die Kombination der Antworten bestimmt den besten Gesamtkompromiss; es gibt keinen vorab festgelegten Allrounder-Sieger.

**Regel für neue Distributionen:** Produktive Entwickler-Workflows anhand der tatsächlichen technischen Möglichkeiten vergleichen, nicht nach Desktop-Optik, bloßer Editor-Verfügbarkeit oder dem Ruf als Entwicklerdistribution.

### Frage 1 – Hauptnutzung: Antwort „Experimentieren“

**Bewertungsmaßstab:** Wie gut eignet sich eine Distribution, um **Linux selbst** technisch zu erkunden, Systemkomponenten und Dienste zu verändern und unterschiedliche Betriebskonzepte auszuprobieren? Bewertet werden Freiheit, Transparenz und die besonderen technischen Möglichkeiten der Systemarchitektur – nicht nur die Möglichkeit, neue Anwendungen zu testen.

**Arch Linux und NixOS KDE: jeweils +10 Punkte.** Arch bietet weitreichende Freiheit beim Systemaufbau, NixOS ein eigenständiges deklaratives und reproduzierbares Konfigurationsmodell. **Debian, openSUSE Tumbleweed und EndeavourOS: jeweils +9** für die vielfältigen Möglichkeiten zur technischen Auseinandersetzung mit dem System. **Bazzite KDE: −10**, weil das bewusst stärker festgelegte, imagebasierte Basissystem klassische direkte Systemeingriffe einschränkt. Das ist kein allgemeines Qualitätsurteil: Bazzite erhält bei Gaming gleichzeitig +10.

**Abgrenzung:** „Entwicklung“ bewertet das Betriebssystem als Arbeitsplattform zum Programmieren; „Experimentieren“ bewertet das Betriebssystem selbst als Lern- und Gestaltungsgegenstand.

**Regel für neue Distributionen:** Freiheit und technische Experimentiermöglichkeiten anhand des konkreten Systemmodells beurteilen. Bewusste Einschränkungen können hier Minuspunkte rechtfertigen, auch wenn sie in anderen Nutzungsarten klare Vorteile bringen.


### Frage 2 – Gerätetyp

**Bewertungsrahmen: −10 bis +10 Punkte.** Der Gerätetyp ist grundsätzlich ein ergänzendes Eignungskriterium, kein pauschaler Ausschluss. Wir nutzen größere Abstände nur, wenn gerätespezifische Unterschiede sie sachlich rechtfertigen. Kleine Punktdifferenzen sind bewusst sinnvoll: Sie können bei ansonsten knappen Gesamtwerten die Reihenfolge beeinflussen.

**Antwort „Desktop-PC“:** Ein stationärer Desktop stellt üblicherweise keine besonderen Anforderungen an Energieverwaltung oder Mobilität. Deshalb liegen die Punktwerte bewusst relativ nah beieinander. Leichte Vorteile bei der Unterstützung und Integration aktueller Desktop-Hardware werden berücksichtigt; keine künstlichen großen Abstände.

**Antwort „Notebook“:** Hier sind größere Unterschiede gerechtfertigt. Bewertet werden vor allem Akkulaufzeit und Energiemanagement, Standby/Aufwachen, Hybrid-Grafik und GPU-Umschaltung sowie WLAN, Bluetooth, Funktionstasten und die Integration der nötigen Systemdienste. Entscheidend ist, wie gut diese Funktionen **nach der Installation ohne zusätzliche manuelle Einrichtung** bereitstehen. Eine prinzipielle Nachrüstbarkeit ist kein Ersatz für vorhandene Integration. Arch kann solche Funktionen bieten, aber eine typische Arch-Grundinstallation richtet sie nicht automatisch vollständig ein; daher die deutlich niedrigere Notebook-Wertung gegenüber stärker vorbereiteten Systemen.

**Antwort „Mini-PC“:** Bewertet werden die Unterstützung typischer kompakter Hardware, integrierter Grafik, gegebenenfalls Hybrid-Grafik sowie passende Treiber und Energie-/Systemfunktionen. Meist sind die Unterschiede weniger ausschlaggebend als beim Notebook; daher werden überwiegend leichte Eignungstendenzen abgebildet statt einer starken Selektion.

**Antwort „Noch kein Gerät“:** Alle Distributionen erhalten **0 Punkte**. Ohne bekannten Gerätetyp lässt sich keine begründete gerätespezifische Bevorzugung ableiten.

**Regel für neue Distributionen:** Den konkreten Auslieferungs- beziehungsweise Grundinstallationszustand und die tatsächlich aktivierte Hardwareintegration prüfen. Nicht allein die theoretische Installierbarkeit bewerten. Bei Desktop und Mini-PC nur so stark spreizen, wie die realen Unterschiede es rechtfertigen; beim Notebook dürfen klare Integrationsvorteile deutlich stärker zählen. Die Punktwerte der Excel-Matrix bleiben unverändert.

### Frage 3 – Gerätealter und RAM-Zusatzfrage

**Bewertungsrahmen Gerätealter: −10 bis +10 Punkte.** Die Altersangabe dient der groben technischen Tendenz: Bei **unter einem Jahr** werden aktuelle Kernel, Treiber und Firmware gegenüber konservativen LTS-Ständen bevorzugt; bei **1–3 Jahren** sind alle Distributionen neutral (0 Punkte); bei **4–7 Jahren** erhalten ressourcenschonende Systeme moderate Vorteile; bei **8+ Jahren** ist diese Bevorzugung stärker. **Unbekannt** bleibt neutral (0 Punkte). Es wird nicht unterstellt, dass jeder alte Rechner schwach ist.

**RAM-Zusatzfrage (−10 bis +10 Punkte):** Die Altersfrage bewertet technische Tendenzen, keine exakte Hardwareleistung. Die RAM-Zusatzfrage erscheint ausschließlich bei „8 Jahre oder älter“.

- **4 GB oder weniger:** bisherige starke RAM-Selektion zugunsten ressourcenschonender Systeme bleibt erhalten.
- **8 GB:** bisherige moderate RAM-Selektion bleibt erhalten.
- **16 GB:** Die Alterswertung (Spalte „8+ Jahre“) wird betragsmäßig halbiert; bei ungeraden Werten wird der verbleibende Betrag aufgerundet (z. B. +5 → +3, −3 → −2). RAM-Zusatzpunkte = gerundeter Rest minus Alterspunkte.
- **32 GB oder mehr:** Die Alterswertung wird vollständig ausgeglichen. RAM-Zusatzpunkte = negative Alterspunkte. Ergebnis aus Gerätealter + RAM = 0.
- **Weiß ich nicht:** 0 zusätzliche Punkte; Alterswertung bleibt bestehen.

Damit werden bei 32+ GB weder Leichtgewichte wegen des Alters bevorzugt noch umfangreichere Systeme deshalb benachteiligt. Andere Antworten bestimmen die Empfehlung. Die RAM-Korrektur ist eine bewusst vereinfachte Näherung; sie misst nicht CPU/GPU-Leistung. Die Werte liegen jeweils im Bereich −10 bis +10.

### Frage 4 – Umgang mit dem System 

**Diese Frage ist eine zentrale Weichenstellung.** Die drei Antworten haben bewusst unterschiedlich große tatsächliche Punktespannen, obwohl der zulässige Gesamtrahmen −20 bis +20 beträgt. Eine volle Ausschöpfung dieses Rahmens bei jeder Antwort wäre sachlich falsch.

- **„Einfach laufen“ – hohe Gewichtung (positive Werte bis etwa +20):** Wer ein möglichst wartungsarmes, sofort nutzbares System möchte, soll durch diese Präferenz stark gelenkt werden. Bewertet werden der laufende Pflegeaufwand, sinnvolle Voreinstellungen und der Aufwand nach der Installation, nicht bloß die Installationsschwierigkeit. Bestehende Punkte unverändert.
- **„Lernen“ – mittlere Gewichtung (positive Werte bis +10):** Gemeint ist *Linux schrittweise kennenlernen*, nicht „möglichst viel selbst reparieren müssen“. Positiv zählen niedrige Einstiegshürde, verständliche Dokumentation, hilfsbereite Community und die Möglichkeit, später tiefer einzusteigen. Arch und NixOS sind technisch lehrreich, aber für den sanften Einstieg weniger geeignet. **Beschlossene Korrekturen:** Debian GNOME +3 → **+6**, Debian KDE +3 → **+6** (gute Lernbasis und Dokumentation); Bazzite KDE +10 → **+5** (leichter Einstieg, aber durch atomaren Unterbau eingeschränkte klassische Eingriffe ins Basissystem). Alle anderen Lernwerte bleiben unverändert.
- **„Basteln“ – bewusst geringe Gewichtung (−5 bis +5):** Gewünscht sind Gestaltungsfreiheit und tiefe Systemeingriffe. Arch, EndeavourOS und NixOS erhalten +5; Bazzite −5 wegen der Einschränkungen klassischer Änderungen am Basissystem. Die geringe Spreizung ist *gewollt*: Der Bastelwunsch darf die Gesamtempfehlung weniger stark prägen als der Wunsch, dass das System einfach läuft. Anpassbarkeit und Linux-Erfahrung werden zudem in weiteren Fragen berücksichtigt. **Keine Punktänderungen.**

**Regel für neue Distributionen:** Bei „Lernen“ pädagogische Eignung und Einstiegshürde bewerten, nicht maximale technische Komplexität. Bei „Basteln“ die tatsächliche Freiheit des Systemmodells bewerten. Die absichtlich unterschiedlichen Gewichte beibehalten.

### Frage 5 – Aussehen 

**Bewertungsrahmen: −5 bis +5 Punkte.** Die optische und ergonomische Präferenz ist ein ergänzendes Kriterium, das knappe Ergebnisse beeinflussen darf, aber nicht die technische Eignung überlagern soll. Bewertet wird das **vorgesehene beziehungsweise ausgelieferte Desktop-Konzept**, nicht die theoretische Möglichkeit, später einen anderen Desktop zu installieren.

- **„Klassisch“:** Orientierung an einem vertrauten Windows-artigen Desktop mit Startmenü, Taskleiste, Panels und klassischer Fensterbedienung. Cinnamon und Xfce erhalten jeweils **+5**; KDE Plasma erhält **+4**, weil es eine moderne Interpretation des klassischen Desktop-Konzepts bietet.
- **„Modern“:** Bevorzugt werden eigenständige, zeitgemäße Gestaltung und Bedienkonzepte wie COSMIC, Pantheon oder Hyprland. KDE Plasma erhält auch hier **+4**, weil es klassische Bedienung mit modernem Design verbindet. Cinnamon und Xfce werden gegenüber diesen Konzepten geringer bewertet.
- **„Egal“:** **0 Punkte für alle Distributionen**; ohne optische Präferenz soll die Oberfläche keinen Einfluss auf das Ergebnis haben.

**Regel für neue Distributionen:** Standarddesktop und tatsächlich vorgesehenes Bedienkonzept beurteilen. KDE darf bei klassisch und modern zugleich gut abschneiden. Die bewusst geringe Gewichtung und neutrale „Egal“-Antwort beibehalten. **Alle Werte bleiben unverändert.**

### Frage 6 – Anpassbarkeit 

**Bewertungsrahmen: −10 bis +10 Punkte.** Entscheidend ist, **wie gut die Distribution den gewünschten Grad an Anpassung unterstützt**. Bewertet werden dabei sowohl der erforderliche Aufwand als auch die tatsächlich erreichbare Gestaltungsfreiheit bei Desktop, Bedienung, Fensterverwaltung, Theming und Arbeitsabläufen. Es geht nicht ausschließlich um die Zahl grafischer Einstellungsdialoge. Anpassungen per einfacher Tastenkombination oder vorbereitetem Auswahlmenü zählen ebenso als unkompliziert.

- **„Einfach“:** Möglichst viel mit möglichst wenig Aufwand verändern. **Omarchy +10** wegen direkt erreichbarer, umfassender Theme- und Wallpaper-Auswahl über Tastenkombinationen; **Zorin +10** mit vorbereiteten Layoutoptionen; **COSMIC +9** und **Mint Cinnamon +9** mit gut zugänglichen Anpassungen. Auch **Bazzite KDE +9**: Der atomare Unterbau verhindert nicht die weitreichende, einfach zugängliche KDE-Desktop-Anpassung. **Arch −10**, weil beim Eigenbau keine entsprechend vorbereitete Arbeitsumgebung vorausgesetzt wird.
- **„Mittel“:** Umfangreiche Anpassungen von Desktop und Arbeitsabläufen ohne vollständigen Eigenaufbau. **COSMIC +10** durch seine zugängliche Konfiguration; KDE-basierte Distributionen häufig **+6 bis +7** wegen ihrer vielseitigen Einstellmöglichkeiten.
- **„Tiefgreifend“:** Möglichst wenige Grenzen bei der selbstbestimmten Gestaltung der gesamten Arbeitsumgebung. **Arch +10** für freie Zusammenstellung, **NixOS +10** für tiefgreifende und reproduzierbare Konfiguration, **Omarchy +10** für weitreichende Hyprland-, Tasten- und Workflow-Anpassungen. KDE-Distributionen schneiden überwiegend ebenfalls hoch ab. Technische Möglichkeiten der zugrunde liegenden Systemkonfiguration dürfen berücksichtigt werden, **soweit sie die Gestaltung von Bedienung und Arbeitsabläufen ermöglichen**.

**Wichtige Abgrenzung zu Frage 4:** „Basteln“ fragt nach dem *Wunsch, sich mit Änderungen zu beschäftigen*; Frage 6 fragt nach dem *gewünschten Ausmaß und der Zugänglichkeit der Anpassungen*. Dass eine Distribution bei „Einfach“ **und** „Tiefgreifend“ hoch abschneidet, ist kein Widerspruch: **Einfach anpassbar heißt nicht wenig anpassbar.** Omarchy ist dafür ein bewusstes Beispiel. Umgekehrt kann Arch tiefgreifend anpassbar, aber nicht ohne Vorbereitung einfach anpassbar sein. Bazzites Beschränkungen beim Basissystem-Basteln (Frage 4) sind von der KDE-Desktop-Anpassbarkeit (Frage 6) zu unterscheiden.

**Regel für neue Distributionen:** Jede der drei Antwortspalten getrennt nach tatsächlichem Aufwand, vorhandenen Hilfsmitteln und erreichbarer Gestaltungsfreiheit bewerten. Keine pauschale Gleichsetzung von „einfach“ mit „oberflächlich“ oder von „tiefgreifend“ mit „schwierig“. **Alle Punkte bleiben unverändert.**

### Frage 7 – Wiederherstellung des Systems 

**Bewertungsrahmen: −10 bis +10 Punkte.** Gemeint ist ausschließlich die **Wiederherstellung des Betriebssystems** nach fehlerhaften Updates oder Konfigurationsänderungen – **nicht die Sicherung persönlicher Daten**. Bewertet wird die tatsächliche Nutzbarkeit der Wiederherstellung im vorgesehenen Installationszustand und der Aufwand, sie einzurichten. Die bloße technische Möglichkeit, irgendwann ein Backup-Programm zu installieren, reicht für eine hohe Bewertung nicht aus.

- **„Sehr wichtig“ – starke Selektion nach Integration:** Besonders hohe Punkte erhalten Distributionen mit **bereits vorgesehenem Btrfs-Dateisystem**, **eingerichteten Snapshots/Rollbacks** und möglichst **Wiederherstellungseinträgen im Bootloader**. Bei openSUSE (Snapper mit Bootloader-Integration), Omarchy und CachyOS wurden solche vorbereiteten Wege besonders berücksichtigt. Die Frage ist auch, ob Btrfs **ohne manuelle Partitionierung** als Installationsstandard bereitsteht. Wenn der normale Installer ext4 verwendet und Btrfs nur über manuelle Partitionierung erreichbar ist, bedeutet das einen erheblichen Mehraufwand für einen Btrfs-basierten Rollback. Einfache, direkt angebotene Alternativen zählen ebenfalls positiv: Linux Mint weist beim Einstieg ausdrücklich auf die Einrichtung von **Timeshift** hin. Timeshift mit **rsync auf ext4** kann Systemzustände sichern und wiederherstellen, ist aber **kein Btrfs-Snapshot** und nicht gleichzusetzen mit einem bereits eingerichteten Bootloader-Rollback.
- **„Wäre praktisch“ – geringere Gewichtung und geringere Abstände:** Eine Wiederherstellung muss nicht vollständig vorkonfiguriert sein. Einfache Nachrüstung ist akzeptabel, insbesondere wenn die passende Dateisystemgrundlage bereits besteht oder eine integrierte Einrichtungshilfe verfügbar ist. Ab Werk vorhandene Rollbacks behalten einen Vorteil; der Unterschied zu unkompliziert nachrüstbaren Lösungen fällt jedoch geringer aus.
- **„Nicht wichtig“ – neutral:** Alle Distributionen erhalten **0 Punkte**. Wer keine Präferenz für Systemwiederherstellung äußert, wird dadurch nicht in eine bestimmte Richtung gelenkt.

**Technische Abgrenzung:** Btrfs ist Voraussetzung für **Btrfs-Snapshots**, aber nicht für jede Form der Systemwiederherstellung. Ein Btrfs-Dateisystem allein bedeutet noch **keine** eingerichtete Snapshot-Verwaltung und **keinen** funktionsfähigen Bootloader-Rollback. Bei der Bewertung zählen daher Dateisystemstandard, vorhandene Werkzeuge, tatsächliche Integration und der notwendige manuelle Aufwand getrennt. Beispielsweise ist eine Btrfs-Standardinstallation ohne vorkonfiguriertes Rollback nicht mit einer fertigen Snapper-/Bootloader-Lösung gleichzusetzen.

**Regel für neue Distributionen:** Den realen Standardinstallationsweg prüfen: Dateisystem, Snapshot-Werkzeug, Einrichtung, Wiederherstellungsweg auch bei Startproblemen und erforderliche manuelle Schritte. Bei „Sehr wichtig“ vorbereitete Integration stark belohnen; bei „Wäre praktisch“ die leichte Nachrüstbarkeit stärker gelten lassen. **Die bisherige Punktematrix bleibt vorerst unverändert**; insbesondere wurde eine mögliche Anpassung der Fedora-Werte nur angesprochen, nicht beschlossen.

### Frage 8 – Linux-Erfahrung 

**Bewertungsrahmen: −20 bis +40 Punkte.** Die Frage ist eine bewusst stark gewichtete **Korrektur für die Erfahrung des Nutzers**. Der Distrochooser richtet sich primär an Laien; mehrere vorangehende Fragen belohnen daher Vorkonfiguration, niedrigen Pflegeaufwand und unkomplizierten Einstieg. Erfahrene Anwender können dagegen bewusst eine weniger vorkonfigurierte, dafür frei gestaltbare Grundlage bevorzugen. Diese Distributionen sollen bei einer Profi-Antwort nicht durch die einsteigerorientierte Grundgewichtung aus den Top 3 gedrängt werden.

- **„Anfänger“:** Gut vorbereitete, verständliche Systeme mit niedriger Einstiegshürde und zugänglicher Hilfe werden bevorzugt (etwa Mint, Zorin und Linux Lite mit +10). Arch und NixOS erhalten −10, weil sie als Einstieg mehr Vorwissen und Eigenverantwortung erfordern.
- **„Fortgeschritten“:** Mehr Selbstverwaltung, häufigere Updates und flexible technische Konzepte sind zumutbar und können positiv bewertet werden. Tumbleweed, CachyOS und Omarchy erhalten +10, Fedora +9, EndeavourOS +8. Arch erhält hier noch −4: Fortgeschrittene Erfahrung bedeutet nicht zwingend, ein System weitgehend eigenständig aufbauen zu wollen.
- **„Profi“:** **Arch Linux und Debian GNOME/KDE erhalten jeweils +40; EndeavourOS KDE und CachyOS KDE erhalten jeweils +35**. Arch und Debian gelten in der Projektbewertung als besonders geeignete Grundlagen für erfahrene Nutzer, die ihre Systeme gezielt selbst gestalten; die Arch-basierten Alternativen werden mit einem leichten Abschlag von fünf Punkten gegenüber dem selbst aufgebauten Arch berücksichtigt. Dies ist eine gezielte Profi-Präferenz für Arch (Eigenbau), kein allgemeiner Qualitätsmalus. NixOS, Omarchy und Tumbleweed erhalten +25, damit auch andere anspruchsvolle Konzepte konkurrenzfähig bleiben. Einsteigerorientierte Distributionen werden teils deutlich zurückgesetzt (z. B. Mint, Zorin und Linux Lite −20). Die hohe Spreizung ist **absichtlich**, damit bei Profi-Testläufen plausible, technisch anspruchsvolle Distributionen vorn stehen. Sie ist aber **kein fest einprogrammierter Sieger**: Die anderen Antworten bestimmen weiterhin die konkrete Reihenfolge und mögliche Alternativen.

**Regel für neue Distributionen:** Nicht bloß technische Schwierigkeit belohnen. Entscheidend ist, ob die Distribution für den jeweiligen Erfahrungsstand eine sinnvolle Grundlage darstellt. Den gezielten Ausgleich für Profis beibehalten, ohne jede Profi-Antwort unabhängig von Nutzung und Hardware auf dieselbe Distribution zu lenken. Die bisherige Matrix wurde anhand verschiedener Antwortkombinationen als plausibel beurteilt; **keine Punktänderungen**.

### GPU-Zusatzfrage – nur bei Gaming 

**Bewertungsrahmen: 0 bis +5 Punkte je Distribution.** Die Frage erscheint nur, wenn in Frage 1 **„Gaming“** gewählt wurde. Sie präzisiert die bereits in Frage 1 bewertete allgemeine Gaming-Eignung anhand des Grafiktyps, darf sie aber nicht dominieren.

- **Nvidia:** Vorteil für Distributionen mit besonders gut vorbereiteter proprietärer Treiberintegration und Einrichtung; Pop!_OS und Nobara erhalten +5.
- **AMD:** Vorteil für aktuellen Kernel-/Mesa-/Grafik-Stack und gamingorientierte Integration; Bazzite, Nobara und CachyOS erhalten +5.
- **Intel:** Aktuelle Kernel, Mesa und integrierte Grafikunterstützung zählen; Fedora, Tumbleweed und Gaming-Spezialisten liegen mit +5 vorn.
- **Hybrid-Grafik:** Zusätzlich werden das Zusammenspiel mehrerer GPUs und die praktikable Umschaltung berücksichtigt; Pop!_OS und Nobara erhalten +5.
- **„Weiß ich nicht“:** Alle Distributionen erhalten **0 Punkte**; unbekannte Hardware darf keine künstliche Präferenz erzeugen.

**Regel für neue Distributionen:** Konkrete Treiber- und Grafik-Integration für den gewählten GPU-Typ prüfen, nicht nur theoretische Linux-Kompatibilität. Den kleinen Zusatzbonus von maximal +5 erhalten; die allgemeine Gaming-Spezialisierung bleibt in Frage 1 verankert. **Alle GPU-Werte bleiben unverändert.**

## 6. Berechnung und Ergebnis
Für jede Distribution werden die Punkte aller gewählten Antworten addiert. Bei der Hauptnutzung zählen **alle** ausgewählten Nutzungsarten. Es gibt keine versteckte Durchschnittsbildung.

Die **drei höchsten Gesamtwerte** werden angezeigt. Bei Gleichstand gilt die festgelegte Katalogreihenfolge. Die Gesamtpunkte bleiben intern; **im Endergebnis werden weder Punktzahlen noch Prozentwerte angezeigt**. Der erste Balken entspricht dem höchsten tatsächlich erreichten Gesamtpunktwert und ist immer voll. Die beiden anderen Balken zeigen das Verhältnis zu diesem Bestwert auf einer **rein visuellen, intern auf 50–100 % verkürzten Skala**: Balkenbreite = max(0, min(100, (Gesamtpunkte / Bestwert − 0,5) × 200)), sofern Bestwert > 0. Die Skalierung und Formel werden dem Nutzer nicht angezeigt. Die Punktevergabe, Rangfolge und Gleichstandsregel bleiben unverändert.

**Maßstab:** Nicht eine bestimmte Distribution soll gewinnen, sondern diejenige, deren Gesamtpaket am besten zu den Antworten passt. *It depends.*
