class World {
  characterDead = false;
  playerDied = false;
  endbossDefeated = false;
  uiScreen = null;

  gameOver = false;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  statusBar = new StatusBar();
  statusBarBottle = new StatusBarBottle();
  statusBarCoin = new StatusBarCoin();
  throwableObjects = [];
  canThrow = true;

  bottleLimitMessage = "";
  bottleLimitTimeout = null;
  levelMessage = "";
  levelMessageTimeout = null;

  currentLevelIndex = 0;
  level = allLevels[this.currentLevelIndex];
  enemies = this.level.enemies;
  clouds = this.level.clouds;
  backgroundObjects = this.level.backgroundObjects;
  collectableBottles = this.level.collectableObjects || [];
  collectableCoins = this.level.collectableCoins || [];

  // constructor(canvas, keyboard) {
  //   this.ctx = canvas.getContext("2d");
  //   this.canvas = canvas;
  //   this.keyboard = keyboard;

  //   //this.mobileButtons = []; // 👉 Array vorbereiten

  //   this.currentLevelIndex = 0;

  //   this.level = level1(this);

  //   this.character = new Character(this);
  //   this.enemies = this.level.enemies;
  //   this.clouds = this.level.clouds;
  //   this.backgroundObjects = this.level.backgroundObjects;
  //   this.collectableBottles = this.level.collectableObjects || [];
  //   this.collectableCoins = this.level.collectableCoins || [];
  //   this.levelEnded = false;

  //   this.setWorld();
  //   this.setupCanvasControls(); // 👉 erst Eventlistener
  //   this.draw();
  //   this.run();

  //   //this.setupCanvasControls();
  // }
  //   constructor(canvas, keyboard) {
  //   this.ctx = canvas.getContext("2d");
  //   this.canvas = canvas;
  //   this.keyboard = keyboard;

  //   this.currentLevelIndex = 0;
  //   this.level = level1(this);

  //   this.character = new Character(this);
  //   this.enemies = this.level.enemies;
  //   this.clouds = this.level.clouds;
  //   this.backgroundObjects = this.level.backgroundObjects;
  //   this.collectableBottles = this.level.collectableObjects || [];
  //   this.collectableCoins = this.level.collectableCoins || [];
  //   this.levelEnded = false;

  //   this.setWorld();
  //   this.setupCanvasControls(); // ✅ einmal aufrufen
  //   this.draw();
  //   this.run();
  // }
  // constructor(canvas, keyboard) {
  //   this.ctx = canvas.getContext("2d");
  //   this.canvas = canvas;
  //   this.keyboard = keyboard;

  //   this.currentLevelIndex = 0;
  //   this.level = level1(this);

  //   this.character = new Character(this);
  //   this.enemies = this.level.enemies;
  //   this.clouds = this.level.clouds;
  //   this.backgroundObjects = this.level.backgroundObjects;
  //   this.collectableBottles = this.level.collectableObjects || [];
  //   this.collectableCoins = this.level.collectableCoins || [];
  //   this.levelEnded = false;

  //   this.setWorld();

  //   // 👇 GANZ WICHTIG: nur EINMAL registrieren!
  //   this.setupCanvasControls();

  //   this.draw();
  //   this.run();
  // }
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

    this.currentLevelIndex = 0;
    this.level = level1(this);

    this.character = new Character(this);
    this.enemies = this.level.enemies;
    this.clouds = this.level.clouds;
    this.backgroundObjects = this.level.backgroundObjects;
    this.collectableBottles = this.level.collectableObjects || [];
    this.collectableCoins = this.level.collectableCoins || [];
    this.levelEnded = false;

    this.setWorld();

    // 👇 GANZ WICHTIG: nur 1x aufrufen
    this.setupCanvasControls();

