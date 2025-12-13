/**
 * ------------------------------------------------------------
 * Adds a polyfill for CanvasRenderingContext2D.roundRect if the
 * method does not exist. Creates a rounded rectangle path using
 * quadratic curves while clamping the radius to valid limits.
 *
 * @function CanvasRenderingContext2D.roundRect
 * @param {number} x - The x-coordinate of the rectangle.
 * @param {number} y - The y-coordinate of the rectangle.
 * @param {number} w - Width of the rectangle.
 * @param {number} h - Height of the rectangle.
 * @param {number} r - Corner radius for all corners.
 * @returns {CanvasRenderingContext2D} Context for chaining.
 * ------------------------------------------------------------
 */
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    this.beginPath();
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    this.closePath();
    return this;
  };
}

/**
 * Class: Menu
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
    this.hoverHandler = this.handleHover.bind(this);
    this.canvas.addEventListener("click", this.clickHandler);
    this.canvas.addEventListener("mousemove", this.hoverHandler);
    this.drawStartScreen();
  }

  /**
   * Draws the start screen with background and start button.
   */
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
      this.drawImpressumButton();
    };
  }

  /**
   * Draws a single button with text and returns its clickable area.
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
    const width = ctx.measureText(text).width + 20; 
    const height = 40;
    return this.createButtonArea(x, width, y, height, action);
  }

  /**
   * Helper function to define button hitbox.
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
   * Handles click/touch events on the canvas.
   * Calculates correct coordinates even in fullscreen or scaled mode.
   */
  handleClick(event) {
    if (!this.buttons) return;
    const {x, y, windowRatio, aspectRatio, pageHeight, pageWidth, clientX, clientY, } = this.handleClickVars(event);
    let finalX = x,
        finalY = y;
    ({ finalX, finalY } = this.horizontalVerticalOffset(windowRatio, aspectRatio, pageHeight, pageWidth, finalX, clientX, finalY, clientY));
    this.buttonHitbox(finalX, finalY);
    this.impressumBtnAreaMethod(x, y);
  }

/**
 * ------------------------------------------------------------
 * Checks whether the user clicked inside the Impressum button
 * hitbox and triggers the Impressum overlay if available.
 *
 * @function impressumBtnAreaMethod
 * @param {number} x - Scaled x-coordinate of the click.
 * @param {number} y - Scaled y-coordinate of the click.
 * ------------------------------------------------------------
 */
  impressumBtnAreaMethod(x, y) {
    if (this.impressumBtnArea &&
      x >= this.impressumBtnArea.x &&
      x <= this.impressumBtnArea.x + this.impressumBtnArea.width &&
      y >= this.impressumBtnArea.y &&
      y <= this.impressumBtnArea.y + this.impressumBtnArea.height) {
      if (typeof showImpressum === "function") {
        showImpressum();
      }
    }
  }

/**
 * ------------------------------------------------------------
 * Extracts and returns click-related variables required for
 * coordinate scaling and button interaction handling.
 *
 * @function handleClickVars
 * @param {MouseEvent|TouchEvent} event
 * @returns {object}
 * ------------------------------------------------------------
 */
  handleClickVars(event) {
    const { x, y, windowRatio, aspectRatio, pageHeight, pageWidth, clientX, clientY } = this.handleClickVarsConstsMethod(event);
    return {
      x,
      y,
      windowRatio,
      aspectRatio,
      pageHeight,
      pageWidth,
      clientX,
      clientY,
    };
  }

