/**
 * Handles canvas input, mobile controls and coordinate mapping.
 *
 * @class UiInputManager
 */
class UiInputManager {
  /**
   * @param {World} world - Reference to the game world instance.
   */
  constructor(world) {
    this.world = world;
    this.uiClickListenerAdded = false;
  }

  /**
   * Sets up touch / pointer controls for mobile gameplay.
   * Converts screen coordinates into logical canvas coordinates.
   */
  setupCanvasControls() {
    const w = this.world;
    if (this.uiClickListenerAdded) return;
    this.uiClickListenerAdded = true;

    const handleDown = (e) => {
      if (e.cancelable) e.preventDefault();
      const { x, y } = this.getCanvasCoordinates(e);
      this.keyboardInsidebuttonMethod(x, y);
    };
    const handleUp = this.handleUpMethod();
    this.touchButtonsMethod(handleDown, handleUp);
  }

  /**
   * Attaches touch, pointer, and mouse event listeners to the canvas
   * for handling on-screen control buttons (mobile-friendly input).
   */
  touchButtonsMethod(handleDown, handleUp) {
    const canvas = this.world.canvas;
    ["pointerdown", "touchstart", "mousedown"].forEach((t) =>
      canvas.addEventListener(t, handleDown, { passive: false })
    );
    ["pointerup", "touchend", "mouseup", "touchcancel"].forEach((t) =>
      canvas.addEventListener(t, handleUp)
    );
  }

  /**
   * Checks if a given touch or click position is inside one of the on-screen
   * control buttons and updates keyboard state accordingly.
   */
  keyboardInsidebuttonMethod(x, y) {
    const w = this.world;
    w.keyboard.LEFT = this.isInsideButton(x, y, w.leftBtnArea);
    w.keyboard.RIGHT = this.isInsideButton(x, y, w.rightBtnArea);
    w.keyboard.UP = this.isInsideButton(x, y, w.jumpBtnArea);
    w.keyboard.D = this.isInsideButton(x, y, w.throwBtnArea);
  }

  /**
   * Returns a reusable function that resets all virtual key states
   * (used for mobile button release handling).
   */
  handleUpMethod() {
    const w = this.world;
    return () => {
      w.keyboard.LEFT = false;
      w.keyboard.RIGHT = false;
      w.keyboard.UP = false;
      w.keyboard.D = false;
    };
  }

