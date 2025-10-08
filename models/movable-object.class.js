// class MovableObject extends DrawableObject {
//   speed = 0.15;
//   otherDirection = false;
//   speedY = 0;
//   acceleration = 2.5;
//   energy = 100;
//   lastHit = 0;

//   applyGravity() {
//     setInterval(() => {
//       if (this.isAboveGround() || this.speedY > 0) {
//         this.y -= this.speedY;
//         this.speedY -= this.acceleration;
//       }
//     }, 1000 / 25);
//   }

//   isAboveGround() {
//     if (this instanceof ThrowableObject) {
//       return true;
//     } else {
//       return this.y < 180;
//     }
//   }

//   isColliding(mo) {
//     if (!mo) return false;

//     const hitboxPadding = 15;

//     return (
//       this.x + this.width > mo.x - hitboxPadding &&
//       this.x - hitboxPadding < mo.x + mo.width + hitboxPadding &&
//       this.y + this.height > mo.y - hitboxPadding &&
//       this.y - hitboxPadding < mo.y + mo.height + hitboxPadding
//     );
//   }

//   hit() {
//     this.energy -= 5;
//     if (this.energy < 0) {
//       this.energy = 0;
//     } else {
//       this.lastHit = new Date().getTime();
//     }
//   }

//   isHurt() {
//     let timepassed = new Date().getTime() - this.lastHit;
//     timepassed = timepassed / 1000;
//     return timepassed < 1;
//   }

//   isDead() {
//     return this.energy == 0;
//   }

//   playAnimation(images) {
//     let i = this.currentImage % images.length;
//     let path = images[i];
//     this.img = this.imageCache[path];
//     this.currentImage++;
//   }

//   moveRight() {
//     this.x += this.speed;
//     //console.log("Gehe rechts, X:", this.x);
//   }

//   moveLeft() {
//     this.x -= this.speed;
//   }

//   jump() {
//     this.speedY = 30;
//   }
// }

/**
 * 🔹 Basisklasse für bewegliche Objekte (Charakter, Gegner etc.)
 */
class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  /** 🪂 Schwerkraft anwenden */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /** ⬆️ Prüfen, ob das Objekt über dem Boden ist */
  isAboveGround() {
    return this instanceof ThrowableObject ? true : this.y < 180;
  }

  /** 💥 Kollisionserkennung mit anderem Objekt */
  isColliding(mo) {
    if (!mo) return false;
    const p = 15; // Hitbox-Puffer
    return (
      this.x + this.width > mo.x - p &&
      this.x - p < mo.x + mo.width + p &&
      this.y + this.height > mo.y - p &&
      this.y - p < mo.y + mo.height + p
    );
  }

  /** ❤️ Schaden erhalten */
  hit() {
    this.energy = Math.max(0, this.energy - 5);
    if (this.energy > 0) this.lastHit = new Date().getTime();
  }

  /** 🤕 Prüfen, ob Charakter kürzlich getroffen wurde */
  isHurt() {
    return (new Date().getTime() - this.lastHit) / 1000 < 1;
  }

  /** ☠️ Prüfen, ob tot */
  isDead() {
    return this.energy === 0;
  }

  /** 🖼️ Animation abspielen */
  playAnimation(images) {
    const i = this.currentImage % images.length;
    this.img = this.imageCache[images[i]];
    this.currentImage++;
  }

  /** ➡️ Nach rechts bewegen */
  moveRight() {
    this.x += this.speed;
  }

  /** ⬅️ Nach links bewegen */
  moveLeft() {
    this.x -= this.speed;
  }

  /** 🦘 Springen */
  jump() {
    this.speedY = 30;
  }
}
