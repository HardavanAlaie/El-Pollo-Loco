class Character extends MovableObject {
  height = 250;
  width = 120;
  y = 185;
  speed = 5;
  energy = 100;
  otherDirection = false;
  isHurtTimer = false;

  IMAGES_WALKING = Array.from({ length: 6 },(_, i) => `img/2_character_pepe/2_walk/W-2${i + 1}.png`);
  IMAGES_IDLE = Array.from({ length: 10 },(_, i) => `img/2_character_pepe/1_idle/idle/I-${i + 1}.png`);
  IMAGES_JUMPING = Array.from({ length: 9 },(_, i) => `img/2_character_pepe/3_jump/J-3${i + 1}.png`);
  IMAGES_HURT = Array.from({ length: 3 },(_, i) => `img/2_character_pepe/4_hurt/H-4${i + 1}.png`);
  IMAGES_DEAD = Array.from({ length: 7 },(_, i) => `img/2_character_pepe/5_dead/D-5${i + 1}.png`);

  constructor(world) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.world = world;

    // 🔹 Assets laden
    [
      this.IMAGES_WALKING,
      this.IMAGES_IDLE,
      this.IMAGES_JUMPING,
      this.IMAGES_HURT,
      this.IMAGES_DEAD,
    ].forEach((arr) => this.loadImages(arr));

    this.applyGravity();
    this.start();

    // 🔊 Sounds
    this.jumpSound = this.initSound("audio/jump.mp3", 0.5);
    this.coinSound = this.initSound("audio/coins.mp3", 0.5);
  }

  /** 🔊 Initialisiert einen Sound mit globalem Mute-Zustand */
  initSound(src, volume = 0.5) {
    const sound = new Audio(src);
    sound.volume = volume;
    sound.muted = !soundEnabled;
    return sound;
  }

  /** 🕹️ Bewegungs- und Animationsschleifen starten */
  start() {
    this.stop();
    this.moveIntervalMethod();
    this.animationIntervalMethod();
  }

  moveIntervalMethod() {
    this.moveInterval = setInterval(() => {
      const kb = this.world?.keyboard;
      if (kb?.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.otherDirection = false;
      }
      if (kb?.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
      }
      if (kb?.UP && !this.isAboveGround()) this.jump();
      if (kb?.D) this.world.throwableBottles();
      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);
  }

  animationIntervalMethod() {
    this.animationInterval = setInterval(() => {
      if (this.energy <= 0) this.playAnimation(this.IMAGES_DEAD);
      else if (this.isHurt()) this.playAnimation(this.IMAGES_HURT);
      else if (this.isAboveGround()) this.playAnimation(this.IMAGES_JUMPING);
      else
        this.playAnimation(
          this.world?.keyboard?.RIGHT || this.world?.keyboard?.LEFT
            ? this.IMAGES_WALKING
            : this.IMAGES_IDLE
        );
    }, 80);
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
    const bar = this.world.statusBarCoin;
    if (bar.availableCoins < 5) {
      bar.availableCoins++;
      bar.update();
      if (soundEnabled) {
        this.coinSound.currentTime = 0;
        this.coinSound.play().catch(() => {});
      }
    }
  }

  collectBottle() {
    const bar = this.world.statusBarBottle;
    if (bar.availableBottles < 5) {
      bar.availableBottles++;
      bar.update();
      this.world.collectableBottles = this.world.collectableBottles.filter(
        (b) => !this.isColliding(b)
      );
      this.world.spawnNewBottle();
    }
  }

  /** 🔉 Spiele beliebigen Sound ab (mit globalem Check) */
  playSound(path) {
    if (!path || !soundEnabled) return;
    const sound = new Audio(path);
    sound.volume = 0.5;
    sound
      .play()
      .catch((e) => console.warn("Sound konnte nicht abgespielt werden:", e));
  }
}
