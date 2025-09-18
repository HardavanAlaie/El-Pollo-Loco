// class EndbossLevel1 extends MovableObject {
//   y = 240;
//   width = 200;
//   height = 200;

//   //IMAGES_ATTACK = Array.from({ length: 5 }, (_, i) => `img/endboss2/Attack${i + 1}.png`);
//   IMAGES_ALERT = [
//     "img/4_enemie_boss_chicken/2_alert/G5.png",
//     "img/4_enemie_boss_chicken/2_alert/G6.png",
//     "img/4_enemie_boss_chicken/2_alert/G7.png",
//     "img/4_enemie_boss_chicken/2_alert/G8.png",
//     "img/4_enemie_boss_chicken/2_alert/G9.png",
//     "img/4_enemie_boss_chicken/2_alert/G10.png",
//     "img/4_enemie_boss_chicken/2_alert/G11.png",
//     "img/4_enemie_boss_chicken/2_alert/G12.png",
//   ];

//   IMAGES_ATTACK = [
//     "img/4_enemie_boss_chicken/3_attack/G13.png",
//     "img/4_enemie_boss_chicken/3_attack/G14.png",
//     "img/4_enemie_boss_chicken/3_attack/G15.png",
//     "img/4_enemie_boss_chicken/3_attack/G16.png",
//     "img/4_enemie_boss_chicken/3_attack/G17.png",
//     "img/4_enemie_boss_chicken/3_attack/G18.png",
//     "img/4_enemie_boss_chicken/3_attack/G19.png",
//     "img/4_enemie_boss_chicken/3_attack/G20.png",
//   ];

//   IMAGES_HURT = [
//     "img/4_enemie_boss_chicken/4_hurt/G21.png",
//     "img/4_enemie_boss_chicken/4_hurt/G22.png",
//     "img/4_enemie_boss_chicken/4_hurt/G23.png",
//   ];

//   IMAGES_DEAD = [
//     "img/4_enemie_boss_chicken/5_dead/G24.png",
//     "img/4_enemie_boss_chicken/5_dead/G25.png",
//     "img/4_enemie_boss_chicken/5_dead/G26.png",
//   ];

//   // alertDistance = 300; // wie nah der Spieler sein muss
//   // attackMode = false;
//   alertDistance = 400; // wie nah der Spieler sein muss, damit Boss reagiert
//   speed = 1; // normale Geschwindigkeit
//   aggroSpeed = 3; // Geschwindigkeit wenn getroffen
//   isAggressive = false; // wird true wenn er getroffen wird
//   attackMode = false;

//   constructor() {
//     super().loadImage(this.IMAGES_ALERT[0]);
//     this.loadImages(this.IMAGES_ALERT);
//     this.loadImages(this.IMAGES_ATTACK);
//     this.loadImages(this.IMAGES_HURT);
//     this.loadImages(this.IMAGES_DEAD);

//     this.x = 2000;
//     this.energy = 100;
//     this.statusBar = new StatusBarEnemy(this);
//     //this.character = character;
//     this.animate();
//     //this.startAttackCycle();
//   }

//   // hit() {
//   //   if (this.isDead()) return;

//   //   this.energy -= 20;
//   //   this.energy = Math.max(this.energy, 0);
//   //   this.statusBar.setPercentage(this.energy);

//   //   if (this.isDead()) {
//   //     this.die();
//   //   }
//   // }
//   //   hit() {
//   //   if (this.isDead()) return;

//   //   this.energy -= 20;
//   //   this.energy = Math.max(this.energy, 0);
//   //   this.statusBar.setPercentage(this.energy);

//   //   // 👉 Aggressiv machen
//   //   this.isAggressive = true;

//   //   if (this.isDead()) {
//   //     this.die();
//   //   }
//   // }
//   hit() {
//   if (this.isDead()) return;

//   this.energy -= 20;
//   this.energy = Math.max(this.energy, 0);
//   this.statusBar.setPercentage(this.energy);

//   // 👉 Sofort aggressiv werden
//   if (!this.isAggressive) {
//     this.isAggressive = true;
//     this.attackMode = true; // Animation sofort wechseln
//   }

