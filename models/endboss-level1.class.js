class EndbossLevel1 extends MovableObject {
  y = 240;
  width = 200;
  height = 200;

  //IMAGES_ATTACK = Array.from({ length: 5 }, (_, i) => `img/endboss2/Attack${i + 1}.png`);
  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  // alertDistance = 300; // wie nah der Spieler sein muss
  // attackMode = false;
  alertDistance = 400; // wie nah der Spieler sein muss, damit Boss reagiert
  speed = 1; // normale Geschwindigkeit
  aggroSpeed = 3; // Geschwindigkeit wenn getroffen
  isAggressive = false; // wird true wenn er getroffen wird
  attackMode = false;

  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 2000;
    this.energy = 100;
    this.statusBar = new StatusBarEnemy(this);
    //this.character = character;
    this.animate();
    //this.startAttackCycle();
  }

  // hit() {
  //   if (this.isDead()) return;

  //   this.energy -= 20;
  //   this.energy = Math.max(this.energy, 0);
  //   this.statusBar.setPercentage(this.energy);

  //   if (this.isDead()) {
  //     this.die();
  //   }
  // }
  //   hit() {
  //   if (this.isDead()) return;

  //   this.energy -= 20;
  //   this.energy = Math.max(this.energy, 0);
  //   this.statusBar.setPercentage(this.energy);

  //   // 👉 Aggressiv machen
  //   this.isAggressive = true;

  //   if (this.isDead()) {
  //     this.die();
  //   }
  // }
  hit() {
  if (this.isDead()) return;

  this.energy -= 20;
  this.energy = Math.max(this.energy, 0);
  this.statusBar.setPercentage(this.energy);

  // 👉 Sofort aggressiv werden
  if (!this.isAggressive) {
    this.isAggressive = true;
    this.attackMode = true; // Animation sofort wechseln
  }

  if (this.isDead()) {
    this.die();
  }
}


  // die() {
  //   this.playAnimation(this.IMAGES_DEAD);
  //   clearInterval(this.bossAnimationInterval);
  //   // optional: removeFromWorld(), explosion etc.
  // }
    die() {
    this.playAnimation(this.IMAGES_DEAD);
    clearInterval(this.bossAnimationInterval);
    clearInterval(this.bossMoveInterval);
  }

  isDead() {
    return this.energy <= 0;
  }

  // animate() {
  //   setInterval(() => {
  //     this.playAnimation(this.IMAGES_ALERT);
  //   }, 200);
  // }

  // animate() {
  //   this.bossAnimationInterval = setInterval(() => {
  //     if (this.isDead()) {
  //       this.playAnimation(this.IMAGES_DEAD);
  //       clearInterval(this.bossAnimationInterval); // Stoppe weitere Animationen
  //     } else if (this.energy < 40) {
  //       this.playAnimation(this.IMAGES_HURT);
  //     } else if (this.isAttacking) {
  //       this.playAnimation(this.IMAGES_ATTACK);
  //     } else {
  //       this.playAnimation(this.IMAGES_ALERT);
  //     }
  //   }, 200);
  // }
    animate() {
    this.bossAnimationInterval = setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.energy < 40) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.attackMode) {
        this.playAnimation(this.IMAGES_ATTACK);
      } else {
        this.playAnimation(this.IMAGES_ALERT);
      }
    }, 200);
  }

  //   moveLogic() {
  //   this.bossMoveInterval = setInterval(() => {
  //     if (this.isDead() || !this.world?.character) return;

  //     const player = this.world.character;

  //     // Abstand zum Spieler berechnen
  //     const distance = Math.abs(this.x - player.x);

  //     if (distance < this.alertDistance) {
  //       // Boss bewegt sich auf den Spieler zu
  //       this.attackMode = true;
  //       const speed = this.isAggressive ? this.aggroSpeed : this.speed;

  //       if (this.x > player.x) {
  //         this.x -= speed;  // nach links laufen
  //       } else {
  //         this.x += speed;  // nach rechts laufen
  //       }
  //     } else {
  //       this.attackMode = false;
  //     }
  //   }, 1000 / 60); // 60 FPS Bewegung
  // }
  moveLogic() {
  this.bossMoveInterval = setInterval(() => {
    if (this.isDead() || !this.world?.character) return;

    const player = this.world.character;
    const distance = Math.abs(this.x - player.x);

    if (distance < this.alertDistance) {
      // sofort in Angriffsmodus
      this.attackMode = true;
      this.isAggressive = true; 

      const speed = this.isAggressive ? this.aggroSpeed : this.speed;
      if (this.x > player.x) {
        this.x -= speed;
      } else {
        this.x += speed;
      }
    } else {
      this.attackMode = false;
    }
  }, 1000 / 60);
}

  // animate() {
  //   setInterval(() => {
  //     const distance = this.x - this.character.x;

  //     if (distance < this.alertDistance && !this.isDead()) {
  //       this.attackMode = true;
  //     }

  //     if (this.attackMode) {
  //       this.playAnimation(this.IMAGES_ATTACK);
  //       this.moveTowardsPlayer();
  //     } else {
  //       this.playAnimation(this.IMAGES_ALERT);
  //     }
  //   }, 150);
  // }

  // moveTowardsPlayer() {
  //   if (this.x > this.character.x + 50) {
  //     this.x -= 2; // läuft zum Spieler
  //   }
  // }

  // startAttackCycle() {
  //   setInterval(() => {
  //     this.isAttacking = true;
  //     setTimeout(() => (this.isAttacking = false), 1000); // Angriff dauert 1 Sekunde
  //   }, 5000); // alle 5 Sekunden Angriff
  // }
}

/*
class EndbossLevel1 extends MovableObject {
  y = 240;
  width = 200;
  height = 200;

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  alertDistance = 300;
  attackMode = false;

  constructor(character) {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 2000;
    this.energy = 100;
    this.statusBar = new StatusBarEnemy(this);
    this.character = character;
    this.animate();
    this.startAttackCycle();
  }

  hit() {
    if (this.isDead()) return;

    this.energy -= 20;
    this.energy = Math.max(this.energy, 0);
    this.statusBar.setPercentage(this.energy);

    if (this.isDead()) {
      this.die();
    }
  }

  die() {
    this.playAnimation(this.IMAGES_DEAD);
    clearInterval(this.bossAnimationInterval);
  }

  isDead() {
    return this.energy <= 0;
  }

  animate() {
    this.bossAnimationInterval = setInterval(() => {
      const distance = this.x - this.character.x;

      if (distance < this.alertDistance && !this.isDead()) {
        this.attackMode = true;
      }

      if (this.attackMode) {
        this.playAnimation(this.IMAGES_ATTACK);
        this.moveTowardsPlayer();

        if (this.isColliding(this.character)) {
          this.character.hit();
        }
      } else {
        this.playAnimation(this.IMAGES_ALERT);
      }
    }, 150);
  }

  moveTowardsPlayer() {
    if (this.x > this.character.x + 50) {
      this.x -= 2;
    }
  }

  startAttackCycle() {
    setInterval(() => {
      this.isAttacking = true;
      setTimeout(() => (this.isAttacking = false), 1000);
    }, 5000);
  }
}*/
