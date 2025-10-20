/**
 * 🧴 Class: ThrowableObject
 * Represents a throwable salsa bottle that rotates in the air and breaks upon impact.
 * Extends `MovableObject` to inherit movement, gravity, and collision behavior.
 */
class ThrowableObject extends MovableObject {
  /** 🔁 Rotation animation frames for the flying bottle */
  IMAGES_ROTATE = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /** 💥 Splash animation frames for the bottle breaking */
  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Initializes a throwable bottle with position, direction, and animation setup.
   * @param {number} x - Initial horizontal position.
   * @param {number} y - Initial vertical position.
   * @param {boolean} [directionLeft=false] - True if thrown to the left.
   */
  constructor(x, y, directionLeft = false) {
    super().loadImage(this.IMAGES_ROTATE[0]);
    this.loadImages(this.IMAGES_ROTATE);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 60;
    this.directionLeft = directionLeft;
    this.throw();
    this.animate();
  }

  /**
   * 🚀 Starts the throwing movement with gravity and horizontal velocity.
   * The bottle flies in the direction the character is facing.
   */
  throw() {
    this.speedY = 30;
    this.applyGravity();

    this.throwInterval = setInterval(() => {
      if (!this.isBroken) {
        this.x += this.directionLeft ? -10 : 10;
      }
    }, 25);
  }

  /**
   * 🔄 Plays the rotation animation while the bottle is in flight.
   */
  animate() {
    this.animationInterval = setInterval(() => {
      if (!this.isBroken) this.playAnimation(this.IMAGES_ROTATE);
    }, 100);
  }

  /**
   * 💥 Triggers the breaking sequence of the bottle (splash animation).
   * Stops movement and marks the object for removal after a short delay.
   */
  break() {
    this.isBroken = true;
    this.speedY = 0;
    clearInterval(this.throwInterval);
    this.loadImages(this.IMAGES_SPLASH);
    this.playAnimation(this.IMAGES_SPLASH);

    setTimeout(() => (this.markedForRemoval = true), 400);
  }

  /**
   * 🗑️ Removes the bottle from the world and stops animations.
   */
  remove() {
    const index = this.world?.throwableObjects.indexOf(this);
    if (index >= 0) this.world.throwableObjects.splice(index, 1);
    clearInterval(this.animationInterval);
  }

  /**
   * ❌ Determines whether the bottle should be removed from the game.
   * @returns {boolean} True if the bottle is below the screen or already broken.
   */
  isDead() {
    return this.y > 480 || this.markedForRemoval;
  }
}
