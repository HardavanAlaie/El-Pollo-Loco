class Menu {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.buttons = {};
    this.currentScreen = "start"; // start | instructions
    this.clickHandler = this.handleClick.bind(this);

    // Klick-Events am Canvas registrieren
    this.canvas.addEventListener("click", this.clickHandler);

    this.drawStartScreen();
  }

  // // 🎨 Startbildschirm
  // drawStartScreen() {
  //   this.clear();
  //   this.currentScreen = "start";

  //   this.ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
  //   this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  //   this.ctx.font = "bold 48px Comic Sans MS";
  //   this.ctx.fillStyle = "orange";
  //   this.ctx.textAlign = "center";
  //   this.ctx.fillText("El Pollo Loco", this.canvas.width / 2, 150);

  //   // Start-Button
  //   const startBtn = this.drawButton("Start", this.canvas.width / 2, 240, "#fca534ff");

  //   // Anleitung-Button
  //   const instrBtn = this.drawButton("📖 Anleitung", this.canvas.width / 2, 320, "#fca534ff");

  //   this.buttons = { startBtn, instrBtn };
  // }
//   drawStartScreen() {
//   this.clear();
//   this.currentScreen = "start";

//   const img = new Image();
//   img.src = "img/9_intro_outro_screens/start/startscreen_1.png";

//   img.onload = () => {
//     // Bild auf gesamte Canvasgröße zeichnen
//     this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    

//     // Start-Button
//     const startBtn = this.drawButton("Start", this.canvas.width / 5, 30, "#fca534ff");

//     // Anleitung-Button
//     const instrBtn = this.drawButton("📖 Anleitung", this.canvas.width / 1.3, 30, "#fca534ff");

//     this.buttons = { startBtn, instrBtn };
//   };
// }
drawStartScreen() {
  this.clear();
  this.currentScreen = "start";

  const img = new Image();
  img.src = "img/9_intro_outro_screens/start/startscreen_1.png";

  img.onload = () => {
    // Bild auf gesamte Canvasgröße zeichnen
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

    // 🔹 Start-Text
    this.ctx.font = "32px Comic Sans MS";
    this.ctx.fillStyle = "#fca534"; // Orange passend zum Bild
    this.ctx.textAlign = "left";
    this.ctx.fillText("Start", this.canvas.width / 5, 50);

    // 🔹 Anleitung (nur Icon)
    this.ctx.font = "32px Comic Sans MS";
    this.ctx.fillStyle = "#fca534";
    this.ctx.textAlign = "right";
    this.ctx.fillText("📖", this.canvas.width / 1.2, 50);

    // Klickbereiche speichern (damit handleClick weiß, wo geklickt wurde)
    this.buttons = {
      startBtn: {
        x: this.canvas.width / 5,
        y: 20,
        width: 100,   // grober Klickbereich für Text
        height: 40,
        action: "start",
      },
      instrBtn: {
        x: this.canvas.width / 1.2 - 20,
        y: 20,
        width: 40,    // kleiner Bereich um das Icon
        height: 40,
        action: "instructions",
      },
    };
  };
}

handleClick(event) {
  if (!this.buttons) return;

  const rect = this.canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  Object.values(this.buttons).forEach((btn) => {
    if (
      clickX >= btn.x &&
      clickX <= btn.x + btn.width &&
      clickY >= btn.y &&
      clickY <= btn.y + btn.height
    ) {
      // 🎮 Aktion ausführen
      if (btn.action === "start") {
        startGame(); // deine Spiel-Start-Funktion
      }
      if (btn.action === "instructions") {
        this.drawInstructionsScreen();
      }
    }
  });
}




  // Anleitung
  drawInstructions() {
    this.clear();
    this.currentScreen = "instructions";

    this.ctx.fillStyle = "#fca534ff";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "white";
    this.ctx.font = "32px Comic Sans MS";
    this.ctx.fillText("📖 Anleitung", this.canvas.width / 2, 80);

    const lines = [
      "⬅️ / ➡️ – Bewegung",
      "⬆️ – Springen",
      "D – Flasche werfen",
      "🔊 – Sound ein/aus",
      "🖥️ – Vollbild ein/aus",
    ];

    this.ctx.font = "22px Comic Sans MS";
    lines.forEach((line, i) => {
      this.ctx.fillText(line, this.canvas.width / 2, 160 + i * 40);
    });

    // Zurück-Button
    const backBtn = this.drawButton("Zurück", this.canvas.width / 2, this.canvas.height - 100, "#fca534ff");

    this.buttons = { backBtn };
  }

  // 🔘 Hilfsfunktion: Button zeichnen
  drawButton(text, centerX, y, color) {
    const width = 250;
    const height = 60;
    const x = centerX - width / 2;

    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);

    this.ctx.font = "24px Comic Sans MS";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, centerX, y + 38);

    return { x, y, width, height, text };
  }

  // 🧹 Canvas löschen
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // 🖱️ Klick-Verarbeitung
  handleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    Object.values(this.buttons).forEach((btn) => {
      if (
        mouseX >= btn.x &&
        mouseX <= btn.x + btn.width &&
        mouseY >= btn.y &&
        mouseY <= btn.y + btn.height
      ) {
        this.handleButtonClick(btn.text);
      }
    });
  }

  // 🎯 Aktionen bei Klick
  handleButtonClick(text) {
    if (text.includes("Start")) {
      this.destroy(); // Menü entfernen
      startGame(); // 🚀 Dein Spiel starten
    }
    if (text.includes("Anleitung")) {
      this.drawInstructions();
    }
    if (text.includes("Zurück")) {
      this.drawStartScreen();
    }
  }

  // 🚮 Menü entfernen (z. B. nach Start)
  destroy() {
    this.clear();
    this.canvas.removeEventListener("click", this.clickHandler);
  }
}
