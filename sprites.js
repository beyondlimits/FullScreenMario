// Resets the main canvas and context
function resetCanvas() {
  // The global canvas is one that fills the screen
  window.canvas = FSM.getCanvas(innerWidth, innerHeight, true);
  window.context = canvas.getContext("2d");
  document.body.appendChild(canvas);
}