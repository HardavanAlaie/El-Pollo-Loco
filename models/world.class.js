// // class World {
// //   characterDead = false;
// //   playerDied = false;
// //   endbossDefeated = false;
// //   uiScreen = null;

// //   gameOver = false;
// //   canvas;
// //   ctx;
// //   keyboard;
// //   camera_x = 0;

// //   statusBar = new StatusBar();
// //   statusBarBottle = new StatusBarBottle();
// //   statusBarCoin = new StatusBarCoin();
// //   throwableObjects = [];
// //   canThrow = true;

// //   bottleLimitMessage = "";
// //   bottleLimitTimeout = null;
// //   levelMessage = "";
// //   levelMessageTimeout = null;

// //   currentLevelIndex = 0;
// //   level = allLevels[this.currentLevelIndex];
// //   enemies = this.level.enemies;
// //   clouds = this.level.clouds;
// //   backgroundObjects = this.level.backgroundObjects;
// //   collectableBottles = this.level.collectableObjects || [];
// //   collectableCoins = this.level.collectableCoins || [];

// //   constructor(canvas, keyboard) {
// //     this.ctx = canvas.getContext("2d");
// //     this.canvas = canvas;
// //     this.keyboard = keyboard;

// //     this.currentLevelIndex = 0;
// //     this.level = level1(this);

// //     this.character = new Character(this);
// //     this.enemies = this.level.enemies;
// //     this.clouds = this.level.clouds;
// //     this.backgroundObjects = this.level.backgroundObjects;
// //     this.collectableBottles = this.level.collectableObjects || [];
// //     this.collectableCoins = this.level.collectableCoins || [];
// //     this.levelEnded = false;

// //     this.setWorld();

// //     this.setupCanvasControls();

// //     this.draw();
// //     this.run();
// //   }

// //   setWorld() {
// //     this.character.world = this;
// //     this.spawnEnemyLoop();
// //   }

// //   run() {
// //     this.gameInterval = setInterval(() => {
// //       if (this.levelEnded) return;

// //       this.checkCollisions();
// //       this.checkThrowableObjects();
// //       this.checkEndbossDefeated();
// //       this.removeOffscreenEnemies();
// //       this.checkEndboss1Hit();

// //       // if (!this.endbossDefeated && this.playerDied && !this.gameOver) {
// //       //   this.gameOver = true;
// //       //   this.stopGameLoopHard();
// //       //   this.showGameOverScreen();
// //       // }
// //     }, 200);
// //   }

// //   checkEndboss1Hit() {
// //     if (
// //       !this.character.isHurt() &&
// //       this.character.isColliding(
// //         this.level.enemies.find(
// //           (e) => e instanceof EndbossLevel1 || e instanceof EndbossLevel2
// //         )
// //       )
// //     ) {
// //       this.character.hit();
// //     }
// //   }

// //   checkThrowableObjects() {
// //     this.throwableObjects = this.throwableObjects.filter(
// //       (bottle) => !bottle.isDead?.()
// //     );

// //     this.throwableBottles();
// //   }

// //   throwableBottles() {
// //     if ( this.keyboard.D && this.canThrow && this.statusBarBottle.availableBottles > 0 ) {
// //       this.canThrow = false;
// //       this.statusBarBottle.availableBottles--;
// //       this.statusBarBottle.update?.();

// //       const bottle = new ThrowableObject( this.character.x + 30, this.character.y + 100, this.character.otherDirection );
// //       this.throwableObjects.push(bottle);
// //       setTimeout(() => {
// //         this.canThrow = true;
// //       }, 300);
// //     }
// //   }

// //   checkCollisions() {
// //     (this.level.enemies || []).forEach((enemy) => {
// //       this.characterColliding(enemy);
// //     });
// //     this.throwableObjectsMethod();
// //     this.throwableObjects = this.throwableObjects.filter(
// //       (bottle) => !bottle.isDead()
// //     );
// //     this.characterCollidingBottle();
// //     this.collectableCoinsMethod();
// //   }

// //   collectableCoinsMethod() {
// //     (this.collectableCoins || []).forEach((coin) => {
// //       if (this.character.isColliding(coin)) {
// //         if (this.statusBarCoin) {
// //           this.statusBarCoin.availableCoins++;
// //           this.statusBarCoin.update();
// //         }
// //         if (soundEnabled) {
// //           const coinSound = new Audio("audio/coins.mp3");
// //           coinSound.volume = 0.5;
// //           coinSound.play().catch(() => { });
// //         }

// //         this.collectableCoins.splice(this.collectableCoins.indexOf(coin), 1);
// //       }
// //     });
// //   }

// //   throwableObjectsMethod() {
// //     this.throwableObjects.forEach((bottle) => {
// //       (this.level.enemies || []).forEach((enemy) => {
// //         if (!bottle.isBroken && bottle.isColliding(enemy)) {
// //           bottle.break();
// //           enemy.hit();
// //           if (enemy.isDead?.()) {
// //             if (enemy instanceof EndbossLevel1) {
// //               enemy.isMarkedDead = true;
// //             } else {
// //               const i = this.level.enemies.indexOf(enemy);
// //               if (i >= 0) this.level.enemies.splice(i, 1);
// //             }
// //           }
// //         }
// //       });
// //       if (!bottle.isBroken && bottle.y > 420) {
// //         bottle.break();
// //       }
// //     });
// //   }

// //   characterCollidingBottle() {
// //     (this.collectableBottles || []).forEach((bottle) => {
// //       if (this.character.isColliding(bottle)) {
// //         if (this.statusBarBottle.availableBottles < 5) {
// //           this.statusBarBottle.availableBottles++;
// //           this.collectableBottles.splice(
// //             this.collectableBottles.indexOf(bottle),
// //             1
// //           );
// //           this.statusBarBottle.update?.();
// //         } else {
// //           this.showBottleLimitMessage();
// //         }
// //       }
// //     });
// //   }

// //   characterColliding(enemy) {
// //     if (this.character.isColliding(enemy)) {
// //       const characterBottom = this.character.y + this.character.height;
// //       const characterVerticalSpeed = this.character.speedY;
// //       let enemyTop = enemy.y + enemy.height * (enemy.height < 100 ? 0.7 : 0.25);
// //       let extraOffset = enemy.height < 100 ? 25 : 15;
// //       const ctx = this.world?.ctx;
// //       this.lineColliding(ctx, enemy, enemyTop, extraOffset);
// //       const isAboveEnemy =
// //         characterBottom <= enemyTop + extraOffset && characterVerticalSpeed > 0;
// //       this.ifIsAboveEnemy(isAboveEnemy, enemy);
// //     }
// //   }

// //   lineColliding(ctx, enemy, enemyTop, extraOffset) {
// //     if (ctx) {
// //       ctx.strokeStyle = "blue";
// //       ctx.lineWidth = 2;
// //       ctx.strokeRect(
// //         this.character.x,
// //         this.character.y,
// //         this.character.width,
// //         this.character.height
// //       );

// //       ctx.strokeStyle = "red";
// //       ctx.lineWidth = 2;
// //       ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);

// //       ctx.strokeStyle = "green";
// //       ctx.lineWidth = 1;
// //       ctx.strokeRect(enemy.x - 5, enemyTop, enemy.width + 15, extraOffset);
// //     }
// //   }

// //   ifIsAboveEnemy(isAboveEnemy, enemy) {
// //     if (isAboveEnemy) {
// //       enemy.hit();
// //       enemy.playDeathAnimation?.();
// //       this.ifEnemyIsDead(enemy);
// //       this.character.jump();
// //     } else {
// //       this.character.hit();
// //       this.statusBar.setPercentage(this.character.energy);
// //       this.character.isHurt();
// //       this.characterEnergyMethod();
// //     }
// //   }

