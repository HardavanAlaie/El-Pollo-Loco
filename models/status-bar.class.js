/**
 * ❤️ Class: StatusBar
 * Base class for displaying health or resource bars in the game.
 * Can be extended by other classes like `StatusBarBottle`, `StatusBarCoin`, or `StatusBarEnemy`.
 */
class StatusBar extends DrawableObject {
  /** 🖼️ Image paths for different health levels (0–100%) */
  IMAGES = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  ];

  percentage = 100; // 💯 Current health percentage

  /**
   * Initializes the status bar with default position and image set.
   * The default position is top-left of the screen.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 40;     // Horizontal position
    this.y = 0;      // Vertical position
    this.width = 120;
    this.height = 40;
    this.setPercentage(100);
  }

  /**
   * 🧮 Updates the current bar image according to the given percentage.
   * @param {number} percentage - The health or resource value (0–100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * 🔢 Determines which image index corresponds to the current percentage.
   * @returns {number} The index of the correct image in `IMAGES`.
   */
  resolveImageIndex() {
    if (this.percentage === 100) return 5;
    else if (this.percentage > 80) return 4;
    else if (this.percentage > 60) return 3;
    else if (this.percentage > 40) return 2;
    else if (this.percentage > 20) return 1;
    else return 0;
  }
}
