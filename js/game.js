/**
 * 🎮 Main game script
 * Handles game initialization, keyboard input, fullscreen, sound, and UI overlays.
 */

let canvas;
let world;
let keyboard = new Keyboard();
//let soundEnabled = true;
let soundEnabled = localStorage.getItem("soundEnabled") === "false" ? false : true;

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
function init() {
  canvas = document.getElementById("canvas");
  canvas.width = 720;
  canvas.height = 480;
  world = new World(canvas, keyboard);
  resizeCanvas();
  world.updateCanvasRect?.(); // Ensure correct touch area mapping
}

/**
 * Handles keyboard keydown events for player control.
 */
window.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 37: keyboard.LEFT = true; break;   // ← Move left
    case 38: keyboard.UP = true; break;     // ↑ Jump
    case 39: keyboard.RIGHT = true; break;  // → Move right
    case 40: keyboard.DOWN = true; break;   // ↓ (unused but reserved)
    case 68: keyboard.D = true; break;      // D = Throw bottle
  }
});

/**
 * Handles keyboard keyup events (stop movement or throwing).
 */
window.addEventListener("keyup", (e) => {
  switch (e.keyCode) {
    case 37: keyboard.LEFT = false; break;
    case 38: keyboard.UP = false; break;
    case 39: keyboard.RIGHT = false; break;
    case 40: keyboard.DOWN = false; break;
    case 68: keyboard.D = false; break;
  }
});

/**
 * Dynamically resizes the canvas while keeping the 720x480 aspect ratio.
 * Also updates touch button positions after resizing.
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
  // Update canvas touch bounds for accurate input detection
  if (world?.updateCanvasRect) world.updateCanvasRect();
}

/**
 * Toggles fullscreen mode for the canvas.
 */
// function toggleFullscreen() {
//   const canvas = document.getElementById("canvas");
//   if (!canvas) return;

//   if (!document.fullscreenElement) {
//     canvas.requestFullscreen().catch((err) =>
//       console.error(`Fullscreen error: ${err.message}`)
//     );
//   } else {
//     document.exitFullscreen();
//   }
// }
/**
 * Toggles fullscreen mode for the canvas.
 */
// function toggleFullscreen() {
//   const canvas = document.getElementById("canvas");
//   if (!canvas) return;

//   try {
//     if (!document.fullscreenElement && !document.webkitFullscreenElement) {
//       // ✅ Use correct API depending on browser
//       if (canvas.requestFullscreen) {
//         canvas.requestFullscreen();
//       } else if (canvas.webkitRequestFullscreen) {
//         canvas.webkitRequestFullscreen(); // Safari fallback
//       }
//     } else {
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//       } else if (document.webkitExitFullscreen) {
//         document.webkitExitFullscreen(); // Safari fallback
//       }
//     }
//   } catch (err) {
//     console.warn("Fullscreen permission denied:", err);
//   }
// }
/**
 * 🖥️ Safely toggles fullscreen mode for the canvas (with browser fallbacks).
 */
// function toggleFullscreen() {
//   const canvas = document.getElementById("canvas");
//   if (!canvas) return;

//   // Use vendor-prefixed APIs for Safari compatibility
//   const doc = document;
//   const isFullscreen = doc.fullscreenElement || doc.webkitFullscreenElement;

//   try {
//     if (!isFullscreen) {
//       const requestFullscreen =
//         canvas.requestFullscreen ||
//         canvas.webkitRequestFullscreen ||
//         canvas.msRequestFullscreen;

//       if (requestFullscreen) {
//         // ✅ Important: return the Promise to properly catch rejections
//         return requestFullscreen.call(canvas).catch((err) => {
//           console.warn("Fullscreen permission check failed:", err.message);
//         });
//       } else {
//         console.warn("Fullscreen API not supported by this browser.");
//       }
//     } else {
//       const exitFullscreen =
//         doc.exitFullscreen ||
//         doc.webkitExitFullscreen ||
//         doc.msExitFullscreen;

//       if (exitFullscreen) exitFullscreen.call(doc);
//     }
//   } catch (err) {
//     console.warn("Fullscreen could not be activated:", err.message);
//   }
// }
/**
 * 🖥️ Safely toggles fullscreen mode for the canvas (with icon auto-update)
 */
