class CollectableBottle extends MovableObject {
  /**
   * Array of image paths representing the different states of the salsa bottle collectable.
   * @type {string[]}
   */
  IMAGES = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Creates an instance of the collectable bottle at the specified coordinates.
   * Loads the initial image and all images for the bottle, sets its position and size,
   * and starts the animation.
   *
   * @param {number} x - The x-coordinate of the bottle.
   * @param {number} y - The y-coordinate of the bottle.
   */
  constructor(x, y) {
    super().loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 60;
    this.animate();
  }

  /**
   * Starts an animation loop that cycles through the object's images.
   * Calls the playAnimation method every 250 milliseconds using the IMAGES array.
   * Intended to animate the collectable bottle sprite.
   */
  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES);
    }, 250);
  }
}
