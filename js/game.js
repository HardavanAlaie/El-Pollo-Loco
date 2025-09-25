// let canvas;
// let world;
// let keyboard = new Keyboard();

// let soundEnabled = true;

// // function startGame() {
// //   document.getElementById("start-screen").style.display = "none";
// //   //document.getElementById("mobile-controls").style.display = "flex";
// //   init();
// //   //setupMobileControls();
// // }

// // function init() {
// //   canvas = document.getElementById("canvas");
// //   world = new World(canvas, keyboard);
// // }

// function startGame() {
//   document.getElementById("start-screen").style.display = "none";
//   //document.getElementById("mobile-controls").style.display = "flex";
//   init();
// }

// function init() {
//   canvas = document.getElementById("canvas");

//   // 🎯 interne Auflösung fix für die Logik
//   canvas.width = 720;
//   canvas.height = 480;

//   world = new World(canvas, keyboard);

//   // direkt beim Start Canvas skalieren
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
//   const canvas = document.getElementById("canvas");
//   const ctx = canvas.getContext("2d");

//   const menu = new Menu(canvas, ctx);
// });

// // function toggleFullscreen(canvas) {
// //   if (!document.fullscreenElement) {
// //     if (canvas.requestFullscreen) {
// //       canvas.requestFullscreen();
// //     } else if (canvas.webkitRequestFullscreen) {
// //       canvas.webkitRequestFullscreen();
// //     } else if (canvas.msRequestFullscreen) {
// //       canvas.msRequestFullscreen();
// //     }
// //   } else {
// //     if (document.exitFullscreen) {
// //       document.exitFullscreen();
// //     } else if (document.webkitExitFullscreen) {
// //       document.webkitExitFullscreen();
// //     } else if (document.msExitFullscreen) {
// //       document.msExitFullscreen();
// //     }
// //   }
// // }

// function toggleSound() {
//   soundEnabled = !soundEnabled;
//   console.log("Sound:", soundEnabled ? "🔊 an" : "🔇 aus");

//   if (world && world.toggleSound) {
//     world.toggleSound(soundEnabled);
//   }
// }

// function showInstructions() {
//   document.getElementById("instructions-overlay").classList.remove("hidden");
// }

// function hideInstructions() {
//   document.getElementById("instructions-overlay").classList.add("hidden");
// }

// function toggleFullscreen(canvas) {
//   if (!document.fullscreenElement) {
//     canvas.requestFullscreen().catch((err) => {
//       console.error(`Vollbild-Fehler: ${err.message}`);
//     });
//   } else {
//     document.exitFullscreen();
//   }
// }

// // function resizeCanvas() {
// //   const canvas = document.getElementById("canvas");
// //   if (!canvas) return;

// //   // Feste Spielfeldgröße (Seitenverhältnis 720x480)
// //   const aspectRatio = 720 / 480;
// //   const windowRatio = window.innerWidth / window.innerHeight;

// //   if (windowRatio > aspectRatio) {
// //     // Bildschirm breiter → Höhe bestimmen
// //     canvas.style.height = window.innerHeight + "px";
// //     canvas.style.width = window.innerHeight * aspectRatio + "px";
// //   } else {
// //     // Bildschirm höher → Breite bestimmen
// //     canvas.style.width = window.innerWidth + "px";
// //     canvas.style.height = window.innerWidth / aspectRatio + "px";
// //   }

// //   // Buttons im Canvas mit verschieben
// //   const mobileControls = document.getElementById("mobile-controls");
// //   if (mobileControls) {
// //     mobileControls.style.width = canvas.style.width;
// //     mobileControls.style.left = canvas.offsetLeft + "px";
// //     mobileControls.style.bottom = "20px";
// //   }
// // }
// // function resizeCanvas() {
// //   const canvas = document.getElementById("canvas");
// //   if (!canvas) return;

// //   const aspectRatio = 720 / 480;
// //   const windowRatio = window.innerWidth / window.innerHeight;

// //   let newWidth, newHeight;

// //   if (windowRatio > aspectRatio) {
// //     // Bildschirm breiter → Höhe begrenzt
// //     newHeight = window.innerHeight;
// //     newWidth = newHeight * aspectRatio;
// //   } else {
// //     // Bildschirm höher → Breite begrenzt
// //     newWidth = window.innerWidth;
// //     newHeight = newWidth / aspectRatio;
// //   }

// //   // WICHTIG → Zeichenbereich anpassen
// //   canvas.width = 720;   // interne Logik bleibt fix
// //   canvas.height = 480;

// //   // Skalierung über CSS
// //   canvas.style.width = newWidth + "px";
// //   canvas.style.height = newHeight + "px";

// //   // Mobile Controls an Canvas ausrichten
// //   const mobileControls = document.getElementById("mobile-controls");
// //   if (mobileControls) {
// //     mobileControls.style.width = newWidth + "px";
// //     mobileControls.style.left = canvas.offsetLeft + "px";
// //     mobileControls.style.bottom = "20px";
// //   }
// // }
// // -------------------------
// // 🎯 Responsive Canvas
// // -------------------------
// // function resizeCanvas() {
// //   const canvas = document.getElementById("canvas");
// //   if (!canvas) return;

