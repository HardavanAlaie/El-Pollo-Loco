/*
class Chicken extends MovableObject {
  height = 80;
  y = 350;
  
//   IMAGES_RUNNING = Array.from(
//     { length: 6 },
//     (_, i) => `img/spider/walk${i + 1}.png`
//   );
  IMAGES_RUNNING = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
  ];
  currentImage = 0;
  constructor() {
    super().loadImage(this.IMAGES_RUNNING[0]);
    this.loadImages(this.IMAGES_RUNNING);

    this.x = 200 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.5;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    setInterval(() => {
      this.playAnimation(this.IMAGES_RUNNING);
    }, 100);
  }
}
*/

// class Chicken extends MovableObject {
//   constructor() {
//     super().loadImage('img/3_enemies_chicken/chicken_normal/1.png');
//     this.x = 400 + Math.random() * 500;
//     this.y = 355;
//     this.width = 50;
//     this.height = 60;
//     this.energy = 100;

//     this.statusBar = new StatusBarEnemy(this); // 👈 StatusBar mit sich selbst verknüpfen
//   }

//   hit() {
//     this.energy -= 20;
//     if (this.energy < 0) this.energy = 0;
//     this.statusBar.setPercentage(this.energy);
//   }

//   isDead() {
//     return this.energy <= 0;
//   }
// }


class Chicken extends MovableObject {

    IMAGES_RUNNING = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
  ];
  constructor() {
    super().loadImage(this.IMAGES_RUNNING[0]);
    this.loadImages(this.IMAGES_RUNNING);
    this.x = 500 + Math.random() * 1500;
    this.y = 355;
    this.width = 60;
    this.height = 60;
    this.speed = 0.3 + Math.random() * 0.5;
    this.energy = 100;
    this.statusBar = new StatusBarEnemy(this);
    this.animate();
  }

  hit() {
    this.energy -= 20;
    this.energy = Math.max(this.energy, 0);
    this.statusBar.setPercentage(this.energy);
  }

  isDead() {
    return this.energy <= 0;
  }

    animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    setInterval(() => {
      this.playAnimation(this.IMAGES_RUNNING);
    }, 100);
  }
}