// //   characterEnergyMethod() {
// //     if (this.character.energy <= 0 && !this.characterDead) {
// //       this.characterDead = true;
// //       this.showLevelMessage("💀 Du bist gestorben!");
// //       setTimeout(() => {
// //         this.endGame();
// //       }, 3000);
// //     }
// //   }

// //   ifEnemyIsDead(enemy) {
// //     if (enemy.isDead?.()) {
// //       if (enemy instanceof EndbossLevel1) {
// //         enemy.isMarkedDead = true;
// //       } else {
// //         enemy.die?.();
// //       }
// //     }
// //   }

// //   endGame() {
// //     clearInterval(this.gameInterval);
// //     clearInterval(this.enemySpawnInterval);
// //     if (this.animationFrame) {
// //       cancelAnimationFrame(this.animationFrame);
// //     }

// //     this.gameOverVars();
// //     this.stopEnemySounds();
// //     this.gameOverSoundMethod();
// //     this.showGameOverScreen();
// //   }

// //   gameOverSoundMethod() {
// //     if (!this.gameOverSound) {
// //       this.gameOverSound = new Audio("audio/gameover.mp3");
// //       this.gameOverSound.volume = 0.7;
// //     }
// //     this.gameOverSound.currentTime = 0;
// //     this.gameOverSound.play().catch((e) => {
// //       console.warn("Konnte GameOver-Sound nicht abspielen:", e);
// //     });
// //   }

// //   gameOverVars() {
// //     this.levelEnded = true;
// //     this.gameOver = true;
// //     this.playerDied = true;
// //     this.uiScreen = "gameover";
// //   }

// //   checkEndbossDefeated() {
// //     //console.log("checkEndbossDefeated läuft");

// //     const endboss = (this.level.enemies || []).find(
// //       (e) => e instanceof EndbossLevel1
// //     );
// //     if (!endboss || this.endbossDefeated || this.playerDied || this._handlingBossDefeat)
// //       return;

// //     this.endBossDeadMethod(endboss);
// //   }

// //   endBossDeadMethod(endboss) {
// //     if (endboss.isDead?.()) {
// //       //console.log("Endboss besiegt!");
// //       this._handlingBossDefeat = true;
// //       this.endbossDefeated = true;
// //       this.stopGameLoopHard(true);
// //       this.uiScreen = "win";
// //       this.showWinScreen();
// //     }
// //   }

// //   stopGameLoopHard(isWin = false) {
// //     //console.log("Stoppe komplettes Spiel");
// //     clearInterval(this.gameInterval);
// //     clearInterval(this.enemySpawnInterval);
// //     this.levelEnded = true;
// //     this.gameOver = !isWin;
// //   }

// //   spawnEnemyLoop() {
// //     const spawnConfigs = this.level.config?.spawnConfig || [];
// //     this.spawnIntervals = [];

// //     spawnConfigs.forEach((config) => {
// //       const intervalId = this.setIntervalMethod(config);

// //       this.spawnIntervals.push(intervalId);
// //     });
// //   }

// //   setIntervalMethod(config) {
// //     return setInterval(() => {
// //       const allowed = typeof config.condition === "function" ? config.condition(this.level) : true;
// //       if (!allowed) {
// //         return;
// //       }
// //       const current = this.level.enemies.filter(
// //         (e) => e instanceof config.type
// //       );
// //       if (current.length < config.maxCount) {
// //         const newEnemy = new config.type();
// //         newEnemy.x = 900 + Math.random() * 400;
// //         this.level.enemies.push(newEnemy);
// //       }
// //     }, config.interval);
// //   }

// //   removeOffscreenEnemies() {
// //     this.level.enemies = this.level.enemies.filter((enemy) => {
// //       if (
// //         (enemy instanceof ChickenSmall || enemy instanceof ChickenNormal) &&
// //         enemy.x < -50
// //       ) {
// //         return false;
// //       }
// //       return true;
// //     });
// //   }

// //   stopEnemySounds() {
// //     (this.level?.enemies || this.enemies || []).forEach((e) => {
// //       if (e instanceof EndbossLevel1 && e.stopScreamSound) {
// //         e.stopScreamSound();
// //       }
// //     });
// //   }

// //   showLevelMessage(message) {
// //     this.levelMessage = message;

// //     if (this.levelMessageTimeout) clearTimeout(this.levelMessageTimeout);

// //     this.levelMessageTimeout = setTimeout(() => {
// //       this.levelMessage = "";
// //     }, 3000);
// //   }

// //   spawnNewBottle() {
// //     let x = Math.floor(Math.random() * 1700) + 300;
// //     let y = Math.random() < 0.5 ? 300 : 350;
// //     let newBottle = new CollectableBottle(x, y);
// //     this.collectableBottles.push(newBottle);
// //   }

// //   showBottleLimitMessage() {
// //     this.bottleLimitMessage = "Flaschenlimit erreicht!";
// //     clearTimeout(this.bottleLimitTimeout);
// //     this.bottleLimitTimeout = setTimeout(() => {
// //       this.bottleLimitMessage = "";
// //     }, 2000);
// //   }

// //   // showRestartOverlay() {
// //   //   if (!document.getElementById("restartButton")) {
// //   //     const button = document.createElement("button");
// //   //     button.innerText = "Spiel neu starten";
// //   //     button.id = "restartButton";
// //   //     button.style.position = "absolute";
// //   //     button.style.top = "40%";
// //   //     button.style.left = "50%";
// //   //     button.style.transform = "translate(-50%, -50%)";
// //   //     button.style.padding = "15px 30px";
// //   //     button.style.fontSize = "20px";
// //   //     button.style.backgroundColor = "#ff4444";
// //   //     button.style.color = "white";
// //   //     button.style.border = "none";
// //   //     button.style.borderRadius = "10px";
// //   //     button.style.cursor = "pointer";
// //   //     button.style.boxShadow = "0 0 10px black";
// //   //     button.style.zIndex = "999";

// //   //     button.addEventListener("click", () => {
// //   //       location.reload();
// //   //     });

// //   //     document.body.appendChild(button);
// //   //   }
// //   // }

// //   showWinScreen() {
// //     const ctx = this.ctx;
// //     const canvas = this.canvas;
// //     //console.log("showWinScreen läuft!");
// //     ctx.setTransform(1, 0, 0, 1, 0, 0);
// //     ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
// //     ctx.fillRect(0, 0, canvas.width, canvas.height);
// //     this.stopEnemySounds();
// //     this.winSoundIfMethod();
// //     this.soundEnabledMethod();
// //     const img = new Image();
// //     img.src = "img/You won, you lost/You win B.png";
// //     img.onload = () => { this.drawWinScreen(img); };
// //     this.onerrorMethod(img, ctx, canvas);
// //   }

// //   onerrorMethod(img, ctx, canvas) {
// //     img.onerror = () => {
// //       console.warn("⚠️ Win-Bild konnte nicht geladen werden!");
// //       ctx.font = "bold 64px Comic Sans MS";
// //       ctx.fillStyle = "white";
// //       ctx.textAlign = "center";
// //       ctx.fillText("YOU WIN!", canvas.width / 2, canvas.height / 2 - 40);
// //     };
// //   }

// //   soundEnabledMethod() {
// //     if (soundEnabled) {
// //       this.winSound.currentTime = 0;
// //       this.winSound.play().catch(() => { });
// //     }
// //   }

// //   winSoundIfMethod() {
// //     if (!this.winSound) {
// //       this.winSound = new Audio("audio/win.mp3");
// //       this.winSound.volume = 0.7;
// //       this.winSound.loop = true;
// //     }
// //   }

// //   drawWinScreen(img) {
// //     const ctx = this.ctx;
// //     const canvas = this.canvas;

// //     const maxWidth = canvas.width * 0.6;
// //     const maxHeight = canvas.height * 0.3;

// //     let imgWidth = img.width;
// //     let imgHeight = img.height;

// //     const widthRatio = maxWidth / imgWidth;
// //     const heightRatio = maxHeight / imgHeight;
// //     const scale = Math.min(widthRatio, heightRatio);

