/**
 * Main game script
 * Handles game initialization, keyboard input, fullscreen, sound, and UI overlays.
 */
let canvas;
let world;
let keyboard = new Keyboard();
let soundEnabled =
  localStorage.getItem("soundEnabled") === "false" ? false : true;
let isRestarting = false;

/**
 * Starts the game by hiding the start screen and initializing the world.
 */
function startGame() {
  document.getElementById("start-screen").style.display = "none";
  init();
}

/**
 * Initializes the canvas, world, and game environment.
 */
function init(options = {}) {
  canvas = document.getElementById("canvas");
  canvas.width = 720;
  canvas.height = 480;
  world = new World(canvas, keyboard);
  if (!options.skipResize) {
    resizeCanvas();
  }
  world.updateCanvasRect?.();
}

/**
 * Handles keyboard keydown events for player control.
 */
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

/**
 * Handles keyboard keyup events (stop movement or throwing).
 */
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
 * Dynamically resizes the canvas while keeping the 720x480 aspect ratio.
 * Also updates touch button positions after resizing.
 */
function resizeCanvas() {
  if (isRestarting) return;
  const canvas = document.getElementById("canvas");
  if (!canvas) return;
  const aspectRatio = 720 / 480;
  const windowRatio = window.innerWidth / window.innerHeight;
  let newWidth, newHeight;
  ({ newHeight, newWidth } = ifWindowRatioAspectRatioMethod(windowRatio, aspectRatio, newHeight, newWidth));
  canvas.style.width = `${newWidth}px`;
  canvas.style.height = `${newHeight}px`;
  world?.updateCanvasRect?.();
}

/**
 * Calculates the optimal canvas size based on window ratio
 * and a fixed game aspect ratio.
 * @function ifWindowRatioAspectRatioMethod
 * @param {number} windowRatio - The current window width/height ratio.
 * @param {number} aspectRatio - The fixed desired aspect ratio of the game.
 * @param {number} newHeight - Initial height value (will be recalculated).
 * @param {number} newWidth - Initial width value (will be recalculated).
 * @returns {{ newHeight: number, newWidth: number }}
 * Returns the adjusted width and height ensuring the aspect ratio is preserved.
 * Behavior:
 * - If the window is wider than the desired ratio → height fits, width adjusts.
 * - If the window is taller/narrower → width fits, height adjusts.
 */
function ifWindowRatioAspectRatioMethod(windowRatio, aspectRatio, newHeight, newWidth) {
  if (windowRatio > aspectRatio) {
    newHeight = window.innerHeight;
    newWidth = newHeight * aspectRatio;
  } else {
    newWidth = window.innerWidth;
    newHeight = newWidth / aspectRatio;
  }
  return { newHeight, newWidth };
}

//Safely toggles fullscreen mode for the canvas (with icon auto-update)
function toggleFullscreen() {
  const canvas = document.getElementById("canvas");
  if (!canvas) return;
  const doc = document;
  const isFullscreen = doc.fullscreenElement || doc.webkitFullscreenElement;
  const fullBtn = document.getElementById("fullscreen-btn");
  isFullscreenMethod(isFullscreen, canvas, doc);
}

/**
 * Toggles fullscreen mode for the game canvas.
 * @function isFullscreenMethod
 * @param {boolean} isFullscreen - Indicates whether fullscreen is currently active.
 * @param {HTMLCanvasElement} canvas - The canvas element that should enter fullscreen.
 * @param {Document} doc - The document object used to exit fullscreen.
 * Behavior:
 * - If not in fullscreen → requests fullscreen on the canvas.
 * - If already in fullscreen → exits fullscreen mode.
 * - Includes vendor-prefixed fallbacks for browser compatibility.
 * - Handles fullscreen permission errors gracefully.
 */
function isFullscreenMethod(isFullscreen, canvas, doc) {
  if (!isFullscreen) {
    const requestFullscreen = canvas.requestFullscreen ||
      canvas.webkitRequestFullscreen ||
      canvas.msRequestFullscreen;
    if (requestFullscreen) {
      requestFullscreen.call(canvas).catch((err) => {
        console.warn("Fullscreen permission check failed:", err.message);
      });
    }
  } else {
    const exitFullscreen = doc.exitFullscreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
    if (exitFullscreen) exitFullscreen.call(doc);
  }
}

/**
 * Toggles sound on/off and saves the preference in localStorage.
 */
function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem("soundEnabled", soundEnabled);
  if (world?.toggleSound) world.toggleSound(soundEnabled);
  const soundBtn = document.getElementById("sound-btn");
  if (soundBtn) soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
}

/**
 * Displays the instructions overlay and darkens background.
 */
function showInstructions() {
  const overlay = document.getElementById("instructions-overlay");
  overlay?.classList.remove("hidden");
}

/**
 * Hides the instructions overlay.
 */
function hideInstructions() {
  const overlay = document.getElementById("instructions-overlay");
  overlay?.classList.add("hidden");
}

// Event listener for open button
document
  .getElementById("instructions-btn")
  ?.addEventListener("click", showInstructions);

// Event listener for close button inside overlay
document
  .getElementById("close-instructions-btn")
  ?.addEventListener("click", hideInstructions);

// Close overlay when clicking anywhere outside the content box
document
  .getElementById("instructions-overlay")
  ?.addEventListener("click", (event) => {
    if (!event.target.closest("#instructions-content")) {
      hideInstructions();
    }
  });

