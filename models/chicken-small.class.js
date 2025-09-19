class ChickenSmall extends MovableObject {
  IMAGES_RUNNING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

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

  hit() {
    if (this.dead) return;
    this.energy -= 100;
    this.energy = Math.max(this.energy, 0);
    this.statusBar.setPercentage(this.energy);

    if (this.isDead()) {
      this.die();
    }
  }

  isDead() {
    return this.energy <= 0;
  }

  die() {
    this.dead = true;
    this.loadImage(this.IMAGES_DEAD[0]);
    this.speed = 0;
    this.stop();

    setTimeout(() => {
      const i = world.level.enemies.indexOf(this);
      if (i >= 0) {
        world.level.enemies.splice(i, 1);
      }
    }, 1000);
  }

  animate() {
    this.moveInterval = setInterval(() => {
      if (!this.dead) this.moveLeft();
    }, 1000 / 60);

    this.runInterval = setInterval(() => {
      if (!this.dead) this.playAnimation(this.IMAGES_RUNNING);
    }, 100);
  }

  start() {
    if (!this.chickenAnimationInterval) {
      this.animate();
    }
  }

  stop() {
    clearInterval(this.moveInterval);
    clearInterval(this.runInterval);
  }
}
