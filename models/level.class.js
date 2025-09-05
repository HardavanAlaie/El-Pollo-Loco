// class Level {
//   enemies;
//   clouds;
//   backgroundObjects;
//   level_end_x = 2250;

//   collectableObjects = [];
//   collectableCoins = [];

//   constructor(
//     enemies,
//     clouds,
//     backgroundObjects,
//     collectableObjects,
//     collectableCoins
//   ) {
//     this.enemies = enemies;
//     this.clouds = clouds;
//     this.backgroundObjects = backgroundObjects;
//     this.collectableObjects = collectableObjects;
//     this.collectableCoins = collectableCoins;
//   }
// }


class Level {
  enemies;
  clouds;
  backgroundObjects;
  collectableObjects = [];
  collectableCoins = [];
  level_end_x;

  constructor(enemies, clouds, backgroundObjects, collectableObjects, collectableCoins, level_end_x = 3000) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.collectableObjects = collectableObjects;
    this.collectableCoins = collectableCoins;
    this.level_end_x = level_end_x; // nur ein Level-Ende
  }
}



// class Level {
//   enemies;
//   clouds;
//   backgroundObjects;
//   collectableObjects = [];
//   collectableCoins = [];
//   level_end_x;

//   constructor(
//     enemies,
//     clouds,
//     backgroundObjects,
//     collectableObjects,
//     collectableCoins,
//     level_end_x = 2250 // Standard: 2250 px
//   ) {
//     this.enemies = enemies;
//     this.clouds = clouds;
//     this.backgroundObjects = backgroundObjects;
//     this.collectableObjects = collectableObjects;
//     this.collectableCoins = collectableCoins;
//     this.level_end_x = level_end_x;
//   }
// }
