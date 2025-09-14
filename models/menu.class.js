// class Menu {
//   constructor(canvas, ctx) {
//     this.canvas = canvas;
//     this.ctx = ctx;
//     this.buttons = {};
//     this.currentScreen = "start"; // start | instructions
//     this.clickHandler = this.handleClick.bind(this);

//     // Klick-Events am Canvas registrieren
//     this.canvas.addEventListener("click", this.clickHandler);

//     this.drawStartScreen();
//   }

//   // // 🎨 Startbildschirm
//   // drawStartScreen() {
//   //   this.clear();
//   //   this.currentScreen = "start";

//   //   this.ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
//   //   this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

//   //   this.ctx.font = "bold 48px Comic Sans MS";
//   //   this.ctx.fillStyle = "orange";
//   //   this.ctx.textAlign = "center";
//   //   this.ctx.fillText("El Pollo Loco", this.canvas.width / 2, 150);

//   //   // Start-Button
//   //   const startBtn = this.drawButton("Start", this.canvas.width / 2, 240, "#fca534ff");

//   //   // Anleitung-Button
//   //   const instrBtn = this.drawButton("📖 Anleitung", this.canvas.width / 2, 320, "#fca534ff");

//   //   this.buttons = { startBtn, instrBtn };
//   // }
// //   drawStartScreen() {
// //   this.clear();
// //   this.currentScreen = "start";

// //   const img = new Image();
// //   img.src = "img/9_intro_outro_screens/start/startscreen_1.png";

// //   img.onload = () => {
// //     // Bild auf gesamte Canvasgröße zeichnen
// //     this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    

// //     // Start-Button
// //     const startBtn = this.drawButton("Start", this.canvas.width / 5, 30, "#fca534ff");

// //     // Anleitung-Button
// //     const instrBtn = this.drawButton("📖 Anleitung", this.canvas.width / 1.3, 30, "#fca534ff");

// //     this.buttons = { startBtn, instrBtn };
// //   };
// // }
// // drawStartScreen() {
// //   this.clear();
// //   this.currentScreen = "start";

// //   const img = new Image();
// //   img.src = "img/9_intro_outro_screens/start/startscreen_1.png";

// //   img.onload = () => {
// //     // Bild auf gesamte Canvasgröße zeichnen
// //     this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

// //     // 🔹 Start-Text
// //     this.ctx.font = "32px Comic Sans MS";
// //     this.ctx.fillStyle = "#fca534"; // Orange passend zum Bild
// //     this.ctx.textAlign = "left";
// //     this.ctx.fillText("Start", this.canvas.width / 5, 50);

// //     // 🔹 Anleitung (nur Icon)
// //     this.ctx.font = "32px Comic Sans MS";
// //     this.ctx.fillStyle = "#fca534";
// //     this.ctx.textAlign = "right";
// //     this.ctx.fillText("📖", this.canvas.width / 1.2, 50);

// //     // Klickbereiche speichern (damit handleClick weiß, wo geklickt wurde)
// //     this.buttons = {
// //       startBtn: {
// //         x: this.canvas.width / 5,
// //         y: 20,
// //         width: 100,   // grober Klickbereich für Text
// //         height: 40,
// //         action: "start",
// //       },
// //       instrBtn: {
// //         x: this.canvas.width / 1.2 - 20,
// //         y: 20,
// //         width: 40,    // kleiner Bereich um das Icon
// //         height: 40,
// //         action: "instructions",
// //       },
// //     };
// //   };
// // }
// // drawStartScreen() {
// //   this.clear();
// //   this.currentScreen = "start";

// //   const img = new Image();
// //   img.src = "img/9_intro_outro_screens/start/startscreen_1.png";

// //   img.onload = () => {
// //     // Hintergrundbild zeichnen
// //     this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

// //     // Start-Bereich (nur Text)
// //     const startBtn = this.drawButton("Start", this.canvas.width / 5, 30, "#fca534ff");
// //     startBtn.action = "start";   // 👈 wichtig!

