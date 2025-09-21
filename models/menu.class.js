// class Menu {
//   constructor(canvas, ctx) {
//     this.canvas = canvas;
//     this.ctx = ctx;
//     this.buttons = {};
//     this.currentScreen = "start";
//     this.clickHandler = this.handleClick.bind(this);

//     this.canvas.addEventListener("click", this.clickHandler);

//     this.drawStartScreen();
//   }

//   drawStartScreen() {
//     this.clear();
//     this.currentScreen = "start";

//     const img = new Image();
//     img.src = "img/9_intro_outro_screens/start/startscreen_1.png";

//     img.onload = () => {
//       this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

//       const startBtn = this.drawButton(
//         "Start",
//         this.canvas.width / 10,
//         35,
//         "#fca534ff",
//         "start"
//       );

//       const instrBtn = this.drawIconButton(
//         "📖",
//         this.canvas.width - 120,
//         40,
//         "instructions"
//       );

//       const fullBtn = this.drawIconButton(
//         "🖥️",
//         this.canvas.width - 70,
//         40,
//         "fullscreen"
//       );

//       const soundIcon = soundEnabled ? "🔊" : "🔇";
//       const soundBtn = this.drawIconButton(
//         soundIcon,
//         this.canvas.width - 20,
//         40,
//         "sound"
//       );

//       this.buttons = { startBtn, instrBtn, fullBtn, soundBtn };
//     };
//   }

//   drawInstructions() {
//     this.clear();
//     this.currentScreen = "instructions";

//     this.ctx.fillStyle = "#fca534ff";
//     this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

//     this.ctx.fillStyle = "white";
//     this.ctx.font = "32px Comic Sans MS";
//     this.ctx.textAlign = "center";
//     this.ctx.fillText("📖 Anleitung", this.canvas.width / 2, 80);

//     const lines = [
//       "⬅️ / ➡️ – Bewegung",
//       "⬆️ – Springen",
//       "D – Flasche werfen",
//       "🔊 – Sound ein/aus",
//       "🖥️ – Vollbild ein/aus",
//     ];

//     this.ctx.font = "22px Comic Sans MS";
//     lines.forEach((line, i) => {
//       this.ctx.fillText(line, this.canvas.width / 2, 160 + i * 40);
//     });

//     const backBtn = this.drawButton(
//       "Zurück",
//       this.canvas.width / 2,
//       this.canvas.height - 100,
//       "white",
//       "back"
//     );
//     this.buttons = { backBtn };
//   }

//   drawButton(text, x, y, color, action) {
//     const ctx = this.ctx;
//     const paddingX = 20;
//     const paddingY = 15;

//     ctx.font = "28px Comic Sans MS";
//     ctx.fillStyle = color;
//     ctx.textAlign = "center";
//     ctx.fillText(text, x, y);

//     const textMetrics = ctx.measureText(text);
//     const width = textMetrics.width + paddingX;
//     const height = 40;

//     return {
//       x: x - width / 2,
//       y: y - height / 2,
//       width: width,
//       height: height,
//       action: action,
//       text: text,
//     };
//   }

//   drawIconButton(icon, x, y, action) {
//     const size = 40;
//     const padding = 10;

//     this.ctx.fillStyle = "#fca534";
//     this.ctx.beginPath();
//     this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
//     this.ctx.fill();

//     this.ctx.font = "24px Comic Sans MS";
//     this.ctx.fillStyle = "white";
//     this.ctx.textAlign = "center";
//     this.ctx.textBaseline = "middle";
//     this.ctx.fillText(icon, x, y);

//     return {
//       x: x - size / 2,
//       y: y - size / 2,
//       width: size,
//       height: size,
//       action: action,
//     };
//   }

//   drawControlButton(icon, x, y, action) {
//     const size = 50;

//     this.ctx.fillStyle = "#fca534";
//     this.ctx.beginPath();
//     this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
//     this.ctx.fill();

//     this.ctx.font = "28px Comic Sans MS";
//     this.ctx.fillStyle = "white";
//     this.ctx.textAlign = "center";
//     this.ctx.textBaseline = "middle";
//     this.ctx.fillText(icon, x, y);

//     return {
//       x: x - size / 2,
//       y: y - size / 2,
//       width: size,
//       height: size,
//       action: action,
//     };
//   }

//   handleClick(event) {
//     if (!this.buttons) return;

//     const rect = this.canvas.getBoundingClientRect();
//     const mouseX = event.clientX - rect.left;
//     const mouseY = event.clientY - rect.top;

//     Object.values(this.buttons).forEach((btn) => {
//       if (
//         mouseX >= btn.x &&
//         mouseX <= btn.x + btn.width &&
//         mouseY >= btn.y &&
//         mouseY <= btn.y + btn.height
//       ) {
//         this.handleButtonClick(btn.action);
//       }
//     });

