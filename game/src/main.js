// Game state and flow: rounds, the countdown, scoring, hints, the title and
// end screens, and the ?shot= states that stage a screenshot. One file, one
// job: it owns the state machine and wires the other modules together.

import {
  ROUNDS,
  POINTS_PER_FIND,
  WRONG_CLICK_TIME_PENALTY,
  HINTS_PER_ROUND,
  HINT_PULSE_MS,
  WRONG_MARK_MS,
} from './config.js';
import { SCENES } from './scenes.js';
import {
  unlockAudio,
  playFound,
  playWrong,
  playHint,
  playRoundWin,
  playGameWin,
  playTick,
} from './audio.js';
import { attachCanvasClicks, attachKeys } from './input.js';
import { renderFrame } from './render.js';

const leftCanvas = document.getElementById('leftCanvas');
const rightCanvas = document.getElementById('rightCanvas');
const leftCtx = leftCanvas.getContext('2d');
const rightCtx = rightCanvas.getContext('2d');
const timerText = document.getElementById('timerText');
const timerBar = document.getElementById('timerBar');
const roundPill = document.getElementById('roundPill');
const foundPill = document.getElementById('foundPill');
const scorePill = document.getElementById('scorePill');
const messageEl = document.getElementById('message');
const hintBtn = document.getElementById('hintBtn');
const restartBtn = document.getElementById('restartBtn');
const overlay = document.getElementById('overlay');
const overlayCard = document.getElementById('overlayCard');

const state = {
  roundIndex: 0,
  found: new Set(),
  score: 0,
  timeLeft: ROUNDS[0].time,
  hintsLeft: HINTS_PER_ROUND,
  phase: 'title', // title | playing | roundDone | timeUp | gameDone
  wrongMarks: [],
  hinted: null,
  banner: null,
  frozen: false, // screenshot staging: timer paused, no overlays
  lastTickSecond: -1,
};

function scene() {
  return SCENES[state.roundIndex];
}

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function updateHud() {
  const round = ROUNDS[state.roundIndex];
  timerText.textContent = formatTime(state.timeLeft);
  const frac = Math.max(0, state.timeLeft / round.time);
  timerBar.style.width = `${frac * 100}%`;
  timerBar.classList.toggle('low', state.timeLeft <= 15);
  roundPill.textContent = `Round ${state.roundIndex + 1} · ${scene().name}`;
  foundPill.textContent = `Found ${state.found.size} / ${scene().diffs.length}`;
  scorePill.textContent = `Score ${state.score}`;
  hintBtn.textContent = `💡 Hint (${state.hintsLeft})`;
  hintBtn.disabled = state.hintsLeft <= 0 || state.phase !== 'playing';
}

function showCard(title, lines, buttonLabel, onButton) {
  overlayCard.innerHTML = '';
  const h = document.createElement('h2');
  h.textContent = title;
  overlayCard.appendChild(h);
  for (const line of lines) {
    const p = document.createElement('p');
    p.textContent = line;
    overlayCard.appendChild(p);
  }
  if (buttonLabel) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = buttonLabel;
    b.addEventListener('click', () => {
      unlockAudio();
      hideOverlay();
      onButton();
    });
    overlayCard.appendChild(b);
  }
  overlay.classList.add('show');
}

function hideOverlay() {
  overlay.classList.remove('show');
}

function startRound(index) {
  state.roundIndex = index;
  state.found = new Set();
  state.timeLeft = ROUNDS[index].time;
  state.hintsLeft = HINTS_PER_ROUND;
  state.wrongMarks = [];
  state.hinted = null;
  state.banner = null;
  state.lastTickSecond = -1;
  state.phase = 'playing';
  messageEl.textContent = `Round ${index + 1}: ${scene().name} — find ${scene().diffs.length} differences!`;
  updateHud();
}

function startGame() {
  state.score = 0;
  startRound(0);
}

function onPick(x, y) {
  if (state.phase !== 'playing') return;
  unlockAudio();
  const now = performance.now();
  const diffs = scene().diffs;
  for (let i = 0; i < diffs.length; i++) {
    if (state.found.has(i)) continue;
    const d = diffs[i];
    const dx = x - d.x;
    const dy = y - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) {
      state.found.add(i);
      state.score += POINTS_PER_FIND;
      playFound();
      messageEl.textContent = `Nice! “${d.name}” — ${state.found.size} of ${diffs.length} found.`;
      if (state.found.size === diffs.length) roundComplete();
      updateHud();
      return;
    }
  }
  // A miss: a red X and five seconds off the clock.
  state.wrongMarks.push({ x, y, at: now });
  state.timeLeft = Math.max(0, state.timeLeft - WRONG_CLICK_TIME_PENALTY);
  playWrong();
  messageEl.textContent = `Not quite — that costs ${WRONG_CLICK_TIME_PENALTY} seconds!`;
  updateHud();
}

