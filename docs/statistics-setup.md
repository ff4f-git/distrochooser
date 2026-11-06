# Installation und Einrichtung / Installation and setup

**[Deutsch](#deutsch) · [English](#english)**

Diese Anleitung ist für Menschen gedacht, die Distrochooser **forken oder herunterladen und selbst betreiben**. Sie ändert nichts an der ursprünglichen Installation.

This guide is for people who want to **fork or download and run their own installation**. It does not modify the original deployment.

## Deutsch

### Was du brauchst

Du richtest eine **eigene Kopie** des Distrochoosers ein. Du brauchst ein GitHub-Konto, ein Supabase-Konto und einen Computer mit **Git** und **Node.js** (npm ist dabei). Für die Website brauchst du keinen eigenen Webserver: GitHub Pages reicht. Für die Datenbank und die freiwillige Statistik wird Supabase verwendet.

**Wichtige Begriffe:** Ein *Fork* ist deine Kopie des GitHub-Projekts. Die *Projekt-ID* (Project Ref) ist die Kennung deines Supabase-Projekts. Eine *Edge Function* ist ein kleiner Programmteil, der bei Supabase läuft. Ein *Token* ist ein Zugangsschlüssel: niemals öffentlich teilen.

### 1. Eigene Kopie auf GitHub erstellen

1. Öffne [das Distrochooser-Repository](https://github.com/ff4f-git/distrochooser), klicke oben auf **Fork** und erstelle eine Kopie in deinem GitHub-Konto.
2. Öffne **dein** neues Repository → **Settings → Pages**. Wähle unter **Build and deployment** die Quelle **Deploy from a branch**, Branch **main**, Ordner **/(root)**, und speichere.
3. Deine Website sollte anschließend unter `https://DEIN-NAME.github.io/distrochooser/` erreichbar sein. Die Bereitstellung kann einige Minuten dauern. Wenn du das Repository anders benennst, ändert sich der letzte Teil der URL.
4. Installiere [Git](https://git-scm.com/downloads) und [Node.js](https://nodejs.org/). Öffne ein Terminal (Windows: PowerShell; macOS/Linux: Terminal) und lade **deine** Kopie herunter:

   ```bash
   git clone https://github.com/DEIN-NAME/distrochooser.git
   cd distrochooser
   ```

   Ersetze `DEIN-NAME` durch deinen GitHub-Benutzernamen. Die folgenden Befehle werden in diesem Projektordner ausgeführt.

### 2. Eigenes Supabase-Projekt anlegen

1. Melde dich bei [Supabase](https://supabase.com/dashboard) an und wähle **New project**. Lege ein eigenes Projekt an.
2. Suche in der Projektübersicht die **Project ID / Project Ref** (auch im Projekt-URL-Pfad erkennbar) und die **Project URL**. Die Funktionsadressen haben später dieses Muster: `https://DEINE-PROJEKT-ID.supabase.co/functions/v1/...`.
3. Öffne **SQL Editor → New query**. Öffne nacheinander die fünf Dateien im Ordner [`supabase/migrations/`](../supabase/migrations/) deiner Kopie, kopiere **jeweils den vollständigen Inhalt** in den SQL Editor und klicke auf **Run**. Beginne mit der Datei mit der kleinsten Nummer und arbeite in Dateinamen-Reihenfolge weiter.
4. **Wenn eine Migration fehlschlägt, nicht einfach mit der nächsten weitermachen.** Insbesondere benötigt der automatische Löschjob die Supabase-Erweiterung `pg_cron`. Prüfe die Fehlermeldung und die Verfügbarkeit der Erweiterung unter **Database → Extensions**. Diese Schritte gelten für eine **neue, leere Datenbank**, nicht für eine bestehende Installation.

### 3. Adressen auf deine eigene Installation umstellen

Öffne die folgenden Dateien in einem Texteditor (z. B. VS Code) und ersetze die Beispielwerte:

| Datei | Was du ändern musst |
|---|---|
| `supabase/functions/catalog-admin/index.ts` | `REPO` → `DEIN-NAME/distrochooser`; `ORIGIN` → `https://DEIN-NAME.github.io` |
| `assets/admin.js` | `ENDPOINT` → `https://DEINE-PROJEKT-ID.supabase.co/functions/v1/catalog-admin` |
| `assets/catalog-client.js` | `CATALOG_ENDPOINT` → dieselbe `catalog-admin`-Adresse |
| `assets/statistics-config.js` | `STATISTICS_ENDPOINT` → `https://DEINE-PROJEKT-ID.supabase.co/functions/v1/submit-statistics` |

**Wichtig:** `ORIGIN` enthält nur `https://DEIN-NAME.github.io`, **nicht** `/distrochooser/`. Wenn du eine eigene Domain verwendest, trage deren tatsächlichen Ursprung ein.

Speichere die Änderungen. Veröffentliche sie in **deinem** GitHub-Repository, bevor du die Website testest:

```bash
git add assets/admin.js assets/catalog-client.js assets/statistics-config.js supabase/functions/catalog-admin/index.ts
git commit -m "Configure my own installation"
git push
```

### 4. Supabase-Funktionen bereitstellen

Melde dich im Terminal bei Supabase an und verknüpfe das Projekt. Ersetze `DEINE-PROJEKT-ID` durch die Kennung aus Schritt 2:

```bash
npx supabase login
npx supabase link --project-ref DEINE-PROJEKT-ID
npx supabase secrets set STATISTICS_ORIGIN=https://DEIN-NAME.github.io
npx supabase functions deploy submit-statistics --use-api
npx supabase functions deploy catalog-admin --use-api
```

`npx` kann beim ersten Start fragen, ob die Supabase CLI installiert werden darf. Bestätige dies. `--use-api` vermeidet ein beim lokalen Deployment beobachtetes Problem. Im Supabase-Dashboard unter **Edge Functions** sollten danach **beide** Funktionen erscheinen.

Die beiden Funktionen verwenden laut [`supabase/config.toml`](../supabase/config.toml) `verify_jwt = false`. Das bedeutet **nicht**, dass jeder den Katalog bearbeiten darf: Schreibzugriffe auf GitHub werden separat anhand des GitHub-Tokens geprüft. Ein Supabase-Service-Schlüssel gehört niemals in eine Browserdatei.

### 5. Ersten Katalog registrieren – nur bei Neuinstallation

Ohne diesen Schritt kann die Katalogfunktion noch keinen veröffentlichten Datenstand ausliefern.

1. Öffne in deinem Repository [`data/distributions.json`](../data/distributions.json). Kopiere den **gesamten JSON-Inhalt**, einschließlich der ersten und letzten geschweiften Klammer.
2. Öffne auf GitHub die Commit-Historie **deines** Repositorys auf Branch `main`. Kopiere die vollständige Commit-ID (SHA) des aktuellen Stands. Die Datei `data/distributions.json` muss in diesem Commit enthalten sein.
3. Öffne im **privaten Supabase SQL Editor** eine neue Abfrage. Ersetze im folgenden SQL `HIER_GESAMTEN_JSON_INHALT_EINFUEGEN` durch den kopierten Inhalt und `DEIN_COMMIT_SHA` durch deine Commit-ID. Lass die `$catalog$`-Begrenzer stehen:

```sql
begin;

with first_catalog as (
  select $catalog$
HIER_GESAMTEN_JSON_INHALT_EINFUEGEN
$catalog$::jsonb as catalog
)
insert into public.distribution_releases
  (version, catalog, github_commit, published_by)
select catalog->>'version', catalog, 'DEIN_COMMIT_SHA', 'initial-setup'
from first_catalog;

insert into public.distribution_release_current (singleton, version)
select true, version
from public.distribution_releases
where github_commit = 'DEIN_COMMIT_SHA';

commit;
```

4. Klicke auf **Run**. Es dürfen keine Fehler auftreten. Führe diese Initialisierung **nicht erneut** in einer bereits eingerichteten Datenbank aus. Bei einem Fehler nicht blind erneut ausführen, sondern zuerst die Fehlermeldung prüfen.

**Hinweis:** Dieses SQL übernimmt den vorhandenen Katalog aus deiner Kopie, einschließlich seiner Versionskennung. Wenn du die Datei vorher verändert hast, muss die Versionskennung konsistent zur Veröffentlichung bleiben; für den ersten Start die Datei am besten unverändert lassen.

### 6. Alles prüfen

1. Öffne `https://DEINE-PROJEKT-ID.supabase.co/functions/v1/catalog-admin` im Browser. Du solltest eine JSON-Antwort mit einem Feld `catalog` erhalten, **keine** Fehlermeldung über eine fehlende Veröffentlichung.
2. Öffne deine GitHub-Pages-Website. Beantworte die Fragen und prüfe, ob Empfehlungen erscheinen.
3. Öffne `https://DEIN-NAME.github.io/distrochooser/admin.html`. Erstelle in GitHub unter **Settings → Developer settings → Personal access tokens → Fine-grained tokens** einen Token für **dein eigenes Repository** mit **Contents: Read and write**. Gib ihn nur in deinem Admin-Panel ein und prüfe, ob dein Katalog geladen wird.
4. Für den ersten Test musst du **keine** echten Statistikbeiträge senden. Prüfe zunächst, ob der Fragebogen und die Admin-Anzeige funktionieren. Wenn du die Statistik aktiv nutzt, prüfe zusätzlich Einwilligung, Datenschutz und die Anzeige auf [`statistik.html`](../statistik.html).

**Bei Problemen:** Prüfe zuerst, ob die Adressen in Schritt 3 wirklich zu **deinem** Supabase-Projekt gehören und ob `ORIGIN` zur Domain der Website passt. Prüfe dann im Supabase-Dashboard unter **Edge Functions → Logs** die Fehlermeldungen.

### Späterer Betrieb

Die Punkte und Distributionen werden im [eigenen Admin-Panel](../admin.html) bearbeitet. Bei einer Veröffentlichung werden Katalog und benötigte Laufzeitdateien im **eigenen** GitHub-Repository aktualisiert und dieselbe Version in Supabase aktiviert. Für reine Punkteänderungen ist kein neues Function-Deployment nötig. Bei Änderungen am Funktionscode musst du die betroffene Funktion neu deployen.

Für einen einfachen Statuscheck im **privaten SQL Editor**:

```sql
select version from public.distribution_release_current where singleton = true;
select jobname, schedule, active from cron.job
where jobname = 'purge-questionnaire-statistics';
select count(*) from public.questionnaire_statistics;
```

Der tägliche Löschjob entfernt Statistikbeiträge nach ungefähr 90 Tagen. Die Statistik zählt **Beiträge, nicht eindeutige Personen**. Veröffentliche keine Rohdaten, Tokens oder Service-Schlüssel. Tests im Projektordner: `node --test tests/*.test.mjs`.

---

## English

### What you need

This guide sets up **your own copy** of Distrochooser. You need a GitHub account, a Supabase account, and Git plus Node.js (which includes npm) on your computer. GitHub Pages hosts the website; Supabase runs the database and optional statistics.

A **fork** is a copy of the repository under your account. The **Project Ref** identifies your Supabase project. An **Edge Function** is server-side code hosted by Supabase. A **token** grants access: never publish it.

### 1. Fork and publish the website

1. Open the [original repository](https://github.com/ff4f-git/distrochooser), click **Fork**, and create a copy under your own GitHub account.
2. In **your** repository, go to **Settings → Pages**. Choose **Deploy from a branch**, branch **main**, folder **/(root)**, and save.
3. After a few minutes, your site should appear at `https://YOUR-NAME.github.io/distrochooser/`. Adjust the path if you renamed the repository.
4. Install [Git](https://git-scm.com/downloads) and [Node.js](https://nodejs.org/). Open a terminal (PowerShell on Windows) and clone **your fork**:

   ```bash
   git clone https://github.com/YOUR-NAME/distrochooser.git
   cd distrochooser
   ```

Run subsequent commands from this directory.

### 2. Create a Supabase project and database

1. Create your own project in the [Supabase dashboard](https://supabase.com/dashboard).
2. Find its **Project ID / Project Ref** and **Project URL**. Function URLs follow `https://YOUR-PROJECT-REF.supabase.co/functions/v1/...`.
3. Open **SQL Editor → New query**. Open each of the five files in [`supabase/migrations/`](../supabase/migrations/) in **filename order**. Copy each file's **complete contents** into the editor and click **Run** before moving to the next.
4. Stop if any migration fails. The scheduled cleanup needs the `pg_cron` extension (see **Database → Extensions**). This procedure is for a **new, empty database**, not an existing deployment.

### 3. Replace the original project's addresses

Edit these files with a text editor:

| File | Set this value |
|---|---|
| `supabase/functions/catalog-admin/index.ts` | `REPO` = `YOUR-NAME/distrochooser`; `ORIGIN` = `https://YOUR-NAME.github.io` |
| `assets/admin.js` | `ENDPOINT` = `https://YOUR-PROJECT-REF.supabase.co/functions/v1/catalog-admin` |
| `assets/catalog-client.js` | `CATALOG_ENDPOINT` = the same `catalog-admin` URL |
| `assets/statistics-config.js` | `STATISTICS_ENDPOINT` = `https://YOUR-PROJECT-REF.supabase.co/functions/v1/submit-statistics` |

`ORIGIN` is the website **origin only**: no `/distrochooser/` suffix. Use your actual origin if you have a custom domain.

Save and publish these edits to **your** GitHub repository:

```bash
git add assets/admin.js assets/catalog-client.js assets/statistics-config.js supabase/functions/catalog-admin/index.ts
git commit -m "Configure my own installation"
git push
```

### 4. Deploy both Supabase functions

In your terminal, replace the placeholders:

```bash
npx supabase login
npx supabase link --project-ref YOUR-PROJECT-REF
npx supabase secrets set STATISTICS_ORIGIN=https://YOUR-NAME.github.io
npx supabase functions deploy submit-statistics --use-api
npx supabase functions deploy catalog-admin --use-api
```

Confirm installation if `npx` prompts you. `--use-api` works around a previously observed local deployment issue. Check **Edge Functions** in the Supabase dashboard for both deployed functions.

Both functions have `verify_jwt = false` in [`supabase/config.toml`](../supabase/config.toml). Catalog **writes** still require GitHub permissions verified with your token. Never place a Supabase service-role key in browser code.

### 5. Register the initial catalog (new databases only)

1. Open [`data/distributions.json`](../data/distributions.json) in **your** repository and copy its **entire** JSON content.
2. From your repository's `main` branch commit history, copy the full commit SHA for the current state, which must include that JSON file.
3. Open a **private Supabase SQL Editor** query. Use the **SQL template in German step 5 above**: replace `HIER_GESAMTEN_JSON_INHALT_EINFUEGEN` with the complete JSON and `DEIN_COMMIT_SHA` with your commit SHA. Keep the `$catalog$` delimiters. Click **Run**.
4. Do this **once only**, for a new database. Do not rerun the initialization against an existing deployment. For a first install, keep the copied catalog unchanged so its version remains consistent.

The template inserts the catalog into `public.distribution_releases` and selects its version in `public.distribution_release_current`. Without this, the catalog function cannot return a published catalog.

### 6. Check the installation

1. Open `https://YOUR-PROJECT-REF.supabase.co/functions/v1/catalog-admin` in your browser. It should return JSON containing `catalog`, not an error about a missing release.
2. Visit your GitHub Pages site and complete the questionnaire to check that recommendations appear.
3. Open your site's `admin.html`. In GitHub, create a **fine-grained personal access token** under **Settings → Developer settings → Personal access tokens**, scoped to **your repository** with **Contents: Read and write**. Enter it only in your own admin panel and verify that the catalog loads.
4. You do **not** need to submit real statistics data for this initial check. If you enable voluntary statistics, review consent, privacy information, and the [public dashboard](../statistik.html).

If something fails, check the URLs from step 3 and the `ORIGIN` setting first, then review **Edge Functions → Logs** in Supabase.

### Ongoing use

Edit distributions and scores in your own admin panel. Publishing updates the required files in **your** GitHub repository and activates the same catalog version in Supabase. Scoring-only changes do **not** require redeploying functions; code changes do.

Use the SQL status queries in the German section above to check the active release, scheduled cleanup and contribution count. Statistics are retained for approximately 90 days and represent **submissions, not unique users**. Never publish raw statistics, tokens or service-role keys. Run tests with `node --test tests/*.test.mjs`.
