// class StatusBarEnemy extends DrawableObject {
//   IMAGES = [
//     "img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
//     "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
//     "img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
//     "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
//     "img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
//     "img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
//   ];

//   constructor(enemy) {
//     super();
//     this.enemy = enemy;
//     this.width = 60;
//     this.height = 15;
//     this.loadImages(this.IMAGES);
//     this.setPercentage(enemy.energy);
//   }

//   setPercentage(percentage) {
//     this.percentage = percentage;
//     let index = 5;

//     if (percentage >= 100) index = 0;
//     else if (percentage >= 80) index = 1;
//     else if (percentage >= 60) index = 2;
//     else if (percentage >= 40) index = 3;
//     else if (percentage >= 20) index = 4;

//     this.img = this.imageCache[this.IMAGES[index]];
//   }

//   updatePosition() {
//     this.x = this.enemy.x;
//     this.y = this.enemy.y - 20;
//   }
// }

// class StatusBarEnemy extends DrawableObject {
//   IMAGES = [
//     "img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
//     "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
//     "img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
//     "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
//     "img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
//     "img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
//   ];

//   constructor(enemy) {
//     super();
//     this.enemy = enemy;
//     this.width = 60;
//     this.height = 15;
//     this.loadImages(this.IMAGES);
//     this.setPercentage(enemy.energy);
//   }

//   /** 🔋 Setzt Energielevel & wählt Bild aus */
//   setPercentage(percentage) {
//     this.percentage = percentage;
//     const thresholds = [100, 80, 60, 40, 20, 0];
//     const index = thresholds.findIndex((t) => percentage >= t);
//     this.img = this.imageCache[this.IMAGES[index === -1 ? 5 : index]];
//   }

//   /** 🎯 Position über dem Gegner aktualisieren */
//   updatePosition() {
//     if (!this.enemy) return;
//     this.x = this.enemy.x;
//     this.y = this.enemy.y - 20;
//   }
// }

// class StatusBarEnemy extends DrawableObject {
//   IMAGES = [
//     "img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
//     "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
//     "img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
//     "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
//     "img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
//     "img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
//   ];

//   constructor(enemy) {
//     super();
//     this.enemy = enemy;
//     this.width = 60;
//     this.height = 15;
//     this.loadImages(this.IMAGES);
//     this.setPercentage(enemy.energy);
//   }

//   /** 🔋 Energielevel setzen & passendes Bild wählen */
//   setPercentage(percentage) {
//     this.percentage = percentage;
//     const thresholds = [100, 80, 60, 40, 20, 0];
//     const index = thresholds.findIndex((t) => percentage >= t);
//     this.img = this.imageCache[this.IMAGES[index === -1 ? 5 : index]];
//   }

//   /** 🎯 Position über dem Gegner aktualisieren */
//   updatePosition() {
//     if (!this.enemy) return;
//     this.x = this.enemy.x + (this.enemy.width / 2 - this.width / 2);
//     this.y = this.enemy.y - 20;
//   }

//   /** 🧱 Balken zeichnen (automatisch über Gegner) */
//   draw(ctx) {
//     this.updatePosition();
//     super.draw(ctx);
//   }
// }

class StatusBarEnemy extends DrawableObject {
  IMAGES_BLUE = [
    "img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
  ];

  IMAGES_RED = [
    "img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
  ];

  constructor(enemy) {
    super();
    this.enemy = enemy;
    this.width = 60;
    this.height = 15;

    // 🔥 Wenn Gegner ein Boss ist → rote Leiste
    const isBoss =
      enemy instanceof EndbossLevel1 || enemy instanceof EndbossLevel2;
    this.IMAGES = isBoss ? this.IMAGES_RED : this.IMAGES_BLUE;

    this.loadImages(this.IMAGES);
    this.setPercentage(enemy.energy);
  }

  /** 🔋 Energielevel setzen & passendes Bild wählen */
  setPercentage(percentage) {
    this.percentage = percentage;
    const thresholds = [100, 80, 60, 40, 20, 0];
    const index = thresholds.findIndex((t) => percentage >= t);
    this.img = this.imageCache[this.IMAGES[index === -1 ? 5 : index]];
  }

  /** 🎯 Position über Gegner aktualisieren */
  updatePosition() {
    if (!this.enemy) return;
    this.x = this.enemy.x + (this.enemy.width / 2 - this.width / 2);
    this.y = this.enemy.y - 20;
  }

  /** 🧱 Balken automatisch über Gegner zeichnen */
  draw(ctx) {
    this.updatePosition();
    super.draw(ctx);
  }
}
