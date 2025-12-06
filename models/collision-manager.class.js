/**
 * ------------------------------------------------------------
 * Handles all collision, damage, bottles and coin logic
 * for the World instance.
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
   * Called once per frame from world.run() / world.update()
   * to process all collision-related checks.
   *
   * @function update
   * ------------------------------------------------------------
   */
  update() {
    this.checkCollisions();
    this.checkEndbossDefeated();
    this.removeOffscreenEnemies();
    this.checkEndboss1Hit();
    this.characterEnergyMethod();
  }

  /** Handles all types of collisions in the world. */
  checkCollisions() {
    const w = this.world;
    w.level.enemies.forEach((e) => this.characterColliding(e));
    this.checkThrowableObjects();
    w.character.collectBottle();
    this.checkCoins();
  }

  /** Checks if the Endboss collides with the player (causes damage). */
  checkEndboss1Hit() {
    const w = this.world;
    const boss = w.level.enemies.find((e) => e instanceof EndbossLevel1);
    if (!boss || w.character.energy <= 0) return;
    if (w.character.isColliding(boss) && !w.character.isHurtTimer) {
      w.character.hit();
      w.character.isHurtTimer = true;
      setTimeout(() => (w.character.isHurtTimer = false), 1000);
    }
  }

  /** Manages all throwable objects and checks for enemy collisions. */
  checkThrowableObjects() {
    const w = this.world;
    w.throwableObjects = w.throwableObjects.filter((b) => !b.isDead?.());
    w.throwableObjects.forEach((bottle) => {
      if (bottle.isBroken) return;
      w.level.enemies.forEach((enemy) => {
        if (bottle.isBroken) return;
        this.ifDeadIfCollidingMethod(enemy, bottle);
      });
    });
    this.throwableBottles();
  }

  /**
   * Applies damage to an enemy when hit by a bottle if they are
   * colliding and the enemy is still alive, and breaks the bottle.
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

  /** Throws a new bottle when allowed and updates the bottle counter. */
  throwableBottles() {
    const w = this.world;
    if (
      w.keyboard.D &&
      w.canThrow &&
      w.statusBarBottle.availableBottles > 0
    ) {
      this.ifThrowableBottlesMethod();
    }
  }

  /**
   * Handles the logic for throwing a bottle, including cooldown,
   * reducing available bottles, spawning the throwable object,
   * and re-enabling throwing after a delay.
   */
  ifThrowableBottlesMethod() {
    const w = this.world;
    w.canThrow = false;
    w.statusBarBottle.availableBottles--;
    w.statusBarBottle.update?.();
    const bottle = new ThrowableObject(
      w.character.x + (w.character.otherDirection ? -30 : 30),
      w.character.y + 100,
      w.character.otherDirection
    );
    bottle.world = w;
    w.throwableObjects.push(bottle);
    setTimeout(() => (w.canThrow = true), 400);
  }

  /** Checks for player collisions with coins and updates the coin bar. */
  checkCoins() {
    const w = this.world;
    w.collectableCoins = w.collectableCoins.filter((coin) => {
      if (this.isCoinCollected(coin)) {
        w.statusBarCoin.availableCoins++;
        w.statusBarCoin.update();
        if (soundEnabled) {
          const s = new Audio("audio/coins.mp3");
          s.volume = 0.5;
          s.play().catch(() => {});
        } return false;}
      return true;
    });
  }

  /**
   * Sehr kleine Hitbox nur für Coin-Einsammeln.
   * Nutzt die Zentren von Charakter und Coin, damit es optisch passt.
   */
  coinPickupCollision(coin) {
    const w = this.world;
    const cx = w.character.x + w.character.width / 2;
    const cy = w.character.y + w.character.height / 2;
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
    const w = this.world;
    if (!coin || !w.character) return false;
    const c = w.character;
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
   * Calculates an inner padded hitbox for a coin to make
   * collision detection slightly less sensitive at the edges.
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
  //   const w = this.world;
  //   const c = w.character;
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
 * Handles character–enemy collision logic:
 * - stomp kills when the player lands on top
 * - body collision damage only if tight body hitboxes overlap.
 */
characterColliding(enemy) {
  const w = this.world;
  const c = w.character;
  if (!c || !enemy) return;
  if (enemy.isDead?.() || enemy.dead) return;

  // Erst überhaupt prüfen, ob sich die Bounding-Boxes berühren
  if (!c.isColliding(enemy)) return;

  // 1. Stomp (Springen auf Gegner) hat Vorrang, damit das Gefühl bleibt wie vorher
  const isStomp = this.characterCollidingConstsMethod(c, enemy);
  if (isStomp) {
    return this.ifIsStompMethod(enemy, c);
  }

  // 2. Für Schaden: noch einmal mit deutlich engeren "Body"-Hitboxen prüfen
  const bodyHit = this.isBodyCollision(c, enemy);
  if (!bodyHit) return;

  if (!c.isHurtTimer) {
    this.ifIsHurtTimerMethod(c);
  }
}

/**
 * Uses tightened body hitboxes for both character and enemy
 * so that damage is only applied when they visually overlap closely.
 */
// isBodyCollision(c, enemy) {
//   // Charakter-Hitbox etwas verkleinern
//   const insetCharX = c.width * 0.25;
//   const insetCharY = c.height * 0.2;
//   const ax1 = c.x + insetCharX;
//   const ay1 = c.y + insetCharY;
//   const ax2 = c.x + c.width - insetCharX;
//   const ay2 = c.y + c.height - insetCharY;

//   // Gegner-Hitbox ebenfalls etwas verkleinern
//   const insetEnemyX = enemy.width * 0.25;
//   const insetEnemyY = enemy.height * 0.2;
//   const bx1 = enemy.x + insetEnemyX;
//   const by1 = enemy.y + insetEnemyY;
//   const bx2 = enemy.x + enemy.width - insetEnemyX;
//   const by2 = enemy.y + enemy.height - insetEnemyY;

//   // Rechteck-Kollision der „inneren“ Körperflächen
//   return ax2 > bx1 && ax1 < bx2 && ay2 > by1 && ay1 < by2;
// }

/**
 * Uses tightened body hitboxes for both character and enemy
 * so that damage timing feels natural. Hitbox size is tuned
 * per enemy type to avoid "air hits" or missing collisions.
 */
// isBodyCollision(c, enemy) {
//   // Character body rectangle (leicht verkleinert, aber nicht zu extrem)
//   const insetCharX = c.width * 0.2;
//   const insetCharY = c.height * 0.15;
//   const ax1 = c.x + insetCharX;
//   const ay1 = c.y + insetCharY;
//   const ax2 = c.x + c.width - insetCharX;
//   const ay2 = c.y + c.height - insetCharY;

//   // Enemy body rectangle – abhängig vom Typ
//   let insetEnemyXFactor;
//   let insetEnemyYFactor;

//   if (enemy instanceof EndbossLevel1) {
//     // Boss ist groß und soll NICHT aus der Luft treffen -> deutlich kleinere Body-Hitbox
//     insetEnemyXFactor = 0.4;   // viel schmaler
//     insetEnemyYFactor = 0.3;   // etwas niedriger
//   } else if (enemy instanceof ChickenNormal) {
//     // Normale Chicken: Treffer etwas früher als vorher, aber nicht übertrieben
//     insetEnemyXFactor = 0.18;
//     insetEnemyYFactor = 0.15;
//   } else if (enemy instanceof ChickenSmall) {
//     // Kleine Chicken: sehr kleine Sprites — daher fast volle Breite/Höhe als Body
//     // sonst rutscht der Charakter optisch darüber ohne Hit
//     insetEnemyXFactor = 0.05;
//     insetEnemyYFactor = 0.05;
//   } else {
//     // Fallback für unbekannte Gegner
//     insetEnemyXFactor = 0.25;
//     insetEnemyYFactor = 0.2;
//   }

//   const insetEnemyX = enemy.width * insetEnemyXFactor;
//   const insetEnemyY = enemy.height * insetEnemyYFactor;

//   const bx1 = enemy.x + insetEnemyX;
//   const by1 = enemy.y + insetEnemyY;
//   const bx2 = enemy.x + enemy.width - insetEnemyX;
//   const by2 = enemy.y + enemy.height - insetEnemyY;

//   // Rechteck-Kollision der inneren Körperflächen
//   return ax2 > bx1 && ax1 < bx2 && ay2 > by1 && ay1 < by2;
// }

/**
 * Uses tightened body hitboxes for both character and enemy
 * so that damage timing feels natural. Hitbox size is tuned
 * per enemy type to avoid "air hits" or missing collisions.
 */
isBodyCollision(c, enemy) {
  // Character body rectangle (leicht verkleinert, gemeinsame Basis)
  const insetCharX = c.width * 0.2;
  const insetCharY = c.height * 0.15;
  const ax1 = c.x + insetCharX;
  const ay1 = c.y + insetCharY;
  const ax2 = c.x + c.width - insetCharX;
  const ay2 = c.y + c.height - insetCharY;

  // Enemy body rectangle – abhängig vom Typ, feinjustiert
  let insetEnemyXFactor;
  let insetEnemyYFactor;

  if (enemy instanceof EndbossLevel1) {
    // Boss: sehr kleine Body-Hitbox → Schaden nur, wenn du wirklich nah dran bist
    insetEnemyXFactor = 0.6;   // sehr schmal
    insetEnemyYFactor = 0.4;    // flacher
  } else if (enemy instanceof ChickenNormal) {
    // Normales Chicken: war bei dir "perfekt" → nicht anfassen
    insetEnemyXFactor = 0.18;
    insetEnemyYFactor = 0.15;
  } else if (enemy instanceof ChickenSmall) {
    // Kleines Chicken: etwas kleinere Hitbox als eben,
    // damit Schaden erst noch ein Stück näher passiert
    insetEnemyXFactor = 0.2;
    insetEnemyYFactor = 0.18;
  } else {
    // Fallback für alle anderen Gegner
    insetEnemyXFactor = 0.25;
    insetEnemyYFactor = 0.2;
  }

  const insetEnemyX = enemy.width * insetEnemyXFactor;
  const insetEnemyY = enemy.height * insetEnemyYFactor;

  const bx1 = enemy.x + insetEnemyX;
  const by1 = enemy.y + insetEnemyY;
  const bx2 = enemy.x + enemy.width - insetEnemyX;
  const by2 = enemy.y + enemy.height - insetEnemyY;

  // Rechteck-Kollision der inneren Körperflächen
  return ax2 > bx1 && ax1 < bx2 && ay2 > by1 && ay1 < by2;
}





  /**
   * Determines whether a collision between the character and an
   * enemy should be treated as a stomp based on vertical positions
   * and the character's vertical speed.
   */
  characterCollidingConstsMethod(c, enemy) {
    const charBottom = c.y + c.height;
    const enemyCenterY = enemy.y + enemy.height / 2;
    const isStomp = charBottom <= enemyCenterY && c.speedY <= 0;
    return isStomp;
  }

  /**
   * Applies damage to the character, updates the status bar, and
   * activates a temporary hurt timer to prevent repeated hits.
   */
  ifIsHurtTimerMethod(c) {
    const w = this.world;
    c.hit();
    w.statusBar.setPercentage(c.energy);
    c.isHurtTimer = true;
    setTimeout(() => (c.isHurtTimer = false), 700);
  }

  /**
   * Handles stomp interactions where the character jumps on an
   * enemy, dealing damage and bouncing the character upward. If
   * the enemy dies, its death logic is triggered.
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

  /** Checks if the Endboss has been defeated. */
  checkEndbossDefeated() {
    const w = this.world;
    const endboss = w.level.enemies.find((e) => e instanceof EndbossLevel1);
    if (!endboss || w.endbossDefeated || w.playerDied) return;
    if (endboss.isDead?.()) {
      if (!endboss.deathStartTime) {
        endboss.deathStartTime = Date.now();
      }
      const elapsed = Date.now() - endboss.deathStartTime;
      if (elapsed >= 1000) {w.endbossDefeated = true; w.stopGameLoopHard(true); w.showWinScreen();
      }
    }
  }

  /** Handles character death and triggers game over flow. */
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

  /** Removes enemies that have moved off-screen to optimize performance. */
  removeOffscreenEnemies() {
    const w = this.world;
    w.level.enemies = w.level.enemies.filter(
      (e) =>
        !(e instanceof ChickenSmall || e instanceof ChickenNormal) || e.x > -50
    );
  }
}
