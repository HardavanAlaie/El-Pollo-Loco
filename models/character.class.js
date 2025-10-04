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
    this.isDead = false;

    this.jumpSound = new Audio("audio/jump.mp3");
    this.jumpSound.volume = 0.5;
    this.jumpSound.muted = !soundEnabled;

    this.coinSound = new Audio("audio/coins.mp3");
    this.coinSound.volume = 0.5;
    this.coinSound.muted = !soundEnabled;
  }

  start() {
    this.stop();
    this.moveIntervalMethod();
    this.animationIntervalMethod();
  }

  animationIntervalMethod() {
    this.animationInterval = setInterval(() => {
      if (this.energy <= 0) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        if ((this.world && this.world.keyboard.RIGHT) || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING);
        } else {
          this.playAnimation(this.IMAGES_IDLE);
        }
      }
    }, 80);
  }

  moveIntervalMethod() {
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
      if (this.world?.keyboard?.D) {
        this.world.throwableBottles();
      }
      if (this.world) {
        this.world.camera_x = -this.x + 100;
      }
    }, 1000 / 60);
  }

  hit() {
    if (this.energy <= 0 || this.isDead) return;

    this.energy -= 10;
    this.energy = Math.max(this.energy, 0);

    if (this.world?.statusBar) {
      this.world.statusBar.setPercentage(this.energy);
    }
    this.playAnimation(this.IMAGES_HURT);
    this.soundEnabledMethod();
    this.energyMethod();
  }

  energyMethod() {
    if (this.energy <= 0) {
      this.energy = 0;
      this.isDead = true;
      if (this.world && !this.world.playerDied) {
        this.world.playerDied = true;
        this.world.stopGameLoopHard();
        this.world.showGameOverScreen();
      }
    }
  }

  soundEnabledMethod() {
    if (soundEnabled && this.hurtSound) {
      this.hurtSound.currentTime = 0;
      this.hurtSound.play().catch(() => { });
    }
  }

  stop() {
    clearInterval(this.moveInterval);
    clearInterval(this.animationInterval);
  }

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
        (bottle) => !this.isColliding(bottle)
      );
      this.world.spawnNewBottle();
    }
  }

  playSound(path) {
    if (!path || !soundEnabled) return;
    const sound = new Audio(path);
    sound.volume = 0.5;
    sound.play().catch((e) => {
      console.warn("Sound konnte nicht abgespielt werden:", e);
    });
  }
}
