/**
 * ------------------------------------------------------------
 * Handles win & game over screens, overlays and restart button.
 *
 * @class EndScreenManager
 * ------------------------------------------------------------
 */
class EndScreenManager {
  /**
   * @param {World} world - Reference to the game world instance.
   */
  constructor(world) {
    this.world = world;
    this.restartPulseId = null;
    this.restartHoverListenerAdded = false;
    this.canvasClickListenerAdded = false;
    this.handleRestartHoverBound = null;
  }

  /** Displays the victory screen and plays win music. */
  showWinScreen() {
    const w = this.world;
    if (w._winShown) return;
    w._winShown = true;
    w._gameOverPlayed = true;
    w.stopGameLoopHard(true);
    w.audioManager.stopAllSounds();
    w.audioManager.setBackgroundMusic("audio/win.mp3", true);
    this.fadeOverlay(0.3);
    this.drawEndScreen("img/You won, you lost/You win B.png", "#fca534ff");
  }

  /** Displays the game over screen. */
  showGameOverScreen() {
    const w = this.world;
    if (w._gameOverPlayed) return;
    w._gameOverPlayed = true;
    w._winShown = true;
    w.stopGameLoopHard(false);
    w.audioManager.hardStopEnemyAudio();
    w.audioManager.stopAllSounds();
    w.audioManager.setBackgroundMusic("audio/gameover.mp3", false);
    this.fadeOverlay(0.8);
    this.drawEndScreen("img/You won, you lost/Game Over.png", "#fca534ff");
  }

  /** Draws a transparent overlay to darken the screen. */
  fadeOverlay(alpha = 0.2) {
    const w = this.world;
    w.ctx.setTransform(1, 0, 0, 1, 0, 0);
    w.ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    w.ctx.fillRect(0, 0, w.canvas.width, w.canvas.height);
  }

  /**
   * Draws either the win or game-over screen with a restart button.
   */
  drawEndScreen(imgSrc, btnColor) {
    const w = this.world;
    const ctx = w.ctx;
    const canvas = w.canvas;
    const img = new Image();
    img.src = imgSrc;
    this.imgOnload(img, canvas, ctx, btnColor);
  }

 /**
 * Loads the end-screen image and draws it once available,
 * then triggers rendering of the restart button.
 */
  imgOnload(img, canvas, ctx, btnColor) {
    img.onload = () => {
      const scale = Math.min(
        (canvas.width * 0.6) / img.width,
        (canvas.height * 0.3) / img.height
      );
      const w = img.width * scale;
      const h = img.height * scale;
      this.drawImageMethod(ctx, img, canvas, w, h);
      this.drawRestartButton(btnColor);
    };
  }

 /**
 * Draws the end-screen image centered on the canvas,
 * slightly above the vertical midpoint.
 */
  drawImageMethod(ctx, img, canvas, w, h) {
    ctx.drawImage(
      img,
      canvas.width / 2 - w / 2,
      canvas.height / 2 - h - 40,
      w,
      h
    );
  }

  /**
   * Draws and animates the restart button shown after win or game over.
   * @param {string} color - Button background color.
   */
  drawRestartButton(color) {
    const w = this.world;
    const { ctx, x, y, width, height, canvas } = this.drawRestartButtonConstsMethod();
    const animatePulse = () => {
      this.ifLevelEndedMethod(ctx, x, y, width, height, color, canvas, animatePulse);
    };
    animatePulse();
    w.restartButtonArea = { x, y, width, height };
    if (!this.restartHoverListenerAdded) {
      this.ifRestartHoverListenerAddedMethod(canvas);
    }
    if (!this.canvasClickListenerAdded) {
      this.ifCanvasClickListenerAddedMethod(canvas);
    }
  }

  /**
 * Computes and returns layout constants required
 * to draw the restart button on the end screen.
 */
  drawRestartButtonConstsMethod() {
    const w = this.world;
    const ctx = w.ctx;
    const canvas = w.canvas;
    const width = 250;
    const height = 60;
    const x = canvas.width / 2 - width / 2;
    const y = canvas.height / 2;
    return { ctx, x, y, width, height, canvas };
  }

  /**
 * Registers all click and pointer event listeners
 * required to detect presses on the restart button.
 */
  ifCanvasClickListenerAddedMethod(canvas) {
    const boundHandler = this.handleRestartClick.bind(this);
    canvas.addEventListener("click", boundHandler);
    canvas.addEventListener("touchstart", boundHandler, { passive: false });
    canvas.addEventListener("pointerdown", boundHandler);
    this.canvasClickListenerAdded = true;
  }