function toggleFullscreen() {
  const canvas = document.getElementById("canvas");
  if (!canvas) return;

  const doc = document;
  const isFullscreen = doc.fullscreenElement || doc.webkitFullscreenElement;
  const fullBtn = document.getElementById("fullscreen-btn");

  if (!isFullscreen) {
    // 🟢 Enter fullscreen (desktop + Safari fallback)
    const requestFullscreen =
      canvas.requestFullscreen ||
      canvas.webkitRequestFullscreen ||
      canvas.msRequestFullscreen;

    if (requestFullscreen) {
      requestFullscreen.call(canvas).catch((err) => {
        console.warn("Fullscreen permission check failed:", err.message);
      });
    }
  } else {
    // 🔴 Exit fullscreen
    const exitFullscreen =
      doc.exitFullscreen ||
      doc.webkitExitFullscreen ||
      doc.msExitFullscreen;

    if (exitFullscreen) exitFullscreen.call(doc);
  }
}




/**
 * Toggles game sound on/off and updates the UI button.
 */
// function toggleSound() {
//   soundEnabled = !soundEnabled;
//   if (world?.toggleSound) world.toggleSound(soundEnabled);

//   const soundBtn = document.getElementById("sound-btn");
//   if (soundBtn) soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
// }
/**
 * 🔊 Toggles sound on/off and saves the preference in localStorage.
 */
function toggleSound() {
  soundEnabled = !soundEnabled;

  // Save current sound state to localStorage
  localStorage.setItem("soundEnabled", soundEnabled);

  // Update world sound setting if available
  if (world?.toggleSound) world.toggleSound(soundEnabled);

  // Update button icon
  const soundBtn = document.getElementById("sound-btn");
  if (soundBtn) soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
}

// /**
//  * Displays the instructions overlay.
//  */
// function showInstructions() {
//   document.getElementById("instructions-overlay")?.classList.remove("hidden");
// }

// /**
//  * Hides the instructions overlay.
//  */
// function hideInstructions() {
//   document.getElementById("instructions-overlay")?.classList.add("hidden");
// }
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

// 🧩 Event listener for open button
document.getElementById("instructions-btn")?.addEventListener("click", showInstructions);

// 🧩 Event listener for close button inside overlay
document.getElementById("close-instructions-btn")?.addEventListener("click", hideInstructions);

// 🖱️ Close overlay when clicking anywhere outside the content box
document.getElementById("instructions-overlay")?.addEventListener("click", (event) => {
  // If the click target is NOT the content box → close
  if (!event.target.closest("#instructions-content")) {
    hideInstructions();
  }
});


/**
 * Initializes the start menu, UI buttons, and listeners when the page loads.
 */
window.addEventListener("load", () => {
  resizeCanvas();
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  new Menu(canvas, ctx); // Start screen
  const instrBtn = document.getElementById("instructions-btn");
  const fullBtn = document.getElementById("fullscreen-btn");
  const soundBtn = document.getElementById("sound-btn");
  // Button event bindings
  instrBtn?.addEventListener("click", showInstructions);
  //fullBtn?.addEventListener("click", () => toggleFullscreen(canvas));
  fullBtn?.addEventListener("click", toggleFullscreen);
  soundBtn?.addEventListener("click", toggleSound);
  // Set initial sound button icon
  if (soundBtn) soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
});

/**
 * Automatically resizes and updates game layout on screen orientation change.
 */
["resize", "orientationchange"].forEach((evt) =>
  window.addEventListener(evt, resizeCanvas)
);

/**
 * Ensures canvas input area updates correctly when entering/exiting fullscreen.
 */
// document.addEventListener("fullscreenchange", () => {
//   resizeCanvas();
//   if (world) world.updateCanvasRect();
//   setTimeout(() => world?.updateCanvasRect(), 100); // Small delay for layout adjustment
// });
/**
 * 🔁 Automatically update the fullscreen button icon
 * whenever the fullscreen state changes.
 */
document.addEventListener("fullscreenchange", () => {
  const fullBtn = document.getElementById("fullscreen-btn");
  if (!fullBtn) return;

  if (document.fullscreenElement || document.webkitFullscreenElement) {
    fullBtn.textContent = "🗗"; // Exit fullscreen icon
    fullBtn.title = "Vollbild verlassen";
  } else {
    fullBtn.textContent = "🖥️"; // Enter fullscreen icon
    fullBtn.title = "Vollbild aktivieren";
  }

  // Recalculate canvas size for touch input alignment
  resizeCanvas();
  world?.updateCanvasRect?.();
});


/**
 * Handles window resize updates for responsive canvas scaling.
 */
window.addEventListener("resize", () => {
  resizeCanvas();
  if (world) world.updateCanvasRect();
});

/**
 * Fallback UI bindings (ensures buttons always work, even if reloaded).
 */
document.getElementById("instructions-btn")?.addEventListener("click", showInstructions);
//document.getElementById("fullscreen-btn")?.addEventListener("click", () => toggleFullscreen(canvas));
document.getElementById("fullscreen-btn")?.addEventListener("click", toggleFullscreen);
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
