class StatusBarEnemy extends DrawableObject {
  IMAGES = [
    "img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
  ];

  constructor(enemy) {
    super();
    this.enemy = enemy;
    this.width = 60;
    this.height = 15;
    this.loadImages(this.IMAGES);
    this.setPercentage(enemy.energy);
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let index = 5;

    if (percentage >= 100) index = 0;
    else if (percentage >= 80) index = 1;
    else if (percentage >= 60) index = 2;
    else if (percentage >= 40) index = 3;
    else if (percentage >= 20) index = 4;

    this.img = this.imageCache[this.IMAGES[index]];
  }

  updatePosition() {
    this.x = this.enemy.x;
    this.y = this.enemy.y - 20; 
  }
}
