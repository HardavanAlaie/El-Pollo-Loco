/**
 * Class: StatusBarCoin
 * Displays the coin collection progress in the user interface.
 * Extends the base StatusBar class and updates according to collected coins.
 */
class StatusBarCoin extends StatusBar {
  /**
   * Image paths representing different fill levels of the coin bar.
   */
  IMAGES = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];

  availableCoins = 0; 

  /**
   * Initializes the coin status bar by loading all level images.
   * Positions the bar in the upper-left corner of the screen.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.percentage = 0;
    this.img = this.imageCache[this.IMAGES[0]];
    this.setPercentage(0);
    this.x = 40;     
    this.y = 30;     
    this.width = 120;
    this.height = 40;
  }

  /**
   * Updates the bar based on how many coins are collected.
   * Each coin increases the bar by 20%, up to 100%.
   */
  update() {
    const percentage = Math.min(this.availableCoins * 20, 100);
    this.setPercentage(percentage);
  }
}
