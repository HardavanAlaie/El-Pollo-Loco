class Character extends MovableObject {
  height = 250;
  width = 120;
  y = 185;
  speed = 5;
  energy = 100;
  otherDirection = false;
  isHurtTimer = false;
  lastActionTime = Date.now();

  IMAGES_WALKING = Array.from({ length: 6 },(_, i) => `img/2_character_pepe/2_walk/W-2${i + 1}.png`);
  IMAGES_IDLE = Array.from({ length: 10 },(_, i) => `img/2_character_pepe/1_idle/idle/I-${i + 1}.png`);
  IMAGES_LONG_IDLE = Array.from({ length: 10 },(_, i) => `img/2_character_pepe/1_idle/long_idle/I-1-${i + 1}.png`);
  IMAGES_JUMPING = Array.from({ length: 9 },(_, i) => `img/2_character_pepe/3_jump/J-3${i + 1}.png`);
  IMAGES_HURT = Array.from({ length: 3 },(_, i) => `img/2_character_pepe/4_hurt/H-4${i + 1}.png`);
  IMAGES_DEAD = Array.from({ length: 7 },(_, i) => `img/2_character_pepe/5_dead/D-5${i + 1}.png`);

  /**
   * Creates an instance of the character and initializes its assets, sounds, and physics.
   * 
   * @param {World} world - The game world instance to which the character belongs.
   *
   * @constructor
   */
  constructor(world) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.world = world;
    [
      this.IMAGES_WALKING,
      this.IMAGES_IDLE,
      this.IMAGES_LONG_IDLE,
      this.IMAGES_JUMPING,
      this.IMAGES_HURT,
      this.IMAGES_DEAD,
    ].forEach((arr) => this.loadImages(arr));
    this.applyGravity();
    this.start();
    this.jumpSound = this.initSound("audio/jump.mp3", 0.5);
    this.coinSound = this.initSound("audio/coins.mp3", 0.5);
  }

  
  /**
   * Initializes and returns an Audio object with the specified source and volume.
   *
   * @param {string} src - The source URL of the audio file.
   * @param {number} [volume=0.5] - The volume level of the audio (between 0.0 and 1.0).
   * @returns {HTMLAudioElement} The initialized Audio object.
   */
  initSound(src, volume = 0.5) {
    const sound = new Audio(src);
    sound.volume = volume;
    sound.muted = !soundEnabled;
    return sound;
  }

  /**
   * Starts the character's movement and animation by initializing the necessary intervals.
   * Stops any existing intervals before starting new ones to prevent duplicates.
   */
  start() {
    this.stop();
    this.moveIntervalMethod();
    this.animationIntervalMethod();
  }

  /**
   * Starts an interval that continuously checks keyboard input to control character movement and actions.
   * - Moves the character right or left based on arrow key input, within level boundaries.
   * - Initiates a jump if the up arrow is pressed and the character is on the ground.
   * - Throws a bottle if the 'D' key is pressed.
   * - Updates the camera position to follow the character.
   * The interval runs at 60 frames per second.
   */
  // moveIntervalMethod() {
  //   this.moveInterval = setInterval(() => {
  //     const kb = this.world?.keyboard;
  //     if (kb?.RIGHT && this.x < this.world.level.level_end_x) {
  //       this.moveRight();
  //       this.otherDirection = false;
  //     }
  //     if (kb?.LEFT && this.x > 0) {
  //       this.moveLeft();
  //       this.otherDirection = true;
  //     }
  //     if (kb?.UP && !this.isAboveGround()) this.jump();
  //     if (kb?.D) this.world.throwableBottles();
  //     this.world.camera_x = -this.x + 100;
  //   }, 1000 / 60);
  // }
  moveIntervalMethod() {
  this.moveInterval = setInterval(() => {
    const kb = this.world?.keyboard;
    let didAction = false;

    if (kb?.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      didAction = true;
    }

    if (kb?.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      didAction = true;
    }

    if (kb?.UP && !this.isAboveGround()) {
      this.jump();
      didAction = true;
    }

    if (kb?.D) {
      this.world.throwableBottles();
      didAction = true;
    }

    // 👉 Wenn irgendwas passiert ist, oder er gerade in der Luft / verletzt ist,
    //    gilt das als "aktiv"
    if (didAction || this.isAboveGround() || this.isHurt()) {
      this.lastActionTime = Date.now();
    }

    this.world.camera_x = -this.x + 100;
  }, 1000 / 60);
}


  /**
   * Starts an interval that updates the character's animation based on its current state.
   * The animation changes depending on whether the character is dead, hurt, jumping, walking, or idle.
   * The interval runs every 80 milliseconds.
   *
   * @method
   * @returns {void}
   */
  // animationIntervalMethod() {
  //   this.animationInterval = setInterval(() => {
  //     if (this.energy <= 0) this.playAnimation(this.IMAGES_DEAD);
  //     else if (this.isHurt()) this.playAnimation(this.IMAGES_HURT);
  //     else if (this.isAboveGround()) this.playAnimation(this.IMAGES_JUMPING);
  //     else
  //       this.playAnimation(
  //         this.world?.keyboard?.RIGHT || this.world?.keyboard?.LEFT
  //           ? this.IMAGES_WALKING
  //           : this.IMAGES_IDLE
  //       );
  //   }, 80);
  // }
