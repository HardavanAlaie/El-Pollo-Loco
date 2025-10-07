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
//     this.isDead = false;

//     this.jumpSound = new Audio("audio/jump.mp3");
//     this.jumpSound.volume = 0.5;
//     this.jumpSound.muted = !soundEnabled;

//     this.coinSound = new Audio("audio/coins.mp3");
//     this.coinSound.volume = 0.5;
//     this.coinSound.muted = !soundEnabled;
//   }

//   start() {
//     this.stop();
//     this.moveIntervalMethod();
//     this.animationIntervalMethod();
//   }

//   animationIntervalMethod() {
//     this.animationInterval = setInterval(() => {
//       if (this.energy <= 0) {
//         this.playAnimation(this.IMAGES_DEAD);
//       } else if (this.isHurt()) {
//         this.playAnimation(this.IMAGES_HURT);
//       } else if (this.isAboveGround()) {
//         this.playAnimation(this.IMAGES_JUMPING);
//       } else {
//         if ((this.world && this.world.keyboard.RIGHT) || this.world.keyboard.LEFT) {
//           this.playAnimation(this.IMAGES_WALKING);
//         } else {
//           this.playAnimation(this.IMAGES_IDLE);
//         }
//       }
//     }, 80);
//   }

//   moveIntervalMethod() {
//     this.moveInterval = setInterval(() => {
//       if (this.world?.keyboard?.RIGHT && this.x < this.world.level.level_end_x) {
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
//   }

//   hit() {
//     if (this.energy <= 0 || this.isDead) return;

//     this.energy -= 10;
//     this.energy = Math.max(this.energy, 0);

//     if (this.world?.statusBar) {
//       this.world.statusBar.setPercentage(this.energy);
//     }
//     this.playAnimation(this.IMAGES_HURT);
//     this.soundEnabledMethod();
//     this.energyMethod();
//   }

//   energyMethod() {
//     if (this.energy <= 0) {
//       this.energy = 0;
//       this.isDead = true;
//       if (this.world && !this.world.playerDied) {
//         this.world.playerDied = true;
//         this.world.stopGameLoopHard();
//         this.world.showGameOverScreen();
//       }
//     }
//   }

//   soundEnabledMethod() {
//     if (soundEnabled && this.hurtSound) {
//       this.hurtSound.currentTime = 0;
//       this.hurtSound.play().catch(() => { });
//     }
//   }

//   stop() {
//     clearInterval(this.moveInterval);
//     clearInterval(this.animationInterval);
//   }

//   jump() {
//     super.jump();
//     if (soundEnabled) {
//       this.jumpSound.currentTime = 0;
//       this.jumpSound.play().catch(() => {});
//     }
//   }

//   collectCoin() {
//     if (this.world.statusBarCoin.availableCoins < 5) {
//       this.world.statusBarCoin.availableCoins++;
//       this.world.statusBarCoin.update();

//       if (soundEnabled) {
//         this.coinSound.currentTime = 0;
//         this.coinSound.play().catch(() => {});
//       }
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

//   playSound(path) {
//     if (!path || !soundEnabled) return;
//     const sound = new Audio(path);
//     sound.volume = 0.5;
//     sound.play().catch((e) => {
//       console.warn("Sound konnte nicht abgespielt werden:", e);
//     });
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
//   isDead = false;

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

//     this.jumpSound = this.createSound("audio/jump.mp3");
//     this.coinSound = this.createSound("audio/coins.mp3");
//     this.hurtSound = this.createSound("audio/hurt.mp3");
//   }

//   start() {
//     this.stop();
//     this.moveInterval = setInterval(() => this.handleMovement(), 1000 / 60);
//     this.animationInterval = setInterval(() => this.updateAnimation(), 80);
//   }

//   handleMovement() {
//     const { keyboard, level } = this.world || {};
//     if (!keyboard) return;

//     if (keyboard.RIGHT && this.x < level?.level_end_x) {
//       this.moveRight();
//       this.otherDirection = false;
//     } else if (keyboard.LEFT && this.x > 0) {
//       this.moveLeft();
//       this.otherDirection = true;
//     }

//     if (keyboard.UP && !this.isAboveGround()) this.jump();
//     if (keyboard.D) this.world.throwableBottles();

//     this.world.camera_x = -this.x + 100;
//   }

//   animationIntervalMethod() {
//     this.animationInterval = setInterval(() => {
//       if (this.energy <= 0) {
//         this.playAnimation(this.IMAGES_DEAD);
//         return;
//       }

//       // Wenn Hurt-Zustand aktiv → Hurt-Animation beibehalten
//       if (this.isHurtTimer) {
//         this.playAnimation(this.IMAGES_HURT);
//         return;
//       }

