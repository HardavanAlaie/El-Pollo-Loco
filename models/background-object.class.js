class BackgroundObject extends MovableObject {
  //y = 0;
  width = 720;
  height = 480;

  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;

    //this.x = 10 + Math.random() * 500;
  }
}

class BackgroundObject extends DrawableObject {
  constructor(imagePath, x, parallaxFactor = 1.0) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = 0;
    this.width = 720;
    this.height = 480;
    this.parallaxFactor = parallaxFactor; // 👈 wichtig für Bewegung
  }

  draw(ctx, camera_x) {
    ctx.drawImage(
      this.img,
      this.x - camera_x * this.parallaxFactor, // 👈 parallax effect
      this.y,
      this.width,
      this.height
    );
  }
}

