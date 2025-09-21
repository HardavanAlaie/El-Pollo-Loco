let canvas;
let world;
let keyboard = new Keyboard();

let soundEnabled = true;

function startGame() {
  document.getElementById("start-screen").style.display = "none";
  //document.getElementById("mobile-controls").style.display = "flex";
  init();
  //setupMobileControls();
}

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
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

// function resizeCanvas() {
//   const canvas = document.getElementById("canvas");
//   if (!canvas) return;

//   // Feste Spielfeldgröße (Seitenverhältnis 720x480)
//   const aspectRatio = 720 / 480;
//   const windowRatio = window.innerWidth / window.innerHeight;

//   if (windowRatio > aspectRatio) {
//     // Bildschirm breiter → Höhe bestimmen
//     canvas.style.height = window.innerHeight + "px";
//     canvas.style.width = window.innerHeight * aspectRatio + "px";
//   } else {
//     // Bildschirm höher → Breite bestimmen
//     canvas.style.width = window.innerWidth + "px";
//     canvas.style.height = window.innerWidth / aspectRatio + "px";
//   }

//   // Buttons im Canvas mit verschieben
//   const mobileControls = document.getElementById("mobile-controls");
//   if (mobileControls) {
//     mobileControls.style.width = canvas.style.width;
//     mobileControls.style.left = canvas.offsetLeft + "px";
//     mobileControls.style.bottom = "20px";
//   }
// }
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

  // WICHTIG → Zeichenbereich anpassen
  canvas.width = 720;   // interne Logik bleibt fix
  canvas.height = 480;

  // Skalierung über CSS
  canvas.style.width = newWidth + "px";
  canvas.style.height = newHeight + "px";

  // Mobile Controls an Canvas ausrichten
  const mobileControls = document.getElementById("mobile-controls");
  if (mobileControls) {
    mobileControls.style.width = newWidth + "px";
    mobileControls.style.left = canvas.offsetLeft + "px";
    mobileControls.style.bottom = "20px";
  }
}


// Sofort ausführen & bei Resize
window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", resizeCanvas);
window.addEventListener("load", resizeCanvas);

