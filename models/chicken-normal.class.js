class ChickenNormal extends MovableObject {
  IMAGES_RUNNING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  /**
   * Creates an instance of the ChickenNormal class.
   * Initializes the chicken's images, position, size, speed, energy, and status bar.
   * 
   * @constructor
   * @extends ParentClass
   * @property {number} x - The x-coordinate of the chicken's position, randomized between 500 and 2500.
   * @property {number} y - The y-coordinate of the chicken's position (default: 360).
   * @property {number} width - The width of the chicken (default: 70).
   * @property {number} height - The height of the chicken (default: 70).
   * @property {number} speed - The movement speed of the chicken, randomized between 0.2 and 0.6.
   * @property {number} energy - The energy level of the chicken (default: 100).
   * @property {boolean} dead - Indicates if the chicken is dead (default: false).
   * @property {StatusBarEnemy} statusBar - The status bar associated with the chicken.
   */
  constructor() {
    super().loadImage(this.IMAGES_RUNNING[0]);
    this.loadImages(this.IMAGES_RUNNING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 500 + Math.random() * 2000;
    this.y = 360;
    this.width = 70;
    this.height = 70;
    this.speed = 0.2 + Math.random() * 0.4;
    this.energy = 100;
    this.dead = false;
    this.statusBar = new StatusBarEnemy(this);
    this.start();
  }

  /**
   * Handles the chicken being hit by reducing its energy.
   * Updates the status bar to reflect the new energy level.
   * If the chicken's energy reaches zero, triggers the death sequence.
   * Does nothing if the chicken is already dead.
   */
  hit() {
    if (this.dead) return;
    this.energy = Math.max(this.energy - 100, 0);
    this.statusBar.setPercentage(this.energy);
    if (this.isDead()) this.die();
  }

  /**
   * Determines whether the chicken is dead based on its energy level.
   * @returns {boolean} Returns true if the chicken's energy is less than or equal to 0, indicating it is dead; otherwise, false.
   */
  isDead() {
    return this.energy <= 0;
  }

  /**
   * Handles the death of the chicken enemy.
   * - Sets the dead state to true.
   * - Loads the dead image.
   * - Stops the chicken's movement.
   * - Removes the chicken from the world's enemy list after 1 second.
   */
  die() {
    this.dead = true;
    this.loadImage(this.IMAGES_DEAD[0]);
    this.speed = 0;
    this.stop();
    setTimeout(() => {
      const index = world?.level?.enemies?.indexOf(this);
      if (index >= 0) world.level.enemies.splice(index, 1);
    }, 1000);
  }

  /**
   * Starts the animation for the chicken character.
   * 
   * This method sets up two intervals:
   * 1. `moveInterval`: Moves the chicken to the left at 60 frames per second, unless it is dead.
   * 2. `runInterval`: Plays the running animation every 100 milliseconds, unless the chicken is dead.
   *
   * @returns {void}
   */
  animate() {
    this.moveInterval = setInterval(() => {
      if (!this.dead) this.moveLeft();
    }, 1000 / 60);
    this.runInterval = setInterval(() => {
      if (!this.dead) this.playAnimation(this.IMAGES_RUNNING);
    }, 100);
  }

  /**
   * Starts the chicken animation if it is not already running.
   * Checks if the animation interval is not set, and if so, initiates the animation.
   */
  start() {
    if (!this.chickenAnimationInterval) this.animate();
  }

  /**
   * Stops the chicken's movement and running actions by clearing their respective intervals.
   * This method should be called to halt any ongoing animations or behaviors associated with the chicken.
   */
  stop() {
    clearInterval(this.moveInterval);
    clearInterval(this.runInterval);
  }
}
