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

    // 🐔 Position & Attribute
    this.x = 500 + Math.random() * 2000;
    this.y = 360;
    this.width = 70;
    this.height = 70;
    this.speed = 0.2 + Math.random() * 0.4;
    this.energy = 100;
    this.dead = false;

    // 🧠 Statusleiste
    this.statusBar = new StatusBarEnemy(this);
    this.start();
  }

  /** 🩸 Wird getroffen */
  hit() {
    if (this.dead) return;
    this.energy = Math.max(this.energy - 100, 0);
    this.statusBar.setPercentage(this.energy);
    if (this.isDead()) this.die();
  }

  /** 💀 Prüfen ob tot */
  isDead() {
    return this.energy <= 0;
  }

  /** ☠️ Sterbe-Animation */
  die() {
    this.dead = true;
    this.loadImage(this.IMAGES_DEAD[0]);
    this.speed = 0;
    this.stop();
    // Entfernen nach 1s
    setTimeout(() => {
      const index = world?.level?.enemies?.indexOf(this);
      if (index >= 0) world.level.enemies.splice(index, 1);
    }, 1000);
  }

  /** 🏃 Lauf-Animation starten */
  animate() {
    this.moveInterval = setInterval(() => {
      if (!this.dead) this.moveLeft();
    }, 1000 / 60);

    this.runInterval = setInterval(() => {
      if (!this.dead) this.playAnimation(this.IMAGES_RUNNING);
    }, 100);
  }

  /** ▶️ Startet das Huhn (wird nur 1x initialisiert) */
  start() {
    if (!this.chickenAnimationInterval) this.animate();
  }

  /** ⏹️ Stoppt Bewegung & Animation */
  stop() {
    clearInterval(this.moveInterval);
    clearInterval(this.runInterval);
  }
}