//       if (this.isAboveGround()) {
//         this.playAnimation(this.IMAGES_JUMPING);
//       } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
//         this.playAnimation(this.IMAGES_WALKING);
//       } else {
//         this.playAnimation(this.IMAGES_IDLE);
//       }
//     }, 100);
//   }

//   updateAnimation() {
//     if (this.energy <= 0) return this.playAnimation(this.IMAGES_DEAD);
//     if (this.isHurt()) return this.playAnimation(this.IMAGES_HURT);
//     if (this.isAboveGround()) return this.playAnimation(this.IMAGES_JUMPING);

//     const { keyboard } = this.world || {};
//     if (keyboard?.LEFT || keyboard?.RIGHT)
//       this.playAnimation(this.IMAGES_WALKING);
//     else this.playAnimation(this.IMAGES_IDLE);
//   }

//   stop() {
//     clearInterval(this.moveInterval);
//     clearInterval(this.animationInterval);
//   }

//   // hit() {
//   //   if (this.energy <= 0 || this.isDead) return;

//   //   this.energy = Math.max(this.energy - 10, 0);
//   //   this.world?.statusBar?.setPercentage(this.energy);

//   //   this.playAnimation(this.IMAGES_HURT);
//   //   this.playIfEnabled(this.hurtSound);

//   //   if (this.energy <= 0) this.die();
//   // }
//   // hit() {
//   //   // Wenn Charakter schon tot oder gerade unverwundbar ist → nichts tun
//   //   if (this.energy <= 0 || this.isDead || this.isHurtTimer) return;

//   //   this.energy = Math.max(this.energy - 10, 0);
//   //   this.world?.statusBar?.setPercentage(this.energy);

//   //   // Hurt-Sound & Animation
//   //   this.playAnimation(this.IMAGES_HURT);
//   //   this.playIfEnabled(this.hurtSound);

//   //   // Kurze Unverwundbarkeitsphase (z. B. 1 Sekunde)
//   //   this.isHurtTimer = true;
//   //   setTimeout(() => (this.isHurtTimer = false), 1000);

//   //   // Prüfen, ob er wirklich tot ist (nach Animation etc.)
//   //   if (this.energy <= 0) {
//   //     this.die();
//   //   }
//   // }
//   hit() {
//     // Schon tot oder gerade im Hurt-Zustand? → kein weiterer Treffer
//     if (this.energy <= 0 || this.isDead || this.isHurtTimer) return;

//     this.energy = Math.max(this.energy - 10, 0);
//     this.world?.statusBar?.setPercentage(this.energy);

//     // Hurt-Zustand aktivieren
//     this.isHurtTimer = true;
//     this.hurtStartTime = Date.now();

//     // Hurt-Sound + Animation
//     this.playIfEnabled(this.hurtSound);
//     this.playAnimation(this.IMAGES_HURT);

//     // Nach 800 ms wieder „normal“ animieren
//     setTimeout(() => (this.isHurtTimer = false), 800);

//     if (this.energy <= 0) {
//       this.die();
//     }
//   }

//   // die() {
//   //   this.energy = 0;
//   //   this.isDead = true;
//   //   if (this.world && !this.world.playerDied) {
//   //     this.world.playerDied = true;
//   //     this.world.stopGameLoopHard();
//   //     this.world.showGameOverScreen();
//   //   }
//   // }
//   die() {
//     if (this.isDead) return; // Schon tot? → Nichts tun

//     this.isDead = true;
//     this.energy = 0;
//     this.playAnimation(this.IMAGES_DEAD);

//     // GameOver nur 1× auslösen
//     if (this.world && !this.world.playerDied) {
//       this.world.playerDied = true;
//       this.world.stopGameLoopHard();
//       this.world.showGameOverScreen();
//     }
//   }

//   jump() {
//     super.jump();
//     this.playIfEnabled(this.jumpSound);
//   }

//   collectCoin() {
//     const bar = this.world?.statusBarCoin;
//     if (bar && bar.availableCoins < 5) {
//       bar.availableCoins++;
//       bar.update();
//       this.playIfEnabled(this.coinSound);
//     }
//   }

//   collectBottle() {
//     const bar = this.world?.statusBarBottle;
//     if (bar && bar.availableBottles < 5) {
//       bar.availableBottles++;
//       bar.update();

//       this.world.collectableBottles = this.world.collectableBottles.filter(
//         (bottle) => !this.isColliding(bottle)
//       );

//       this.world.spawnNewBottle();
//     }
//   }

//   createSound(path) {
//     const sound = new Audio(path);
//     sound.volume = 0.5;
//     sound.muted = !soundEnabled;
//     return sound;
//   }

//   playIfEnabled(sound) {
//     if (!soundEnabled || !sound) return;
//     sound.currentTime = 0;
//     sound.play().catch(() => {});
//   }

//   playSound(path) {
//     if (!path || !soundEnabled) return;
//     const sound = new Audio(path);
//     sound.volume = 0.5;
//     sound.play().catch(() => {});
//   }
// }