function roundComplete() {
  const bonus = Math.round(state.timeLeft) * 5;
  state.score += bonus;
  state.phase = 'roundDone';
  state.banner = `ROUND COMPLETE!  +${bonus} TIME BONUS`;
  if (state.roundIndex === SCENES.length - 1) {
    playGameWin();
    state.phase = 'gameDone';
    state.banner = '🏆 YOU FOUND THEM ALL!';
    messageEl.textContent = `All three worlds cleared — final score ${state.score}!`;
    if (!state.frozen) {
      showCard(
        '🏆 You found them all!',
        [
          `Final score: ${state.score}`,
          'Three worlds, 26 differences, one sharp eye.',
          'Thanks for playing Spot the Difference!',
        ],
        '↺ Play again',
        startGame,
      );
    }
  } else {
    playRoundWin();
    messageEl.textContent = `Round ${state.roundIndex + 1} complete! Time bonus +${bonus}.`;
    if (!state.frozen) {
      showCard(
        `Round ${state.roundIndex + 1} complete!`,
        [
          `You found all ${scene().diffs.length} differences in ${scene().name}.`,
          `Time bonus +${bonus} — score ${state.score}.`,
          `Next up: ${SCENES[state.roundIndex + 1].name}, with ${SCENES[state.roundIndex + 1].diffs.length} differences and less time.`,
        ],
        'Next round →',
        () => startRound(state.roundIndex + 1),
      );
    }
  }
  updateHud();
}

function timeUp() {
  state.phase = 'timeUp';
  state.timeLeft = 0;
  messageEl.textContent = `Time's up — you found ${state.found.size} of ${scene().diffs.length}.`;
  if (!state.frozen) {
    showCard(
      "⏰ Time's up!",
      [
        `You found ${state.found.size} of ${scene().diffs.length} differences in ${scene().name}.`,
        'The unfound ones are still hiding in the right picture.',
      ],
      '↺ Try this round again',
      () => startRound(state.roundIndex),
    );
  }
  updateHud();
}

function useHint() {
  if (state.phase !== 'playing' || state.hintsLeft <= 0) return;
  unlockAudio();
  const remaining = scene().diffs.filter((_, i) => !state.found.has(i));
  if (remaining.length === 0) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hinted = { ...pick, at: performance.now() };
  state.hintsLeft -= 1;
  playHint();
  messageEl.textContent = 'Hint: something sparkles over there…';
  setTimeout(() => {
    state.hinted = null;
  }, HINT_PULSE_MS + 50);
  updateHud();
}

// Screenshot staging: ?shot=cover | market | win renders a frozen mid-play
// state so the screenshots show a real game in progress.
function applyShotParam() {
  const shot = new URLSearchParams(window.location.search).get('shot');
  if (!shot) return;
  state.frozen = true;
  if (shot === 'cover') {
    startRound(0);
    state.found = new Set([0, 2, 5]);
    state.timeLeft = 107;
    messageEl.textContent = 'Found 3 / 8 — keep hunting!';
  } else if (shot === 'market') {
    startRound(1);
    state.found = new Set([1, 4]);
    state.timeLeft = 88;
    messageEl.textContent = 'Found 2 / 8 — the market hides more!';
  } else if (shot === 'win') {
    startRound(2);
    state.found = new Set(SCENES[2].diffs.map((_, i) => i));
    state.timeLeft = 41;
    state.banner = '🎉 ALL 10 DIFFERENCES FOUND!';
    state.phase = 'roundDone';
    messageEl.textContent = 'Round 3 complete — 10 / 10 found!';
  }
  updateHud();
}

attachCanvasClicks(leftCanvas, rightCanvas, (x, y) => onPick(x, y));
attachKeys({
  hint: useHint,
  restart: () => {
    if (state.phase === 'playing' || state.phase === 'timeUp') startRound(state.roundIndex);
  },
  next: () => {
    if (state.phase === 'roundDone' && state.roundIndex < SCENES.length - 1) {
      startRound(state.roundIndex + 1);
    }
  },
});
hintBtn.addEventListener('click', useHint);
restartBtn.addEventListener('click', () => {
  if (state.phase !== 'title') startRound(state.roundIndex);
});

// Title screen over the first scene; the game starts on the button.
startRound(0);
state.phase = 'title';
state.timeLeft = ROUNDS[0].time;
applyShotParam();
if (!state.frozen) {
  showCard(
    '🔍 Spot the Difference',
    [
      'Three little worlds. Two pictures each. A handful of tiny changes hiding in the right one.',
      'Click a difference on either picture to mark it. Wrong clicks cost 5 seconds.',
      'Round 1: Cat Café (8 differences, 2:00) · Round 2: Night Market (8, 1:40) · Round 3: Space Garden (10, 1:30).',
      'Hints: 3 per round (H). Restart a round any time (R).',
    ],
    '▶ Start hunting',
    () => {
      state.phase = 'playing';
      messageEl.textContent = 'Find the differences — click them on either picture!';
    },
  );
}
updateHud();

let lastNow = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - lastNow) / 1000);
  lastNow = now;
  if (state.phase === 'playing' && !state.frozen) {
    state.timeLeft -= dt;
    const whole = Math.ceil(state.timeLeft);
    if (state.timeLeft <= 10 && whole !== state.lastTickSecond) {
      state.lastTickSecond = whole;
      playTick();
    }
    if (state.timeLeft <= 0) timeUp();
    state.wrongMarks = state.wrongMarks.filter((m) => now - m.at < WRONG_MARK_MS);
    updateHud();
  }
  renderFrame(leftCtx, rightCtx, scene(), state, now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
