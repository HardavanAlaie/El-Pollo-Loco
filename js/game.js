let canvas;
let world;
let keyboard = new Keyboard();
let soundEnabled = true;

/**
 * Starts the game by hiding the start screen and initializing the game logic.
 * Hides the element with the ID "start-screen" and calls the `init` function to begin the game.
 */
function startGame() {
  document.getElementById("start-screen").style.display = "none";
  init();
}

/**
 * Initializes the game by setting up the canvas element, configuring its dimensions,
 * creating a new World instance, resizing the canvas, and updating the canvas rectangle.
 * This function should be called once to start the game setup process.
 */
function init() {
  canvas = document.getElementById("canvas");
  canvas.width = 720;
  canvas.height = 480;
  world = new World(canvas, keyboard);
  resizeCanvas();
  world.updateCanvasRect?.();
}

window.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 37:
      keyboard.LEFT = true;
      break;
    case 38:
      keyboard.UP = true;
      break;
    case 39:
      keyboard.RIGHT = true;
      break;
    case 40:
      keyboard.DOWN = true;
      break;
    case 68:
      keyboard.D = true;
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.keyCode) {
    case 37:
      keyboard.LEFT = false;
      break;
    case 38:
      keyboard.UP = false;
      break;
    case 39:
      keyboard.RIGHT = false;
      break;
    case 40:
      keyboard.DOWN = false;
      break;
    case 68:
      keyboard.D = false;
      break;
  }
});

/**
 * Resizes the canvas element with the ID "canvas" to maintain a 720:480 aspect ratio,
 * adjusting its size based on the current window dimensions. If the global `world` object
 * has an `updateCanvasRect` method, it will be called after resizing.
 */
function resizeCanvas() {
  const canvas = document.getElementById("canvas");
  if (!canvas) return;
  const aspectRatio = 720 / 480;
  const windowRatio = window.innerWidth / window.innerHeight;
  let newWidth, newHeight;
  if (windowRatio > aspectRatio) {
    newHeight = window.innerHeight;
    newWidth = newHeight * aspectRatio;
  } else {
    newWidth = window.innerWidth;
    newHeight = newWidth / aspectRatio;
  }
  canvas.style.width = `${newWidth}px`;
  canvas.style.height = `${newHeight}px`;
  if (world?.updateCanvasRect) world.updateCanvasRect();
}

/**
 * Toggles fullscreen mode for the canvas element with the ID "canvas".
 * If the canvas is not currently in fullscreen, it requests fullscreen mode.
 * If already in fullscreen, it exits fullscreen mode.
 * Logs an error to the console if the fullscreen request fails.
 */
function toggleFullscreen() {
  const canvas = document.getElementById("canvas");
  if (!canvas) return;
  if (!document.fullscreenElement) {
    canvas
      .requestFullscreen()
      .catch((err) => console.error(`Vollbild-Fehler: ${err.message}`));
  } else {
    document.exitFullscreen();
  }
}

/**
 * Toggles the game's sound state between enabled and disabled.
 * Updates the global `soundEnabled` variable, notifies the `world` object (if available),
 * and updates the sound button's icon in the UI.
 *
 * @function
 */
function toggleSound() {
  soundEnabled = !soundEnabled;
  if (world?.toggleSound) world.toggleSound(soundEnabled);
  const soundBtn = document.getElementById("sound-btn");
  if (soundBtn) soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
}

/**
 * Displays the instructions overlay by removing the "hidden" class
 * from the element with the ID "instructions-overlay", if it exists.
 */
function showInstructions() {
  document.getElementById("instructions-overlay")?.classList.remove("hidden");
}

/**
 * Hides the instructions overlay by adding the "hidden" class
 * to the element with the ID "instructions-overlay", if it exists.
 */
function hideInstructions() {
  document.getElementById("instructions-overlay")?.classList.add("hidden");
}

window.addEventListener("load", () => {
  resizeCanvas();

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  new Menu(canvas, ctx);

  const instrBtn = document.getElementById("instructions-btn");
  const fullBtn = document.getElementById("fullscreen-btn");
  const soundBtn = document.getElementById("sound-btn");

  instrBtn?.addEventListener("click", showInstructions);
  fullBtn?.addEventListener("click", () => toggleFullscreen(canvas));
  soundBtn?.addEventListener("click", toggleSound);

  if (soundBtn) soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
});

["resize", "orientationchange"].forEach((evt) =>
  window.addEventListener(evt, resizeCanvas)
);

document.addEventListener("fullscreenchange", () => {
  resizeCanvas();
  if (world) world.updateCanvasRect();
  setTimeout(() => world?.updateCanvasRect(), 100);
});

window.addEventListener("resize", () => {
  resizeCanvas();
  if (world) world.updateCanvasRect();
});

document
  .getElementById("instructions-btn")
  ?.addEventListener("click", showInstructions);
document
  .getElementById("fullscreen-btn")
  ?.addEventListener("click", () => toggleFullscreen(canvas));
document.getElementById("sound-btn")?.addEventListener("click", toggleSound);

/**
 * Checks the current screen orientation and toggles the visibility
 * of the "rotate-overlay" element. If the device is in portrait mode,
 * the overlay is shown; otherwise, it is hidden.
 *
 * @function
 * @returns {void}
 */
function checkOrientation() {
  const overlay = document.getElementById("rotate-overlay");
  if (!overlay) return;

  const isPortrait = window.innerHeight > window.innerWidth;

  if (isPortrait) {
    overlay.classList.remove("hidden");
  } else {
    overlay.classList.add("hidden");
  }
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("load", checkOrientation);
