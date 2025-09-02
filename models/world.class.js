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
        this.checkEndboss2Hit();
      }

      // 💀 Wenn Spieler tot ist, zeige Game Over Screen
      this.gameOverScreen();
    }, 200);
  }

  gameOverScreen() {
    if (this.character.isDead() && !this.gameOver) {
      this.gameOver = true;
      clearInterval(this.gameInterval); // Stoppt die Spiel-Logik
      cancelAnimationFrame(this.animationFrameId); // Falls du draw() mit requestAnimationFrame benutzt
      this.showGameOverScreen();
    }
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

          // if (enemy.isDead?.()) {
          //   const i = this.level.enemies.indexOf(enemy);
          //   if (i >= 0) this.level.enemies.splice(i, 1);
          // }
          if (enemy.isDead?.()) {
            if (
              enemy instanceof EndbossLevel1 ||
              enemy instanceof EndbossLevel2
            ) {
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
        this.statusBarCoin.availableCoins++;
        this.collectableCoins.splice(this.collectableCoins.indexOf(coin), 1);
        this.statusBarCoin.update?.();
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

  // characterColliding(enemy) {
  //   if (this.character.isColliding(enemy)) {
  //     const characterBottom = this.character.y + this.character.height;
  //     const characterVerticalSpeed = this.character.speedY;
  //     const enemyTop = enemy.y + enemy.height * 0.3;
  //     //const enemyTop = enemy.y + enemy.height * 0.5;

  //     const isAboveEnemy =
  //       characterBottom <= enemyTop + 10 && characterVerticalSpeed >= 0;
  //       //characterBottom <= enemyTop + 20 && characterVerticalSpeed >= 0;

  //     this.ifIsAboveEnemy(isAboveEnemy, enemy);
  //   }
  // }

  //--------------------------------------------------------------------------

  // characterColliding(enemy) {
  //   if (this.character.isColliding(enemy)) {
  //     const ctx = this.world?.ctx; // Canvas-Kontext holen
  //     if (ctx) {
  //       // Spieler-Hitbox
  //       ctx.strokeStyle = "blue";
  //       ctx.lineWidth = 2;
  //       ctx.strokeRect(
  //         this.character.x,
  //         this.character.y,
  //         this.character.width,
  //         this.character.height
  //       );

  //       // Gegner-Hitbox
  //       ctx.strokeStyle = "red";
  //       ctx.lineWidth = 2;
  //       ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);

  //       // Treffer-von-oben-Zone
  //       let enemyTop =
  //         enemy.y + enemy.height * (enemy.height < 100 ? 0.7 : 0.25);
  //       let extraOffset = enemy.height < 100 ? 25 : 15;
  //       ctx.strokeStyle = "green";
  //       ctx.lineWidth = 1;
  //       ctx.strokeRect(enemy.x - 5, enemyTop, enemy.width + 10, extraOffset);
  //     }

  //     // Normale Logik
  //     const characterBottom = this.character.y + this.character.height;
  //     const characterVerticalSpeed = this.character.speedY;
  //     let enemyTop = enemy.y + enemy.height * (enemy.height < 100 ? 0.8 : 0.3);
  //     let extraOffset = enemy.height < 100 ? 20 : 10;

  //     // const isAboveEnemy =
  //     //   characterBottom <= enemyTop + extraOffset &&
  //     //   characterVerticalSpeed >= 0;

  //      const isAboveEnemy =
  //        characterBottom <= enemyTop + extraOffset &&
  //        characterVerticalSpeed > 0;

  //     //     const isAboveEnemy =
  //     // characterBottom <= enemyTop + extraOffset &&
  //     // this.character.speedY > 0;  // statt >= 0

  //     this.ifIsAboveEnemy(isAboveEnemy, enemy);
  //   }
  // }

  //--------------------------------------------------------------------------

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
        ctx.strokeRect(enemy.x - 5, enemyTop, enemy.width + 10, extraOffset);
      }

      // ✅ Kollisionslogik
      const isAboveEnemy =
        characterBottom <= enemyTop + extraOffset && characterVerticalSpeed > 0;

      this.ifIsAboveEnemy(isAboveEnemy, enemy);
    }
  }

  //--------------------------------------------------------------------------

  //   characterColliding(enemy) {
  //     if (this.character.isColliding(enemy)) {

  //         // Positionen auslesen
  //         const characterBottom = this.character.y + this.character.height;
  //         const characterVerticalSpeed = this.character.speedY;

  //         // Kill-Zone berechnen (wie in drawFrame)
  //         let killZoneTop;
  //         let killZoneHeight;

  //         if (enemy.height < 100) {
  //             // kleine Gegner wie ChickenSmall
  //             killZoneTop = enemy.y + enemy.height * 0.8;
  //             killZoneHeight = 20;
  //         } else {
  //             // große Gegner / Endboss
  //             killZoneTop = enemy.y + enemy.height * 0.3;
  //             killZoneHeight = 10;
  //         }

  //         const killZoneBottom = killZoneTop + killZoneHeight;

  //         // Prüfen, ob Charakter von oben in die Kill-Zone kommt
  //         const isAboveEnemy =
  //             characterBottom >= killZoneTop &&
  //             characterBottom <= killZoneBottom &&
  //             characterVerticalSpeed >= 0;

  //         this.ifIsAboveEnemy(isAboveEnemy, enemy);
  //     }
  // }

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
  //--------------------------------------------------------------------------
  // ifIsAboveEnemy(isAboveEnemy, enemy) {
  //   if (isAboveEnemy) {
  //     // ✅ Gegner sofort treffen
  //     enemy.hit();

  //     // ✅ Rückstoß nach oben (Mario-Style)
  //     this.character.speedY = -10;

  //     // optional: kleinen Sound abspielen
  //     if (this.world && this.world.audio && this.world.audio.jumpOnEnemy) {
  //       this.world.audio.jumpOnEnemy.play();
  //     }
  //   } else {
  //     // ❌ nur wenn der Gegner nicht von oben getroffen wird → Schaden für Character
  //     if (!enemy.dead) {
  //       this.character.hit();
  //     }
  //   }
  // }

  // ifEnemyIsDead(enemy) {
  //   if (enemy.isDead?.()) {
  //     if (enemy instanceof EndbossLevel1 || enemy instanceof EndbossLevel2) {
  //       enemy.isMarkedDead = true;
  //     } else {
  //       const i = this.level.enemies.indexOf(enemy);
  //       if (i >= 0) this.level.enemies.splice(i, 1);
  //     }
  //   }
  // }
  //--------------------------------------------------------------------------
  ifEnemyIsDead(enemy) {
    if (enemy.isDead?.()) {
      if (enemy instanceof EndbossLevel1 || enemy instanceof EndbossLevel2) {
        enemy.isMarkedDead = true;
      } else {
        // ❌ nicht mehr sofort entfernen
        enemy.die?.(); // ChickenSmall kümmert sich selbst ums Entfernen
      }
    }
  }
  //--------------------------------------------------------------------------
  // ifEnemyIsDead(enemy) {
  //   if (enemy.isDead?.()) {
  //     if (enemy instanceof EndbossLevel1 || enemy instanceof EndbossLevel2) {
  //       // Endboss wird als "tot" markiert UND entfernt
  //       enemy.isMarkedDead = true;

  //       const i = this.level.enemies.indexOf(enemy);
  //       if (i >= 0) {
  //         this.level.enemies.splice(i, 1);
  //       }
  //     } else {
  //       // ChickenSmall & Co. kümmern sich selbst ums Entfernen
  //       enemy.die?.();
  //     }
  //   }
  // }

  //--------------------------------------------------------------------------
  //   ifEnemyIsDead(enemy) {
  //     if (enemy.isDead?.()) {
  //         if (enemy instanceof EndbossLevel1 || enemy instanceof EndbossLevel2) {
  //             enemy.isMarkedDead = true;
  //         } else {
  //             // Dead-Animation/Bild setzen
  //             enemy.die?.();

  //             // Gegner erst nach 2 Sekunden entfernen
  //             setTimeout(() => {
  //                 const i = this.level.enemies.indexOf(enemy);
  //                 if (i >= 0) {
  //                     this.level.enemies.splice(i, 1);
  //                 }
  //             }, 2000); // Zeit anpassen, je nach gewünschter Dauer
  //         }
  //     }
  // }

  endGame() {
    clearInterval(this.gameInterval); // stoppe alle Intervall-Schleifen
    clearInterval(this.enemySpawnInterval);
    //cancelAnimationFrame(this.animationFrame); // stoppe Zeichnung, falls nötig
    this.levelEnded = true;
    this.gameOver = true;
    this.playerDied = true;
  }

  // checkEndbossDefeated() {
  //   const endboss = this.level.enemies.find(
  //     (e) => e instanceof EndbossLevel1 || e instanceof EndbossLevel2
  //   );
  //   //console.log("Endboss gefunden:", endboss);

  //   if (!endboss) return;

  //   if (endboss.isDead() && !this.endbossDefeated && !this.playerDied) {
  //     console.log("✅ Endboss besiegt – nächstes Level wird geladen!");
  //     this.endbossDefeated = true;
  //     this.levelEnded = true;
  //     this.showLevelMessage("🎉 Level 1 geschafft! Weiter geht's...");

  //     setTimeout(() => {
  //       this.loadNextLevel();
  //     }, 3000);
  //   }
  // }
  //   checkEndbossDefeated() {
  //   const endboss = this.level.enemies.find(
  //     (e) => e instanceof EndbossLevel1 || e instanceof EndbossLevel2
  //   );

  //   if (!endboss) return;

  //   if (endboss.isDead() && !this.endbossDefeated && !this.playerDied) {
  //     console.log("✅ Endboss besiegt – Win Screen!");
  //     this.endbossDefeated = true;
  //     this.levelEnded = true;

  //     // Spiel-Logik stoppen
  //     clearInterval(this.gameInterval);
  //     cancelAnimationFrame(this.animationFrameId);

  //     // Win-Screen anzeigen
  //     this.showWinScreen();
  //   }
  // }
  // checkEndbossDefeated() {
  //   const endboss = this.level.enemies.find(
  //     (e) => e instanceof EndbossLevel1 || e instanceof EndbossLevel2
  //   );

  //   if (!endboss) return;

  //   if (endboss.isDead() && !this.endbossDefeated && !this.playerDied) {
  //     console.log("✅ Endboss besiegt – nächstes Level wird geladen!");
  //     this.endbossDefeated = true;
  //     this.levelEnded = true;

  //     this.showLevelMessage("🎉 Level " + (this.currentLevelIndex + 1) + " geschafft!");

  //     clearInterval(this.gameInterval); // ⛔ alte Loop stoppen

  //     setTimeout(() => {
  //       this.loadNextLevel();
  //     }, 3000);
  //   }
  // }
  checkEndbossDefeated() {
    const endboss = (this.level.enemies || []).find(
      (e) => e instanceof EndbossLevel1 || e instanceof EndbossLevel2
    );

    // Nichts tun, wenn kein Boss da oder bereits behandelt
    if (
      !endboss ||
      this.endbossDefeated ||
      this.playerDied ||
      this._handlingBossDefeat
    )
      return;

    if (endboss.isDead?.()) {
      console.log("✅ Endboss besiegt!");
      this._handlingBossDefeat = true; // Re-Entrys verhindern
      this.endbossDefeated = true;
      this.levelEnded = true;

      // ALLES anhalten (Loop, RAF, Gegner-/Cloud-Intervalle, Character)
      this.stopGameLoopHard();

      // Letztes Level?
      const isLastLevel = this.currentLevelIndex >= allLevels.length - 1;

      if (isLastLevel) {
        // 🎉 Endscreen
        this.showWinScreen();
      } else {
        // 🎉 Meldung & Levelwechsel
        this.showLevelMessage(
          "🎉 Level " + (this.currentLevelIndex + 1) + " geschafft!"
        );
        setTimeout(() => {
          this._handlingBossDefeat = false; // Guard für nächstes Level zurücksetzen
          this.loadNextLevel();
        }, 2000);
      }
    }
  }

  stopGameLoopHard() {
    // Haupt-Logik stoppen
    if (this.gameInterval) clearInterval(this.gameInterval);
    if (this.enemySpawnInterval) clearInterval(this.enemySpawnInterval);

    // Zeichen-Loop stoppen (falls du in draw() this.animationFrameId setzt)
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

    // Character stoppen (falls er eigene Intervalle/Animationen hat)
    this.character?.stop?.();
    if (this.character?.moveInterval)
      clearInterval(this.character.moveInterval);
    if (this.character?.runInterval) clearInterval(this.character.runInterval);
    this.character.speed = 0;

    // Gegner stoppen
    (this.level?.enemies || []).forEach((e) => {
      e.stop?.();
      if (e.moveInterval) clearInterval(e.moveInterval);
      if (e.runInterval) clearInterval(e.runInterval);
      e.speed = 0;
    });

    // Clouds / Hintergrundobjekte stoppen (falls sie eigene Intervalle/Animationen haben)
    (this.clouds || []).forEach((c) => {
      c.stop?.();
      if (c.moveInterval) clearInterval(c.moveInterval);
    });
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

  showLevelMessage(message) {
    this.levelMessage = message;

    if (this.levelMessageTimeout) clearTimeout(this.levelMessageTimeout);

    this.levelMessageTimeout = setTimeout(() => {
      this.levelMessage = "";
    }, 3000);
  }

  // loadNextLevel() {
  //   this.currentLevelIndex++;

  //   if (this.currentLevelIndex >= allLevels.length) {
  //     console.log("🏁 Spiel beendet – alle Levels abgeschlossen!");
  //     this.showLevelMessage("🏁 Du hast das Spiel gewonnen!");
  //     this.levelEnded = true;
  //     return;
  //   }

  //   this.level = allLevels[this.currentLevelIndex];
  //   this.enemies = this.level.enemies;
  //   this.clouds = this.level.clouds;
  //   this.backgroundObjects = this.level.backgroundObjects;
  //   this.collectableBottles = this.level.collectableObjects || [];
  //   this.collectableCoins = this.level.collectableCoins || [];
  //   //this.levelEnded = false;

  //   // WICHTIG:
  //   // Flags & Status zurücksetzen
  //   // this.characterDead = false;
  //   // this.playerDied = false;
  //   // this.endbossDefeated = false;
  //   // this.throwableObjects = [];
  //   // this.statusBarBottle.availableBottles = 3;
  //   // this.statusBarCoin.availableCoins = 0;
  //   // this.statusBarBottle.update?.();
  //   // this.statusBarCoin.update?.();
  //   // this.statusBar.setPercentage(100);
  //   this.playerDied = false;
  //   this.endbossDefeated = false;
  //   this.levelEnded = false;
  //   this.throwableObjects = [];

  //   this.statusBarBottle.availableBottles = 3;
  //   this.statusBarCoin.availableCoins = 0;
  //   this.statusBar.setPercentage(100);
  //   this.statusBarBottle.update?.();
  //   this.statusBarCoin.update?.();

  //   this.character.x = 100;
  //   this.character.y = 185;
  //   this.camera_x = 0;

  //   clearInterval(this.gameInterval);
  //   this.run();

  //   this.showLevelMessage(`🚀 Level ${this.currentLevelIndex + 1} beginnt!`);

  //   this.spawnEnemyLoop();
  // }

  //----------------------------------------------------------------

  //   loadNextLevel() {
  //   this.currentLevelIndex++;

  //   // if (this.currentLevelIndex >= allLevels.length) {
  //   //   console.log("🏁 Spiel beendet – alle Levels abgeschlossen!");
  //   //   this.levelEnded = true;
  //   //   this.showWinScreen(); // ⛔ Statt Message einen richtigen Win-Screen
  //   //   return;
  //   // }
  //   if (this.currentLevelIndex >= allLevels.length) {
  //     console.log("🏁 Spiel beendet – alle Levels abgeschlossen!");

  //     // 🚫 Stoppe Spielschleifen
  //     clearInterval(this.gameInterval);
  //     clearInterval(this.enemySpawnInterval);
  //     cancelAnimationFrame(this.animationFrameId);

  //     this.levelEnded = true;
  //     this.gameOver = true;

  //     // 🎉 Win-Screen anzeigen
  //     this.showWinScreen();
  //     return;
  //   }

  //   this.level = allLevels[this.currentLevelIndex];
  //   this.enemies = this.level.enemies;
  //   this.clouds = this.level.clouds;
  //   this.backgroundObjects = this.level.backgroundObjects;
  //   this.collectableBottles = this.level.collectableObjects || [];
  //   this.collectableCoins = this.level.collectableCoins || [];

  //   this.playerDied = false;
  //   this.endbossDefeated = false; // 👈 wichtig!
  //   this.levelEnded = false;
  //   this.throwableObjects = [];

  //   this.statusBarBottle.availableBottles = 3;
  //   this.statusBarCoin.availableCoins = 0;
  //   this.statusBar.setPercentage(100);
  //   this.statusBarBottle.update?.();
  //   this.statusBarCoin.update?.();

  //   this.character.x = 100;
  //   this.character.y = 185;
  //   this.camera_x = 0;

  //   clearInterval(this.gameInterval);
  //   this.run();

  //   this.showLevelMessage(`🚀 Level ${this.currentLevelIndex + 1} beginnt!`);

  //   this.spawnEnemyLoop();
  // }

  //----------------------------------------------------------------

  loadNextLevel() {
    this.currentLevelIndex++;

    // ✅ Spiel gewonnen?
    if (this.currentLevelIndex >= allLevels.length) {
      console.log("🏁 Spiel beendet – alle Levels abgeschlossen!");

      // 🚫 Alles stoppen
      clearInterval(this.gameInterval);
      clearInterval(this.enemySpawnInterval);
      cancelAnimationFrame(this.animationFrameId);

      this.levelEnded = true;
      this.gameOver = true;

      // 🎉 Win-Screen anzeigen
      this.showWinScreen();
      return;
    }

    // ✅ Neues Level laden
    this.level = allLevels[this.currentLevelIndex];
    this.enemies = this.level.enemies;
    this.clouds = this.level.clouds;
    this.backgroundObjects = this.level.backgroundObjects;
    this.collectableBottles = this.level.collectableObjects || [];
    this.collectableCoins = this.level.collectableCoins || [];

    // Reset Flags
    this.playerDied = false;
    this.endbossDefeated = false;
    this.levelEnded = false;
    this.throwableObjects = [];

    // Statusbars zurücksetzen
    this.statusBarBottle.availableBottles = 3;
    this.statusBarCoin.availableCoins = 0;
    this.statusBar.setPercentage(100);
    this.statusBarBottle.update?.();
    this.statusBarCoin.update?.();

    // Character Reset
    // this.character.x = 100;
    // this.character.y = 185;
    // this.camera_x = 0;
    // Character Reset NUR beim Start
    if (this.character) {
      this.character.x = 100;
      this.character.y = 185;
    }
    this.camera_x = 0;

    // ⏩ Character & Gegner wieder starten (falls sie stop-Methoden hatten)
    if (this.character.start) this.character.start();
    this.enemies.forEach((e) => e.start?.());
    this.clouds.forEach((c) => c.start?.());

    // Loop neu starten
    clearInterval(this.gameInterval);
    this.run();

    this.showLevelMessage(`🚀 Level ${this.currentLevelIndex + 1} beginnt!`);

    this.spawnEnemyLoop();
  }
  // loadNextLevel() {
  //   // ⛔ Doppelte Aufrufe verhindern
  //   if (this.levelEnded) {
  //     console.warn("⚠️ loadNextLevel() wurde blockiert – Level ist bereits beendet!");
  //     return;
  //   }

  //   this.levelEnded = true; // ✅ direkt blockieren

  //   this.currentLevelIndex++;
  //   console.log("⚡ Lade nächstes Level:", this.currentLevelIndex);

  //   // ✅ Spiel gewonnen?
  //   if (this.currentLevelIndex >= allLevels.length) {
  //     console.log("🏁 Spiel beendet – alle Levels abgeschlossen!");

  //     // 🚫 Alles stoppen
  //     clearInterval(this.gameInterval);
  //     clearInterval(this.enemySpawnInterval);
  //     cancelAnimationFrame(this.animationFrameId);

  //     this.gameOver = true;

  //     // 🎉 Win-Screen anzeigen
  //     this.showWinScreen();
  //     return;
  //   }

  //   // ✅ Neues Level laden
  //   this.level = allLevels[this.currentLevelIndex];
  //   this.enemies = this.level.enemies;
  //   this.clouds = this.level.clouds;
  //   this.backgroundObjects = this.level.backgroundObjects;
  //   this.collectableBottles = this.level.collectableObjects || [];
  //   this.collectableCoins = this.level.collectableCoins || [];

  //   // Reset Flags
  //   this.playerDied = false;
  //   this.endbossDefeated = false;
  //   this.levelEnded = false; // 🔄 wieder freigeben für neues Level-Ende
  //   this.throwableObjects = [];

  //   // Statusbars zurücksetzen
  //   this.statusBarBottle.availableBottles = 3;
  //   this.statusBarCoin.availableCoins = 0;
  //   this.statusBar.setPercentage(100);
  //   this.statusBarBottle.update?.();
  //   this.statusBarCoin.update?.();

  //   // Character Reset (nur 1x pro Levelwechsel)
  //   if (this.character) {
  //     this.character.x = 100;
  //     this.character.y = 185;
  //     console.log("👤 Character zurückgesetzt auf X=100, Y=185");
  //   }
  //   this.camera_x = 0;

  //   // ⏩ Character & Gegner wieder starten
  //   this.character?.start?.();
  //   this.enemies.forEach(e => e.start?.());
  //   this.clouds.forEach(c => c.start?.());

  //   // Loop neu starten
  //   clearInterval(this.gameInterval);
  //   this.run();

  //   this.showLevelMessage(`🚀 Level ${this.currentLevelIndex + 1} beginnt!`);

  //   this.spawnEnemyLoop();
  // }

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

  //   showGameOverScreen() {
  //   // Game Over Bild
  //   const gameOverImage = document.createElement("img");
  //   gameOverImage.src = "img/You won, you lost/Game Over.png";
  //   gameOverImage.style.position = "absolute";
  //   gameOverImage.style.top = "20%";
  //   gameOverImage.style.left = "50%";
  //   gameOverImage.style.transform = "translate(-50%, -50%)";
  //   gameOverImage.style.zIndex = "998";
  //   gameOverImage.style.width = "60%";
  //   gameOverImage.id = "gameOverImage";

  //   // Restart Button
  //   const button = document.createElement("button");
  //   button.innerText = "🔁 Spiel neu starten";
  //   button.id = "restartButton";
  //   button.style.position = "absolute";
  //   button.style.top = "60%";
  //   button.style.left = "50%";
  //   button.style.transform = "translate(-50%, -50%)";
  //   button.style.padding = "15px 30px";
  //   button.style.fontSize = "20px";
  //   button.style.backgroundColor = "#ff4444";
  //   button.style.color = "white";
  //   button.style.border = "none";
  //   button.style.borderRadius = "10px";
  //   button.style.cursor = "pointer";
  //   button.style.boxShadow = "0 0 10px black";
  //   button.style.zIndex = "999";

  //   button.addEventListener("click", () => {
  //     location.reload();
  //   });

  //   // Zur Seite hinzufügen
  //   document.body.appendChild(gameOverImage);
  //   document.body.appendChild(button);
  // }
  // showGameOverScreen() {
  //   // Hintergrund schwarz mit Transparenz
  //   this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  //   this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  //   // Text "GAME OVER"
  //   this.ctx.font = "bold 80px Comic Sans MS";
  //   this.ctx.fillStyle = "red";
  //   this.ctx.textAlign = "center";
  //   this.ctx.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2 - 50);

  //   // Text Button Hinweis
  //   this.ctx.font = "30px Comic Sans MS";
  //   this.ctx.fillStyle = "white";
  //   this.ctx.fillText("Klicke, um neu zu starten", this.canvas.width / 2, this.canvas.height / 2 + 30);

  //   // Restart mit Klick
  //   this.canvas.addEventListener("click", () => location.reload(), { once: true });
  // }
  //-----------------------------------------------------------------

  //   showWinScreen() {
  //   const ctx = this.ctx;
  //   ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  //   // Hintergrund
  //   ctx.fillStyle = "rgba(0,0,0,0.7)";
  //   ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  //   // Text
  //   ctx.fillStyle = "white";
  //   ctx.font = "bold 60px Arial";
  //   ctx.textAlign = "center";
  //   ctx.fillText("🎉 YOU WIN! 🎉", this.canvas.width / 2, this.canvas.height / 2);

  //   ctx.font = "30px Arial";
  //   ctx.fillText("Drücke R für Restart", this.canvas.width / 2, this.canvas.height / 2 + 60);

  //   this.winScreenShown = true;

  //   // Optional: Restart per Taste "R"
  //   window.addEventListener("keydown", (e) => {
  //     if (e.key.toLowerCase() === "r" && this.winScreenShown) {
  //       location.reload(); // ganze Seite neuladen
  //     }
  //   });
  // }
  // showWinScreen() {
  //   const ctx = this.ctx;
  //   ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  //   // Hintergrund dunkel einfärben
  //   ctx.fillStyle = "rgba(0,0,0,0.7)";
  //   ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  //   // Text anzeigen
  //   ctx.fillStyle = "white";
  //   ctx.font = "bold 60px Arial";
  //   ctx.textAlign = "center";
  //   ctx.fillText("🎉 YOU WIN! 🎉", this.canvas.width / 2, this.canvas.height / 2);

  //   ctx.font = "30px Arial";
  //   ctx.fillText("Drücke R zum Neustarten", this.canvas.width / 2, this.canvas.height / 2 + 60);

  //   this.winScreenShown = true;

  //   // Neustart bei Taste "R"
  //   window.addEventListener("keydown", (e) => {
  //     if (e.key.toLowerCase() === "r" && this.winScreenShown) {
  //       location.reload(); // Seite neuladen → Spiel neu starten
  //     }
  //   });
  // }
  showWinScreen() {
    const ctx = this.ctx;
    const canvas = this.canvas;

    // 🎨 Hintergrund abdunkeln
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Win-Bild laden
    const img = new Image();
    img.src = "img/You won, you lost/You win B.png"; // 👈 Pfad zu deinem Win-Bild

    img.onload = () => {
      // Berechne optimale Bildgröße
      const maxWidth = canvas.width * 0.6;
      const maxHeight = canvas.height * 0.3;

      let imgWidth = img.width;
      let imgHeight = img.height;

      // Skaliere proportional
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

      ctx.fillStyle = "#44cc44"; // Grün für "Sieg"
      ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

      // 📝 Button-Text
      ctx.font = "24px Comic Sans MS";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Spiel neu starten", canvas.width / 2, buttonY + 38);

      // ☝️ Klickbereich speichern
      this.restartButtonArea = {
        x: buttonX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight,
      };

      // ✅ Nur 1x den Eventlistener anhängen
      if (!this.canvasClickListenerAdded) {
        canvas.addEventListener("click", this.handleCanvasClick.bind(this));
        this.canvasClickListenerAdded = true;
      }
    };
  }

  showGameOverScreen() {
    const ctx = this.ctx;
    const canvas = this.canvas;

    // 🎨 Hintergrund abdunkeln
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // // 🧨 Game Over Text
    // ctx.font = "bold 80px Comic Sans MS";
    // ctx.fillStyle = "red";
    // ctx.textAlign = "center";
    // ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 100);

    // Game Over Bild anzeigen
    const img = new Image();
    img.src = "img/You won, you lost/Game Over.png"; // ← Dein Bildpfad

    // img.onload = () => {
    //   const imgWidth = 400;
    //   const imgHeight = 100;
    //   const imgX = canvas.width / 2 - imgWidth / 2;
    //   const imgY = canvas.height / 2 - 150;

    //   ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

    img.onload = () => {
      // Berechne optimale Bildgröße
      const maxWidth = canvas.width * 0.6;
      const maxHeight = canvas.height * 0.3;

      let imgWidth = img.width;
      let imgHeight = img.height;

      // Skaliere proportional
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

      ctx.fillStyle = "#ff4444";
      ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

      // 📝 Button-Text
      ctx.font = "24px Comic Sans MS";
      ctx.fillStyle = "white";
      ctx.fillText("Spiel neu starten", canvas.width / 2, buttonY + 38);

      // ☝️ Klickbereich speichern
      this.restartButtonArea = {
        x: buttonX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight,
      };

      // ✅ Nur 1x den Eventlistener anhängen
      if (!this.canvasClickListenerAdded) {
        canvas.addEventListener("click", this.handleCanvasClick.bind(this));
        this.canvasClickListenerAdded = true;
      }
    };
  }
  //-----------------------------------------------------------
  // // showGameOverScreen() {
  // //   const ctx = this.ctx;
  // //   const canvas = this.canvas;
  // //   const img = new Image();
  // //   img.src = "img/You won, you lost/Game Over.png";

  // //   // // Optional: Sound
  // //   // if (!this.gameOverSoundPlayed) {
  // //   //   const sound = new Audio("audio/gameover.mp3");
  // //   //   sound.play();
  // //   //   this.gameOverSoundPlayed = true;
  // //   // }

  // //   let scale = 0.1;
  // //   const maxScale = 0.6;
  // //   const scaleStep = 0.01;

  // //   const animateGameOver = () => {
  // //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  // //     // Hintergrund abdunkeln
  // //     ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  // //     ctx.fillRect(0, 0, canvas.width, canvas.height);

  // //     // Bild animiert reinzoomen
  // //     const imgWidth = img.width * scale;
  // //     const imgHeight = img.height * scale;
  // //     const imgX = canvas.width / 2 - imgWidth / 2;
  // //     const imgY = canvas.height / 2 - imgHeight - 40;

  // //     ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

  // //     // Pulsierender Button
  // //     const time = Date.now() / 300;
  // //     const buttonWidth = 250 + Math.sin(time) * 10;
  // //     const buttonHeight = 60 + Math.sin(time) * 4;
  // //     const buttonX = canvas.width / 2 - buttonWidth / 2;
  // //     const buttonY = canvas.height / 2 + 20;

  // //     ctx.fillStyle = "#ff4444";
  // //     ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

  // //     ctx.font = "24px Comic Sans MS";
  // //     ctx.fillStyle = "white";
  // //     ctx.textAlign = "center";
  // //     ctx.fillText("Spiel neu starten", canvas.width / 2, buttonY + 38);

  // //     // Klickbereich speichern
  // //     this.restartButtonArea = {
  // //       x: buttonX,
  // //       y: buttonY,
  // //       width: buttonWidth,
  // //       height: buttonHeight,
  // //     };

  // //     if (!this.canvasClickListenerAdded) {
  // //       canvas.addEventListener("click", this.handleCanvasClick.bind(this));
  // //       this.canvasClickListenerAdded = true;
  // //     }

  // //     // Zoom stoppen, wenn Zielgröße erreicht
  // //     if (scale < maxScale) {
  // //       scale += scaleStep;
  // //       requestAnimationFrame(animateGameOver);
  // //     } else {
  // //       requestAnimationFrame(() => this.pulseRestartButton());
  // //     }
  // //   };

  // //   img.onload = () => {
  // //     animateGameOver();
  // //   };
  // // }

  // pulseRestartButton() {
  //   const ctx = this.ctx;
  //   const canvas = this.canvas;

  //   const time = Date.now() / 300;
  //   const pulse = Math.sin(time) * 10;

  //   const buttonWidth = 250 + pulse;
  //   const buttonHeight = 60 + pulse * 0.4;
  //   const buttonX = canvas.width / 2 - buttonWidth / 2;
  //   const buttonY = canvas.height / 2 + 20;

  //   // Optional: nur Button clearen
  //   ctx.clearRect(0, buttonY - 10, canvas.width, buttonHeight + 20);

  //   ctx.fillStyle = "#ff4444";
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

  //   //requestAnimationFrame(() => this.pulseRestartButton());
  // }

  handleCanvasClick(event) {
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
      location.reload(); // 🔁 Spiel neu laden
    }
  }

  draw() {
    if (this.playerDied) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.showGameOverScreen(); // ← Das musst du definieren
      return; // 🛑 Alles andere überspringen
    }
    // if (this.playerDied) {
    //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //   this.showRestartOverlay();  // ✅ Richtiger Funktionsname
    //   return;
    // }

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

    // if (this.playerDied) {
    //   this.showRestartOverlay();
    // }

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
