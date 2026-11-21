// All sounds are synthesized with WebAudio — no audio files, no network.
// The context is created on the first user gesture, as browsers require.

let ctx = null;

function ensureContext() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, startAt, duration, type = 'sine', volume = 0.18) {
  const ac = ensureContext();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ac.currentTime + startAt);
  gain.gain.linearRampToValueAtTime(volume, ac.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + startAt + duration);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + startAt);
  osc.stop(ac.currentTime + startAt + duration + 0.05);
}

export function unlockAudio() {
  ensureContext();
}

export function playFound() {
  tone(659.25, 0, 0.16); // E5
  tone(880, 0.09, 0.24); // A5
}

export function playWrong() {
  tone(140, 0, 0.18, 'sawtooth', 0.1);
  tone(110, 0.05, 0.2, 'sawtooth', 0.08);
}

export function playHint() {
  tone(1174.66, 0, 0.14); // D6
  tone(1567.98, 0.07, 0.2); // G6
}

export function playRoundWin() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.11, 0.22));
}

export function playGameWin() {
  [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98].forEach((f, i) =>
    tone(f, i * 0.1, 0.26),
  );
}

export function playTick() {
  tone(980, 0, 0.06, 'square', 0.05);
}
