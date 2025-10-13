class EndbossLevel1 extends MovableObject {
  y = 240;
  width = 200;
  height = 200;
  alertDistance = 400;
  speed = 0.5;
  aggroSpeed = 1.5;
  isAggressive = false;
  attackMode = false;
  isScreaming = false;

  IMAGES_ALERT = this.makeImgList("img/4_enemie_boss_chicken/2_alert/", 5, 12);
  IMAGES_ATTACK = this.makeImgList(
    "img/4_enemie_boss_chicken/3_attack/",
    13,
    20
  );
  IMAGES_HURT = this.makeImgList("img/4_enemie_boss_chicken/4_hurt/", 21, 23);
  IMAGES_DEAD = this.makeImgList("img/4_enemie_boss_chicken/5_dead/", 24, 26);

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

  /** 🔹 Hilfsfunktionen zum Laden von Bildern und Sounds */
  makeImgList(base, start, end) {
    return Array.from(
      { length: end - start + 1 },
      (_, i) => `${base}G${start + i}.png`
    );
  }

  loadAllImages() {
    [
      this.IMAGES_ALERT,
      this.IMAGES_ATTACK,
      this.IMAGES_HURT,
      this.IMAGES_DEAD,
    ].forEach((imgs) => this.loadImages(imgs));
  }

  initSound(src, volume = 0.6) {
    const sound = new Audio(src);
    sound.volume = volume;
    sound.loop = false;
    sound.muted = !soundEnabled;
    return sound;
  }

  /** 🔊 Verhalten & Kampf-Logik */
  scream() {
    if (this.isDead() || !soundEnabled || !this.screamSound.paused) return;
    this.isScreaming = true;
    this.screamSound.currentTime = 0;
    this.screamSound
      .play()
      .catch((e) => console.warn("Konnte Schrei nicht abspielen:", e));
    setTimeout(() => (this.isScreaming = false), 1500);
  }

  hit() {
    if (this.isDead()) return;

    this.energy = Math.max(this.energy - 20, 0);
    this.statusBar.setPercentage(this.energy);

    if (!this.isAggressive) {
      this.isAggressive = true;
      this.attackMode = true;
    }
    if (this.energy > 0) this.scream();
    else this.die();
  }

  die() {
    this.playAnimation(this.IMAGES_DEAD);
    clearInterval(this.bossAnimationInterval);
    clearInterval(this.bossMoveInterval);
    this.stopScreamSound();
  }

  stopScreamSound() {
    try {
      if (this.screamSound) {
        this.screamSound.pause();
        this.screamSound.currentTime = 0;
      }
    } catch (e) {
      console.warn("Fehler beim Stoppen des Boss-Schreis:", e);
    }
  }

  isDead() {
    return this.energy <= 0;
  }

  /** 🎞️ Animation & Bewegung */
  animate() {
    this.bossAnimationInterval = setInterval(() => {
      if (this.isDead()) this.playAnimation(this.IMAGES_DEAD);
      else if (this.energy < 40) this.playAnimation(this.IMAGES_HURT);
      else if (this.attackMode) this.playAnimation(this.IMAGES_ATTACK);
      else this.playAnimation(this.IMAGES_ALERT);
    }, 200);
  }

  moveLogic() {
    this.bossMoveInterval = setInterval(() => {
      if (this.isDead() || !this.world?.character) return;
      const player = this.world.character;
      const distance = Math.abs(this.x - player.x);
      this.alertDistanceMethod(distance, player);
    }, 1000 / 60);
  }

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
}
