class CollectableCoin extends MovableObject {
  IMAGES = [
    "img/8_coin/coin_1.png", 
    "img/8_coin/coin_2.png"
  ];

  constructor(x, y) {
    super().loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 60;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES);
    }, 200);
  }
}
