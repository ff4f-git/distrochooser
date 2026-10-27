import { DISTRO_ICONS } from './icons.js';
import { STATISTICS_ENDPOINT } from './statistics-config.js';
import { createStatisticsClient } from './statistics.js';

const statistics = createStatisticsClient(STATISTICS_ENDPOINT);
const STAT_TEXT = {
  de: {title:'Freiwillige Statistik', help:'Mit deinem Klick übermittelst du deine Antwortkombination, zutreffende RAM-/GPU-Auswahl, die drei Empfehlungen, Sprache und Modellversion an unseren Statistikdienst (Supabase). Die Teilnahme ist freiwillig und beeinflusst dein Ergebnis nicht. Keine Namen, E-Mail-Adressen, Cookies oder dauerhaften Besucherkennungen. Deine IP-Adresse wird technisch an den Dienst übertragen und kann in dessen Betriebsprotokollen vorkommen; sie wird nicht in unserem Statistikdatensatz gespeichert. Die Datensätze werden nach spätestens 90 Tagen gelöscht.',
    button:'Ergebnis zur Statistik beitragen', sending:'Wird gesendet …', sent:'Danke! Dein Ergebnis wurde gezählt.', error:'Senden fehlgeschlagen. Du kannst es erneut versuchen.', unavailable:'Die Statistik ist noch nicht eingerichtet. Es werden keine Antworten übertragen.'},
  en: {title:'Optional statistics', help:'By clicking, you send your answer combination, applicable RAM/GPU selection, three recommendations, language and model version to our statistics service (Supabase). Participation is optional and does not affect your results. No names, email addresses, cookies or persistent visitor identifiers. Your IP address is technically transmitted to the service and may appear in its operational logs; it is not stored in our statistics records. Records are deleted within 90 days.',
    button:'Contribute my result to statistics', sending:'Sending …', sent:'Thank you! Your result was counted.', error:'Could not send. You can try again.', unavailable:'Statistics are not configured yet. No answers are transmitted.'}
};

function statisticsPayload() {
  return { modelVersion:'2.1.1', language,
    answers:answers.map(codes => [...codes].sort()),
    ram:answers[2][0] === 'O' ? ram : null,
    gpu:answers[0].includes('D') ? gpu : null,
    top3:scoreDistributions().slice(0,3).map(distro => distro.name) };
}
function statisticsKey(payload) {
  // Language changes must not count the same answers again.
  return JSON.stringify([payload.answers,payload.ram,payload.gpu,payload.modelVersion]);
}
function renderStatistics() {
  const t = STAT_TEXT[language];
  const state = statistics.state(statisticsKey(statisticsPayload()));
  $('statisticsTitle').textContent = t.title;
  $('statisticsHelp').textContent = t.help;
  $('statisticsButton').textContent = state === 'sending' ? t.sending : t.button;
  $('statisticsButton').disabled = !statistics.enabled || ['sending','sent'].includes(state);
  $('statisticsStatus').textContent = !statistics.enabled ? t.unavailable : (t[state] || '');
  $('statisticsViewLink').lastElementChild.textContent = language === 'de' ? '📊 Öffentliche Statistik ansehen' : '📊 View public statistics';
  $('statisticsViewLink').classList.toggle('hidden', state !== 'sent');
}

// Keep answer codes and GPU bonus keys stable across languages.
const [DATA, GPU_BONUS, DESCRIPTIONS_DE, DESCRIPTIONS_EN, QUESTIONS_EN] = await Promise.all([
  'model.json', 'gpu-bonus.json', 'descriptions-de.json', 'descriptions-en.json', 'questions-en.json'
].map(async file => {
  const response = await fetch(new URL(file, import.meta.url));
  if (!response.ok) throw new Error(`Cannot load ${file}: ${response.status}`);
  return response.json();
}));

