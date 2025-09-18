// class Character extends MovableObject {
//   height = 250;
//   width = 120;
//   y = 185;
//   speed = 5;
//   energy = 100;
//   otherDirection = false;
//   isHurtTimer = false;

//   IMAGES_WALKING = Array.from(
//     { length: 6 },
//     (_, i) => `img/2_character_pepe/2_walk/W-2${i + 1}.png`
//   );
//   IMAGES_IDLE = Array.from(
//     { length: 10 },
//     (_, i) => `img/2_character_pepe/1_idle/idle/I-${i + 1}.png`
//   );
//   IMAGES_JUMPING = Array.from(
//     { length: 9 },
//     (_, i) => `img/2_character_pepe/3_jump/J-3${i + 1}.png`
//   );
//   IMAGES_HURT = Array.from(
//     { length: 3 },
//     (_, i) => `img/2_character_pepe/4_hurt/H-4${i + 1}.png`
//   );
//   IMAGES_DEAD = Array.from(
//     { length: 7 },
//     (_, i) => `img/2_character_pepe/5_dead/D-5${i + 1}.png`
//   );

//   constructor(world) {
//     super().loadImage(this.IMAGES_WALKING[0]);
//     this.world = world;
//     this.loadImages(this.IMAGES_WALKING);
//     this.loadImages(this.IMAGES_IDLE);
//     this.loadImages(this.IMAGES_JUMPING);
//     this.loadImages(this.IMAGES_HURT);
//     this.loadImages(this.IMAGES_DEAD);
//     this.applyGravity();
//     this.start();
//   }

//   start() {
//     this.stop();

//     this.moveInterval = setInterval(() => {
//       if (
//         this.world?.keyboard?.RIGHT &&
//         this.x < this.world.level.level_end_x
//       ) {
//         this.moveRight();
//         this.otherDirection = false;
//       }
//       if (this.world?.keyboard?.LEFT && this.x > 0) {
//         this.moveLeft();
//         this.otherDirection = true;
//       }
//       if (this.world?.keyboard?.UP && !this.isAboveGround()) {
//         this.jump();
//       }
//       if (this.world?.keyboard?.D) {
//         this.world.throwableBottles();
//       }

//       if (this.world) {
//         this.world.camera_x = -this.x + 100;
//       }
//     }, 1000 / 60);

//     this.animationInterval = setInterval(() => {
//       if (this.energy <= 0) {
//         this.playAnimation(this.IMAGES_DEAD);
//       } else if (this.isHurt()) {
//         this.playAnimation(this.IMAGES_HURT);
//       } else if (this.isAboveGround()) {
//         this.playAnimation(this.IMAGES_JUMPING);
//       } else {
//         if (
//           (this.world && this.world.keyboard.RIGHT) ||
//           this.world.keyboard.LEFT
//         ) {
//           this.playAnimation(this.IMAGES_WALKING);
//         } else {
//           this.playAnimation(this.IMAGES_IDLE);
//         }
//       }
//     }, 80);
//   }

//   stop() {
//     clearInterval(this.moveInterval);
//     clearInterval(this.animationInterval);
//   }

//   collectCoin() {
//     if (this.world.statusBarCoin.availableCoins < 5) {
//       this.world.statusBarCoin.availableCoins++;
//       this.world.statusBarCoin.update();
//     }
//   }

//   collectBottle() {
//     if (this.world.statusBarBottle.availableBottles < 5) {
//       this.world.statusBarBottle.availableBottles++;
//       this.world.statusBarBottle.update();

//       // Flasche entfernen
//       this.world.collectableBottles = this.world.collectableBottles.filter(
//         (bottle) => !this.isColliding(bottle)
//       );

//       this.world.spawnNewBottle();
//     }
//   }

//   // throw() {
//   //   if (this.world.statusBarBottle.availableBottles > 0) {
//   //     this.world.statusBarBottle.availableBottles--;
//   //     this.world.statusBarBottle.update();

//   //     let bottle = new ThrowableObject(
//   //       this.x + 30,
//   //       this.y + 100,
//   //       this.otherDirection
//   //     );
//   //     this.world.throwableObjects.push(bottle);
//   //   }
//   // }
// }

// class Character extends MovableObject {
//   height = 250;
//   width = 120;
//   y = 185;
//   speed = 5;
//   energy = 100;
//   otherDirection = false;
//   isHurtTimer = false;

