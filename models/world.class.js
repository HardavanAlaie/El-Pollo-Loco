class World {
  //character = new Character();
  characterDead = false;
  playerDied = false; //  unterscheidet "Tod" von "Endboss geschafft"
  endbossDefeated = false;

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
    this.level = allLevels[this.currentLevelIndex];
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

  // run() {
  //   //console.log("Aktuelle Gegnerliste(run):", this.level.enemies);

  //   this.gameInterval = setInterval(() => {
  //     if (!this.levelEnded) {
  //       this.checkCollisions();
  //       this.checkThrowableObjects();
  //       this.checkEndbossDefeated();
  //       this.removeOffscreenEnemies();
  //       this.checkEndboss1Hit();
  //       this.checkEndboss2Hit();
  //     }
  //   }, 200);
  // }
  run() {
  this.gameInterval = setInterval(() => {
    if (!this.levelEnded) {
      this.checkCollisions();
      this.checkThrowableObjects();
      this.checkEndbossDefeated();
      this.removeOffscreenEnemies();
      this.checkEndboss1Hit();
      this.checkEndboss2Hit();
    }

    // 💀 Wenn Spieler tot ist, zeige Game Over Screen
    if (this.character.isDead() && !this.gameOver) {
      this.gameOver = true;
      clearInterval(this.gameInterval);  // Stoppt die Spiel-Logik
      cancelAnimationFrame(this.animationFrameId); // Falls du draw() mit requestAnimationFrame benutzt
      this.showGameOverScreen(); // Zeige Game Over Bild und Button
    }
  }, 200);
}


  checkEndboss1Hit() {
    if (
      !this.character.isHurt() &&
      this.character.isColliding(
        this.level.enemies.find((e) => e instanceof EndbossLevel1 || e instanceof EndbossLevel2)
      )
    ) {
      this.character.hit();
    }
  }

  checkEndboss2Hit() {
    if (
      !this.character.isHurt() &&
      this.character.isColliding(
        this.level.enemies.find((e) => e instanceof EndbossLevel2)
      )
    ) {
      this.character.hit();
    }
  }

  checkThrowableObjects() {
    this.throwableObjects = this.throwableObjects.filter(
      (bottle) => !bottle.isDead?.()
    );

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
      if (this.character.isColliding(enemy)) {
        const characterBottom = this.character.y + this.character.height;
        const characterVerticalSpeed = this.character.speedY;
        const enemyTop = enemy.y + enemy.height * 0.3;

        const isAboveEnemy =
          characterBottom <= enemyTop + 10 && characterVerticalSpeed >= 0;

        if (isAboveEnemy) {
          enemy.hit();
          enemy.playDeathAnimation?.();

          // if (enemy.isDead?.()) {
          //   const i = this.level.enemies.indexOf(enemy);
          //   if (i >= 0) this.level.enemies.splice(i, 1);
          // }
          if (enemy.isDead?.()) {
            if (enemy instanceof EndbossLevel1 || enemy instanceof EndbossLevel2) {
              enemy.isMarkedDead = true;
            } else {
              const i = this.level.enemies.indexOf(enemy);
              if (i >= 0) this.level.enemies.splice(i, 1);
            }
          }

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
    });

    this.throwableObjects.forEach((bottle) => {
      (this.level.enemies || []).forEach((enemy) => {
        if (!bottle.isBroken && bottle.isColliding(enemy)) {
          bottle.break();
          enemy.hit();

          // if (enemy.isDead?.()) {
          //   const i = this.level.enemies.indexOf(enemy);
          //   if (i >= 0) this.level.enemies.splice(i, 1);
          // }
          if (enemy.isDead?.()) {
            if (enemy instanceof EndbossLevel1 || enemy instanceof EndbossLevel2) {
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

    (this.collectableCoins || []).forEach((coin) => {
      if (this.character.isColliding(coin)) {
        this.statusBarCoin.availableCoins++;
        this.collectableCoins.splice(this.collectableCoins.indexOf(coin), 1);
        this.statusBarCoin.update?.();
      }
    });
  }

  // endGame() {
  //   clearInterval(this.gameInterval); // stoppe alle Intervall-Schleifen
  //   cancelAnimationFrame(this.animationFrame); // stoppe Zeichnung, falls nötig
  //   this.levelEnded = true;
  // }
  endGame() {
    clearInterval(this.gameInterval);
    clearInterval(this.enemySpawnInterval);
    //cancelAnimationFrame(this.animationFrame);
    this.levelEnded = true;
    this.gameOver = true;
    this.playerDied = true;
  }

  checkEndbossDefeated() {
    const endboss = this.level.enemies.find((e) => e instanceof EndbossLevel1 || e instanceof EndbossLevel2);
    //console.log("Endboss gefunden:", endboss);

    if (!endboss) return;

    if (endboss.isDead() && !this.endbossDefeated && !this.playerDied) {
      console.log("✅ Endboss besiegt – nächstes Level wird geladen!");
      this.endbossDefeated = true;
      this.levelEnded = true;
      this.showLevelMessage("🎉 Level 1 geschafft! Weiter geht's...");

      setTimeout(() => {
        this.loadNextLevel();
      }, 3000);
    }
  }

  //   spawnEnemyLoop() {
  //   const spawnConfig = this.level.config?.spawnConfig || [];

  //   this.spawnIntervals = [];

  //   spawnConfig.forEach((config) => {
  //     const intervalId = setInterval(() => {
  //       const endbossAlive = this.level.enemies.some(
  //         (e) =>
  //           (e instanceof EndbossLevel1 || e instanceof EndbossLevel2) &&
  //           !e.isDead()
  //       );

  //       if (!endbossAlive) {
  //         clearInterval(intervalId);
  //         return;
  //       }

  //       const currentEnemies = this.level.enemies.filter(
  //         (e) => e instanceof config.type
  //       );

  //       if (currentEnemies.length < config.maxCount) {
  //         const enemy = new config.type();
  //         enemy.x = 900 + Math.random() * 400;
  //         this.level.enemies.push(enemy);
  //         //console.log(`Spawned: ${config.type.name}`);
  //       }

  //     }, config.interval);

  //     this.spawnIntervals.push(intervalId);
  //   });
  // }
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

  showLevelMessage(message) {
    this.levelMessage = message;

    if (this.levelMessageTimeout) clearTimeout(this.levelMessageTimeout);

    this.levelMessageTimeout = setTimeout(() => {
      this.levelMessage = "";
    }, 3000);
  }

  loadNextLevel() {
    this.currentLevelIndex++;

    if (this.currentLevelIndex >= allLevels.length) {
      console.log("🏁 Spiel beendet – alle Levels abgeschlossen!");
      this.showLevelMessage("🏁 Du hast das Spiel gewonnen!");
      this.levelEnded = true;
      return;
    }

    this.level = allLevels[this.currentLevelIndex];
    this.enemies = this.level.enemies;
    this.clouds = this.level.clouds;
    this.backgroundObjects = this.level.backgroundObjects;
    this.collectableBottles = this.level.collectableObjects || [];
    this.collectableCoins = this.level.collectableCoins || [];
    //this.levelEnded = false;

    // WICHTIG:
    // Flags & Status zurücksetzen
    // this.characterDead = false;
    // this.playerDied = false;
    // this.endbossDefeated = false;
    // this.throwableObjects = [];
    // this.statusBarBottle.availableBottles = 3;
    // this.statusBarCoin.availableCoins = 0;
    // this.statusBarBottle.update?.();
    // this.statusBarCoin.update?.();
    // this.statusBar.setPercentage(100);
    this.playerDied = false;
    this.endbossDefeated = false;
    this.levelEnded = false;
    this.throwableObjects = [];

    this.statusBarBottle.availableBottles = 3;
    this.statusBarCoin.availableCoins = 0;
    this.statusBar.setPercentage(100);
    this.statusBarBottle.update?.();
    this.statusBarCoin.update?.();

    this.character.x = 100;
    this.character.y = 185;
    this.camera_x = 0;

    clearInterval(this.gameInterval);
    this.run();

    this.showLevelMessage(`🚀 Level ${this.currentLevelIndex + 1} beginnt!`);

    this.spawnEnemyLoop();
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

  showGameOverScreen() {
  // Game Over Bild
  const gameOverImage = document.createElement("img");
  gameOverImage.src = "img/You won, you lost/Game Over.png";
  gameOverImage.style.position = "absolute";
  gameOverImage.style.top = "20%";
  gameOverImage.style.left = "50%";
  gameOverImage.style.transform = "translate(-50%, -50%)";
  gameOverImage.style.zIndex = "998";
  gameOverImage.style.width = "60%";
  gameOverImage.id = "gameOverImage";

  // Restart Button
  const button = document.createElement("button");
  button.innerText = "🔁 Spiel neu starten";
  button.id = "restartButton";
  button.style.position = "absolute";
  button.style.top = "60%";
  button.style.left = "50%";
  button.style.transform = "translate(-50%, -50%)";
  button.style.padding = "15px 30px";
  button.style.fontSize = "20px";
  button.style.backgroundColor = "#ff4444";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "10px";
  button.style.cursor = "pointer";
  button.style.boxShadow = "0 0 10px black";
  button.style.zIndex = "999";

  button.addEventListener("click", () => {
    location.reload();
  });

  // Zur Seite hinzufügen
  document.body.appendChild(gameOverImage);
  document.body.appendChild(button);
}


  draw() {
    console.log("characterDead:", this.characterDead);
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

    if (this.playerDied) {
      this.showRestartOverlay();
    }

    // if (!this.playerDied && !this.endbossDefeated) {
    //   this.animationFrame = requestAnimationFrame(() => this.draw());
    // }
    // draw() ganz am Ende:
    if (!this.playerDied) {
      this.animationFrame = requestAnimationFrame(() => this.draw());
    }

    // if (this.characterDead) {
    //   this.showRestartOverlay();
    // } else {
    //   this.animationFrame = requestAnimationFrame(() => this.draw());
    // }
    // if (this.gameOver) {
    //   this.showRestartOverlay(); // Nur wenn echtes Game Over (Tod)
    // } else {
    //   this.animationFrame = requestAnimationFrame(() => this.draw());
    // }

    //requestAnimationFrame(() => this.draw());
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
