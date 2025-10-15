class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;

  /**
   * Loads an image from the specified path and assigns it to the `img` property.
   * @param {string} path - The source path of the image to load.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    if (!this.img) return;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    const highlightClasses = [
      Character,
      ChickenSmall,
      ChickenNormal,
      EndbossLevel1,
    ];

    if (highlightClasses.some((cls) => this instanceof cls)) {
      ctx.beginPath();
      ctx.lineWidth = 2;
    }
  }

  loadImages(arr) {
    arr.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