//   if (this.isDead()) {
//     this.die();
//   }
// }

//   // die() {
//   //   this.playAnimation(this.IMAGES_DEAD);
//   //   clearInterval(this.bossAnimationInterval);
//   //   // optional: removeFromWorld(), explosion etc.
//   // }
//     die() {
//     this.playAnimation(this.IMAGES_DEAD);
//     clearInterval(this.bossAnimationInterval);
//     clearInterval(this.bossMoveInterval);
//   }

//   isDead() {
//     return this.energy <= 0;
//   }

//   // animate() {
//   //   setInterval(() => {
//   //     this.playAnimation(this.IMAGES_ALERT);
//   //   }, 200);
//   // }

//   // animate() {
//   //   this.bossAnimationInterval = setInterval(() => {
//   //     if (this.isDead()) {
//   //       this.playAnimation(this.IMAGES_DEAD);
//   //       clearInterval(this.bossAnimationInterval); // Stoppe weitere Animationen
//   //     } else if (this.energy < 40) {
//   //       this.playAnimation(this.IMAGES_HURT);
//   //     } else if (this.isAttacking) {
//   //       this.playAnimation(this.IMAGES_ATTACK);
//   //     } else {
//   //       this.playAnimation(this.IMAGES_ALERT);
//   //     }
//   //   }, 200);
//   // }
//     animate() {
//     this.bossAnimationInterval = setInterval(() => {
//       if (this.isDead()) {
//         this.playAnimation(this.IMAGES_DEAD);
//       } else if (this.energy < 40) {
//         this.playAnimation(this.IMAGES_HURT);
//       } else if (this.attackMode) {
//         this.playAnimation(this.IMAGES_ATTACK);
//       } else {
//         this.playAnimation(this.IMAGES_ALERT);
//       }
//     }, 200);
//   }

//   //   moveLogic() {
//   //   this.bossMoveInterval = setInterval(() => {
//   //     if (this.isDead() || !this.world?.character) return;

//   //     const player = this.world.character;

//   //     // Abstand zum Spieler berechnen
//   //     const distance = Math.abs(this.x - player.x);

//   //     if (distance < this.alertDistance) {
//   //       // Boss bewegt sich auf den Spieler zu
//   //       this.attackMode = true;
//   //       const speed = this.isAggressive ? this.aggroSpeed : this.speed;

//   //       if (this.x > player.x) {
//   //         this.x -= speed;  // nach links laufen
//   //       } else {
//   //         this.x += speed;  // nach rechts laufen
//   //       }
//   //     } else {
//   //       this.attackMode = false;
//   //     }
//   //   }, 1000 / 60); // 60 FPS Bewegung
//   // }
//   moveLogic() {
//   this.bossMoveInterval = setInterval(() => {
//     if (this.isDead() || !this.world?.character) return;

//     const player = this.world.character;
//     const distance = Math.abs(this.x - player.x);

//     if (distance < this.alertDistance) {
//       // sofort in Angriffsmodus
//       this.attackMode = true;
//       this.isAggressive = true;

//       const speed = this.isAggressive ? this.aggroSpeed : this.speed;
//       if (this.x > player.x) {
//         this.x -= speed;
//       } else {
//         this.x += speed;
//       }
//     } else {
//       this.attackMode = false;
//     }
//   }, 1000 / 60);
// }

//   // animate() {
//   //   setInterval(() => {
//   //     const distance = this.x - this.character.x;

//   //     if (distance < this.alertDistance && !this.isDead()) {
//   //       this.attackMode = true;
//   //     }

//   //     if (this.attackMode) {
//   //       this.playAnimation(this.IMAGES_ATTACK);
//   //       this.moveTowardsPlayer();
//   //     } else {
//   //       this.playAnimation(this.IMAGES_ALERT);
//   //     }
//   //   }, 150);
//   // }

//   // moveTowardsPlayer() {
//   //   if (this.x > this.character.x + 50) {
//   //     this.x -= 2; // läuft zum Spieler
//   //   }
//   // }

//   // startAttackCycle() {
//   //   setInterval(() => {
//   //     this.isAttacking = true;
//   //     setTimeout(() => (this.isAttacking = false), 1000); // Angriff dauert 1 Sekunde
//   //   }, 5000); // alle 5 Sekunden Angriff
//   // }
// }

