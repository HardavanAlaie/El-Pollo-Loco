class BackgroundObject extends MovableObject {
  //y = 0;
  width = 720;
  height = 400;

  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;

    //this.x = 10 + Math.random() * 500;
  }
}
