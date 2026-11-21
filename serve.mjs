// Development server for Spot the Difference — Three Little Worlds.
// Serves game/ at http://localhost:8080 so the game can be played in a
// desktop browser. Dev tooling only: main.ts never copies it into /output.
//
//   node serve.mjs [port]
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const root = join(here, 'game');
const port = Number(process.argv[2] ?? 8080);
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const path = url.pathname === '/' ? '/index.html' : url.pathname;
    const data = await readFile(join(root, decodeURIComponent(path)));
    res.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
}).listen(port, () => {
  console.log(`Spot the Difference at http://localhost:${port}`);
  console.log('Screenshot states: ?shot=cover | ?shot=market | ?shot=win');
});
