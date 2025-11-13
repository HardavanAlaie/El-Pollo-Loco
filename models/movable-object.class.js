/**
 * 🔹 Class: MovableObject
 * Base class for all moving entities (Character, Enemies, etc.)
 * Extends DrawableObject to add physics, gravity, movement, and collision logic.
 */
class MovableObject extends DrawableObject {
  speed = 0.15;         // 🏃 Horizontal movement speed
  otherDirection = false; // ↔️ True if facing left
  speedY = 0;           // 🪂 Vertical velocity (for jumping/falling)
  acceleration = 2.5;   // ⏬ Gravity acceleration factor
  energy = 100;         // ❤️ Health points
  lastHit = 0;          // ⏱️ Timestamp of last damage received

  /**
   * 🪂 Applies gravity to the object.
   * Continuously updates Y position and vertical speed to simulate gravity.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * ⬆️ Checks whether the object is above the ground.
   * Used to determine if gravity should continue to act.
   * @returns {boolean} True if object is in the air.
   */
  isAboveGround() {
    return this instanceof ThrowableObject ? true : this.y < 180;
  }

  /**
   * 💥 Detects collision with another movable object.
   * Uses bounding box intersection with a small padding margin.
   * @param {MovableObject} mo - The other object to test collision with.
   * @returns {boolean} True if the objects overlap.
   */
  // isColliding(mo) {
  //   if (!mo) return false;
  //   const p = 15; // hitbox padding
  //   return (
  //     this.x + this.width > mo.x - p &&
  //     this.x - p < mo.x + mo.width + p &&
  //     this.y + this.height > mo.y - p &&
  //     this.y - p < mo.y + mo.height + p
  //   );
  // }
  /** 🔒 Tight AABB collision – requires closer contact (inset shrinks boxes) */
// isCollidingTight(mo, inset = 10) {
//   if (!mo) return false;

//   const ax1 = this.x + inset;
//   const ay1 = this.y + inset;
//   const ax2 = this.x + this.width - inset;
//   const ay2 = this.y + this.height - inset;

//   const bx1 = mo.x + inset;
//   const by1 = mo.y + inset;
//   const bx2 = mo.x + mo.width - inset;
//   const by2 = mo.y + mo.height - inset;

//   return ax2 > bx1 && ax1 < bx2 && ay2 > by1 && ay1 < by2;
// }

  /** 💥 Standard-Kollision (mit leichtem Padding) */
  isColliding(mo, padding = 15) {
    if (!mo) return false;
    return (
      this.x + this.width > mo.x - padding &&
      this.x - padding      < mo.x + mo.width + padding &&
      this.y + this.height > mo.y - padding &&
      this.y - padding      < mo.y + mo.height + padding
    );
  }

  /** 🔒 Engere Kollision für Pickups */
  // isCollidingTight(mo, inset = 12) {
  //   if (!mo) return false;

  //   const ax1 = this.x + inset;
  //   const ay1 = this.y + inset;
  //   const ax2 = this.x + this.width - inset;
  //   const ay2 = this.y + this.height - inset;

  //   const bx1 = mo.x + inset;
  //   const by1 = mo.y + inset;
  //   const bx2 = mo.x + mo.width - inset;
  //   const by2 = mo.y + mo.height - inset;

  //   return ax2 > bx1 && ax1 < bx2 && ay2 > by1 && ay1 < by2;
  // }
  isCollidingTight(mo, inset = 12) {
  if (!mo) return false;

  // Spieler verkleinert
  const ax1 = this.x + inset;
  const ay1 = this.y + inset;
  const ax2 = this.x + this.width - inset;
  const ay2 = this.y + this.height - inset;

  // Coin / Item NICHT verkleinern!
  const bx1 = mo.x;
  const by1 = mo.y;
  const bx2 = mo.x + mo.width;
  const by2 = mo.y + mo.height;

  return ax2 > bx1 && ax1 < bx2 && ay2 > by1 && ay1 < by2;
}



  /**
   * ❤️ Applies damage to the object.
   * Reduces energy and records hit timestamp.
   */
  hit() {
    this.energy = Math.max(0, this.energy - 5);
    if (this.energy > 0) this.lastHit = new Date().getTime();
  }

  /**
   * 🤕 Checks whether the object was recently hit.
   * Used to trigger temporary invulnerability or hurt animations.
   * @returns {boolean} True if hit within the last second.
   */
  isHurt() {
    return (new Date().getTime() - this.lastHit) / 1000 < 1;
  }

  /**
   * ☠️ Checks if the object has no energy left.
   * @returns {boolean} True if energy is 0.
   */
  isDead() {
    return this.energy === 0;
  }

  /**
   * 🖼️ Plays a frame-based animation from an image array.
   * @param {string[]} images - Array of image paths to animate through.
   */
  playAnimation(images) {
    const i = this.currentImage % images.length;
    this.img = this.imageCache[images[i]];
    this.currentImage++;
  }

  /**
   * ➡️ Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * ⬅️ Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * 🦘 Makes the object jump by applying vertical velocity.
   */
  jump() {
    this.speedY = 30;
  }
}
