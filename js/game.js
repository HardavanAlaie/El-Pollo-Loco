// let canvas;
// let world;
// let keyboard = new Keyboard();

// let soundEnabled = true;

// function startGame() {
//   document.getElementById("start-screen").style.display = "none";
//   init();
// }

// function init() {
//   canvas = document.getElementById("canvas");
//   canvas.width = 720;
//   canvas.height = 480;
//   world = new World(canvas, keyboard);
//   resizeCanvas();
// }

// window.addEventListener("keydown", (e) => {
//   if (e.keyCode == 37) keyboard.LEFT = true;
//   if (e.keyCode == 38) keyboard.UP = true;
//   if (e.keyCode == 39) keyboard.RIGHT = true;
//   if (e.keyCode == 40) keyboard.DOWN = true;
//   if (e.keyCode == 68) keyboard.D = true;
// });

// window.addEventListener("keyup", (e) => {
//   if (e.keyCode == 37) keyboard.LEFT = false;
//   if (e.keyCode == 38) keyboard.UP = false;
//   if (e.keyCode == 39) keyboard.RIGHT = false;
//   if (e.keyCode == 40) keyboard.DOWN = false;
//   if (e.keyCode == 68) keyboard.D = false;
// });

// window.addEventListener("load", () => {
//   resizeCanvas();
//   const canvas = document.getElementById("canvas");
//   const ctx = canvas.getContext("2d");
//   new Menu(canvas, ctx);
// });

// function toggleFullscreen() {
//   const canvas = document.getElementById("canvas");
//   if (!canvas) return;
//   if (!document.fullscreenElement) {
//     canvas.requestFullscreen().catch((err) => {
//       console.error(`Vollbild-Fehler: ${err.message}`);
//     });
//   } else {
//     document.exitFullscreen();
//   }
// }

// document.addEventListener("fullscreenchange", () => {
//   resizeCanvas();

//   const rect = document.getElementById("canvas").getBoundingClientRect();
//   console.log("Fullscreen rect:", rect.width, rect.height);
// });

// function toggleSound() {
//   soundEnabled = !soundEnabled;
//   //console.log("Sound:", soundEnabled ? "🔊 an" : "🔇 aus");

//   if (world && world.toggleSound) {
//     world.toggleSound(soundEnabled);
//   }
//   const soundBtn = document.getElementById("sound-btn");
//   if (soundBtn) {
//     soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
//   }
// }

// window.addEventListener("load", () => {
//   resizeCanvas();

//   const canvas = document.getElementById("canvas");
//   const ctx = canvas.getContext("2d");
//   new Menu(canvas, ctx);
//   const instrBtn = document.getElementById("instructions-btn");
//   const fullBtn = document.getElementById("fullscreen-btn");
//   const soundBtn = document.getElementById("sound-btn");

//   if (instrBtn) instrBtn.addEventListener("click", () => showInstructions());
//   if (fullBtn)
//     fullBtn.addEventListener("click", () => toggleFullscreen(canvas));
//   if (soundBtn) soundBtn.addEventListener("click", toggleSound);
//   if (soundBtn) {
//     soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
//   }
// });

// function showInstructions() {
//   document.getElementById("instructions-overlay")?.classList.remove("hidden");
// }
// function hideInstructions() {
//   document.getElementById("instructions-overlay")?.classList.add("hidden");
// }

// function resizeCanvas() {
//   const canvas = document.getElementById("canvas");
//   if (!canvas) return;
//   const aspectRatio = 720 / 480;
//   const windowRatio = window.innerWidth / window.innerHeight;
//   let newWidth, newHeight;
//   if (windowRatio > aspectRatio) {
//     newHeight = window.innerHeight;
//     newWidth = newHeight * aspectRatio;
//   } else {
//     newWidth = window.innerWidth;
//     newHeight = newWidth / aspectRatio;
//   }
//   canvas.style.width = newWidth + "px";
//   canvas.style.height = newHeight + "px";
// }

