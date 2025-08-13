class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;

  loadImage(path) {
    this.img = new Image(); // this.img = document.getElementById('image'); <img id="image">
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  // drawFrame(ctx) {
  //   if (
  //     this instanceof Character ||
  //     this instanceof ChickenSmall ||
  //     this instanceof ChickenNormal ||
  //     this instanceof EndbossLevel1 ||
  //     this instanceof EndbossLevel2
  //   ) {
  //     ctx.beginPath();
  //     ctx.lineWidth = "5";
  //     ctx.strokeStyle = "blue";
  //     ctx.rect(this.x, this.y, this.width, this.height);
  //     ctx.stroke();
  //   }
  // }
  drawFrame(ctx) {
    if (
        this instanceof Character ||
        this instanceof ChickenSmall ||
        this instanceof ChickenNormal ||
        this instanceof EndbossLevel1 ||
        this instanceof EndbossLevel2
    ) {
        ctx.beginPath();
        ctx.lineWidth = 2;

        if (this instanceof Character) {
            ctx.strokeStyle = "blue"; // Spieler
        } else {
            ctx.strokeStyle = "red"; // Gegner
        }

        // Normale Hitbox
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();

        // Extra: Kill-Zone bei Gegnern (grün)
        if (this instanceof ChickenSmall || this instanceof ChickenNormal || this instanceof EndbossLevel1 || this instanceof EndbossLevel2) {
            let enemyTop = this.y + this.height * (this.height < 100 ? 0.8 : 0.3);
            let extraOffset = this.height < 100 ? 20 : 10;

            ctx.beginPath();
            ctx.strokeStyle = "green";
            ctx.rect(
                this.x - 5,
                enemyTop,
                this.width + 10,
                extraOffset
            );
            ctx.stroke();
        }
    }
}


  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
