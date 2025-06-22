class ChickenSmall extends MovableObject {
  IMAGES_RUNNING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];
  constructor() {
    super().loadImage(this.IMAGES_RUNNING[0]);
    this.loadImages(this.IMAGES_RUNNING);
    this.x = 500 + Math.random() * 1500;
    this.y = 380;
    this.width = 50;
    this.height = 50;
    this.speed = 0.3 + Math.random() * 0.5;
    this.energy = 100;
    this.statusBar = new StatusBarEnemy(this);
    this.animate();
  }

  hit() {
    this.energy -= 20;
    this.energy = Math.max(this.energy, 0);
    this.statusBar.setPercentage(this.energy);
  }

  isDead() {
    return this.energy <= 0;
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    setInterval(() => {
      this.playAnimation(this.IMAGES_RUNNING);
    }, 100);
  }
}
