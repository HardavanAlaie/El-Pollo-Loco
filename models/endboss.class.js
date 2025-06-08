class Endboss extends MovableObject {
  y = 185;
  width = 300;
  height = 300;

  //IMAGES_ATTACK = Array.from({ length: 5 }, (_, i) => `img/endboss2/Attack${i + 1}.png`);
  IMAGES_RUNNING = [
    'img/4_enemie_boss_chicken/1_walk/G1.png'
  ];

  constructor() {
    super().loadImage(this.IMAGES_ATTACK[0]);
    this.loadImages(this.IMAGES_ATTACK);

    this.x = 900;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_ATTACK);
    }, 200);
  }
}
