class ChickenNormal extends MovableObject {
  IMAGES_RUNNING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  constructor() {
    super().loadImage(this.IMAGES_RUNNING[0]);
    this.loadImages(this.IMAGES_RUNNING);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 500 + Math.random() * 2000;
    this.y = 360; // etwas tiefer als small chickens
    this.width = 70;
    this.height = 70;
    this.speed = 0.2 + Math.random() * 0.4;
    this.energy = 100;
    this.dead = false;

    this.statusBar = new StatusBarEnemy(this);

    this.start(); // 👈 startet automatisch
  }

  hit() {
    if (this.dead) return; // 👈 wenn schon tot, nichts mehr machen
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
    this.dead = true; // 👈 Zustand merken
    this.loadImage(this.IMAGES_DEAD[0]); // nur das eine Bild
    this.speed = 0; // Bewegung stoppen
    this.stop(); // Animation stoppen

    // Gegner nach kurzer Zeit entfernen (z. B. 1 Sekunde)
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