// //     imgWidth *= scale;
// //     imgHeight *= scale;

// //     const imgX = canvas.width / 2 - imgWidth / 2;
// //     const imgY = canvas.height / 2 - imgHeight - 40;

// //     ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

// //     const buttonWidth = 250;
// //     const buttonHeight = 60;
// //     const buttonX = canvas.width / 2 - buttonWidth / 2;
// //     const buttonY = canvas.height / 2;

// //     ctx.fillStyle = "#44cc44";
// //     ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

// //     ctx.font = "24px Comic Sans MS";
// //     ctx.fillStyle = "white";
// //     ctx.textAlign = "center";
// //     ctx.fillText("Spiel neu starten", canvas.width / 2, buttonY + 38);

// //     this.restartButtonArea = {
// //       x: buttonX,
// //       y: buttonY,
// //       width: buttonWidth,
// //       height: buttonHeight,
// //     };

// //     if (!this.canvasClickListenerAdded) {
// //       const boundHandler = this.handleCanvasClick.bind(this);
// //       canvas.addEventListener("click", boundHandler);
// //       canvas.addEventListener("touchstart", boundHandler, { passive: false });
// //       canvas.addEventListener("pointerdown", boundHandler);
// //       this.canvasClickListenerAdded = true;
// //     }
// //   }

// //   showGameOverScreen() {
// //     const ctx = this.ctx;
// //     const canvas = this.canvas;

// //     this.soundMethod();

// //     ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
// //     ctx.fillRect(0, 0, canvas.width, canvas.height);

// //     const img = new Image();
// //     img.src = "img/You won, you lost/Game Over.png";

// //     img.onload = () => {
// //       const maxWidth = canvas.width * 0.6;
// //       const maxHeight = canvas.height * 0.3;

// //       let imgWidth = img.width;
// //       let imgHeight = img.height;

// //       const widthRatio = maxWidth / imgWidth;
// //       const heightRatio = maxHeight / imgHeight;
// //       const scale = Math.min(widthRatio, heightRatio);

// //       imgWidth *= scale;
// //       imgHeight *= scale;

// //       const imgX = canvas.width / 2 - imgWidth / 2;
// //       const imgY = canvas.height / 2 - imgHeight - 40;

// //       ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

// //       const buttonWidth = 250;
// //       const buttonHeight = 60;
// //       const buttonX = canvas.width / 2 - buttonWidth / 2;
// //       const buttonY = canvas.height / 2;

// //       ctx.fillStyle = "#fca534ff";
// //       ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

// //       ctx.font = "24px Comic Sans MS";
// //       ctx.fillStyle = "white";
// //       ctx.textAlign = "center";
// //       ctx.fillText("Spiel neu starten", canvas.width / 2, buttonY + 38);

// //       this.restartButtonArea = {
// //         x: buttonX,
// //         y: buttonY,
// //         width: buttonWidth,
// //         height: buttonHeight,
// //       };

// //       if (!this.canvasClickListenerAdded) {
// //         const boundHandler = this.handleCanvasClick.bind(this);
// //         canvas.addEventListener("click", boundHandler);
// //         canvas.addEventListener("touchstart", boundHandler, { passive: false });
// //         canvas.addEventListener("pointerdown", boundHandler);
// //         this.canvasClickListenerAdded = true;
// //       }
// //     };
// //   }

// //   soundMethod() {
// //     if (!this.gameOverSound) {
// //       this.gameOverSound = new Audio("audio/gameover.mp3");
// //       this.gameOverSound.volume = 0.6;
// //     }
// //     if (soundEnabled) {
// //       this.gameOverSound.currentTime = 0;
// //       this.gameOverSound.play().catch(() => { });
// //     }
// //   }

// //   handleCanvasClick(event) {
// //     if (!this.restartButtonArea) return;
// //     const rect = this.canvas.getBoundingClientRect();
// //     const scaleX = this.canvas.width / rect.width;
// //     const scaleY = this.canvas.height / rect.height;
// //     let { clientX, clientY } = this.touchesMethod(event);
// //     const clickX = (clientX - rect.left) * scaleX;
// //     const clickY = (clientY - rect.top) * scaleY;
// //     const btn = this.restartButtonArea;
// //     if ( clickX >= btn.x && clickX <= btn.x + btn.width && clickY >= btn.y && clickY <= btn.y + btn.height ) {
// //       location.reload();
// //     }
// //   }

// //   touchesMethod(event) {
// //     let clientX, clientY;
// //     if (event.touches && event.touches[0]) {
// //       clientX = event.touches[0].clientX;
// //       clientY = event.touches[0].clientY;
// //     } else if (event.changedTouches && event.changedTouches[0]) {
// //       clientX = event.changedTouches[0].clientX;
// //       clientY = event.changedTouches[0].clientY;
// //     } else {
// //       clientX = event.clientX;
// //       clientY = event.clientY;
// //     }
// //     return { clientX, clientY };
// //   }

// //   toggleSound(enabled) {
// //     if (this.character?.jumpSound) this.character.jumpSound.muted = !enabled;
// //     if (this.character?.coinSound) this.character.coinSound.muted = !enabled;
// //     if (this.character?.walkSound) this.character.walkSound.muted = !enabled;
// //     if (this.character?.hurtSound) this.character.hurtSound.muted = !enabled;

// //     this.enemies.forEach((enemy) => {
// //       if (enemy.screamSound) enemy.screamSound.muted = !enabled;
// //       if (enemy.hitSound) enemy.hitSound.muted = !enabled;
// //     });

// //     if (this.gameOverSound) this.gameOverSound.muted = !enabled;
// //     if (this.winSound) this.winSound.muted = !enabled;
// //   }

// //   draw() {
// //     if (this.playerDied) {
// //       this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
// //       this.showGameOverScreen();
// //       return;
// //     }

// //     if (this.endbossDefeated) {
// //       this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
// //       this.showWinScreen();
// //       return;
// //     }

// //     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
// //     this.ctx.translate(this.camera_x, 0);

// //     this.addObjectsToMap(this.level.backgroundObjects || []);
// //     this.ctx.translate(-this.camera_x, 0);

// //     if (this.bottleLimitMessage) {
// //       this.ctx.font = "15px Comic Sans MS";
// //       this.ctx.fillStyle = "red";
// //       this.ctx.fillText(this.bottleLimitMessage, 180, 95);
// //     }
// //     if (this.levelMessage) {
// //       this.ctx.font = "32px Comic Sans MS";
// //       this.ctx.fillStyle = "#28a745";
// //       this.ctx.textAlign = "center";
// //       this.ctx.fillText(this.levelMessage, this.canvas.width / 2, 150);
// //     }

// //     this.addToMap(this.statusBar);
// //     this.addToMap(this.statusBarBottle);
// //     this.addToMap(this.statusBarCoin);
// //     this.addObjectsToMap(this.clouds || []);

// //     this.ctx.translate(this.camera_x, 0);
// //     this.addToMap(this.character);
// //     this.addObjectsToMap(this.level.enemies || []);

// //     (this.level.enemies || []).forEach((enemy) => {
// //       if (enemy.statusBar) {
// //         enemy.statusBar.updatePosition();
// //         this.addToMap(enemy.statusBar);
// //       }
// //     });

// //     this.addObjectsToMap(this.collectableBottles || []);
// //     this.addObjectsToMap(this.collectableCoins || []);
// //     this.addObjectsToMap(this.throwableObjects || []);
// //     this.ctx.translate(-this.camera_x, 0);

// //     this.drawMobileControls();

// //     if (!this.playerDied && !this.endbossDefeated) {
// //       this.animationFrame = requestAnimationFrame(() => this.draw());
// //     }
// //   }

// //   drawMobileControls() {
// //     const ctx = this.ctx,
// //       w = this.canvas.width,
// //       h = this.canvas.height;

