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
        mouseX >= btn.x &&
        mouseX <= btn.x + btn.width &&
        mouseY >= btn.y &&
        mouseY <= btn.y + btn.height
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
