// A tiny seeded random generator (mulberry32) so decorative details — stars,
// sprinkles, pebbles — land in exactly the same spots on both panels. The two
// pictures must be identical except for the designed differences, so no
// unseeded Math.random() is used anywhere inside a scene drawing.

export function makeSeededRandom(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
