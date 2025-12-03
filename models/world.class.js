/**
 * Class: World
 * The main game controller — handles the entire gameplay logic, rendering, physics,
 * collisions, input, UI updates, and sound effects.
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

    this.collisionManager = new CollisionManager(this);

    this.setWorld();
    this.setupCanvasControls();
    this.draw();
    this.run();
  }

  /** Links character to world and starts enemy spawn loops. */
  setWorld() {
    this.character.world = this;
    this.spawnEnemyLoop();
  }

  /** Main game loop — checks collisions, spawns, and victory/defeat conditions. */
  run() {
    this.gameInterval = setInterval(() => {
      if (this.levelEnded) return;
      // this.checkCollisions();
      // this.checkThrowableObjects();
      // this.checkEndbossDefeated();
      // this.removeOffscreenEnemies();
      // this.checkEndboss1Hit();
      // this.characterEnergyMethod();

      this.collisionManager.update();

    }, 1000 / 60);
  }

/**
 * ------------------------------------------------------------
 * Handles character death when energy reaches zero and triggers
 * the game over flow if the player has not already died or won.
 *
 * @function characterEnergyMethod
 * ------------------------------------------------------------
 */
  // characterEnergyMethod() {
  //   if (
  //     this.character.energy <= 0 &&
  //     !this.playerDied &&
  //     !this.endbossDefeated
  //   ) {
  //     this.playerDied = true;
  //     this.stopGameLoopHard();
  //     this.showGameOverScreen();
  //   }
  // }

  // Check if player has died
  // ifPlayerDead() {
  //   if (
  //     this.character.energy <= 0 &&
  //     !this.playerDied &&
  //     !this.endbossDefeated
  //   ) {
  //     this.playerDied = true;
  //     this.stopGameLoopHard();
  //     this.showGameOverScreen();
  //   }
  // }

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

  /** Handles all types of collisions in the world. */
  // checkCollisions() {
  //   this.level.enemies.forEach((e) => this.characterColliding(e));
  //   this.checkThrowableObjects();
  //   this.character.collectBottle();
  //   this.checkCoins();
  // }

  /** Checks if the Endboss collides with the player (causes damage). */
  // checkEndboss1Hit() {
  //   const boss = this.level.enemies.find((e) => e instanceof EndbossLevel1);
  //   if (!boss || this.character.energy <= 0) return;
  //   if (this.character.isColliding(boss) && !this.character.isHurtTimer) {
  //     this.character.hit();
  //     this.character.isHurtTimer = true;
  //     setTimeout(() => (this.character.isHurtTimer = false), 1000);
  //   }
  // }

  /** Manages all throwable objects and checks for enemy collisions. */
  // checkThrowableObjects() {
  //   this.throwableObjects = this.throwableObjects.filter((b) => !b.isDead?.());
  //   this.throwableObjects.forEach((bottle) => {
  //     if (bottle.isBroken) return;
  //     this.level.enemies.forEach((enemy) => {
  //       if (bottle.isBroken) return;
  //       this.ifDeadIfCollidingMethod(enemy, bottle);
  //     });
  //   });
  //   this.throwableBottles();
  // }

/**
 * ------------------------------------------------------------
 * Applies damage to an enemy when hit by a bottle if they are
 * colliding and the enemy is still alive, and breaks the bottle.
 *
 * @function ifDeadIfCollidingMethod
 * @param {object} enemy - The enemy object being checked.
 * @param {object} bottle - The throwable bottle object.
 * ------------------------------------------------------------
 */
  // ifDeadIfCollidingMethod(enemy, bottle) {
  //   if (!enemy.isDead?.() && bottle.isColliding(enemy)) {
  //     if (enemy instanceof EndbossLevel1) {
  //       enemy.takeDamage?.(20);
  //     } else {
  //       enemy.hit?.();
  //     }
  //     bottle.break?.();
  //   }
  // }

  /** Throws a new bottle when allowed and updates the bottle counter. */
  throwableBottles() {
    if (
      this.keyboard.D &&
      this.canThrow &&
      this.statusBarBottle.availableBottles > 0
    ) {
      this.ifThrowableBottlesMethod();
    }
  }

