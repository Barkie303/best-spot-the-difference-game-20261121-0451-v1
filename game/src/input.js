// Clicks and keys: one file, one job. It translates a mouse click on either
// canvas into scene coordinates and hands the key presses to the game.

export function attachCanvasClicks(leftCanvas, rightCanvas, onPick) {
  for (const canvas of [leftCanvas, rightCanvas]) {
    canvas.addEventListener('click', (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
      const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
      onPick(x, y, canvas === leftCanvas ? 'left' : 'right');
    });
  }
}

export function attachKeys(handlers) {
  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'h' && handlers.hint) handlers.hint();
    if (key === 'r' && handlers.restart) handlers.restart();
    if (key === 'n' && handlers.next) handlers.next();
    if (key === 'enter' && handlers.confirm) handlers.confirm();
  });
}
