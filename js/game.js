let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  //keyboard = new Keyboard();
  world = new World(canvas, keyboard);
}

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }
  if (e.keyCode == 38) {
    keyboard.UP = true;
  }
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }
  // if (e.keyCode == 32) {
  //   keyboard.SPACE = true;
  // }
  if (e.keyCode == 68) {
    keyboard.D = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (e.keyCode == 38) {
    keyboard.UP = false;
  }
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }
  // if (e.keyCode == 32) {
  //   keyboard.SPACE = false;
  // }
  if (e.keyCode == 68) {
    keyboard.D = false;
  }
});

// window.addEventListener("keydown", (e) => {
//   if (e.code === "ArrowRight") keyboard.RIGHT = true;
//   if (e.code === "ArrowLeft") keyboard.LEFT = true;
//   if (e.code === "Space") keyboard.SPACE = true;
//   if (e.code === "KeyD") keyboard.D = true;
// });

// window.addEventListener("keyup", (e) => {
//   if (e.code === "ArrowRight") keyboard.RIGHT = false;
//   if (e.code === "ArrowLeft") keyboard.LEFT = false;
//   if (e.code === "Space") keyboard.SPACE = false;
//   if (e.code === "KeyD") keyboard.D = false;
// });