/**
 * ------------------------------------------------------------
 * Handles the logic for throwing a bottle, including cooldown,
 * reducing available bottles, spawning the throwable object,
 * and re-enabling throwing after a delay.
 *
 * @function ifThrowableBottlesMethod
 * ------------------------------------------------------------
 */
  ifThrowableBottlesMethod() {
    this.canThrow = false;
    this.statusBarBottle.availableBottles--;
    this.statusBarBottle.update?.();
    const bottle = new ThrowableObject(
      this.character.x + (this.character.otherDirection ? -30 : 30),
      this.character.y + 100,
      this.character.otherDirection
    );
    bottle.world = this;
    this.throwableObjects.push(bottle);
    setTimeout(() => (this.canThrow = true), 400);
  }

  /** Checks for player collisions with coins and updates the coin bar. */
  // checkCoins() {
  //   this.collectableCoins = this.collectableCoins.filter((coin) => {
  //     if (this.isCoinCollected(coin)) {
  //       this.statusBarCoin.availableCoins++;
  //       this.statusBarCoin.update();
  //       if (soundEnabled) {
  //         const s = new Audio("audio/coins.mp3");
  //         s.volume = 0.5;
  //         s.play().catch(() => {});
  //       }
  //       return false;
  //     }
  //     return true;
  //   });
  // }

  /**
   * Sehr kleine Hitbox nur für Coin-Einsammeln.
   * Nutzt die Zentren von Charakter und Coin, damit es optisch passt.
   */
  coinPickupCollision(coin) {
    const cx = this.character.x + this.character.width / 2;
    const cy = this.character.y + this.character.height / 2;
    const kx = coin.x + coin.width / 2;
    const ky = coin.y + coin.height / 2;
    const dx = Math.abs(cx - kx);
    const dy = Math.abs(cy - ky);
    const pickupRadiusX = coin.width * 0.3;
    const pickupRadiusY = coin.height * 0.3;
    return dx < pickupRadiusX && dy < pickupRadiusY;
  }

  /**
   * Coin collision:
   * - Strongly reduced character hitbox (body only)
   * - Slightly reduced coin hitbox
   */
  isCoinCollected(coin) {
    if (!coin || !this.character) return false;
    const c = this.character;
    const charPaddingX = c.width * 0.3;
    const charPaddingTop = c.height * 0.2;
    const charPaddingBottom = c.height * 0.1;
    const ax1 = c.x + charPaddingX;
    const ax2 = c.x + c.width - charPaddingX;
    const ay1 = c.y + charPaddingTop;
    const ay2 = c.y + c.height - charPaddingBottom;
    const { bx1, bx2, by1, by2 } = this.coinPaddingMethod(coin);
    return ax2 > bx1 && ax1 < bx2 && ay2 > by1 && ay1 < by2;
  }

/**
 * ------------------------------------------------------------
 * Calculates an inner padded hitbox for a coin to make
 * collision detection slightly less sensitive at the edges.
 *
 * @function coinPaddingMethod
 * @param {object} coin - The coin object.
 * @returns {{ bx1: number, bx2: number, by1: number, by2: number }}
 * ------------------------------------------------------------
 */
  coinPaddingMethod(coin) {
    const coinPadding = 8;
    const bx1 = coin.x + coinPadding;
    const bx2 = coin.x + coin.width - coinPadding;
    const by1 = coin.y + coinPadding;
    const by2 = coin.y + coin.height - coinPadding;
    return { bx1, bx2, by1, by2 };
  }

  /** Handles player–enemy collision logic (jumping on enemies vs taking damage). */
  // characterColliding(enemy) {
  //   const c = this.character;
  //   if (!c || !enemy) return;
  //   if (enemy.isDead?.() || enemy.dead) return;
  //   if (!c.isColliding(enemy)) return;
  //   const isStomp = this.characterCollidingConstsMethod(c, enemy);
  //   if (isStomp) {
  //     return this.ifIsStompMethod(enemy, c);
  //   }
  //   const isCloseEnough = c.isCollidingTight(enemy, 20); 
  //   if (!isCloseEnough) return;
  //   if (!c.isHurtTimer) {
  //     this.ifIsHurtTimerMethod(c);
  //   }
  // }

/**
 * ------------------------------------------------------------
 * Determines whether a collision between the character and an
 * enemy should be treated as a stomp based on vertical positions
 * and the character's vertical speed.
 *
 * @function characterCollidingConstsMethod
 * @param {object} c - The character object.
 * @param {object} enemy - The enemy object.
 * @returns {boolean}
 * ------------------------------------------------------------
 */
  // characterCollidingConstsMethod(c, enemy) {
  //   const charBottom = c.y + c.height;
  //   const enemyCenterY = enemy.y + enemy.height / 2;
  //   const isStomp = charBottom <= enemyCenterY && c.speedY <= 0;
  //   return isStomp;
  // }

