class CollectableCoin extends MovableObject {
  IMAGES = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  /**
   * Creates an instance of the collectable coin at the specified coordinates.
   * Loads the initial image and all animation frames, sets position and size, and starts animation.
   *
   * @param {number} x - The x-coordinate of the coin.
   * @param {number} y - The y-coordinate of the coin.
   */
  constructor(x, y) {
    super().loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.x = x;
    this.y = y;
    this.width = 45;
    this.height = 45;
    this.animate();
  }

  /**
   * Starts an animation loop that cycles through the coin's images.
   * Calls `playAnimation` with the `IMAGES` array every 200 milliseconds.
   * Intended to animate the collectable coin sprite.
   */
  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES);
    }, 200);
  }
}
