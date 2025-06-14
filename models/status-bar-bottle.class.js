// class StatusBarBottle extends DrawableObject {
//   availableBottles = 0;
//   bottleCounter = 0;

//   IMAGES = [
//     'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
//     'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
//     'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
//     'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
//     'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
//     'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png',
//   ];

//   constructor() {
//     super().loadImage(this.IMAGES[0]);
//     this.x = 250;
//     this.y = 0;
//     this.width = 200;
//     this.height = 60;
//   }
// }

// ---------- chatGPT ----------
// class StatusBarBottle extends DrawableObject {
//   availableBottles = 3;

//   IMAGES = [
//     'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
//     'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
//     'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
//     'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
//     'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
//     'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png',
//   ];

//   constructor() {
//     super().loadImage(this.IMAGES[0]);
//     this.x = 250;
//     this.y = 0;
//     this.width = 200;
//     this.height = 60;
//   }

//   update() {
//     const percentage = this.availableBottles * 20;
//     const index = Math.min(Math.floor(percentage / 20), 5);
//     this.setImage(this.IMAGES[index]);
//   }

//   setImage(path) {
//     this.img = new Image();
//     this.img.src = path;
//   }
// }
// ---------- chatGPT ----------

// class StatusBarBottle extends DrawableObject {
//   IMAGES = [
//     'img/7_statusbars/1_statusbar/3_statusbar_bottle/0.png',
//     'img/7_statusbars/1_statusbar/3_statusbar_bottle/20.png',
//     'img/7_statusbars/1_statusbar/3_statusbar_bottle/40.png',
//     'img/7_statusbars/1_statusbar/3_statusbar_bottle/60.png',
//     'img/7_statusbars/1_statusbar/3_statusbar_bottle/80.png',
//     'img/7_statusbars/1_statusbar/3_statusbar_bottle/100.png'
//   ];

//   availableBottles = 0;

//   constructor() {
//     super();
//     this.loadImages(this.IMAGES);
//     this.x = 40;
//     this.y = 60;
//     this.width = 200;
//     this.height = 60;
//     this.setPercentage(0);
//   }

//   setPercentage(percent) {
//     this.availableBottles = percent;
//     let index = Math.floor((percent / 5)); // max 5 Flaschen
//     if (index > 5) index = 5;
//     this.img = this.imageCache[this.IMAGES[index]];
//   }

//   update() {
//     this.setPercentage(this.availableBottles);
//   }
// }


class StatusBarBottle extends StatusBar {
  IMAGES = [
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
  ];

  availableBottles = 0;

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(0);
    this.x = 240;
    this.y = 0;
    this.width = 200;
    this.height = 60;
  }

  update() {
    let percentage = Math.min(this.availableBottles * 20, 100);
    this.setPercentage(percentage);
  }
}