// //     ctx.font = "32px Comic Sans MS";
// //     ctx.textAlign = "center";
// //     ctx.textBaseline = "middle";

// //     this.leftBtnArea = { x: 30, y: h - 80, width: 60, height: 60, label: "⬅️" };
// //     this.rightBtnArea = {
// //       x: 100,
// //       y: h - 80,
// //       width: 60,
// //       height: 60,
// //       label: "➡️",
// //     };
// //     this.jumpBtnArea = {
// //       x: w - 140,
// //       y: h - 80,
// //       width: 60,
// //       height: 60,
// //       label: "⤴️",
// //     };
// //     this.throwBtnArea = {
// //       x: w - 60,
// //       y: h - 80,
// //       width: 60,
// //       height: 60,
// //       label: "🧴",
// //     };

// //     [
// //       this.leftBtnArea,
// //       this.rightBtnArea,
// //       this.jumpBtnArea,
// //       this.throwBtnArea,
// //     ].forEach((btn) => {
// //       ctx.fillStyle = "#fca534ff";
// //       ctx.beginPath();
// //       ctx.arc(
// //         btn.x + btn.width / 2,
// //         btn.y + btn.height / 2,
// //         btn.width / 2,
// //         0,
// //         Math.PI * 2
// //       );
// //       ctx.fill();

// //       ctx.fillStyle = "white";
// //       ctx.fillText(btn.label, btn.x + btn.width / 2, btn.y + btn.height / 2);
// //     });
// //   }

// //   toCanvasXY(e) {
// //     const rect = this.canvas.getBoundingClientRect();
// //     const scaleX = this.canvas.width / rect.width;
// //     const scaleY = this.canvas.height / rect.height;

// //     let clientX, clientY;
// //     if (e.touches && e.touches[0]) {
// //       clientX = e.touches[0].clientX;
// //       clientY = e.touches[0].clientY;
// //     } else if (e.changedTouches && e.changedTouches[0]) {
// //       clientX = e.changedTouches[0].clientX;
// //       clientY = e.changedTouches[0].clientY;
// //     } else {
// //       clientX = e.clientX;
// //       clientY = e.clientY;
// //     }

// //     return {
// //       x: (clientX - rect.left) * scaleX,
// //       y: (clientY - rect.top) * scaleY,
// //     };
// //   }

// //   isInsideButton(x, y, btn) {
// //     return (
// //       btn &&
// //       x >= btn.x &&
// //       x <= btn.x + btn.width &&
// //       y >= btn.y &&
// //       y <= btn.y + btn.height
// //     );
// //   }

// //   setupCanvasControls() {
// //     if (this.uiClickListenerAdded) return;
// //     this.uiClickListenerAdded = true;

// //     const handleDown = (e) => {
// //       if (e.cancelable) e.preventDefault();
// //       const { x, y } = this.toCanvasXY(e);

// //       if (this.leftBtnArea && this.isInsideButton(x, y, this.leftBtnArea))
// //         this.keyboard.LEFT = true;
// //       if (this.rightBtnArea && this.isInsideButton(x, y, this.rightBtnArea))
// //         this.keyboard.RIGHT = true;
// //       if (this.jumpBtnArea && this.isInsideButton(x, y, this.jumpBtnArea))
// //         this.keyboard.UP = true;
// //       if (this.throwBtnArea && this.isInsideButton(x, y, this.throwBtnArea))
// //         this.keyboard.D = true;
// //     };

// //     const handleUpAll = () => {
// //       this.keyboard.LEFT = false;
// //       this.keyboard.RIGHT = false;
// //       this.keyboard.UP = false;
// //       this.keyboard.D = false;
// //     };

// //     this.canvas.addEventListener("pointerdown", handleDown, { passive: false });
// //     this.canvas.addEventListener("pointerup", handleUpAll);
// //     this.canvas.addEventListener("pointercancel", handleUpAll);
// //     this.canvas.addEventListener("pointerleave", handleUpAll);

// //     this.canvas.addEventListener("touchstart", handleDown, { passive: false });
// //     this.canvas.addEventListener("touchend", handleUpAll, { passive: false });
// //     this.canvas.addEventListener("touchcancel", handleUpAll, { passive: false });

// //     this.canvas.addEventListener("mousedown", handleDown);
// //     this.canvas.addEventListener("mouseup", handleUpAll);
// //   }

// //   addObjectsToMap(objects) {
// //     if (!Array.isArray(objects)) return;
// //     objects.forEach((object) => {
// //       this.addToMap(object);
// //     });
// //   }

// //   addToMap(mo) {
// //     if (!mo) return;
// //     if (mo.otherDirection) this.flipImage(mo);
// //     mo.draw(this.ctx);
// //     mo.drawFrame?.(this.ctx);
// //     if (mo.otherDirection) this.flipImageBack(mo);
// //   }

// //   flipImage(mo) {
// //     this.ctx.save();
// //     this.ctx.translate(mo.width, 0);
// //     this.ctx.scale(-1, 1);
// //     mo.x = mo.x * -1;
// //   }

// //   flipImageBack(mo) {
// //     this.ctx.restore();
// //     mo.x = mo.x * -1;
// //   }
// // }

// class World {
//   constructor(canvas, keyboard) {
//     // --- Setup ---
//     this.canvas = canvas;
//     this.ctx = canvas.getContext("2d");
//     this.keyboard = keyboard;

//     // Spielstatus
//     this.levelEnded = false;
//     this.playerDied = false;
//     this.endbossDefeated = false;
//     this.uiScreen = null;

//     // GameObjekte
//     this.statusBar = new StatusBar();
//     this.statusBarBottle = new StatusBarBottle();
//     this.statusBarCoin = new StatusBarCoin();
//     this.throwableObjects = [];

//     this.level = level1(this);
//     this.character = new Character(this);
//     this.enemies = this.level.enemies;
//     this.clouds = this.level.clouds;
//     this.backgroundObjects = this.level.backgroundObjects;
//     this.collectableBottles = this.level.collectableObjects || [];
//     this.collectableCoins = this.level.collectableCoins || [];

//     this.setWorld();
//     this.setupCanvasControls();
//     this.draw();
//     this.run();
//   }

//   // --- INITIALISIERUNG ---
//   setWorld() {
//     this.character.world = this;
//     this.spawnEnemyLoop();
//   }

//   // --- SPIELLOOP ---
//   run() {
//     this.gameInterval = setInterval(() => {
//       if (this.levelEnded) return;

//       this.checkCollisions();
//       this.checkThrowableObjects();
//       this.checkEndbossDefeated();
//       this.removeOffscreenEnemies();
//       this.checkEndboss1Hit();
//     }, 200);
//   }

//   stopGameLoopHard(isWin = false) {
//     clearInterval(this.gameInterval);
//     clearInterval(this.enemySpawnInterval);
//     cancelAnimationFrame(this.animationFrame);

//     this.levelEnded = true;
//     this.gameOver = !isWin;
//   }

//   // --- KOLLISIONEN ---
//   checkCollisions() {
//     this.level.enemies.forEach((enemy) => this.characterColliding(enemy));
//     this.checkThrowableObjects();
//     this.characterCollidingBottle();
//     this.checkCoins();
//   }

//   // checkEndboss1Hit() {
//   //   const boss = this.level.enemies.find(
//   //     (e) => e instanceof EndbossLevel1 || e instanceof EndbossLevel2
//   //   );
//   //   if (boss && this.character.isColliding(boss) && !this.character.isHurtTimer) {
//   //     this.character.hit();
//   //   }
//   // }
//   checkEndboss1Hit() {
//   const boss = this.level.enemies.find(
//     (e) => e instanceof EndbossLevel1 || e instanceof EndbossLevel2
//   );

//   // Wenn kein Boss oder Spieler schon tot → raus
//   if (!boss || this.character.energy <= 0) return;