/**
 * ------------------------------------------------------------
 * Applies damage to the character, updates the status bar, and
 * activates a temporary hurt timer to prevent repeated hits.
 *
 * @function ifIsHurtTimerMethod
 * @param {object} c - The character object.
 * ------------------------------------------------------------
 */
  // ifIsHurtTimerMethod(c) {
  //   c.hit();
  //   this.statusBar.setPercentage(c.energy);
  //   c.isHurtTimer = true;
  //   setTimeout(() => (c.isHurtTimer = false), 700);
  // }

/**
 * ------------------------------------------------------------
 * Handles stomp interactions where the character jumps on an
 * enemy, dealing damage and bouncing the character upward. If
 * the enemy dies, its death logic is triggered.
 *
 * @function ifIsStompMethod
 * @param {object} enemy - The enemy being stomped.
 * @param {object} c - The character object.
 * ------------------------------------------------------------
 */
  // ifIsStompMethod(enemy, c) {
  //   if (enemy instanceof EndbossLevel1) {
  //     enemy.takeDamage?.(20);
  //   } else {
  //     enemy.hit?.();
  //   }
  //   c.speedY = 25;
  //   c.y = enemy.y - c.height;
  //   c.lastHit = 0;
  //   if (enemy.isDead?.()) enemy.die?.();
  //   return;
  // }

  /** Checks if the Endboss has been defeated. */
  // checkEndbossDefeated() {
  //   const endboss = this.level.enemies.find((e) => e instanceof EndbossLevel1);
  //   if (!endboss || this.endbossDefeated || this.playerDied) return;
  //   if (endboss.isDead?.()) {
  //     if (!endboss.deathStartTime) {
  //       endboss.deathStartTime = Date.now();
  //     }
  //     const elapsed = Date.now() - endboss.deathStartTime;
  //     if (elapsed >= 1000) {
  //       this.endbossDefeated = true;
  //       this.stopGameLoopHard(true);
  //       this.showWinScreen();
  //     }
  //   }
  // }

  /** Stops all sounds and displays the game over screen. */
  endGame() {
    this.stopGameLoopHard();
    this.stopEnemySounds();
    this.showGameOverScreen();
  }

  /**
   * Plays a sound if sound is enabled.
   * @param {string} path - Audio file path.
   * @param {boolean} [loop=false] - Whether the sound should loop.
   */
  playSound(path, loop = false) {
    if (!soundEnabled) return;
    const s = new Audio(path);
    s.volume = 0.7;
    s.loop = loop;
    s.play().catch(() => {});
  }

  /** Stops all enemy sounds. */
  stopEnemySounds() {
    this.level.enemies.forEach((e) => e.stopScreamSound?.());
  }

  /** Displays the victory screen and plays win music. */
  showWinScreen() {
    if (this._winShown) return;
    this._winShown = true;
    this._gameOverPlayed = true;
    this.stopGameLoopHard(true);
    this.stopAllSounds();
    this.setBackgroundMusic("audio/win.mp3", true);
    this.fadeOverlay(0.3);
    this.drawEndScreen("img/You won, you lost/You win B.png", "#fca534ff");
  }

  /** Displays the game over screen. */
  showGameOverScreen() {
    if (this._gameOverPlayed) return;
    this._gameOverPlayed = true;
    this._winShown = true;
    this.stopGameLoopHard(false);
    this.hardStopEnemyAudio();
    this.stopAllSounds();
    this.setBackgroundMusic("audio/gameover.mp3", false);
    this.fadeOverlay(0.8);
    this.drawEndScreen("img/You won, you lost/Game Over.png", "#fca534ff");
  }

  /** Draws a transparent overlay to darken the screen. */
  fadeOverlay(alpha = 0.2) {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws either the win or game-over screen with a restart button.
   * @param {string} imgSrc - Path to the end screen image.
   * @param {string} btnColor - Color for the restart button.
   */
  drawEndScreen(imgSrc, btnColor) {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const img = new Image();
    img.src = imgSrc;
    this.imgOnload(img, canvas, ctx, btnColor);
  }

  /**
   * Handles image loading and scaling for end screens (win/game over).
   * Once the image is fully loaded, it is drawn centered on the canvas,
   * and the restart button is rendered below it.
   *
   * @param {HTMLImageElement} img - The image element to load and display.
   * @param {HTMLCanvasElement} canvas - The target canvas where the image is drawn.
   * @param {CanvasRenderingContext2D} ctx - The 2D drawing context of the canvas.
   * @param {string} btnColor - The color to use for the restart button.
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

  // Center the image horizontally, slightly above the canvas center
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
    const { ctx, x, y, w, h, canvas } = this.drawRestartButtonConstsMethod();
    const animatePulse = () => {
      this.ifLevelEndedMethod(ctx, x, y, w, h, color, canvas, animatePulse);
    };
    animatePulse();
    this.restartButtonArea = { x, y, width: w, height: h };
    if (!this.restartHoverListenerAdded) {
      this.ifRestartHoverListenerAddedMethod(canvas);
    }
    if (!this.canvasClickListenerAdded) {
      this.ifCanvasClickListenerAddedMethod(canvas);
    }
  }

  drawRestartButtonConstsMethod() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const w = 250,
      h = 60;
    const x = canvas.width / 2 - w / 2;
    const y = canvas.height / 2;
    return { ctx, x, y, w, h, canvas };
  }

  ifCanvasClickListenerAddedMethod(canvas) {
    const boundHandler = this.handleRestartClick.bind(this);
    canvas.addEventListener("click", boundHandler);
    canvas.addEventListener("touchstart", boundHandler, { passive: false });
    canvas.addEventListener("pointerdown", boundHandler);
    this.canvasClickListenerAdded = true;
  }

  ifRestartHoverListenerAddedMethod(canvas) {
    this.handleRestartHoverBound = this.handleRestartHover.bind(this);
    canvas.addEventListener("mousemove", this.handleRestartHoverBound);
    this.restartHoverListenerAdded = true;
  }

  ifLevelEndedMethod(ctx, x, y, w, h, color, canvas, animatePulse) {
    if (this.levelEnded) {
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

  ifLevelEndedCtxMethod(ctx, x, y, w, h) {
    ctx.save();
    ctx.globalAlpha = 0.2 + Math.sin(Date.now() / 400) * 0.2;
    ctx.fillStyle = "#c07512ff";
    ctx.beginPath();
    ctx.roundRect(x - 5, y - 5, w + 10, h + 10, 10);
    ctx.fill();
    ctx.restore();
  }

  // Main restart button
  mainRestartButtonMethod(ctx, color, x, y, w, h, canvas) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.font = "24px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Restart Game", canvas.width / 2, y + 38);
  }

  /**
   * Handles clicks on the restart button and reloads the game.
   * @param {MouseEvent|TouchEvent} e
   */
  handleRestartClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const { btn, x, y } = this.handleRestartClickConstsMethod(rect, e);
    if (!btn) return;
    const inside =
      x >= btn.x &&
      x <= btn.x + btn.width &&
      y >= btn.y &&
      y <= btn.y + btn.height;
    if (inside) {
      this.ifInsideMethod();
    }
  }

  ifInsideMethod() {
    this.stopRestartButtonUI();
    this.stopAllSounds();
    this.stopGameLoopHard();
    this._winShown = false;
    this._gameOverPlayed = false;
    setTimeout(() => restartGame(), 300);
  }

  handleRestartClickConstsMethod(rect, e) {
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const btn = this.restartButtonArea;
    return { btn, x, y };
  }

  /**
   * Sets pointer cursor when mouse is over the restart button.
   */
  handleRestartHover(event) {
    if (!this.restartButtonArea) {
      this.canvas.style.cursor = "default";
      return;
    }
    const rect = this.canvas.getBoundingClientRect();
    const { x, y } = this.scaleXYMethod(rect, event);
    const inside =
      x >= this.restartButtonArea.x &&
      x <= this.restartButtonArea.x + this.restartButtonArea.width &&
      y >= this.restartButtonArea.y &&
      y <= this.restartButtonArea.y + this.restartButtonArea.height;
    this.canvas.style.cursor = inside ? "pointer" : "default";
  }

  scaleXYMethod(rect, event) {
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    return { x, y };
  }

  /**
   * Stops all active sounds and resets the game state when the player
   * clicks inside the restart button area. Used to cleanly restart the game.
   *
   * @param {boolean} inside - Indicates whether the click occurred inside the restart button area.
   */
  stopSoundsMethod(inside) {
    if (inside) {
      this.hardStopEnemyAudio();
      this.stopAllSounds();
      this.stopGameLoopHard();
      this._winShown = false;
      this._gameOverPlayed = false;
      setTimeout(() => restartGame(), 300);
    }
  }

  /**
   * Restarts the game without reloading the page.
   */
  restartGame() {
    if (world) {
      this.canvas?.classList.remove("restart-hover");
      world.stopRestartButtonUI?.();
      world.stopAllSounds();
      world.stopGameLoopHard();
      world = null;
    }
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    startGame();
  }

  /**
   * Main render loop — draws background, entities, UI and controls.
   */
  draw() {
    if (this.playerDied) return this.showGameOverScreen();
    if (this.endbossDefeated) return this.showWinScreen();
    this.restartButtonArea = null;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateCanvasRect();
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
    this.drawMobileControls();
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
   * Sets up touch / pointer controls for mobile gameplay.
   * Converts screen coordinates into logical canvas coordinates.
   */
  setupCanvasControls() {
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
   *
   * @param {Function} handleDown - Function to call when a control button is pressed.
   * @param {Function} handleUp - Function to call when a control button is released.
   */
  touchButtonsMethod(handleDown, handleUp) {
    ["pointerdown", "touchstart", "mousedown"].forEach((t) =>
      this.canvas.addEventListener(t, handleDown, { passive: false })
    );
    ["pointerup", "touchend", "mouseup", "touchcancel"].forEach((t) =>
      this.canvas.addEventListener(t, handleUp)
    );
  }

  /**
   * Checks if a given touch or click position is inside one of the on-screen
   * control buttons and updates keyboard state accordingly.
   *
   * @param {number} x - X coordinate on the canvas.
   * @param {number} y - Y coordinate on the canvas.
   */
  keyboardInsidebuttonMethod(x, y) {
    this.keyboard.LEFT = this.isInsideButton(x, y, this.leftBtnArea);
    this.keyboard.RIGHT = this.isInsideButton(x, y, this.rightBtnArea);
    this.keyboard.UP = this.isInsideButton(x, y, this.jumpBtnArea);
    this.keyboard.D = this.isInsideButton(x, y, this.throwBtnArea);
  }

  /**
   * Returns a reusable function that resets all virtual key states
   * (used for mobile button release handling).
   *
   * @returns {Function} A function that, when executed, clears all keyboard inputs.
   */
  handleUpMethod() {
    return () => {
      this.keyboard.LEFT = false;
      this.keyboard.RIGHT = false;
      this.keyboard.UP = false;
      this.keyboard.D = false;
    };
  }

/**
 * ------------------------------------------------------------
 * Draws a visual debug indicator as a red semi-transparent circle
 * at the specified canvas coordinates.
 *
 * @function debugIndicatorMethod
 * @param {number} x - X position where the indicator is drawn.
 * @param {number} y - Y position where the indicator is drawn.
 * ------------------------------------------------------------
 */
  debugIndicatorMethod(x, y) {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,0,0,0.6)";
    ctx.fill();
    ctx.restore();
  }

  /** Updates cached canvas bounding box for accurate input scaling. */
  updateCanvasRect() {
    this.canvasRect = this.canvas.getBoundingClientRect();
  }

  /**
   * Converts click or touch event into logical canvas coordinates,
   * accounting for scaling and fullscreen offsets.
   * @param {Event} e
   * @returns {{x:number,y:number}} Position on canvas
   */
  getCanvasCoordinates(e) {
    if (!this.canvasRect) this.updateCanvasRect();
    const { clientX, y, x } = this.canvasCoordinatesMethod(e);
    const { windowRatio, aspectRatio, pageHeight, pageWidth } =
      this.windowWidthHeightMethod();
    if (windowRatio > aspectRatio) {
      const displayedWidth = pageHeight * aspectRatio;
      const horizontalOffset = (pageWidth - displayedWidth) / 2;
      return {
        x: (clientX - horizontalOffset) * (this.canvas.width / displayedWidth),
        y,
      };
    }
    return { x, y };
  }

  /**
   * Converts a touch or mouse event position to accurate canvas coordinates.
   * This ensures that input positions are correctly mapped even when the canvas
   * is scaled or centered in fullscreen or responsive layouts.
   *
   * @param {TouchEvent | MouseEvent} e - The input event (touch or mouse).
   * @returns {{ clientX: number, x: number, y: number }} The calculated canvas coordinates.
   */
  canvasCoordinatesMethod(e) {
    const rect = this.canvasRect;
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;
    const offsetX = rect.left;
    const offsetY = rect.top;
    const x = (clientX - offsetX) * scaleX;
    const y = (clientY - offsetY) * scaleY;
    return { clientX, y, x };
  }

  /**
   * Retrieves and returns the current window and canvas aspect ratio information.
   * This helps determine how the canvas should be scaled or centered
   * when resizing or entering fullscreen mode.
   *
   * @returns {{ windowRatio: number, aspectRatio: number, pageHeight: number, pageWidth: number }}
   * Object containing window and canvas size ratios and dimensions.
   */
  windowWidthHeightMethod() {
    const pageWidth = window.innerWidth;
    const pageHeight = window.innerHeight;
    const aspectRatio = this.canvas.width / this.canvas.height;
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
    [
      this.leftBtnArea,
      this.rightBtnArea,
      this.jumpBtnArea,
      this.throwBtnArea,
    ].forEach((b) => {
      this.forEachMethod(ctx, b);
    });
  }

/**
 * ------------------------------------------------------------
 * Draws a circular button background on the canvas and delegates
 * the label rendering to the helper method.
 *
 * @function forEachMethod
 * @param {CanvasRenderingContext2D} ctx - The canvas drawing context.
 * @param {object} b - Button object containing position, size, and label.
 * ------------------------------------------------------------
 */
  forEachMethod(ctx, b) {
    ctx.save();
    ctx.fillStyle = "#fca534ff";
    ctx.beginPath();
    ctx.arc(b.x + b.width / 2, b.y + b.height / 2, b.width / 2, 0, Math.PI * 2);
    this.forEachMethodCtxMethod(ctx, b);
  }

/**
 * ------------------------------------------------------------
 * Completes the drawing of a circular button by filling the shape
 * and rendering the button label centered within the circle.
 *
 * @function forEachMethodCtxMethod
 * @param {CanvasRenderingContext2D} ctx - The canvas drawing context.
 * @param {object} b - Button object containing label and dimensions.
 * ------------------------------------------------------------
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
 * ------------------------------------------------------------
 * Defines the interactive button areas for mobile controls,
 * including left, right, jump, and throw buttons.
 *
 * @function drawMobileControlsBtnAreaMethod
 * @param {number} margin - Outer spacing around the buttons.
 * @param {number} h - Canvas height.
 * @param {number} size - Button size in pixels.
 * @param {number} w - Canvas width.
 * ------------------------------------------------------------
 */
  drawMobileControlsBtnAreaMethod(margin, h, size, w) {
    this.leftBtnArea = {x: margin, y: h - size - margin, width: size, height: size, label: "⬅️",};
    this.rightBtnArea = {x: margin + size + 20, y: h - size - margin, width: size, height: size, label: "➡️", };
    this.jumpBtnArea = {x: w - size * 2 - 40, y: h - size - margin, width: size, height: size, label: "⤴️", };
    this.throwBtnArea = {x: w - size - margin, y: h - size - margin, width: size, height: size, label: "🧴", };
  }

/**
 * ------------------------------------------------------------
 * Provides constants and layout information required to draw
 * mobile control buttons on the canvas.
 *
 * @function drawMobileControlsConstsMethod
 * @returns {{ margin: number, h: number, size: number, w: number, ctx: CanvasRenderingContext2D }}
 * ------------------------------------------------------------
 */
  drawMobileControlsConstsMethod() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const size = 60;
    const margin = 20;
    return { margin, h, size, w, ctx };
  }

