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
    this.statusBar = new StatusBarEnemy(this);
    this.animate();
  }

  hit() {
    if (this.isDead()) return;

    this.energy -= 100;
    this.energy = Math.max(this.energy, 0);
    this.statusBar.setPercentage(this.energy);

    if (this.isDead()) {
      this.die();
    }
  }

  // hit() {
  //   this.energy -= 100;
  //   this.energy = Math.max(this.energy, 0);
  //   this.statusBar.setPercentage(this.energy);
  // }

  die() {
    this.playAnimation(this.IMAGES_DEAD);
    clearInterval(this.chickenAnimationInterval);
    // optional: removeFromWorld(), explosion etc.
  }

  isDead() {
    return this.energy <= 0;
  }

  animate() {
    this.chickenAnimationInterval = setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
        clearInterval(this.chickenAnimationInterval);
      } else {
        this.playAnimation(this.IMAGES_RUNNING);
        this.moveLeft();
      }
    }, 200);
  }

  // animate() {
  //   setInterval(() => {
  //     this.moveLeft();
  //   }, 1000 / 60);

  //   setInterval(() => {
  //     this.playAnimation(this.IMAGES_RUNNING);
  //   }, 100);
  // }
  start() {
    this.moveInterval = setInterval(() => this.moveLeft(), 1000 / 60);
    this.animationInterval = setInterval(
      () => this.playAnimation(this.IMAGES_RUNNING),
      100
    );
  }

  stop() {
    clearInterval(this.moveInterval);
    clearInterval(this.animationInterval);
  }
}