//     this.canvas.addEventListener("mouseup", () => {
//       keyboard.LEFT = false;
//       keyboard.RIGHT = false;
//       keyboard.UP = false;
//       keyboard.D = false;
//     });

//     this.canvas.addEventListener("touchend", () => {
//       keyboard.LEFT = false;
//       keyboard.RIGHT = false;
//       keyboard.UP = false;
//       keyboard.D = false;
//     });
//   }

//   handleButtonClick(action) {
//     if (action === "start") {
//       this.destroy();
//       startGame();
//     }
//     if (action === "instructions") {
//       this.drawInstructions();
//     }
//     if (action === "fullscreen") {
//       toggleFullscreen(this.canvas);
//     }
//     if (action === "sound") {
//       toggleSound();
//       this.drawStartScreen();
//     }
//     if (action === "back") {
//       this.drawStartScreen();
//     }

//     if (action === "left") keyboard.LEFT = true;
//     if (action === "right") keyboard.RIGHT = true;
//     if (action === "jump") keyboard.UP = true;
//     if (action === "throw") keyboard.D = true;
//   }

//   clear() {
//     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//   }

//   destroy() {
//     this.clear();
//     this.canvas.removeEventListener("click", this.clickHandler);
//   }
// }

// class Menu {
//   constructor(canvas, ctx) {
//     this.canvas = canvas;
//     this.ctx = ctx;
//     this.buttons = {};
//     this.currentScreen = "start";
//     this.clickHandler = this.handleClick.bind(this);

//     this.canvas.addEventListener("click", this.clickHandler);

//     this.drawStartScreen();
//   }

//   drawStartScreen() {
//     this.clear();
//     this.currentScreen = "start";

//     const img = new Image();
//     img.src = "img/9_intro_outro_screens/start/startscreen_1.png";

//     img.onload = () => {
//       this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

//       // Nur der Start-Button bleibt im Canvas
//       const startBtn = this.drawButton(
//         "Start",
//         this.canvas.width / 10,
//         35,
//         "#fca534ff",
//         "start"
//       );

//       // Nur Start-Button im Menü verwalten
//       this.buttons = { startBtn };
//     };
//   }

//   drawInstructions() {
//     this.clear();
//     this.currentScreen = "instructions";

//     this.ctx.fillStyle = "#fca534ff";
//     this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

//     this.ctx.fillStyle = "white";
//     this.ctx.font = "32px Comic Sans MS";
//     this.ctx.textAlign = "center";
//     this.ctx.fillText("📖 Anleitung", this.canvas.width / 2, 80);

//     const lines = [
//       "⬅️ / ➡️ – Bewegung",
//       "⬆️ – Springen",
//       "D – Flasche werfen",
//       "🔊 – Sound ein/aus",
//       "🖥️ – Vollbild ein/aus",
//     ];

//     this.ctx.font = "22px Comic Sans MS";
//     lines.forEach((line, i) => {
//       this.ctx.fillText(line, this.canvas.width / 2, 160 + i * 40);
//     });

//     const backBtn = this.drawButton(
//       "Zurück",
//       this.canvas.width / 2,
//       this.canvas.height - 100,
//       "white",
//       "back"
//     );

//     this.buttons = { backBtn };
//   }

//   drawButton(text, x, y, color, action) {
//     const ctx = this.ctx;
//     const paddingX = 20;
//     const paddingY = 15;

//     ctx.font = "28px Comic Sans MS";
//     ctx.fillStyle = color;
//     ctx.textAlign = "center";
//     ctx.fillText(text, x, y);

//     const textMetrics = ctx.measureText(text);
//     const width = textMetrics.width + paddingX;
//     const height = 40;

//     return {
//       x: x - width / 2,
//       y: y - height / 2,
//       width: width,
//       height: height,
//       action: action,
//       text: text,
//     };
//   }

//   handleClick(event) {
//     if (!this.buttons) return;

//     const rect = this.canvas.getBoundingClientRect();
//     const mouseX = event.clientX - rect.left;
//     const mouseY = event.clientY - rect.top;

//     Object.values(this.buttons).forEach((btn) => {
//       if (
//         mouseX >= btn.x &&
//         mouseX <= btn.x + btn.width &&
//         mouseY >= btn.y &&
//         mouseY <= btn.y + btn.height
//       ) {
//         this.handleButtonClick(btn.action);
//       }
//     });
//   }

//   handleButtonClick(action) {
//     if (action === "start") {
//       this.destroy();
//       startGame();
//     }
//     if (action === "back") {
//       this.drawStartScreen();
//     }
//   }

