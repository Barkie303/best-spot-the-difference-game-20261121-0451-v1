// The three little worlds: every scene is drawn by code, twice — once as the
// original (variant = false) and once with its differences applied
// (variant = true). Each scene lists its differences with hit-zone circles in
// scene coordinates (580 x 436). Decorative scatter uses a seeded random so
// both panels match exactly except for the designed differences.

import { makeSeededRandom } from './random.js';

function disc(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function oval(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function box(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function poly(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function star5(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 === 0 ? r : r * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function text(ctx, str, x, y, size, fill, align = 'center') {
  ctx.fillStyle = fill;
  ctx.font = `bold ${size}px "Trebuchet MS", sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

// ---------------------------------------------------------------------------
// Round 1 — Cat Café: a warm little café interior, one sleepy cat.
// ---------------------------------------------------------------------------
function drawCafe(ctx, variant) {
  // Wall and floor.
  box(ctx, 0, 0, 580, 300, '#f7e3c0');
  box(ctx, 0, 300, 580, 136, '#c98f5f');
  ctx.fillStyle = '#b57e4e';
  for (let y = 322; y < 436; y += 28) ctx.fillRect(0, y, 580, 3);

  // Window with curtains (left).
  box(ctx, 36, 36, 148, 168, '#ffffff');
  box(ctx, 44, 44, 132, 152, '#aee3f5');
  if (!variant) {
    disc(ctx, 110, 96, 26, '#ffd94d'); // sun
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      line(ctx, 110, 96, 110 + Math.cos(a) * 36, 96 + Math.sin(a) * 36, '#ffd94d', 4);
    }
  } else {
    oval(ctx, 96, 100, 26, 14, '#ffffff'); // cloud
    oval(ctx, 122, 92, 20, 12, '#ffffff');
    oval(ctx, 118, 106, 24, 12, '#ffffff');
  }
  box(ctx, 36, 36, 148, 12, '#e07840'); // curtain rod
  poly(ctx, [[36, 48], [62, 48], [52, 204], [36, 204]], '#e07840'); // left curtain
  poly(ctx, [[184, 48], [158, 48], [168, 204], [184, 204]], '#e07840'); // right curtain

  // Framed picture (cat portrait vs fish portrait).
  box(ctx, 206, 48, 88, 76, '#8b5a2b');
  box(ctx, 212, 54, 76, 64, '#fdf6e9');
  if (!variant) {
    disc(ctx, 250, 92, 18, '#f2a541'); // cat head
    poly(ctx, [[236, 78], [242, 62], [248, 78]], '#f2a541'); // ears
    poly(ctx, [[252, 78], [258, 62], [264, 78]], '#f2a541');
    disc(ctx, 243, 90, 3, '#2b2118');
    disc(ctx, 257, 90, 3, '#2b2118');
  } else {
    oval(ctx, 250, 88, 22, 12, '#5aa9e6'); // fish body
    poly(ctx, [[270, 88], [284, 78], [284, 98]], '#5aa9e6'); // tail
    disc(ctx, 238, 86, 3, '#2b2118');
  }

  // Wall clock (3:00 vs 4:30).
  disc(ctx, 360, 86, 32, '#ffffff');
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(360, 86, 32, 0, Math.PI * 2);
  ctx.stroke();
  if (!variant) {
    line(ctx, 360, 86, 360, 62, '#2b2118', 4); // 12
    line(ctx, 360, 86, 382, 86, '#2b2118', 4); // 3
  } else {
    line(ctx, 360, 86, 360, 62, '#2b2118', 4); // 12
    line(ctx, 360, 86, 360, 106, '#2b2118', 4); // 6
    line(ctx, 360, 86, 378, 98, '#2b2118', 3); // 4:30-ish
  }
  disc(ctx, 360, 86, 4, '#d64545');

  // Shelf with jars (right wall).
  box(ctx, 420, 130, 140, 10, '#8b5a2b');
  box(ctx, 430, 96, 26, 34, '#e8a0a0');
  box(ctx, 462, 88, 26, 42, '#a0c8e8');
  box(ctx, 494, 100, 26, 30, '#b5e0a0');
  disc(ctx, 443, 92, 6, '#d64545');
  disc(ctx, 475, 84, 6, '#3d6fb5');
  disc(ctx, 507, 96, 6, '#3d9b57');

  // Hanging lamp.
  line(ctx, 520, 0, 520, 46, '#2b2118', 3);
  poly(ctx, [[500, 46], [540, 46], [530, 70], [510, 70]], '#f2b705');
  disc(ctx, 520, 76, 10, '#ffe98a');

  // Rug with stripes (one stripe missing in the variant).
  oval(ctx, 290, 402, 150, 26, '#d64545');
  oval(ctx, 290, 402, 128, 20, '#fdf6e9');
  oval(ctx, 290, 402, 104, 14, '#e07840');
  if (!variant) {
    oval(ctx, 290, 402, 78, 9, '#3d9b57');
  }

  // Table with teapot and cups.
  box(ctx, 180, 316, 220, 12, '#8b5a2b');
  box(ctx, 196, 328, 10, 60, '#6b4423');
  box(ctx, 374, 328, 10, 60, '#6b4423');
  // Teapot.
  oval(ctx, 250, 296, 26, 20, '#5aa9e6');
  disc(ctx, 250, 272, 8, '#3d6fb5');
  poly(ctx, [[224, 292], [206, 282], [210, 300]], '#5aa9e6'); // spout
  poly(ctx, [[276, 288], [292, 282], [290, 300]], '#5aa9e6'); // handle
  // Cup one (always there).
  box(ctx, 296, 292, 26, 22, '#fdf6e9');
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 2;
  ctx.strokeRect(296, 292, 26, 22);
  // Cup two (missing in the variant).
  if (!variant) {
    box(ctx, 340, 292, 26, 22, '#f2b705');
    ctx.strokeRect(340, 292, 26, 22);
    disc(ctx, 353, 296, 8, '#8b5a2b');
  }

  // Sleepy cat on a cushion (tail up vs tail flat).
  oval(ctx, 452, 372, 62, 20, '#e07840'); // cushion
  oval(ctx, 452, 356, 44, 24, '#f2a541'); // cat body
  disc(ctx, 420, 344, 17, '#f2a541'); // head
  poly(ctx, [[406, 332], [412, 316], [418, 330]], '#f2a541');
  poly(ctx, [[424, 330], [430, 314], [436, 330]], '#f2a541');
  line(ctx, 412, 344, 418, 344, '#2b2118', 2); // closed eye
  line(ctx, 426, 344, 432, 344, '#2b2118', 2);
  if (!variant) {
    ctx.strokeStyle = '#f2a541';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(496, 348, 16, -Math.PI / 2, Math.PI / 2);
    ctx.stroke(); // tail curled up
  } else {
    line(ctx, 492, 362, 522, 366, '#f2a541', 7); // tail flat
  }

  // Potted plant (red pot vs blue pot).
  box(ctx, 44, 336, 34, 28, variant ? '#3d6fb5' : '#d64545');
  line(ctx, 61, 336, 61, 300, '#3d9b57', 4);
  oval(ctx, 48, 296, 12, 18, '#3d9b57');
  oval(ctx, 61, 288, 12, 20, '#4cb464');
  oval(ctx, 74, 296, 12, 18, '#3d9b57');

  // Stack of books on the floor (4 vs 3).
  box(ctx, 96, 392, 56, 10, '#d64545');
  box(ctx, 100, 382, 48, 10, '#3d6fb5');
  box(ctx, 104, 372, 40, 10, '#f2b705');
  if (!variant) box(ctx, 108, 362, 32, 10, '#3d9b57');
}

const CAFE_DIFFS = [
  { x: 353, y: 303, r: 24, name: 'second teacup' },
  { x: 360, y: 86, r: 34, name: 'clock hands' },
  { x: 250, y: 86, r: 30, name: 'framed picture' },
  { x: 61, y: 350, r: 26, name: 'plant pot colour' },
  { x: 500, y: 352, r: 30, name: 'cat tail' },
  { x: 110, y: 100, r: 32, name: 'window sky' },
  { x: 290, y: 402, r: 26, name: 'rug stripe' },
  { x: 124, y: 382, r: 26, name: 'book stack' },
];

// ---------------------------------------------------------------------------
// Round 2 — Night Market: lantern-lit stalls under a starry sky.
// ---------------------------------------------------------------------------
function drawMarket(ctx, variant) {
  // Sky and street.
  const sky = ctx.createLinearGradient(0, 0, 0, 280);
  sky.addColorStop(0, '#1e2a52');
  sky.addColorStop(1, '#3a4a7a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 580, 280);
  box(ctx, 0, 280, 580, 156, '#4a3f35');
  box(ctx, 0, 280, 580, 6, '#5d4f42');

  // Stars (seeded so both panels agree).
  const rnd = makeSeededRandom(20261121);
  for (let i = 0; i < 26; i++) {
    const sx = 20 + rnd() * 540;
    const sy = 12 + rnd() * 200;
    const sr = 1.5 + rnd() * 2;
    disc(ctx, sx, sy, sr, '#ffe98a');
  }
  // Moon (full vs crescent).
  disc(ctx, 480, 62, 26, '#fdf6e9');
  if (variant) disc(ctx, 490, 56, 22, '#3a4a7a');

  // Lantern string across the sky.
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, 30);
  ctx.quadraticCurveTo(290, 90, 560, 26);
  ctx.stroke();
  const lanternXs = [80, 180, 290, 400, 500];
  lanternXs.forEach((lx, i) => {
    const t = i / (lanternXs.length - 1);
    const ly = 30 + (90 - 30) * 2 * t * (1 - t) + 26 * (1 - Math.abs(2 * t - 1)) * 0.4;
    if (variant && i === 2) return; // missing lantern
    oval(ctx, lx, ly + 14, 13, 17, i % 2 ? '#f2b705' : '#d64545');
    line(ctx, lx, ly, lx, ly + 4, '#2b2118', 2);
    disc(ctx, lx, ly + 14, 4, '#ffe98a');
  });

  // Left stall: striped awning, counter, fruit crate, vendor.
  poly(ctx, [[40, 150], [250, 150], [238, 118], [52, 118]], '#fdf6e9');
  for (let i = 0; i < 5; i++) {
    const sx = 52 + i * 40;
    poly(ctx, [[sx, 150], [sx + 20, 150], [sx + 18, 118], [sx + 2, 118]], i % 2 ? (variant ? '#3d9b57' : '#d64545') : '#fdf6e9');
  }
  box(ctx, 52, 150, 186, 8, '#8b5a2b');
  box(ctx, 56, 158, 178, 8, '#6b4423');
  box(ctx, 56, 250, 178, 90, '#7a5a3a'); // counter
  box(ctx, 56, 250, 178, 10, '#8b5a2b');
  // Vendor behind the counter.
  disc(ctx, 150, 218, 20, '#f2c89b'); // head
  poly(ctx, [[118, 212], [182, 212], [150, 178]], '#f2b705'); // hat
  disc(ctx, 142, 218, 3, '#2b2118');
  disc(ctx, 158, 218, 3, '#2b2118');
  // Fruit crate (5 apples vs 4).
  box(ctx, 76, 226, 70, 22, '#a06838');
  const appleXs = [88, 104, 120, 136, 152];
  appleXs.forEach((ax, i) => {
    if (variant && i === 4) return; // one apple missing
    disc(ctx, ax, 222, 8, '#d64545');
    line(ctx, ax, 214, ax + 3, 209, '#3d9b57', 2);
  });

  // Right stall: awning, sign, tea jars.
  poly(ctx, [[330, 150], [545, 150], [532, 118], [343, 118]], '#fdf6e9');
  for (let i = 0; i < 5; i++) {
    const sx = 343 + i * 40;
    poly(ctx, [[sx, 150], [sx + 20, 150], [sx + 18, 118], [sx + 2, 118]], i % 2 ? '#3d6fb5' : '#fdf6e9');
  }
  box(ctx, 342, 150, 190, 8, '#8b5a2b');
  box(ctx, 342, 158, 190, 8, '#6b4423');
  box(ctx, 346, 250, 182, 90, '#5a6b8a'); // counter
  box(ctx, 346, 250, 182, 10, '#3a4a7a');
  // Sign board with a little lantern icon (icon missing in the variant).
  box(ctx, 400, 176, 92, 46, '#2b2118');
  box(ctx, 404, 180, 84, 38, '#fdf6e9');
  text(ctx, 'TEA', 446, 199, 20, '#2b2118');
  if (!variant) {
    oval(ctx, 474, 199, 7, 9, '#d64545');
    disc(ctx, 474, 199, 2, '#ffe98a');
  }
  // Tea jars on the counter.
  box(ctx, 360, 224, 24, 26, '#e8a0a0');
  box(ctx, 392, 220, 24, 30, '#a0c8e8');
  // Cat on the roof (missing in the variant) — orange so it reads against
  // the dark night sky.
  if (!variant) {
    oval(ctx, 440, 108, 26, 12, '#f2a541');
    disc(ctx, 420, 102, 10, '#f2a541');
    poly(ctx, [[412, 96], [416, 86], [420, 94]], '#f2a541');
    poly(ctx, [[424, 94], [428, 84], [432, 94]], '#f2a541');
    line(ctx, 464, 106, 478, 96, '#f2a541', 4); // tail
  }

  // Balloons (red vs blue on the front balloon).
  line(ctx, 520, 240, 520, 330, '#fdf6e9', 2);
  oval(ctx, 505, 216, 14, 18, '#3d6fb5');
  oval(ctx, 536, 220, 14, 18, '#3d9b57');
  oval(ctx, 520, 196, 16, 20, variant ? '#3d6fb5' : '#d64545');

  // Puddle with a reflected star (reflection missing in the variant).
  oval(ctx, 300, 386, 74, 14, '#2e4a6b');
  if (!variant) star5(ctx, 300, 384, 7, '#ffe98a');
  oval(ctx, 300, 386, 74, 14, 'rgba(174, 227, 245, 0.25)');
}

const MARKET_DIFFS = [
  { x: 290, y: 82, r: 22, name: 'middle lantern' },
  { x: 152, y: 134, r: 24, name: 'awning stripe colour' },
  { x: 120, y: 222, r: 24, name: 'apple count' },
  { x: 480, y: 62, r: 30, name: 'moon shape' },
  { x: 440, y: 104, r: 24, name: 'cat on the roof' },
  { x: 520, y: 196, r: 24, name: 'balloon colour' },
  { x: 474, y: 199, r: 20, name: 'sign lantern icon' },
  { x: 300, y: 386, r: 26, name: 'puddle star' },
];

// ---------------------------------------------------------------------------
// Round 3 — Space Garden: an alien greenhouse under a ringed planet.
// ---------------------------------------------------------------------------
function drawGarden(ctx, variant) {
  // Deep-space backdrop and alien soil.
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#2a1b4a');
  sky.addColorStop(1, '#1b3a4a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 580, 300);
  box(ctx, 0, 300, 580, 136, '#3a2a55');
  oval(ctx, 290, 420, 260, 22, '#2e2145');

  // Dome window with stars, a ringed planet and a small moon.
  ctx.strokeStyle = '#7fd4c0';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(290, 300, 210, Math.PI, 0);
  ctx.stroke();
  ctx.fillStyle = '#241a3e';
  ctx.beginPath();
  ctx.arc(290, 300, 206, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  const rnd = makeSeededRandom(777);
  for (let i = 0; i < 30; i++) {
    const a = Math.PI + rnd() * Math.PI;
    const rr = 40 + rnd() * 160;
    const sx = 290 + Math.cos(a) * rr;
    const sy = 300 + Math.sin(a) * rr * 0.9;
    if (sy < 300) disc(ctx, sx, sy, 1.5 + rnd() * 2, '#ffe98a');
  }
  // Ringed planet (ring missing in the variant).
  disc(ctx, 420, 82, 26, '#e07840');
  disc(ctx, 412, 74, 8, '#c95f2e');
  if (!variant) {
    ctx.strokeStyle = '#f2b705';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(420, 82, 42, 10, -0.3, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Small cratered moon (crater missing in the variant).
  disc(ctx, 92, 66, 22, '#cfd8e6');
  if (!variant) disc(ctx, 86, 60, 6, '#9aa7bd');
  disc(ctx, 100, 74, 4, '#9aa7bd');

  // Floating rocks (one missing in the variant).
  poly(ctx, [[70, 130], [96, 118], [112, 136], [88, 150]], '#6b5a8a');
  disc(ctx, 88, 132, 5, '#8a7ab0');
  if (!variant) {
    poly(ctx, [[486, 96], [512, 84], [528, 102], [504, 116]], '#6b5a8a');
    disc(ctx, 506, 98, 5, '#8a7ab0');
  }

  // Alien flower bed: three glowing flowers.
  function alienFlower(cx, cy, petals, color) {
    line(ctx, cx, cy, cx, cy + 70, '#3d9b57', 5);
    oval(ctx, cx - 14, cy + 40, 14, 7, '#3d9b57');
    for (let i = 0; i < petals; i++) {
      const a = (i * Math.PI * 2) / petals;
      oval(ctx, cx + Math.cos(a) * 18, cy + Math.sin(a) * 18, 12, 8, color);
    }
    disc(ctx, cx, cy, 12, '#f2b705');
    disc(ctx, cx, cy, 5, '#d64545');
  }
  alienFlower(150, 250, 6, '#e078e0');
  alienFlower(290, 236, variant ? 5 : 6, '#7fd4c0'); // petal count differs
  alienFlower(430, 252, 6, '#e078e0');

  // Robot gardener with an antenna light (on vs off).
  box(ctx, 118, 300, 46, 52, '#8a97a8');
  box(ctx, 126, 282, 30, 20, '#6b7a8c');
  disc(ctx, 136, 292, 4, '#2b2118');
  disc(ctx, 146, 292, 4, '#2b2118');
  line(ctx, 141, 282, 141, 262, '#2b2118', 3);
  disc(ctx, 141, 258, 7, variant ? '#6b7a8c' : '#ffd94d'); // antenna light
  line(ctx, 118, 316, 100, 330, '#6b7a8c', 6); // arm
  line(ctx, 164, 316, 182, 330, '#6b7a8c', 6);
  box(ctx, 122, 352, 14, 12, '#6b7a8c');
  box(ctx, 146, 352, 14, 12, '#6b7a8c');

  // Watering can (missing in the variant).
  if (!variant) {
    box(ctx, 238, 344, 34, 20, '#5aa9e6');
    poly(ctx, [[238, 348], [222, 340], [226, 356]], '#5aa9e6'); // spout
    poly(ctx, [[272, 348], [284, 342], [282, 356]], '#5aa9e6'); // handle
    disc(ctx, 250, 342, 4, '#3d6fb5');
  }

  // Spotted mushroom (3 spots vs 2).
  box(ctx, 470, 352, 12, 22, '#fdf6e9');
  poly(ctx, [[446, 356], [494, 356], [470, 322]], '#d64545');
  disc(ctx, 462, 342, 4, '#fdf6e9');
  disc(ctx, 478, 336, 4, '#fdf6e9');
  if (!variant) disc(ctx, 470, 348, 4, '#fdf6e9');

  // Snail with a shell swirl (direction differs).
  oval(ctx, 330, 398, 26, 12, '#e8a0a0');
  disc(ctx, 306, 392, 8, '#e8a0a0');
  disc(ctx, 330, 386, 15, '#7fd4c0');
  ctx.strokeStyle = '#2b6b5e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(330, 386, 9, 0, Math.PI * 1.5);
  ctx.stroke();
  ctx.beginPath();
  if (!variant) ctx.arc(330, 386, 5, 0, Math.PI);
  else ctx.arc(330, 386, 5, Math.PI, Math.PI * 2);
  ctx.stroke();

  // Leafy sprout (extra leaf vs none).
  line(ctx, 388, 372, 388, 330, '#3d9b57', 4);
  oval(ctx, 376, 344, 12, 6, '#4cb464');
  if (!variant) oval(ctx, 400, 336, 12, 6, '#4cb464');
}

const GARDEN_DIFFS = [
  { x: 420, y: 82, r: 32, name: 'planet ring' },
  { x: 290, y: 236, r: 26, name: 'flower petals' },
  { x: 141, y: 258, r: 20, name: 'antenna light' },
  { x: 200, y: 70, r: 18, name: 'missing star' },
  { x: 470, y: 342, r: 26, name: 'mushroom spots' },
  { x: 252, y: 352, r: 26, name: 'watering can' },
  { x: 330, y: 386, r: 24, name: 'snail swirl' },
  { x: 400, y: 336, r: 20, name: 'extra leaf' },
  { x: 88, y: 62, r: 24, name: 'moon crater' },
  { x: 506, y: 98, r: 22, name: 'floating rock' },
];

// The garden hides one more difference the player must hunt: a single star
// that only shines in the original. It is drawn here as part of the dome.
function drawGardenStar(ctx, variant) {
  if (!variant) star5(ctx, 200, 70, 8, '#ffe98a');
}

// ---------------------------------------------------------------------------
// Registry: every round's scene, its draw function and its hit zones.
// ---------------------------------------------------------------------------
export const SCENES = [
  { id: 'cafe', name: 'Cat Café', draw: drawCafe, diffs: CAFE_DIFFS },
  { id: 'market', name: 'Night Market', draw: drawMarket, diffs: MARKET_DIFFS },
  {
    id: 'garden',
    name: 'Space Garden',
    draw: (ctx, variant) => {
      drawGarden(ctx, variant);
      drawGardenStar(ctx, variant);
    },
    diffs: GARDEN_DIFFS,
  },
];
