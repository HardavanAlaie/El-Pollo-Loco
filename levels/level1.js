/**
 * Generates an array of CollectableBottle objects with random positions within the specified bounds.
 *
 * @param {number} count - The number of bottles to generate.
 * @param {number} xMin - The minimum x-coordinate for bottle placement.
 * @param {number} xMax - The maximum x-coordinate for bottle placement.
 * @param {number} yMin - The minimum y-coordinate for bottle placement.
 * @param {number} yMax - The maximum y-coordinate for bottle placement.
 * @returns {CollectableBottle[]} An array of randomly positioned CollectableBottle instances.
 */
function generateRandomBottles(count, xMin, xMax, yMin, yMax) {
  let bottles = [];
  for (let i = 0; i < count; i++) {
    let x = Math.floor(Math.random() * (xMax - xMin) + xMin);
    let y = Math.floor(Math.random() * (yMax - yMin) + yMin);
    bottles.push(new CollectableBottle(x, y));
  }
  return bottles;
}

/**
 * Initializes and returns the configuration for Level 1 of the game.
 *
 * @function
 * @param {World} world - The game world instance to associate with the level's end boss.
 * @returns {Level} The configured Level 1 instance, including enemies, clouds, background objects, bottles, coins, and spawn configuration.
 *
 * @example
 * const level = level1(gameWorld);
 */
const level1 = (world) => {
  const boss = new EndbossLevel1();
  boss.world = world;

  return new Level(
    [
      new ChickenSmall(),
      new ChickenSmall(),
      new ChickenNormal(),
      new ChickenNormal(),
      boss, 
    ],
    [new Cloud(), new Cloud(), new Cloud()],
    [
      new BackgroundObject("img/5_background/layers/air.png", 0),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/air.png", 719),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/air.png", -720),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -720),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -720),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -720),
      new BackgroundObject("img/5_background/layers/air.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 3),
    ],
    generateRandomBottles(15, 300, 2000, 380, 380),
    [
      new CollectableCoin(100, 350),
      new CollectableCoin(150, 300),
      new CollectableCoin(200, 300),
      new CollectableCoin(150, 350),
      new CollectableCoin(200, 350),
      new CollectableCoin(250, 350),
      new CollectableCoin(400, 350),
      new CollectableCoin(700, 350),
    ],
    {
      spawnConfig: [
        {
          type: ChickenSmall,
          maxCount: 4,
          interval: 3000,
          condition: (level) =>
            level.enemies.some((e) => e instanceof EndbossLevel1 && !e.isDead()),
        },
        {
          type: ChickenNormal,
          maxCount: 2,
          interval: 4000,
          condition: (level) =>
            level.enemies.some((e) => e instanceof EndbossLevel1 && !e.isDead()),
        },
      ],
    }
  );
};