// //     // Anleitung-Bereich (nur Icon 📖)
// //     const instrBtn = this.drawButton("📖", this.canvas.width / 1.3, 30, "#fca534ff");
// //     instrBtn.action = "instructions"; // 👈 wichtig!

// //     this.buttons = { startBtn, instrBtn };
// //   };
// // }
// drawStartScreen() {
//   this.clear();
//   this.currentScreen = "start";

//   const img = new Image();
//   img.src = "img/9_intro_outro_screens/start/startscreen_1.png";

//   img.onload = () => {
//     this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

//     // Start (nur Text)
//     const startBtn = this.drawButton("Start", this.canvas.width / 5, 30, "#fca534ff", "start");

//     // Anleitung (nur Icon 📖)
//     const instrBtn = this.drawButton("📖", this.canvas.width / 1.3, 30, "#fca534ff", "instructions");

//     this.buttons = { startBtn, instrBtn };
//   };
// }



// handleClick(event) {
//   if (!this.buttons) return;

//   const rect = this.canvas.getBoundingClientRect();
//   const clickX = event.clientX - rect.left;
//   const clickY = event.clientY - rect.top;

//   Object.values(this.buttons).forEach((btn) => {
//     if (
//       clickX >= btn.x &&
//       clickX <= btn.x + btn.width &&
//       clickY >= btn.y &&
//       clickY <= btn.y + btn.height
//     ) {
//       // 🎮 Aktion ausführen
//       if (btn.action === "start") {
//         startGame(); // deine Spiel-Start-Funktion
//       }
//       if (btn.action === "instructions") {
//         this.drawInstructionsScreen();
//       }
//     }
//   });
// }





//   // Anleitung
//   drawInstructions() {
//     this.clear();
//     this.currentScreen = "instructions";

//     this.ctx.fillStyle = "#fca534ff";
//     this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

//     this.ctx.fillStyle = "white";
//     this.ctx.font = "32px Comic Sans MS";
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

//     // Zurück-Button
//     const backBtn = this.drawButton("Zurück", this.canvas.width / 2, this.canvas.height - 100, "#fca534ff");

//     this.buttons = { backBtn };
//   }

//   // // 🔘 Hilfsfunktion: Button zeichnen
//   // drawButton(text, centerX, y, color) {
//   //   const width = 250;
//   //   const height = 60;
//   //   const x = centerX - width / 2;

//   //   this.ctx.fillStyle = color;
//   //   this.ctx.fillRect(x, y, width, height);

//   //   this.ctx.font = "24px Comic Sans MS";
//   //   this.ctx.fillStyle = "white";
//   //   this.ctx.textAlign = "center";
//   //   this.ctx.fillText(text, centerX, y + 38);

//   //   return { x, y, width, height, text };
//   // }
//   drawButton(text, x, y, color, action) {
//   const ctx = this.ctx;
//   const paddingX = 20;
//   const paddingY = 15;

//   ctx.font = "28px Comic Sans MS";
//   ctx.fillStyle = color;
//   ctx.textAlign = "center";

//   // Text zeichnen
//   ctx.fillText(text, x, y);

//   // Klickbereich berechnen
//   const textMetrics = ctx.measureText(text);
//   const width = textMetrics.width + paddingX;
//   const height = 40; // feste Höhe

//   return {
//     x: x - width / 2,
//     y: y - height / 2,
//     width: width,
//     height: height,
//     action: action // 👈 direkt hier speichern!
//   };
// }


//   // 🧹 Canvas löschen
//   clear() {
//     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//   }

//   // 🖱️ Klick-Verarbeitung
//   handleClick(event) {
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
//         this.handleButtonClick(btn.text);
//       }
//     });
//   }

//   // 🎯 Aktionen bei Klick
//   handleButtonClick(text) {
//     if (text.includes("Start")) {
//       this.destroy(); // Menü entfernen
//       startGame(); // 🚀 Dein Spiel starten
//     }
//     if (text.includes("Anleitung")) {
//       this.drawInstructions();
//     }
//     if (text.includes("Zurück")) {
//       this.drawStartScreen();
//     }
//   }

