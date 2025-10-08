// class DrawableObject {
//   img;
//   imageCache = {};
//   currentImage = 0;
//   x = 120;
//   y = 280;
//   height = 150;
//   width = 100;

//   loadImage(path) {
//     this.img = new Image(); // this.img = document.getElementById('image'); <img id="image">
//     this.img.src = path;
//   }

//   draw(ctx) {
//     ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
//   }

//   drawFrame(ctx) {
//     if (
//       this instanceof Character ||
//       this instanceof ChickenSmall ||
//       this instanceof ChickenNormal ||
//       this instanceof EndbossLevel1
//     ) {
//       ctx.beginPath();
//       ctx.lineWidth = 2;
//     }
//   }

//   loadImages(arr) {
//     arr.forEach((path) => {
//       let img = new Image();
//       img.src = path;
//       this.imageCache[path] = img;
//     });
//   }
// }

/**
 * 🎨 Basisklasse für alle Objekte, die gezeichnet werden können
 * (z. B. Charakter, Gegner, Items, Hintergrundobjekte)
 */
class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;

  /** 📥 Einzelnes Bild laden */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /** 🖼️ Objekt auf das Canvas zeichnen */
  draw(ctx) {
    if (!this.img) return;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /** 🔲 Optional: Rahmen um das Objekt zeichnen (Debug oder Kollision) */
  drawFrame(ctx) {
    const highlightClasses = [
      Character,
      ChickenSmall,
      ChickenNormal,
      EndbossLevel1,
    ];

    if (highlightClasses.some((cls) => this instanceof cls)) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      // Kein StrokeRect hier, da die eigentliche Kollision in World gemacht wird
    }
  }

  /** 🗂️ Mehrere Bilder (Animationen) vorladen */
  loadImages(arr) {
    arr.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