// window.addEventListener("resize", resizeCanvas);
// window.addEventListener("orientationchange", resizeCanvas);

// document
//   .getElementById("instructions-btn")
//   .addEventListener("click", showInstructions);
// document
//   .getElementById("fullscreen-btn")
//   .addEventListener("click", () => toggleFullscreen(canvas));
// document.getElementById("sound-btn").addEventListener("click", toggleSound);

// let canvas;
// let world;
// let keyboard = new Keyboard();
// let soundEnabled = true;

// /** 🎮 Spielstart & Initialisierung */
// function startGame() {
//   document.getElementById("start-screen").style.display = "none";
//   init();
// }

// function init() {
//   canvas = document.getElementById("canvas");
//   canvas.width = 720;
//   canvas.height = 480;
//   world = new World(canvas, keyboard);
//   resizeCanvas();
// }

// /** ⌨️ Tastatur-Steuerung */
// window.addEventListener("keydown", (e) => {
//   switch (e.keyCode) {
//     case 37:
//       keyboard.LEFT = true;
//       break;
//     case 38:
//       keyboard.UP = true;
//       break;
//     case 39:
//       keyboard.RIGHT = true;
//       break;
//     case 40:
//       keyboard.DOWN = true;
//       break;
//     case 68:
//       keyboard.D = true;
//       break;
//   }
// });

// window.addEventListener("keyup", (e) => {
//   switch (e.keyCode) {
//     case 37:
//       keyboard.LEFT = false;
//       break;
//     case 38:
//       keyboard.UP = false;
//       break;
//     case 39:
//       keyboard.RIGHT = false;
//       break;
//     case 40:
//       keyboard.DOWN = false;
//       break;
//     case 68:
//       keyboard.D = false;
//       break;
//   }
// });

// /** 🧭 Canvas-Größe dynamisch anpassen */
// function resizeCanvas() {
//   const canvas = document.getElementById("canvas");
//   if (!canvas) return;

//   const aspectRatio = 720 / 480;
//   const windowRatio = window.innerWidth / window.innerHeight;
//   let newWidth, newHeight;

//   if (windowRatio > aspectRatio) {
//     newHeight = window.innerHeight;
//     newWidth = newHeight * aspectRatio;
//   } else {
//     newWidth = window.innerWidth;
//     newHeight = newWidth / aspectRatio;
//   }

//   canvas.style.width = `${newWidth}px`;
//   canvas.style.height = `${newHeight}px`;
// }

// /** 🖥️ Vollbildmodus umschalten */
// function toggleFullscreen() {
//   const canvas = document.getElementById("canvas");
//   if (!canvas) return;

//   if (!document.fullscreenElement) {
//     canvas
//       .requestFullscreen()
//       .catch((err) => console.error(`Vollbild-Fehler: ${err.message}`));
//   } else {
//     document.exitFullscreen();
//   }
// }

// document.addEventListener("fullscreenchange", resizeCanvas);

// /** 🔊 Sound umschalten */
// function toggleSound() {
//   soundEnabled = !soundEnabled;
//   if (world?.toggleSound) world.toggleSound(soundEnabled);

//   const soundBtn = document.getElementById("sound-btn");
//   if (soundBtn) soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
// }

// /** 📖 Anleitung anzeigen / ausblenden */
// function showInstructions() {
//   document.getElementById("instructions-overlay")?.classList.remove("hidden");
// }

// function hideInstructions() {
//   document.getElementById("instructions-overlay")?.classList.add("hidden");
// }

// /** 🧩 UI-Setup */
// window.addEventListener("load", () => {
//   resizeCanvas();

//   const canvas = document.getElementById("canvas");
//   const ctx = canvas.getContext("2d");
//   new Menu(canvas, ctx);

//   const instrBtn = document.getElementById("instructions-btn");
//   const fullBtn = document.getElementById("fullscreen-btn");
//   const soundBtn = document.getElementById("sound-btn");

//   instrBtn?.addEventListener("click", showInstructions);
//   fullBtn?.addEventListener("click", () => toggleFullscreen(canvas));
//   soundBtn?.addEventListener("click", toggleSound);

