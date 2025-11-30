/**
 * Class: EndbossLevel1
 * Represents the first boss enemy in the game.
 * Becomes aggressive when the player approaches and attacks.
 */
class EndbossLevel1 extends MovableObject {
  y = 240;
  width = 200;
  height = 200;
  alertDistance = 550; 
  speed = 0.5;         
  aggroSpeed = 2.1;    
  isAggressive = false; 
  attackMode = false;   
  isScreaming = false;  
  damageCooldownMs = 250;   
  _lastDamageAt = 0;

  IMAGES_ALERT = this.makeImgList("img/4_enemie_boss_chicken/2_alert/", 5, 12);
  IMAGES_ATTACK = this.makeImgList("img/4_enemie_boss_chicken/3_attack/", 13, 20);
  IMAGES_HURT = this.makeImgList("img/4_enemie_boss_chicken/4_hurt/", 21, 23);
  IMAGES_DEAD = this.makeImgList("img/4_enemie_boss_chicken/5_dead/", 24, 26);

  /**
   * Constructor: initializes boss position, energy, sounds, and animations.
   */
  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadAllImages();
    this.x = 2000; 
    this.energy = 100;
    this.statusBar = new StatusBarEnemy(this);
    this.screamSound = this.initSound("audio/chicken.mp3", 0.6);
    this.animate();
    this.moveLogic();
  }

  /**
   * Utility: creates a list of image paths between given index range.
   */
  makeImgList(base, start, end) {
    return Array.from({ length: end - start + 1 }, (_, i) => `${base}G${start + i}.png`);
  }

  /**
   * Loads all animation image sets.
   */
  loadAllImages() {
    [this.IMAGES_ALERT, this.IMAGES_ATTACK, this.IMAGES_HURT, this.IMAGES_DEAD].forEach((imgs) =>
      this.loadImages(imgs)
    );
  }

  /**
   * Initializes an audio object for boss sounds.
   */
  initSound(src, volume = 0.6) {
    const sound = new Audio(src);
    sound.volume = volume;
    sound.loop = false;
    sound.muted = !soundEnabled;
    return sound;
  }

  /**
   * Plays a scream sound if not already playing.
   */
  scream() {
    if (this.world?.levelEnded || this.world?._gameOverPlayed || this.world?._winShown) return;
    if (this.isDead() || !soundEnabled || !this.screamSound.paused) return;
    this.isScreaming = true;
    this.screamSound.currentTime = 0;
    this.screamSound.play().catch((e) => console.warn("Failed to play scream:", e));
    setTimeout(() => (this.isScreaming = false), 1500);
  }

  /**
   * Handles the boss death animation and logic stop.
   */
  // die() {
  //   // this.playAnimation(this.IMAGES_DEAD);
  //   // clearInterval(this.bossAnimationInterval);
  //   clearInterval(this.bossMoveInterval);
  //   this.stopScreamSound();
  //   this.deathTime = Date.now();
  // }
  die() {
  this.playAnimation(this.IMAGES_DEAD);
  clearInterval(this.bossAnimationInterval);
  clearInterval(this.bossMoveInterval);
  this.stopScreamSound();
}


  /**
   * Stops any playing scream sound.
   */
  stopScreamSound() {
    try {
      if (this.screamSound) {
        this.screamSound.pause();
        this.screamSound.currentTime = 0;
      }
    } catch (e) {
      console.warn("Error stopping scream sound:", e);
    }
  }

  /**
   * Returns true if the boss has no remaining energy.
   */
  isDead() {
    return this.energy <= 0;
  }

  /**
   * Controls which animation to play depending on current state.
   */
  animate() {
    this.bossAnimationInterval = setInterval(() => {
      if (this.isDead()) this.playAnimation(this.IMAGES_DEAD);
      else if (this.energy < 40) this.playAnimation(this.IMAGES_HURT);
      else if (this.attackMode) this.playAnimation(this.IMAGES_ATTACK);
      else this.playAnimation(this.IMAGES_ALERT);
    }, 200);
  }

  /**
   * Movement logic that checks distance to player and reacts.
   */
  moveLogic() {
    this.bossMoveInterval = setInterval(() => {
      if (this.isDead() || !this.world?.character) return;
      const player = this.world.character;
      const distance = Math.abs(this.x - player.x);
      this.alertDistanceMethod(distance, player);
    }, 1000 / 60);
  }

  /**
   * If player is close, move toward them and play aggressive behavior.
   */
  alertDistanceMethod(distance, player) {
    if (distance < this.alertDistance) {
      this.scream();
      this.attackMode = this.isAggressive = true;
      const v = this.isAggressive ? this.aggroSpeed : this.speed;
      this.x += this.x > player.x ? -v : v;
      this.otherDirection = this.x < player.x;
    } else {
      this.attackMode = false;
    }
  }

    /**
   * Apply a single packet of damage (default 20) with cooldown.
   * Keeps existing .hit() behavior intact (hit() calls this).
   */
  takeDamage(amount = 20) {
    if (this.isDead()) return;
    const now = Date.now();
    if (now - this._lastDamageAt < this.damageCooldownMs) return; 
    this._lastDamageAt = now;
    this.energy = Math.max(0, this.energy - amount);
    this.statusBar?.setPercentage?.(this.energy);
    if (!this.isAggressive) {
      this.isAggressive = true;
      this.attackMode = true;
    }
    if (this.energy > 0) this.scream();
    else this.die();
  }
  
  hit() {
    this.takeDamage(20);
  }
}
