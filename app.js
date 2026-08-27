const slides = [...document.querySelectorAll('.slide')];
const slideIdByTitle = {
  'Rapport de stage et mémoire': 'cover',
  'MPC, interface port-territoire': 'mpc-interface',
  'Trois missions autour de la donnée': 'missions-overview',
  'Fluvial — le problème': 'fluvial-problem',
  'Fluvial — méthode et résultats': 'fluvial-method-results',
  'Navettes — collecte de données': 'navettes-collection',
  'Navettes — modèle statistique': 'navettes-model',
  'Des analyses aux outils opérationnels': 'tools-operations',
  'De la donnée brute à l’aide à la décision': 'stage-bilan',
  'Problématique du mémoire': 'memory-problem',
  'Les bénéfices économiques': 'memory-economy',
  'Externalités et acceptabilité': 'memory-externalities',
  'Une transition déjà engagée': 'memory-transition',
  'GNL et methane slip': 'memory-gnl',
  'Réponse à la problématique': 'memory-answer'
};
const slideIdsInOrder = [
  'cover',
  'mpc-interface',
  'missions-overview',
  'fluvial-problem',
  'fluvial-method-results',
  'navettes-collection',
  'navettes-model',
  'tools-operations',
  'stage-bilan',
  'memory-problem',
  'memory-economy',
  'memory-externalities',
  'memory-transition',
  'memory-gnl',
  'memory-answer'
];
const slideIndexById = new Map();
slides.forEach((slide, index) => {
  const slideId = slide.dataset.slideId || slideIdByTitle[slide.dataset.title] || slideIdsInOrder[index] || `slide-${index + 1}`;
  slide.dataset.slideId = slideId;
  slideIndexById.set(slideId, index);
});
if (slides.length !== slideIdsInOrder.length) console.warn(`Structure attendue : ${slideIdsInOrder.length} slides, structure trouvée : ${slides.length}.`);
const jumpRouteByLegacyIndex = {
  3: 'fluvial-problem',
  5: 'navettes-collection',
  7: 'tools-operations'
};
const sectionRouteByKey = {
  1: 'mpc-interface',
  2: 'missions-overview',
  3: 'stage-bilan',
  4: 'memory-problem'
};
const sectionName = document.getElementById('sectionName');
const slideTitle = document.getElementById('slideTitle');
const slideCount = document.getElementById('slideCount');
const routeProgress = document.getElementById('routeProgress');
const notesPanel = document.getElementById('notesPanel');
const notesTitle = document.getElementById('notesTitle');
const notesBody = document.getElementById('notesBody');
const sectionTimer = document.getElementById('sectionTimer');
const recommendedTime = document.getElementById('recommendedTime');
const timerButton = document.getElementById('timerButton');
const timerValue = document.getElementById('timerValue');
const timerTarget = document.getElementById('timerTarget');
const overviewModal = document.getElementById('overviewModal');
const resourcesModal = document.getElementById('resourcesModal');
const helpModal = document.getElementById('helpModal');
const imageModal = document.getElementById('imageModal');
const zoomedImage = document.getElementById('zoomedImage');
const toast = document.getElementById('toast');

const notesBySlideId = {
  cover: {
    bullets: [
      'Saluer le jury et se présenter : Karl Kiwan, Université de Toulon, stage chez Marseille Provence Croisière.',
      'Annoncer le fil : la structure, trois missions concrètes, le bilan du stage, puis le mémoire sur la transition environnementale.',
      'Lancer le chronomètre au moment de commencer la présentation de MPC.'
    ],
    cue: 'Regarder le jury, marquer une courte pause, puis commencer.'
  },
  'mpc-interface': {
    bullets: [
      'MPC est une association créée en 1996 qui fédère plus de 85 adhérents de la croisière maritime et fluviale.',
      'Son rôle est celui d’une interface entre les compagnies, le GPMM, MPCT et les acteurs du territoire.',
      'En 2025, l’activité suivie représente environ 2,6 millions de croisiéristes et 660 escales.',
      'Situer le stage dans le volet statistique et data de l’association.'
    ],
    cue: 'Cliquer sur un chiffre clé seulement si cela soutient la phrase.'
  },
  'missions-overview': {
    bullets: [
      'Mission fluviale : relier les lignes d’escale et appliquer une méthode de calcul reproductible.',
      'Mission navettes : produire une donnée absente sur le terrain, puis la modéliser.',
      'Mission manifestes : réduire une consolidation trop longue sans supprimer le contrôle humain.',
      'Objectif commun : rendre les données de MPC plus fiables, rapides et exploitables.'
    ],
    cue: 'Annoncer les trois verbes : structurer, estimer, superviser.'
  },
  'fluvial-problem': {
    bullets: [
      'MPC ne recevait pas de manifestes passagers pour la croisière fluviale.',
      'Gescales fournissait le navire, le port et les dates, mais pas la fréquentation réelle.',
      'Les lignes seules ne permettaient pas de distinguer correctement tête de ligne et transit.',
      'Le périmètre couvre 28 navires, 3 133 lignes en 2026 et 3 038 en 2025.'
    ],
    cue: 'Utiliser l’exemple Avignon–Arles–Avignon pour rendre le problème immédiat.'
  },
  'fluvial-method-results': {
    bullets: [
      'Constituer le référentiel des 28 navires, puis reconstruire chaque itinéraire dans l’ordre chronologique.',
      'Qualifier tête de ligne ou transit, retirer doublons, hivernages et cas particuliers, puis appliquer capacité × 90 %.',
      'Résultats 2026 : environ 152 100 passagers tête de ligne et 223 800 passagers en transit.',
      'La méthode est réutilisable ; le taux de remplissage reste une hypothèse moyenne.'
    ],
    cue: 'Parcourir deux ou trois étapes, puis basculer directement sur les résultats.'
  },
  'navettes-collection': {
    bullets: [
      'MPC ne disposait d’aucune statistique fiable sur l’usage des navettes payantes vers la Major.',
      'Après comparaison d’un questionnaire et d’un comptage physique, le comptage a été retenu.',
      'Dix journées ont été observées entre avril et juin 2026 ; neuf observations sont exploitables.',
      'Sur une observation doublée, l’écart entre les deux relevés reste inférieur à 0,5 %, ce qui vérifie la cohérence de la collecte.'
    ],
    cue: 'Montrer le contrôle entre les deux relevés, puis conclure sur les neuf observations.'
  },
  'navettes-model': {
    bullets: [
      'La régression est construite sans constante : zéro passager doit donner zéro utilisateur estimé.',
      'Coefficients : 30,69 % mass market, 52,46 % premium et 42,86 % luxe.',
      'Dire « R² centré égal à 0,881 » ; RMSE de 439 sur l’échantillon et 678 en retrait successif.',
      'Avec neuf observations, le modèle indique un ordre de grandeur par segment et ne prévoit pas chaque escale individuellement.'
    ],
    cue: 'Sélectionner Premium, puis formuler immédiatement la limite du modèle.'
  },
  'tools-operations': {
    bullets: [
      'L’application HTML et JavaScript rend le modèle utilisable par l’équipe sans passer par R.',
      'Le fichier 2026 comporte 772 lignes réparties sur 308 dates ; les lignes annulées ou déprogrammées sont exclues des agrégats opérationnels.',
      'L’application présentée est la version opérationnelle du stage ; ses coefficients diffèrent légèrement de la reproduction finale sous R affichée à la fiche précédente.',
      'La copie publique montre une synthèse visuelle ; l’application, le rapport complet et le planning ne sont pas diffusés.',
      'La procédure manifestes combine extraction Python, aide de l’IA, normalisation, intégration Excel et validation humaine.',
      'Le délai passe généralement d’environ une semaine à 1,5–2 jours, et peut atteindre 2,5 jours lorsque le volume augmente.'
    ],
    cue: 'Agrandir l’aperçu seulement si cela soutient l’explication, puis revenir au workflow des manifestes.'
  },
  'stage-bilan': {
    bullets: [
      'Résumer les opérations réalisées : collecter, structurer, modéliser, contrôler et restituer.',
      'Pour MPC : une méthode fluviale réutilisable, un estimateur de navettes et une consolidation plus rapide.',
      'Compétences : Excel, R, statistiques, Python, HTML, JavaScript et automatisation supervisée.',
      'Insister sur la prudence : un outil quantitatif reste utile si ses limites sont visibles.'
    ],
    cue: 'Terminer par le lien entre enjeux économiques, portuaires et environnementaux.'
  },
  'memory-problem': {
    bullets: [
      'Poser la tension : Marseille bénéficie de la croisière, mais certaines externalités affectent son acceptabilité territoriale.',
      'Lire la problématique sans la reformuler ni l’allonger.',
      'Annoncer le raisonnement : valeur économique, externalités, transition, limites et conditions de conciliation.'
    ],
    cue: 'Laisser la problématique visible une seconde avant de poursuivre.'
  },
  'memory-economy': {
    bullets: [
      'En 2025, Marseille accueille environ 2,6 millions de croisiéristes.',
      'Repères 2015 : environ 50 € dépensés à terre par un passager en transit et 160 € par un passager en tête de ligne.',
      'Les 310 M€ correspondent à une étude de 2016 : les présenter uniquement comme un chiffre historique.',
      'L’enjeu est aussi de capter les dépenses dans l’hôtellerie, la restauration, les transports et les excursions.'
    ],
    cue: 'Comparer Transit et Tête de ligne, puis rappeler la date du chiffre de 310 M€.'
  },
  'memory-externalities': {
    bullets: [
      'Les retombées économiques peuvent se diffuser dans la métropole et la région.',
      'À l’inverse, pollution atmosphérique, bruit, circulation et concentration des visiteurs restent plus localisés.',
      'Les 54 % de NOx concernent tout le trafic maritime de Marseille en 2021, pas la seule croisière.',
      'Ce décalage spatial fait apparaître la question de l’acceptabilité territoriale.'
    ],
    cue: 'Prononcer clairement la réserve « toutes activités maritimes confondues ».'
  },
  'memory-transition': {
    bullets: [
      'Trois niveaux évoluent ensemble : réglementation, infrastructures portuaires et flotte.',
      'CENAQ dépasse 200 M€ pour l’ensemble du programme et permet notamment trois grands navires raccordés simultanément.',
      'Les scénarios 2025 indiquent −3,75 % de NOx sans électrification contre −33,5 % avec 60 % du temps d’escale électrifié.',
      'Préciser qu’il s’agit de scénarios étudiés, pas de réductions déjà mesurées.'
    ],
    cue: 'Cliquer sur Infrastructure, puis opposer les deux scénarios sans surinterpréter.'
  },
  'memory-gnl': {
    bullets: [
      'Sur le navire étudié, le GNL réduit fortement la masse de particules et le carbone noir par rapport au gazole marin.',
      'Distinguer qualité de l’air locale et bilan climatique en équivalent CO₂.',
      'Le methane slip est du méthane non brûlé rejeté directement dans l’atmosphère.',
      'À faible charge, ces rejets peuvent réduire ou annuler l’avantage climatique du GNL.'
    ],
    cue: 'Faire apparaître successivement Qualité de l’air puis Climat.'
  },
  'memory-answer': {
    bullets: [
      'Réponse : oui, la transition peut améliorer la conciliation, mais elle ne garantit pas seule l’acceptabilité.',
      'Condition 1 : les équipements et technologies doivent être réellement utilisés.',
      'Condition 2 : les gains doivent produire une réduction absolue malgré l’évolution du trafic.',
      'Condition 3 : gérer aussi les déplacements, les flux de passagers et les nuisances résiduelles.'
    ],
    cue: 'Conclure par les trois conditions, remercier, puis ouvrir les questions.'
  }
};