    this.draw();
    this.run();
  }

  setWorld() {
    this.character.world = this;
    this.spawnEnemyLoop();
  }

  run() {
    this.gameInterval = setInterval(() => {
      if (!this.levelEnded) {
        this.checkCollisions();
        this.checkThrowableObjects();
        this.checkEndbossDefeated();
        this.removeOffscreenEnemies();
        this.checkEndboss1Hit();
      }

      if (this.playerDied && !this.gameOver) {
        this.gameOver = true;
        this.stopGameLoopHard();

        this.showGameOverScreen();
      }
    }, 200);
  }

  checkEndboss1Hit() {
    if (
      !this.character.isHurt() &&
      this.character.isColliding(
        this.level.enemies.find(
          (e) => e instanceof EndbossLevel1 || e instanceof EndbossLevel2
        )
      )
    ) {
      this.character.hit();
    }
  }

  checkThrowableObjects() {
    this.throwableObjects = this.throwableObjects.filter(
      (bottle) => !bottle.isDead?.()
    );

    this.throwableBottles();
  }

  throwableBottles() {
    if (
      this.keyboard.D &&
      this.canThrow &&
      this.statusBarBottle.availableBottles > 0
    ) {
      this.canThrow = false;
      this.statusBarBottle.availableBottles--;
      this.statusBarBottle.update?.();

      const bottle = new ThrowableObject(
        this.character.x + 30,
        this.character.y + 100,
        this.character.otherDirection
      );
      this.throwableObjects.push(bottle);

      setTimeout(() => {
        this.canThrow = true;
      }, 300);
    }
  }

  checkCollisions() {
    (this.level.enemies || []).forEach((enemy) => {
      this.characterColliding(enemy);
    });

    this.throwableObjects.forEach((bottle) => {
      (this.level.enemies || []).forEach((enemy) => {
        if (!bottle.isBroken && bottle.isColliding(enemy)) {
          bottle.break();
          enemy.hit();

          if (enemy.isDead?.()) {
            if (enemy instanceof EndbossLevel1) {
              enemy.isMarkedDead = true;
            } else {
              const i = this.level.enemies.indexOf(enemy);
              if (i >= 0) this.level.enemies.splice(i, 1);
            }
          }
        }
      });

      if (!bottle.isBroken && bottle.y > 420) {
        bottle.break();
      }
    });

    this.throwableObjects = this.throwableObjects.filter(
      (bottle) => !bottle.isDead()
    );

    this.characterCollidingBottle();

    (this.collectableCoins || []).forEach((coin) => {
      if (this.character.isColliding(coin)) {
        if (this.statusBarCoin) {
          this.statusBarCoin.availableCoins++;
          this.statusBarCoin.update();
        }

        // const coinSound = new Audio("audio/coins.mp3");
        // coinSound.volume = 0.5;
        // coinSound.play().catch(() => {});
        if (soundEnabled) {
          const coinSound = new Audio("audio/coins.mp3");
          coinSound.volume = 0.5;
          coinSound.play().catch(() => {});
        }

        this.collectableCoins.splice(this.collectableCoins.indexOf(coin), 1);
      }
    });
  }

  characterCollidingBottle() {
    (this.collectableBottles || []).forEach((bottle) => {
      if (this.character.isColliding(bottle)) {
        if (this.statusBarBottle.availableBottles < 5) {
          this.statusBarBottle.availableBottles++;
          this.collectableBottles.splice(
            this.collectableBottles.indexOf(bottle),
            1
          );
          this.statusBarBottle.update?.();
        } else {
          this.showBottleLimitMessage();
        }
      }
    });
  }

  characterColliding(enemy) {
    if (this.character.isColliding(enemy)) {
      const characterBottom = this.character.y + this.character.height;
      const characterVerticalSpeed = this.character.speedY;

      let enemyTop = enemy.y + enemy.height * (enemy.height < 100 ? 0.7 : 0.25);
      let extraOffset = enemy.height < 100 ? 25 : 15;

      console.log("enemyTop:", enemyTop, "extraOffset:", extraOffset);

      const ctx = this.world?.ctx;
      if (ctx) {
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          this.character.x,
          this.character.y,
          this.character.width,
          this.character.height
        );

        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);

        ctx.strokeStyle = "green";
        ctx.lineWidth = 1;
        ctx.strokeRect(enemy.x - 5, enemyTop, enemy.width + 15, extraOffset);
      }

      const isAboveEnemy =
        characterBottom <= enemyTop + extraOffset && characterVerticalSpeed > 0;

      this.ifIsAboveEnemy(isAboveEnemy, enemy);
    }
  }

  ifIsAboveEnemy(isAboveEnemy, enemy) {
    if (isAboveEnemy) {
      enemy.hit();
      enemy.playDeathAnimation?.();
      this.ifEnemyIsDead(enemy);
      this.character.jump();
    } else {
      this.character.hit();
      this.statusBar.setPercentage(this.character.energy);
      this.character.isHurt();
      if (this.character.energy <= 0 && !this.characterDead) {
        this.characterDead = true;
        this.showLevelMessage("💀 Du bist gestorben!");
        setTimeout(() => {
          this.endGame();
        }, 3000);
      }
    }
  }

  ifEnemyIsDead(enemy) {
    if (enemy.isDead?.()) {
      if (enemy instanceof EndbossLevel1) {
        enemy.isMarkedDead = true;
      } else {
        enemy.die?.();
      }
    }
  }

  endGame() {
    clearInterval(this.gameInterval);
    clearInterval(this.enemySpawnInterval);
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.levelEnded = true;
    this.gameOver = true;
    this.playerDied = true;
    this.uiScreen = "gameover";

    this.stopEnemySounds();

    if (!this.gameOverSound) {
      this.gameOverSound = new Audio("audio/gameover.mp3");
      this.gameOverSound.volume = 0.7;
    }
    this.gameOverSound.currentTime = 0;
    this.gameOverSound.play().catch((e) => {
      console.warn("Konnte GameOver-Sound nicht abspielen:", e);
    });

    this.showGameOverScreen();
  }

  checkEndbossDefeated() {
    console.log("🔍 checkEndbossDefeated läuft");

    const endboss = (this.level.enemies || []).find(
      (e) => e instanceof EndbossLevel1
    );
    if (
      !endboss ||
      this.endbossDefeated ||
      this.playerDied ||
      this._handlingBossDefeat
    )
      return;

    if (endboss.isDead?.()) {
      console.log("✅ Endboss besiegt!");
      this._handlingBossDefeat = true;
      this.endbossDefeated = true;
      this.levelEnded = true;

      this.stopGameLoopHard();

      this.uiScreen = "win";

      this.showWinScreen();
    }
  }

  stopGameLoopHard() {
    console.log("⏹️ Stoppe komplettes Spiel");

    clearInterval(this.gameInterval);
    clearInterval(this.enemySpawnInterval);

    this.levelEnded = true;
    this.gameOver = true;
  }

  spawnEnemyLoop() {
    const spawnConfigs = this.level.config?.spawnConfig || [];
    this.spawnIntervals = [];

    spawnConfigs.forEach((config) => {
      const intervalId = setInterval(() => {
        const allowed =
          typeof config.condition === "function"
            ? config.condition(this.level)
            : true;

        if (!allowed) {
          return;
        }

        const current = this.level.enemies.filter(
          (e) => e instanceof config.type
        );

        if (current.length < config.maxCount) {
          const newEnemy = new config.type();
          newEnemy.x = 900 + Math.random() * 400;
          this.level.enemies.push(newEnemy);
        }
      }, config.interval);

      this.spawnIntervals.push(intervalId);
    });
  }

  removeOffscreenEnemies() {
    this.level.enemies = this.level.enemies.filter((enemy) => {
      if (
        (enemy instanceof ChickenSmall || enemy instanceof ChickenNormal) &&
        enemy.x < -50
      ) {
        return false;
      }
      return true;
    });
  }

  stopEnemySounds() {
    (this.level?.enemies || this.enemies || []).forEach((e) => {
      if (e instanceof EndbossLevel1 && e.stopScreamSound) {
        e.stopScreamSound();
      }
    });
  }

  showLevelMessage(message) {
    this.levelMessage = message;

    if (this.levelMessageTimeout) clearTimeout(this.levelMessageTimeout);

    this.levelMessageTimeout = setTimeout(() => {
      this.levelMessage = "";
    }, 3000);
  }

  spawnNewBottle() {
    let x = Math.floor(Math.random() * 1700) + 300;
    let y = Math.random() < 0.5 ? 300 : 350;
    let newBottle = new CollectableBottle(x, y);
    this.collectableBottles.push(newBottle);
  }

  showBottleLimitMessage() {
    this.bottleLimitMessage = "Flaschenlimit erreicht!";
    clearTimeout(this.bottleLimitTimeout);
    this.bottleLimitTimeout = setTimeout(() => {
      this.bottleLimitMessage = "";
    }, 2000);
  }

  // showRestartOverlay() {
  //   if (!document.getElementById("restartButton")) {
  //     const button = document.createElement("button");
  //     button.innerText = "Spiel neu starten";
  //     button.id = "restartButton";
  //     button.style.position = "absolute";
  //     button.style.top = "40%";
  //     button.style.left = "50%";
  //     button.style.transform = "translate(-50%, -50%)";
  //     button.style.padding = "15px 30px";
  //     button.style.fontSize = "20px";
  //     button.style.backgroundColor = "#ff4444";
  //     button.style.color = "white";
  //     button.style.border = "none";
  //     button.style.borderRadius = "10px";
  //     button.style.cursor = "pointer";
  //     button.style.boxShadow = "0 0 10px black";
  //     button.style.zIndex = "999";

  //     button.addEventListener("click", () => {
  //       location.reload();
  //     });

  //     document.body.appendChild(button);
  //   }
  // }

  showWinScreen() {
    const ctx = this.ctx;
    const canvas = this.canvas;

    console.log("🎉 showWinScreen läuft!");

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.stopEnemySounds();

    // if (!this.winSound) {
    //   this.winSound = new Audio("audio/win.mp3");
    //   this.winSound.volume = 0.7;
    //   this.winSound.loop = true;
    // }

    // if (soundEnabled) {
    //   this.winSound.currentTime = 0;
    //   this.winSound.play().catch(() => {});
    // }
    if (!this.winSound) {
      this.winSound = new Audio("audio/win.mp3");
      this.winSound.volume = 0.7;
      this.winSound.loop = true;
    }

    // if (soundEnabled) {
    //   // ✅ Nur wenn Sound erlaubt
    //   this.winSound.currentTime = 0;
    //   this.winSound.play().catch(() => {});
    // }
    // ⚡ Nur starten, wenn noch nicht läuft
    if (soundEnabled && this.winSound.paused) {
      this.winSound.currentTime = 0;
      this.winSound.play().catch(() => {});
    }

    const img = new Image();
    img.src = "img/You won, you lost/You win B.png";

    img.onload = () => {
      this.drawWinScreen(img);
    };

    img.onerror = () => {
      console.warn("⚠️ Win-Bild konnte nicht geladen werden!");
      ctx.font = "bold 64px Comic Sans MS";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("YOU WIN!", canvas.width / 2, canvas.height / 2 - 40);
    };
  }

  // drawWinScreen(img) {
  //   const ctx = this.ctx;
  //   const canvas = this.canvas;

  //   const maxWidth = canvas.width * 0.6;
  //   const maxHeight = canvas.height * 0.3;

  //   let imgWidth = img.width;
  //   let imgHeight = img.height;

  //   const widthRatio = maxWidth / imgWidth;
  //   const heightRatio = maxHeight / imgHeight;
  //   const scale = Math.min(widthRatio, heightRatio);

  //   imgWidth *= scale;
  //   imgHeight *= scale;

  //   const imgX = canvas.width / 2 - imgWidth / 2;
  //   const imgY = canvas.height / 2 - imgHeight - 40;

  //   ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

  //   const buttonWidth = 250;
  //   const buttonHeight = 60;
  //   const buttonX = canvas.width / 2 - buttonWidth / 2;
  //   const buttonY = canvas.height / 2;

  //   ctx.fillStyle = "#44cc44";
  //   ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

  //   ctx.font = "24px Comic Sans MS";
  //   ctx.fillStyle = "white";
  //   ctx.textAlign = "center";
  //   ctx.fillText("Spiel neu starten", canvas.width / 2, buttonY + 38);

  //   this.restartButtonArea = {
  //     x: buttonX,
  //     y: buttonY,
  //     width: buttonWidth,
  //     height: buttonHeight,
  //   };

  //   if (!this.canvasClickListenerAdded) {
  //     canvas.addEventListener("click", this.handleCanvasClick.bind(this));
  //     this.canvasClickListenerAdded = true;
  //   }
  // }

  // showGameOverScreen() {
  //   const ctx = this.ctx;
  //   const canvas = this.canvas;

  //   if (!this.gameOverSound) {
  //     this.gameOverSound = new Audio("audio/gameover.mp3");
  //     this.gameOverSound.volume = 0.6;
  //   }

  //   if (soundEnabled) {
  //     this.gameOverSound.currentTime = 0;
  //     this.gameOverSound.play().catch(() => {});
  //   }

  //   ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  //   ctx.fillRect(0, 0, canvas.width, canvas.height);

  //   const img = new Image();
  //   img.src = "img/You won, you lost/Game Over.png";

  //   img.onload = () => {
  //     const maxWidth = canvas.width * 0.6;
  //     const maxHeight = canvas.height * 0.3;

  //     let imgWidth = img.width;
  //     let imgHeight = img.height;

  //     const widthRatio = maxWidth / imgWidth;
  //     const heightRatio = maxHeight / imgHeight;
  //     const scale = Math.min(widthRatio, heightRatio);

  //     imgWidth *= scale;
  //     imgHeight *= scale;

  //     const imgX = canvas.width / 2 - imgWidth / 2;
  //     const imgY = canvas.height / 2 - imgHeight - 40;

  //     ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

  //     const buttonWidth = 250;
  //     const buttonHeight = 60;
  //     const buttonX = canvas.width / 2 - buttonWidth / 2;
  //     const buttonY = canvas.height / 2;

  //     ctx.fillStyle = "#fca534ff";
  //     ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

  //     ctx.font = "24px Comic Sans MS";
  //     ctx.fillStyle = "white";
  //     ctx.fillText("Spiel neu starten", canvas.width / 2, buttonY + 38);

  //     this.restartButtonArea = {
  //       x: buttonX,
  //       y: buttonY,
  //       width: buttonWidth,
  //       height: buttonHeight,
  //     };

  //     if (!this.canvasClickListenerAdded) {
  //       canvas.addEventListener("click", this.handleCanvasClick.bind(this));
  //       this.canvasClickListenerAdded = true;
  //     }
  //   };
  // }
  drawWinScreen(img) {
    const ctx = this.ctx;
    const canvas = this.canvas;

    const maxWidth = canvas.width * 0.6;
    const maxHeight = canvas.height * 0.3;

    let imgWidth = img.width;
    let imgHeight = img.height;

    const widthRatio = maxWidth / imgWidth;
    const heightRatio = maxHeight / imgHeight;
    const scale = Math.min(widthRatio, heightRatio);

    imgWidth *= scale;
    imgHeight *= scale;

    const imgX = canvas.width / 2 - imgWidth / 2;
    const imgY = canvas.height / 2 - imgHeight - 40;

    ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

    const buttonWidth = 250;
    const buttonHeight = 60;
    const buttonX = canvas.width / 2 - buttonWidth / 2;
    const buttonY = canvas.height / 2;

    ctx.fillStyle = "#44cc44";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    ctx.font = "24px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Spiel neu starten", canvas.width / 2, buttonY + 38);

    this.restartButtonArea = {
      x: buttonX,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight,
    };

    if (!this.canvasClickListenerAdded) {
      const boundHandler = this.handleCanvasClick.bind(this);
      canvas.addEventListener("click", boundHandler);
      canvas.addEventListener("touchstart", boundHandler, { passive: false });
      canvas.addEventListener("pointerdown", boundHandler);
      this.canvasClickListenerAdded = true;
    }
  }

  // showGameOverScreen() {
  //   const ctx = this.ctx;
  //   const canvas = this.canvas;

  //   // if (!this.gameOverSound) {
  //   //   this.gameOverSound = new Audio("audio/gameover.mp3");
  //   //   this.gameOverSound.volume = 0.6;
  //   // }

  //   // if (soundEnabled) {
  //   //   this.gameOverSound.currentTime = 0;
  //   //   this.gameOverSound.play().catch(() => {});
  //   // }
  //   if (!this.gameOverSound) {
  //     this.gameOverSound = new Audio("audio/gameover.mp3");
  //     this.gameOverSound.volume = 0.6;
  //   }

  //   // if (soundEnabled) { // ✅ Nur wenn Sound erlaubt
  //   //   this.gameOverSound.currentTime = 0;
  //   //   this.gameOverSound.play().catch(() => {});
  //   // }
  //   // ⚡ Nur einmal abspielen
  //   if (soundEnabled && !this.gameOverPlayed) {
  //     this.gameOverPlayed = true; // merken, dass schon gespielt
  //     this.gameOverSound.currentTime = 0;
  //     this.gameOverSound.play().catch(() => {});
  //   }

  //   ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  //   ctx.fillRect(0, 0, canvas.width, canvas.height);

  //   const img = new Image();
  //   img.src = "img/You won, you lost/Game Over.png";

  //   img.onload = () => {
  //     const maxWidth = canvas.width * 0.6;
  //     const maxHeight = canvas.height * 0.3;

  //     let imgWidth = img.width;
  //     let imgHeight = img.height;

  //     const widthRatio = maxWidth / imgWidth;
  //     const heightRatio = maxHeight / imgHeight;
  //     const scale = Math.min(widthRatio, heightRatio);

  //     imgWidth *= scale;
  //     imgHeight *= scale;

  //     const imgX = canvas.width / 2 - imgWidth / 2;
  //     const imgY = canvas.height / 2 - imgHeight - 40;

  //     ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

  //     const buttonWidth = 250;
  //     const buttonHeight = 60;
  //     const buttonX = canvas.width / 2 - buttonWidth / 2;
  //     const buttonY = canvas.height / 2;

  //     ctx.fillStyle = "#fca534ff";
  //     ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

  //     ctx.font = "24px Comic Sans MS";
  //     ctx.fillStyle = "white";
  //     ctx.textAlign = "center";
  //     ctx.fillText("Spiel neu starten", canvas.width / 2, buttonY + 38);

  //     this.restartButtonArea = {
  //       x: buttonX,
  //       y: buttonY,
  //       width: buttonWidth,
  //       height: buttonHeight,
  //     };

  //     if (!this.canvasClickListenerAdded) {
  //       const boundHandler = this.handleCanvasClick.bind(this);
  //       canvas.addEventListener("click", boundHandler);
  //       canvas.addEventListener("touchstart", boundHandler, { passive: false });
  //       canvas.addEventListener("pointerdown", boundHandler);
  //       this.canvasClickListenerAdded = true;
  //     }
  //   };
  // }
  showGameOverScreen() {
  const ctx = this.ctx;
  const canvas = this.canvas;

  if (!this.gameOverSound) {
    this.gameOverSound = new Audio("audio/gameover.mp3");
    this.gameOverSound.volume = 0.6;
  }

  // ⚡ Nur beim ersten Mal abspielen
  if (soundEnabled && !this.gameOverPlayed) {
    this.gameOverPlayed = true; // merken!
    this.gameOverSound.currentTime = 0;
    this.gameOverSound.play().catch(() => {});
  }

  // Hintergrund abdunkeln
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // GameOver-Bild
  const img = new Image();
  img.src = "img/You won, you lost/Game Over.png";

  img.onload = () => {
    const maxWidth = canvas.width * 0.6;
    const maxHeight = canvas.height * 0.3;

    let imgWidth = img.width;
    let imgHeight = img.height;

    const widthRatio = maxWidth / imgWidth;
    const heightRatio = maxHeight / imgHeight;
    const scale = Math.min(widthRatio, heightRatio);

    imgWidth *= scale;
    imgHeight *= scale;

    const imgX = canvas.width / 2 - imgWidth / 2;
    const imgY = canvas.height / 2 - imgHeight - 40;

    ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

    // Restart-Button
    const buttonWidth = 250;
    const buttonHeight = 60;
    const buttonX = canvas.width / 2 - buttonWidth / 2;
    const buttonY = canvas.height / 2;

    ctx.fillStyle = "#fca534ff";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    ctx.font = "24px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Spiel neu starten", canvas.width / 2, buttonY + 38);

    this.restartButtonArea = {
      x: buttonX,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight,
    };

    if (!this.canvasClickListenerAdded) {
      const boundHandler = this.handleCanvasClick.bind(this);
      canvas.addEventListener("click", boundHandler);
      canvas.addEventListener("touchstart", boundHandler, { passive: false });
      canvas.addEventListener("pointerdown", boundHandler);
      this.canvasClickListenerAdded = true;
    }
  };
}


  handleCanvasClick(event) {
    if (!this.restartButtonArea) return;

    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    let clientX, clientY;
    if (event.touches && event.touches[0]) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if (event.changedTouches && event.changedTouches[0]) {
      clientX = event.changedTouches[0].clientX;
      clientY = event.changedTouches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const clickX = (clientX - rect.left) * scaleX;
    const clickY = (clientY - rect.top) * scaleY;

    const btn = this.restartButtonArea;
    if (
      clickX >= btn.x &&
      clickX <= btn.x + btn.width &&
      clickY >= btn.y &&
      clickY <= btn.y + btn.height
    ) {
      location.reload();
    }
  }

  // toggleSound(enabled) {
  //   if (this.character?.jumpSound) {
  //     this.character.jumpSound.muted = !enabled;
  //   }
  //   if (this.character?.coinSound) {
  //     this.character.coinSound.muted = !enabled;
  //   }

  //   this.enemies.forEach((enemy) => {
  //     if (enemy instanceof EndbossLevel1 && enemy.screamSound) {
  //       enemy.screamSound.muted = !enabled;
  //     }
  //   });

  //   if (this.gameOverSound) {
  //     this.gameOverSound.muted = !enabled;
  //   }

  //   if (this.winSound) {
  //     this.winSound.muted = !enabled;
  //   }
  // }
  toggleSound(enabled) {
    // Character
    if (this.character?.jumpSound) this.character.jumpSound.muted = !enabled;
    if (this.character?.coinSound) this.character.coinSound.muted = !enabled;
    if (this.character?.walkSound) this.character.walkSound.muted = !enabled;
    if (this.character?.hurtSound) this.character.hurtSound.muted = !enabled;

    // Enemies (inkl. Endboss)
    this.enemies.forEach((enemy) => {
      if (enemy.screamSound) enemy.screamSound.muted = !enabled;
      if (enemy.hitSound) enemy.hitSound.muted = !enabled;
    });

    // World-Sounds (GameOver, Win etc.)
    if (this.gameOverSound) this.gameOverSound.muted = !enabled;
    if (this.winSound) this.winSound.muted = !enabled;
  }

  // draw() {
  //   if (this.playerDied) {
  //     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  //     this.showGameOverScreen();
  //     return;
  //   }

  //   console.log("characterDead:", this.characterDead);
  //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  //   this.ctx.translate(this.camera_x, 0);

  //   this.addObjectsToMap(this.level.backgroundObjects || []);

  //   this.ctx.translate(-this.camera_x, 0);

  //   if (this.bottleLimitMessage) {
  //     this.ctx.font = "15px Comic Sans MS";
  //     this.ctx.fillStyle = "red";
  //     this.ctx.fillText(this.bottleLimitMessage, 180, 95);
  //   }
  //   if (this.levelMessage) {
  //     this.ctx.font = "32px Comic Sans MS";
  //     this.ctx.fillStyle = "#28a745";
  //     this.ctx.textAlign = "center";
  //     this.ctx.fillText(this.levelMessage, this.canvas.width / 2, 150);
  //   }

  //   this.addToMap(this.statusBar);
  //   this.addToMap(this.statusBarBottle);
  //   this.addToMap(this.statusBarCoin);
  //   this.addObjectsToMap(this.clouds || []);

  //   this.ctx.translate(this.camera_x, 0);

  //   this.addToMap(this.character);

  //   this.addObjectsToMap(this.level.enemies || []);

  //   (this.level.enemies || []).forEach((enemy) => {
  //     if (enemy.statusBar) {
  //       enemy.statusBar.updatePosition();
  //       this.addToMap(enemy.statusBar);
  //     }
  //   });

  //   this.addObjectsToMap(this.collectableBottles || []);
  //   this.addObjectsToMap(this.collectableCoins || []);
  //   this.addObjectsToMap(this.throwableObjects || []);

  //   this.ctx.translate(-this.camera_x, 0);

  //   // ... dein draw(), ganz am Ende, NACH translate(-this.camera_x, 0)
  //   this.drawMobileControls(); // deine Gamepad-Buttons unten
  //   //this.drawUIButtons(); // NEU: Fullscreen/Sound/Anleitung oben rechts

  //   if (!this.playerDied && !this.endbossDefeated) {
  //     this.animationFrame = requestAnimationFrame(() => this.draw());
  //   }
  // }
  //   draw() {
  //   // 1️⃣ Game Over Screen
  //   if (this.playerDied) {
  //     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  //     this.showGameOverScreen();
  //     return;
  //   }

  //   // 2️⃣ Win Screen
  //   if (this.endbossDefeated) {
  //     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  //     this.showWinScreen();
  //     return;
  //   }

  //   // 3️⃣ Normales Spiel
  //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  //   this.ctx.translate(this.camera_x, 0);

  //   this.addObjectsToMap(this.level.backgroundObjects || []);
  //   this.ctx.translate(-this.camera_x, 0);

  //   if (this.bottleLimitMessage) {
  //     this.ctx.font = "15px Comic Sans MS";
  //     this.ctx.fillStyle = "red";
  //     this.ctx.fillText(this.bottleLimitMessage, 180, 95);
  //   }
  //   if (this.levelMessage) {
  //     this.ctx.font = "32px Comic Sans MS";
  //     this.ctx.fillStyle = "#28a745";
  //     this.ctx.textAlign = "center";
  //     this.ctx.fillText(this.levelMessage, this.canvas.width / 2, 150);
  //   }

  //   this.addToMap(this.statusBar);
  //   this.addToMap(this.statusBarBottle);
  //   this.addToMap(this.statusBarCoin);
  //   this.addObjectsToMap(this.clouds || []);

  //   this.ctx.translate(this.camera_x, 0);
  //   this.addToMap(this.character);
  //   this.addObjectsToMap(this.level.enemies || []);

  //   (this.level.enemies || []).forEach((enemy) => {
  //     if (enemy.statusBar) {
  //       enemy.statusBar.updatePosition();
  //       this.addToMap(enemy.statusBar);
  //     }
  //   });

  //   this.addObjectsToMap(this.collectableBottles || []);
  //   this.addObjectsToMap(this.collectableCoins || []);
  //   this.addObjectsToMap(this.throwableObjects || []);
  //   this.ctx.translate(-this.camera_x, 0);

  //   this.drawMobileControls();

  //   // 4️⃣ Loop nur solange kein Tod und kein Sieg
  //   if (!this.playerDied && !this.endbossDefeated) {
  //     this.animationFrame = requestAnimationFrame(() => this.draw());
  //   }
  // }
  draw() {
    // // 1️⃣ Game Over Screen
    // if (this.playerDied || this.characterDead) {
    //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //   this.showGameOverScreen();
    //   return;
    // }
    

    // 2️⃣ Win Screen
    if (this.endbossDefeated) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.showWinScreen();
      return;
    }

    // 3️⃣ Normales Spiel
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects || []);
    this.ctx.translate(-this.camera_x, 0);

    if (this.bottleLimitMessage) {
      this.ctx.font = "15px Comic Sans MS";
      this.ctx.fillStyle = "red";
      this.ctx.fillText(this.bottleLimitMessage, 180, 95);
    }
    if (this.levelMessage) {
      this.ctx.font = "32px Comic Sans MS";
      this.ctx.fillStyle = "#28a745";
      this.ctx.textAlign = "center";
      this.ctx.fillText(this.levelMessage, this.canvas.width / 2, 150);
    }

    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarCoin);
    this.addObjectsToMap(this.clouds || []);

    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies || []);

    (this.level.enemies || []).forEach((enemy) => {
      if (enemy.statusBar) {
        enemy.statusBar.updatePosition();
        this.addToMap(enemy.statusBar);
      }
    });

    this.addObjectsToMap(this.collectableBottles || []);
    this.addObjectsToMap(this.collectableCoins || []);
    this.addObjectsToMap(this.throwableObjects || []);
    this.ctx.translate(-this.camera_x, 0);

    this.drawMobileControls();

    // 4️⃣ Loop nur solange kein Tod und kein Sieg
    if (!this.playerDied && !this.characterDead && !this.endbossDefeated) {
      this.animationFrame = requestAnimationFrame(() => this.draw());
    }
  }

  // drawMobileControls() {
  //   const ctx = this.ctx;
  //   const canvas = this.canvas;

  //   // Größe & Position
  //   const size = 60;
  //   const padding = 15;

  //   // Links: ⬅️ ➡️
  //   this.leftBtn = {
  //     x: padding,
  //     y: canvas.height - size - padding,
  //     w: size,
  //     h: size,
  //     key: "LEFT",
  //     label: "⬅️",
  //   };
  //   this.rightBtn = {
  //     x: padding + size + 10,
  //     y: canvas.height - size - padding,
  //     w: size,
  //     h: size,
  //     key: "RIGHT",
  //     label: "➡️",
  //   };

  //   // Rechts: ⤴️ 🧴
  //   this.jumpBtn = {
  //     x: canvas.width - (size * 2 + padding + 10),
  //     y: canvas.height - size - padding,
  //     w: size,
  //     h: size,
  //     key: "UP",
  //     label: "⤴️",
  //   };
  //   this.throwBtn = {
  //     x: canvas.width - (size + padding),
  //     y: canvas.height - size - padding,
  //     w: size,
  //     h: size,
  //     key: "D",
  //     label: "🧴",
  //   };

  //   this.mobileButtons = [
  //     this.leftBtn,
  //     this.rightBtn,
  //     this.jumpBtn,
  //     this.throwBtn,
  //   ];

  //   this.mobileButtons.forEach((btn) => {
  //     ctx.fillStyle = "rgba(0,0,0,0.5)";
  //     ctx.fillRect(btn.x, btn.y, btn.w, btn.h);

  //     ctx.font = "28px Comic Sans MS";
  //     ctx.fillStyle = "white";
  //     ctx.textAlign = "center";
  //     ctx.textBaseline = "middle";
  //     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
  //   });
  // }

  // setupCanvasControls() {
  //   this.canvas.addEventListener("click", (e) => {
  //     const rect = this.canvas.getBoundingClientRect();
  //     const x = e.clientX - rect.left;
  //     const y = e.clientY - rect.top;

  //     this.mobileButtons.forEach((btn) => {
  //       if (
  //         x >= btn.x &&
  //         x <= btn.x + btn.w &&
  //         y >= btn.y &&
  //         y <= btn.y + btn.h
  //       ) {
  //         keyboard[btn.key] = true;

  //         // Nur kurz aktivieren (wie ein Klick)
  //         setTimeout(() => (keyboard[btn.key] = false), 200);
  //       }
  //     });
  //   });
  // }
  // drawMobileControls() {
  //   const ctx = this.ctx;
  //   const canvas = this.canvas;

  //   const size = 60;
  //   const padding = 15;

  //   // Links
  //   const leftBtn = { x: padding, y: canvas.height - size - padding, w: size, h: size, key: "LEFT", label: "⬅️" };
  //   const rightBtn = { x: padding + size + 10, y: canvas.height - size - padding, w: size, h: size, key: "RIGHT", label: "➡️" };

  //   // Rechts
  //   const jumpBtn = { x: canvas.width - (size * 2 + padding + 10), y: canvas.height - size - padding, w: size, h: size, key: "UP", label: "⤴️" };
  //   const throwBtn = { x: canvas.width - (size + padding), y: canvas.height - size - padding, w: size, h: size, key: "D", label: "🧴" };

  //   this.mobileButtons = [leftBtn, rightBtn, jumpBtn, throwBtn];

  //   this.mobileButtons.forEach(btn => {
  //     ctx.fillStyle = "rgba(0,0,0,0.6)";
  //     ctx.fillRect(btn.x, btn.y, btn.w, btn.h);

  //     ctx.font = "28px Comic Sans MS";
  //     ctx.fillStyle = "white";
  //     ctx.textAlign = "center";
  //     ctx.textBaseline = "middle";
  //     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
  //   });
  // }
  //   drawMobileControls() {
  //   const ctx = this.ctx;
  //   const canvas = this.canvas;

  //   const size = 60;      // Button-Größe
  //   const padding = 15;   // Abstand vom Rand

  //   // Links unten
  //   const leftBtn = { x: padding, y: canvas.height - size - padding, w: size, h: size, key: "LEFT", label: "⬅️" };
  //   const rightBtn = { x: padding + size + 10, y: canvas.height - size - padding, w: size, h: size, key: "RIGHT", label: "➡️" };

  //   // Rechts unten
  //   const jumpBtn = { x: canvas.width - (size * 2 + padding + 10), y: canvas.height - size - padding, w: size, h: size, key: "UP", label: "⤴️" };
  //   const throwBtn = { x: canvas.width - (size + padding), y: canvas.height - size - padding, w: size, h: size, key: "D", label: "🧴" };

  //   // 👉 Buttons merken für Klicks
  //   this.mobileButtons = [leftBtn, rightBtn, jumpBtn, throwBtn];

  //   this.mobileButtons.forEach(btn => {
  //     // Button-Hintergrund
  //     ctx.fillStyle = "rgba(0,0,0,0.5)";
  //     ctx.beginPath();
  //     ctx.arc(btn.x + btn.w / 2, btn.y + btn.h / 2, btn.w / 2, 0, Math.PI * 2);
  //     ctx.fill();

  //     // Symbol in der Mitte
  //     ctx.font = "28px Comic Sans MS";
  //     ctx.fillStyle = "white";
  //     ctx.textAlign = "center";
  //     ctx.textBaseline = "middle";
  //     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
  //   });
  // }
  // drawMobileControls() {
  //   const ctx = this.ctx;
  //   const h = this.canvas.height;
  //   const w = this.canvas.width;

  //   ctx.font = "32px Comic Sans MS";
  //   ctx.textAlign = "center";
  //   ctx.textBaseline = "middle";

  //   // 🎮 Links
  //   this.leftBtnArea = { x: 30, y: h - 80, width: 60, height: 60 };
  //   ctx.fillStyle = "rgba(0,0,0,0.5)";
  //   ctx.fillRect(this.leftBtnArea.x, this.leftBtnArea.y, this.leftBtnArea.width, this.leftBtnArea.height);
  //   ctx.fillStyle = "white";
  //   ctx.fillText("⬅️", this.leftBtnArea.x + this.leftBtnArea.width / 2, this.leftBtnArea.y + this.leftBtnArea.height / 2);

  //   // 🎮 Rechts
  //   this.rightBtnArea = { x: 110, y: h - 80, width: 60, height: 60 };
  //   ctx.fillStyle = "rgba(0,0,0,0.5)";
  //   ctx.fillRect(this.rightBtnArea.x, this.rightBtnArea.y, this.rightBtnArea.width, this.rightBtnArea.height);
  //   ctx.fillStyle = "white";
  //   ctx.fillText("➡️", this.rightBtnArea.x + this.rightBtnArea.width / 2, this.rightBtnArea.y + this.rightBtnArea.height / 2);

  //   // 🟢 Springen
  //   this.jumpBtnArea = { x: w - 140, y: h - 80, width: 60, height: 60 };
  //   ctx.fillStyle = "rgba(0,0,0,0.5)";
  //   ctx.fillRect(this.jumpBtnArea.x, this.jumpBtnArea.y, this.jumpBtnArea.width, this.jumpBtnArea.height);
  //   ctx.fillStyle = "white";
  //   ctx.fillText("⤴️", this.jumpBtnArea.x + this.jumpBtnArea.width / 2, this.jumpBtnArea.y + this.jumpBtnArea.height / 2);

  //   // 🧴 Werfen
  //   this.throwBtnArea = { x: w - 60, y: h - 80, width: 60, height: 60 };
  //   ctx.fillStyle = "rgba(0,0,0,0.5)";
  //   ctx.fillRect(this.throwBtnArea.x, this.throwBtnArea.y, this.throwBtnArea.width, this.throwBtnArea.height);
  //   ctx.fillStyle = "white";
  //   ctx.fillText("🧴", this.throwBtnArea.x + this.throwBtnArea.width / 2, this.throwBtnArea.y + this.throwBtnArea.height / 2);
  // }
  // drawMobileControls() {
  //   const ctx = this.ctx,
  //     w = this.canvas.width,
  //     h = this.canvas.height;
  //   ctx.font = "32px Comic Sans MS";
  //   ctx.textAlign = "center";
  //   ctx.textBaseline = "middle";

  //   this.leftBtnArea = { x: 30, y: h - 80, width: 60, height: 60, label: "⬅️" };
  //   this.rightBtnArea = {
  //     x: 100,
  //     y: h - 80,
  //     width: 60,
  //     height: 60,
  //     label: "➡️",
  //   };
  //   this.jumpBtnArea = {
  //     x: w - 140,
  //     y: h - 80,
  //     width: 60,
  //     height: 60,
  //     label: "⤴️",
  //   };
  //   this.throwBtnArea = {
  //     x: w - 60,
  //     y: h - 80,
  //     width: 60,
  //     height: 60,
  //     label: "🧴",
  //   };

  //   [
  //     this.leftBtnArea,
  //     this.rightBtnArea,
  //     this.jumpBtnArea,
  //     this.throwBtnArea,
  //   ].forEach((btn) => {
  //     ctx.fillStyle = "rgba(0,0,0,0.5)";
  //     ctx.beginPath();
  //     ctx.arc(
  //       btn.x + btn.width / 2,
  //       btn.y + btn.height / 2,
  //       btn.width / 2,
  //       0,
  //       Math.PI * 2
  //     );
  //     ctx.fill();

  //     ctx.fillStyle = "white";
  //     ctx.fillText(btn.label, btn.x + btn.width / 2, btn.y + btn.height / 2);
  //   });
  // }

  // // NEU
  // drawUIButtons() {
  //   const ctx = this.ctx;
  //   const w = this.canvas.width;

  //   ctx.font = "22px Comic Sans MS";
  //   ctx.textAlign = "center";
  //   ctx.textBaseline = "middle";

  //   // Bereiche definieren (rund gezeichnet, rechteckig geklickt)
  //   this.fullscreenBtnArea = {
  //     x: w - 180,
  //     y: 20,
  //     width: 50,
  //     height: 50,
  //     label: "🖥️",
  //   };
  //   this.soundBtnArea = {
  //     x: w - 120,
  //     y: 20,
  //     width: 50,
  //     height: 50,
  //     label: window.soundEnabled ? "🔊" : "🔇",
  //   };
  //   this.instrBtnArea = {
  //     x: w - 60,
  //     y: 20,
  //     width: 50,
  //     height: 50,
  //     label: "📖",
  //   };

  //   [this.fullscreenBtnArea, this.soundBtnArea, this.instrBtnArea].forEach(
  //     (btn) => {
  //       // runder Button
  //       ctx.fillStyle = "rgba(0,0,0,0.6)";
  //       ctx.beginPath();
  //       ctx.arc(
  //         btn.x + btn.width / 2,
  //         btn.y + btn.height / 2,
  //         btn.width / 2,
  //         0,
  //         Math.PI * 2
  //       );
  //       ctx.fill();

  //       // Icon
  //       ctx.fillStyle = "white";
  //       ctx.fillText(btn.label, btn.x + btn.width / 2, btn.y + btn.height / 2);
  //     }
  //   );
  // }

  drawMobileControls() {
    const ctx = this.ctx,
      w = this.canvas.width,
      h = this.canvas.height;

    ctx.font = "32px Comic Sans MS";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Steuer-Buttons (Klickflächen merken)
    this.leftBtnArea = { x: 30, y: h - 80, width: 60, height: 60, label: "⬅️" };
    this.rightBtnArea = {
      x: 100,
      y: h - 80,
      width: 60,
      height: 60,
      label: "➡️",
    };
    this.jumpBtnArea = {
      x: w - 140,
      y: h - 80,
      width: 60,
      height: 60,
      label: "⤴️",
    };
    this.throwBtnArea = {
      x: w - 60,
      y: h - 80,
      width: 60,
      height: 60,
      label: "🧴",
    };

    [
      this.leftBtnArea,
      this.rightBtnArea,
      this.jumpBtnArea,
      this.throwBtnArea,
    ].forEach((btn) => {
      // runder Button
      ctx.fillStyle = "#fca534ff";
      ctx.beginPath();
      ctx.arc(
        btn.x + btn.width / 2,
        btn.y + btn.height / 2,
        btn.width / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Icon
      ctx.fillStyle = "white";
      ctx.fillText(btn.label, btn.x + btn.width / 2, btn.y + btn.height / 2);
    });
  }

  // drawUIButtons() {
  //   const ctx = this.ctx, w = this.canvas.width;

  //   ctx.font = "22px Comic Sans MS";
  //   ctx.textAlign = "center";
  //   ctx.textBaseline = "middle";

  //   // UI Buttons oben rechts
  //   this.fullscreenBtnArea = { x: w - 180, y: 20, width: 50, height: 50, label: "🖥️" };
  //   this.soundBtnArea      = { x: w - 120, y: 20, width: 50, height: 50, label: (window.soundEnabled ? "🔊" : "🔇") };
  //   this.instrBtnArea      = { x: w -  60, y: 20, width: 50, height: 50, label: "📖" };

  //   [this.fullscreenBtnArea, this.soundBtnArea, this.instrBtnArea].forEach(btn => {
  //     ctx.fillStyle = "rgba(0,0,0,0.6)";
  //     ctx.beginPath();
  //     ctx.arc(btn.x + btn.width/2, btn.y + btn.height/2, btn.width/2, 0, Math.PI*2);
  //     ctx.fill();

  //     ctx.fillStyle = "white";
  //     ctx.fillText(btn.label, btn.x + btn.width/2, btn.y + btn.height/2);
  //   });
  // }
  // drawUIButtons() {
  //   const ctx = this.ctx;
  //   const w = this.canvas.width;
  //   const h = this.canvas.height;

  //   // Größe relativ zur Höhe (z. B. 10% der Höhe → passt bei Rotation)
  //   const btnSize = h * 0.1; // 10% von Canvas-Höhe
  //   const margin = 20;

  //   ctx.font = `${btnSize * 0.5}px Comic Sans MS`; // Schriftgröße relativ
  //   ctx.textAlign = "center";
  //   ctx.textBaseline = "middle";

  //   // Positionen (rechts oben nebeneinander)
  //   this.fullscreenBtnArea = {
  //     x: w - (btnSize * 3) - margin,
  //     y: margin,
  //     width: btnSize,
  //     height: btnSize,
  //     label: "🖥️"
  //   };

  //   this.soundBtnArea = {
  //     x: w - (btnSize * 2) - margin,
  //     y: margin,
  //     width: btnSize,
  //     height: btnSize,
  //     label: (window.soundEnabled ? "🔊" : "🔇")
  //   };

  //   this.instrBtnArea = {
  //     x: w - btnSize - margin,
  //     y: margin,
  //     width: btnSize,
  //     height: btnSize,
  //     label: "📖"
  //   };

  //   // Zeichnen aller Buttons
  //   [this.fullscreenBtnArea, this.soundBtnArea, this.instrBtnArea].forEach(btn => {
  //     // runder Hintergrund
  //     ctx.fillStyle = "rgba(0,0,0,0.6)";
  //     ctx.beginPath();
  //     ctx.arc(
  //       btn.x + btn.width / 2,
  //       btn.y + btn.height / 2,
  //       btn.width / 2,
  //       0,
  //       Math.PI * 2
  //     );
  //     ctx.fill();

  //     // Symbol
  //     ctx.fillStyle = "white";
  //     ctx.fillText(btn.label, btn.x + btn.width / 2, btn.y + btn.height / 2);
  //   });
  // }

  //   setupCanvasControls() {
  //     this.canvas.addEventListener("click", (e) => {
  //       const rect = this.canvas.getBoundingClientRect();
  //       const x = e.clientX - rect.left;
  //       const y = e.clientY - rect.top;

  //       this.mobileButtons.forEach(btn => {
  //         if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
  //           this.keyboard[btn.key] = true;
  //           setTimeout(() => (this.keyboard[btn.key] = false), 200);
  //         }
  //       });
  //     });

  // }
  // setupCanvasControls() {
  //   this.canvas.addEventListener("click", (e) => {
  //     const rect = this.canvas.getBoundingClientRect();
  //     const x = e.clientX - rect.left;
  //     const y = e.clientY - rect.top;

  //     this.mobileButtons.forEach(btn => {
  //       if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
  //         this.keyboard[btn.key] = true;
  //         setTimeout(() => (this.keyboard[btn.key] = false), 150); // kurze Eingabe
  //       }
  //     });
  //   });
  // }
  // setupCanvasControls() {
  //   const handleDown = (x, y) => {
  //     if (this.leftBtnArea && this.isInsideButton(x, y, this.leftBtnArea)) {
  //       this.keyboard.LEFT = true;
  //     }
  //     if (this.rightBtnArea && this.isInsideButton(x, y, this.rightBtnArea)) {
  //       this.keyboard.RIGHT = true;
  //     }
  //     if (this.jumpBtnArea && this.isInsideButton(x, y, this.jumpBtnArea)) {
  //       this.keyboard.UP = true;
  //     }
  //     if (this.throwBtnArea && this.isInsideButton(x, y, this.throwBtnArea)) {
  //       this.keyboard.D = true;
  //     }
  //   };

  //   const handleUp = () => {
  //     this.keyboard.LEFT = false;
  //     this.keyboard.RIGHT = false;
  //     this.keyboard.UP = false;
  //     this.keyboard.D = false;
  //   };

  //   // 🖱️ Klick mit Maus
  //   this.canvas.addEventListener("mousedown", (e) => {
  //     const rect = this.canvas.getBoundingClientRect();
  //     handleDown(e.clientX - rect.left, e.clientY - rect.top);
  //   });

  //   this.canvas.addEventListener("mouseup", handleUp);

  //   // 📱 Touch
  //   this.canvas.addEventListener("touchstart", (e) => {
  //     const rect = this.canvas.getBoundingClientRect();
  //     for (let touch of e.touches) {
  //       handleDown(touch.clientX - rect.left, touch.clientY - rect.top);
  //     }
  //     e.preventDefault();
  //   }, { passive: false });

  //   this.canvas.addEventListener("touchend", handleUp);
  //   this.canvas.addEventListener("touchcancel", handleUp);
  // }
  // In World-Klasse
  // setupCanvasControls() {
  //   const toCanvasXY = (e) => {
  //     const rect = this.canvas.getBoundingClientRect();
  //     // Skaliere von CSS-Pixeln in Canvas-Pixel
  //     const scaleX = this.canvas.width / rect.width;
  //     const scaleY = this.canvas.height / rect.height;

  //     // PointerEvent (desktop & moderne mobile Browser)
  //     if ('clientX' in e) {
  //       return {
  //         x: (e.clientX - rect.left) * scaleX,
  //         y: (e.clientY - rect.top)  * scaleY
  //       };
  //     }
  //     // Fallback: TouchEvent (ältere Safari)
  //     const t = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]);
  //     if (t) {
  //       return {
  //         x: (t.clientX - rect.left) * scaleX,
  //         y: (t.clientY - rect.top)  * scaleY
  //       };
  //     }
  //     return { x: 0, y: 0 };
  //   };

  //   const handleDown = (e) => {
  //     if (e.cancelable) e.preventDefault(); // verhindert Scroll/Zoom
  //     const { x, y } = toCanvasXY(e);

  //     // prüfen gegen gespeicherte Areas (width/height!)
  //     if (this.leftBtnArea && this.isInsideButton(x, y, this.leftBtnArea))  this.keyboard.LEFT  = true;
  //     if (this.rightBtnArea && this.isInsideButton(x, y, this.rightBtnArea)) this.keyboard.RIGHT = true;
  //     if (this.jumpBtnArea && this.isInsideButton(x, y, this.jumpBtnArea))  this.keyboard.UP    = true;
  //     if (this.throwBtnArea && this.isInsideButton(x, y, this.throwBtnArea)) this.keyboard.D     = true;
  //   };

  //   const handleUpAll = () => {
  //     this.keyboard.LEFT  = false;
  //     this.keyboard.RIGHT = false;
  //     this.keyboard.UP    = false;
  //     this.keyboard.D     = false;
  //   };

  //   // Pointer (empfohlen, deckt Maus & Touch ab in modernen Browsern)
  //   this.canvas.addEventListener('pointerdown', handleDown, { passive: false });
  //   this.canvas.addEventListener('pointerup',   handleUpAll);
  //   this.canvas.addEventListener('pointercancel', handleUpAll);
  //   this.canvas.addEventListener('pointerleave',  handleUpAll);

  //   // Fallback für ältere iOS/Safari
  //   this.canvas.addEventListener('touchstart', handleDown, { passive: false });
  //   this.canvas.addEventListener('touchend',   handleUpAll, { passive: false });
  //   this.canvas.addEventListener('touchcancel',handleUpAll, { passive: false });

  //   // Optional: Maus
  //   this.canvas.addEventListener('mousedown', handleDown);
  //   this.canvas.addEventListener('mouseup',   handleUpAll);
  // }

  // // Rechteck-Hit-Test (achte auf width/height, nicht w/h)
  // isInsideButton(x, y, btn) {
  //   return (
  //     x >= btn.x && x <= btn.x + btn.width &&
  //     y >= btn.y && y <= btn.y + btn.height
  //   );
  // }

  // // ✅ Hilfsfunktion: Prüfen, ob (x, y) in einem Button liegt
  // isInsideButton(x, y, btn) {
  //   return (
  //     x >= btn.x &&
  //     x <= btn.x + btn.width &&
  //     y >= btn.y &&
  //     y <= btn.y + btn.height
  //   );
  // }

  // // Hilfsfunktion: Canvas-Koordinaten mit CSS-Skalierung korrekt umrechnen
  // toCanvasXY(e) {
  //   const rect = this.canvas.getBoundingClientRect();
  //   const scaleX = this.canvas.width / rect.width;
  //   const scaleY = this.canvas.height / rect.height;

  //   let clientX, clientY;
  //   if (e.touches && e.touches[0]) {
  //     clientX = e.touches[0].clientX;
  //     clientY = e.touches[0].clientY;
  //   } else if (e.changedTouches && e.changedTouches[0]) {
  //     clientX = e.changedTouches[0].clientX;
  //     clientY = e.changedTouches[0].clientY;
  //   } else {
  //     clientX = e.clientX;
  //     clientY = e.clientY;
  //   }

  //   return {
  //     x: (clientX - rect.left) * scaleX,
  //     y: (clientY - rect.top) * scaleY,
  //   };
  // }
  // Koordinaten von CSS-Pixeln → Canvas-Pixel umrechnen
  toCanvasXY(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    let clientX, clientY;
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches[0]) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  // // Rechteck-Hit-Test
  // isInsideButton(x, y, btn) {
  //   return (
  //     btn &&
  //     x >= btn.x &&
  //     x <= btn.x + btn.width &&
  //     y >= btn.y &&
  //     y <= btn.y + btn.height
  //   );
  // }

  // setupCanvasControls() {
  //   if (this.uiClickListenerAdded) return;
  //   this.uiClickListenerAdded = true;

  //   const handleDown = (e) => {
  //     if (e.cancelable) e.preventDefault();
  //     const { x, y } = this.toCanvasXY(e);

  //     // 🕹️ Mobile-Steuerung (links/rechts/sprung/werfen)
  //     if (this.leftBtnArea && this.isInsideButton(x, y, this.leftBtnArea))
  //       this.keyboard.LEFT = true;
  //     if (this.rightBtnArea && this.isInsideButton(x, y, this.rightBtnArea))
  //       this.keyboard.RIGHT = true;
  //     if (this.jumpBtnArea && this.isInsideButton(x, y, this.jumpBtnArea))
  //       this.keyboard.UP = true;
  //     if (this.throwBtnArea && this.isInsideButton(x, y, this.throwBtnArea))
  //       this.keyboard.D = true;

  //     // 🎛️ UI-Buttons (oben rechts)
  //     if (
  //       this.fullscreenBtnArea &&
  //       this.isInsideButton(x, y, this.fullscreenBtnArea)
  //     ) {
  //       // nutzt deine Funktion aus game.js
  //       toggleFullscreen(this.canvas);
  //     }
  //     if (this.soundBtnArea && this.isInsideButton(x, y, this.soundBtnArea)) {
  //       // toggelt globalen soundEnabled + leitet an world.toggleSound (falls vorhanden)
  //       toggleSound();
  //     }
  //     if (this.instrBtnArea && this.isInsideButton(x, y, this.instrBtnArea)) {
  //       showInstructions();
  //     }
  //   };

  //   const handleUpAll = () => {
  //     this.keyboard.LEFT = false;
  //     this.keyboard.RIGHT = false;
  //     this.keyboard.UP = false;
  //     this.keyboard.D = false;
  //   };

  //   // Moderne Pointer-Events (decken Maus & Touch ab)
  //   this.canvas.addEventListener("pointerdown", handleDown, { passive: false });
  //   this.canvas.addEventListener("pointerup", handleUpAll);
  //   this.canvas.addEventListener("pointercancel", handleUpAll);
  //   this.canvas.addEventListener("pointerleave", handleUpAll);

  //   // Fallback für ältere Safari/iOS
  //   this.canvas.addEventListener("touchstart", handleDown, { passive: false });
  //   this.canvas.addEventListener("touchend", handleUpAll, { passive: false });
  //   this.canvas.addEventListener("touchcancel", handleUpAll, {
  //     passive: false,
  //   });

  //   // Optional: klassische Maus
  //   this.canvas.addEventListener("mousedown", handleDown);
  //   this.canvas.addEventListener("mouseup", handleUpAll);
  // }
  // Rechteck-Hit-Test
  isInsideButton(x, y, btn) {
    return (
      btn &&
      x >= btn.x &&
      x <= btn.x + btn.width &&
      y >= btn.y &&
      y <= btn.y + btn.height
    );
  }

  // EINMAL registrieren!
  setupCanvasControls() {
    if (this.uiClickListenerAdded) return;
    this.uiClickListenerAdded = true;

    const handleDown = (e) => {
      if (e.cancelable) e.preventDefault();
      const { x, y } = this.toCanvasXY(e);

      // 🕹️ Steuer-Buttons
      if (this.leftBtnArea && this.isInsideButton(x, y, this.leftBtnArea))
        this.keyboard.LEFT = true;
      if (this.rightBtnArea && this.isInsideButton(x, y, this.rightBtnArea))
        this.keyboard.RIGHT = true;
      if (this.jumpBtnArea && this.isInsideButton(x, y, this.jumpBtnArea))
        this.keyboard.UP = true;
      if (this.throwBtnArea && this.isInsideButton(x, y, this.throwBtnArea))
        this.keyboard.D = true;

      // // 🎛️ UI-Buttons
      // if (this.fullscreenBtnArea && this.isInsideButton(x, y, this.fullscreenBtnArea)) {
      //   // nutzt deine Funktion aus game.js (nur 1x definiert!)
      //   toggleFullscreen(this.canvas);
      // }
      // if (this.soundBtnArea && this.isInsideButton(x, y, this.soundBtnArea)) {
      //   toggleSound(); // setzt global soundEnabled und ruft world.toggleSound(soundEnabled), wenn vorhanden
      // }
      // if (this.instrBtnArea && this.isInsideButton(x, y, this.instrBtnArea)) {
      //   showInstructions();
      // }
    };

    const handleUpAll = () => {
      this.keyboard.LEFT = false;
      this.keyboard.RIGHT = false;
      this.keyboard.UP = false;
      this.keyboard.D = false;
    };

    // Moderne Pointer-Events (decken Maus & Touch ab)
    this.canvas.addEventListener("pointerdown", handleDown, { passive: false });
    this.canvas.addEventListener("pointerup", handleUpAll);
    this.canvas.addEventListener("pointercancel", handleUpAll);
    this.canvas.addEventListener("pointerleave", handleUpAll);

    // Fallback für ältere Safari/iOS
    this.canvas.addEventListener("touchstart", handleDown, { passive: false });
    this.canvas.addEventListener("touchend", handleUpAll, { passive: false });
    this.canvas.addEventListener("touchcancel", handleUpAll, {
      passive: false,
    });

    // Optional: Maus
    this.canvas.addEventListener("mousedown", handleDown);
    this.canvas.addEventListener("mouseup", handleUpAll);
  }

  addObjectsToMap(objects) {
    if (!Array.isArray(objects)) return;
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  addToMap(mo) {
    if (!mo) return;

    if (mo.otherDirection) this.flipImage(mo);

    mo.draw(this.ctx);
    mo.drawFrame?.(this.ctx);

    if (mo.otherDirection) this.flipImageBack(mo);
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    this.ctx.restore();
    mo.x = mo.x * -1;
  }
}
