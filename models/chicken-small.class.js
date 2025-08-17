// class ChickenSmall extends MovableObject {
//   IMAGES_RUNNING = [
//     "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
//     "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
//     "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
//   ];

//   IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

//   constructor() {
//     super().loadImage(this.IMAGES_RUNNING[0]);
//     this.loadImages(this.IMAGES_RUNNING);
//     this.loadImages(this.IMAGES_DEAD);

//     this.x = 500 + Math.random() * 2000;
//     this.y = 380;
//     this.width = 50;
//     this.height = 50;
//     this.speed = 0.3 + Math.random() * 0.5;
//     this.energy = 100;
//     this.dead = false;

//     this.statusBar = new StatusBarEnemy(this);
//   }

//   hit() {
//     this.energy -= 100;
//     this.energy = Math.max(this.energy, 0);
//     this.statusBar.setPercentage(this.energy);
//   }

//   isDead() {
//     return this.energy <= 0;
//   }

//   animate() {
//     setInterval(() => {
//       this.moveLeft();
//     }, 1000 / 60);

//     setInterval(() => {
//       this.playAnimation(this.IMAGES_RUNNING);
//     }, 100);
//   }

//   start() {
//     if (!this.chickenAnimationInterval) {
//       this.animate();
//     }
//   }

//   stop() {
//     clearInterval(this.chickenAnimationInterval);
//   }
// }

//--------------------------------------------------------------------------


// class ChickenSmall extends MovableObject {
//   IMAGES_RUNNING = [
//     "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
//     "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
//     "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
//   ];

//   IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

//   constructor(world) {
//     super().loadImage(this.IMAGES_RUNNING[0]);
//     this.loadImages(this.IMAGES_RUNNING);
//     this.loadImages(this.IMAGES_DEAD);

//     this.x = 500 + Math.random() * 2000;
//     this.y = 380;
//     this.width = 50;
//     this.height = 50;
//     this.speed = 0.3 + Math.random() * 0.5;
//     this.energy = 100;
//     this.dead = false;

//     this.world = world; // Store the world reference
//     this.statusBar = new StatusBarEnemy(this);
//   }

//   hit() {
//     if (this.dead) return; // schon tot → nichts mehr machen
//     this.energy = 0;
//     this.statusBar.setPercentage(this.energy);
//     this.die();
//   }

//   // die() {
//   //   this.dead = true;

//   //   // Animation stoppen
//   //   clearInterval(this.moveInterval);
//   //   clearInterval(this.animationInterval);

//   //   // Nur das eine Dead-Bild anzeigen
//   //   this.loadImage(this.IMAGES_DEAD[0]);

//   //   // Optional: Gegner bleibt kurz liegen, danach entfernen
//   //   setTimeout(() => {
//   //     const i = this.world?.level?.enemies.indexOf(this);
//   //     if (i >= 0) this.world.level.enemies.splice(i, 1);
//   //   }, 1000);
//   // }
//   die() {
//   this.dead = true;

//   // Animation & Bewegung stoppen
//   clearInterval(this.moveInterval);
//   clearInterval(this.animationInterval);

//   // Dead-Bild laden
//   this.loadImage(this.IMAGES_DEAD[0]);

//   // Chicken bleibt 1.5 Sek sichtbar, dann entfernen
//   setTimeout(() => {
//     const i = this.world?.level?.enemies.indexOf(this);
//     if (i >= 0) this.world.level.enemies.splice(i, 1);
//   }, 1500);
// }


//   isDead() {
//     return this.dead;
//   }

//   animate() {
//     this.moveInterval = setInterval(() => {
//       if (!this.dead) this.moveLeft();
//     }, 1000 / 60);

//     this.animationInterval = setInterval(() => {
//       if (!this.dead) this.playAnimation(this.IMAGES_RUNNING);
//     }, 100);
//   }

//   start() {
//     if (!this.moveInterval && !this.animationInterval) {
//       this.animate();
//     }
//   }

//   stop() {
//     clearInterval(this.moveInterval);
//     clearInterval(this.animationInterval);
//   }
// }

//---------------------------------------------------------------------------

class ChickenSmall extends MovableObject {
  IMAGES_RUNNING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  constructor(world) {
    super().loadImage(this.IMAGES_RUNNING[0]);
    this.loadImages(this.IMAGES_RUNNING);
    this.loadImages(this.IMAGES_DEAD);

    this.world = world; // 👈 Referenz auf die Welt
    this.x = 500 + Math.random() * 2000;
    this.y = 380;
    this.width = 50;
    this.height = 50;
    this.speed = 0.3 + Math.random() * 0.5;
    this.energy = 100;
    this.dead = false;

    this.statusBar = new StatusBarEnemy(this);
    this.animate();
  }

  hit() {
    this.energy -= 100;
    this.energy = Math.max(this.energy, 0);
    this.statusBar.setPercentage(this.energy);
  }

  isDead() {
    return this.energy <= 0;
  }

  die() {
    this.dead = true;
    this.loadImage(this.IMAGES_DEAD[0]); // 👈 nur ein Bild anzeigen

    // ❌ Bewegung stoppen
    this.speed = 0;

    // ❌ Entfernen nach 1 Sekunde
    setTimeout(() => {
      const i = this.world.level.enemies.indexOf(this);
      if (i >= 0) {
        this.world.level.enemies.splice(i, 1);
      }
    }, 1000);
  }

  animate() {
    this.moveInterval = setInterval(() => {
      if (!this.dead) {
        this.moveLeft();
      }
    }, 1000 / 60);

    this.runInterval = setInterval(() => {
      if (!this.dead) {
        this.playAnimation(this.IMAGES_RUNNING);
      }
    }, 100);
  }
}