const emptyNote = { bullets: [], cue: '' };

function noteForSlide(index = currentIndex) {
  return notesBySlideId[slides[index]?.dataset.slideId] || emptyNote;
}

const actorData = {
  gpmm: {
    label: 'ÉTABLISSEMENT PUBLIC · EPIC',
    title: 'Gère le domaine et les infrastructures',
    text: 'Autorité portuaire propriétaire et gestionnaire du domaine public maritime : sûreté, capitainerie, domaine et investissements lourds.'
  },
  mpct: {
    label: 'SAS D’EXPLOITATION TERMINALE',
    title: 'Exploite directement les terminaux',
    text: 'Consortium d’armateurs dont le GPMM détient 15 % : accueil des navires, passerelles, bagages et embarquement ou débarquement au môle Léon Gourret.'
  },
  mpc: {
    label: 'ASSOCIATION D’INTERFACE · LOI 1901',
    title: 'Assure la liaison entre le port et le territoire',
    text: 'Ingénierie territoriale : engagement environnemental, accueil et flux visiteurs, offre touristique, suivi du marché et promotion de Marseille-Provence.'
  }
};

const axisData = [
  'Veille, engagement sectoriel, CENAQ et mobilités plus durables.',
  'Parcours, excursions, séjours pré/post-croisière et coordination des flux visiteurs.',
  'Relations armateurs, promotion de la destination, études et suivi des escales maritimes et fluviales.'
];

const leverData = [
  {
    effect: 'Agir sur les gaz à effet de serre, l’intensité carbone et les émissions de soufre.',
    proof: 'EU ETS, FuelEU Maritime et zone méditerranéenne de contrôle des émissions de soufre.',
    limit: 'Ces dispositifs ne ciblent pas les mêmes émissions ; leurs effets doivent être évalués séparément.'
  },
  {
    effect: 'Couper les moteurs auxiliaires des navires pendant l’escale.',
    proof: 'Budget total de CENAQ : plus de 200 M€ ; le programme ne concerne pas uniquement la croisière.',
    limit: 'Le gain dépend de l’équipement du quai, du navire et de son usage réel.'
  },
  {
    effect: 'Réduire les émissions par la flotte, l’énergie et l’efficacité.',
    proof: 'Renouvellement des navires et diversification des carburants.',
    limit: 'Il faut constater une baisse réelle des impacts malgré l’évolution du trafic.'
  }
];

const mpcStatData = {
  1996: ['1996', 'MPC est une association loi 1901 créée pour coordonner et développer la filière croisière à Marseille.'],
  members: ['PLUS DE 85 ADHÉRENTS', 'Le réseau représente la chaîne de valeur du tourisme maritime et fluvial en Provence.'],
  team: ['5 SALARIÉES', 'L’équipe permanente réunit des expertises en direction, relations armateurs, croisière, accueil, statistique et communication.'],
  calls: ['660 ESCALES', 'MPC a suivi 660 escales maritimes en 2025, soit une progression de 8 % sur un an.'],
  passengers: ['2,6 M DE PASSAGERS', 'En 2025, Marseille a accueilli environ 2,6 millions de croisiéristes.']
};

