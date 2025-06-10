/*class World {
  character = new Character();
  enemies = level1.enemies;
  cloud = level1.cloud;
  backgroundObject = level1.backgroundObject;
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  statusBarBottle = new StatusBarBottle();
  throwableObjects = [];

  // -------------- chatGPT --------------
  //bottle = new ThrowableObject(this.x, this.y, this.otherDirection);
  canThrow = true; // Neue Variable zur Steuerung
  collectableBottles = [];

  // -------------- chatGPT --------------

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.collectableBottles = this.level.collectableObjects;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowableObjects();
    }, 200);
  }

  checkThrowableObjects() {
    if (this.throwableObjects.length > 0) {
      this.throwableObjects.forEach((bottle) => {
        if (bottle.isDead()) {
          this.throwableObjects.splice(
            this.throwableObjects.indexOf(bottle),
            1
          );
        }
      });
    }

    // if (this.keyboard.D) {
    //   let bottle = new ThrowableObject(
    //     this.character.x + 100,
    //     this.character.y + 100
    //   );
    //   this.throwableObjects.push(bottle);
    // }

    // -------------- chatGPT --------------

    if (
      this.keyboard.D &&
      this.canThrow &&
      this.statusBarBottle.availableBottles > 0
    ) {
      this.canThrow = false; // Werfen deaktivieren
      this.statusBarBottle.availableBottles--;
      this.statusBarBottle.update(); // optional, wenn update-Methode existiert

      let bottle = new ThrowableObject(
        this.character.x + 30,
        this.character.y + 100,
        this.character.otherDirection
      );
      this.throwableObjects.push(bottle);

      // Wartezeit, bevor wieder geworfen werden darf
      setTimeout(() => {
        this.canThrow = true;
      }, 300); // 300ms Pause (kannst du anpassen)
    }

    // if (this.keyboard.D && this.statusBarBottle.availableBottles > 0) {
    //   this.statusBarBottle.availableBottles--;
    //   this.statusBarBottle.update();

    //   let bottle = new ThrowableObject(
    //     this.character.x + 30,
    //     this.character.y + 100,
    //     this.character.otherDirection
    //   );
    //   this.throwableObjects.push(bottle);
    // }
    // -------------- chatGPT --------------
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
        this.character.isHurt();
      }
    });

    // -------------- chatGPT --------------
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy)) {
          enemy.hit(); // Schaden zufügen
          this.throwableObjects.splice(
            this.throwableObjects.indexOf(bottle),
            1
          );

          if (enemy.isDead()) {
            this.level.enemies.splice(this.level.enemies.indexOf(enemy), 1);
          }
        }
      });
    });

    this.collectableBottles.forEach((bottle, index) => {
  if (this.character.isColliding(bottle)) {
    this.collectableBottles.splice(index, 1); // Flasche entfernen
    this.statusBarBottle.availableBottles++; // Anzahl erhöhen
    this.statusBarBottle.update(); // Optional, je nach StatusBar
  }
});

    // -------------- chatGPT --------------

    // this.throwableObject.forEach((bottle) => {
    //   this.level.enemies.forEach((enemy) => {
    //     if (bottle.isColliding(enemy)) {
    //       enemy.hit();
    //       if (enemy.statusBar) {
    //         enemy.statusBar.setPercentage(enemy.energy);
    //       }

    //       this.throwableObject.splice(this.throwableObject.indexOf(bottle), 1);
    //     }
    //   });
    // });

    // this.throwableObject.forEach((bottle) => {
    //   this.level.enemies.forEach((enemy) => {
    //     if (bottle.isColliding(enemy)) {
    //       enemy.hit(); // Gegner bekommt Schaden
    //       this.throwableObject.splice(this.throwableObject.indexOf(bottle), 1); // Flasche entfernen

    //       if (enemy.isDead()) {
    //         this.level.enemies.splice(this.level.enemies.indexOf(enemy), 1); // Gegner entfernen
    //       }
    //     }
    //   });
    // });
  }

  /*  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
        this.character.isHurt();
        //console.log('energy ', this.character.energy);
      }
      // if (this.character.isColliding(bottle)) {

      // }
      // if (this.throwableObject.isColliding(enemy)) {
      //   this.throwableObject.splice(this.throwableObject.indexOf(bottle), 1);
      //   this.level.enemies.splice(this.level.enemies.indexOf(enemy), 1);
      //   this.statusBar.setPercentage(this.enemy.energy);
      // }
      // if (this.character.isDead()) {
      //   this.character.energy = 0;
      //   console.log('dead ', this.character.energy);
      // }
    });
  }
*/
/*
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObject);

    this.ctx.translate(-this.camera_x, 0);
    //------ space for fixed objects -------
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarBottle);
    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.cloud);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.collectableBottles);
    this.addObjectsToMap(this.level.collectableObjects);


    // this.level.enemies.forEach((enemy) => {
    //   this.addToMap(enemy);
    //   if (enemy.statusBar) {
    //     enemy.updateStatusBar();
    //     this.addToMap(enemy.statusBar);
    //   }
    // });
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);

    //requestAnimationFrame(() => this.draw());  // draw() wird immer wieder aufgerufen. Variante 1
    let self = this; // draw() wird immer wieder aufgerufen. Variante 2
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    this.ctx.restore();
    mo.x = mo.x * -1;
  }
}
*/