// /*
// class EndbossLevel1 extends MovableObject {
//   y = 240;
//   width = 200;
//   height = 200;

//   IMAGES_ALERT = [
//     "img/4_enemie_boss_chicken/2_alert/G5.png",
//     "img/4_enemie_boss_chicken/2_alert/G6.png",
//     "img/4_enemie_boss_chicken/2_alert/G7.png",
//     "img/4_enemie_boss_chicken/2_alert/G8.png",
//     "img/4_enemie_boss_chicken/2_alert/G9.png",
//     "img/4_enemie_boss_chicken/2_alert/G10.png",
//     "img/4_enemie_boss_chicken/2_alert/G11.png",
//     "img/4_enemie_boss_chicken/2_alert/G12.png",
//   ];

//   IMAGES_ATTACK = [
//     "img/4_enemie_boss_chicken/3_attack/G13.png",
//     "img/4_enemie_boss_chicken/3_attack/G14.png",
//     "img/4_enemie_boss_chicken/3_attack/G15.png",
//     "img/4_enemie_boss_chicken/3_attack/G16.png",
//     "img/4_enemie_boss_chicken/3_attack/G17.png",
//     "img/4_enemie_boss_chicken/3_attack/G18.png",
//     "img/4_enemie_boss_chicken/3_attack/G19.png",
//     "img/4_enemie_boss_chicken/3_attack/G20.png",
//   ];

//   IMAGES_HURT = [
//     "img/4_enemie_boss_chicken/4_hurt/G21.png",
//     "img/4_enemie_boss_chicken/4_hurt/G22.png",
//     "img/4_enemie_boss_chicken/4_hurt/G23.png",
//   ];

//   IMAGES_DEAD = [
//     "img/4_enemie_boss_chicken/5_dead/G24.png",
//     "img/4_enemie_boss_chicken/5_dead/G25.png",
//     "img/4_enemie_boss_chicken/5_dead/G26.png",
//   ];

//   alertDistance = 300;
//   attackMode = false;

//   constructor(character) {
//     super().loadImage(this.IMAGES_ALERT[0]);
//     this.loadImages(this.IMAGES_ALERT);
//     this.loadImages(this.IMAGES_ATTACK);
//     this.loadImages(this.IMAGES_HURT);
//     this.loadImages(this.IMAGES_DEAD);

//     this.x = 2000;
//     this.energy = 100;
//     this.statusBar = new StatusBarEnemy(this);
//     this.character = character;
//     this.animate();
//     this.startAttackCycle();
//   }

//   hit() {
//     if (this.isDead()) return;

//     this.energy -= 20;
//     this.energy = Math.max(this.energy, 0);
//     this.statusBar.setPercentage(this.energy);

//     if (this.isDead()) {
//       this.die();
//     }
//   }

//   die() {
//     this.playAnimation(this.IMAGES_DEAD);
//     clearInterval(this.bossAnimationInterval);
//   }

//   isDead() {
//     return this.energy <= 0;
//   }

//   animate() {
//     this.bossAnimationInterval = setInterval(() => {
//       const distance = this.x - this.character.x;

//       if (distance < this.alertDistance && !this.isDead()) {
//         this.attackMode = true;
//       }

//       if (this.attackMode) {
//         this.playAnimation(this.IMAGES_ATTACK);
//         this.moveTowardsPlayer();

//         if (this.isColliding(this.character)) {
//           this.character.hit();
//         }
//       } else {
//         this.playAnimation(this.IMAGES_ALERT);
//       }
//     }, 150);
//   }

//   moveTowardsPlayer() {
//     if (this.x > this.character.x + 50) {
//       this.x -= 2;
//     }
//   }

//   startAttackCycle() {
//     setInterval(() => {
//       this.isAttacking = true;
//       setTimeout(() => (this.isAttacking = false), 1000);
//     }, 5000);
//   }
// }*/

// class EndbossLevel1 extends MovableObject {
//   y = 240;
//   width = 200;
//   height = 200;

