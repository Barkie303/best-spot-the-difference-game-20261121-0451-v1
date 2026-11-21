// Drawing the two panels and everything on top of them: the scenes, the
// green rings on found differences, the red X of a miss, the pulsing gold
// ring of a hint, and the celebration banner when a round is finished.

import { FOUND_RING_R, HINT_PULSE_MS } from './config.js';

function drawFoundMarker(ctx, diff) {
  ctx.strokeStyle = '#3d9b57';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, FOUND_RING_R, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, FOUND_RING_R - 4, 0, Math.PI * 2);
  ctx.stroke();
  // Check mark inside the ring.
  ctx.strokeStyle = '#3d9b57';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(diff.x - 11, diff.y + 1);
  ctx.lineTo(diff.x - 3, diff.y + 9);
  ctx.lineTo(diff.x + 12, diff.y - 9);
  ctx.stroke();
  ctx.lineCap = 'butt';
}

function drawWrongMark(ctx, mark, now) {
  const age = now - mark.at;
  if (age > 650) return;
  const alpha = 1 - age / 650;
  const half = 13;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#d64545';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(mark.x - half, mark.y - half);
  ctx.lineTo(mark.x + half, mark.y + half);
  ctx.moveTo(mark.x + half, mark.y - half);
  ctx.lineTo(mark.x - half, mark.y + half);
  ctx.stroke();
  ctx.restore();
}

function drawHintPulse(ctx, diff, now) {
  const elapsed = now - diff.at;
  if (elapsed > HINT_PULSE_MS) return;
  const phase = (elapsed % 550) / 550;
  const r = FOUND_RING_R + phase * 14;
  ctx.save();
  ctx.globalAlpha = 1 - phase * 0.7;
  ctx.strokeStyle = '#f2b705';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawBanner(ctx, w, label) {
  ctx.fillStyle = 'rgba(43, 33, 24, 0.82)';
  ctx.fillRect(0, 8, w, 44);
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 24px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, w / 2, 31);
}

export function renderFrame(leftCtx, rightCtx, scene, state, now) {
  const w = leftCtx.canvas.width;
  scene.draw(leftCtx, false);
  scene.draw(rightCtx, true);

  for (const ctx of [leftCtx, rightCtx]) {
    for (const index of state.found) {
      drawFoundMarker(ctx, scene.diffs[index]);
    }
    for (const mark of state.wrongMarks) {
      drawWrongMark(ctx, mark, now);
    }
    if (state.hinted) drawHintPulse(ctx, state.hinted, now);
    if (state.banner) drawBanner(ctx, w, state.banner);
  }
}