/**
 * ------------------------------------------------------------
 * Computes raw and scaled click coordinates from mouse or touch
 * events, including canvas scaling factors and window ratios.
 *
 * @function handleClickVarsConstsMethod
 * @param {MouseEvent|TouchEvent} event
 * @returns {object}
 * ------------------------------------------------------------
 */
  handleClickVarsConstsMethod(event) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = event.touches?.[0]?.clientX ?? event.clientX;
    const clientY = event.touches?.[0]?.clientY ?? event.clientY;
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    const pageWidth = window.innerWidth;
    const pageHeight = window.innerHeight;
    const aspectRatio = this.canvas.width / this.canvas.height;
    const windowRatio = pageWidth / pageHeight;
    return { x, y, windowRatio, aspectRatio, pageHeight, pageWidth, clientX, clientY };
  }

 /**
 * ------------------------------------------------------------
 * Checks whether the clicked position intersects with any
 * button hitbox and triggers the associated button action.
 *
 * @function buttonHitbox
 * @param {number} finalX - Adjusted x-coordinate of the click.
 * @param {number} finalY - Adjusted y-coordinate of the click.
 * ------------------------------------------------------------
 */
  buttonHitbox(finalX, finalY) {
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
 * ------------------------------------------------------------
 * Adjusts click coordinates for horizontal or vertical letterboxing
 * depending on the window-to-canvas aspect ratio mismatch.
 *
 * @function horizontalVerticalOffset
 * @param {number} windowRatio
 * @param {number} aspectRatio
 * @param {number} pageHeight
 * @param {number} pageWidth
 * @param {number} finalX - Current x coordinate (will be recalculated).
 * @param {number} clientX - Raw clientX from the event.
 * @param {number} finalY - Current y coordinate (will be recalculated).
 * @param {number} clientY - Raw clientY from the event.
 * @returns {{ finalX: number, finalY: number }}
 * ------------------------------------------------------------
 */
  horizontalVerticalOffset(windowRatio, aspectRatio, pageHeight, pageWidth, finalX, clientX, finalY, clientY) {
    if (windowRatio > aspectRatio) {
      const displayedWidth = pageHeight * aspectRatio;
      const horizontalOffset = (pageWidth - displayedWidth) / 2;
      finalX =
        (clientX - horizontalOffset) * (this.canvas.width / displayedWidth);
    } else if (windowRatio < aspectRatio) {
      const displayedHeight = pageWidth / aspectRatio;
      const verticalOffset = (pageHeight - displayedHeight) / 2;
      finalY =
        (clientY - verticalOffset) * (this.canvas.height / displayedHeight);
    }
    return { finalX, finalY };
  }

  /**
   * Executes the action assigned to a button.
   * @param {string} action - The button's action identifier.
   */
  handleButtonClick(action) {
    if (action === "start") {
      this.destroy();
      startGame();
    }
  }

  /**
   * Changes the mouse cursor to a pointer when hovering over the start button.
   */
  handleHover(event) {
    const { x, y } = this.handleHoverConstsMethod(event);
    let over = false;
    if (this.buttons) {
      over = this.ifHandleHoverMethod(over, x, y);
    }
    if (!over && this.impressumBtnArea) {
      const b = this.impressumBtnArea;
      over = x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height;
    }
    this.canvas.style.cursor = over ? "pointer" : "default";
  }

/**
 * Determines whether the mouse cursor is hovering over any
 * registered button based on scaled canvas coordinates.
 *
 * @function ifHandleHoverMethod
 * @param {boolean} over - Previous hover state.
 * @param {number} x - Scaled x-coordinate of the pointer.
 * @param {number} y - Scaled y-coordinate of the pointer.
 * @returns {boolean}
 */
  ifHandleHoverMethod(over, x, y) {
    over = Object.values(this.buttons).some((btn) => x >= btn.x &&
      x <= btn.x + btn.width &&
      y >= btn.y &&
      y <= btn.y + btn.height
    );
    return over;
  }

/**
 * Converts raw mouse event coordinates into canvas-scaled
 * coordinates for hover detection.
 *
 * @function handleHoverConstsMethod
 * @param {MouseEvent} event
 * @returns {{ x: number, y: number }}
 */
  handleHoverConstsMethod(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    return { x, y };
  }

  /**
   * Clears the entire canvas area.
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Removes menu event listeners and clears buttons.
   */
  destroy() {
    this.clear();
    this.buttons = {};
    this.canvas.removeEventListener("click", this.clickHandler);
    this.canvas.removeEventListener("mousemove", this.hoverHandler);
    this.canvas.style.cursor = "default";
  }

/**
 * Draws the Impressum button on the canvas and stores its
 * active hitbox area for click interaction.
 *
 * @function drawImpressumButton
 */
  drawImpressumButton() {
    const { x, y, btnWidth, btnHeight, ctx } = this.drawImpressumButtonConstsMethod(); 
    this.impressumBtnArea = { x, y, width: btnWidth, height: btnHeight };
    ctx.save();
    ctx.fillStyle = "#fca534ff";
    ctx.roundRect(x, y, btnWidth, btnHeight, 12);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "20px Comic Sans MS";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Impressum", x + btnWidth / 2, y + btnHeight / 2);
    ctx.restore();
  }

/**
 * Provides layout values and rendering context required
 * to draw the Impressum button on the canvas.
 *
 * @function drawImpressumButtonConstsMethod
 * @returns {{ x: number, y: number, btnWidth: number, btnHeight: number, ctx: CanvasRenderingContext2D }}
 */
  drawImpressumButtonConstsMethod() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const btnWidth = 150;
    const btnHeight = 40;
    const x = (w - btnWidth) / 2;
    const y = h - btnHeight - 20;
    return { x, y, btnWidth, btnHeight, ctx };
  }
}