//   IMAGES_ALERT = [
//     "img/4_enemie_boss_chicken/2_alert/G5.png",
//     "img/4_enemie_boss_chicken/2_alert/G6.png",
//     "img/4_enemie_boss_chicken/2_alert/G7.png",
//     "img/4_enemie_boss_chicken/2_alert/G8.png",
//     "img/4_enemie_boss_chicken/2_alert/G9.png",
//     "img/4_enemie_boss_chicken/2_alert/G10.png",
//     "img/4_enemie_boss_chicken/2_alert/G11.png",
//     "img/4_enemie_boss_chicken/2_alert/G12.png",
//   ];

//   IMAGES_ATTACK = [
//     "img/4_enemie_boss_chicken/3_attack/G13.png",
//     "img/4_enemie_boss_chicken/3_attack/G14.png",
//     "img/4_enemie_boss_chicken/3_attack/G15.png",
//     "img/4_enemie_boss_chicken/3_attack/G16.png",
//     "img/4_enemie_boss_chicken/3_attack/G17.png",
//     "img/4_enemie_boss_chicken/3_attack/G18.png",
//     "img/4_enemie_boss_chicken/3_attack/G19.png",
//     "img/4_enemie_boss_chicken/3_attack/G20.png",
//   ];

//   IMAGES_HURT = [
//     "img/4_enemie_boss_chicken/4_hurt/G21.png",
//     "img/4_enemie_boss_chicken/4_hurt/G22.png",
//     "img/4_enemie_boss_chicken/4_hurt/G23.png",
//   ];

//   IMAGES_DEAD = [
//     "img/4_enemie_boss_chicken/5_dead/G24.png",
//     "img/4_enemie_boss_chicken/5_dead/G25.png",
//     "img/4_enemie_boss_chicken/5_dead/G26.png",
//   ];

//   alertDistance = 400;
//   speed = 1;
//   aggroSpeed = 3;
//   isAggressive = false;
//   attackMode = false;

//   constructor() {
//     super().loadImage(this.IMAGES_ALERT[0]);
//     this.loadImages(this.IMAGES_ALERT);
//     this.loadImages(this.IMAGES_ATTACK);
//     this.loadImages(this.IMAGES_HURT);
//     this.loadImages(this.IMAGES_DEAD);

//     this.x = 2000;
//     this.energy = 100;
//     this.statusBar = new StatusBarEnemy(this);

//     this.animate();
//     this.moveLogic(); // 👈 wichtig: Bewegung starten
//   }

//   hit() {
//     if (this.isDead()) return;

//     this.energy -= 20;
//     this.energy = Math.max(this.energy, 0);
//     this.statusBar.setPercentage(this.energy);

//     if (!this.isAggressive) {
//       this.isAggressive = true;
//       this.attackMode = true;
//     }

//     if (this.isDead()) {
//       this.die();
//     }
//   }

//   die() {
//     this.playAnimation(this.IMAGES_DEAD);
//     clearInterval(this.bossAnimationInterval);
//     clearInterval(this.bossMoveInterval);
//   }

//   isDead() {
//     return this.energy <= 0;
//   }

//   animate() {
//     this.bossAnimationInterval = setInterval(() => {
//       if (this.isDead()) {
//         this.playAnimation(this.IMAGES_DEAD);
//       } else if (this.energy < 40) {
//         this.playAnimation(this.IMAGES_HURT);
//       } else if (this.attackMode) {
//         this.playAnimation(this.IMAGES_ATTACK);
//       } else {
//         this.playAnimation(this.IMAGES_ALERT);
//       }
//     }, 200);
//   }

//   moveLogic() {
//     this.bossMoveInterval = setInterval(() => {
//       if (this.isDead() || !this.world?.character) return;

//       const player = this.world.character;
//       const distance = Math.abs(this.x - player.x);

//       if (distance < this.alertDistance) {
//         this.attackMode = true;
//         this.isAggressive = true;

//         const speed = this.isAggressive ? this.aggroSpeed : this.speed;

//         if (this.x > player.x) {
//           this.x -= speed;          // nach links laufen
//           this.otherDirection = true;
//         } else {
//           this.x += speed;          // nach rechts laufen
//           this.otherDirection = false;
//         }
//       } else {
//         this.attackMode = false;
//       }
//     }, 1000 / 60);
//   }
// }