class Character extends MovableObject {
  height = 250;
  width = 120;
  y = 185;
  speed = 5;
  energy = 100;
  otherDirection = false;
  isDead = false;
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

    // Sounds
    this.jumpSound = new Audio("audio/jump.mp3");
    this.jumpSound.volume = 0.5;
    this.jumpSound.muted = !soundEnabled;

    this.coinSound = new Audio("audio/coins.mp3");
    this.coinSound.volume = 0.5;
    this.coinSound.muted = !soundEnabled;

    this.hurtSound = new Audio("audio/hurt.mp3");
    this.hurtSound.volume = 0.6;
    this.hurtSound.muted = !soundEnabled;
  }

  // --- Bewegung & Animation ---
  // start() {
  //   this.stop();
  //   this.moveInterval = setInterval(() => this.moveLogic(), 1000 / 60);
  //   this.animationInterval = setInterval(() => this.animationLogic(), 100);
  // }
  start() {
  this.stop();

  this.moveInterval = setInterval(() => {
    if (this.world?.keyboard?.RIGHT && this.x < this.world.level.level_end_x) {
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

    // ✅ DIREKTER WURF — ohne Delay über World.run()
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


  moveLogic() {
    if (this.world?.keyboard?.RIGHT && this.x < this.world.level.level_end_x) {
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

    if (this.world) this.world.camera_x = -this.x + 100;
  }

  animationLogic() {
    if (this.energy <= 0) {
      this.playAnimation(this.IMAGES_DEAD);
      return;
    }

    if (this.isHurtTimer) {
      this.playAnimation(this.IMAGES_HURT);
      return;
    }

    if (this.isAboveGround()) this.playAnimation(this.IMAGES_JUMPING);
    else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)
      this.playAnimation(this.IMAGES_WALKING);
    else this.playAnimation(this.IMAGES_IDLE);
  }

  // --- Treffer / Schaden ---
  // hit() {
  //   if (this.energy <= 0 || this.isDead || this.isHurtTimer) return;

  //   this.energy = Math.max(this.energy - 10, 0);
  //   this.world?.statusBar?.setPercentage(this.energy);

  //   // Hurt aktivieren
  //   this.isHurtTimer = true;
  //   setTimeout(() => (this.isHurtTimer = false), 800);

  //   // Sound abspielen
  //   if (soundEnabled && this.hurtSound) {
  //     this.hurtSound.currentTime = 0;
  //     this.hurtSound.play().catch(() => {});
  //   }

  //   // Prüfen ob tot
  //   if (this.energy <= 0) this.die();
  // }
  hit() {
    if (this.energy <= 0 || this.isDead) return;

    this.energy -= 10;
    this.energy = Math.max(this.energy, 0);
    this.world?.statusBar?.setPercentage(this.energy);

    // 🔊 Hurt-Animation & Sound
    this.playAnimation(this.IMAGES_HURT);
    if (soundEnabled && this.hurtSound) {
      this.hurtSound.currentTime = 0;
      this.hurtSound.play().catch(() => {});
    }

    // 🔁 Kleine Hurt-Animation-Zeit (optisch besser sichtbar)
    this.isHurtTimer = true;
    setTimeout(() => (this.isHurtTimer = false), 700);

    // 💀 Wenn Energie leer → Game Over
    if (this.energy <= 0 && !this.world.playerDied) {
      this.isDead = true;
      this.world.playerDied = true;
      this.world.stopGameLoopHard();
      this.world.showGameOverScreen();
    }
  }

  die() {
    this.isDead = true;
    this.energy = 0;
    this.playAnimation(this.IMAGES_DEAD);

    if (this.world && !this.world.playerDied) {
      this.world.playerDied = true;
      this.world.stopGameLoopHard();
      this.world.showGameOverScreen();
    }
  }

  // --- Aktionen ---
  jump() {
    super.jump();
    if (soundEnabled) {
      this.jumpSound.currentTime = 0;
      this.jumpSound.play().catch(() => {});
    }
  }

  collectCoin() {
    if (this.world.statusBarCoin.availableCoins < 5) {
      this.world.statusBarCoin.availableCoins++;
      this.world.statusBarCoin.update();
      if (soundEnabled) {
        this.coinSound.currentTime = 0;
        this.coinSound.play().catch(() => {});
      }
    }
  }

  collectBottle() {
    if (this.world.statusBarBottle.availableBottles < 5) {
      this.world.statusBarBottle.availableBottles++;
      this.world.statusBarBottle.update();
      this.world.collectableBottles = this.world.collectableBottles.filter(
        (b) => !this.isColliding(b)
      );
      this.world.spawnNewBottle();
    }
  }

  stop() {
    clearInterval(this.moveInterval);
    clearInterval(this.animationInterval);
  }
}
