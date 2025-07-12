// let canvas;
// let world;
// let keyboard = new Keyboard();
// let character = new Character();

// function startGame() {
//   document.getElementById("start-screen").style.display = "none";
//   //document.getElementById("canvas").style.display = "block";
//   document.getElementById("mobile-controls").style.display = "flex"; // <- NEU!

//   init();
//   setupMobileControls(); // <--- HIER
// }

// function init() {
//   canvas = document.getElementById("canvas");
//   world = new World(canvas, keyboard, character);
//   //createTopRightButtons();
//   //createOverlayButtons();
// }

// // function createTopRightButtons() {
// //   const container = document.createElement("div");
// //   container.style.position = "absolute";
// //   container.style.top = "10px";
// //   container.style.right = "10px";
// //   container.style.zIndex = "1000";
// //   container.style.display = "flex";
// //   container.style.gap = "10px";

// //   // Vollbild-Button
// //   const fullscreenBtn = document.createElement("button");
// //   fullscreenBtn.innerText = "⛶";
// //   fullscreenBtn.title = "Vollbild";
// //   fullscreenBtn.style.padding = "10px";
// //   fullscreenBtn.style.fontSize = "20px";
// //   fullscreenBtn.style.borderRadius = "8px";
// //   fullscreenBtn.style.border = "none";
// //   fullscreenBtn.style.cursor = "pointer";
// //   fullscreenBtn.style.background = "#444";
// //   fullscreenBtn.style.color = "white";

// //   fullscreenBtn.addEventListener("click", () => {
// //     const canvas = document.querySelector("canvas");
// //     if (canvas.requestFullscreen) {
// //       canvas.requestFullscreen();
// //     } else if (canvas.webkitRequestFullscreen) {
// //       canvas.webkitRequestFullscreen();
// //     }
// //   });

// // Sound-Button
// // const soundBtn = document.createElement("button");
// // soundBtn.innerText = "🔊";
// // soundBtn.title = "Sound ein/aus";
// // soundBtn.style.padding = "10px";
// // soundBtn.style.fontSize = "20px";
// // soundBtn.style.borderRadius = "8px";
// // soundBtn.style.border = "none";
// // soundBtn.style.cursor = "pointer";
// // soundBtn.style.background = "#444";
// // soundBtn.style.color = "white";

// // let soundMuted = false;
// // soundBtn.addEventListener("click", () => {
// //   soundMuted = !soundMuted;
// //   soundBtn.innerText = soundMuted ? "🔇" : "🔊";
// //   // Beispiel: globale Audio-Mute-Variable setzen
// //   window.soundMuted = soundMuted;
// //   // Falls du Audio-Objekte verwendest:
// //   const audios = document.querySelectorAll("audio");
// //   audios.forEach((audio) => (audio.muted = soundMuted));
// // });

// //   container.appendChild(fullscreenBtn);
// //   container.appendChild(soundBtn);
// //   document.body.appendChild(container);
// // }

// // function createOverlayButtons() {
// //   const overlay = document.createElement("div");
// //   overlay.id = "gameOverlay";
// //   overlay.style.position = "absolute";
// //   overlay.style.top = "10px";
// //   overlay.style.right = "10px";
// //   overlay.style.display = "flex";
// //   overlay.style.gap = "10px";
// //   overlay.style.zIndex = "1000";

// //   const buttonStyle = `
// //     background-color: rgba(0,0,0,0.5);
// //     color: white;
// //     border: none;
// //     padding: 8px 12px;
// //     font-size: 18px;
// //     border-radius: 8px;
// //     cursor: pointer;
// //     backdrop-filter: blur(4px);
// //     transition: background-color 0.3s;
// //   `;

// //   // 🔊 Sound-Button
// //   const soundButton = document.createElement("button");
// //   soundButton.innerHTML = "🔊";
// //   soundButton.style.cssText = buttonStyle;
// //   soundButton.onclick = () => {
// //     // 🎵 Sound umschalten
// //     const muted = !window.isMuted;
// //     window.isMuted = muted;
// //     soundButton.innerHTML = muted ? "🔇" : "🔊";
// //     // TODO: Sound engine mute/unmute logik
// //   };

