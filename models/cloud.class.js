class Cloud extends MovableObject {
  y = 50;
  width = 500;
  height = 250;

  IMAGES = [
    'img/5_background/layers/4_clouds/1.png',
    'img/5_background/layers/4_clouds/2.png',
  ]

  constructor() {
    super().loadImage(this.IMAGES[0]);

    this.x = Math.random() * 500;
    this.animate();
  }

  animate() {
    //this.moveLeft();
    setInterval(() => {
      this.x -= 0.15;
    }, 1000 / 60);
  }
}