const proofData = {
  fluvial: ['Base fluviale 2025–2026', '3 133 lignes traitées en 2026 · résultats présentés au Club Rhône–Saône'],
  navettes: ['Estimateur autonome 2026', '772 lignes de planning · 308 dates couvertes · modèle calibré sur 9 observations exploitables'],
  manifestes: ['Procédure supervisée de consolidation', 'Plus de 50 nationalités possibles · délai courant ramené à 1,5–2 jours']
};

const historyData = {
  2010: ['2010', '≈ 680 000 croisiéristes', 'Premier jalon chiffré de la série présentée dans la figure 19.'],
  2016: ['2016', '≈ 1 600 000 croisiéristes', 'Valeur imprimée dans la figure 19 du rapport.'],
  2019: ['2019', '≈ 1 860 000 croisiéristes', 'Dernier jalon chiffré avant la rupture sanitaire.'],
  2020: ['2020', '≈ 160 000 croisiéristes', 'Rupture liée à la crise sanitaire, explicitement signalée dans le mémoire.'],
  2023: ['2023', '≈ 2 540 000 croisiéristes', 'Valeur imprimée dans la figure 19 du rapport.'],
  2024: ['2024', '≈ 2 420 000 croisiéristes', 'Valeur imprimée dans la figure 19 du rapport.'],
  2025: ['2025', '≈ 2 600 000 croisiéristes', 'Valeur imprimée dans la figure 19 du rapport.']
};

const timerState = { elapsed: 0, startedAt: 0, running: false, target: 16.5 * 60 };
let currentIndex = 0;
let currentSection = slides[0]?.dataset.section || '';
let sectionStartedAt = 0;
let presenterWindow = null;
const portfolioMessageTargetOrigin = /^https?:$/.test(window.location.protocol) ? window.location.origin : '*';
let toastTimer = null;
let navigationEpoch = 0;
let touchGesture = null;

