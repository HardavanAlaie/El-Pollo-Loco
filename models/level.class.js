// class Level {
//   enemies;
//   cloud;
//   backgroundObject;
//   level_end_x = 2200;

//   constructor(enemies, cloud, backgroundObject) {
//     this.enemies = enemies;
//     this.cloud = cloud;
//     this.backgroundObject = backgroundObject;
//   }
// }

class Level {

    enemies;
   cloud;
   backgroundObject;
   level_end_x = 2200;

   collectableObjects = [];

  constructor(enemies, clouds, backgroundObjects, collectableObjects) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.collectableObjects = collectableObjects; // ← wichtig!
  }
}
