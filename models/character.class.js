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
        this.throw();
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

  collectCoin() {
    if (this.world.statusBarCoin.availableCoins < 5) {
      this.world.statusBarCoin.availableCoins++;
      this.world.statusBarCoin.update();
    }
  }

  collectBottle() {
    if (this.world.statusBarBottle.availableBottles < 5) {
      this.world.statusBarBottle.availableBottles++;
      this.world.statusBarBottle.update();

      // Flasche entfernen
      this.world.collectableBottles = this.world.collectableBottles.filter(
        (bottle) => !this.isColliding(bottle)
      );

      
      this.world.spawnNewBottle();
    }
  }

  // throw() {
  //   if (this.world.statusBarBottle.availableBottles > 0) {
  //     this.world.statusBarBottle.availableBottles--;
  //     this.world.statusBarBottle.update();

  //     let bottle = new ThrowableObject(
  //       this.x + 30,
  //       this.y + 100,
  //       this.otherDirection
  //     );
  //     this.world.throwableObjects.push(bottle);
  //   }
  // }
}