//   // Nur Schaden, wenn keine aktuelle Verwundung aktiv ist
//   if (this.character.isColliding(boss) && !this.character.isHurtTimer) {
//     this.character.hit();
//     this.character.isHurtTimer = true;

//     // Nach 1 Sekunde wieder verwundbar
//     setTimeout(() => {
//       this.character.isHurtTimer = false;
//     }, 1000);
//   }
// }

//   // checkThrowableObjects() {
//   //   this.throwableObjects = this.throwableObjects.filter((b) => !b.isDead());
//   // }

//   // throwableBottles() {
//   //   if (
//   //     this.keyboard.D &&
//   //     this.canThrow &&
//   //     this.statusBarBottle.availableBottles > 0
//   //   ) {
//   //     this.canThrow = false;
//   //     this.statusBarBottle.availableBottles--;
//   //     this.statusBarBottle.update();
//   //     this.throwableObjects.push(
//   //       new ThrowableObject(
//   //         this.character.x + 30,
//   //         this.character.y + 100,
//   //         this.character.otherDirection
//   //       )
//   //     );
//   //     setTimeout(() => (this.canThrow = true), 300);
//   //   }
//   // }
//   checkThrowableObjects() {
//   // Entferne kaputte oder tote Flaschen
//   this.throwableObjects = this.throwableObjects.filter(
//     (bottle) => !bottle.isDead?.()
//   );

//   // Prüfe, ob eine neue Flasche geworfen werden soll
//   this.throwableBottles();
// }

// // throwableBottles() {
// //   // Wenn D gedrückt wird, Spieler werfen darf und noch Flaschen verfügbar sind
// //   if (
// //     this.keyboard.D &&
// //     this.canThrow &&
// //     this.statusBarBottle.availableBottles > 0
// //   ) {
// //     this.canThrow = false; // Cooldown aktivieren
// //     this.statusBarBottle.availableBottles--;
// //     this.statusBarBottle.update?.();

// //     // 🔹 Erzeuge eine neue Flasche
// //     const bottle = new ThrowableObject(
// //       this.character.x + (this.character.otherDirection ? -30 : 30),
// //       this.character.y + 100,
// //       this.character.otherDirection
// //     );

// //     // 🔹 Weise der Flasche Zugriff auf die Welt zu (wichtig für remove())
// //     bottle.world = this;

// //     // 🔹 Füge sie der Liste hinzu
// //     this.throwableObjects.push(bottle);

// //     // 🔹 Cooldown für nächsten Wurf
// //     setTimeout(() => {
// //       this.canThrow = true;
// //     }, 300);
// //   }
// // }
// throwableBottles() {
//   console.log("🧴 Versuch zu werfen..."); // <== NEU
//   if (
//     this.keyboard.D &&
//     this.canThrow &&
//     this.statusBarBottle.availableBottles > 0
//   ) {
//     console.log("✅ Flasche wird geworfen!"); // <== NEU
//     this.canThrow = false;
//     this.statusBarBottle.availableBottles--;
//     this.statusBarBottle.update?.();

//     const bottle = new ThrowableObject(
//       this.character.x + (this.character.otherDirection ? -30 : 30),
//       this.character.y + 100,
//       this.character.otherDirection
//     );
//     bottle.world = this;
//     this.throwableObjects.push(bottle);

//     // Cooldown
//     setTimeout(() => {
//       this.canThrow = true;
//     }, 400);
//   }
// }

//   checkCoins() {
//     this.collectableCoins = this.collectableCoins.filter((coin) => {
//       if (this.character.isColliding(coin)) {
//         this.statusBarCoin.availableCoins++;
//         this.statusBarCoin.update();
//         if (soundEnabled) {
//           const s = new Audio("audio/coins.mp3");
//           s.volume = 0.5;
//           s.play().catch(() => {});
//         }
//         return false;
//       }
//       return true;
//     });
//   }

//   characterColliding(enemy) {
//     if (!this.character.isColliding(enemy)) return;

//     const isAbove =
//       this.character.y + this.character.height <= enemy.y + enemy.height * 0.25 &&
//       this.character.speedY > 0;

//     if (isAbove) {
//       enemy.hit?.();
//       this.character.jump();
//       if (enemy.isDead?.()) enemy.die?.();
//     } else {
//       this.character.hit();
//       this.statusBar.setPercentage(this.character.energy);
//     }
//   }

//   characterCollidingBottle() {
//     this.collectableBottles = this.collectableBottles.filter((bottle) => {
//       if (this.character.isColliding(bottle)) {
//         if (this.statusBarBottle.availableBottles < 5) {
//           this.statusBarBottle.availableBottles++;
//           this.statusBarBottle.update();
//         } else {
//           this.showBottleLimitMessage();
//         }
//         return false;
//       }
//       return true;
//     });
//   }

//   // --- ENDBOSS ---
//   checkEndbossDefeated() {
//     const endboss = this.level.enemies.find((e) => e instanceof EndbossLevel1);
//     if (!endboss || this.endbossDefeated || this.playerDied) return;

//     if (endboss.isDead?.()) {
//       this.endbossDefeated = true;
//       this.stopGameLoopHard(true);
//       this.showWinScreen();
//     }
//   }

//   // --- SPIEL ENDE ---
//   endGame() {
//     this.stopGameLoopHard();
//     this.stopEnemySounds();
//     this.playSound("audio/gameover.mp3");
//     this.showGameOverScreen();
//   }

//   playSound(path, loop = false) {
//     if (!soundEnabled) return;
//     const s = new Audio(path);
//     s.volume = 0.7;
//     s.loop = loop;
//     s.play().catch(() => {});
//   }

//   stopEnemySounds() {
//     this.level.enemies.forEach((e) => e.stopScreamSound?.());
//   }

//   // --- WIN / GAME OVER ---
//   showWinScreen() {
//     this.playSound("audio/win.mp3", true);
//     this.fadeOverlay(0.3);
//     this.drawEndScreen("img/You won, you lost/You win B.png", "#44cc44");
//   }

//   showGameOverScreen() {
//     this.playSound("audio/gameover.mp3", false);
//     this.fadeOverlay(0.8);
//     this.drawEndScreen("img/You won, you lost/Game Over.png", "#fca534ff");
//   }

//   fadeOverlay(alpha = 0.2) {
//     this.ctx.setTransform(1, 0, 0, 1, 0, 0);
//     this.ctx.fillStyle = `rgba(0,0,0,${alpha})`;
//     this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
//   }

//   drawEndScreen(imgSrc, btnColor) {
//     const ctx = this.ctx;
//     const canvas = this.canvas;
//     const img = new Image();
//     img.src = imgSrc;
//     img.onload = () => {
//       const maxWidth = canvas.width * 0.6;
//       const maxHeight = canvas.height * 0.3;
//       const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
//       const w = img.width * scale;
//       const h = img.height * scale;
//       ctx.drawImage(img, canvas.width / 2 - w / 2, canvas.height / 2 - h - 40, w, h);
//       this.drawRestartButton(btnColor);
//     };
//   }

//   drawRestartButton(color) {
//     const ctx = this.ctx;
//     const canvas = this.canvas;
//     const w = 250,
//       h = 60,
//       x = canvas.width / 2 - w / 2,
//       y = canvas.height / 2;

//     ctx.fillStyle = color;
//     ctx.fillRect(x, y, w, h);
//     ctx.font = "24px Comic Sans MS";
//     ctx.fillStyle = "white";
//     ctx.textAlign = "center";
//     ctx.fillText("Spiel neu starten", canvas.width / 2, y + 38);

//     this.restartButtonArea = { x, y, width: w, height: h };

//     if (!this.canvasClickListenerAdded) {
//       const bound = this.handleCanvasClick.bind(this);
//       canvas.addEventListener("click", bound);
//       canvas.addEventListener("touchstart", bound, { passive: false });
//       this.canvasClickListenerAdded = true;
//     }
//   }

