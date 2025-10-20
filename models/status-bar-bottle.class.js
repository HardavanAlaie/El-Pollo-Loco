/**
 * 🍾 Class: StatusBarBottle
 * Displays the bottle collection progress in the UI.
 * Extends the base StatusBar class and updates based on collected bottles.
 */
class StatusBarBottle extends StatusBar {
  /**
   * 🖼️ Bottle status bar image paths for different fill levels.
   */
  IMAGES = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
  ];

  availableBottles = 0; // 🧴 Current number of bottles collected

  /**
   * Initializes the bottle status bar and loads all bar images.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(0);
    this.x = 40;     // Position X on screen
    this.y = 60;     // Position Y on screen
    this.width = 120;
    this.height = 40;
  }

  /**
   * 🔄 Updates the bar based on the number of collected bottles.
   * Each bottle increases the bar by 20%, up to a maximum of 100%.
   */
  update() {
    let percentage = Math.min(this.availableBottles * 20, 100);
    this.setPercentage(percentage);
  }
}