//   animationIntervalMethod() {
//   this.animationInterval = setInterval(() => {
//     if (this.energy <= 0) {
//       this.playAnimation(this.IMAGES_DEAD);
//     } else if (this.isHurt()) {
//       this.playAnimation(this.IMAGES_HURT);
//     } 
//     // 🔽 Nur beim Hochspringen Jump-Animation
//     else if (this.isAboveGround() && this.speedY > 0) {
//       this.playAnimation(this.IMAGES_JUMPING);
//     } else {
//       // ⬅️/➡️ gedrückt → laufen, sonst idle
//       const kb = this.world?.keyboard;
//       const isMoving = kb?.RIGHT || kb?.LEFT;
//       this.playAnimation(isMoving ? this.IMAGES_WALKING : this.IMAGES_IDLE);
//     }
//   }, 80);
// }
animationIntervalMethod() {
  this.animationInterval = setInterval(() => {
    const now = Date.now();
    const inactiveMs = now - this.lastActionTime; // wie lange schon nichts gemacht?

    const kb = this.world?.keyboard;
    const isMoving = kb?.RIGHT || kb?.LEFT;

    if (this.energy <= 0) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
      // ganz normal: solange er in der Luft ist → Jump-Animation
      this.playAnimation(this.IMAGES_JUMPING);
    } else if (isMoving) {
      // läuft
      this.playAnimation(this.IMAGES_WALKING);
    } else if (inactiveMs >= 30000) {
      // 60 Sekunden nichts gemacht → Long Idle
      this.playAnimation(this.IMAGES_LONG_IDLE);
    } else if (inactiveMs >= 10000) {
      // 5 Sekunden nichts gemacht → normale Idle-Animation
      this.playAnimation(this.IMAGES_IDLE);
    } else {
      // < 5 Sekunden still: neutrales Standbild (erste Idle-Grafik)
      this.img = this.imageCache[this.IMAGES_IDLE[0]];
    }
  }, 80);
}



  /**
   * Stops the character's movement and animation by clearing their respective intervals.
   * This method should be called to halt any ongoing actions performed by the character.
   */
  stop() {
    clearInterval(this.moveInterval);
    clearInterval(this.animationInterval);
  }

  /**
   * Makes the character jump by calling the parent class's jump method.
   * If sound is enabled, plays the jump sound effect from the beginning.
   * Handles any errors from playing the sound silently.
   */
  jump() {
    super.jump();
    if (soundEnabled) {
      this.jumpSound.currentTime = 0;
      this.jumpSound.play().catch(() => {});
    }
  }

  /**
   * Increases the coin count in the status bar by one, up to a maximum of 5.
   * Updates the coin status bar and plays a coin collection sound if sound is enabled.
   *
   * @method
   */
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

  /**
   * Handles the collection of a bottle by the character.
   * Increments the available bottles in the status bar if less than 5,
   * updates the status bar, removes the collected bottle from the world,
   * and spawns a new bottle.
   */
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

  /**
   * Plays a sound from the specified file path if sound is enabled.
   * 
   * @param {string} path - The path to the audio file to play.
   * @returns {void}
   */
  playSound(path) {
    if (!path || !soundEnabled) return;
    const sound = new Audio(path);
    sound.volume = 0.5;
    sound
      .play()
      .catch((e) => console.warn("Sound konnte nicht abgespielt werden:", e));
  }
}