  /**
 * Registers the hover listener used to show pointer feedback
 * when the cursor moves over the restart button area.
 */
  ifRestartHoverListenerAddedMethod(canvas) {
    this.handleRestartHoverBound = this.handleRestartHover.bind(this);
    canvas.addEventListener("mousemove", this.handleRestartHoverBound);
    this.restartHoverListenerAdded = true;
  }

  /**
 * Handles the restart button animation loop if the level has ended,
 * and stops the animation when the game is no longer in an end state.
 */
  ifLevelEndedMethod(ctx, x, y, w, h, color, canvas, animatePulse) {
    const world = this.world;
    if (world.levelEnded) {
      this.ifLevelEndedCtxMethod(ctx, x, y, w, h);
      this.mainRestartButtonMethod(ctx, color, x, y, w, h, canvas);
      this.restartPulseId = requestAnimationFrame(animatePulse);
    } else {
      if (this.restartPulseId) {
        cancelAnimationFrame(this.restartPulseId);
        this.restartPulseId = null;
      }
    }
  }

  /**
 * Draws the animated glowing background behind the restart button,
 * used only during win or game-over screens.
 */
  ifLevelEndedCtxMethod(ctx, x, y, w, h) {
    ctx.save();
    ctx.globalAlpha = 0.2 + Math.sin(Date.now() / 400) * 0.2;
    ctx.fillStyle = "#c07512ff";
    ctx.beginPath();
    ctx.roundRect(x - 5, y - 5, w + 10, h + 10, 10);
    ctx.fill();
    ctx.restore();
  }

  /**
 * Draws the main restart button on the end screen,
 * including background and centered label text.
 */
  mainRestartButtonMethod(ctx, color, x, y, w, h, canvas) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.font = "24px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Restart Game", canvas.width / 2, y + 38);
  }

  /**
 * Handles click or touch input on the restart button
 * and triggers the restart action when clicked inside its hitbox.
 */
  handleRestartClick(e) {
    const world = this.world;
    const rect = world.canvas.getBoundingClientRect();
    const { btn, x, y } = this.handleRestartClickConstsMethod(rect, e);
    if (!btn) return;
    const inside =
      x >= btn.x &&
      x <= btn.x + btn.width &&
      y >= btn.y &&
      y <= btn.y + btn.height;
    if (inside) {
      this._onRestartButtonPressed();
    }
  }

  /**
 * Converts raw click or touch coordinates into canvas-scaled values
 * and returns them alongside the restart button's hitbox.
 */
  handleRestartClickConstsMethod(rect, e) {
    const world = this.world;
    const scaleX = world.canvas.width / rect.width;
    const scaleY = world.canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const btn = world.restartButtonArea;
    return { btn, x, y };
  }

  /**
 * Handles hover detection over the restart button
 * and updates the cursor appearance accordingly.
 */
  handleRestartHover(event) {
    const world = this.world;
    if (!world.restartButtonArea) {
      world.canvas.style.cursor = "default";
      return;
    }
    const rect = world.canvas.getBoundingClientRect();
    const { x, y } = this.scaleXYMethod(rect, event);
    const inside =
      x >= world.restartButtonArea.x &&
      x <= world.restartButtonArea.x + world.restartButtonArea.width &&
      y >= world.restartButtonArea.y &&
      y <= world.restartButtonArea.y + world.restartButtonArea.height;
    world.canvas.style.cursor = inside ? "pointer" : "default";
  }

  /**
 * Scales raw pointer coordinates into canvas coordinate space
 * based on the current rendering and viewport size.
 */
  scaleXYMethod(rect, event) {
    const world = this.world;
    const scaleX = world.canvas.width / rect.width;
    const scaleY = world.canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    return { x, y };
  }

  /**
 * Executes all cleanup and UI reset steps required when the
 * restart button is pressed, then triggers the game restart.
 */
  _onRestartButtonPressed() {
    const w = this.world;
    this.stopRestartButtonUI();
    w.audioManager.stopAllSounds();
    w.stopGameLoopHard();
    w._winShown = false;
    w._gameOverPlayed = false;
    setTimeout(() => restartGame(), 300);
  }

  /**
   * Stops the restart button animation and removes hover state.
   */
  stopRestartButtonAnimation() {
    if (this.restartPulseId) {
      cancelAnimationFrame(this.restartPulseId);
      this.restartPulseId = null;
    }
    this.world.restartButtonArea = null;
    if (this.restartHoverListenerAdded && this.handleRestartHoverBound) {
      this.world.canvas.removeEventListener(
        "mousemove",
        this.handleRestartHoverBound
      );
      this.restartHoverListenerAdded = false;
    }
  }

  /**
   * Stops the restart button UI and resets cursor state.
   */
  stopRestartButtonUI() {
    this.stopRestartButtonAnimation();
    if (this.world.canvas) {
      this.world.canvas.style.cursor = "default";
    }
  }
}
