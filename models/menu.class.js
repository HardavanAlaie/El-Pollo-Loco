class Menu {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.buttons = {};
    this.clickHandler = this.handleClick.bind(this);

    this.canvas.addEventListener("click", this.clickHandler);
    this.drawStartScreen();
  }

  /** 🎨 Startbildschirm zeichnen */
  drawStartScreen() {
    this.clear();

    const img = new Image();
    img.src = "img/9_intro_outro_screens/start/startscreen_1.png";

    img.onload = () => {
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

      const startBtn = this.drawButton(
        "Start",
        this.canvas.width / 13,
        40,
        "#fca534ff",
        "start"
      );

      this.buttons = { startBtn };
    };
  }

  /** 🟠 Button zeichnen */
  drawButton(text, x, y, color, action) {
    const ctx = this.ctx;
    ctx.font = "28px Comic Sans MS";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);

    const width = ctx.measureText(text).width + 20; // padding
    const height = 40;

    return this.createButtonArea(x, width, y, height, action);
  }

  /** 📐 Hilfsmethode für Buttonbereich */
  createButtonArea(x, width, y, height, action) {
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

    // 📏 Aktuelle Canvas-BoundingBox ermitteln (auch im Vollbild korrekt)
    const rect = this.canvas.getBoundingClientRect();
    const clientX = event.touches?.[0]?.clientX ?? event.clientX;
    const clientY = event.touches?.[0]?.clientY ?? event.clientY;

    // 🔧 Verhältnis zwischen angezeigtem Canvas und tatsächlicher Logikgröße
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    // 🎯 Exakte Canvas-Koordinaten des Klicks berechnen
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    // ✅ BONUS: Korrektur für horizontale/vertikale Ränder im Vollbild
    const pageWidth = window.innerWidth;
    const pageHeight = window.innerHeight;
    const aspectRatio = this.canvas.width / this.canvas.height;
    const windowRatio = pageWidth / pageHeight;

    let finalX = x,
      finalY = y;

    if (windowRatio > aspectRatio) {
      // Wenn Canvas schmaler → schwarze Ränder links/rechts
      const displayedWidth = pageHeight * aspectRatio;
      const horizontalOffset = (pageWidth - displayedWidth) / 2;
      finalX =
        (clientX - horizontalOffset) * (this.canvas.width / displayedWidth);
    } else if (windowRatio < aspectRatio) {
      // Wenn Canvas höher → schwarze Balken oben/unten
      const displayedHeight = pageWidth / aspectRatio;
      const verticalOffset = (pageHeight - displayedHeight) / 2;
      finalY =
        (clientY - verticalOffset) * (this.canvas.height / displayedHeight);
    }

    // 🧩 Klickprüfung
    Object.values(this.buttons).forEach((btn) => {
      if (
        finalX >= btn.x &&
        finalX <= btn.x + btn.width &&
        finalY >= btn.y &&
        finalY <= btn.y + btn.height
      ) {
        this.handleButtonClick(btn.action);
      }
    });
  }

  /** ▶️ Aktionen der Buttons */
  handleButtonClick(action) {
    if (action === "start") {
      this.destroy();
      startGame();
    }
  }

  /** 🧹 Canvas leeren */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /** 🗑️ Menü entfernen */
  destroy() {
    this.clear();
    this.buttons = {};
    this.canvas.removeEventListener("click", this.clickHandler);
  }
}
