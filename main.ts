// Spot the Difference — Three Little Worlds: the hand-in program.
// Node 22, standard library only. It copies the static game and the
// screenshots beside this file into /output (or MAKEFUN_OUTPUT_DIR outside
// the grader) and writes /output/dossier.json, the summary the judge reads,
// using the vendored make.fun library. The program is deterministic: two
// runs write the same bytes, because it only copies files and builds the
// dossier from them.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const gameDir = join(here, 'game');
const shotsDir = join(here, 'screenshots');

// The game ships as plain static files and the screenshots as the maker's
// own renders of it. Both must be present or the hand-in is not a game.
if (!existsSync(join(gameDir, 'index.html'))) {
  throw new Error('game/index.html is missing: the entry has no game to hand in');
}
const shots = existsSync(shotsDir)
  ? readdirSync(shotsDir).filter((name) => !name.startsWith('.'))
  : [];
if (shots.length < 3 || shots.length > 4) {
  throw new Error(`screenshots/ must hold 3 or 4 images, found ${shots.length}`);
}

mkdirSync(out, { recursive: true });
cpSync(gameDir, join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(out, 'screenshots'), { recursive: true });

// The gate's caps, as the kit documents them: the dossier text is capped at
// 160 KiB, each screenshot at 256 KiB, the game at 993 files / 48 MiB with
// no path over 1000 bytes. buildDossier writes the dossier from the copied
// files, byte for byte the same every run — so the two grader runs agree.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
