// class Level {
//   enemies;
//   cloud;
//   backgroundObjects;
//   level_end_x = 2200;

//   constructor(enemies, cloud, backgroundObjects) {
//     this.enemies = enemies;
//     this.cloud = cloud;
//     this.backgroundObjects = backgroundObjects;
//   }
// }

class Level {

    enemies;
   cloud;
   backgroundObjects;
   level_end_x = 2200;

   collectableObjects = [];

  constructor(enemies, clouds, backgroundObjects, collectableObjects) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.collectableObjects = collectableObjects; // ← wichtig!
  }
}
