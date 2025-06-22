class World {
  character = new Character();
  characterDead = false;
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
  levelMessage = ""; // 👈 Textanzeige für Hinweise
  levelMessageTimeout = null; // Timeout für automatische Ausblendung

  currentLevelIndex = 0; // Neu: Level-Zähler
  level = allLevels[this.currentLevelIndex]; // allLevels muss global definiert sein
  enemies = this.level.enemies;
  cloud = this.level.cloud;
  backgroundObjects = this.level.backgroundObjects;
  collectableBottles = this.level.collectableObjects || [];
  collectableCoins = this.level.collectableCoins || [];

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

    this.currentLevelIndex = 0; // 🔥 Wichtig!
    this.level = allLevels[this.currentLevelIndex];
    this.enemies = this.level.enemies;
    this.cloud = this.level.cloud;
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
  }

  run() {
    console.log("Aktuelle Gegnerliste(run):", this.level.enemies);

    this.gameInterval = setInterval(() => {
      if (!this.levelEnded) {
        this.checkCollisions();
        this.checkThrowableObjects();
        this.checkEndbossDefeated();
      }
    }, 200);
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

          if (enemy.isDead?.()) {
            const i = this.level.enemies.indexOf(enemy);
            if (i >= 0) this.level.enemies.splice(i, 1);
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
            if (enemy instanceof EndbossLevel1) {
              // 🟡 Nur markieren – NICHT löschen
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

  endGame() {
    clearInterval(this.gameInterval); // stoppe alle Intervall-Schleifen
    cancelAnimationFrame(this.animationFrame); // stoppe Zeichnung, falls nötig
    this.levelEnded = true;
  }

  checkEndbossDefeated() {
    const endboss = this.level.enemies.find((e) => e instanceof EndbossLevel1);

    if (endboss && endboss.isDead() && !this.levelEnded) {
      console.log("✅ Endboss besiegt – nächstes Level wird geladen!");
      this.levelEnded = true;

      // 🎉 Hinweis anzeigen
      this.showLevelMessage("🎉 Level 1 geschafft! Weiter geht's...");

      setTimeout(() => {
        this.loadNextLevel();
      }, 3000);
    }
  }

  showLevelMessage(message) {
    this.levelMessage = message;

    if (this.levelMessageTimeout) clearTimeout(this.levelMessageTimeout);

    this.levelMessageTimeout = setTimeout(() => {
      this.levelMessage = "";
    }, 3000); // Nachricht verschwindet nach 3 Sekunden
  }

  loadNextLevel() {
    this.currentLevelIndex++;

    if (this.currentLevelIndex >= allLevels.length) {
      console.log("🏁 Spiel beendet – alle Levels abgeschlossen!");
      this.showLevelMessage("🏁 Du hast das Spiel gewonnen!");
      return;
    }

    this.level = allLevels[this.currentLevelIndex];
    this.enemies = this.level.enemies;
    this.cloud = this.level.cloud;
    this.backgroundObjects = this.level.backgroundObjects;
    this.collectableBottles = this.level.collectableObjects || [];
    this.collectableCoins = this.level.collectableCoins || [];
    this.levelEnded = false;

    // 🚀 Levelstart-Meldung
    this.showLevelMessage(`🚀 Level ${this.currentLevelIndex + 1} beginnt!`);
  }

  showBottleLimitMessage() {
    this.bottleLimitMessage = "Flaschenlimit erreicht!";
    clearTimeout(this.bottleLimitTimeout);
    this.bottleLimitTimeout = setTimeout(() => {
      this.bottleLimitMessage = "";
    }, 2000);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects || []);
    this.ctx.translate(-this.camera_x, 0);

    if (this.bottleLimitMessage) {
      this.ctx.font = "15px Comic Sans MS";
      this.ctx.fillStyle = "red";
      this.ctx.fillText(this.bottleLimitMessage, 260, 80);
    }
    if (this.levelMessage) {
      this.ctx.font = "32px Comic Sans MS";
      this.ctx.fillStyle = "#28a745"; // grün
      this.ctx.textAlign = "center";
      this.ctx.fillText(this.levelMessage, this.canvas.width / 2, 150);
    }

    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarCoin);

    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.addObjectsToMap(this.cloud || []);
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

    if (!this.characterDead) {
      this.animationFrame = requestAnimationFrame(() => this.draw());
    }
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