//   IMAGES_WALKING = Array.from(
//     { length: 6 },
//     (_, i) => `img/2_character_pepe/2_walk/W-2${i + 1}.png`
//   );
//   IMAGES_IDLE = Array.from(
//     { length: 10 },
//     (_, i) => `img/2_character_pepe/1_idle/idle/I-${i + 1}.png`
//   );
//   IMAGES_JUMPING = Array.from(
//     { length: 9 },
//     (_, i) => `img/2_character_pepe/3_jump/J-3${i + 1}.png`
//   );
//   IMAGES_HURT = Array.from(
//     { length: 3 },
//     (_, i) => `img/2_character_pepe/4_hurt/H-4${i + 1}.png`
//   );
//   IMAGES_DEAD = Array.from(
//     { length: 7 },
//     (_, i) => `img/2_character_pepe/5_dead/D-5${i + 1}.png`
//   );

//   constructor(world) {
//     super().loadImage(this.IMAGES_WALKING[0]);
//     this.world = world;
//     this.loadImages(this.IMAGES_WALKING);
//     this.loadImages(this.IMAGES_IDLE);
//     this.loadImages(this.IMAGES_JUMPING);
//     this.loadImages(this.IMAGES_HURT);
//     this.loadImages(this.IMAGES_DEAD);
//     this.applyGravity();

//     // 🎵 Sounds vorbereiten
//     this.jumpSound = new Audio("audio/jump.mp3");
//     this.coinSound = new Audio("audio/coins.mp3");

//     this.start();
//   }

//   start() {
//     this.stop();

//     this.moveInterval = setInterval(() => {
//       if (
//         this.world?.keyboard?.RIGHT &&
//         this.x < this.world.level.level_end_x
//       ) {
//         this.moveRight();
//         this.otherDirection = false;
//       }
//       if (this.world?.keyboard?.LEFT && this.x > 0) {
//         this.moveLeft();
//         this.otherDirection = true;
//       }
//       if (this.world?.keyboard?.UP && !this.isAboveGround()) {
//         this.jump();

//         // 🎵 Jump-Sound abspielen
//         this.jumpSound.currentTime = 0;
//         this.jumpSound.play();
//       }
//       if (this.world?.keyboard?.D) {
//         this.world.throwableBottles();
//       }

//       if (this.world) {
//         this.world.camera_x = -this.x + 100;
//       }
//     }, 1000 / 60);

//     this.animationInterval = setInterval(() => {
//       if (this.energy <= 0) {
//         this.playAnimation(this.IMAGES_DEAD);
//       } else if (this.isHurt()) {
//         this.playAnimation(this.IMAGES_HURT);
//       } else if (this.isAboveGround()) {
//         this.playAnimation(this.IMAGES_JUMPING);
//       } else {
//         if (
//           (this.world && this.world.keyboard.RIGHT) ||
//           this.world.keyboard.LEFT
//         ) {
//           this.playAnimation(this.IMAGES_WALKING);
//         } else {
//           this.playAnimation(this.IMAGES_IDLE);
//         }
//       }
//     }, 80);
//   }

//   stop() {
//     clearInterval(this.moveInterval);
//     clearInterval(this.animationInterval);
//   }

//   collectCoin() {
//     if (this.world.statusBarCoin.availableCoins < 5) {
//       this.world.statusBarCoin.availableCoins++;
//       this.world.statusBarCoin.update();

//       // 🎵 Coin-Sound abspielen
//       this.coinSound.currentTime = 0;
//       this.coinSound.play();
//     }
//   }

//   collectBottle() {
//     if (this.world.statusBarBottle.availableBottles < 5) {
//       this.world.statusBarBottle.availableBottles++;
//       this.world.statusBarBottle.update();

//       this.world.collectableBottles = this.world.collectableBottles.filter(
//         (bottle) => !this.isColliding(bottle)
//       );

//       this.world.spawnNewBottle();
//     }
//   }
// }

// class Character extends MovableObject {
//   height = 250;
//   width = 120;
//   y = 185;
//   speed = 5;
//   energy = 100;
//   otherDirection = false;
//   isHurtTimer = false;

//   IMAGES_WALKING = Array.from(
//     { length: 6 },
//     (_, i) => `img/2_character_pepe/2_walk/W-2${i + 1}.png`
//   );
//   IMAGES_IDLE = Array.from(
//     { length: 10 },
//     (_, i) => `img/2_character_pepe/1_idle/idle/I-${i + 1}.png`
//   );
//   IMAGES_JUMPING = Array.from(
//     { length: 9 },
//     (_, i) => `img/2_character_pepe/3_jump/J-3${i + 1}.png`
//   );
//   IMAGES_HURT = Array.from(
//     { length: 3 },
//     (_, i) => `img/2_character_pepe/4_hurt/H-4${i + 1}.png`
//   );
//   IMAGES_DEAD = Array.from(
//     { length: 7 },
//     (_, i) => `img/2_character_pepe/5_dead/D-5${i + 1}.png`
//   );