//   handleCanvasClick(e) {
//     const rect = this.canvas.getBoundingClientRect();
//     const scaleX = this.canvas.width / rect.width;
//     const scaleY = this.canvas.height / rect.height;
//     const x = (e.clientX - rect.left) * scaleX;
//     const y = (e.clientY - rect.top) * scaleY;
//     const btn = this.restartButtonArea;
//     if (btn && x >= btn.x && x <= btn.x + btn.width && y >= btn.y && y <= btn.y + btn.height)
//       location.reload();
//   }

//   // --- ZEICHNEN ---
//   draw() {
//     if (this.playerDied) return this.showGameOverScreen();
//     if (this.endbossDefeated) return this.showWinScreen();

//     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//     this.ctx.translate(this.camera_x, 0);
//     this.addObjectsToMap(this.backgroundObjects);
//     this.ctx.translate(-this.camera_x, 0);

//     [this.statusBar, this.statusBarBottle, this.statusBarCoin].forEach((bar) =>
//       this.addToMap(bar)
//     );

//     this.ctx.translate(this.camera_x, 0);
//     this.addToMap(this.character);
//     this.addObjectsToMap(this.level.enemies);
//     this.addObjectsToMap(this.collectableBottles);
//     this.addObjectsToMap(this.collectableCoins);
//     this.addObjectsToMap(this.throwableObjects);
//     this.ctx.translate(-this.camera_x, 0);

//     this.drawMobileControls();

//     if (!this.levelEnded)
//       this.animationFrame = requestAnimationFrame(() => this.draw());
//   }

//   addObjectsToMap(objects = []) {
//     objects.forEach((o) => this.addToMap(o));
//   }

//   addToMap(mo) {
//     if (!mo) return;
//     if (mo.otherDirection) this.flipImage(mo);
//     mo.draw(this.ctx);
//     if (mo.otherDirection) this.flipImageBack(mo);
//   }

//   flipImage(mo) {
//     this.ctx.save();
//     this.ctx.translate(mo.width, 0);
//     this.ctx.scale(-1, 1);
//     mo.x *= -1;
//   }

//   flipImageBack(mo) {
//     this.ctx.restore();
//     mo.x *= -1;
//   }

//   // --- MOBILE STEUERUNG ---
//   setupCanvasControls() {
//     if (this.uiClickListenerAdded) return;
//     this.uiClickListenerAdded = true;

//     const handleDown = (e) => {
//       if (e.cancelable) e.preventDefault();
//       const { x, y } = this.toCanvasXY(e);
//       this.keyboard.LEFT = this.isInsideButton(x, y, this.leftBtnArea);
//       this.keyboard.RIGHT = this.isInsideButton(x, y, this.rightBtnArea);
//       this.keyboard.UP = this.isInsideButton(x, y, this.jumpBtnArea);
//       this.keyboard.D = this.isInsideButton(x, y, this.throwBtnArea);
//     };
//     const handleUp = () => Object.assign(this.keyboard, { LEFT: false, RIGHT: false, UP: false, D: false });

//     ["pointerdown", "touchstart", "mousedown"].forEach((t) =>
//       this.canvas.addEventListener(t, handleDown, { passive: false })
//     );
//     ["pointerup", "touchend", "mouseup"].forEach((t) =>
//       this.canvas.addEventListener(t, handleUp)
//     );
//   }

//   drawMobileControls() {
//     const ctx = this.ctx,
//       w = this.canvas.width,
//       h = this.canvas.height;

//     ctx.font = "32px Comic Sans MS";
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";

//     this.leftBtnArea = { x: 30, y: h - 80, width: 60, height: 60, label: "⬅️" };
//     this.rightBtnArea = { x: 100, y: h - 80, width: 60, height: 60, label: "➡️" };
//     this.jumpBtnArea = { x: w - 140, y: h - 80, width: 60, height: 60, label: "⤴️" };
//     this.throwBtnArea = { x: w - 60, y: h - 80, width: 60, height: 60, label: "🧴" };

//     [this.leftBtnArea, this.rightBtnArea, this.jumpBtnArea, this.throwBtnArea].forEach(
//       (b) => {
//         ctx.fillStyle = "#fca534ff";
//         ctx.beginPath();
//         ctx.arc(b.x + b.width / 2, b.y + b.height / 2, b.width / 2, 0, Math.PI * 2);
//         ctx.fill();
//         ctx.fillStyle = "white";
//         ctx.fillText(b.label, b.x + b.width / 2, b.y + b.height / 2);
//       }
//     );
//   }

//   toCanvasXY(e) {
//     const rect = this.canvas.getBoundingClientRect();
//     const scaleX = this.canvas.width / rect.width;
//     const scaleY = this.canvas.height / rect.height;
//     const x = (e.clientX - rect.left) * scaleX;
//     const y = (e.clientY - rect.top) * scaleY;
//     return { x, y };
//   }

//   isInsideButton(x, y, b) {
//     return b && x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height;
//   }

//   showBottleLimitMessage() {
//     this.bottleLimitMessage = "Flaschenlimit erreicht!";
//     clearTimeout(this.bottleLimitTimeout);
//     this.bottleLimitTimeout = setTimeout(() => (this.bottleLimitMessage = ""), 2000);
//   }

//   // --- ENEMY-SPAWN ---
// spawnEnemyLoop() {
//   const configs = this.level.config?.spawnConfig || [];
//   this.spawnIntervals = [];

//   configs.forEach(cfg => {
//     const id = setInterval(() => {
//       if (typeof cfg.condition === "function" && !cfg.condition(this.level)) return;

//       const current = this.level.enemies.filter(e => e instanceof cfg.type);
//       if (current.length < cfg.maxCount) {
//         const newEnemy = new cfg.type();
//         newEnemy.x = 900 + Math.random() * 400;
//         this.level.enemies.push(newEnemy);
//       }
//     }, cfg.interval);

//     this.spawnIntervals.push(id);
//   });
// }

//   removeOffscreenEnemies() {
//     this.level.enemies = this.level.enemies.filter(
//       (e) =>
//         !(e instanceof ChickenSmall || e instanceof ChickenNormal) || e.x > -50
//     );
//   }
// }

/**
 * 🌍 Hauptklasse, die das gesamte Spiel verwaltet
 * - steuert Spiellogik, Rendering, Kollisionen, Sounds, UI und Eingaben
 */
class World {
  constructor(canvas, keyboard) {
    /** --- Basis Setup --- */
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;

    this.canThrow = true;

    /** --- Statusflags --- */
    this.levelEnded = false;
    this.playerDied = false;
    this.endbossDefeated = false;
    this.uiScreen = null;

    /** --- Spielobjekte --- */
    this.statusBar = new StatusBar();
    this.statusBarBottle = new StatusBarBottle();
    this.statusBarCoin = new StatusBarCoin();
    this.throwableObjects = [];

    /** --- Level / Charakter laden --- */
    this.level = level1(this);
    this.character = new Character(this);
    this.enemies = this.level.enemies;
    this.clouds = this.level.clouds;
    this.backgroundObjects = this.level.backgroundObjects;
    this.collectableBottles = this.level.collectableObjects || [];
    this.collectableCoins = this.level.collectableCoins || [];

    /** --- Initialisierung --- */
    this.setWorld();
    this.setupCanvasControls();
    this.draw();
    this.run();
  }

  /** 🔧 Welt konfigurieren */
  setWorld() {
    this.character.world = this;
    this.spawnEnemyLoop();
  }

