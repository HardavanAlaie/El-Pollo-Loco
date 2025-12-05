class Character extends MovableObject {
  height = 250;
  width = 120;
  y = 185;
  speed = 5;
  energy = 100;
  otherDirection = false;
  isHurtTimer = false;
  lastActionTime = Date.now();
  MAX_BOTTLES = 5;

  IMAGES_WALKING = Array.from(
    { length: 6 },
    (_, i) => `img/2_character_pepe/2_walk/W-2${i + 1}.png`
  );
  IMAGES_IDLE = Array.from(
    { length: 10 },
    (_, i) => `img/2_character_pepe/1_idle/idle/I-${i + 1}.png`
  );
  IMAGES_LONG_IDLE = Array.from(
    { length: 10 },
    (_, i) => `img/2_character_pepe/1_idle/long_idle/I-${i + 11}.png`
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
  moveIntervalMethod() {
    this.moveInterval = setInterval(() => {
      const kb = this.world?.keyboard;
      let didAction = false;
      didAction = this.rightMethod(kb, didAction);
      didAction = this.leftMethod(kb, didAction);
      didAction = this.upMethod(kb, didAction);
      didAction = this.dMethod(kb, didAction);
      if (didAction || this.isAboveGround() || this.isHurt()) {
        this.lastActionTime = Date.now();
      }
      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);
  }

  dMethod(kb, didAction) {
    if (kb?.D) {
      //this.world.throwableBottles();
      this.world.collisionManager?.throwableBottles?.();
      didAction = true;
    }
    return didAction;
  }

  upMethod(kb, didAction) {
    if (kb?.UP && !this.isAboveGround() && this.speedY === 0) {
      this.jump();
      didAction = true;
    }
    return didAction;
  }

  leftMethod(kb, didAction) {
    if (kb?.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      didAction = true;
    }
    return didAction;
  }

  rightMethod(kb, didAction) {
    if (kb?.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      didAction = true;
    }
    return didAction;
  }

  /**
   * Starts an interval that updates the character's animation based on its current state.
   * The animation changes depending on whether the character is dead, hurt, jumping, walking, or idle.
   * The interval runs every 80 milliseconds.
   *
   * @method
   * @returns {void}
   */
  animationIntervalMethod() {
    this.animationInterval = setInterval(() => {
      const { isMoving, inactiveMs } = this.animationIntervalConstsMethod();
      if (this.energy <= 0) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else if (isMoving) {
        this.playAnimation(this.IMAGES_WALKING);
      } else if (inactiveMs >= 15000) {
        this.playAnimation(this.IMAGES_LONG_IDLE);
      } else if (inactiveMs >= 10000) {
        this.playAnimation(this.IMAGES_IDLE);
      } else {
        this.img = this.imageCache[this.IMAGES_IDLE[0]];
      }
    }, 80);
  }

 /**
 * ------------------------------------------------------------
 * Provides animation-related state values such as whether
 * the character is moving and how long it has been inactive.
 *
 * @function animationIntervalConstsMethod
 * @returns {{ isMoving: boolean, inactiveMs: number }}
 * ------------------------------------------------------------
 */
  animationIntervalConstsMethod() {
    const now = Date.now();
    const inactiveMs = now - this.lastActionTime;
    const kb = this.world?.keyboard;
    const isMoving = kb?.RIGHT || kb?.LEFT;
    return { isMoving, inactiveMs };
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
    const world = this.world;
    if (!world) return;
    const bar = world.statusBarBottle;
    const bottles = world.collectableBottles;
    if (!bar || !Array.isArray(bottles) || bottles.length === 0) return;
    if (bar.availableBottles >= this.MAX_BOTTLES) {
      world.showBottleLimitMessage?.();
      return;
    }
    this.collectableBottlesMethod(world, bottles, bar);
  }

 /**
 * ------------------------------------------------------------
 * Handles bottle collection logic by checking collisions,
 * updating the bottle counter, and removing or keeping bottles
 * depending on available inventory capacity.
 *
 * @function collectableBottlesMethod
 * @param {object} world - The current game world instance.
 * @param {Array} bottles - Array of bottle objects to check.
 * @param {object} bar - The bottle status bar object.
 * ------------------------------------------------------------
 */
  collectableBottlesMethod(world, bottles, bar) {
    world.collectableBottles = bottles.filter((bottle) => {
      const collides = this.isTouchingBottle(bottle);
      if (!collides) return true;
      if (bar.availableBottles < this.MAX_BOTTLES) {
        bar.availableBottles++;
        bar.update?.();
        world.spawnNewBottle?.();
        return false;
      }
      world.showBottleLimitMessage?.();
      return true;
    });
  }

/**
 * ------------------------------------------------------------
 * Performs a precise collision check between the character
 * and a bottle by using inset boundaries and a small vertical
 * tolerance to detect collection proximity.
 *
 * @function isTouchingBottle
 * @param {object} bottle - The bottle object to test against.
 * @returns {boolean}
 * ------------------------------------------------------------
 */
  isTouchingBottle(bottle) {
    const insetXChar = 15; 
    const insetXBottle = 13; 
    const charLeft = this.x + insetXChar;
    const charRight = this.x + this.width - insetXChar;
    const bottleLeft = bottle.x + insetXBottle;
    const bottleRight = bottle.x + bottle.width - insetXBottle;
    const horizontalOverlap = charRight > bottleLeft && charLeft < bottleRight;
    const charBottom = this.y + this.height;
    const bottleTop = bottle.y;
    const bottleBottom = bottle.y + bottle.height;
    const verticalMargin = 2;
    const verticallyOnBottle = charBottom >= bottleTop && charBottom <= bottleBottom + verticalMargin;
    return horizontalOverlap && verticallyOnBottle;
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