  /**
   * Draws a visual debug indicator as a red semi-transparent circle.
   */
  debugIndicatorMethod(x, y) {
    const ctx = this.world.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,0,0,0.6)";
    ctx.fill();
    ctx.restore();
  }

  /** Updates cached canvas bounding box for accurate input scaling. */
  updateCanvasRect() {
    this.world.canvasRect = this.world.canvas.getBoundingClientRect();
  }

  /**
   * Converts click or touch event into logical canvas coordinates,
   * accounting for scaling and fullscreen offsets.
   */
  getCanvasCoordinates(e) {
    const w = this.world;
    if (!w.canvasRect) this.updateCanvasRect();
    const { clientX, y, x } = this.canvasCoordinatesMethod(e);
    const { windowRatio, aspectRatio, pageHeight, pageWidth } = this.windowWidthHeightMethod();
    if (windowRatio > aspectRatio) {
      const displayedWidth = pageHeight * aspectRatio;
      const horizontalOffset = (pageWidth - displayedWidth) / 2;
      return {
        x: (clientX - horizontalOffset) * (w.canvas.width / displayedWidth),
        y,
      };
    }
    return { x, y };
  }

  /**
   * Converts a touch or mouse event position to accurate canvas coordinates.
   */
  canvasCoordinatesMethod(e) {
    const w = this.world;
    const rect = w.canvasRect;
    const scaleX = w.canvas.width / rect.width;
    const scaleY = w.canvas.height / rect.height;
    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;
    const offsetX = rect.left;
    const offsetY = rect.top;
    const x = (clientX - offsetX) * scaleX;
    const y = (clientY - offsetY) * scaleY;
    return { clientX, y, x };
  }

  /**
   * Retrieves window and canvas aspect ratio information.
   */
  windowWidthHeightMethod() {
    const w = this.world.canvas;
    const pageWidth = window.innerWidth;
    const pageHeight = window.innerHeight;
    const aspectRatio = w.width / w.height;
    const windowRatio = pageWidth / pageHeight;
    return { windowRatio, aspectRatio, pageHeight, pageWidth };
  }

  /**
   * Returns true on mobile/tablet (coarse pointer) or small viewports.
   */
  isMobileOrTablet() {
    const isCoarsePointer =
      window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    const isNarrowScreen = window.innerWidth <= 1024;
    return isCoarsePointer || isNarrowScreen;
  }

  /**
   *  Draws on-screen circular control buttons for mobile users.
   * Includes movement, jump, and throw controls.
   */
  drawMobileControls() {
    if (!this.isMobileOrTablet()) {
      return this.ifIsMobileOrTabletMethod();
    }
    const { margin, h, size, w, ctx } = this.drawMobileControlsConstsMethod();
    this.drawMobileControlsBtnAreaMethod(margin, h, size, w);
    const world = this.world;
    [
      world.leftBtnArea,
      world.rightBtnArea,
      world.jumpBtnArea,
      world.throwBtnArea,
    ].forEach((b) => {this.forEachMethod(ctx, b);});
  }

  /**
   * Draws a circular button background + delegates label drawing.
   */
  forEachMethod(ctx, b) {
    ctx.save();
    ctx.fillStyle = "#fca534ff";
    ctx.beginPath();
    ctx.arc(
      b.x + b.width / 2,
      b.y + b.height / 2,
      b.width / 2,
      0,
      Math.PI * 2
    );
    this.forEachMethodCtxMethod(ctx, b);
  }

  /**
   * Completes the drawing of a circular button and text.
   */
  forEachMethodCtxMethod(ctx, b) {
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = `${Math.floor(b.width / 2)}px Comic Sans MS`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(b.label, b.x + b.width / 2, b.y + b.height / 2);
    ctx.restore();
  }

  /**
   * Defines the button areas for mobile controls.
   */
  drawMobileControlsBtnAreaMethod(margin, h, size, w) {
    const world = this.world;
    world.leftBtnArea = {x: margin, y: h - size - margin, width: size, height: size, label: "⬅️",};
    world.rightBtnArea = {x: margin + size + 20, y: h - size - margin, width: size, height: size, label: "➡️",};
    world.jumpBtnArea = {x: w - size * 2 - 40, y: h - size - margin, width: size, height: size, label: "⤴️",};
    world.throwBtnArea = {x: w - size - margin, y: h - size - margin, width: size, height: size, label: "🧴",};
  }

  /**
   * Provides constants for drawing mobile controls.
   */
  drawMobileControlsConstsMethod() {
    const ctx = this.world.ctx;
    const w = this.world.canvas.width;
    const h = this.world.canvas.height;
    const size = 60;
    const margin = 20;
    return { margin, h, size, w, ctx };
  }

  /**
   * Disables mobile control areas for non-mobile devices.
   */
  ifIsMobileOrTabletMethod() {
    const world = this.world;
    world.leftBtnArea = null;
    world.rightBtnArea = null;
    world.jumpBtnArea = null;
    world.throwBtnArea = null;
    return;
  }

  /**
   * Utility: checks if a point (x,y) is inside a button’s area.
   */
  isInsideButton(x, y, b) {
    return (
      b && x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height
    );
  }

  /**
   * Shows a short message if the player tries to collect more bottles than allowed.
   */
  showBottleLimitMessage() {
    const w = this.world;
    w.bottleLimitMessage = "Bottle limit reached!";
    clearTimeout(w.bottleLimitTimeout);
    w.bottleLimitTimeout = setTimeout(
      () => (w.bottleLimitMessage = ""),
      2000
    );
  }
}
