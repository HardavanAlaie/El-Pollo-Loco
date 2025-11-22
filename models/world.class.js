/**
 * 🌍 Class: World
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
    /** --- 🧱 Core Setup --- */
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.canThrow = true;

    /** --- ⚙️ Game State Flags --- */
    this.levelEnded = false;
    this.playerDied = false;
    this.endbossDefeated = false;
    this.uiScreen = null;

    /** --- 🧩 UI Elements --- */
    this.statusBar = new StatusBar();
    this.statusBarBottle = new StatusBarBottle();
    this.statusBarCoin = new StatusBarCoin();

    /** --- 📦 Object Containers --- */
    this.throwableObjects = [];

    /** --- 🌄 Level Setup --- */
    this.level = level1(this);
    this.character = new Character(this);
    this.enemies = this.level.enemies;
    this.clouds = this.level.clouds;
    this.backgroundObjects = this.level.backgroundObjects;
    this.collectableBottles = this.level.collectableObjects || [];
    this.collectableCoins = this.level.collectableCoins || [];

    /** --- 🚀 Initialization --- */
    this.setWorld();
    this.setupCanvasControls();
    this.draw();
    this.run();
  }

  /** 🔧 Links character to world and starts enemy spawn loops. */
  setWorld() {
    this.character.world = this;
    this.spawnEnemyLoop();
  }

  /** ♻️ Main game loop — checks collisions, spawns, and victory/defeat conditions. */
  run() {
    this.gameInterval = setInterval(() => {
      if (this.levelEnded) return;
      this.checkCollisions();
      this.checkThrowableObjects();
      this.checkEndbossDefeated();
      this.removeOffscreenEnemies();
      this.checkEndboss1Hit();
      this.ifPlayerDead();
    }, 200);
  }

  // 💀 Check if player has died
  ifPlayerDead() {
    if (
      this.character.energy <= 0 &&
      !this.playerDied &&
      !this.endbossDefeated
    ) {
      this.playerDied = true;
      this.stopGameLoopHard();
      this.showGameOverScreen();
    }
  }

  /**
   * 🛑 Completely stops the game — halts all intervals and animations.
   * @param {boolean} [isWin=false] - Whether the stop was triggered by a win.
   */
  stopGameLoopHard(isWin = false) {
    clearInterval(this.gameInterval);
    clearInterval(this.enemySpawnInterval);
    cancelAnimationFrame(this.animationFrame);
    this.levelEnded = true;
    this.gameOver = !isWin;
  }

  /** ⚔️ Handles all types of collisions in the world. */
  checkCollisions() {
    this.level.enemies.forEach((e) => this.characterColliding(e));
    this.checkThrowableObjects();
    this.characterCollidingBottle();
    this.checkCoins();
  }

  /** 🦅 Checks if the Endboss collides with the player (causes damage). */
  checkEndboss1Hit() {
    const boss = this.level.enemies.find(
      (e) => e instanceof EndbossLevel1 || e instanceof EndbossLevel2
    );
    if (!boss || this.character.energy <= 0) return;
    if (this.character.isColliding(boss) && !this.character.isHurtTimer) {
      this.character.hit();
      this.character.isHurtTimer = true;
      setTimeout(() => (this.character.isHurtTimer = false), 1000);
    }
  }

  /** 🧴 Manages all throwable objects and checks for enemy collisions. */
  checkThrowableObjects() {
    this.throwableObjects = this.throwableObjects.filter((b) => !b.isDead?.());
    this.throwableObjects.forEach((bottle) => {
      if (bottle.isBroken) return;
      this.level.enemies.forEach((enemy) => {
        if (bottle.isBroken) return;
        if (!enemy.isDead?.() && bottle.isColliding(enemy)) {
          if (
            enemy instanceof EndbossLevel1 || enemy instanceof EndbossLevel2) {
            enemy.takeDamage?.(20);
          } else {
            enemy.hit?.();
          }
          bottle.break?.();
        }
      });
    });
    this.throwableBottles();
  }

  /** 🎯 Throws a new bottle when allowed and updates the bottle counter. */
  throwableBottles() {
    if (
      this.keyboard.D &&
      this.canThrow &&
      this.statusBarBottle.availableBottles > 0) {
      this.canThrow = false;
      this.statusBarBottle.availableBottles--;
      this.statusBarBottle.update?.();
      const bottle = new ThrowableObject(this.character.x + (this.character.otherDirection ? -30 : 30), this.character.y + 100, this.character.otherDirection);
      bottle.world = this;
      this.throwableObjects.push(bottle);
      setTimeout(() => (this.canThrow = true), 400);
    }
  }

  /** 🪙 Checks for player collisions with coins and updates the coin bar. */
  checkCoins() {
    const inset = 10;
    this.collectableCoins = this.collectableCoins.filter((coin) => {
      if (this.character.isCollidingTight(coin, inset)) {
        this.statusBarCoin.availableCoins++;
        this.statusBarCoin.update();
        if (soundEnabled) {
          const s = new Audio("audio/coins.mp3");
          s.volume = 0.5;
          s.play().catch(() => {});
        }
        return false;
      }
      return true;
    });
  }

  /** 🐔 Handles player–enemy collision logic (jumping on enemies vs taking damage). */
  characterColliding(enemy) {
    if (!this.character.isColliding(enemy)) return;
    const charBottom = this.character.y + this.character.height;
    const enemyHeadZone = enemy.y + enemy.height * 0.4;
    const isAbove = charBottom <= enemyHeadZone;
    if (isAbove) {
      this.character.y = enemy.y - this.character.height;
      if (enemy instanceof EndbossLevel1 || enemy instanceof EndbossLevel2) {
        enemy.takeDamage?.(20);
      } else {
        enemy.hit?.();
      }
      this.character.jump();
      if (enemy.isDead?.()) {
        enemy.die?.();
      }
    } else {
      this.character.hit();
      this.statusBar.setPercentage(this.character.energy);
    }
  }

  /** 🧴 Handles collisions with collectible bottles. */
  characterCollidingBottle() {
    this.collectableBottles = this.collectableBottles.filter((bottle) => {
      if (this.character.isColliding(bottle)) {
        if (this.statusBarBottle.availableBottles < 5) {
          this.statusBarBottle.availableBottles++;
          this.statusBarBottle.update();
        } else this.showBottleLimitMessage();
        return false;
      }
      return true;
    });
  }

  /** 🏆 Checks if the Endboss has been defeated. */
  checkEndbossDefeated() {
    const endboss = this.level.enemies.find((e) => e instanceof EndbossLevel1);
    if (!endboss || this.endbossDefeated || this.playerDied) return;
    if (endboss.isDead?.()) {
      this.endbossDefeated = true;
      this.stopGameLoopHard(true);
      this.showWinScreen();
    }
  }

  /** 🧩 Stops all sounds and displays the game over screen. */
  endGame() {
    this.stopGameLoopHard();
    this.stopEnemySounds();
    //this.playSound("audio/gameover.mp3");
    this.showGameOverScreen();
  }

  /**
   * 🎵 Plays a sound if sound is enabled.
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

  /** 🔇 Stops all enemy sounds. */
  stopEnemySounds() {
    this.level.enemies.forEach((e) => e.stopScreamSound?.());
  }

  /** 🏁 Displays the victory screen and plays win music. */
  showWinScreen() {
    if (this._winShown) return;
    this._winShown = true;
    this._gameOverPlayed = true;
    this.stopGameLoopHard(true);
    this.stopAllSounds(); // sicherstellen, dass vorher alles still ist
    this.setBackgroundMusic("audio/win.mp3", true); // 🔁 loopend
    this.fadeOverlay(0.3);
    this.drawEndScreen("img/You won, you lost/You win B.png", "#fca534ff");
  }

  /** ☠️ Displays the game over screen. */
  showGameOverScreen() {
    if (this._gameOverPlayed) return;
    this._gameOverPlayed = true;
    this._winShown = true;
    this.stopGameLoopHard(false);
    this.hardStopEnemyAudio();
    this.stopAllSounds(); // sicherstellen, dass vorher alles still ist
    this.setBackgroundMusic("audio/gameover.mp3", false); // ▶️ einmalig
    this.fadeOverlay(0.8);
    this.drawEndScreen("img/You won, you lost/Game Over.png", "#fca534ff");
  }

  /** 🌫️ Draws a transparent overlay to darken the screen. */
  fadeOverlay(alpha = 0.2) {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 🖼️ Draws either the win or game-over screen with a restart button.
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
   * 🖼️ Handles image loading and scaling for end screens (win/game over).
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
      // 📏 Dynamically scale image to fit ~60% of canvas width, 30% of height
      const scale = Math.min(
        (canvas.width * 0.6) / img.width,
        (canvas.height * 0.3) / img.height
      );
      const w = img.width * scale;
      const h = img.height * scale;
      // 🎯 Center the image horizontally, slightly above the canvas center
      this.drawImageMethod(ctx, img, canvas, w, h);
      // 🔘 Draw restart button after image appears
      this.drawRestartButton(btnColor);
    };
  }

  // 🎯 Center the image horizontally, slightly above the canvas center
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
   * 🔁 Draws and animates the restart button shown after win or game over.
   * @param {string} color - Button background color.
   */
  drawRestartButton(color) {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const w = 250,
      h = 60;
    const x = canvas.width / 2 - w / 2;
    const y = canvas.height / 2;

    // 🌟 Pulsating glow animation for better visibility
    let pulse = 0;
    const animatePulse = () => {
      if (this.levelEnded) {
        ctx.save();
        ctx.globalAlpha = 0.2 + Math.sin(Date.now() / 400) * 0.2;
        ctx.fillStyle = "#c07512ff";
        ctx.beginPath();
        ctx.roundRect(x - 5, y - 5, w + 10, h + 10, 10);
        ctx.fill();
        ctx.restore();
        // 🔳 Main restart button
        this.mainRestartButtonMethod(ctx, color, x, y, w, h, canvas);
        pulse = requestAnimationFrame(animatePulse);
      } else {
        cancelAnimationFrame(pulse);
      }
    };

    animatePulse(); // Initial draw

    // Save clickable area for restart detection
    this.restartButtonArea = { x, y, width: w, height: h };
        if (!this.restartHoverListenerAdded) {
      this.handleRestartHoverBound = this.handleRestartHover.bind(this);
      canvas.addEventListener("mousemove", this.handleRestartHoverBound);
      this.restartHoverListenerAdded = true;
    }
    // Add click / touch listeners only once
    if (!this.canvasClickListenerAdded) {
      const boundHandler = this.handleRestartClick.bind(this);
      canvas.addEventListener("click", boundHandler);
      canvas.addEventListener("touchstart", boundHandler, { passive: false });
      canvas.addEventListener("pointerdown", boundHandler);
      this.canvasClickListenerAdded = true;
    }
  }

  // 🔳 Main restart button
  mainRestartButtonMethod(ctx, color, x, y, w, h, canvas) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.font = "24px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Restart Game", canvas.width / 2, y + 38);
  }

  /**
   * 🖱️ Handles clicks on the restart button and reloads the game.
   * @param {MouseEvent|TouchEvent} e
   */
  handleRestartClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const btn = this.restartButtonArea;
    if (!btn) return;
    const inside =
      x >= btn.x &&
      x <= btn.x + btn.width &&
      y >= btn.y &&
      y <= btn.y + btn.height;
    this.stopSoundsMethod(inside);
  }

  /**
   * 🔇 Stops all active sounds and resets the game state when the player
   * clicks inside the restart button area. Used to cleanly restart the game.
   *
   * @param {boolean} inside - Indicates whether the click occurred inside the restart button area.
   */
  stopSoundsMethod(inside) {
    if (inside) {
      // 🧹 Stop all currently playing sounds and clear game intervals
      this.hardStopEnemyAudio();
      this.stopAllSounds();
      this.stopGameLoopHard();

      // ♻️ Reset internal flags for proper restart
      this._winShown = false;
      this._gameOverPlayed = false;

      // ⏳ Small delay before reloading for smoother UX
      //setTimeout(() => location.reload(), 300);
      setTimeout(() => restartGame(), 300);
    }
  }

  /**
   * 🔁 Restarts the game without reloading the page.
   */
  restartGame() {
    // 🧹 Alte Welt vollständig entfernen
    if (world) {
      world.stopAllSounds();
      world.stopGameLoopHard();
      world = null;
    }

    // 💡 Canvas zurücksetzen
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 🕹️ Neues Spiel starten
    startGame();
  }

  /**
   * 🎨 Main render loop — draws background, entities, UI and controls.
   */
  draw() {
    if (this.playerDied) return this.showGameOverScreen();
    if (this.endbossDefeated) return this.showWinScreen();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateCanvasRect();

    // --- Background & camera movement ---
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);

    // --- HUD elements ---
    [this.statusBar, this.statusBarBottle, this.statusBarCoin].forEach((bar) =>
      this.addToMap(bar)
    );

    // --- Character and enemies ---
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);

    this.level.enemies.forEach((enemy) => {
      this.addToMap(enemy);
      if (enemy.statusBar) this.addToMap(enemy.statusBar);
    });

    // --- Collectibles & projectiles ---
    this.addObjectsToMap(this.collectableBottles);
    this.addObjectsToMap(this.collectableCoins);
    this.addObjectsToMap(this.throwableObjects);

    // --- Reset camera ---
    this.ctx.translate(-this.camera_x, 0);

    // --- On-screen mobile controls ---
    this.drawMobileControls();

    if (!this.levelEnded)
      this.animationFrame = requestAnimationFrame(() => this.draw());

    // --- Nach allen Zeichnungen ---
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

  /** 🧩 Draws all objects from a given list to the canvas. */
  addObjectsToMap(objects = []) {
    objects.forEach((o) => this.addToMap(o));
  }

  /** 🧱 Draws a single movable object, handling horizontal flipping if needed. */
  addToMap(mo) {
    if (!mo) return;
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /** ↔️ Flips an image horizontally (used for left-facing movement). */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x *= -1;
  }

  /** ↩️ Restores the original image orientation after drawing. */
  flipImageBack(mo) {
    this.ctx.restore();
    mo.x *= -1;
  }

  /**
   * 📱 Sets up touch / pointer controls for mobile gameplay.
   * Converts screen coordinates into logical canvas coordinates.
   */
  setupCanvasControls() {
    if (this.uiClickListenerAdded) return;
    this.uiClickListenerAdded = true;

    const handleDown = (e) => {
      if (e.cancelable) e.preventDefault();
      const { x, y } = this.getCanvasCoordinates(e);

      // 🔴 Optional: Debug indicator for tap location
      this.debugIndicatorMethod(x, y);
      this.keyboardInsidebuttonMethod(x, y);
    };
    const handleUp = this.handleUpMethod();
    this.touchButtonsMethod(handleDown, handleUp);
  }

  /**
   * 📱 Attaches touch, pointer, and mouse event listeners to the canvas
   * for handling on-screen control buttons (mobile-friendly input).
   *
   * @param {Function} handleDown - Function to call when a control button is pressed.
   * @param {Function} handleUp - Function to call when a control button is released.
   */
  touchButtonsMethod(handleDown, handleUp) {
    // Add "press" events for mobile and desktop input types
    ["pointerdown", "touchstart", "mousedown"].forEach((t) =>
      this.canvas.addEventListener(t, handleDown, { passive: false })
    );

    // Add "release" events to reset input state
    ["pointerup", "touchend", "mouseup", "touchcancel"].forEach((t) =>
      this.canvas.addEventListener(t, handleUp)
    );
  }

  /**
   * 🎮 Checks if a given touch or click position is inside one of the on-screen
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
   * ⬆️ Returns a reusable function that resets all virtual key states
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

  // 🔴 Optional: Debug indicator for tap location
  debugIndicatorMethod(x, y) {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,0,0,0.6)";
    ctx.fill();
    ctx.restore();
  }

  /** 🧭 Updates cached canvas bounding box for accurate input scaling. */
  updateCanvasRect() {
    this.canvasRect = this.canvas.getBoundingClientRect();
  }

  /**
   * 🔍 Converts click or touch event into logical canvas coordinates,
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
   * 🎯 Converts a touch or mouse event position to accurate canvas coordinates.
   * This ensures that input positions are correctly mapped even when the canvas
   * is scaled or centered in fullscreen or responsive layouts.
   *
   * @param {TouchEvent | MouseEvent} e - The input event (touch or mouse).
   * @returns {{ clientX: number, x: number, y: number }} The calculated canvas coordinates.
   */
  canvasCoordinatesMethod(e) {
    // Get current canvas position and size relative to the viewport
    const rect = this.canvasRect;
    // Calculate scaling ratio between actual canvas resolution and displayed size
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    // Detect touch or mouse coordinates
    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;
    // Subtract offsets (canvas position on screen)
    const offsetX = rect.left;
    const offsetY = rect.top;
    // Convert to logical canvas coordinates
    const x = (clientX - offsetX) * scaleX;
    const y = (clientY - offsetY) * scaleY;
    return { clientX, y, x };
  }

  /**
   * 📏 Retrieves and returns the current window and canvas aspect ratio information.
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
   * 📱 Returns true on mobile/tablet (coarse pointer) or small viewports.
   */
  isMobileOrTablet() {
    // Uses pointer type and viewport width as heuristic
    const isCoarsePointer =
      window.matchMedia &&
      window.matchMedia("(pointer: coarse)").matches;

    const isNarrowScreen = window.innerWidth <= 1024;

    return isCoarsePointer || isNarrowScreen;
  }


  /**
   * 🎮 Draws on-screen circular control buttons for mobile users.
   * Includes movement, jump, and throw controls.
   */
  // drawMobileControls() {
  //   const ctx = this.ctx;
  //   const w = this.canvas.width;
  //   const h = this.canvas.height;
  //   const size = 60;
  //   const margin = 20;

  //   // Define button positions relative to canvas size
  //   this.leftBtnArea = {
  //     x: margin,
  //     y: h - size - margin,
  //     width: size,
  //     height: size,
  //     label: "⬅️",
  //   };
  //   this.rightBtnArea = {
  //     x: margin + size + 20,
  //     y: h - size - margin,
  //     width: size,
  //     height: size,
  //     label: "➡️",
  //   };
  //   this.jumpBtnArea = {
  //     x: w - size * 2 - 40,
  //     y: h - size - margin,
  //     width: size,
  //     height: size,
  //     label: "⤴️",
  //   };
  //   this.throwBtnArea = {
  //     x: w - size - margin,
  //     y: h - size - margin,
  //     width: size,
  //     height: size,
  //     label: "🧴",
  //   };

  //   // Draw each button with consistent style
  //   [
  //     this.leftBtnArea,
  //     this.rightBtnArea,
  //     this.jumpBtnArea,
  //     this.throwBtnArea,
  //   ].forEach((b) => {
  //     ctx.save();
  //     ctx.fillStyle = "#fca534ff";
  //     ctx.beginPath();
  //     ctx.arc(
  //       b.x + b.width / 2,
  //       b.y + b.height / 2,
  //       b.width / 2,
  //       0,
  //       Math.PI * 2
  //     );
  //     ctx.fill();
  //     ctx.fillStyle = "white";
  //     ctx.font = `${Math.floor(b.width / 2)}px Comic Sans MS`;
  //     ctx.textAlign = "center";
  //     ctx.textBaseline = "middle";
  //     ctx.fillText(b.label, b.x + b.width / 2, b.y + b.height / 2);
  //     ctx.restore();
  //   });
  // }
    /**
   * 🎮 Draws on-screen circular control buttons for mobile users.
   * Includes movement, jump, and throw controls.
   */
  drawMobileControls() {
    // ❌ Desktop: don't draw mobile controls
    if (!this.isMobileOrTablet()) {
      this.leftBtnArea  = null;
      this.rightBtnArea = null;
      this.jumpBtnArea  = null;
      this.throwBtnArea = null;
      return;
    }

    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const size = 60;
    const margin = 20;

    // Define button positions relative to canvas size
    this.leftBtnArea = {
      x: margin,
      y: h - size - margin,
      width: size,
      height: size,
      label: "⬅️",
    };
    this.rightBtnArea = {
      x: margin + size + 20,
      y: h - size - margin,
      width: size,
      height: size,
      label: "➡️",
    };
    this.jumpBtnArea = {
      x: w - size * 2 - 40,
      y: h - size - margin,
      width: size,
      height: size,
      label: "⤴️",
    };
    this.throwBtnArea = {
      x: w - size - margin,
      y: h - size - margin,
      width: size,
      height: size,
      label: "🧴",
    };

    // Draw each button with consistent style
    [
      this.leftBtnArea,
      this.rightBtnArea,
      this.jumpBtnArea,
      this.throwBtnArea,
    ].forEach((b) => {
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
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = `${Math.floor(b.width / 2)}px Comic Sans MS`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(b.label, b.x + b.width / 2, b.y + b.height / 2);
      ctx.restore();
    });
  }


  /**
   * 🧩 Utility: checks if a point (x,y) is inside a button’s area.
   */
  isInsideButton(x, y, b) {
    return (
      b && x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height
    );
  }

  /**
   * 🚫 Shows a short message if the player tries to collect more bottles than allowed.
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
   * 🐣 Spawns enemies dynamically based on level configuration.
   * Uses the `spawnConfig` defined inside each level.
   */
  spawnEnemyLoop() {
    const configs = this.level.config?.spawnConfig || [];
    this.spawnIntervals = [];
    configs.forEach((cfg) => {
      const id = setInterval(() => {
        if (typeof cfg.condition === "function" && !cfg.condition(this.level))
          return;
        const current = this.level.enemies.filter((e) => e instanceof cfg.type);
        if (current.length < cfg.maxCount) {
          const newEnemy = new cfg.type();
          newEnemy.x = 900 + Math.random() * 400;
          this.level.enemies.push(newEnemy);
        }
      }, cfg.interval);
      this.spawnIntervals.push(id);
    });
  }

  /** 🧹 Removes enemies that have moved off-screen to optimize performance. */
  removeOffscreenEnemies() {
    this.level.enemies = this.level.enemies.filter(
      (e) =>
        !(e instanceof ChickenSmall || e instanceof ChickenNormal) || e.x > -50
    );
  }

  /** 🔇 Stops all sounds, both enemy and global audio elements. */
  stopAllSounds() {
    try {
      this.stopEnemySounds();
      // alle <audio>-Elemente im DOM stoppen
      document.querySelectorAll("audio").forEach((a) => {
        a.pause();
        a.currentTime = 0;
      });
      // explizit hinterlegte Hintergrundmusik stoppen
      this.stopBackgroundMusic?.();
    } catch (err) {}
  }

  /** 🧨 Hartes Stoppen aller Gegner-Audios (v. a. Boss-Schrei) */
  hardStopEnemyAudio() {
    try {
      (this.level?.enemies || []).forEach((e) => {
        // preferierte Methode
        if (typeof e.stopScreamSound === "function") {
          e.stopScreamSound();
        }
        // fallback: direkt an der Audio-Instanz
        if (e.screamSound) {
          e.screamSound.pause();
          e.screamSound.currentTime = 0;
        }
        // Flag sicher zurücksetzen
        if ("isScreaming" in e) e.isScreaming = false;
      });
    } catch {}
  }

  /** 🎵 Start/ersetze Hintergrundmusik (z. B. Win/GameOver). */
  setBackgroundMusic(path, loop = false) {
    try {
      // evtl. laufende BG-Musik stoppen
      if (this._bgMusic) {
        this._bgMusic.pause();
        this._bgMusic.currentTime = 0;
      }
      if (!soundEnabled) {
        this._bgMusic = null;
        return;
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

  /** 🔇 Stoppt nur die hinterlegte Hintergrundmusik (Win/GameOver). */
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
