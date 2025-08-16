//   function generateBackgroundObjects({ screens = 4 } = {}) {
//   const basePath = "img/5_background/layers/";
//   const layers = [
//     { name: "air", path: "img/5_background/layers/air.png", factor: 0.1 },
//     { name: "3rd", path: "img/5_background/layers/3_third_layer/1.png", factor: 0.3 },
//     { name: "2nd", path: "img/5_background/layers/2_second_layer/1.png", factor: 0.5 },
//     { name: "1st", path: "img/5_background/layers/1_first_layer/1.png", factor: 1.0 },
//   ];

//   const backgroundObjects = [];

//   for (let i = -1; i < screens; i++) {
//     const x = i * 719;
//     const variant = (i % 2 === 0) ? "1.png" : "2.png";

//     layers.forEach((layer) => {
//       let imagePath = layer.path.endsWith(".png")
//         ? `${basePath}${layer.path}` // air
//         : `${basePath}${layer.path}/${variant}`; // other layers

//       backgroundObjects.push(new BackgroundObject(imagePath, x, layer.factor));
//     });
//   }

//   return backgroundObjects;
// }
// function generateBackgroundObjects(repeatCount = 4) {
//   const layers = [
//     '5_background/layers/air.png',
//     '5_background/layers/3_third_layer/1.png',
//     '5_background/layers/2_second_layer/1.png',
//     '5_background/layers/1_first_layer/1.png',
//     '5_background/layers/3_third_layer/2.png',
//     '5_background/layers/2_second_layer/2.png',
//     '5_background/layers/1_first_layer/2.png',
//   ];

//   const backgroundObjects = [];

//   for (let i = -1; i < repeatCount; i++) {
//     const x = i * 719;
//     backgroundObjects.push(new BackgroundObject(layers[0], x)); // air
//     backgroundObjects.push(new BackgroundObject(layers[1 + (i % 2)], x)); // third layer
//     backgroundObjects.push(new BackgroundObject(layers[3 + (i % 2)], x)); // second layer
//     backgroundObjects.push(new BackgroundObject(layers[5 + (i % 2)], x)); // first layer
//   }

//   return backgroundObjects;
// }


  
  function generateRandomBottles(count, xMin, xMax, yMin, yMax) {
    let bottles = [];
    for (let i = 0; i < count; i++) {
      let x = Math.floor(Math.random() * (xMax - xMin) + xMin);
      let y = Math.floor(Math.random() * (yMax - yMin) + yMin);
      bottles.push(new CollectableBottle(x, y));
    }
    return bottles;
  }


const level1 = new Level(
  [new ChickenSmall(), new ChickenSmall(), new ChickenSmall(), new EndbossLevel1()],
  [new Cloud(), new Cloud(), new Cloud()],
  //generateBackgroundObjects({ screens: 4 }), // <== Hier passiert die Magie
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
    // new BackgroundObject("img/5_background/layers/air.png", 719 * 4),
    // new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 4),
    // new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 4),
    // new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 4),
    // new BackgroundObject("img/5_background/layers/air.png", 0),
    // new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
    // new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
    // new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
    // new BackgroundObject("img/5_background/layers/air.png", 719),
    // new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
    // new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
    // new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),
    // new BackgroundObject("img/5_background/layers/air.png", 719 * 2),
    // new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 2),
    // new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 2),
    // new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 2),
    // new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
    // new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 3),
    // new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 3),
    // new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 3),
  ],
  generateRandomBottles(15, 300, 2000, 380, 380), // <== Hier passiert die Magie
  // [
  //   new CollectableBottle(300, 350),
  //   new CollectableBottle(350, 300),
  //   new CollectableBottle(400, 300),
  //   new CollectableBottle(500, 300),
  //   new CollectableBottle(700, 350),
  //   new CollectableBottle(750, 300),
  //   new CollectableBottle(850, 300),
  //   new CollectableBottle(850, 350),
  //   new CollectableBottle(900, 350),
  //   new CollectableBottle(1000, 350),
  //   new CollectableBottle(1900, 350),
  //   new CollectableBottle(1950, 350),
  //   new CollectableBottle(1850, 350),
  //   new CollectableBottle(1800, 350),
  //   new CollectableBottle(2000, 350),
  // ],
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
        maxCount: 15,
        interval: 3000,
        condition: (level) =>
          level.enemies.some((e) => e instanceof EndbossLevel1 && !e.isDead()),
      },
      // {
      //   type: ChickenNormal,
      //   maxCount: 2,
      //   interval: 4000,
      //   condition: (level) =>
      //     level.enemies.some((e) => e instanceof EndbossLevel1 && !e.isDead()),
      // },
    ],
  }
);

const level2 = new Level(
  [
    new ChickenNormal(),
    new ChickenNormal(),
    new ChickenNormal(),
    new ChickenNormal(),
    new ChickenNormal(),
    new EndbossLevel2(),
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
  generateRandomBottles(50, 300, 2000, 300, 350), // <== Hier passiert die Magie
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
        type: ChickenNormal,
        maxCount: 2,
        interval: 4000,
        condition: (level) =>
          level.enemies.some((e) => e instanceof EndbossLevel2 && !e.isDead()),
      },
    ],
  }
);

