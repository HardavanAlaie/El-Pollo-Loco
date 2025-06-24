class Level {
  enemies;
  clouds;
  backgroundObjects;
  level_end_x = 2200;

  collectableObjects = [];
  collectableCoins = [];

  constructor(
    enemies,
    clouds,
    backgroundObjects,
    collectableObjects,
    collectableCoins
  ) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.collectableObjects = collectableObjects;
    this.collectableCoins = collectableCoins;
  }
}