const TEXT = {
  de: {
    ready: 'System bereit. Finde dein Linux.', loaded: '✓ 22 Distributionen geladen',
    engine: '✓ Empfehlungssystem bereit', ramTitle: 'Zusatzfrage // Wie viel Arbeitsspeicher (RAM) hat dein Rechner?',
    ramHelp: 'Bei Rechnern ab 8 Jahren korrigiert der Arbeitsspeicher die altersbedingte Empfehlung.',
    gpuTitle: 'Zusatzfrage // Welche Grafikkarte nutzt du?', gpuHelp: 'Damit du die Empfehlung besser einordnen kannst.',
    back: '← Zurück', next: 'Weiter →', calculate: 'Empfehlung berechnen →',
    done: 'ANALYSE ABGESCHLOSSEN', resultsTitle: 'Deine Linux-Empfehlungen',
    resultsHint: 'Die passendsten Linux-Distributionen für dich – abgestimmt auf deine Anforderungen.',
    restart: '↻ Neu starten', edit: '← Antworten ändern',
    footer: 'Linux Distrochooser · Empfehlungen auf Basis einer redaktionell gewichteten Punktematrix; keine objektive Qualitätsmessung.',
    step: 'FRAGE', choose: 'Wähle die Antwort, die am besten zu dir passt.',
    best: 'BESTER MATCH', alternative: 'ALTERNATIVE', missing: 'Weitere Informationen zu dieser Distribution folgen.',
    distro: 'Linux-Distribution', gaming: 'Gaming-Hinweis: Prüfe vor einem Wechsel deine konkreten Spiele, insbesondere Multiplayer-Titel mit Anti-Cheat. ',
    graphics: 'Grafikkarte: ', gamingEnd: 'Achte besonders auf die Unterstützung deiner Spiele und Treiber.'
  },
  en: {
    ready: 'System ready. Find your Linux.', loaded: '✓ 22 distributions loaded',
    engine: '✓ Recommendation engine ready', ramTitle: 'Extra question // How much RAM does your computer have?',
    ramHelp: 'For computers aged 8 years or older, RAM helps refine the age-based recommendation.',
    gpuTitle: 'Extra question // Which graphics card do you use?', gpuHelp: 'This helps put the recommendation in context.',
    back: '← Back', next: 'Next →', calculate: 'Calculate recommendations →',
    done: 'ANALYSIS COMPLETE', resultsTitle: 'Your Linux recommendations',
    resultsHint: 'The Linux distributions that best fit your requirements.',
    restart: '↻ Start over', edit: '← Edit answers',
    footer: 'Linux Distrochooser · Recommendations are based on an editorially weighted scoring matrix, not an objective measure of quality.',
    step: 'QUESTION', choose: 'Choose the answer that fits you best.',
    best: 'BEST MATCH', alternative: 'ALTERNATIVE', missing: 'More information about this distribution is coming soon.',
    distro: 'Linux distribution', gaming: 'Gaming note: Check compatibility with your games before switching, especially multiplayer titles with anti-cheat. ',
    graphics: 'Graphics card: ', gamingEnd: 'Pay particular attention to game and driver support.'
  }
};

const RAM_CHOICES = [
  { code: 'AG', de: '4 GB oder weniger', en: '4 GB or less' },
  { code: 'AH', de: '8 GB', en: '8 GB' },
  { code: 'AI', de: '16 GB', en: '16 GB' },
  { code: 'AK', de: '32 GB oder mehr', en: '32 GB or more' },
  { code: 'AJ', de: 'Weiß ich nicht', en: "I don’t know" }
];
const GPU_CHOICES = [
  { key: 'AMD Radeon', de: 'AMD Radeon', en: 'AMD Radeon' },
  { key: 'Nvidia GeForce', de: 'Nvidia GeForce', en: 'Nvidia GeForce' },
  { key: 'Intel Grafik', de: 'Intel Grafik', en: 'Intel graphics' },
  { key: 'Hybrid / mehrere', de: 'Hybrid / mehrere', en: 'Hybrid / multiple' },
  { key: 'Weiß ich nicht', de: 'Weiß ich nicht', en: "I don’t know" }
];

const $ = id => document.getElementById(id);
const answers = Array.from({ length: DATA.questions.length }, () => []);
let step = 0;
let ram = '';
let gpu = '';
let language = 'de';
let resultsVisible = false;

function optionButton(label, selected, onClick, multi = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'option';
  button.setAttribute('aria-pressed', String(selected));

  const marker = document.createElement('span');
  marker.className = 'mark';
  marker.textContent = multi ? (selected ? '[x]' : '[ ]') : (selected ? '(●)' : '( )');

  const text = document.createElement('span');
  text.textContent = label;
  button.append(marker, text);
  button.addEventListener('click', onClick);
  return button;
}

function setLanguage(nextLanguage) {
  language = nextLanguage;
  document.documentElement.lang = language;
  $('langDe').setAttribute('aria-pressed', String(language === 'de'));
  $('langEn').setAttribute('aria-pressed', String(language === 'en'));
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = TEXT[language][element.dataset.i18n];
  });
  if (resultsVisible) showResults(false);
  else render();
}

function render() {
  resultsVisible = false;
  const original = DATA.questions[step];
  const translated = QUESTIONS_EN[step];
  const question = language === 'de' ? original : translated;
  const t = TEXT[language];

  $('wizard').classList.remove('hidden');
  $('results').style.display = 'none';
  $('stepLabel').textContent = `${t.step} ${String(step + 1).padStart(2, '0')} / ${String(DATA.questions.length).padStart(2, '0')}`;
  $('percentLabel').textContent = `${Math.round(step / DATA.questions.length * 100)} %`;
  $('progressBar').style.width = `${step / DATA.questions.length * 100}%`;
  $('question').textContent = question.title;
  $('hint').textContent = question.hint || t.choose;
  $('options').replaceChildren();

  question.options.forEach(([label, code]) => {
    $('options').append(optionButton(label, answers[step].includes(code), () => {
      if (original.multi) {
        answers[step] = answers[step].includes(code)
          ? answers[step].filter(item => item !== code)
          : [...answers[step], code];
      } else {
        answers[step] = [code];
      }
      render();
    }, original.multi));
  });

  const showRam = step === 2 && answers[2][0] === 'O';
  $('ramExtra').classList.toggle('hidden', !showRam);
  if (showRam) {
    $('ramOptions').replaceChildren();
    RAM_CHOICES.forEach(choice => {
      $('ramOptions').append(optionButton(choice[language], ram === choice.code, () => {
        ram = choice.code;
        render();
      }));
    });
  }

  const showGpu = step === 0 && answers[0].includes('D');
  $('gpuExtra').classList.toggle('hidden', !showGpu);
  if (showGpu) {
    $('gpuOptions').replaceChildren();
    GPU_CHOICES.forEach(choice => {
      $('gpuOptions').append(optionButton(choice[language], gpu === choice.key, () => {
        gpu = choice.key;
        render();
      }));
    });
  }

  $('back').disabled = step === 0;
  $('next').disabled = !answers[step].length || (showRam && !ram);
  $('next').textContent = step === DATA.questions.length - 1 ? t.calculate : t.next;
}

