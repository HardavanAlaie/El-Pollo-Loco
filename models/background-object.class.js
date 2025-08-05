class BackgroundObject extends MovableObject {
  //y = 0;
  width = 720;
  height = 480;

  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;

    //this.x = 10 + Math.random() * 500;
  }
}

// class BackgroundObject extends DrawableObject {
//   constructor(imagePath, x, parallaxFactor = 1.0) {
//     super();
//     this.loadImage(imagePath);
//     this.x = x;
//     this.y = 0;
//     this.width = 720;
//     this.height = 480;
//     this.parallaxFactor = parallaxFactor; // 👈 wichtig für Bewegung
//   }

//   draw(ctx, camera_x) {
//     ctx.drawImage(
//       this.img,
//       this.x - camera_x * this.parallaxFactor, // 👈 parallax effect
//       this.y,
//       this.width,
//       this.height
//     );
//   }
// }

// class BackgroundObject extends MovableObject {
//   width = 720;
//   height = 480;

//   /**
//    * @param {string} imagePath - Der Pfad zum Bild
//    * @param {number} x - Die X-Position im Level
//    * @param {number} parallaxFactor - Wie stark sich das Bild beim Scrollen verschiebt (0 = ganz hinten, 1 = ganz vorne)
//    */
//   constructor(imagePath, x, parallaxFactor = 1.0) {
//     super().loadImage(imagePath);
//     this.x = x;
//     this.y = 480 - this.height; // Bodenhöhe
//     this.parallaxFactor = parallaxFactor;
//   }

//   /**
//    * Zeichnet das Hintergrundbild mit Parallax-Effekt
//    * @param {CanvasRenderingContext2D} ctx
//    * @param {number} camera_x
//    */
//   draw(ctx, camera_x) {
//     ctx.drawImage(
//       this.img,
//       this.x - camera_x * this.parallaxFactor,
//       this.y,
//       this.width,
//       this.height
//     );
//   }
// }