//   clear() {
//     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//   }

//   destroy() {
//     this.clear();
//     this.canvas.removeEventListener("click", this.clickHandler);
//   }
// }


// class Menu {
//   constructor(canvas, ctx) {
//     this.canvas = canvas;
//     this.ctx = ctx;
//     this.buttons = {};
//     this.currentScreen = "start";
//     this.clickHandler = this.handleClick.bind(this);

//     this.canvas.addEventListener("click", this.clickHandler);

//     this.drawStartScreen();
//   }

//   drawStartScreen() {
//     this.clear();
//     this.currentScreen = "start";

//     const img = new Image();
//     img.src = "img/9_intro_outro_screens/start/startscreen_1.png";

//     img.onload = () => {
//       this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

//       // 👉 Start-Button links
//       const startBtn = this.drawButton(
//         "Start",
//         this.canvas.width / 5,
//         this.canvas.height - 60,
//         "#fca534ff",
//         "start"
//       );

//       // 👉 Anleitung-Button rechts daneben
//       const instrBtn = this.drawButton(
//         "Anleitung",
//         (this.canvas.width / 5) * 3,
//         this.canvas.height - 60,
//         "white",
//         "instructions"
//       );

//       // Buttons merken
//       this.buttons = { startBtn, instrBtn };
//     };
//   }

//   drawInstructions() {
//     this.clear();
//     this.currentScreen = "instructions";

//     this.ctx.fillStyle = "#fca534ff";
//     this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

//     this.ctx.fillStyle = "white";
//     this.ctx.font = "32px Comic Sans MS";
//     this.ctx.textAlign = "center";
//     this.ctx.fillText("📖 Anleitung", this.canvas.width / 2, 80);

//     const lines = [
//       "⬅️ / ➡️ – Bewegung",
//       "⬆️ – Springen",
//       "D – Flasche werfen",
//       "🔊 – Sound ein/aus",
//       "🖥️ – Vollbild ein/aus",
//     ];

//     this.ctx.font = "22px Comic Sans MS";
//     lines.forEach((line, i) => {
//       this.ctx.fillText(line, this.canvas.width / 2, 160 + i * 40);
//     });

//     // 👉 Zurück-Button
//     const backBtn = this.drawButton(
//       "Zurück",
//       this.canvas.width / 2,
//       this.canvas.height - 100,
//       "white",
//       "back"
//     );

//     this.buttons = { backBtn };
//   }

//   drawButton(text, x, y, color, action) {
//     const ctx = this.ctx;
//     const paddingX = 20;

//     ctx.font = "28px Comic Sans MS";
//     ctx.fillStyle = color;
//     ctx.textAlign = "center";
//     ctx.fillText(text, x, y);

//     const textMetrics = ctx.measureText(text);
//     const width = textMetrics.width + paddingX;
//     const height = 40;

//     return {
//       x: x - width / 2,
//       y: y - height / 2,
//       width: width,
//       height: height,
//       action: action,
//       text: text,
//     };
//   }

//   handleClick(event) {
//     if (!this.buttons) return;

//     const rect = this.canvas.getBoundingClientRect();
//     const mouseX = event.clientX - rect.left;
//     const mouseY = event.clientY - rect.top;

//     Object.values(this.buttons).forEach((btn) => {
//       if (
//         mouseX >= btn.x &&
//         mouseX <= btn.x + btn.width &&
//         mouseY >= btn.y &&
//         mouseY <= btn.y + btn.height
//       ) {
//         this.handleButtonClick(btn.action);
//       }
//     });
//   }

//   handleButtonClick(action) {
//     if (action === "start") {
//       this.destroy();
//       startGame();
//     }
//     if (action === "instructions") {
//       this.drawInstructions();
//     }
//     if (action === "back") {
//       this.drawStartScreen();
//     }
//   }

//   clear() {
//     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//   }

//   destroy() {
//     this.clear();
//     this.canvas.removeEventListener("click", this.clickHandler);
//   }
// }




// class Menu {
//   constructor(canvas, ctx) {
//     this.canvas = canvas;
//     this.ctx = ctx;
//     this.buttons = {};
//     this.currentScreen = "start";
//     this.clickHandler = this.handleClick.bind(this);

//     this.canvas.addEventListener("click", this.clickHandler);

//     this.drawStartScreen();
//   }

//   drawStartScreen() {
//     this.clear();
//     this.currentScreen = "start";

//     const img = new Image();
//     img.src = "img/9_intro_outro_screens/start/startscreen_1.png";

//     img.onload = () => {
//       this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

//       // 👉 Start-Button links oben
//       const startBtn = this.drawButton(
//         "Start",
//         this.canvas.width / 6,
//         50,
//         "#fca534ff",
//         "start"
//       );

