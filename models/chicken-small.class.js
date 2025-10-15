class ChickenSmall extends MovableObject {
  IMAGES_RUNNING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  /**
   * Constructs a new small chicken enemy instance.
   * Initializes position, size, speed, energy, and status bar.
   * Loads running and dead images, and starts the chicken's behavior.
   *
   * @constructor
   * @extends ParentClass
   */
  constructor() {
    super().loadImage(this.IMAGES_RUNNING[0]);
    this.loadImages(this.IMAGES_RUNNING);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 500 + Math.random() * 2000;
    this.y = 380;
    this.width = 50;
    this.height = 50;
    this.speed = 0.3 + Math.random() * 0.5;
    this.energy = 100;
    this.dead = false;
    this.statusBar = new StatusBarEnemy(this);
    this.start();
  }

  /**
   * Handles the chicken being hit by reducing its energy.
   * Updates the status bar and triggers death if energy reaches zero.
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
   * Handles the death of the chicken.
   * - Sets the chicken's state to dead.
   * - Loads the dead image.
   * - Stops the chicken's movement.
   * - Removes the chicken from the level's enemies list after a short delay.
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
   * 1. `moveInterval`: Moves the chicken to the left at 60 frames per second if it is not dead.
   * 2. `runInterval`: Plays the running animation every 100 milliseconds if the chicken is not dead.
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
   * This method should be called to halt all ongoing animations or behaviors related to movement.
   */
  stop() {
    clearInterval(this.moveInterval);
    clearInterval(this.runInterval);
  }
}
