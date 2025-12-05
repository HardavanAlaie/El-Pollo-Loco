/**
 * Class: World
 * The main game controller — handles the main loop, rendering,
 * high-level state and delegates details to manager classes.
 */
class World {
  /**
   * Creates the game world and initializes core systems.
   * @param {HTMLCanvasElement} canvas - The canvas element used for rendering.
   * @param {Keyboard} keyboard - The keyboard input handler.
   */
  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;

    this.canThrow = true;
    this.levelEnded = false;
    this.playerDied = false;
    this.endbossDefeated = false;
    this.uiScreen = null;

    this.statusBar = new StatusBar();
    this.statusBarBottle = new StatusBarBottle();
    this.statusBarCoin = new StatusBarCoin();

    this.throwableObjects = [];

    this.level = level1(this);
    this.character = new Character(this);

    this.enemies = this.level.enemies;
    this.clouds = this.level.clouds;
    this.backgroundObjects = this.level.backgroundObjects;
    this.collectableBottles = this.level.collectableObjects || [];
    this.collectableCoins = this.level.collectableCoins || [];

    // Manager
    this.collisionManager = new CollisionManager(this);
    this.audioManager = new AudioManager(this);
    this.uiManager = new UiInputManager(this);
    this.endScreenManager = new EndScreenManager(this);

    this.setWorld();
    this.uiManager.setupCanvasControls();
    this.draw();
    this.run();
  }

  /** Links character to world and starts enemy spawn loops. */
  setWorld() {
    this.character.world = this;
    this.spawnEnemyLoop();
  }

  /** Main game loop — delegates to the collision manager. */
  run() {
    this.gameInterval = setInterval(() => {
      if (this.levelEnded) return;
      this.collisionManager.update();
    }, 1000 / 60);
  }

  /**
   * Completely stops the game — halts all intervals and animations.
   * @param {boolean} [isWin=false] - Whether the stop was triggered by a win.
   */
  stopGameLoopHard(isWin = false) {
    clearInterval(this.gameInterval);
    clearInterval(this.enemySpawnInterval);
    cancelAnimationFrame(this.animationFrame);
    this.levelEnded = true;
    this.gameOver = !isWin;
  }

  /** Stops all sounds and displays the game over screen. */
  endGame() {
    this.stopGameLoopHard();
    this.audioManager.stopEnemySounds();
    this.endScreenManager.showGameOverScreen();
  }

  /** Wrapper: play a simple sound effect via AudioManager. */
  playSound(path, loop = false) {
    this.audioManager.playSound(path, loop);
  }

  /** Wrapper: stop only enemy sounds via AudioManager. */
  stopEnemySounds() {
    this.audioManager.stopEnemySounds();
  }

  /** Wrapper: stop all sounds via AudioManager. */
  stopAllSounds() {
    this.audioManager.stopAllSounds();
  }

  /** Wrapper: hard stop enemy audio via AudioManager. */
  hardStopEnemyAudio() {
    this.audioManager.hardStopEnemyAudio();
  }

  /** Wrapper: set background music via AudioManager. */
  setBackgroundMusic(path, loop = false) {
    this.audioManager.setBackgroundMusic(path, loop);
  }

  /** Wrapper: stop background music via AudioManager. */
  stopBackgroundMusic() {
    this.audioManager.stopBackgroundMusic();
  }

  /** Displays the victory screen (delegated to EndScreenManager). */
  showWinScreen() {
    this.endScreenManager.showWinScreen();
  }

  /** Displays the game over screen (delegated to EndScreenManager). */
  showGameOverScreen() {
    this.endScreenManager.showGameOverScreen();
  }

  /**
   * Main render loop — draws background, entities, UI and controls.
   */
  draw() {
    if (this.playerDied) return this.showGameOverScreen();
    if (this.endbossDefeated) return this.showWinScreen();

    this.restartButtonArea = null;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.uiManager.updateCanvasRect?.();

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);

    [this.statusBar, this.statusBarBottle, this.statusBarCoin].forEach((bar) =>
      this.addToMap(bar)
    );

    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);

    this.level.enemies.forEach((enemy) => {
      this.addToMap(enemy);
      if (enemy.statusBar) this.addToMap(enemy.statusBar);
    });

    this.addObjectsToMap(this.collectableBottles);
    this.addObjectsToMap(this.collectableCoins);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);

    this.uiManager.drawMobileControls();

    if (!this.levelEnded)
      this.animationFrame = requestAnimationFrame(() => this.draw());

    if (this.bottleLimitMessage) {
      this.ctx.save();
      this.ctx.font = "26px Comic Sans MS";
      this.ctx.fillStyle = "#fca534";
      this.ctx.textAlign = "center";
      this.ctx.shadowColor = "black";
      this.ctx.shadowBlur = 6;
      this.ctx.fillText(
        this.bottleLimitMessage,
        this.canvas.width / 2,
        this.canvas.height - 50
      );
      this.ctx.restore();
    }
  }

  /** Draws all objects from a given list to the canvas. */
  addObjectsToMap(objects = []) {
    objects.forEach((o) => this.addToMap(o));
  }

  /** Draws a single movable object, handling horizontal flipping if needed. */
  addToMap(mo) {
    if (!mo) return;
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /** Flips an image horizontally (used for left-facing movement). */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x *= -1;
  }

  /** Restores the original image orientation after drawing. */
  flipImageBack(mo) {
    this.ctx.restore();
    mo.x *= -1;
  }

  /**
   * Shows a short message if the player tries to collect more bottles than allowed.
   * (Wrapper to keep API stabil, Logik im UiManager)
   */
  showBottleLimitMessage() {
    this.uiManager.showBottleLimitMessage();
  }

  /**
   * Spawns enemies dynamically based on level configuration.
   * Uses the `spawnConfig` defined inside each level.
   */
  spawnEnemyLoop() {
    const configs = this.level.config?.spawnConfig || [];
    this.spawnIntervals = [];
    configs.forEach((cfg) => {
      this.spawnEnemyLoopSetIntervalMethod(cfg);
    });
  }
}