// class EndbossLevel1 extends MovableObject {
//   y = 240;
//   width = 200;
//   height = 200;

//   IMAGES_ALERT = [
//     "img/4_enemie_boss_chicken/2_alert/G5.png",
//     "img/4_enemie_boss_chicken/2_alert/G6.png",
//     "img/4_enemie_boss_chicken/2_alert/G7.png",
//     "img/4_enemie_boss_chicken/2_alert/G8.png",
//     "img/4_enemie_boss_chicken/2_alert/G9.png",
//     "img/4_enemie_boss_chicken/2_alert/G10.png",
//     "img/4_enemie_boss_chicken/2_alert/G11.png",
//     "img/4_enemie_boss_chicken/2_alert/G12.png",
//   ];

//   IMAGES_ATTACK = [
//     "img/4_enemie_boss_chicken/3_attack/G13.png",
//     "img/4_enemie_boss_chicken/3_attack/G14.png",
//     "img/4_enemie_boss_chicken/3_attack/G15.png",
//     "img/4_enemie_boss_chicken/3_attack/G16.png",
//     "img/4_enemie_boss_chicken/3_attack/G17.png",
//     "img/4_enemie_boss_chicken/3_attack/G18.png",
//     "img/4_enemie_boss_chicken/3_attack/G19.png",
//     "img/4_enemie_boss_chicken/3_attack/G20.png",
//   ];

//   IMAGES_HURT = [
//     "img/4_enemie_boss_chicken/4_hurt/G21.png",
//     "img/4_enemie_boss_chicken/4_hurt/G22.png",
//     "img/4_enemie_boss_chicken/4_hurt/G23.png",
//   ];

//   IMAGES_DEAD = [
//     "img/4_enemie_boss_chicken/5_dead/G24.png",
//     "img/4_enemie_boss_chicken/5_dead/G25.png",
//     "img/4_enemie_boss_chicken/5_dead/G26.png",
//   ];

//   alertDistance = 400;
//   speed = 0.5;     // langsamer
//   aggroSpeed = 1.5; // aggressiv aber nicht zu schnell
//   isAggressive = false;
//   attackMode = false;

//   constructor() {
//     super().loadImage(this.IMAGES_ALERT[0]);
//     this.loadImages(this.IMAGES_ALERT);
//     this.loadImages(this.IMAGES_ATTACK);
//     this.loadImages(this.IMAGES_HURT);
//     this.loadImages(this.IMAGES_DEAD);

//     this.x = 2000;
//     this.energy = 100;
//     this.statusBar = new StatusBarEnemy(this);

//     this.animate();
//     this.moveLogic();
//   }

//   hit() {
//     if (this.isDead()) return;

//     this.energy -= 20;
//     this.energy = Math.max(this.energy, 0);
//     this.statusBar.setPercentage(this.energy);

//     if (!this.isAggressive) {
//       this.isAggressive = true;
//       this.attackMode = true;
//     }

//     if (this.isDead()) {
//       this.die();
//     }
//   }

//   die() {
//     this.playAnimation(this.IMAGES_DEAD);
//     clearInterval(this.bossAnimationInterval);
//     clearInterval(this.bossMoveInterval);
//   }

//   isDead() {
//     return this.energy <= 0;
//   }

//   animate() {
//     this.bossAnimationInterval = setInterval(() => {
//       if (this.isDead()) {
//         this.playAnimation(this.IMAGES_DEAD);
//       } else if (this.energy < 40) {
//         this.playAnimation(this.IMAGES_HURT);
//       } else if (this.attackMode) {
//         this.playAnimation(this.IMAGES_ATTACK);
//       } else {
//         this.playAnimation(this.IMAGES_ALERT);
//       }
//     }, 200);
//   }

//   moveLogic() {
//     this.bossMoveInterval = setInterval(() => {
//       if (this.isDead() || !this.world?.character) return;

//       const player = this.world.character;
//       const distance = Math.abs(this.x - player.x);

//       if (distance < this.alertDistance) {
//         this.attackMode = true;
//         this.isAggressive = true;

//         const moveSpeed = this.isAggressive ? this.aggroSpeed : this.speed;

