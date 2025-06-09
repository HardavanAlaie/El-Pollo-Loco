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
class StatusBarBottle extends DrawableObject {
  availableBottles = 3;

  IMAGES = [
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png',
  ];

  constructor() {
    super().loadImage(this.IMAGES[0]);
    this.x = 250;
    this.y = 0;
    this.width = 200;
    this.height = 60;
  }

  update() {
    const percentage = this.availableBottles * 20;
    const index = Math.min(Math.floor(percentage / 20), 5);
    this.setImage(this.IMAGES[index]);
  }

  setImage(path) {
    this.img = new Image();
    this.img.src = path;
  }
}
// ---------- chatGPT ----------