/**
 * Displays the Impressum overlay by removing the "hidden" class.
 * @function showImpressum
 */
function showImpressum() {
  const overlay = document.getElementById("impressum-overlay");
  overlay?.classList.remove("hidden");
}

/**
 * Hides the Impressum overlay by adding the "hidden" class.
 * @function hideImpressum
 */
function hideImpressum() {
  const overlay = document.getElementById("impressum-overlay");
  overlay?.classList.add("hidden");
}

// Close-Button im Overlay
document
  .getElementById("close-impressum-btn")
  ?.addEventListener("click", hideImpressum);

// Klick außerhalb der Box schließt das Overlay
document
  .getElementById("impressum-overlay")
  ?.addEventListener("click", (event) => {
    if (!event.target.closest("#impressum-content")) {
      hideImpressum();
    }
  });

/**
 * Initializes the start menu, UI buttons, and listeners when the page loads.
 */
window.addEventListener("load", () => {
  resizeCanvas();
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  new Menu(canvas, ctx);
  const instrBtn = document.getElementById("instructions-btn");
  const fullBtn = document.getElementById("fullscreen-btn");
  const soundBtn = document.getElementById("sound-btn");
  instrBtn?.addEventListener("click", showInstructions);
  fullBtn?.addEventListener("click", toggleFullscreen);
  soundBtn?.addEventListener("click", toggleSound);
  if (soundBtn) soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
});

/**
 * Automatically resizes and updates game layout on screen orientation change.
 */
["resize", "orientationchange"].forEach((evt) =>
  window.addEventListener(evt, resizeCanvas)
);

/**
 * Automatically update the fullscreen button icon
 * whenever the fullscreen state changes.
 */
document.addEventListener("fullscreenchange", () => {
  const fullBtn = document.getElementById("fullscreen-btn");
  if (!fullBtn) return;
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    fullBtn.textContent = "🗗";
    fullBtn.title = "Vollbild verlassen";
  } else {
    fullBtn.textContent = "🖥️";
    fullBtn.title = "Vollbild aktivieren";
  }
  resizeCanvas();
  world?.updateCanvasRect?.();
});

 //Handles window resize updates for responsive canvas scaling.
window.addEventListener("resize", () => {
  resizeCanvas();
  if (world) world.updateCanvasRect();
});

 //Fallback UI bindings (ensures buttons always work, even if reloaded).
document
  .getElementById("instructions-btn")
  ?.addEventListener("click", showInstructions);
document
  .getElementById("fullscreen-btn")
  ?.addEventListener("click", toggleFullscreen);
document.getElementById("sound-btn")?.addEventListener("click", toggleSound);

/**
 * Displays a "Rotate Device" overlay when the device is in portrait mode.
 * Encourages players to play in landscape orientation.
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

// Listen for orientation or screen size changes
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("load", checkOrientation);

/**
 * Returns the restart overlay element used for the fade animation.
 * @function ensureRestartOverlay
 * @returns {HTMLElement|null}
 */
function ensureRestartOverlay() {
  const el = document.getElementById("restart-fade");
  return el;
}

/**
 * Initiates the game restart sequence with a fade-out animation,
 * prevents double restarts, and preserves canvas size.
 * @function restartGame
 */
window.restartGame = function restartGame() {
  if (isRestarting) return;
  isRestarting = true;
  const overlay = ensureRestartOverlay();
  const canvas = document.getElementById("canvas");
  const keepW = canvas.style.width;
  const keepH = canvas.style.height;
  overlay.style.display = "block";
  requestAnimationFrame(() => overlay.classList.add("show"));
  setTimeoutMethod(canvas, keepW, keepH, overlay);
}

/**
 * Handles the delayed restart logic including cleanup,
 * canvas reset, and overlay fade-out transition.
 * @function setTimeoutMethod
 * @param {HTMLCanvasElement} canvas
 * @param {string} keepW - Previous canvas width (CSS)
 * @param {string} keepH - Previous canvas height (CSS)
 * @param {HTMLElement} overlay
 */
function setTimeoutMethod(canvas, keepW, keepH, overlay) {
  setTimeout(() => {
    try {
      tryWindowWorldMethod();
      ctxCanvasMethod(canvas, keepW, keepH);
    } finally {
      overlay.classList.remove("show");
      overlay.addEventListener(
        "transitionend",
        () => {
          overlay.style.display = "none";
          isRestarting = false;
        },{ once: true });
    }
  }, 250);
}

/**
 * Resets canvas state, clears context, reinitializes the game,
 * restores canvas display size, and updates world canvas rect.
 * @function ctxCanvasMethod
 * @param {HTMLCanvasElement} canvas
 * @param {string} keepW - Previous width from CSS
 * @param {string} keepH - Previous height from CSS
 */
function ctxCanvasMethod(canvas, keepW, keepH) {
  const ctx = canvas.getContext("2d");
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  init({ skipResize: true });
  canvas.style.width = keepW;
  canvas.style.height = keepH;
  world.updateCanvasRect?.();
}

/**
 * Safely stops all world processes before restarting the game:
 * enemy audio, background sounds, the game loop, and animations.
 * @function tryWindowWorldMethod
 */
function tryWindowWorldMethod() {
  if (window.world) {
    world.hardStopEnemyAudio?.();
    world.stopAllSounds?.();
    world.stopBackgroundMusic?.();
    world.stopRestartButtonAnimation?.();
    world.stopGameLoopHard?.();
  }
}

