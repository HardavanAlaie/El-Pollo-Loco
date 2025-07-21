class CollectableBottle extends MovableObject {
  IMAGES = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
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
    }, 250);
  }

  generateRandomBottles(count, xMin, xMax, yMin, yMax) {
    let bottles = [];
    for (let i = 0; i < count; i++) {
      let x = Math.floor(Math.random() * (xMax - xMin) + xMin);
      let y = Math.floor(Math.random() * (yMax - yMin) + yMin);
      bottles.push(new CollectableBottle(x, y));
    }
    return bottles;
  }
}
