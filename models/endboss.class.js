class Endboss extends MovableObject {
  y = 185;
  width = 250;
  height = 250;

  //IMAGES_ATTACK = Array.from({ length: 5 }, (_, i) => `img/endboss2/Attack${i + 1}.png`);
  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);

    this.x = 900;
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
      this.playAnimation(this.IMAGES_ALERT);
    }, 200);
  }
}