// //   const aspectRatio = 720 / 480;
// //   const windowRatio = window.innerWidth / window.innerHeight;

// //   let newWidth, newHeight;

// //   if (windowRatio > aspectRatio) {
// //     // Bildschirm breiter → Höhe begrenzt
// //     newHeight = window.innerHeight;
// //     newWidth = newHeight * aspectRatio;
// //   } else {
// //     // Bildschirm höher → Breite begrenzt
// //     newWidth = window.innerWidth;
// //     newHeight = newWidth / aspectRatio;
// //   }

// //   // ❌ Interne Größe bleibt fix (720x480)
// //   // ✅ Nur die Darstellung per CSS skalieren
// //   canvas.style.width = newWidth + "px";
// //   canvas.style.height = newHeight + "px";

// //   // Mobile Controls an Canvas ausrichten
// //   const mobileControls = document.getElementById("mobile-controls");
// //   if (mobileControls) {
// //     mobileControls.style.width = newWidth + "px";
// //     mobileControls.style.left = canvas.offsetLeft + "px";
// //     mobileControls.style.bottom = "20px";
// //   }
// // }
// function resizeCanvas() {
//   const canvas = document.getElementById("canvas");
//   if (!canvas) return;

//   const aspectRatio = 720 / 480;
//   const windowRatio = window.innerWidth / window.innerHeight;

//   let newWidth, newHeight;

//   if (windowRatio > aspectRatio) {
//     // Bildschirm breiter → Höhe begrenzt
//     newHeight = window.innerHeight;
//     newWidth = newHeight * aspectRatio;
//   } else {
//     // Bildschirm höher → Breite begrenzt
//     newWidth = window.innerWidth;
//     newHeight = newWidth / aspectRatio;
//   }

//   // ❌ Nicht anrühren:
//   // canvas.width = 720;
//   // canvas.height = 480;

//   // ✅ Nur CSS skalieren
//   canvas.style.width = newWidth + "px";
//   canvas.style.height = newHeight + "px";
// }

// // // Sofort ausführen & bei Resize
// // window.addEventListener("resize", resizeCanvas);
// // window.addEventListener("orientationchange", resizeCanvas);
// // window.addEventListener("load", resizeCanvas);

// // -------------------------
// // Events
// // -------------------------
// window.addEventListener("resize", resizeCanvas);
// window.addEventListener("orientationchange", resizeCanvas);
// window.addEventListener("load", () => {
//   resizeCanvas();
//   const canvas = document.getElementById("canvas");
//   const ctx = canvas.getContext("2d");
//   const menu = new Menu(canvas, ctx);
// });

let canvas;
let world;
let keyboard = new Keyboard();

let soundEnabled = true;

/**
 * Startet das Spiel
 */
function startGame() {
  document.getElementById("start-screen").style.display = "none";
  init();
}

/**
 * Initialisiert die Welt
 */
function init() {
  canvas = document.getElementById("canvas");

  // interne Spielfeldgröße bleibt fix (für Logik/Collision)
  canvas.width = 720;
  canvas.height = 480;

  world = new World(canvas, keyboard);

  // Canvas sofort skalieren
  resizeCanvas();
}

/**
 * Tastatursteuerung
 */
window.addEventListener("keydown", (e) => {
  if (e.keyCode == 37) keyboard.LEFT = true;
  if (e.keyCode == 38) keyboard.UP = true;
  if (e.keyCode == 39) keyboard.RIGHT = true;
  if (e.keyCode == 40) keyboard.DOWN = true;
  if (e.keyCode == 68) keyboard.D = true;
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 40) keyboard.DOWN = false;
  if (e.keyCode == 68) keyboard.D = false;
});

/**
 * Menü beim Laden anzeigen
 */
window.addEventListener("load", () => {
  resizeCanvas();
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  new Menu(canvas, ctx);
});

/**
 * Vollbildmodus ein/aus
 */
// function toggleFullscreen(canvas) {
//   if (!document.fullscreenElement) {
//     canvas.requestFullscreen().catch((err) => {
//       console.error(`Vollbild-Fehler: ${err.message}`);
//     });
//   } else {
//     document.exitFullscreen();
//   }
// }
// function toggleFullscreen() {
//   const canvas = document.getElementById("canvas");
//   if (!canvas) return; // Sicherheit

