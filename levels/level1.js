// function generateRandomBottles(count, xMin, xMax, yMin, yMax) {
//   let bottles = [];
//   for (let i = 0; i < count; i++) {
//     let x = Math.floor(Math.random() * (xMax - xMin) + xMin);
//     let y = Math.floor(Math.random() * (yMax - yMin) + yMin);
//     bottles.push(new CollectableBottle(x, y));
//   }
//   return bottles;
// }

// const level1 = (world) => {
//   const boss = new EndbossLevel1();
//   boss.world = world;

//   return new Level(
//     [
//       new ChickenSmall(),
//       new ChickenSmall(),
//       new ChickenNormal(),
//       new ChickenNormal(),
//       boss,
//     ],
//     [new Cloud(), new Cloud(), new Cloud()],
//     [
//       new BackgroundObject("img/5_background/layers/air.png", 0),
//       new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
//       new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
//       new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
//       new BackgroundObject("img/5_background/layers/air.png", 719),
//       new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
//       new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
//       new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),
//       new BackgroundObject("img/5_background/layers/air.png", -720),
//       new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -720),
//       new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -720),
//       new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -720),
//       new BackgroundObject("img/5_background/layers/air.png", 719 * 2),
//       new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 2),
//       new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 2),
//       new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 2),
//       new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
//       new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 3),
//       new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 3),
//       new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 3),
//     ],
//     generateRandomBottles(15, 300, 2000, 380, 380),
//     [
//       new CollectableCoin(100, 350),
//       new CollectableCoin(150, 300),
//       new CollectableCoin(200, 300),
//       new CollectableCoin(150, 350),
//       new CollectableCoin(200, 350),
//       new CollectableCoin(250, 350),
//       new CollectableCoin(400, 350),
//       new CollectableCoin(700, 350),
//     ],
//     {
//       spawnConfig: [
//         {
//           type: ChickenSmall,
//           maxCount: 15,
//           interval: 3000,
//           condition: (level) =>
//             level.enemies.some((e) => e instanceof EndbossLevel1 && !e.isDead()),
//         },
//         {
//           type: ChickenNormal,
//           maxCount: 2,
//           interval: 4000,
//           condition: (level) =>
//             level.enemies.some((e) => e instanceof EndbossLevel1 && !e.isDead()),
//         },
//       ],
//     }
//   );
// };

function generateRandomBottles(count, xMin, xMax, yMin, yMax) {
  const bottles = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * (xMax - xMin) + xMin);
    const y = Math.floor(Math.random() * (yMax - yMin) + yMin);
    bottles.push(new CollectableBottle(x, y));
  }
  return bottles;
}

const level1 = (world) => {
  const boss = new EndbossLevel1();
  boss.world = world;

  // --- Gegner ---
  const enemies = [
    new ChickenSmall(),
    new ChickenSmall(),
    new ChickenNormal(),
    new ChickenNormal(),
    boss,
  ];

  // --- Wolken ---
  const clouds = [new Cloud(), new Cloud(), new Cloud()];

  // --- Hintergrund ---
  const backgroundLayers = [
    "img/5_background/layers/air.png",
    "img/5_background/layers/3_third_layer/1.png",
    "img/5_background/layers/2_second_layer/1.png",
    "img/5_background/layers/1_first_layer/1.png",
    "img/5_background/layers/3_third_layer/2.png",
    "img/5_background/layers/2_second_layer/2.png",
    "img/5_background/layers/1_first_layer/2.png",
  ];

  const backgroundObjects = [];
  for (let i = -1; i <= 3; i++) {
    const offset = 719 * i;
    backgroundObjects.push(
      new BackgroundObject("img/5_background/layers/air.png", offset),
      new BackgroundObject(backgroundLayers[(i % 2) + 1], offset),
      new BackgroundObject(backgroundLayers[(i % 2) + 2], offset),
      new BackgroundObject(backgroundLayers[(i % 2) + 3], offset)
    );
  }

  // --- Flaschen & Münzen ---
  const bottles = generateRandomBottles(15, 300, 2000, 380, 380);
  const coins = [
    new CollectableCoin(100, 350),
    new CollectableCoin(150, 300),
    new CollectableCoin(200, 300),
    new CollectableCoin(150, 350),
    new CollectableCoin(200, 350),
    new CollectableCoin(250, 350),
    new CollectableCoin(400, 350),
    new CollectableCoin(700, 350),
  ];

  // --- Gegner-Spawning ---
  const spawnConfig = [
    {
      type: ChickenSmall,
      maxCount: 15,
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
  ];

  return new Level(enemies, clouds, backgroundObjects, bottles, coins, {
    spawnConfig,
  });
};