// //   // ⛶ Vollbild-Button
// //   const fullscreenButton = document.createElement("button");
// //   fullscreenButton.innerHTML = "⛶";
// //   fullscreenButton.style.cssText = buttonStyle;
// //   fullscreenButton.onclick = () => {
// //     const game = document.getElementById("gameContainer") || document.body;
// //     if (!document.fullscreenElement) {
// //       game.requestFullscreen();
// //     } else {
// //       document.exitFullscreen();
// //     }
// //   };

// //   overlay.appendChild(soundButton);
// //   overlay.appendChild(fullscreenButton);
// //   document.body.appendChild(overlay);
// // }

// function setupMobileControls() {
//   const controls = [
//     { id: "left-btn", key: "LEFT" },
//     { id: "right-btn", key: "RIGHT" },
//     { id: "jump-btn", key: "UP" },
//     { id: "throw-btn", key: "D" },
//   ];

//   controls.forEach((control) => {
//     const btn = document.getElementById(control.id);
//     btn.addEventListener("touchstart", (e) => {
//       e.preventDefault();
//       keyboard[control.key] = true;
//     });
//     btn.addEventListener("touchend", (e) => {
//       e.preventDefault();
//       keyboard[control.key] = false;
//     });
//   });
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

// // Bild beim Laden direkt zeichnen
// window.addEventListener("load", () => {
//   canvas = document.getElementById("canvas");
//   const ctx = canvas.getContext("2d");

//   const startImage = new Image();
//   startImage.src = "img/9_intro_outro_screens/start/startscreen_1.png";

//   startImage.onload = () => {
//     ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);
//   };
// });

// // // window.addEventListener("keydown", (e) => {
// // //   if (e.code === "ArrowRight") keyboard.RIGHT = true;
// // //   if (e.code === "ArrowLeft") keyboard.LEFT = true;
// // //   if (e.code === "Space") keyboard.SPACE = true;
// // //   if (e.code === "KeyD") keyboard.D = true;
// // // });

// // // window.addEventListener("keyup", (e) => {
// // //   if (e.code === "ArrowRight") keyboard.RIGHT = false;
// // //   if (e.code === "ArrowLeft") keyboard.LEFT = false;
// // //   if (e.code === "Space") keyboard.SPACE = false;
// // //   if (e.code === "KeyD") keyboard.D = false;
// // // });

// let soundEnabled = true;

// document.getElementById("fullscreen-btn").addEventListener("click", () => {
//   const canvas = document.getElementById("canvas");
//   if (!document.fullscreenElement) {
//     canvas.requestFullscreen().catch((err) => {
//       console.error(`Vollbild-Fehler: ${err.message}`);
//     });
//   } else {
//     document.exitFullscreen();
//   }
// });

// document.getElementById("sound-btn").addEventListener("click", () => {
//   soundEnabled = !soundEnabled;
//   const btn = document.getElementById("sound-btn");
//   btn.innerText = soundEnabled ? "🔊" : "🔇";

//   // Optional: Alle Sounds im Spiel hier stummschalten
//   if (world && world.toggleSound) {
//     world.toggleSound(soundEnabled);
//   }
// });

// /*
// let canvas;
// let world;
// let keyboard = new Keyboard();
// let character = new Character();

// function startGame() {
//   document.getElementById("start-screen").style.display = "none";
//   document.getElementById("mobile-controls").style.display = "flex";
//   init();
//   setupMobileControls();
// }

// function init() {
//   canvas = document.getElementById("canvas");
//   world = new World(canvas, keyboard, character);
// }

// function setupMobileControls() {
//   const controls = [
//     { id: "left-btn", key: "LEFT" },
//     { id: "right-btn", key: "RIGHT" },
//     { id: "jump-btn", key: "UP" },
//     { id: "throw-btn", key: "D" },
//   ];

