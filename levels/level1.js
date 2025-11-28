/**
 * 🧴 Generates an array of randomly positioned bottle objects.
 * @param {number} count - Number of bottles to generate.
 * @param {number} xMin - Minimum X coordinate.
 * @param {number} xMax - Maximum X coordinate.
 * @param {number} yMin - Minimum Y coordinate.
 * @param {number} yMax - Maximum Y coordinate.
 * @returns {CollectableBottle[]} Array of generated bottle objects.
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
 * 🌵 Level 1 Configuration
 * Creates and returns a new level instance with enemies, background, collectibles, and spawn logic.
 * @param {World} world - The current game world instance.
 * @returns {Level} Configured Level 1 instance.
 */
const level1 = (world) => {
  const boss = new EndbossLevel1();
  boss.world = world;

  // --- Return a fully configured level instance ---
  return new Level(
    [
      new ChickenSmall(),
      new ChickenSmall(),
      new ChickenSmall(),
      new ChickenSmall(),
      new ChickenNormal(),
      new ChickenNormal(),
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

    // --- Bottles (collectables) ---
    generateRandomBottles(15, 300, 2000, 380, 380),

    // --- Coins (collectables) ---
    [
      new CollectableCoin(200, 300),
      new CollectableCoin(300, 300),
      new CollectableCoin(400, 300),
      new CollectableCoin(500, 300),
      new CollectableCoin(600, 300),
      new CollectableCoin(700, 300),
    ],

    // --- Dynamic enemy spawn configuration ---
    // {
    //   spawnConfig: [
    //     {
    //       type: ChickenSmall, 
    //       maxCount: 4,        
    //       interval: 3000,     
    //       condition: (level) =>
    //         level.enemies.some((e) => e instanceof EndbossLevel1 && !e.isDead()), // Spawn only if boss alive
    //     },
    //     {
    //       type: ChickenNormal,
    //       maxCount: 2,
    //       interval: 4000,
    //       condition: (level) =>
    //         level.enemies.some((e) => e instanceof EndbossLevel1 && !e.isDead()),
    //     },
    //   ],
    // }
  );
};
