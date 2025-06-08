class Level {
  enemies;
  cloud;
  backgroundObject;
  level_end_x = 2200;

  constructor(enemies, cloud, backgroundObject) {
    this.enemies = enemies;
    this.cloud = cloud;
    this.backgroundObject = backgroundObject;
  }
}
