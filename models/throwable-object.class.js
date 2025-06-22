class ThrowableObject extends MovableObject {
  IMAGES_ROTATE = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor(x, y, directionLeft = false) {
    super().loadImage(this.IMAGES_ROTATE[0]);
    this.loadImages(this.IMAGES_ROTATE);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 60;
    this.directionLeft = directionLeft;
    this.throw();
    this.animate();
  }

  throw() {
    this.speedY = 30;
    this.applyGravity();
    this.throwInterval = setInterval(() => {
      if (!this.isBroken) {
        this.x += this.directionLeft ? -10 : 10;
      }
    }, 25);
  }

  animate() {
    this.animationInterval = setInterval(() => {
      if (!this.isBroken) {
        this.playAnimation(this.IMAGES_ROTATE);
      }
    }, 100);
  }

  break() {
    this.isBroken = true;
    this.speedY = 0;
    clearInterval(this.throwInterval);
    this.loadImages(this.IMAGES_SPLASH);
    this.playAnimation(this.IMAGES_SPLASH);

    setTimeout(() => {
      //this.remove(); // Flasche nach Splash entfernen
      this.markedForRemoval = true;
    }, 400);
  }

  remove() {
    const index = this.world?.throwableObjects.indexOf(this);
    if (index >= 0) {
      this.world.throwableObjects.splice(index, 1);
    }
    clearInterval(this.animationInterval);
  }

  isDead() {
    return this.y > 480 || this.markedForRemoval;
  }
}