const appRoot = document.querySelector('.app');
const slidesRoot = document.getElementById('slides');
const prevButton = document.querySelector('[data-action="prev"]');
const nextButton = document.querySelector('[data-action="next"]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const slideAnimations = new Set();
const detailAnimations = new WeakMap();
const modalReturnFocus = new WeakMap();
const modalFocusTimers = new WeakMap();
const interactiveSelector = 'a, button, input, select, textarea, iframe, summary, [contenteditable="true"], [role="button"], [role="tab"], [role="slider"]';
const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function slideIndexFor(route) {
  return slideIndexById.get(route);
}

function goToRoute(route, options = {}) {
  const index = slideIndexFor(route);
  if (!Number.isInteger(index)) {
    console.warn(`Route de slide inconnue : ${route}`);
    return;
  }
  goTo(index, options);
}

function indexFromHash(hash = window.location.hash) {
  const value = decodeURIComponent(hash.replace(/^#/, ''));
  if (/^\d+$/.test(value)) return Number(value) - 1;
  return slideIndexFor(value) ?? 0;
}

function formatTime(seconds) {
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60).toString().padStart(2, '0');
  const remainder = (safe % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
}

function elapsedNow() {
  if (!timerState.running) return timerState.elapsed;
  return timerState.elapsed + (Date.now() - timerState.startedAt) / 1000;
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

function updateTimer() {
  const elapsed = elapsedNow();
  const elapsedLabel = formatTime(elapsed);
  const targetLabel = formatTime(timerState.target);
  if (timerValue) timerValue.textContent = elapsedLabel;
  if (timerTarget) timerTarget.textContent = `/ ${targetLabel}`;
  if (sectionTimer) sectionTimer.textContent = `Section ${formatTime(elapsed - sectionStartedAt)}`;
  timerButton?.classList.toggle('is-running', timerState.running);
  timerButton?.classList.toggle('is-warning', elapsed >= timerState.target - 120 && elapsed < timerState.target);
  timerButton?.classList.toggle('is-over', elapsed >= timerState.target);
  timerButton?.setAttribute('aria-pressed', String(timerState.running));
  timerButton?.setAttribute('aria-label', `Chronomètre ${elapsedLabel} / ${targetLabel} — ${timerState.running ? 'mettre en pause' : 'démarrer'}`);
  pushPresenterState();
}

function toggleTimer(force) {
  const shouldRun = typeof force === 'boolean' ? force : !timerState.running;
  if (shouldRun === timerState.running) return;
  if (shouldRun) {
    timerState.startedAt = Date.now();
    timerState.running = true;
  } else {
    timerState.elapsed = elapsedNow();
    timerState.running = false;
  }
  updateTimer();
}

function setTarget(minutes) {
  const parsedMinutes = Number(minutes);
  if (!Number.isFinite(parsedMinutes) || parsedMinutes <= 0) return;
  timerState.target = parsedMinutes * 60;
  document.querySelectorAll('[data-target-minutes]').forEach(button => {
    const selected = Number(button.dataset.targetMinutes) === Number(minutes);
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  updateTimer();
  showToast(`Objectif réglé sur ${formatTime(timerState.target)}`);
}

function renderNotes() {
  const slide = slides[currentIndex];
  if (!slide) return;
  const note = noteForSlide();
  if (notesTitle) notesTitle.textContent = slide.dataset.title;
  if (notesBody) {
    const list = document.createElement('ul');
    note.bullets.forEach(item => {
      const listItem = document.createElement('li');
      listItem.textContent = item;
      list.appendChild(listItem);
    });
    const cue = document.createElement('div');
    cue.className = 'oral-cue';
    const cueLabel = document.createElement('strong');
    cueLabel.textContent = 'Repère :';
    cue.append(cueLabel, document.createTextNode(` ${note.cue}`));
    notesBody.replaceChildren(list, cue);
  }
  if (recommendedTime) recommendedTime.textContent = `Recommandé ${slide.dataset.duration}`;
}

function buildProgress() {
  if (!routeProgress) return;
  routeProgress.innerHTML = slides.map((slide, index) => `<button class="progress-dot" type="button" data-progress-jump="${index}" aria-label="Aller à la fiche ${index + 1} : ${slide.dataset.title}"></button>`).join('');
}

function buildOverview() {
  const grid = document.getElementById('overviewGrid');
  if (!grid) return;
  grid.innerHTML = slides.map((slide, index) => `
    <button class="overview-item" type="button" data-overview-jump="${index}">
      <span>${String(index + 1).padStart(2, '0')} · ${slide.dataset.section}</span>
      <strong>${slide.dataset.title}</strong>
      <small>${slide.dataset.duration}</small>
    </button>`).join('');
}

function updateProgress() {
  document.querySelectorAll('.progress-dot').forEach((dot, index) => {
    dot.classList.toggle('is-past', index < currentIndex);
    dot.classList.toggle('is-current', index === currentIndex);
    dot.setAttribute('aria-current', index === currentIndex ? 'step' : 'false');
  });
  document.querySelectorAll('.overview-item').forEach((item, index) => item.classList.toggle('is-current', index === currentIndex));
  const atStart = currentIndex === 0;
  const atEnd = currentIndex === slides.length - 1;
  if (prevButton) {
    prevButton.disabled = atStart;
    prevButton.classList.toggle('is-disabled', atStart);
    prevButton.setAttribute('aria-disabled', String(atStart));
  }
  if (nextButton) {
    nextButton.disabled = atEnd;
    nextButton.classList.toggle('is-disabled', atEnd);
    nextButton.setAttribute('aria-disabled', String(atEnd));
  }
}

function normalizeSlides(activeIndex) {
  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === activeIndex;
    slide.classList.toggle('is-active', active);
    slide.classList.toggle('was-before', slideIndex < activeIndex);
    slide.classList.remove('is-entering', 'is-leaving');
    slide.setAttribute('aria-hidden', String(!active));
    slide.inert = !active;
    slide.style.removeProperty('z-index');
    if (active) slide.scrollTop = 0;
  });
}

function cancelSlideMotion() {
  navigationEpoch += 1;
  slideAnimations.forEach(animation => animation.cancel());
  slideAnimations.clear();
  normalizeSlides(currentIndex);
}

function focusSlideHeading(index) {
  const heading = slides[index]?.querySelector('h1, h2');
  if (!heading) return;
  heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
}

function syncSlideChrome(priorSection) {
  const slide = slides[currentIndex];
  if (!slide) return;
  if (currentSection !== priorSection) sectionStartedAt = elapsedNow();
  if (sectionName) sectionName.textContent = currentSection;
  if (slideTitle) slideTitle.textContent = slide.dataset.title;
  if (slideCount) slideCount.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  document.title = `${slide.dataset.title} — Karl Kiwan`;
  window.history.replaceState(null, '', `#${currentIndex + 1}`);
  renderNotes();
  updateProgress();
  updateTimer();
}

function goTo(index, options = {}) {
  if (!slides.length) return;
  const parsedIndex = Number(index);
  if (!Number.isFinite(parsedIndex)) return;
  const nextIndex = Math.max(0, Math.min(slides.length - 1, parsedIndex));
  if (nextIndex === currentIndex && !options.force) return;

  const sourceIndex = currentIndex;
  const priorSection = currentSection;
  cancelSlideMotion();
  currentIndex = nextIndex;
  currentSection = slides[currentIndex].dataset.section;
  syncSlideChrome(priorSection);

  const instant = options.force || options.instant || sourceIndex === nextIndex || reducedMotion.matches || typeof slides[currentIndex].animate !== 'function';
  if (instant) {
    normalizeSlides(currentIndex);
    if (options.focus) focusSlideHeading(currentIndex);
    return;
  }

  const epoch = ++navigationEpoch;
  const direction = nextIndex > sourceIndex ? 1 : -1;
  const outgoing = slides[sourceIndex];
  const incoming = slides[nextIndex];

  slides.forEach((slide, slideIndex) => {
    if (slideIndex !== sourceIndex && slideIndex !== nextIndex) {
      slide.classList.remove('is-active', 'is-entering', 'is-leaving');
      slide.setAttribute('aria-hidden', 'true');
      slide.inert = true;
    }
  });

  outgoing.classList.remove('is-active', 'is-entering');
  outgoing.classList.add('is-leaving');
  outgoing.setAttribute('aria-hidden', 'false');
  outgoing.inert = true;
  outgoing.style.zIndex = '3';

  incoming.classList.remove('is-leaving', 'was-before');
  incoming.classList.add('is-active', 'is-entering');
  incoming.setAttribute('aria-hidden', 'false');
  incoming.inert = false;
  incoming.style.zIndex = '2';
  incoming.scrollTop = 0;

  const outgoingAnimation = outgoing.animate([
    { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
    { opacity: 0, transform: `translate3d(${-16 * direction}px, 0, 0) scale(.992)` }
  ], { duration: 160, easing: 'cubic-bezier(.4,0,1,1)', fill: 'both' });

  const incomingAnimation = incoming.animate([
    { opacity: 0, transform: `translate3d(${24 * direction}px, 0, 0) scale(.99)` },
    { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' }
  ], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' });

  slideAnimations.add(outgoingAnimation);
  slideAnimations.add(incomingAnimation);
  Promise.all([
    outgoingAnimation.finished.catch(() => null),
    incomingAnimation.finished.catch(() => null)
  ]).then(() => {
    slideAnimations.delete(outgoingAnimation);
    slideAnimations.delete(incomingAnimation);
    if (epoch !== navigationEpoch) return;
    normalizeSlides(currentIndex);
    if (options.focus) focusSlideHeading(currentIndex);
  });
}

function toggleNotes(force) {
  if (!notesPanel) return;
  const open = typeof force === 'boolean' ? force : !notesPanel.classList.contains('is-open');
  notesPanel.classList.toggle('is-open', open);
  notesPanel.setAttribute('aria-hidden', String(!open));
  document.querySelectorAll('[data-action="notes"]').forEach(button => button.setAttribute('aria-expanded', String(open)));
}

function setBackgroundInert(inert) {
  if (appRoot) appRoot.inert = inert;
  if (notesPanel) notesPanel.inert = inert;
}

function visibleFocusableElements(container) {
  return [...container.querySelectorAll(focusableSelector)].filter(element => {
    const style = window.getComputedStyle(element);
    return style.visibility !== 'hidden' && style.display !== 'none';
  });
}

function focusSafely(element) {
  if (!element?.isConnected) return;
  element.focus({ preventScroll: true });
  if (document.activeElement !== element) {
    window.setTimeout(() => element.isConnected && element.focus({ preventScroll: true }), 0);
  }
}

function openModal(modal, trigger = document.activeElement) {
  if (!modal) return;
  window.clearTimeout(modalFocusTimers.get(modal));
  document.querySelectorAll('.modal.is-open').forEach(item => closeModal(item, { restoreFocus: false, keepBackgroundInert: true }));
  if (trigger instanceof HTMLElement) {
    modalReturnFocus.set(modal, trigger);
    trigger.setAttribute('aria-expanded', 'true');
    if (modal.id) trigger.setAttribute('aria-controls', modal.id);
  }
  setBackgroundInert(true);
  modal.style.visibility = 'visible';
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  if (!reducedMotion.matches && typeof modal.animate === 'function') {
    modal.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' });
    modal.querySelector('.modal-card, img')?.animate([
      { opacity: 0, transform: 'translateY(12px) scale(.985)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' }
    ], { duration: 240, easing: 'cubic-bezier(.22,1,.36,1)' });
  }
  const focusTimer = window.setTimeout(() => {
    if (modal.classList.contains('is-open')) focusSafely(visibleFocusableElements(modal)[0]);
  }, reducedMotion.matches ? 0 : 245);
  modalFocusTimers.set(modal, focusTimer);
}

function closeModal(modal, options = {}) {
  if (!modal) return;
  window.clearTimeout(modalFocusTimers.get(modal));
  const trigger = modalReturnFocus.get(modal);
  modal.classList.remove('is-open');
  modal.style.removeProperty('visibility');
  modal.setAttribute('aria-hidden', 'true');
  if (trigger instanceof HTMLElement) trigger.setAttribute('aria-expanded', 'false');
  modalReturnFocus.delete(modal);
  if (!options.keepBackgroundInert && !document.querySelector('.modal.is-open')) setBackgroundInert(false);
  if (options.restoreFocus !== false) {
    const focusTimer = window.setTimeout(() => {
      if (!document.querySelector('.modal.is-open')) focusSafely(trigger);
    }, reducedMotion.matches ? 0 : 225);
    modalFocusTimers.set(modal, focusTimer);
  }
}

function trapModalFocus(event, modal) {
  const focusable = visibleFocusableElements(modal);
  if (!focusable.length) {
    event.preventDefault();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && (active === first || !modal.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || !modal.contains(active))) {
    event.preventDefault();
    first.focus();
  }
}

function closeTopLayer() {
  const openModalElement = document.querySelector('.modal.is-open');
  if (openModalElement) {
    closeModal(openModalElement);
    return true;
  }
  if (notesPanel?.classList.contains('is-open')) {
    toggleNotes(false);
    return true;
  }
  return false;
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch {
    showToast('Le plein écran est bloqué par le navigateur');
  }
}

function openPresenter() {
  presenterWindow = window.open('presenter.html', 'karl-presenter', 'popup,width=1080,height=760');
  if (!presenterWindow) {
    showToast('Autorisez les fenêtres surgissantes pour la console présentateur');
    return;
  }
  window.setTimeout(pushPresenterState, 500);
}

function presenterState() {
  const slide = slides[currentIndex];
  if (!slide) return null;
  const note = noteForSlide();
  const next = slides[currentIndex + 1];
  return {
    index: currentIndex,
    count: slides.length,
    section: currentSection,
    title: slide.dataset.title,
    duration: slide.dataset.duration,
    nextTitle: next?.dataset.title || 'Questions',
    notes: note,
    elapsed: elapsedNow(),
    sectionElapsed: elapsedNow() - sectionStartedAt,
    target: timerState.target,
    running: timerState.running
  };
}

function pushPresenterState() {
  if (presenterWindow && !presenterWindow.closed) {
    const state = presenterState();
    if (state) presenterWindow.postMessage({ type: 'portfolio-state', state }, portfolioMessageTargetOrigin);
  }
}

function animateDetail(element, update, animate = true) {
  if (!element) return;
  detailAnimations.get(element)?.cancel();
  update();
  if (!animate || reducedMotion.matches || typeof element.animate !== 'function') return;
  const animation = element.animate([
    { opacity: .35, transform: 'translateY(6px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], { duration: 180, easing: 'cubic-bezier(.22,1,.36,1)' });
  detailAnimations.set(element, animation);
  animation.finished.then(
    () => { if (detailAnimations.get(element) === animation) detailAnimations.delete(element); },
    () => { if (detailAnimations.get(element) === animation) detailAnimations.delete(element); }
  );
}

function updateTabSelection(buttons, activeButton) {
  buttons.forEach(button => {
    const selected = button === activeButton;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
}

function setActor(actor, options = {}) {
  const data = actorData[actor];
  if (!data) return;
  const actorTabs = [...document.querySelectorAll('.actor-button[data-actor]')];
  const activeTab = actorTabs.find(button => button.dataset.actor === actor);
  if (activeTab) updateTabSelection(actorTabs, activeTab);
  document.querySelectorAll('.map-node[data-actor]').forEach(button => {
    const selected = button.dataset.actor === actor;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  const detail = document.getElementById('actorDetail');
  animateDetail(detail, () => {
    detail.innerHTML = `<small>${data.label}</small><strong>${data.title}</strong><p>${data.text}</p>`;
  }, options.animate !== false);
}

function setAxis(index, options = {}) {
  const buttons = [...document.querySelectorAll('[data-axis]')];
  const active = buttons.find(button => Number(button.dataset.axis) === Number(index));
  if (!active || !axisData[Number(index)]) return;
  updateTabSelection(buttons, active);
  animateDetail(document.getElementById('axisDetail'), () => {
    document.getElementById('axisDetail').textContent = axisData[Number(index)];
  }, options.animate !== false);
}

function setLever(index, options = {}) {
  const buttons = [...document.querySelectorAll('[data-lever]')];
  const active = buttons.find(button => Number(button.dataset.lever) === Number(index));
  const data = leverData[Number(index)];
  if (!active || !data) return;
  updateTabSelection(buttons, active);
  animateDetail(document.getElementById('leverDetail'), () => {
    document.getElementById('leverDetail').innerHTML = `
      <div><span>EFFET ATTENDU</span><strong>${data.effect}</strong></div>
      <div><span>POINT DOCUMENTÉ</span><strong>${data.proof}</strong></div>
      <div><span>CONDITION DE RÉUSSITE</span><strong>${data.limit}</strong></div>`;
  }, options.animate !== false);
}

function setRouteStop(button, options = {}) {
  if (!button) return;
  const routeCase = button.closest('.route-case') || button.parentElement;
  const buttons = [...routeCase.querySelectorAll('[data-route-stop]')];
  const index = buttons.indexOf(button);
  updateTabSelection(buttons, button);
  routeCase.style.setProperty('--route-step', String(index));
  routeCase.style.setProperty('--route-progress', `${buttons.length > 1 ? index / (buttons.length - 1) * 100 : 0}%`);
  animateDetail(document.getElementById('routeCaseDetail'), () => {
    document.getElementById('routeCaseDetail').innerHTML = `<span>RÈGLE ACTIVE</span><p>${button.dataset.routeStop}</p>`;
  }, options.animate !== false);
}

function setModelSegment(button, options = {}) {
  if (!button) return;
  const selector = button.closest('.coefficient-selector') || button.parentElement;
  const buttons = [...selector.querySelectorAll('[data-model-segment]')];
  const index = buttons.indexOf(button);
  updateTabSelection(buttons, button);
  selector.style.setProperty('--model-step', String(index));
  document.querySelectorAll('.model-equation em').forEach((term, termIndex) => term.classList.toggle('is-emphasized', termIndex === index));
  animateDetail(document.getElementById('modelSegmentDetail'), () => {
    document.getElementById('modelSegmentDetail').innerHTML = `<span>LECTURE</span> ${button.dataset.modelSegment}`;
  }, options.animate !== false);
}

function setManifestStep(button, options = {}) {
  if (!button) return;
  const workflow = button.closest('.manifest-workflow') || button.parentElement;
  const buttons = [...workflow.querySelectorAll('[data-manifest-step]')];
  const index = buttons.indexOf(button);
  updateTabSelection(buttons, button);
  workflow.style.setProperty('--manifest-step', String(index));
  buttons.forEach((step, stepIndex) => step.classList.toggle('is-complete', stepIndex < index));
  workflow.querySelectorAll('.workflow-line i').forEach((segment, segmentIndex) => segment.classList.toggle('is-complete', segmentIndex < index));
  const label = button.querySelector('strong')?.textContent || `ÉTAPE ${index + 1}`;
  animateDetail(document.getElementById('manifestStepDetail'), () => {
    document.getElementById('manifestStepDetail').innerHTML = `<span>ÉTAPE ${String(index + 1).padStart(2, '0')} · ${label.toUpperCase()}</span><p>${button.dataset.manifestStep}</p>`;
  }, options.animate !== false);
}

function setMpcStat(button, options = {}) {
  if (!button) return;
  const data = mpcStatData[button.dataset.mpcStat];
  const buttons = [...document.querySelectorAll('[data-mpc-stat]')];
  if (!data) return;
  updateTabSelection(buttons, button);
  buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  animateDetail(document.getElementById('mpcStatDetail'), () => {
    document.getElementById('mpcStatDetail').innerHTML = `<span>${data[0]}</span> ${data[1]}`;
  }, options.animate !== false);
}

function setProofRow(button, options = {}) {
  if (!button) return;
  const data = proofData[button.dataset.proofRow];
  const buttons = [...document.querySelectorAll('[data-proof-row]')];
  if (!data) return;
  buttons.forEach(item => {
    const selected = item === button;
    item.classList.toggle('is-active', selected);
    item.setAttribute('aria-pressed', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  animateDetail(document.getElementById('proofTableDetail'), () => {
    document.getElementById('proofTableDetail').innerHTML = `<span>PREUVE ASSOCIÉE</span><strong>${data[0]}</strong><small>${data[1]}</small>`;
  }, options.animate !== false);
}

function setHistoryYear(point, options = {}) {
  if (!point) return;
  const data = historyData[point.dataset.historyYear];
  const chart = point.closest('[data-history-chart]');
  if (!data || !chart) return;
  const points = [...chart.querySelectorAll('[data-history-year]')];
  updateTabSelection(points, point);
  chart.dataset.selectedYear = point.dataset.historyYear;
  animateDetail(document.getElementById('historyChartReading'), () => {
    document.getElementById('historyChartReading').innerHTML = `<span>${data[0]}</span><strong>${data[1]}</strong><small>${data[2]}</small>`;
  }, options.animate !== false);
}

function parseDisplayNumber(value) {
  const number = Number(String(value || '').replace(/[^\d,-]/g, '').replace(',', '.'));
  return Number.isFinite(number) ? number : null;
}

function selectPortRow(row, options = {}) {
  if (!row) return;
  const chart = row.closest('.port-chart') || row.parentElement;
  const rows = [...chart.querySelectorAll('.port-row, [data-port-row]')];
  rows.forEach(item => {
    const selected = item === row;
    item.classList.toggle('is-active', selected);
    item.setAttribute('aria-selected', String(selected));
    item.setAttribute('aria-pressed', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  const port = row.dataset.port || row.querySelector('b, strong')?.textContent?.trim() || 'Port sélectionné';
  const value2025 = row.querySelector('.year-2025 em')?.textContent?.trim() || row.dataset.value2025 || '—';
  const value2026 = row.querySelector('.year-2026 em')?.textContent?.trim() || row.dataset.value2026 || '—';
  const first = parseDisplayNumber(row.dataset.value2025 || value2025);
  const second = parseDisplayNumber(row.dataset.value2026 || value2026);
  const delta = first !== null && second !== null ? second - first : null;
  const percent = first && delta !== null ? delta / first * 100 : null;
  const formattedDelta = delta === null ? '—' : `${delta >= 0 ? '+' : '−'}${new Intl.NumberFormat('fr-FR').format(Math.abs(delta))} passagers estimés`;
  const formattedPercent = percent === null ? '' : `${percent >= 0 ? '+' : '−'}${Math.abs(percent).toFixed(1).replace('.', ',')} % entre 2025 et 2026`;
  const mode = chart.dataset.chartView || chart.dataset.chartMode || 'compare';
  const headline = mode === '2025' ? `${value2025} passagers estimés` : mode === '2026' ? `${value2026} passagers estimés` : formattedDelta;
  const subline = mode === '2025' ? 'Saison 2025 · méthode identique' : mode === '2026' ? 'Saison 2026 · estimation à 90 % de remplissage' : formattedPercent;
  const detail = document.getElementById('portChartReading') || document.getElementById('portChartDetail') || chart.querySelector('[data-chart-detail]');
  animateDetail(detail, () => {
    detail.innerHTML = `<span>${port.toUpperCase()}</span><strong>${headline}</strong><small>${subline || `2025 : ${value2025} · 2026 : ${value2026}`}</small>`;
  }, options.animate !== false);
}

function setChartMode(button) {
  if (!button) return;
  const controls = button.closest('[role="tablist"], .chart-controls') || button.parentElement;
  const buttons = [...controls.querySelectorAll('[data-chart-mode]')];
  updateTabSelection(buttons, button);
  buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const chart = controls.closest('.port-chart') || controls.closest('.fluvial-results-layout')?.querySelector('.port-chart') || document.querySelector('.port-chart');
  if (chart) {
    chart.dataset.chartMode = button.dataset.chartMode;
    chart.dataset.chartView = button.dataset.chartMode;
  }
  const activeRow = chart?.querySelector('.port-row.is-active, [data-port-row].is-active') || chart?.querySelector('.port-row, [data-port-row]');
  if (activeRow) selectPortRow(activeRow);
}

function configureTabGroup(containerSelector, buttonSelector, controlsId, label) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const buttons = [...container.querySelectorAll(buttonSelector)];
  if (!buttons.length) return;
  container.setAttribute('role', 'tablist');
  if (label && !container.getAttribute('aria-label')) container.setAttribute('aria-label', label);
  let selected = buttons.find(button => button.classList.contains('is-active')) || buttons[0];
  buttons.forEach(button => {
    button.setAttribute('role', 'tab');
    if (controlsId) button.setAttribute('aria-controls', controlsId);
  });
  updateTabSelection(buttons, selected);
}

function setupInteractiveSemantics() {
  configureTabGroup('.actor-buttons', '.actor-button', 'actorDetail', 'Acteurs portuaires');
  configureTabGroup('.axis-list', '.axis-item', 'axisDetail', 'Axes de travail');
  configureTabGroup('.lever-track', '.lever', 'leverDetail', 'Leviers de transition');
  configureTabGroup('.route-case', '.route-stop', 'routeCaseDetail', 'Étapes de l’itinéraire');
  configureTabGroup('.coefficient-selector', '.coefficient-item', 'modelSegmentDetail', 'Segments du modèle');
  configureTabGroup('.workflow-steps', '.workflow-step', 'manifestStepDetail', 'Étapes du traitement');
  configureTabGroup('.mpc-final-stats', '[data-mpc-stat]', 'mpcStatDetail', 'Chiffres clés de MPC');
  configureTabGroup('.stat-orbit', '[data-mpc-stat]', 'mpcStatDetail', 'Chiffres clés de MPC');
  configureTabGroup('.history-plot', '[data-history-year]', 'historyChartReading', 'Jalons de fréquentation');

  const chartGroups = new Set([...document.querySelectorAll('[data-chart-mode]')].map(button => button.closest('.chart-controls') || button.parentElement));
  chartGroups.forEach(group => {
    if (!group) return;
    const buttons = [...group.querySelectorAll('[data-chart-mode]')];
    group.setAttribute('role', 'tablist');
    if (!group.getAttribute('aria-label')) group.setAttribute('aria-label', 'Mode de lecture du graphique');
    buttons.forEach(button => button.setAttribute('role', 'tab'));
    updateTabSelection(buttons, buttons.find(button => button.classList.contains('is-active')) || buttons[0]);
  });

  document.querySelectorAll('.port-chart').forEach(chart => {
    chart.setAttribute('role', 'listbox');
    const rows = [...chart.querySelectorAll('.port-row, [data-port-row]')];
    rows.forEach((row, index) => {
      row.setAttribute('role', 'option');
      row.tabIndex = index === 0 ? 0 : -1;
      row.setAttribute('aria-selected', String(index === 0));
      row.classList.toggle('is-active', index === 0);
    });
  });

  const summaryGroups = new Set([...document.querySelectorAll('[data-summary-row]')].map(row => row.closest('[data-summary-group]') || row.parentElement));
  summaryGroups.forEach(group => {
    if (!group) return;
    const rows = [...group.querySelectorAll('[data-summary-row]')];
    const selected = rows.find(row => row.classList.contains('is-active')) || rows[0];
    rows.forEach(row => {
      const active = row === selected;
      row.setAttribute('role', 'button');
      row.tabIndex = active ? 0 : -1;
      row.setAttribute('aria-pressed', String(active));
      row.classList.toggle('is-active', active);
    });
  });

  const proofRows = [...document.querySelectorAll('[data-proof-row]')];
  const selectedProof = proofRows.find(row => row.classList.contains('is-active')) || proofRows[0];
  proofRows.forEach(row => {
    const selected = row === selectedProof;
    row.tabIndex = selected ? 0 : -1;
    row.setAttribute('aria-pressed', String(selected));
    row.classList.toggle('is-active', selected);
  });

  document.getElementById('actorDetail')?.setAttribute('aria-live', 'polite');
  document.getElementById('axisDetail')?.setAttribute('aria-live', 'polite');
  document.getElementById('leverDetail')?.setAttribute('aria-live', 'polite');
  document.getElementById('routeCaseDetail')?.setAttribute('aria-live', 'polite');
  document.getElementById('modelSegmentDetail')?.setAttribute('aria-live', 'polite');
  document.getElementById('manifestStepDetail')?.setAttribute('aria-live', 'polite');
  document.getElementById('mpcStatDetail')?.setAttribute('aria-live', 'polite');
  document.getElementById('teamDetail')?.setAttribute('aria-live', 'polite');
  document.getElementById('proofTableDetail')?.setAttribute('aria-live', 'polite');
  document.getElementById('portChartDetail')?.setAttribute('aria-live', 'polite');
  document.getElementById('portChartReading')?.setAttribute('aria-live', 'polite');
  document.getElementById('demoStatus')?.setAttribute('aria-live', 'polite');

  document.querySelectorAll('[data-action="overview"], [data-action="resources"], [data-action="help"]').forEach(button => button.setAttribute('aria-haspopup', 'dialog'));
  document.querySelectorAll('[data-action="notes"]').forEach(button => button.setAttribute('aria-expanded', 'false'));
}

function handleTabKey(event, tab) {
  const group = tab.closest('[role="tablist"]');
  if (!group) return false;
  const tabs = [...group.querySelectorAll(':scope > [role="tab"], :scope [role="tab"]')].filter(item => !item.disabled);
  const current = tabs.indexOf(tab);
  if (current < 0) return false;
  let next = current;
  if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (current + 1) % tabs.length;
  else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (current - 1 + tabs.length) % tabs.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = tabs.length - 1;
  else return false;
  event.preventDefault();
  tabs[next].focus();
  tabs[next].click();
  return true;
}

function handleHistoryKey(event, point) {
  const chart = point.closest('[data-history-chart]');
  if (!chart) return false;
  const points = [...chart.querySelectorAll('[data-history-year]')];
  const current = points.indexOf(point);
  if (current < 0) return false;
  let next = current;
  if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (current + 1) % points.length;
  else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (current - 1 + points.length) % points.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = points.length - 1;
  else if (['Enter', ' '].includes(event.key)) {
    event.preventDefault();
    setHistoryYear(point);
    return true;
  } else return false;
  event.preventDefault();
  points[next].focus();
  setHistoryYear(points[next]);
  return true;
}

function handleOptionKey(event, option) {
  const list = option.closest('[role="listbox"]');
  if (!list) return false;
  const options = [...list.querySelectorAll('[role="option"]')];
  const current = options.indexOf(option);
  if (current < 0) return false;
  let next = current;
  if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = Math.min(options.length - 1, current + 1);
  else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = Math.max(0, current - 1);
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = options.length - 1;
  else if (['Enter', ' '].includes(event.key)) {
    event.preventDefault();
    option.click();
    return true;
  } else return false;
  event.preventDefault();
  options[next].focus();
  options[next].click();
  return true;
}

function handleSummaryKey(event, row) {
  const group = row.closest('[data-summary-group]') || row.parentElement;
  const rows = [...group.querySelectorAll('[data-summary-row]')];
  const current = rows.indexOf(row);
  if (current < 0) return false;
  if (['Enter', ' '].includes(event.key)) {
    event.preventDefault();
    row.click();
    return true;
  }
  let next = current;
  if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = Math.min(rows.length - 1, current + 1);
  else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = Math.max(0, current - 1);
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = rows.length - 1;
  else return false;
  event.preventDefault();
  rows[next].focus();
  rows[next].click();
  return true;
}

function handleProofKey(event, row) {
  const rows = [...document.querySelectorAll('[data-proof-row]')];
  const current = rows.indexOf(row);
  if (current < 0) return false;
  if (['Enter', ' '].includes(event.key)) {
    event.preventDefault();
    row.click();
    return true;
  }
  let next = current;
  if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = Math.min(rows.length - 1, current + 1);
  else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = Math.max(0, current - 1);
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = rows.length - 1;
  else return false;
  event.preventDefault();
  rows[next].focus();
  rows[next].click();
  return true;
}

function updateFullscreenState() {
  document.querySelectorAll('[data-action="fullscreen"]').forEach(button => {
    const active = Boolean(document.fullscreenElement);
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', active ? 'Quitter le plein écran' : 'Passer en plein écran');
  });
}

function selectSummaryRow(row) {
  if (!row) return;
  const group = row.closest('[data-summary-group]') || row.parentElement;
  const rows = [...group.querySelectorAll('[data-summary-row]')];
  rows.forEach(item => {
    const selected = item === row;
    item.classList.toggle('is-active', selected);
    item.setAttribute('aria-pressed', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  const detailId = row.dataset.summaryTarget || group.dataset.summaryTarget;
  const detail = detailId ? document.getElementById(detailId) : null;
  if (detail && row.dataset.summaryDetail) {
    animateDetail(detail, () => { detail.textContent = row.dataset.summaryDetail; });
  }
}

function handleAction(action, trigger) {
  if (action === 'next') goTo(currentIndex + 1);
  if (action === 'prev') goTo(currentIndex - 1);
  if (action === 'home') goToRoute('cover');
  if (action === 'start') {
    toggleTimer(true);
    goToRoute('mpc-interface');
  }
  if (action === 'notes') toggleNotes();
  if (action === 'overview') openModal(overviewModal, trigger);
  if (action === 'resources') openModal(resourcesModal, trigger);
  if (action === 'help') openModal(helpModal, trigger);
  if (action === 'fullscreen') toggleFullscreen();
  if (action === 'presenter') openPresenter();
}

document.addEventListener('click', event => {
  const actionButton = event.target.closest('[data-action]');
  if (actionButton) handleAction(actionButton.dataset.action, actionButton);

  const jumpButton = event.target.closest('[data-jump]');
  if (jumpButton) {
    const route = jumpRouteByLegacyIndex[jumpButton.dataset.jump];
    if (route) goToRoute(route);
    else goTo(jumpButton.dataset.jump);
  }

  const progressButton = event.target.closest('[data-progress-jump]');
  if (progressButton) goTo(progressButton.dataset.progressJump);

  const overviewButton = event.target.closest('[data-overview-jump]');
  if (overviewButton) {
    goTo(overviewButton.dataset.overviewJump);
    closeModal(overviewModal);
  }

  const actorButton = event.target.closest('[data-actor]');
  if (actorButton) setActor(actorButton.dataset.actor);

  const axisButton = event.target.closest('[data-axis]');
  if (axisButton) setAxis(axisButton.dataset.axis);

  const leverButton = event.target.closest('[data-lever]');
  if (leverButton) setLever(leverButton.dataset.lever);

  const routeButton = event.target.closest('[data-route-stop]');
  if (routeButton) setRouteStop(routeButton);

  const modelButton = event.target.closest('[data-model-segment]');
  if (modelButton) setModelSegment(modelButton);

  const manifestButton = event.target.closest('[data-manifest-step]');
  if (manifestButton) setManifestStep(manifestButton);

  const mpcStatButton = event.target.closest('[data-mpc-stat]');
  if (mpcStatButton) setMpcStat(mpcStatButton);

  const proofButton = event.target.closest('[data-proof-row]');
  if (proofButton) setProofRow(proofButton);

  const historyPoint = event.target.closest('[data-history-year]');
  if (historyPoint) setHistoryYear(historyPoint);

  const chartModeButton = event.target.closest('[data-chart-mode]');
  if (chartModeButton) setChartMode(chartModeButton);

  const portRow = event.target.closest('.port-row, [data-port-row]');
  if (portRow) selectPortRow(portRow);

  const summaryRow = event.target.closest('[data-summary-row]');
  if (summaryRow) selectSummaryRow(summaryRow);

  const zoomButton = event.target.closest('[data-zoom]');
  if (zoomButton && zoomedImage) {
    zoomedImage.src = zoomButton.dataset.zoom;
    const sourceImage = zoomButton.closest('figure, .visual-card')?.querySelector('img');
    zoomedImage.alt = zoomButton.dataset.zoomAlt || sourceImage?.alt || 'Aperçu agrandi';
    openModal(imageModal, zoomButton);
  }

  const closeButton = event.target.closest('[data-close-modal]');
  if (closeButton) closeModal(closeButton.closest('.modal'));

  const targetButton = event.target.closest('[data-target-minutes]');
  if (targetButton) setTarget(targetButton.dataset.targetMinutes);
});

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('pointerdown', event => {
    if (event.target === modal) closeModal(modal);
  });
});

timerButton?.addEventListener('click', () => toggleTimer());
document.getElementById('balanceRange')?.addEventListener('input', event => {
  const value = Number(event.target.value);
  const economySide = document.getElementById('economySide');
  const impactSide = document.getElementById('impactSide');
  const balanceMessage = document.getElementById('balanceMessage');
  if (economySide) economySide.style.flex = 100 - value;
  if (impactSide) impactSide.style.flex = value;
  if (balanceMessage) balanceMessage.textContent = 'Illustration pédagogique uniquement : ce curseur ne mesure ni les impacts ni l’acceptabilité.';
});

document.addEventListener('keydown', event => {
  const openModalElement = document.querySelector('.modal.is-open');
  if (event.key === 'Escape') {
    if (!closeTopLayer()) goToRoute('cover');
    return;
  }
  if (openModalElement) {
    if (event.key === 'Tab') trapModalFocus(event, openModalElement);
    return;
  }

  const active = document.activeElement;
  const activeHistoryPoint = active?.closest?.('[data-history-year]');
  if (activeHistoryPoint && handleHistoryKey(event, activeHistoryPoint)) return;
  const activeTab = active?.closest?.('[role="tab"]');
  if (activeTab && handleTabKey(event, activeTab)) return;
  const activeOption = active?.closest?.('[role="option"]');
  if (activeOption && handleOptionKey(event, activeOption)) return;
  const summaryRow = active?.closest?.('[data-summary-row]');
  if (summaryRow && handleSummaryKey(event, summaryRow)) return;
  const proofRow = active?.closest?.('[data-proof-row]');
  if (proofRow && handleProofKey(event, proofRow)) return;
  if (active?.closest?.(interactiveSelector)) return;
  if (event.repeat) return;

  if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault();
    goTo(currentIndex + 1, { focus: true });
  }
  if (['ArrowLeft', 'PageUp'].includes(event.key)) {
    event.preventDefault();
    goTo(currentIndex - 1, { focus: true });
  }
  if (event.key.toLowerCase() === 'f') toggleFullscreen();
  if (event.key.toLowerCase() === 'n') toggleNotes();
  if (event.key.toLowerCase() === 'o') openModal(overviewModal, document.querySelector('[data-action="overview"]'));
  if (event.key.toLowerCase() === 'r') openModal(resourcesModal, document.querySelector('[data-action="resources"]'));
  if (event.key.toLowerCase() === 'p') openPresenter();
  if (event.key.toLowerCase() === 'd') goToRoute('tools-operations', { focus: true });
  if (sectionRouteByKey[event.key]) goToRoute(sectionRouteByKey[event.key], { focus: true });
  if (event.key === '?') openModal(helpModal, document.querySelector('[data-action="help"]'));
});

slidesRoot?.addEventListener('touchstart', event => {
  const target = event.target instanceof Element ? event.target : null;
  if (event.touches.length !== 1 || target?.closest(`${interactiveSelector}, .demo-window, .notes-panel, .modal`)) {
    touchGesture = null;
    return;
  }
  const touch = event.changedTouches[0];
  touchGesture = { x: touch.clientX, y: touch.clientY, at: performance.now() };
}, { passive: true });

slidesRoot?.addEventListener('touchend', event => {
  if (!touchGesture || document.querySelector('.modal.is-open')) return;
  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchGesture.x;
  const deltaY = touch.clientY - touchGesture.y;
  const duration = performance.now() - touchGesture.at;
  if (duration <= 1200 && Math.abs(deltaX) > 72 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
    goTo(currentIndex + (deltaX < 0 ? 1 : -1));
  }
  touchGesture = null;
}, { passive: true });

slidesRoot?.addEventListener('touchcancel', () => { touchGesture = null; }, { passive: true });

window.addEventListener('message', event => {
  const expectedOrigin = portfolioMessageTargetOrigin === '*' ? event.origin === 'null' : event.origin === portfolioMessageTargetOrigin;
  if (event.source !== presenterWindow || !expectedOrigin) return;
  const message = event.data;
  if (!message || message.type !== 'portfolio-command') return;
  if (message.command === 'next') goTo(currentIndex + 1);
  if (message.command === 'prev') goTo(currentIndex - 1);
  if (message.command === 'timer') toggleTimer();
  if (message.command === 'ready') pushPresenterState();
});

window.addEventListener('hashchange', () => {
  goTo(indexFromHash());
});

buildProgress();
buildOverview();
setupInteractiveSemantics();
setActor('mpc', { animate: false });
setAxis(0, { animate: false });
setLever(0, { animate: false });
setRouteStop(document.querySelector('[data-route-stop]'), { animate: false });
setModelSegment(document.querySelector('[data-model-segment]'), { animate: false });
setManifestStep(document.querySelector('[data-manifest-step]'), { animate: false });
setMpcStat(document.querySelector('[data-mpc-stat].is-active') || document.querySelector('[data-mpc-stat]'), { animate: false });
setProofRow(document.querySelector('[data-proof-row].is-active') || document.querySelector('[data-proof-row]'), { animate: false });
setHistoryYear(document.querySelector('[data-history-year].is-active') || document.querySelector('[data-history-year]'), { animate: false });
const initialPort = document.querySelector('.port-row, [data-port-row]');
if (initialPort) selectPortRow(initialPort, { animate: false });
const initialChartMode = document.querySelector('[data-chart-mode].is-active') || document.querySelector('[data-chart-mode]');
if (initialChartMode) setChartMode(initialChartMode);
const balanceMessage = document.getElementById('balanceMessage');
if (balanceMessage) balanceMessage.textContent = 'Illustration pédagogique uniquement : ce curseur ne mesure ni les impacts ni l’acceptabilité.';
document.querySelectorAll('[data-target-minutes]').forEach(button => {
  button.setAttribute('aria-pressed', String(Number(button.dataset.targetMinutes) * 60 === timerState.target));
});
document.addEventListener('fullscreenchange', updateFullscreenState);
updateFullscreenState();
reducedMotion.addEventListener('change', event => {
  if (event.matches) cancelSlideMotion();
});
const missingNoteIds = slides.map(slide => slide.dataset.slideId).filter(slideId => !notesBySlideId[slideId]);
if (missingNoteIds.length) console.warn(`Notes orales manquantes : ${missingNoteIds.join(', ')}`);
const initialIndex = Math.max(0, Math.min(slides.length - 1, indexFromHash()));
goTo(initialIndex, { force: true, instant: true });
window.setInterval(updateTimer, 500);
