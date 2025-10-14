class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Creates an instance of the background object.
   * Loads the image from the specified path and sets the x and y coordinates.
   *
   * @param {string} imagePath - The path to the image file.
   * @param {number} x - The x-coordinate where the background object should be placed.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}

