// Shared constants for Spot the Difference — Three Little Worlds.
// One file, one job: every number the game tunes lives here.

export const SCENE_W = 580;
export const SCENE_H = 436;

export const POINTS_PER_FIND = 100;
export const WRONG_CLICK_TIME_PENALTY = 5; // seconds lost on a miss
export const HINTS_PER_ROUND = 3;
export const HINT_PULSE_MS = 2200;
export const WRONG_MARK_MS = 650;
export const FOUND_RING_R = 26;

export const ROUNDS = [
  { id: 'cafe', name: 'Cat Café', time: 120, diffs: 8 },
  { id: 'market', name: 'Night Market', time: 100, diffs: 8 },
  { id: 'garden', name: 'Space Garden', time: 90, diffs: 10 },
];

export const COLORS = {
  ink: '#2b2118',
  paper: '#fdf6e9',
  accent: '#e07840',
  green: '#3d9b57',
  red: '#d64545',
  gold: '#f2b705',
};