/**
 * ------------------------------------------------------------
 * Disables mobile control areas by clearing all button hitboxes,
 * used when the device is not a mobile or tablet.
 *
 * @function ifIsMobileOrTabletMethod
 * ------------------------------------------------------------
 */
  ifIsMobileOrTabletMethod() {
    this.leftBtnArea = null;
    this.rightBtnArea = null;
    this.jumpBtnArea = null;
    this.throwBtnArea = null;
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
    this.bottleLimitMessage = "Bottle limit reached!";
    clearTimeout(this.bottleLimitTimeout);
    this.bottleLimitTimeout = setTimeout(
      () => (this.bottleLimitMessage = ""),
      2000
    );
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

  /** Removes enemies that have moved off-screen to optimize performance. */
  // removeOffscreenEnemies() {
  //   this.level.enemies = this.level.enemies.filter(
  //     (e) =>
  //       !(e instanceof ChickenSmall || e instanceof ChickenNormal) || e.x > -50
  //   );
  // }

  /** Stops all sounds, both enemy and global audio elements. */
  stopAllSounds() {
    try {
      this.stopEnemySounds();
      document.querySelectorAll("audio").forEach((a) => {
        a.pause();
        a.currentTime = 0;
      });
      this.stopBackgroundMusic?.();
    } catch (err) {}
  }

  /**
   * Stops the restart button animation and removes hover state.
   * Called before restarting the game to avoid the button staying visible.
   */
  stopRestartButtonAnimation() {
    if (this.restartPulseId) {
      cancelAnimationFrame(this.restartPulseId);
      this.restartPulseId = null;
    }
    this.restartButtonArea = null;
    if (this.restartHoverListenerAdded && this.handleRestartHoverBound) {
      this.canvas.removeEventListener(
        "mousemove",
        this.handleRestartHoverBound
      );
      this.restartHoverListenerAdded = false;
    }
  }

  /**
   * Stops the restart button hover/animation and disables its hitbox.
   * Called before restarting the game so the old button cannot be hovered/clicked anymore.
   */
  stopRestartButtonUI() {
    if (this.restartPulseId) {
      cancelAnimationFrame(this.restartPulseId);
      this.restartPulseId = null;
    }
    this.restartButtonArea = null;
    if (this.restartHoverListenerAdded && this.handleRestartHoverBound) {
      this.canvas.removeEventListener("mousemove", this.handleRestartHoverBound);
      this.restartHoverListenerAdded = false;
    }
    if (this.canvas) {
      this.canvas.style.cursor = "default";
    }
  }

  /** Hartes Stoppen aller Gegner-Audios (v. a. Boss-Schrei) */
  hardStopEnemyAudio() {
    try {
      (this.level?.enemies || []).forEach((e) => {
        if (typeof e.stopScreamSound === "function") {
          e.stopScreamSound();
        }
        if (e.screamSound) {
          e.screamSound.pause();
          e.screamSound.currentTime = 0;
        }
        if ("isScreaming" in e) e.isScreaming = false;
      });
    } catch {}
  }

/**
 * ------------------------------------------------------------
 * Sets and plays background music, stopping previous music if
 * necessary and respecting global sound settings.
 *
 * @function setBackgroundMusic
 * @param {string} path - Path to the audio file.
 * @param {boolean} [loop=false] - Whether the music should loop.
 * ------------------------------------------------------------
 */
  setBackgroundMusic(path, loop = false) {
    try {
      if (this._bgMusic) {
        this.if_bgMusicMethod();
      }
      if (!soundEnabled) {
        return this.ifSoundEnabledMethod();
      }
      const a = new Audio(path);
      a.volume = 0.7;
      a.loop = loop;
      this._bgMusic = a;
      a.play().catch(() => {});
    } catch (e) {
      console.warn("setBackgroundMusic failed:", e);
    }
  }

 /**
 * ------------------------------------------------------------
 * Clears the stored background music reference when sound
 * is globally disabled.
 *
 * @function ifSoundEnabledMethod
 * ------------------------------------------------------------
 */
  ifSoundEnabledMethod() {
    this._bgMusic = null;
    return;
  }

 /**
 * ------------------------------------------------------------
 * Stops and resets the previously active background music before
 * loading and playing a new one.
 *
 * @function if_bgMusicMethod
 * ------------------------------------------------------------
 */
  if_bgMusicMethod() {
    this._bgMusic.pause();
    this._bgMusic.currentTime = 0;
  }

  /**Stoppt nur die hinterlegte Hintergrundmusik (Win/GameOver). */
  stopBackgroundMusic() {
    try {
      if (this._bgMusic) {
        this._bgMusic.pause();
        this._bgMusic.currentTime = 0;
      }
    } catch (e) {
      console.warn("stopBackgroundMusic failed:", e);
    }
    this._bgMusic = null;
  }
}
