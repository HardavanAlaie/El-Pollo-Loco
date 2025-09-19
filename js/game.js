let canvas;
let world;
let keyboard = new Keyboard();

let soundEnabled = true;

function startGame() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("mobile-controls").style.display = "flex";
  init();
  setupMobileControls();
}

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

// // Mobile
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
function setupMobileControls() {
  const controls = [
    { id: "left-btn", key: "LEFT" },
    { id: "right-btn", key: "RIGHT" },
    { id: "jump-btn", key: "UP" },
    { id: "throw-btn", key: "D" },
  ];

  const clearAllKeys = () => {
    controls.forEach((c) => (keyboard[c.key] = false));
  };

  window.addEventListener("pointerup", clearAllKeys);
  window.addEventListener("mouseup", clearAllKeys);
  window.addEventListener("touchend", clearAllKeys);

  controls.forEach((control) => {
    const btn = document.getElementById(control.id);
    if (!btn) {
      console.warn("setupMobileControls: Button nicht gefunden:", control.id);
      return;
    }

    const down = (e) => {
      if (e.cancelable) e.preventDefault();
      keyboard[control.key] = true;
    };
    const up = (e) => {
      if (e && e.cancelable) e.preventDefault();
      keyboard[control.key] = false;
    };

    btn.addEventListener("pointerdown", down);
    btn.addEventListener("pointerup", up);
    btn.addEventListener("pointercancel", up);

    btn.addEventListener("touchstart", down, { passive: false });
    btn.addEventListener("touchend", up);
    btn.addEventListener("mousedown", down);
    btn.addEventListener("mouseup", up);
    btn.addEventListener("mouseleave", up);
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

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const menu = new Menu(canvas, ctx);
});

function toggleFullscreen(canvas) {
  if (!document.fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) {
      canvas.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  console.log("Sound:", soundEnabled ? "🔊 an" : "🔇 aus");

  if (world && world.toggleSound) {
    world.toggleSound(soundEnabled);
  }
}

function showInstructions() {
  document.getElementById("instructions-overlay").classList.remove("hidden");
}

function hideInstructions() {
  document.getElementById("instructions-overlay").classList.add("hidden");
}

function toggleFullscreen(canvas) {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch((err) => {
      console.error(`Vollbild-Fehler: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}