//   controls.forEach((control) => {
//     const btn = document.getElementById(control.id);
//     btn.addEventListener("touchstart", (e) => {
//       e.preventDefault();
//       keyboard[control.key] = true;
//     });
//     btn.addEventListener("touchend", (e) => {
//       e.preventDefault();
//       keyboard[control.key] = false;
//     });
//   });
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
//   canvas = document.getElementById("canvas");
//   const ctx = canvas.getContext("2d");

//   const startImage = new Image();
//   startImage.src = "img/9_intro_outro_screens/start/startscreen_1.png";

//   startImage.onload = () => {
//     ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);
//   };
// });

// let soundEnabled = true;

// document.getElementById("fullscreen-btn").addEventListener("click", () => {
//   const canvas = document.getElementById("canvas");
//   if (!document.fullscreenElement) {
//     canvas.requestFullscreen().catch((err) => {
//       console.error(`Vollbild-Fehler: ${err.message}`);
//     });
//   } else {
//     document.exitFullscreen();
//   }
// });

// document.getElementById("sound-btn").addEventListener("click", () => {
//   soundEnabled = !soundEnabled;
//   const btn = document.getElementById("sound-btn");
//   btn.innerText = soundEnabled ? "🔊" : "🔇";

//   if (world && world.toggleSound) {
//     world.toggleSound(soundEnabled);
//   }
// });*/



//--------------------------------------------------------------------------


// =========================
// Initialisierung
// =========================
let canvas;
let world;
let keyboard = new Keyboard();
let character = new Character(); // <- FIX: character ist jetzt definiert
//let allLevels = [level1, level2]; // <- FIX: Levels als Array verfügbar
let soundEnabled = true;

// =========================
// Spielstart
// =========================
function startGame() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("mobile-controls").style.display = "flex";
  init();
  setupMobileControls();
}

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard, character);
}

// =========================
// Mobile Steuerung
// =========================
function setupMobileControls() {
  const controls = [
    { id: "left-btn", key: "LEFT" },
    { id: "right-btn", key: "RIGHT" },
    { id: "jump-btn", key: "UP" },
    { id: "throw-btn", key: "D" },
  ];

  controls.forEach(control => {
    const btn = document.getElementById(control.id);
    btn.addEventListener("touchstart", e => {
      e.preventDefault();
      keyboard[control.key] = true;
    });
    btn.addEventListener("touchend", e => {
      e.preventDefault();
      keyboard[control.key] = false;
    });
  });
}

// =========================
// Tastatursteuerung
// =========================
window.addEventListener("keydown", e => {
  if (e.keyCode == 37) keyboard.LEFT = true;
  if (e.keyCode == 38) keyboard.UP = true;
  if (e.keyCode == 39) keyboard.RIGHT = true;
  if (e.keyCode == 40) keyboard.DOWN = true;
  if (e.keyCode == 68) keyboard.D = true;
});

window.addEventListener("keyup", e => {
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 40) keyboard.DOWN = false;
  if (e.keyCode == 68) keyboard.D = false;
});

// =========================
// Startscreen-Bild zeichnen
// =========================
window.addEventListener("load", () => {
  canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const startImage = new Image();
  startImage.src = "img/9_intro_outro_screens/start/startscreen_1.png";

  startImage.onload = () => {
    ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);
  };
});

// =========================
// Vollbild-Toggle
// =========================
document.getElementById("fullscreen-btn").addEventListener("click", () => {
  const canvas = document.getElementById("canvas");
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch(err => {
      console.error(`Vollbild-Fehler: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
});

// =========================
// Sound-Toggle
// =========================
document.getElementById("sound-btn").addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById("sound-btn");
  btn.innerText = soundEnabled ? "🔊" : "🔇";

  if (world && world.toggleSound) {
    world.toggleSound(soundEnabled);
  }
});
