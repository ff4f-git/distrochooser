# Eigene Distrochooser-Instanz verwalten / Managing your own instance

[Installation und Einrichtung / Installation and setup](statistics-setup.md) · [Konzept / Concept](konzept.md)

## Deutsch

**Zuerst einrichten:** Wer das Projekt forkt, folgt der [Schritt-für-Schritt-Installation](statistics-setup.md). Dort stehen GitHub Pages, Supabase, die eigenen URLs, die erste Katalogregistrierung und die Zugangsdaten.

**Danach bearbeiten:**

1. Das `admin.html` **der eigenen Website** öffnen und den GitHub-Token für das **eigene Repository** eingeben.
2. Unter **Distributionen** Namen, DE/EN-Texte, Stärken, Links und Aktivierung bearbeiten.
3. Unter **Fragen & Punkte** die Bewertungen einschließlich RAM und GPU pflegen.
4. Mit **Speichern & veröffentlichen** den neuen Katalog im eigenen GitHub-Repository veröffentlichen und dieselbe Version in Supabase aktivieren.

Die redaktionelle Datenquelle ist `data/distributions.json`. Die benötigten Laufzeitdateien werden daraus erzeugt und nicht einzeln gepflegt. Für reine Punkteänderungen ist kein erneutes Edge-Function-Deployment nötig.

## English

**First-time setup:** Follow the [step-by-step installation guide](statistics-setup.md) to configure GitHub Pages, Supabase, your own URLs, the initial catalog and access credentials.

**After setup:**

1. Open `admin.html` on **your own website** and enter a GitHub token scoped to **your repository**.
2. Under **Distributions**, edit names, DE/EN text, strengths, links and active status.
3. Under **Questions & scores**, maintain the scores including RAM and GPU.
4. Use **Save & publish** to commit the catalog to your own GitHub repository and activate the same version in Supabase.

The editorial source of truth is `data/distributions.json`. Runtime files are generated from it and should not be edited separately. Score-only changes do not require redeploying Edge Functions.

**Sicherheit / Security:** GitHub-Tokens und Supabase-Service-Schlüssel niemals ins Repository schreiben. Never commit GitHub tokens or Supabase service-role keys.

**Tests:** `node --test tests/*.test.mjs`
