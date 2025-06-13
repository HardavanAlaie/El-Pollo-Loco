/*class Character extends MovableObject {
  height = 250;
  y = 90;
  speed = 10;

  //   IMAGES_RUNNING = Array.from(
  //     { length: 8 },
  //     (_, i) => `img/2_character_pepe/2_walk/W-2${i + 1}.png`
  //   );
  IMAGES_RUNNING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  // IMAGES_JUMPING = Array.from(
  //   { length: 9 },
  //   (_, i) => `img/2_character_pepe/3_jump/J-3${i + 1}.png`
  // );
  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  //   IMAGES_DEATH = Array.from(
  //     { length: 10 },
  //     (_, i) => `img/hero/death${i + 1}.png`
  //   );

  //   IMAGES_HURT = Array.from(
  //     { length: 4 },
  //     (_, i) => `img/hero/hurt${i + 1}.png`
  //   );

  world;

  currentImage = 0;

  constructor() {
    super().loadImage(this.IMAGES_RUNNING[0]);
    this.loadImages(this.IMAGES_RUNNING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.applyGravity();
    this.animate();
  }

  animate() { 
    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.otherDirection = false;
      }

      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
      }

      if (this.world.keyboard.UP && !this.isAboveGround()) {
        this.jump();
      }

      // if (this.world.keyboard.SPACE) {
      //   this.throw();
      // }
      if (this.world.keyboard.D) {
        this.throw();
      }

      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        //jump animation
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          //walk animation
          this.playAnimation(this.IMAGES_RUNNING);
        }
      }
    }, 50);
  }
}*/

// ---------------- chatGPT ----------------
// class Character extends MovableObject {
//   height = 250;
//   y = 90;
//   speed = 10;

//   IMAGES_RUNNING = [
//     "img/2_character_pepe/2_walk/W-21.png",
//     "img/2_character_pepe/2_walk/W-22.png",
//     "img/2_character_pepe/2_walk/W-23.png",
//     "img/2_character_pepe/2_walk/W-24.png",
//     "img/2_character_pepe/2_walk/W-25.png",
//     "img/2_character_pepe/2_walk/W-26.png",
//   ];

//   IMAGES_JUMPING = [
//     "img/2_character_pepe/3_jump/J-31.png",
//     "img/2_character_pepe/3_jump/J-32.png",
//     "img/2_character_pepe/3_jump/J-33.png",
//     "img/2_character_pepe/3_jump/J-34.png",
//     "img/2_character_pepe/3_jump/J-35.png",
//     "img/2_character_pepe/3_jump/J-36.png",
//     "img/2_character_pepe/3_jump/J-37.png",
//     "img/2_character_pepe/3_jump/J-38.png",
//     "img/2_character_pepe/3_jump/J-39.png",
//   ];

//   IMAGES_HURT = [
//     "img/2_character_pepe/4_hurt/H-41.png",
//     "img/2_character_pepe/4_hurt/H-42.png",
//     "img/2_character_pepe/4_hurt/H-43.png",
//   ];

//   IMAGES_DEAD = [
//     "img/2_character_pepe/5_dead/D-51.png",
//     "img/2_character_pepe/5_dead/D-52.png",
//     "img/2_character_pepe/5_dead/D-53.png",
//     "img/2_character_pepe/5_dead/D-54.png",
//     "img/2_character_pepe/5_dead/D-55.png",
//     "img/2_character_pepe/5_dead/D-56.png",
//     "img/2_character_pepe/5_dead/D-57.png",
//   ];

//   world;
//   currentImage = 0;

//   constructor() {
//     super().loadImage(this.IMAGES_RUNNING[0]);
//     this.loadImages(this.IMAGES_RUNNING);
//     this.loadImages(this.IMAGES_JUMPING);
//     this.loadImages(this.IMAGES_HURT);
//     this.loadImages(this.IMAGES_DEAD);
//     this.applyGravity();
//     this.animate();
//   }

//   animate() {
//     setInterval(() => {
//       if (this.world && this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
//         this.moveRight();
//         this.otherDirection = false;
//       }