  /** ♻️ Spiel-Loop */
  // run() {
  //   this.gameInterval = setInterval(() => {
  //     if (this.levelEnded) return;
  //     this.checkCollisions();
  //     this.checkThrowableObjects();
  //     this.checkEndbossDefeated();
  //     this.removeOffscreenEnemies();
  //     this.checkEndboss1Hit();
  //   }, 200);
  // }
  run() {
    this.gameInterval = setInterval(() => {
      // ⛔ Wenn das Spiel schon vorbei ist, nichts mehr tun
      if (this.levelEnded) return;

      // 🔍 Hauptprüfungen pro Tick
      this.checkCollisions(); // prüft Kollisionen mit Gegnern & Items
      this.checkThrowableObjects(); // verwaltet fliegende Flaschen
      this.checkEndbossDefeated(); // prüft, ob Endboss tot ist
      this.removeOffscreenEnemies(); // entfernt Gegner außerhalb des Bildschirms
      this.checkEndboss1Hit(); // prüft, ob Spieler vom Boss getroffen wurde

      // 💀 Prüfen, ob Spieler tot ist
      if (
        this.character.energy <= 0 && // keine Energie mehr
        !this.playerDied && // noch kein Tod markiert
        !this.endbossDefeated // kein Win-Screen aktiv
      ) {
        console.log("💀 Spieler ist gestorben – Game Over!");
        this.playerDied = true;
        this.stopGameLoopHard(); // stoppt alle Intervalle / Animationen
        this.showGameOverScreen(); // zeigt Game-Over-Screen + Sound
      }
    }, 200);
  }

  /** 🛑 Spiel stoppen */
  stopGameLoopHard(isWin = false) {
    clearInterval(this.gameInterval);
    clearInterval(this.enemySpawnInterval);
    cancelAnimationFrame(this.animationFrame);
    this.levelEnded = true;
    this.gameOver = !isWin;
  }

  // ---------------------------------------------------------------------------
  // 🧱 KOLLISIONEN & INTERAKTIONEN
  // ---------------------------------------------------------------------------

  /** Prüft alle Kollisionen */
  checkCollisions() {
    this.level.enemies.forEach((e) => this.characterColliding(e));
    this.checkThrowableObjects();
    this.characterCollidingBottle();
    this.checkCoins();
  }

  /** Prüft Kollision mit Endboss */
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