class World {
  character = new Character();
  enemies = level1.enemies;
  cloud = level1.cloud;
  backgroundObject = level1.backgroundObject;
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  statusBarBottle = new StatusBarBottle();
  throwableObjects = [];
  canThrow = true;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setWorld();
    this.draw();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowableObjects();
    }, 1000 / 10); // 10x pro Sekunde
  }

  checkThrowableObjects() {
    // Entferne geworfene Flaschen, wenn sie "tot" sind
    this.throwableObjects = this.throwableObjects.filter(
      (bottle) => !bottle.isDead?.()
    );

    // Wurf-Taste gedrückt, noch Flaschen vorhanden, Wurf erlaubt?
    if (
      this.keyboard.D &&
      this.canThrow &&
      this.statusBarBottle.availableBottles > 0
    ) {
      this.canThrow = false;
      this.statusBarBottle.availableBottles--;
      this.statusBarBottle.update?.();

      let bottle = new ThrowableObject(
        this.character.x + (this.character.otherDirection ? -30 : 30),
        this.character.y + 100,
        this.character.otherDirection
      );
      this.throwableObjects.push(bottle);

      setTimeout(() => (this.canThrow = true), 300);
    }
  }

  checkCollisions() {
    // Kollisionsprüfung: Spieler mit Gegnern
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
        this.character.isHurt();
      }
    });

    // Kollisionsprüfung: Flaschen mit Gegnern
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy)) {
          enemy.hit();
          this.throwableObjects.splice(
            this.throwableObjects.indexOf(bottle),
            1
          );
          if (enemy.isDead()) {
            this.level.enemies.splice(this.level.enemies.indexOf(enemy), 1);
          }
        }
      });
    });

    // Kollisionsprüfung: Spieler sammelt Flaschen ein
    this.level.collectableObjects = this.level.collectableObjects.filter(
      (bottle) => {
        if (this.character.isColliding(bottle)) {
          this.statusBarBottle.availableBottles++;
          this.statusBarBottle.update?.();
          return false; // Entferne eingesammelte Flasche
        }
        return true;
      }
    );
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    // this.addObjectsToMap(this.level.backgroundObject);
    // this.addObjectsToMap(this.level.cloud);
    // this.addObjectsToMap(this.level.collectableObjects || []);
    // this.addObjectsToMap(this.level.enemies);

    this.addObjectsToMap(this.level.backgroundObject || []);
this.addObjectsToMap(this.level.cloud || []);
this.addObjectsToMap(this.level.enemies || []);
this.addObjectsToMap(this.level.collectableObjects || []);
this.addObjectsToMap(this.throwableObjects || []);


    this.addObjectsToMap(this.throwableObjects);
    this.addToMap(this.character);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarBottle);

    this.ctx.translate(this.camera_x, 0);
    this.ctx.translate(-this.camera_x, 0);

    requestAnimationFrame(() => this.draw());
  }

  addObjectsToMap(objects) {
    objects.forEach((object) => this.addToMap(object));
  }

  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw?.(this.ctx);
    mo.drawFrame?.(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    this.ctx.restore();
    mo.x = mo.x * -1;
  }
}