//   constructor(world) {
//     super().loadImage(this.IMAGES_WALKING[0]);
//     this.world = world;
//     this.loadImages(this.IMAGES_WALKING);
//     this.loadImages(this.IMAGES_IDLE);
//     this.loadImages(this.IMAGES_JUMPING);
//     this.loadImages(this.IMAGES_HURT);
//     this.loadImages(this.IMAGES_DEAD);
//     this.applyGravity();
//     this.start();

//     // 🎵 Sounds nur einmal erzeugen
//     // this.jumpSound = new Audio("audio/jump.mp3");
//     // this.jumpSound.volume = 0.5;

//     // this.coinSound = new Audio("audio/coins.mp3");
//     // this.coinSound.volume = 0.5;
//   }

//   start() {
//     this.stop();

//     this.moveInterval = setInterval(() => {
//       if (
//         this.world?.keyboard?.RIGHT &&
//         this.x < this.world.level.level_end_x
//       ) {
//         this.moveRight();
//         this.otherDirection = false;
//       }
//       if (this.world?.keyboard?.LEFT && this.x > 0) {
//         this.moveLeft();
//         this.otherDirection = true;
//       }
//       if (this.world?.keyboard?.UP && !this.isAboveGround()) {
//         this.jump();
//       }
//       if (this.world?.keyboard?.D) {
//         this.world.throwableBottles();
//       }

//       if (this.world) {
//         this.world.camera_x = -this.x + 100;
//       }
//     }, 1000 / 60);

//     this.animationInterval = setInterval(() => {
//       if (this.energy <= 0) {
//         this.playAnimation(this.IMAGES_DEAD);
//       } else if (this.isHurt()) {
//         this.playAnimation(this.IMAGES_HURT);
//       } else if (this.isAboveGround()) {
//         this.playAnimation(this.IMAGES_JUMPING);
//       } else {
//         if (
//           (this.world && this.world.keyboard.RIGHT) ||
//           this.world.keyboard.LEFT
//         ) {
//           this.playAnimation(this.IMAGES_WALKING);
//         } else {
//           this.playAnimation(this.IMAGES_IDLE);
//         }
//       }
//     }, 80);
//   }

//   stop() {
//     clearInterval(this.moveInterval);
//     clearInterval(this.animationInterval);
//   }

//   // jump() {
//   //   super.jump(); // 🟢 ursprüngliche Sprunglogik von MovableObject

//   //   // 🎵 Jump-Sound abspielen (zurücksetzen, dann play)
//   //   this.jumpSound.pause();
//   //   this.jumpSound.currentTime = 0;
//   //   this.jumpSound.play().catch(() => {});
//   // }
//   jump() {
//     super.jump(); // alte Logik behalten
//     //this.playSound(this.jumpSound);
//     this.playSound("audio/jump.mp3");
//   }

//   // collectCoin() {
//   //   if (this.world.statusBarCoin.availableCoins < 5) {
//   //     this.world.statusBarCoin.availableCoins++;
//   //     this.world.statusBarCoin.update();

//   //     // 🎵 Coin-Sound abspielen
//   //     this.coinSound.pause();
//   //     this.coinSound.currentTime = 0;
//   //     this.coinSound.play().catch(() => {});
//   //   }
//   // }
//   collectCoin() {
//     if (this.world.statusBarCoin.availableCoins < 5) {
//       this.world.statusBarCoin.availableCoins++;
//       this.world.statusBarCoin.update();

//       // 🎵 Sound abspielen
//       //this.playSound(this.coinSound);
//       this.playSound("audio/coins.mp3");
//     }
//   }

//   collectBottle() {
//     if (this.world.statusBarBottle.availableBottles < 5) {
//       this.world.statusBarBottle.availableBottles++;
//       this.world.statusBarBottle.update();

//       this.world.collectableBottles = this.world.collectableBottles.filter(
//         (bottle) => !this.isColliding(bottle)
//       );

//       this.world.spawnNewBottle();
//     }
//   }