//         if (this.x > player.x) {
//           this.x -= moveSpeed;       // läuft nach links
//           this.otherDirection = false; // schaut nach links
//         } else {
//           this.x += moveSpeed;       // läuft nach rechts
//           this.otherDirection = true;  // schaut nach rechts
//         }
//       } else {
//         this.attackMode = false;
//       }
//     }, 1000 / 60);
//   }
// }

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

  alertDistance = 400;
  speed = 1;
  aggroSpeed = 2;
  isAggressive = false;
  attackMode = false;
  isScreaming = false; // damit er nicht ständig schreit

  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 2000;
    this.energy = 100;
    this.statusBar = new StatusBarEnemy(this);

    // // 🎵 Sound vorbereiten
    // this.screamSound = new Audio("audio/chicken.mp3");
    // this.screamSound.volume = 0.5;
    // 🎵 Nur Pfad merken, Instanz dynamisch erstellen
    this.screamSoundPath = "audio/chicken.mp3";

    this.animate();
    this.moveLogic();
  }

  /** 🎵 Schrei-Sound abspielen */
  scream() {
    if (this.isScreaming || this.isDead()) return;

    this.isScreaming = true;

    // // const screamSound = new Audio("audio/chicken.mp3");
    // // screamSound.volume = 0.5;
    // // screamSound.play();
    // // von Anfang abspielen
    // this.screamSound.currentTime = 0;
    // this.screamSound.play();
    // Jedes Mal eine neue Instanz → unabhängig von Character-Sounds
    const screamSound = new Audio(this.screamSoundPath);
    screamSound.volume = 0.5;
    screamSound.play();

    this.activeScreamSound = screamSound; // merken, um später stoppen zu können

    setTimeout(() => {
      this.isScreaming = false;
    }, 2000); // nach 2s darf er wieder schreien
  }

  hit() {
    if (this.isDead()) return;

    this.energy -= 20;
    this.energy = Math.max(this.energy, 0);
    this.statusBar.setPercentage(this.energy);

    // 👉 Sofort aggressiv & schreien
    if (!this.isAggressive) {
      this.isAggressive = true;
      this.attackMode = true;
      this.scream();
    } else {
      this.scream(); // auch bei weiteren Treffern
    }

    if (this.isDead()) {
      this.die();
    }
  }

  // die() {
  //   this.playAnimation(this.IMAGES_DEAD);
  //   clearInterval(this.bossAnimationInterval);
  //   clearInterval(this.bossMoveInterval);

  //   // // 🎵 Sound sofort stoppen
  //   // this.screamSound.pause();
  //   // this.screamSound.currentTime = 0;

  //   // 🎵 Sound sofort stoppen
  //   this.screamSound.pause();
  //   this.screamSound.currentTime = 0;
  // }
  die() {
    this.playAnimation(this.IMAGES_DEAD);
    clearInterval(this.bossAnimationInterval);
    clearInterval(this.bossMoveInterval);

    // 🎵 Aktiven Sound stoppen, nur wenn vorhanden
    if (this.activeScreamSound) {
      try {
        this.activeScreamSound.pause();
        this.activeScreamSound.currentTime = 0;
        this.activeScreamSound = null; // Referenz leeren
      } catch (e) {
        console.warn("Fehler beim Stoppen des Boss-Sounds:", e);
      }
    }
  }

  isDead() {
    return this.energy <= 0;
  }

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

  moveLogic() {
    this.bossMoveInterval = setInterval(() => {
      if (this.isDead() || !this.world?.character) return;

      const player = this.world.character;
      const distance = Math.abs(this.x - player.x);

      if (distance < this.alertDistance) {
        // Boss wird aufmerksam
        this.attackMode = true;
        this.isAggressive = true;
        this.scream(); // 👉 schreien, wenn Spieler in Reichweite

        const speed = this.isAggressive ? this.aggroSpeed : this.speed;
        if (this.x > player.x) {
          this.x -= speed;
          this.otherDirection = false;
        } else {
          this.x += speed;
          this.otherDirection = true;
        }
      } else {
        this.attackMode = false;
      }
    }, 1000 / 60);
  }
}
