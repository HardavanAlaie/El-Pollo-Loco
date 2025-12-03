/**
 * ------------------------------------------------------------
 * Handles all collision and damage logic for the world.
 *
 * @class CollisionManager
 * ------------------------------------------------------------
 */
class CollisionManager {
  /**
   * @param {World} world - Reference to the game world instance.
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * ------------------------------------------------------------
   * Called once per frame from World.run() to process all
   * collision-related checks and character energy state.
   *
   * @function update
   * ------------------------------------------------------------
   */
  update() {
    this.checkCollisions();
    this.checkThrowableObjects();
    this.checkEndboss1Hit();
    this.checkEndbossDefeated();
    this.removeOffscreenEnemies();
    this.characterEnergyMethod();
  }

  /**
   * ------------------------------------------------------------
   * Main collision dispatcher: handles enemy collisions, bottle
   * collisions, coin collection and bottle collection.
   *
   * @function checkCollisions
   * ------------------------------------------------------------
   */
  checkCollisions() {
    const w = this.world;
    w.level.enemies.forEach((e) => this.characterColliding(e));
    this.checkThrowableObjects?.(); // falls du das auch hierher verschieben willst
    w.character.collectBottle();
    this.checkCoins?.(); // kannst du später ebenfalls hier reinziehen
  }

  /**
   * ------------------------------------------------------------
   * Handles collision between the character and a single enemy,
   * including stomp, tight hitbox check and hurt cooldown.
   *
   * @function characterColliding
   * @param {object} enemy
   * ------------------------------------------------------------
   */
  characterColliding(enemy) {
    const w = this.world;
    const c = w.character;
    if (!c || !enemy) return;
    if (enemy.isDead?.() || enemy.dead) return;
    if (!c.isColliding(enemy)) return;

    const isStomp = this.characterCollidingConstsMethod(c, enemy);
    if (isStomp) {
      return this.ifIsStompMethod(enemy, c);
    }

    const isCloseEnough = c.isCollidingTight(enemy, 20);
    if (!isCloseEnough) return;

    if (!c.isHurtTimer) {
      this.ifIsHurtTimerMethod(c);
    }
  }

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
  characterCollidingConstsMethod(c, enemy) {
    const charBottom = c.y + c.height;
    const enemyCenterY = enemy.y + enemy.height / 2;
    const isStomp = charBottom <= enemyCenterY && c.speedY <= 0;
    return isStomp;
  }

  /**
   * ------------------------------------------------------------
   * Applies damage to the character, updates the status bar, and
   * activates a temporary hurt timer to prevent repeated hits.
   *
   * @function ifIsHurtTimerMethod
   * @param {object} c - The character object.
   * ------------------------------------------------------------
   */
  ifIsHurtTimerMethod(c) {
    const w = this.world;
    c.hit();
    w.statusBar.setPercentage(c.energy);
    c.isHurtTimer = true;
    setTimeout(() => (c.isHurtTimer = false), 700);
  }

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
  ifIsStompMethod(enemy, c) {
    if (enemy instanceof EndbossLevel1) {
      enemy.takeDamage?.(20);
    } else {
      enemy.hit?.();
    }
    c.speedY = 25;
    c.y = enemy.y - c.height;
    c.lastHit = 0;
    if (enemy.isDead?.()) enemy.die?.();
    return;
  }

  /**
   * ------------------------------------------------------------
   * Handles character death when energy reaches zero and triggers
   * the game over flow if the player has not already died or won.
   *
   * @function characterEnergyMethod
   * ------------------------------------------------------------
   */
  characterEnergyMethod() {
    const w = this.world;
    if (
      w.character.energy <= 0 &&
      !w.playerDied &&
      !w.endbossDefeated
    ) {
      w.playerDied = true;
      w.stopGameLoopHard();
      w.showGameOverScreen();
    }
  }

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
  ifDeadIfCollidingMethod(enemy, bottle) {
    if (!enemy.isDead?.() && bottle.isColliding(enemy)) {
      if (enemy instanceof EndbossLevel1) {
        enemy.takeDamage?.(20);
      } else {
        enemy.hit?.();
      }
      bottle.break?.();
    }
  }

    checkEndboss1Hit() {
    const boss = this.level.enemies.find((e) => e instanceof EndbossLevel1);
    if (!boss || this.character.energy <= 0) return;
    if (this.character.isColliding(boss) && !this.character.isHurtTimer) {
      this.character.hit();
      this.character.isHurtTimer = true;
      setTimeout(() => (this.character.isHurtTimer = false), 1000);
    }
  }

    checkEndbossDefeated() {
    const endboss = this.level.enemies.find((e) => e instanceof EndbossLevel1);
    if (!endboss || this.endbossDefeated || this.playerDied) return;
    if (endboss.isDead?.()) {
      if (!endboss.deathStartTime) {
        endboss.deathStartTime = Date.now();
      }
      const elapsed = Date.now() - endboss.deathStartTime;
      if (elapsed >= 1000) {
        this.endbossDefeated = true;
        this.stopGameLoopHard(true);
        this.showWinScreen();
      }
    }
  }

    removeOffscreenEnemies() {
    this.level.enemies = this.level.enemies.filter(
      (e) =>
        !(e instanceof ChickenSmall || e instanceof ChickenNormal) || e.x > -50
    );
  }

//     checkThrowableObjects() {
//     this.throwableObjects = this.throwableObjects.filter((b) => !b.isDead?.());
//     this.throwableObjects.forEach((bottle) => {
//       if (bottle.isBroken) return;
//       this.level.enemies.forEach((enemy) => {
//         if (bottle.isBroken) return;
//         this.ifDeadIfCollidingMethod(enemy, bottle);
//       });
//     });
//     this.throwableBottles();
//   }
/**
 * ------------------------------------------------------------
 * Updates all throwable bottles: checks for enemy hits,
 * removes dead bottles and keeps active ones.
 *
 * @function checkThrowableObjects
 * ------------------------------------------------------------
 */
checkThrowableObjects() {
  const w = this.world;
  if (!w.throwableObjects) return;

  w.throwableObjects = w.throwableObjects.filter((bottle) => {
    // Flasche „tot“? → aus der Welt entfernen
    if (bottle.isDead?.()) {
      bottle.remove?.();
      return false;
    }

    // Kollision mit Gegnern prüfen
    w.level.enemies.forEach((enemy) =>
      this.ifDeadIfCollidingMethod(enemy, bottle)
    );

    return true;
  });
}


    checkCoins() {
    this.collectableCoins = this.collectableCoins.filter((coin) => {
      if (this.isCoinCollected(coin)) {
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

  // Hier kannst du nach und nach weitere Methoden rüberziehen:
  // - checkEndboss1Hit()
  // - checkEndbossDefeated()
  // - removeOffscreenEnemies()
  // - checkThrowableObjects()
  // - checkCoins()
}