//   // 🚮 Menü entfernen (z. B. nach Start)
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
    this.currentScreen = "start"; 
    this.clickHandler = this.handleClick.bind(this);

    this.canvas.addEventListener("click", this.clickHandler);

    this.drawStartScreen();
  }

  // drawStartScreen() {
  //   this.clear();
  //   this.currentScreen = "start";

  //   const img = new Image();
  //   img.src = "img/9_intro_outro_screens/start/startscreen_1.png";

  //   img.onload = () => {
  //     this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

  //     const startBtn = this.drawButton("Start", this.canvas.width / 5, 30, "#fca534ff", "start");
  //     const instrBtn = this.drawButton("📖", this.canvas.width / 1.3, 30, "#fca534ff", "instructions");

  //     this.buttons = { startBtn, instrBtn };
  //   };
  // }
//   drawStartScreen() {
//   this.clear();
//   this.currentScreen = "start";

//   const img = new Image();
//   img.src = "img/9_intro_outro_screens/start/startscreen_1.png";

//   img.onload = () => {
//     this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

//     // 📌 Beide Buttons rechts oben nebeneinander platzieren
//     const padding = 20; // Abstand vom Rand
//     const buttonSpacing = 80; // Abstand zwischen den Buttons

//     // Start-Text
//     const startBtn = this.drawButton("Start", this.canvas.width - padding - buttonSpacing, 40, "#fca534ff", "start");

//     // Anleitung-Icon 📖
//     const instrBtn = this.drawButton("📖", this.canvas.width - padding, 40, "#fca534ff", "instructions");

//     this.buttons = { startBtn, instrBtn };
//   };
// }
drawStartScreen() {
  this.clear();
  this.currentScreen = "start";

  const img = new Image();
  img.src = "img/9_intro_outro_screens/start/startscreen_1.png";

  img.onload = () => {
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

    // 📌 Buttons rechts oben platzieren
    const padding = 20;      // Abstand vom Rand
    const buttonSpacing = 80; // Abstand zwischen Buttons
    const baseY = 40;        // Y-Position (alle auf gleicher Höhe)

    // Start
    const startBtn = this.drawButton("Start", this.canvas.width - padding - buttonSpacing * 3, baseY, "#fca534ff", "start");

    // Anleitung (📖)
    const instrBtn = this.drawButton("📖", this.canvas.width - padding - buttonSpacing * 2, baseY, "#fca534ff", "instructions");

    // Vollbild (🖥️)
    const fullscreenBtn = this.drawButton("🖥️", this.canvas.width - padding - buttonSpacing, baseY, "#fca534ff", "fullscreen");

    // Sound (🔊)
    const soundBtn = this.drawButton("🔊", this.canvas.width - padding, baseY, "#fca534ff", "sound");

    this.buttons = { startBtn, instrBtn, fullscreenBtn, soundBtn };
  };
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
        this.handleButtonClick(btn.action); // 👈 jetzt action übergeben
      }
    });
  }

  // 🎯 Aktionen bei Klick
  handleButtonClick(action) {
    if (action === "start") {
      this.destroy();
      startGame(); 
    }
    if (action === "instructions") {
      this.drawInstructions();
    }
    if (action === "back") {
      this.drawStartScreen();
    }
  }

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

    // Zurück
    const backBtn = this.drawButton("Zurück", this.canvas.width / 2, this.canvas.height - 100, "#fffafaff", "back");

    this.buttons = { backBtn };
  }

  drawButton(text, x, y, color, action) {
    const ctx = this.ctx;
    const paddingX = 20;
    const paddingY = 15;

    ctx.font = "28px Comic Sans MS";
    ctx.fillStyle = color;
    ctx.textAlign = "center";

    ctx.fillText(text, x, y);

    const textMetrics = ctx.measureText(text);
    const width = textMetrics.width + paddingX;
    const height = 40;

    return {
      x: x - width / 2,
      y: y - height / 2,
      width: width,
      height: height,
      action: action // ✅ gespeichert
    };
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  destroy() {
    this.clear();
    this.canvas.removeEventListener("click", this.clickHandler);
  }
}
