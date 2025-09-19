class World {
  //character = new Character();
  characterDead = false;
  playerDied = false; //  unterscheidet "Tod" von "Endboss geschafft"
  endbossDefeated = false;
  uiScreen = null; // "gameover" | "win" | null

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

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    //this.character = character; // Spieler speichern

    this.currentLevelIndex = 0;
    //this.level = allLevels[this.currentLevelIndex];
    this.level = level1(this); // 👈 Welt reinreichen

    //this.level = level;
    // Character wird hier erstellt – World (this) wird übergeben!
    this.character = new Character(this);
    this.enemies = this.level.enemies;
    this.clouds = this.level.clouds;
    this.backgroundObjects = this.level.backgroundObjects;
    this.collectableBottles = this.level.collectableObjects || [];
    this.collectableCoins = this.level.collectableCoins || [];
    this.levelEnded = false;

    this.setWorld();
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

      // 💀 Wenn Spieler tot ist, zeige Game Over Screen EINMAL
      if (this.playerDied && !this.gameOver) {
        this.gameOver = true;
        this.stopGameLoopHard(); // alles anhalten
        //this.uiScreen = "gameover";
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
        // StatusBar hochzählen
        if (this.statusBarCoin) {
          this.statusBarCoin.availableCoins++;
          this.statusBarCoin.update();
        }

        // 🎵 Coin-Sound direkt hier abspielen
        const coinSound = new Audio("audio/coins.mp3");
        coinSound.volume = 0.5;
        coinSound.play().catch(() => {});

        // Coin entfernen
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

      // ✅ neue Berechnung für die "von oben"-Hitbox
      let enemyTop = enemy.y + enemy.height * (enemy.height < 100 ? 0.7 : 0.25);
      let extraOffset = enemy.height < 100 ? 25 : 15;

      // Debug-Ausgabe in Konsole
      console.log("enemyTop:", enemyTop, "extraOffset:", extraOffset);

      // ✅ grüne Zone zeichnen
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

      // ✅ Kollisionslogik
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
        // ❌ nicht mehr sofort entfernen
        enemy.die?.(); // ChickenSmall kümmert sich selbst ums Entfernen
      }
    }
  }

  endGame() {
    // ⏹️ Alle Intervalle stoppen
    clearInterval(this.gameInterval);
    clearInterval(this.enemySpawnInterval);
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    // 🏁 Status setzen
    this.levelEnded = true;
    this.gameOver = true;
    this.playerDied = true;
    this.uiScreen = "gameover";

    // ⏹️ Boss-Schrei sicher stoppen
    this.stopEnemySounds();

    // 🎵 GameOver-Sound abspielen
    if (!this.gameOverSound) {
      this.gameOverSound = new Audio("audio/gameover.mp3");
      this.gameOverSound.volume = 0.7;
    }
    this.gameOverSound.currentTime = 0;
    this.gameOverSound.play().catch((e) => {
      console.warn("Konnte GameOver-Sound nicht abspielen:", e);
    });

    // 📺 Game Over Screen zeichnen
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

      // Alles anhalten
      this.stopGameLoopHard();

      // Flag setzen, damit draw() nicht mehr weiterläuft
      this.uiScreen = "win";

      // Direkt den Win-Screen anzeigen
      this.showWinScreen();
    }
  }

  stopGameLoopHard() {
    console.log("⏹️ Stoppe komplettes Spiel");

    // Alle Timer killen
    clearInterval(this.gameInterval);
    clearInterval(this.enemySpawnInterval);

    // ❌ KEIN cancelAnimationFrame hier!
    // cancelAnimationFrame(this.animationFrameId);

    // Flags setzen
    this.levelEnded = true;
    this.gameOver = true;
  }

  spawnEnemyLoop() {
    const spawnConfigs = this.level.config?.spawnConfig || [];
    this.spawnIntervals = [];

    spawnConfigs.forEach((config) => {
      const intervalId = setInterval(() => {
        // Bedingung prüfen (optional)
        const allowed =
          typeof config.condition === "function"
            ? config.condition(this.level)
            : true;

        if (!allowed) {
          return;
        }

        // Aktuelle Anzahl dieser Gegner zählen
        const current = this.level.enemies.filter(
          (e) => e instanceof config.type
        );

        if (current.length < config.maxCount) {
          const newEnemy = new config.type();
          newEnemy.x = 900 + Math.random() * 400;
          this.level.enemies.push(newEnemy);
          // console.log(`Spawned ${config.type.name}`);
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
    let x = Math.floor(Math.random() * 1700) + 300; // zwischen 300 und 2000
    let y = Math.random() < 0.5 ? 300 : 350; // zufällige Höhe
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

    // Kamera zurücksetzen
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Hintergrund abdunkeln
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ⏹️ Endboss-Sounds stoppen (falls noch aktiv)
    this.stopEnemySounds();

    // 🎵 Win-Sound abspielen (Loop)
    if (!this.winSound) {
      this.winSound = new Audio("audio/win.mp3");
      this.winSound.volume = 0.7;
      this.winSound.loop = true; // ✅ Dauerschleife
    }
    this.winSound.currentTime = 0;
    this.winSound.play().catch((e) => {
      console.warn("Konnte Win-Sound nicht abspielen:", e);
    });

    // Bild laden
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

    // 🟩 Button zeichnen
    const buttonWidth = 250;
    const buttonHeight = 60;
    const buttonX = canvas.width / 2 - buttonWidth / 2;
    const buttonY = canvas.height / 2;

    ctx.fillStyle = "#44cc44"; // Grün
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    ctx.font = "24px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Spiel neu starten", canvas.width / 2, buttonY + 38);

    // Klickbereich speichern
    this.restartButtonArea = {
      x: buttonX,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight,
    };

    if (!this.canvasClickListenerAdded) {
      canvas.addEventListener("click", this.handleCanvasClick.bind(this));
      this.canvasClickListenerAdded = true;
    }
  }

  showGameOverScreen() {
    const ctx = this.ctx;
    const canvas = this.canvas;

    // 🎵 Game Over Sound abspielen
    if (!this.gameOverSound) {
      this.gameOverSound = new Audio("audio/gameover.mp3");
      this.gameOverSound.volume = 0.6;
    }
    this.gameOverSound.currentTime = 0;
    this.gameOverSound.play().catch((e) => {
      console.warn("GameOver-Sound konnte nicht abgespielt werden:", e);
    });

    // 🎨 Hintergrund abdunkeln
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

      // 🟥 Button zeichnen
      const buttonWidth = 250;
      const buttonHeight = 60;
      const buttonX = canvas.width / 2 - buttonWidth / 2;
      const buttonY = canvas.height / 2;

      ctx.fillStyle = "#fca534ff";
      ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

      ctx.font = "24px Comic Sans MS";
      ctx.fillStyle = "white";
      ctx.fillText("Spiel neu starten", canvas.width / 2, buttonY + 38);

      this.restartButtonArea = {
        x: buttonX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight,
      };

      if (!this.canvasClickListenerAdded) {
        canvas.addEventListener("click", this.handleCanvasClick.bind(this));
        this.canvasClickListenerAdded = true;
      }
    };
  }

  handleCanvasClick(event) {
    if (!this.restartButtonArea) return;

    const rect = this.canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const btn = this.restartButtonArea;

    if (
      clickX >= btn.x &&
      clickX <= btn.x + btn.width &&
      clickY >= btn.y &&
      clickY <= btn.y + btn.height
    ) {
      location.reload(); // 🔄 Spiel neu laden
    }
  }

//   toggleSound(enabled) {
//   if (this.endboss?.screamSound) {
//     this.endboss.screamSound.muted = !enabled;
//   }
//   if (this.gameOverSound) {
//     this.gameOverSound.muted = !enabled;
//   }
//   if (this.winSound) {
//     this.winSound.muted = !enabled;
//   }
//   if (this.character?.jumpSound) {
//     this.character.jumpSound.muted = !enabled;
//   }
//   if (this.character?.coinSound) {
//     this.character.coinSound.muted = !enabled;
//   }
// }
toggleSound(enabled) {
  // Endboss
  if (this.endboss?.screamSound) {
    this.endboss.screamSound.muted = !enabled;
  }

  // Game Over
  if (this.gameOverSound) {
    this.gameOverSound.muted = !enabled;
  }

  // Win
  if (this.winSound) {
    this.winSound.muted = !enabled;
  }

  // Character Sounds
  if (this.character?.jumpSound) {
    this.character.jumpSound.muted = !enabled;
  }
  if (this.character?.coinSound) {
    this.character.coinSound.muted = !enabled;
  }
}



  draw() {
    if (this.playerDied) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.showGameOverScreen(); // ← Das musst du definieren
      return; // 🛑 Alles andere überspringen
    }

    console.log("characterDead:", this.characterDead);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects || []);
    // (this.level.backgroundObjects || []).forEach((obj) => {
    //   obj.draw(this.ctx, this.camera_x);
    // });

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
    //this.addObjectsToMap(this.clouds || []);
    //this.addObjectsToMap(this.enemies || []);
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

    if (!this.playerDied && !this.endbossDefeated) {
      this.animationFrame = requestAnimationFrame(() => this.draw());
    }
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
