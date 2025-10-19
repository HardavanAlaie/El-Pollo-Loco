/**
 * 🧭 Class: Menu
 * Handles the game's start menu screen, including rendering,
 * button creation, and click handling (supports fullscreen scaling).
 */
class Menu {
  /**
   * Initializes the menu system and draws the start screen.
   * @param {HTMLCanvasElement} canvas - The main game canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context.
   */
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.buttons = {};
    this.clickHandler = this.handleClick.bind(this);

    this.canvas.addEventListener("click", this.clickHandler);
    this.drawStartScreen();
  }

  /**
   * 🎨 Draws the start screen with background and start button.
   */
  drawStartScreen() {
    this.clear();

    const img = new Image();
    img.src = "img/9_intro_outro_screens/start/startscreen_1.png";

    img.onload = () => {
      // Draw background image
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

      // Create a "Start" button
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

  /**
   * 🟠 Draws a single button with text and returns its clickable area.
   * @param {string} text - The text displayed on the button.
   * @param {number} x - The X position of the button.
   * @param {number} y - The Y position of the button.
   * @param {string} color - The color of the button text.
   * @param {string} action - The button's action name.
   * @returns {object} Button hitbox area definition.
   */
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

  /**
   * 📐 Helper function to define button hitbox.
   * @param {number} x - Button center X.
   * @param {number} width - Button width.
   * @param {number} y - Button Y position.
   * @param {number} height - Button height.
   * @param {string} action - Button action type.
   * @returns {object} Object describing button clickable area.
   */
  createButtonArea(x, width, y, height, action) {
    return {
      x: x - width / 2,
      y: y - height / 2,
      width,
      height,
      action,
    };
  }

  /**
   * 🖱️ Handles click/touch events on the canvas.
   * Calculates correct coordinates even in fullscreen or scaled mode.
   */
  handleClick(event) {
    if (!this.buttons) return;

    // Get the current canvas size and position
    const rect = this.canvas.getBoundingClientRect();
    const clientX = event.touches?.[0]?.clientX ?? event.clientX;
    const clientY = event.touches?.[0]?.clientY ?? event.clientY;

    // Scale factors between display size and logical canvas size
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    // Compute actual canvas coordinates
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    // Adjust for black borders (letterboxing in fullscreen)
    const pageWidth = window.innerWidth;
    const pageHeight = window.innerHeight;
    const aspectRatio = this.canvas.width / this.canvas.height;
    const windowRatio = pageWidth / pageHeight;

    let finalX = x,
      finalY = y;

    if (windowRatio > aspectRatio) {
      // Black bars on left/right
      const displayedWidth = pageHeight * aspectRatio;
      const horizontalOffset = (pageWidth - displayedWidth) / 2;
      finalX =
        (clientX - horizontalOffset) * (this.canvas.width / displayedWidth);
    } else if (windowRatio < aspectRatio) {
      // Black bars on top/bottom
      const displayedHeight = pageWidth / aspectRatio;
      const verticalOffset = (pageHeight - displayedHeight) / 2;
      finalY =
        (clientY - verticalOffset) * (this.canvas.height / displayedHeight);
    }

    // Check if the click is inside a button hitbox
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

  /**
   * ▶️ Executes the action assigned to a button.
   * @param {string} action - The button's action identifier.
   */
  handleButtonClick(action) {
    if (action === "start") {
      this.destroy();
      startGame();
    }
  }

  /**
   * 🧹 Clears the entire canvas area.
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 🗑️ Removes menu event listeners and clears buttons.
   */
  destroy() {
    this.clear();
    this.buttons = {};
    this.canvas.removeEventListener("click", this.clickHandler);
  }
}