  /** Prüft geworfene Flaschen */
  // checkThrowableObjects() {
  //   this.throwableObjects = this.throwableObjects.filter((b) => !b.isDead?.());
  //   this.throwableBottles();
  // }
  checkThrowableObjects() {
    // Entferne zerstörte Flaschen
    this.throwableObjects = this.throwableObjects.filter((b) => !b.isDead?.());

    // Prüfe Kollision jeder aktiven Flasche mit jedem Gegner
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (!enemy.isDead?.() && bottle.isColliding(enemy)) {
          enemy.hit?.();
          bottle.break?.();
        }
      });
    });

    // Flaschenwurf prüfen (Taste D)
    this.throwableBottles();
  }

  /** Flaschenwurf */
  throwableBottles() {
    console.log("🧴 Versuch zu werfen...");
    console.log("this.canThrow =", this.canThrow);
    console.log("availableBottles =", this.statusBarBottle.availableBottles);
    console.log("keyboard.D =", this.keyboard.D);

    if (
      this.keyboard.D &&
      this.canThrow &&
      this.statusBarBottle.availableBottles > 0
    ) {
      console.log("✅ Flasche wird geworfen!");
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
  }

  /** Kollision mit Münzen */
  checkCoins() {
    this.collectableCoins = this.collectableCoins.filter((coin) => {
      if (this.character.isColliding(coin)) {
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

  /** Kollision Spieler ↔ Gegner */
  characterColliding(enemy) {
    if (!this.character.isColliding(enemy)) return;

    const isAbove =
      this.character.y + this.character.height <=
        enemy.y + enemy.height * 0.25 && this.character.speedY > 0;

    if (isAbove) {
      enemy.hit?.();
      this.character.jump();
      if (enemy.isDead?.()) enemy.die?.();
    } else {
      this.character.hit();
      this.statusBar.setPercentage(this.character.energy);
    }
  }

  /** Kollision Spieler ↔ Flaschen */
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

  // ---------------------------------------------------------------------------
  // 👑 ENDBOSS & SPIELSTATUS
  // ---------------------------------------------------------------------------

  /** Prüft, ob Endboss besiegt wurde */
  checkEndbossDefeated() {
    const endboss = this.level.enemies.find((e) => e instanceof EndbossLevel1);
    if (!endboss || this.endbossDefeated || this.playerDied) return;

    if (endboss.isDead?.()) {
      this.endbossDefeated = true;
      this.stopGameLoopHard(true);
      this.showWinScreen();
    }
  }

  /** Beendet das Spiel */
  endGame() {
    this.stopGameLoopHard();
    this.stopEnemySounds();
    this.playSound("audio/gameover.mp3");
    this.showGameOverScreen();
  }

  // ---------------------------------------------------------------------------
  // 🔊 SOUND & EFFEKTE
  // ---------------------------------------------------------------------------

  playSound(path, loop = false) {
    if (!soundEnabled) return;
    const s = new Audio(path);
    s.volume = 0.7;
    s.loop = loop;
    s.play().catch(() => {});
  }

  stopEnemySounds() {
    this.level.enemies.forEach((e) => e.stopScreamSound?.());
  }

  // ---------------------------------------------------------------------------
  // 🏆 WIN / GAME OVER
  // ---------------------------------------------------------------------------

  // showWinScreen() {
  //   this.playSound("audio/win.mp3", true);
  //   this.fadeOverlay(0.3);
  //   this.drawEndScreen("img/You won, you lost/You win B.png", "#44cc44");
  // }
  showWinScreen() {
    // Verhindert doppeltes Aufrufen
    if (this._winShown) return;
    this._winShown = true;
    this._gameOverPlayed = true; // verhindert, dass Game-Over danach triggert

    console.log("🏆 Spieler hat gewonnen!");
    this.stopGameLoopHard(true);
    this.playSound("audio/win.mp3", true); // Dauerschleife bis Neustart

    // Hintergrund leicht abdunkeln, Spielbild bleibt sichtbar
    this.fadeOverlay(0.3);

    this.drawEndScreen("img/You won, you lost/You win B.png", "#44cc44");
  }

  // showGameOverScreen() {
  //   this.playSound("audio/gameover.mp3");
  //   this.fadeOverlay(0.8);
  //   this.drawEndScreen("img/You won, you lost/Game Over.png", "#fca534ff");
  // }
  // showGameOverScreen() {
  //   if (this._gameOverPlayed) return;
  //   this._gameOverPlayed = true;

  //   this.playSound("audio/gameover.mp3", false);
  //   this.fadeOverlay(0.8);
  //   this.drawEndScreen("img/You won, you lost/Game Over.png", "#fca534ff");
  // }
  showGameOverScreen() {
    // Nur einmal ausführen
    if (this._gameOverPlayed) return;
    this._gameOverPlayed = true;
    this._winShown = true; // verhindert Win danach

    console.log("💀 Game Over!");
    this.stopGameLoopHard(false);
    this.playSound("audio/gameover.mp3", false); // einmal abspielen

    // Spielbild stark abdunkeln
    this.fadeOverlay(0.8);

    this.drawEndScreen("img/You won, you lost/Game Over.png", "#fca534ff");
  }

  fadeOverlay(alpha = 0.2) {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawEndScreen(imgSrc, btnColor) {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const img = new Image();

    img.src = imgSrc;
    img.onload = () => {
      const scale = Math.min(
        (canvas.width * 0.6) / img.width,
        (canvas.height * 0.3) / img.height
      );
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(
        img,
        canvas.width / 2 - w / 2,
        canvas.height / 2 - h - 40,
        w,
        h
      );
      this.drawRestartButton(btnColor);
    };
  }

  // drawRestartButton(color) {
  //   const ctx = this.ctx,
  //     c = this.canvas;
  //   const w = 250,
  //     h = 60,
  //     x = c.width / 2 - w / 2,
  //     y = c.height / 2;
  //   ctx.fillStyle = color;
  //   ctx.fillRect(x, y, w, h);
  //   ctx.font = "24px Comic Sans MS";
  //   ctx.fillStyle = "white";
  //   ctx.textAlign = "center";
  //   ctx.fillText("Spiel neu starten", c.width / 2, y + 38);

  //   this.restartButtonArea = { x, y, width: w, height: h };

  //   if (!this.canvasClickListenerAdded) {
  //     const bound = this.handleCanvasClick.bind(this);
  //     c.addEventListener("click", bound);
  //     c.addEventListener("touchstart", bound, { passive: false });
  //     this.canvasClickListenerAdded = true;
  //   }
  // }
  // drawRestartButton(color) {
  //   const ctx = this.ctx;
  //   const canvas = this.canvas;
  //   const w = 250,
  //     h = 60;
  //   const x = canvas.width / 2 - w / 2;
  //   const y = canvas.height / 2;

  //   // 🔳 Button zeichnen
  //   ctx.fillStyle = color;
  //   ctx.fillRect(x, y, w, h);
  //   ctx.font = "24px Comic Sans MS";
  //   ctx.fillStyle = "white";
  //   ctx.textAlign = "center";
  //   ctx.fillText("Spiel neu starten", canvas.width / 2, y + 38);

  //   // 🔹 Klickbereich speichern
  //   this.restartButtonArea = { x, y, width: w, height: h };

  //   // 🖱️ Listener nur einmal hinzufügen
  //   if (!this.canvasClickListenerAdded) {
  //     const boundHandler = this.handleRestartClick.bind(this);
  //     canvas.addEventListener("click", boundHandler);
  //     canvas.addEventListener("touchstart", boundHandler, { passive: false });
  //     canvas.addEventListener("pointerdown", boundHandler);
  //     this.canvasClickListenerAdded = true;
  //   }
  // }
  drawRestartButton(color) {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const w = 250,
      h = 60;
    const x = canvas.width / 2 - w / 2;
    const y = canvas.height / 2;

    // 🌟 Pulsierende Animation
    let pulse = 0;
    const animatePulse = () => {
      if (this.levelEnded) {
        // Nur animieren, wenn das Spiel vorbei ist
        ctx.save();
        ctx.globalAlpha = 0.2 + Math.sin(Date.now() / 400) * 0.2; // Leichte Transparenzbewegung
        ctx.fillStyle = "#fff"; // heller Schein
        ctx.beginPath();
        ctx.roundRect(x - 5, y - 5, w + 10, h + 10, 10);
        ctx.fill();
        ctx.restore();

        // 🔳 Hauptbutton
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
        ctx.font = "24px Comic Sans MS";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Spiel neu starten", canvas.width / 2, y + 38);

        // ♻️ Wiederholen (sanftes Leuchten)
        pulse = requestAnimationFrame(animatePulse);
      } else {
        cancelAnimationFrame(pulse);
      }
    };

    // Erste Zeichnung
    animatePulse();

    // Klickbereich speichern
    this.restartButtonArea = { x, y, width: w, height: h };

    // Listener nur einmal hinzufügen
    if (!this.canvasClickListenerAdded) {
      const boundHandler = this.handleRestartClick.bind(this);
      canvas.addEventListener("click", boundHandler);
      canvas.addEventListener("touchstart", boundHandler, { passive: false });
      canvas.addEventListener("pointerdown", boundHandler);
      this.canvasClickListenerAdded = true;
    }
  }

  handleRestartClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const btn = this.restartButtonArea;
    if (!btn) return;

    // Prüfen, ob Klick auf Button erfolgte
    const inside =
      x >= btn.x &&
      x <= btn.x + btn.width &&
      y >= btn.y &&
      y <= btn.y + btn.height;

    if (inside) {
      console.log("🔁 Neustart des Spiels...");

      // 🧹 Sauber aufräumen vor Reload
      this.stopAllSounds();
      this.stopGameLoopHard();
      this._winShown = false;
      this._gameOverPlayed = false;

      // ⏳ kleine Verzögerung für bessere UX
      setTimeout(() => location.reload(), 300);
    }
  }

  handleCanvasClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const btn = this.restartButtonArea;
    if (
      btn &&
      x >= btn.x &&
      x <= btn.x + btn.width &&
      y >= btn.y &&
      y <= btn.y + btn.height
    )
      location.reload();
  }

  // ---------------------------------------------------------------------------
  // 🖼️ ZEICHNEN
  // ---------------------------------------------------------------------------

  draw() {
    if (this.playerDied) return this.showGameOverScreen();
    if (this.endbossDefeated) return this.showWinScreen();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);

    [this.statusBar, this.statusBarBottle, this.statusBarCoin].forEach((b) =>
      this.addToMap(b)
    );

    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.collectableBottles);
    this.addObjectsToMap(this.collectableCoins);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);

    this.drawMobileControls();

    if (!this.levelEnded)
      this.animationFrame = requestAnimationFrame(() => this.draw());
  }

  addObjectsToMap(objects = []) {
    objects.forEach((o) => this.addToMap(o));
  }

  addToMap(mo) {
    if (!mo) return;
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x *= -1;
  }

  flipImageBack(mo) {
    this.ctx.restore();
    mo.x *= -1;
  }

  // ---------------------------------------------------------------------------
  // 📱 MOBILE STEUERUNG
  // ---------------------------------------------------------------------------

  setupCanvasControls() {
    if (this.uiClickListenerAdded) return;
    this.uiClickListenerAdded = true;

    const handleDown = (e) => {
      if (e.cancelable) e.preventDefault();
      const { x, y } = this.toCanvasXY(e);
      this.keyboard.LEFT = this.isInsideButton(x, y, this.leftBtnArea);
      this.keyboard.RIGHT = this.isInsideButton(x, y, this.rightBtnArea);
      this.keyboard.UP = this.isInsideButton(x, y, this.jumpBtnArea);
      this.keyboard.D = this.isInsideButton(x, y, this.throwBtnArea);
    };
    const handleUp = () =>
      Object.assign(this.keyboard, {
        LEFT: false,
        RIGHT: false,
        UP: false,
        D: false,
      });

    ["pointerdown", "touchstart", "mousedown"].forEach((t) =>
      this.canvas.addEventListener(t, handleDown, { passive: false })
    );
    ["pointerup", "touchend", "mouseup"].forEach((t) =>
      this.canvas.addEventListener(t, handleUp)
    );
  }

  drawMobileControls() {
    const ctx = this.ctx,
      w = this.canvas.width,
      h = this.canvas.height;
    ctx.font = "32px Comic Sans MS";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

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
    ].forEach((b) => {
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
      ctx.fillText(b.label, b.x + b.width / 2, b.y + b.height / 2);
    });
  }

  toCanvasXY(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  isInsideButton(x, y, b) {
    return (
      b && x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height
    );
  }

  showBottleLimitMessage() {
    this.bottleLimitMessage = "Flaschenlimit erreicht!";
    clearTimeout(this.bottleLimitTimeout);
    this.bottleLimitTimeout = setTimeout(
      () => (this.bottleLimitMessage = ""),
      2000
    );
  }

  // ---------------------------------------------------------------------------
  // 🐔 ENEMY-SPAWN
  // ---------------------------------------------------------------------------

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

  /** Entfernt Gegner, die vom Bildschirm verschwinden */
  removeOffscreenEnemies() {
    this.level.enemies = this.level.enemies.filter(
      (e) =>
        !(e instanceof ChickenSmall || e instanceof ChickenNormal) || e.x > -50
    );
  }

  stopAllSounds() {
    try {
      // Stoppe alle Gegner-Sounds
      this.stopEnemySounds();

      // Stoppe globale Sounds, falls aktiv
      const audios = document.querySelectorAll("audio");
      audios.forEach((a) => {
        a.pause();
        a.currentTime = 0;
      });

      console.log("🔇 Alle Sounds gestoppt.");
    } catch (err) {
      console.warn("Fehler beim Stoppen der Sounds:", err);
    }
  }
}