//   // playSound(sound) {
//   //   if (!sound) return;
//   //   sound.pause();
//   //   sound.currentTime = 0;
//   //   sound.play().catch((e) => {
//   //     console.warn("Sound konnte nicht abgespielt werden:", e);
//   //   });
//   // }
//   playSound(path) {
//     if (!path) return;
//     const sound = new Audio(path);
//     sound.volume = 0.5;
//     sound.play().catch((e) => {
//       console.warn("Sound konnte nicht abgespielt werden:", e);
//     });
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

  IMAGES_WALKING = Array.from(
    { length: 6 },
    (_, i) => `img/2_character_pepe/2_walk/W-2${i + 1}.png`
  );
  IMAGES_IDLE = Array.from(
    { length: 10 },
    (_, i) => `img/2_character_pepe/1_idle/idle/I-${i + 1}.png`
  );
  IMAGES_JUMPING = Array.from(
    { length: 9 },
    (_, i) => `img/2_character_pepe/3_jump/J-3${i + 1}.png`
  );
  IMAGES_HURT = Array.from(
    { length: 3 },
    (_, i) => `img/2_character_pepe/4_hurt/H-4${i + 1}.png`
  );
  IMAGES_DEAD = Array.from(
    { length: 7 },
    (_, i) => `img/2_character_pepe/5_dead/D-5${i + 1}.png`
  );

  constructor(world) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.world = world;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.applyGravity();
    this.start();
  }

  start() {
    this.stop();

    this.moveInterval = setInterval(() => {
      if (
        this.world?.keyboard?.RIGHT &&
        this.x < this.world.level.level_end_x
      ) {
        this.moveRight();
        this.otherDirection = false;
      }
      if (this.world?.keyboard?.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
      }
      if (this.world?.keyboard?.UP && !this.isAboveGround()) {
        this.jump();
      }
      if (this.world?.keyboard?.D) {
        this.world.throwableBottles();
      }

      if (this.world) {
        this.world.camera_x = -this.x + 100;
      }
    }, 1000 / 60);

    this.animationInterval = setInterval(() => {
      if (this.energy <= 0) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        if (
          (this.world && this.world.keyboard.RIGHT) ||
          this.world.keyboard.LEFT
        ) {
          this.playAnimation(this.IMAGES_WALKING);
        } else {
          this.playAnimation(this.IMAGES_IDLE);
        }
      }
    }, 80);
  }

  stop() {
    clearInterval(this.moveInterval);
    clearInterval(this.animationInterval);
  }

  // 🟢 Sprung + Sound
  // jump() {
  //   super.jump(); // normale Sprunglogik von MovableObject
  //   this.playSound("audio/jump.mp3");
  // }
  jump() {
  super.jump(); // normale Sprunglogik
  const jumpSound = new Audio("audio/jump.mp3");
  jumpSound.volume = 0.5;
  jumpSound.play().catch((e) => {
    console.warn("Jump-Sound konnte nicht abgespielt werden:", e);
  });
}


  // 🟡 Coins sammeln + Sound
  // collectCoin() {
  //   if (this.world.statusBarCoin.availableCoins < 5) {
  //     this.world.statusBarCoin.availableCoins++;
  //     this.world.statusBarCoin.update();
  //     this.playSound("audio/coins.mp3");
  //   }
  // }
//   collectCoin() {
//   if (this.world.statusBarCoin.availableCoins < 5) {
//     this.world.statusBarCoin.availableCoins++;
//     this.world.statusBarCoin.update();

//     // 🎵 Coin-Sound bei jedem Coin neu erzeugen
//     const coinSound = new Audio("audio/coins.mp3");
//     coinSound.volume = 0.5;
//     coinSound.play().catch((e) => {
//       console.warn("Coin-Sound konnte nicht abgespielt werden:", e);
//     });
//   }
// }


  // 🔵 Flaschen sammeln (ohne Sound)
  collectBottle() {
    if (this.world.statusBarBottle.availableBottles < 5) {
      this.world.statusBarBottle.availableBottles++;
      this.world.statusBarBottle.update();

      this.world.collectableBottles = this.world.collectableBottles.filter(
        (bottle) => !this.isColliding(bottle)
      );

      this.world.spawnNewBottle();
    }
  }

  // 🎵 Universelle Sound-Funktion
  playSound(path) {
    if (!path) return;
    const sound = new Audio(path);
    sound.volume = 0.5;
    sound.play().catch((e) => {
      console.warn("Sound konnte nicht abgespielt werden:", e);
    });
  }
}
