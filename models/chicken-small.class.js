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
//     this.statusBar = new StatusBarEnemy(this);
//     this.animate();
//   }

//   // hit() {
//   //   if (this.isDead()) return;

//   //   this.energy -= 100;
//   //   this.energy = Math.max(this.energy, 0);
//   //   this.statusBar.setPercentage(this.energy);

//   //   if (this.isDead()) {
//   //     this.die();
//   //   }
//   // }
//   hit() {
//   if (this.dead) return; // schon tot → ignorieren
//   this.energy -= 100;
//   this.statusBar.setPercentage(this.energy);
//   if (this.isDead()) {
//     this.die();
//   }
// }


//   // hit() {
//   //   this.energy -= 100;
//   //   this.energy = Math.max(this.energy, 0);
//   //   this.statusBar.setPercentage(this.energy);
//   // }

//   // die() {
//   //   this.playAnimation(this.IMAGES_DEAD);
//   //   clearInterval(this.chickenAnimationInterval);
//   //   // optional: removeFromWorld(), explosion etc.
//   // }

//   // isDead() {
//   //   return this.energy <= 0;
//   // }

//   // animate() {
//   //   this.chickenAnimationInterval = setInterval(() => {
//   //     if (this.isDead()) {
//   //       this.playAnimation(this.IMAGES_DEAD);
//   //       clearInterval(this.chickenAnimationInterval);
//   //     } else {
//   //       this.playAnimation(this.IMAGES_RUNNING);
//   //       this.moveLeft();
//   //     }
//   //   }, 200);
//   // }
//   die() {
//   this.loadImage(this.IMAGES_DEAD[0]); // einmalig auf Dead-Bild setzen
//   this.dead = true; // Zustand merken
//   // Optional: Gegner nach kurzer Zeit entfernen
//   setTimeout(() => {
//     this.removeFromWorld?.();
//   }, 500);
// }

// animate() {
//   this.chickenAnimationInterval = setInterval(() => {
//     if (!this.dead) {
//       this.playAnimation(this.IMAGES_RUNNING);
//       this.moveLeft();
//     }
//   }, 200);
// }


//   // animate() {
//   //   setInterval(() => {
//   //     this.moveLeft();
//   //   }, 1000 / 60);

//   //   setInterval(() => {
//   //     this.playAnimation(this.IMAGES_RUNNING);
//   //   }, 100);
//   // }
//   start() {
//     this.moveInterval = setInterval(() => this.moveLeft(), 1000 / 60);
//     this.animationInterval = setInterval(
//       () => this.playAnimation(this.IMAGES_RUNNING),
//       100
//     );
//   }

//   stop() {
//     clearInterval(this.moveInterval);
//     clearInterval(this.animationInterval);
//   }
// }


class ChickenSmall extends MovableObject {
  IMAGES_RUNNING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = [
    "img/3_enemies_chicken/chicken_small/2_dead/dead.png"
  ];

  constructor() {
    super().loadImage(this.IMAGES_RUNNING[0]);
    this.loadImages(this.IMAGES_RUNNING);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 500 + Math.random() * 2000;
    this.y = 380;
    this.width = 50;
    this.height = 50;
    this.speed = 0.3 + Math.random() * 0.5;
    this.energy = 100;
    this.dead = false;

    this.statusBar = new StatusBarEnemy(this);
  }

  start() {
    // Startet nur, wenn nicht schon animiert wird
    if (!this.chickenAnimationInterval) {
      this.animate();
    }
  }

  hit() {
    if (this.dead) return; // Schon tot → nichts tun

    this.energy -= 100;
    this.energy = Math.max(this.energy, 0);
    this.statusBar.setPercentage(this.energy);

    if (this.isDead()) {
      this.die();
    }
  }

  // die() {
  //   this.dead = true;
  //   clearInterval(this.chickenAnimationInterval); // Lauf-Animation stoppen
  //   this.playAnimation(this.IMAGES_DEAD);

  //   // Entfernt Gegner nach kurzer Zeit (optional)
  //   setTimeout(() => {
  //     this.removeFromWorld?.();
  //   }, 500);
  // }

  // isDead() {
  //   return this.energy <= 0;
  // }

  // animate() {
  //   this.chickenAnimationInterval = setInterval(() => {
  //     if (!this.dead) {
  //       this.playAnimation(this.IMAGES_RUNNING);
  //       this.moveLeft();
  //     }
  //   }, 200);
  // }
//   die() {
//   this.dead = true;  
//   clearInterval(this.chickenAnimationInterval); // Laufanimation stoppen
//   this.loadImage(this.IMAGES_DEAD[0]); // Sofort auf Dead-Bild wechseln

//   // Gegner nach kurzer Zeit aus der Welt entfernen
//   setTimeout(() => {
//     this.removeFromWorld?.();
//   }, 500); // 0,5 Sekunden sichtbar bleiben
// }
die() {
  this.dead = true;  
  clearInterval(this.chickenAnimationInterval); // Stoppe Laufanimation
  this.loadImage(this.IMAGES_DEAD[0]); // Sofort Dead-Bild laden

  // NICHT sofort entfernen, damit es sichtbar bleibt
  // Falls du es nach einer Zeit doch entfernen willst:
  // setTimeout(() => {
  //   this.removeFromWorld?.();
  // }, 2000); // 2 Sekunden sichtbar bleiben
}


// animate() {
//   this.chickenAnimationInterval = setInterval(() => {
//     if (!this.dead) { // Nur wenn nicht tot → Laufanimation
//       this.playAnimation(this.IMAGES_RUNNING);
//       this.moveLeft();
//     }
//   }, 200);
// }
animate() {
  this.chickenAnimationInterval = setInterval(() => {
    if (!this.dead) {
      this.playAnimation(this.IMAGES_RUNNING);
      this.moveLeft();
    }
  }, 200);
}



  stop() {
    clearInterval(this.chickenAnimationInterval);
  }
}



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
//     this.animate();
//   }

//   hit() {
//     if (this.dead) return; // schon tot → nichts mehr machen

//     this.energy -= 100;
//     this.energy = Math.max(this.energy, 0);
//     this.statusBar.setPercentage(this.energy);

//     if (this.isDead()) {
//       this.die();
//     }
//   }

//   isDead() {
//     return this.energy <= 0;
//   }

//   die() {
//     this.dead = true;
//     this.loadImage(this.IMAGES_DEAD[0]); // Dead-Bild setzen
//     this.speed = 0; // nicht mehr bewegen

//     // Nach 1 Sekunde Gegner entfernen
//     setTimeout(() => {
//       if (this.world) {
//         const index = this.world.level.enemies.indexOf(this);
//         if (index > -1) {
//           this.world.level.enemies.splice(index, 1);
//         }
//       }
//     }, 1000);
//   }

//   animate() {
//     this.chickenAnimationInterval = setInterval(() => {
//       if (!this.dead) {
//         this.playAnimation(this.IMAGES_RUNNING);
//         this.moveLeft();
//       }
//     }, 200);
//   }
// }
