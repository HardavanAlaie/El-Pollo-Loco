class Cloud extends MovableObject {
  y = 50;
  width = 500;
  height = 250;

  /**
   * Array of image paths representing cloud layer graphics.
   * @type {string[]}
   */
  IMAGES = [
    "img/5_background/layers/4_clouds/1.png",
    "img/5_background/layers/4_clouds/2.png",
  ];

  /**
   * Creates an instance of the Cloud class.
   * Initializes the cloud with a random horizontal position and starts its animation.
   * Loads the initial image for the cloud.
   */
  constructor() {
    super().loadImage(this.IMAGES[0]);

    this.x = Math.random() * 500;
    this.animate();
  }

  /**
   * Starts the animation for the cloud object by continuously moving it to the left.
   * Decreases the `x` position by 0.15 units approximately every 1/60th of a second.
   * Intended to create a smooth horizontal movement effect.
   */
  animate() {
    setInterval(() => {
      this.x -= 0.15;
    }, 1000 / 60);
  }
}