// Preserve the v2.0 weighting, sorting, and top-three recommendation logic.
function scoreDistributions() {
  const usage = answers[0];
  const otherCodes = answers.slice(1).flat();
  if (answers[2][0] === 'O' && ram) otherCodes.push(ram);

  return DATA.distros.map((distro, index) => ({
    ...distro,
    index,
    score: usage.reduce((sum, code) => sum + (Number(distro.points[code]) || 0), 0)
      + otherCodes.reduce((sum, code) => sum + (Number(distro.points[code]) || 0), 0)
      + (usage.includes('D') ? (GPU_BONUS[distro.name]?.[gpu] || 0) : 0)
  })).sort((a, b) => b.score - a.score || a.index - b.index);
}

function showResults(scroll = true) {
  resultsVisible = true;
  const t = TEXT[language];
  const descriptions = language === 'de' ? DESCRIPTIONS_DE : DESCRIPTIONS_EN;
  const scored = scoreDistributions();
  const best = scored[0].score;
  $('resultList').replaceChildren();

  scored.slice(0, 3).forEach((distro, index) => {
    const relative = best > 0 ? distro.score / best : (distro.score === best ? 1 : 0);
    const visualWidth = Math.max(0, Math.min(100, (relative - 0.5) * 200));
    const article = document.createElement('article');
    article.className = 'result';

    const rank = document.createElement('div');
    rank.className = 'rank';
    rank.textContent = `#${String(index + 1).padStart(2, '0')} // ${index === 0 ? t.best : t.alternative}`;

    const head = document.createElement('div');
    head.className = 'result-head';
    const nameWrap = document.createElement('div');
    nameWrap.className = 'distro-name';
    const glyph = document.createElement('span');
    glyph.className = 'distro-icon';
    glyph.setAttribute('aria-hidden', 'true');
    const icon = DISTRO_ICONS[distro.name] || ['\uf17c', '#23bfdc'];
    glyph.textContent = icon[0];
    glyph.style.color = icon[1];
    const title = document.createElement('h2');
    title.textContent = distro.name;
    nameWrap.append(glyph, title);
    head.append(nameWrap);

    const label = document.createElement('div');
    label.className = 'distro-label';
    label.textContent = descriptions[distro.name]?.label || t.distro;
    const meter = document.createElement('div');
    meter.className = 'meter';
    const fill = document.createElement('div');
    fill.style.width = `${visualWidth}%`;
    meter.append(fill);
    const reason = document.createElement('p');
    reason.className = 'reason';
    reason.textContent = descriptions[distro.name]?.description || t.missing;
    article.append(rank, head, label, meter, reason);
    $('resultList').append(article);
  });

  $('warnings').replaceChildren();
  if (answers[0].includes('D')) {
    const warning = document.createElement('p');
    warning.className = 'note';
    const gpuLabel = GPU_CHOICES.find(choice => choice.key === gpu)?.[language] || gpu;
    warning.textContent = t.gaming + (gpu ? `${t.graphics}${gpuLabel}. ` : '') + t.gamingEnd;
    $('warnings').append(warning);
  }

  $('wizard').classList.add('hidden');
  $('results').style.display = 'block';
  renderStatistics();
  if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
}

$('next').addEventListener('click', () => {
  if (!answers[step].length) return;
  if (step === 2 && answers[2][0] === 'O' && !ram) return;
  if (step === DATA.questions.length - 1) showResults();
  else { step++; render(); }
});
$('back').addEventListener('click', () => { if (step > 0) { step--; render(); } });
$('restart').addEventListener('click', () => {
  answers.forEach(answer => { answer.length = 0; });
  step = 0;
  ram = '';
  gpu = '';
  render();
});
$('edit').addEventListener('click', () => { step = DATA.questions.length - 1; render(); });
$('langDe').addEventListener('click', () => setLanguage('de'));
$('langEn').addEventListener('click', () => setLanguage('en'));
$('statisticsButton').addEventListener('click', async () => {
  if (!resultsVisible || !statistics.enabled) return;
  const payload = statisticsPayload();
  const pending = statistics.submit(statisticsKey(payload), payload);
  renderStatistics();
  try { await pending; } catch { /* Inline status provides a retry. */ }
  if (resultsVisible) renderStatistics();
});
setLanguage('de');