//       // 👉 Anleitung-Button rechts oben
//       const instrBtn = this.drawButton(
//         "Anleitung",
//         this.canvas.width - this.canvas.width / 6,
//         50,
//         "white",
//         "instructions"
//       );

//       // Speichern für Klicks
//       this.buttons = { startBtn, instrBtn };
//     };
//   }

//   drawInstructions() {
//     this.clear();
//     this.currentScreen = "instructions";

//     this.ctx.fillStyle = "#fca534ff";
//     this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

//     this.ctx.fillStyle = "white";
//     this.ctx.font = "32px Comic Sans MS";
//     this.ctx.textAlign = "center";
//     this.ctx.fillText("📖 Anleitung", this.canvas.width / 2, 80);

//     const lines = [
//       "⬅️ / ➡️ – Bewegung",
//       "⬆️ – Springen",
//       "D – Flasche werfen",
//       "🔊 – Sound ein/aus",
//       "🖥️ – Vollbild ein/aus",
//     ];

//     this.ctx.font = "22px Comic Sans MS";
//     lines.forEach((line, i) => {
//       this.ctx.fillText(line, this.canvas.width / 2, 160 + i * 40);
//     });

//     // 👉 Zurück-Button unten
//     const backBtn = this.drawButton(
//       "Zurück",
//       this.canvas.width / 2,
//       this.canvas.height - 60,
//       "white",
//       "back"
//     );

//     this.buttons = { backBtn };
//   }

//   drawButton(text, x, y, color, action) {
//     const ctx = this.ctx;
//     const paddingX = 20;
//     const height = 40;

//     ctx.font = "28px Comic Sans MS";
//     ctx.fillStyle = color;
//     ctx.textAlign = "center";
//     ctx.fillText(text, x, y);

//     const textMetrics = ctx.measureText(text);
//     const width = textMetrics.width + paddingX;

//     return {
//       x: x - width / 2,
//       y: y - height / 2,
//       width: width,
//       height: height,
//       action: action,
//     };
//   }

//   handleClick(event) {
//     if (!this.buttons) return;

//     const rect = this.canvas.getBoundingClientRect();
//     const mouseX = event.clientX - rect.left;
//     const mouseY = event.clientY - rect.top;

//     Object.values(this.buttons).forEach((btn) => {
//       if (
//         mouseX >= btn.x &&
//         mouseX <= btn.x + btn.width &&
//         mouseY >= btn.y &&
//         mouseY <= btn.y + btn.height
//       ) {
//         this.handleButtonClick(btn.action);
//       }
//     });
//   }

//   handleButtonClick(action) {
//     if (action === "start") {
//       this.destroy();
//       startGame();
//     }
//     if (action === "instructions") {
//       this.drawInstructions();
//     }
//     if (action === "back") {
//       this.drawStartScreen();
//     }
//   }

//   clear() {
//     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//   }

//   destroy() {
//     this.clear();
//     this.canvas.removeEventListener("click", this.clickHandler);
//   }
// }


class Menu {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.buttons = {};
    this.clickHandler = this.handleClick.bind(this);

    this.canvas.addEventListener("click", this.clickHandler);
    this.drawStartScreen();
  }

  drawStartScreen() {
    this.clear();

    const img = new Image();
    img.src = "img/9_intro_outro_screens/start/startscreen_1.png";
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

      // 👉 EINZIGER Button im Canvas: Start
      const startBtn = this.drawButton(
        "Start",
        this.canvas.width / 6, 
        50,            // Position: links oben
        "#fca534ff",
        "start"
      );

      this.buttons = { startBtn };
    };
  }

  // 🔥 KEINE drawInstructions() mehr – komplett entfernt!

  drawButton(text, x, y, color, action) {
    const ctx = this.ctx;
    const paddingX = 20;
    const height = 40;

    ctx.font = "28px Comic Sans MS";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);

    const textMetrics = ctx.measureText(text);
    const width = textMetrics.width + paddingX;

    return {
      x: x - width / 2,
      y: y - height / 2,
      width,
      height,
      action,
    };
  }

  handleClick(event) {
    if (!this.buttons) return;

    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    Object.values(this.buttons).forEach((btn) => {
      if (
        mouseX >= btn.x && mouseX <= btn.x + btn.width &&
        mouseY >= btn.y && mouseY <= btn.y + btn.height
      ) {
        this.handleButtonClick(btn.action);
      }
    });
  }

  handleButtonClick(action) {
    if (action === "start") {
      this.destroy();
      startGame();
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  destroy() {
    this.clear();
    this.buttons = {};
    this.canvas.removeEventListener("click", this.clickHandler);
  }
}