//   if (!document.fullscreenElement) {
//     canvas.requestFullscreen().catch((err) => {
//       console.error(`Vollbild-Fehler: ${err.message}`);
//     });
//   } else {
//     document.exitFullscreen();
//   }
// }
function toggleFullscreen() {
  const canvas = document.getElementById("canvas");
  if (!canvas) return;

  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch((err) => {
      console.error(`Vollbild-Fehler: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

// Wichtig: Wenn Fullscreen startet/endet → Canvas neu skalieren
document.addEventListener("fullscreenchange", () => {
  resizeCanvas();

  // Debug-Ausgabe, ob Koordinaten passen
  const rect = document.getElementById("canvas").getBoundingClientRect();
  console.log("Fullscreen rect:", rect.width, rect.height);
});


/**
 * Sound ein/aus
 */
// function toggleSound() {
//   soundEnabled = !soundEnabled;
//   console.log("Sound:", soundEnabled ? "🔊 an" : "🔇 aus");

//   if (world && world.toggleSound) {
//     world.toggleSound(soundEnabled);
//   }
// }
function toggleSound() {
  soundEnabled = !soundEnabled;
  console.log("Sound:", soundEnabled ? "🔊 an" : "🔇 aus");

  if (world && world.toggleSound) {
    world.toggleSound(soundEnabled);
  }

  // Icon sofort anpassen
  const soundBtn = document.getElementById("sound-btn");
  if (soundBtn) {
    soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
  }
}

// window.addEventListener("load", () => {
//   resizeCanvas();

//   const canvas = document.getElementById("canvas");
//   const ctx = canvas.getContext("2d");
//   new Menu(canvas, ctx);

//   // 🔘 HTML-Buttons verbinden
//   const fullBtn = document.getElementById("fullscreen-btn");
//   const soundBtn = document.getElementById("sound-btn");
//   const instrBtn = document.getElementById("instructions-btn");

//   if (fullBtn) {
//     fullBtn.addEventListener("click", () => {
//       toggleFullscreen(canvas);
//     });
//   }

//   if (soundBtn) {
//     const updateSoundIcon = () => {
//       soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
//     };
//     updateSoundIcon();

//     soundBtn.addEventListener("click", () => {
//       toggleSound();
//       updateSoundIcon();
//     });
//   }

//   if (instrBtn) {
//     instrBtn.addEventListener("click", () => {
//       showInstructions(); // nutzt dein Overlay
//     });
//   }
// });
// window.addEventListener("load", () => {
//   resizeCanvas();

//   const canvas = document.getElementById("canvas");
//   const ctx = canvas.getContext("2d");
//   new Menu(canvas, ctx);

//   // HTML-Buttons
//   const instrBtn = document.getElementById("instructions-btn");
//   const fullBtn  = document.getElementById("fullscreen-btn");
//   const soundBtn = document.getElementById("sound-btn");

//   if (instrBtn) instrBtn.addEventListener("click", () => showInstructions());
//   if (fullBtn)  fullBtn.addEventListener("click", () => toggleFullscreen(canvas));
//   if (soundBtn) {
//     const updateIcon = () => soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
//     updateIcon();
//     soundBtn.addEventListener("click", () => {
//       toggleSound();
//       updateIcon();
//     });
//   }
// });
window.addEventListener("load", () => {
  resizeCanvas();

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  new Menu(canvas, ctx);

  // HTML-Buttons
  const instrBtn = document.getElementById("instructions-btn");
  const fullBtn = document.getElementById("fullscreen-btn");
  const soundBtn = document.getElementById("sound-btn");

  if (instrBtn) instrBtn.addEventListener("click", () => showInstructions());
  if (fullBtn)
    fullBtn.addEventListener("click", () => toggleFullscreen(canvas));
  if (soundBtn) soundBtn.addEventListener("click", toggleSound);

  // Initiales Icon setzen
  if (soundBtn) {
    soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
  }
});

// Falls noch nicht vorhanden:
function showInstructions() {
  document.getElementById("instructions-overlay")?.classList.remove("hidden");
}
function hideInstructions() {
  document.getElementById("instructions-overlay")?.classList.add("hidden");
}

/**
 * Responsive Canvas: bleibt immer im Seitenverhältnis 720x480
 */
function resizeCanvas() {
  const canvas = document.getElementById("canvas");
  if (!canvas) return;

  const aspectRatio = 720 / 480;
  const windowRatio = window.innerWidth / window.innerHeight;

  let newWidth, newHeight;

  if (windowRatio > aspectRatio) {
    // Bildschirm breiter → Höhe begrenzt
    newHeight = window.innerHeight;
    newWidth = newHeight * aspectRatio;
  } else {
    // Bildschirm höher → Breite begrenzt
    newWidth = window.innerWidth;
    newHeight = newWidth / aspectRatio;
  }

  // ✅ Nur Darstellung per CSS skalieren
  canvas.style.width = newWidth + "px";
  canvas.style.height = newHeight + "px";
}

/**
 * Events für Resizing
 */
window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", resizeCanvas);

document
  .getElementById("instructions-btn")
  .addEventListener("click", showInstructions);
document
  .getElementById("fullscreen-btn")
  .addEventListener("click", () => toggleFullscreen(canvas));
document.getElementById("sound-btn").addEventListener("click", toggleSound);
