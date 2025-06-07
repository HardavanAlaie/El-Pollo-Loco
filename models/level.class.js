class Level {
  enemies;
  cloud;
  backgroundObject;
  level_end_x = 2200;

  constructor(enemies, fogs, backgroundObject) {
    this.enemies = enemies;
    this.fogs = fogs;
    this.backgroundObject = backgroundObject;
  }
}
