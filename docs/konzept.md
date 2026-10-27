# Linux Distrochooser Distrochooser – Konzept v2.0

**Deutsch · [English](concept.md)**

## Die Idee
Wir wollen **keinen weiteren Distrochooser, der Lieblingsdistributionen des Entwicklers oder gerade gehypte Systeme bevorzugt**. Stattdessen betrachten wir möglichst sachlich die Stärken und Schwächen der einzelnen Distributionen.

Entscheidend ist nicht nur die Optik oder die vorinstallierte Software, sondern **das technische Grundkonzept und das Zusammenspiel seiner Bestandteile**: beispielsweise Update- und Wartungsmodell, Paketverwaltung, Systemaufbau, Sicherheit und Wiederherstellung. Vieles lässt sich nachrüsten; die Integration und der langfristige Pflegeaufwand sind aber nicht überall gleich.

Einsteiger müssen diese Fachbegriffe **nicht** kennen. Wir übersetzen die entscheidenden Anforderungen in acht einfache Fragen. Aus den Antworten und einer bewusst selektiven Punktematrix ergeben sich drei passende Empfehlungen – möglicherweise auch eine Distribution, die der Besucher vorher gar nicht auf dem Schirm hatte.

**Leitgedanke: Es gibt nicht die eine beste Linux-Distribution. Es kommt auf die Anforderungen an.**

### Woher die Idee kam

Ein entscheidender Anstoß war **Chris Titus** und seine sinngemäße Antwort auf die Frage nach der besten Linux-Distribution: **„It depends on …“ – es kommt darauf an.** Dieser Gedanke brachte eine schon lange bestehende Idee auf den Punkt: Statt immer dieselben Distributionen pauschal als die besten zu empfehlen, sollte zuerst der Mensch mit seinen Bedürfnissen im Mittelpunkt stehen. Daraus entstand der Anspruch, mit möglichst wenigen, leicht verständlichen Fragen eine sinnvolle, individuelle Auswahl zu ermöglichen. Nicht Linux-Wissen soll Voraussetzung für die Empfehlung sein – die Empfehlung soll den Einstieg in Linux erleichtern.

## Für wen ist der Distrochooser gedacht?

Die wichtigste Zielgruppe sind **Linux-Neulinge, Umsteiger und Menschen, die noch nicht wissen, welche Distribution sie wählen sollen**. Wer bereits sein gewünschtes Init-System, Paketformat oder Release-Modell kennt, kann gezielter selbst auswählen. Solche technischen Fragen würden gerade diejenigen abschrecken, denen wir den Einstieg erleichtern möchten. Auch erfahrene Nutzer können das Tool verwenden, aber sie bestimmen nicht die Komplexität des Einstiegs.

**Der Nutzer muss Linux nicht verstehen, bevor er eine Distribution auswählen darf. Der Distrochooser soll zuerst den Nutzer verstehen.** Darum fragen wir nach Einsatzzweck, Gerät, Erwartungen und Umgang mit dem System – nicht nach Linux-Fachbegriffen. Das Fachwissen steckt in der Gewichtung im Hintergrund.

### Bewusst begrenzte Komplexität

Linux ist vielseitig: Mit genügend Wissen und Aufwand lassen sich viele Distributionen für sehr unterschiedliche Zwecke einrichten. Deshalb ist die Frage **„Kann Distribution X das?“** selten hilfreich. Wir fragen stattdessen: **„Wie gut passt Distribution X mit ihren Grundprinzipien und ihrem typischen Einrichtungs- und Pflegeaufwand zu diesem Menschen?“** Wir bewerten die praktische Eignung als Ausgangspunkt, nicht jede theoretisch mögliche Konfiguration.

Jede zusätzliche Frage muss die Empfehlungen sinnvoll unterscheiden. Eine Frage nur deshalb aufzunehmen, weil ein technisches Merkmal existiert, macht das Tool nicht automatisch besser. **Keep it simple bedeutet nicht oberflächlich, sondern bewusste Auswahl:** wenig Reibung für Einsteiger, nachvollziehbare Differenzierung im Hintergrund. Die Empfehlungen sollen ein freundlicher Anfang sein, kein technischer Eignungstest.

## Acht Hauptfragen
1. **Hauptnutzung:** Alltag, Büro, Gaming, Kreatives, Programmieren, Experimentieren (Mehrfachauswahl).
2. **Gerätetyp:** Desktop, Laptop, Mini-PC/anderes oder noch kein Gerät.
3. **Gerätealter:** Bei mindestens acht Jahren folgt eine RAM-Zusatzfrage.
4. **Umgang mit dem System:** Möglichst einfach nutzen, Linux kennenlernen oder selbst konfigurieren.
5. **Aussehen:** Welche Optik ist gewünscht?
6. **Anpassung:** Wie viel soll sich verändern lassen?
7. **Wiederherstellung:** Wie wichtig ist es, Änderungen rückgängig zu machen?
8. **Linux-Erfahrung:** Bewusst die letzte Frage.

**Nur bei Gaming** wird zusätzlich die GPU abgefragt. „Weiß ich nicht“ ist eine gültige Antwort und bringt keinen GPU-Bonus.

## Bewertungsgrundsätze
- **Eignung statt Beliebtheit:** Keine Lieblingsdistribution und keine pauschale Bestenliste.
- **Klare Selektion:** Plus- und Minuspunkte machen tatsächliche Unterschiede sichtbar; keine künstlich engen, überwiegend positiven Bewertungen.
- **Relevanz bestimmt das Gewicht:** Grundlegende Anforderungen zählen stärker als beispielsweise die Optik.
- **Erfahrung ist nicht gleich Wunsch nach Aufwand:** Auch Profis können ein unkompliziertes System bevorzugen. Die starke Profi-Wertung berücksichtigt anspruchsvolle Systeme, ohne sie automatisch gewinnen zu lassen.
- **Keine Ergebnislenkung:** Die Matrix wird nicht angepasst, um einen bestimmten Sieger zu erzeugen.

Die **konkreten Bewertungsrahmen, Begründungen und Rechenregeln** stehen in [Bewertungslogik](bewertungslogik.md); die Einzelwerte in der Excel-Punktematrix.

## Ergebnis und Grenzen
Es erscheinen **drei Empfehlungen** mit kurzen Beschreibungen und rein visuellen Vergleichsbalken. Im Ergebnis werden **weder Prozentwerte noch Punktzahlen** angezeigt. Der Balken des höchsten tatsächlich erreichten Gesamtpunktwerts ist vollständig gefüllt; die anderen Balken werden auf einer intern verkürzten Skala von 50 bis 100 % des Bestwerts dargestellt. Die Balken sind eine visuelle Rang- und Abstandshilfe, keine Eignungswahrscheinlichkeit. Konkrete Hardware-, Anwendungs- und Spielekompatibilität muss gegebenenfalls zusätzlich geprüft werden. Snapshots ersetzen kein Backup.

## Umsetzung
- **22 kuratierte Distributionsvarianten**, bewusst ohne Manjaro.
- Berechnung lokal im Browser, ohne KI-API und ohne eigenes Bewertungs-Backend.
- Dunkle Terminal-Optik mit Navy und Cyan, Fortschritt, Zurück/Weiter und Neustart.
- Auf der Live-Webseite bleibt der Abschluss **„Du möchtest Linux ausprobieren und umsteigen?“** mit **„IT-Anfrage starten“** erhalten.

**KISS:** Acht verständliche Fragen für den Besucher, eine nachvollziehbare, differenzierte Bewertung im Hintergrund.
