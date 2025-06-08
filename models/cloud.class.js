class Cloud extends MovableObject {
  y = 100;
  width = 600;
  height = 500;

  constructor() {
    super().loadImage("img/bg/bg2/myst.png");

    this.x = 10 + Math.random() * 500;
    this.animate();
  }

  animate() {
    this.moveLeft();
  }
}
