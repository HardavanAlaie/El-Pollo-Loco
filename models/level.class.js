class Level {
  enemies = [];
  clouds = [];
  backgroundObjects = [];
  collectableObjects = [];
  collectableCoins = [];
  level_end_x = 2250;

  constructor(
    enemies = [],
    clouds = [],
    backgroundObjects = [],
    collectableObjects = [],
    collectableCoins = [],
    config = {}
  ) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.collectableObjects = collectableObjects;
    this.collectableCoins = collectableCoins;
    this.config = config; // ⚙️ optional für Spawn- oder Leveldaten
  }
}