//       if (this.world && this.world.keyboard.LEFT && this.x > 0) {
//         this.moveLeft();
//         this.otherDirection = true;
//       }

//       if (this.world && this.world.keyboard.UP && !this.isAboveGround()) {
//         this.jump();
//       }

//       if (this.world && this.world.keyboard.D) {
//         this.throw();
//       }

//       this.world.camera_x = -this.x + 100;
//     }, 1000 / 60);

//     setInterval(() => {
//       if (this.isDead()) {
//         this.playAnimation(this.IMAGES_DEAD);
//       } else if (this.isHurt()) {
//         this.playAnimation(this.IMAGES_HURT);
//       } else if (this.isAboveGround()) {
//         this.playAnimation(this.IMAGES_JUMPING);
//       } else {
//         if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
//           this.playAnimation(this.IMAGES_RUNNING);
//         }
//       }
//     }, 50);
//   }

//   collectBottle() {
//     if (this.world.statusBarBottle.availableBottles < 5) {
//       this.world.statusBarBottle.availableBottles++;
//       this.world.statusBarBottle.update();
//     }
//   }

//   throw() {
//     if (this.world.statusBarBottle.availableBottles > 0) {
//       this.world.statusBarBottle.availableBottles--;
//       this.world.statusBarBottle.update();

//       let bottle = new ThrowableObject(this.x + 30, this.y + 100, this.otherDirection);
//       this.world.throwableObjects.push(bottle);
//     }
//   }
// }

class Character extends MovableObject {
  height = 250;
  width = 120;
  y = 185;
  speed = 5;
  energy = 100;
  otherDirection = false;
  isHurtTimer = false;

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  // IMAGES_IDLE = [
  //   'img/2_character_pepe/1_idle/idle/I-1.png',
  //   'img/2_character_pepe/1_idle/idle/I-2.png',
  //   'img/2_character_pepe/1_idle/idle/I-3.png',
  //   'img/2_character_pepe/1_idle/idle/I-4.png',
  //   'img/2_character_pepe/1_idle/idle/I-5.png',
  //   'img/2_character_pepe/1_idle/idle/I-6.png',
  //   'img/2_character_pepe/1_idle/idle/I-7.png',
  //   'img/2_character_pepe/1_idle/idle/I-8.png',
  //   'img/2_character_pepe/1_idle/idle/I-9.png',
  //   'img/2_character_pepe/1_idle/idle/I-10.png'
  // ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    //this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.applyGravity();
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveCharacter();
    }, 1000 / 60);

    setInterval(() => {
      this.playAnimation();
    }, 120);
  }

  moveCharacter() {
    if (
      this.world &&
      this.world.keyboard.RIGHT &&
      this.x < this.world.level.levelEndX
    ) {
      this.moveRight();
      this.otherDirection = false;
    }

    if (this.world && this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
    }

    if (this.world && this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
    }

    this.world && (this.world.camera_x = -this.x + 100);
  }

  playAnimation() {
    if (this.energy <= 0) {
      this.playImages(this.IMAGES_DEAD);
    } else if (this.isHurt()) {
      this.playImages(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
      this.playImages(this.IMAGES_JUMPING);
    } else { 
      if (this.world && this.world.keyboard.RIGHT || this.world.keyboard.LEFT)
          this.playImages(this.IMAGES_WALKING);
    } //else {
    //   this.playImages(this.IMAGES_IDLE);
    // }
  }

  isHurt() {
    return this.isHurtTimer;
  }


  collectBottle() {
    if (this.world.statusBarBottle.availableBottles < 5) {
      this.world.statusBarBottle.availableBottles++;
      this.world.statusBarBottle.update();
    }
  }

  throw() {
    if (this.world.statusBarBottle.availableBottles > 0) {
      this.world.statusBarBottle.availableBottles--;
      this.world.statusBarBottle.update();

      let bottle = new ThrowableObject(this.x + 30, this.y + 100, this.otherDirection);
      this.world.throwableObjects.push(bottle);
    }
  }
}
// ---------------- chatGPT ----------------