//   if (soundBtn) soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
// });

// /** 📱 Automatische Anpassung bei Fensteränderung */
// ["resize", "orientationchange"].forEach((evt) =>
//   window.addEventListener(evt, resizeCanvas)
// );

// /** 🧠 Zusätzliche Buttons (Fallback) */
// document
//   .getElementById("instructions-btn")
//   ?.addEventListener("click", showInstructions);
// document
//   .getElementById("fullscreen-btn")
//   ?.addEventListener("click", () => toggleFullscreen(canvas));
// document.getElementById("sound-btn")?.addEventListener("click", toggleSound);

let canvas;
let world;
let keyboard = new Keyboard();
let soundEnabled = true;

/** 🎮 Spielstart & Initialisierung */
function startGame() {
  document.getElementById("start-screen").style.display = "none";
  init();
}

function init() {
  canvas = document.getElementById("canvas");
  canvas.width = 720;
  canvas.height = 480;
  world = new World(canvas, keyboard);
  resizeCanvas();

  // 🧩 Nach Initialisierung sofort BoundingRect speichern
  world.updateCanvasRect?.();
}

/** ⌨️ Tastatur-Steuerung */
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

/** 🧭 Canvas-Größe dynamisch anpassen */
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

  // 📐 Nach jedem Resize neu berechnen (für Touch-Buttons!)
  if (world?.updateCanvasRect) world.updateCanvasRect();
}

/** 🖥️ Vollbildmodus umschalten */
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

/** 🔊 Sound umschalten */
function toggleSound() {
  soundEnabled = !soundEnabled;
  if (world?.toggleSound) world.toggleSound(soundEnabled);

  const soundBtn = document.getElementById("sound-btn");
  if (soundBtn) soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
}

/** 📖 Anleitung anzeigen / ausblenden */
function showInstructions() {
  document.getElementById("instructions-overlay")?.classList.remove("hidden");
}

function hideInstructions() {
  document.getElementById("instructions-overlay")?.classList.add("hidden");
}

/** 🧩 UI-Setup */
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

/** 📱 Automatische Anpassung bei Fensteränderung */
["resize", "orientationchange"].forEach((evt) =>
  window.addEventListener(evt, resizeCanvas)
);

/** 📐 Fullscreen-Update – wichtig für Touchsteuerung */
// document.addEventListener("fullscreenchange", () => {
//   resizeCanvas();
//   if (world?.updateCanvasRect) world.updateCanvasRect();
// });
// document.addEventListener("fullscreenchange", () => {
//   resizeCanvas();
//   if (world) world.updateCanvasRect();
//   setTimeout(() => world?.updateCanvasRect(), 100); // 🕒 zweiter Versuch nach Layout-Reflow
// });
document.addEventListener("fullscreenchange", () => {
  resizeCanvas();
  if (world) world.updateCanvasRect();
  setTimeout(() => world?.updateCanvasRect(), 100);
});

window.addEventListener("resize", () => {
  resizeCanvas();
  if (world) world.updateCanvasRect();
});

/** 🧠 Zusätzliche Buttons (Fallback) */
document
  .getElementById("instructions-btn")
  ?.addEventListener("click", showInstructions);
document
  .getElementById("fullscreen-btn")
  ?.addEventListener("click", () => toggleFullscreen(canvas));
document.getElementById("sound-btn")?.addEventListener("click", toggleSound);

/** 📱 Zeige Hinweis, wenn Handy nicht im Querformat ist */
function checkOrientation() {
  const overlay = document.getElementById("rotate-overlay");
  if (!overlay) return;

  // true = Hochformat (Portrait)
  const isPortrait = window.innerHeight > window.innerWidth;

  if (isPortrait) {
    overlay.classList.remove("hidden");
  } else {
    overlay.classList.add("hidden");
  }
}

// Überwache Bildschirmdrehung & Fenstergröße
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("load", checkOrientation);
