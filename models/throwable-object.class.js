//lass ThrowableObject extends MovableObject {
  // constructor(x, y) {
  //   super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
  //   this.x = x;
  //   this.y = y;
  //   this.width = 50;
  //   this.height = 60;
  //   this.throw();
  // }

  // throw() {
  //   this.speedY = 30;
  //   //this.speedX = 20;
  //   this.applyGravity();
  //   setInterval(() => {
  //     this.x += 10;
  //   }, 25);
  // }



  // ------------- chatGPT ---------------

//   constructor(x, y, directionLeft = false) {
//     super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
//     this.x = x;
//     this.y = y;
//     this.width = 50;
//     this.height = 60;
//     this.directionLeft = directionLeft;
//     this.throw();
//   }

//   throw() {
//     this.speedY = 30;
//     this.applyGravity();
//     this.throwInterval = setInterval(() => {
//       this.x += this.directionLeft ? -10 : 10;
//     }, 25);
//   }
// }

//   spawnThrownBottle() {
//   let bottle = new ThrowableObject(this.x, this.y);
//   this.world.throwableObjects.push(bottle);
// }

//   constructor(x, y, directionLeft = false) {
//     super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
//     this.x = x;
//     this.y = y;
//     this.width = 50;
//     this.height = 60;
//     this.directionLeft = directionLeft;
//     this.throw();
//   }

//   throw() {
//     this.speedY = 30;
//     this.applyGravity();
//     this.throwInterval = setInterval(() => {
//       this.x += this.directionLeft ? -10 : 10;
//     }, 25);
//   }
// }


class ThrowableObject extends MovableObject {
  constructor(x, y, directionLeft = false) {
    super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 60;
    this.directionLeft = directionLeft;
    this.throw();
  }

  throw() {
    this.speedY = 30;
    this.applyGravity();
    this.throwInterval = setInterval(() => {
      this.x += this.directionLeft ? -10 : 10;
    }, 25);
  }

  isDead() {
    return this.y > 480; // z. B. verschwunden unter dem Bildschirm
  }
}


  // ------------- chatGPT ---------------

//}
