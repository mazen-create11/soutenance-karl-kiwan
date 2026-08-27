const mainClock = document.getElementById('mainClock');
const targetClock = document.getElementById('targetClock');
const sectionClock = document.getElementById('sectionClock');
const currentSection = document.getElementById('currentSection');
const currentCount = document.getElementById('currentCount');
const currentDuration = document.getElementById('currentDuration');
const currentTitle = document.getElementById('currentTitle');
const currentNotes = document.getElementById('currentNotes');
const currentCue = document.getElementById('currentCue');
const nextTitle = document.getElementById('nextTitle');
const connection = document.getElementById('connection');
const clockPanel = document.querySelector('.clock-panel');
const timerControl = document.getElementById('timerControl');
const portfolioMessageTargetOrigin = /^https?:$/.test(window.location.protocol) ? window.location.origin : '*';

function formatTime(seconds) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60).toString().padStart(2, '0')}:${(safe % 60).toString().padStart(2, '0')}`;
}

function send(command) {
  if (window.opener && !window.opener.closed) window.opener.postMessage({ type: 'portfolio-command', command }, portfolioMessageTargetOrigin);
}

function render(state) {
  connection.classList.add('is-live');
  connection.replaceChildren(document.createElement('i'), document.createTextNode(' Synchronisé avec la présentation'));
  mainClock.textContent = formatTime(state.elapsed);
  targetClock.textContent = `OBJECTIF ${formatTime(state.target)} · REPÈRES 14:50`;
  sectionClock.textContent = formatTime(state.sectionElapsed);
  currentSection.textContent = state.section.toUpperCase();
  currentCount.textContent = `${String(state.index + 1).padStart(2, '0')} / ${String(state.count).padStart(2, '0')}`;
  currentDuration.textContent = `${state.duration} recommandé`;
  currentTitle.textContent = state.title;
  const notesList = document.createElement('ul');
  const bullets = Array.isArray(state.notes?.bullets) ? state.notes.bullets : [];
  bullets.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = String(item);
    notesList.appendChild(listItem);
  });
  currentNotes.replaceChildren(notesList);
  const cueLabel = document.createElement('strong');
  cueLabel.textContent = 'Repère :';
  currentCue.replaceChildren(cueLabel, document.createTextNode(` ${String(state.notes?.cue || '')}`));
  nextTitle.textContent = state.nextTitle;
  timerControl.textContent = state.running ? 'Pause' : 'Reprendre';
  clockPanel.classList.toggle('is-warning', state.elapsed >= state.target - 120 && state.elapsed < state.target);
  clockPanel.classList.toggle('is-over', state.elapsed >= state.target);
}

window.addEventListener('message', event => {
  const expectedOrigin = portfolioMessageTargetOrigin === '*' ? event.origin === 'null' : event.origin === portfolioMessageTargetOrigin;
  if (event.source !== window.opener || !expectedOrigin) return;
  if (event.data?.type === 'portfolio-state' && event.data.state && typeof event.data.state === 'object') render(event.data.state);
});

document.addEventListener('click', event => {
  const button = event.target.closest('[data-command]');
  if (button) send(button.dataset.command);
});

document.addEventListener('keydown', event => {
  if (event.target.closest('button, a, input, select, textarea') && [' ', 'Enter'].includes(event.key)) return;
  if (['ArrowRight', ' '].includes(event.key)) { event.preventDefault(); send('next'); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); send('prev'); }
  if (event.key.toLowerCase() === 'p') window.close();
});

send('ready');
