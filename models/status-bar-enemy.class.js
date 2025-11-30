/**
 * Class: StatusBarEnemy
 * Displays a health bar above each enemy or boss.
 * The bar color changes depending on whether the target is a normal enemy (blue)
 * or a boss enemy (red/orange).
 */
class StatusBarEnemy extends DrawableObject {
  /** Blue health bar images for normal enemies */
  IMAGES_BLUE = [
    "img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
  ];

  /** Red/orange health bar images for boss enemies */
  IMAGES_RED = [
    "img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
  ];

  /**
   * Creates an enemy health bar positioned above the enemy.
   * @param {MovableObject} enemy - The enemy this health bar belongs to.
   */
  constructor(enemy) {
    super();
    this.enemy = enemy;
    this.width = 60;
    this.height = 15;
    const isBoss = enemy instanceof EndbossLevel1;
    this.IMAGES = isBoss ? this.IMAGES_RED : this.IMAGES_BLUE;
    this.loadImages(this.IMAGES);
    this.setPercentage(enemy.energy);
  }

  /**
   * Updates the displayed image based on the current energy percentage.
   * @param {number} percentage - The current enemy energy (0–100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const thresholds = [100, 80, 60, 40, 20, 0];
    const index = thresholds.findIndex((t) => percentage >= t);
    this.img = this.imageCache[this.IMAGES[index === -1 ? 5 : index]];
  }

  /**
   * Updates the position so that the bar stays centered above the enemy.
   */
  updatePosition() {
    if (!this.enemy) return;
    this.x = this.enemy.x + (this.enemy.width / 2 - this.width / 2);
    this.y = this.enemy.y - 20;
  }

  /**
   * Automatically updates and draws the bar each frame.
   * @param {CanvasRenderingContext2D} ctx - The drawing context of the canvas.
   */
  draw(ctx) {
    this.updatePosition();
    super.draw(ctx);
  }
}
