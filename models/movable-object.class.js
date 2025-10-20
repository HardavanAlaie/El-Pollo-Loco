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
  isColliding(mo) {
    if (!mo) return false;
    const p = 15; // hitbox padding
    return (
      this.x + this.width > mo.x - p &&
      this.x - p < mo.x + mo.width + p &&
      this.y + this.height > mo.y - p &&
      this.y - p < mo.y + mo.height + p
    );
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
