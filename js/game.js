let canvas;
let world;
let keyboard = new Keyboard();
let character;
//let character = new Character();
//let allLevels = [level1, level2];
let soundEnabled = true;

// Spielstart
function startGame() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("mobile-controls").style.display = "flex";
  init();
  setupMobileControls();
}

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);

  // Nach Weltstart: alle kleinen Chickens aktivieren
  world.level.enemies
    .filter((e) => e instanceof ChickenSmall)
    .forEach((chicken) => chicken.start());
}

// Mobile
function setupMobileControls() {
  const controls = [
    { id: "left-btn", key: "LEFT" },
    { id: "right-btn", key: "RIGHT" },
    { id: "jump-btn", key: "UP" },
    { id: "throw-btn", key: "D" },
  ];

  controls.forEach((control) => {
    const btn = document.getElementById(control.id);
    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      keyboard[control.key] = true;
    });
    btn.addEventListener("touchend", (e) => {
      e.preventDefault();
      keyboard[control.key] = false;
    });
  });
}

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

// Startscreen-Bild
window.addEventListener("load", () => {
  canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const startImage = new Image();
  startImage.src = "img/9_intro_outro_screens/start/startscreen_1.png";

  startImage.onload = () => {
    ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);
  };
});

// Vollbild
document.getElementById("fullscreen-btn").addEventListener("click", () => {
  const canvas = document.getElementById("canvas");
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch((err) => {
      console.error(`Vollbild-Fehler: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
});

// Sound
document.getElementById("sound-btn").addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById("sound-btn");
  btn.innerText = soundEnabled ? "🔊" : "🔇";

  if (world && world.toggleSound) {
    world.toggleSound(soundEnabled);
  }
});
