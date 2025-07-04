const level1 = new Level(
  [new ChickenSmall(), new ChickenSmall(), new ChickenSmall(), new EndbossLevel1()],
  [new Cloud(), new Cloud(), new Cloud()],
  [
    new BackgroundObject('img/5_background/layers/air.png', 0),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
    new BackgroundObject('img/5_background/layers/air.png', 719),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),
    new BackgroundObject('img/5_background/layers/air.png', -720),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -720),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -720),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -720),
    new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 2),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 2),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 2),
    new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 3),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 3),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 3),
  ],
  [
    new CollectableBottle(300, 350),
    new CollectableBottle(350, 300),
    new CollectableBottle(400, 300),
    new CollectableBottle(500, 300),
    new CollectableBottle(700, 350),
    new CollectableBottle(750, 300),
    new CollectableBottle(850, 300),
    new CollectableBottle(850, 350),
    new CollectableBottle(900, 350),
    new CollectableBottle(1000, 350),
    new CollectableBottle(1900, 350),
    new CollectableBottle(1950, 350),
    new CollectableBottle(1850, 350),
    new CollectableBottle(1800, 350),
    new CollectableBottle(2000, 350),
  ],
  [
    new CollectableCoin(100, 350),
    new CollectableCoin(150, 300),
    new CollectableCoin(200, 300),
    new CollectableCoin(150, 350),
    new CollectableCoin(200, 350),
    new CollectableCoin(250, 350),
    new CollectableCoin(400, 350),
    new CollectableCoin(700, 350)
  ]
);

const level2 = new Level(
  [new ChickenNormal(), new ChickenNormal(), new ChickenNormal(), new EndbossLevel2()],
  [new Cloud(), new Cloud(), new Cloud()],
  [
    new BackgroundObject('img/5_background/layers/air.png', 0),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
    new BackgroundObject('img/5_background/layers/air.png', 719),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),
    new BackgroundObject('img/5_background/layers/air.png', -720),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -720),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -720),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -720),
    new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 2),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 2),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 2),
    new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 3),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 3),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 3),
  ],
  [
    new CollectableBottle(300, 350),
    new CollectableBottle(350, 300),
    new CollectableBottle(400, 300),
    new CollectableBottle(350, 350),
    new CollectableBottle(400, 350),
    new CollectableBottle(450, 350),
    new CollectableBottle(600, 350),
    new CollectableBottle(900, 350)
  ],
  [
    new CollectableCoin(100, 350),
    new CollectableCoin(150, 300),
    new CollectableCoin(200, 300),
    new CollectableCoin(150, 350),
    new CollectableCoin(200, 350),
    new CollectableCoin(250, 350),
    new CollectableCoin(400, 350),
    new CollectableCoin(700, 350)
  ]
);

/*
const level3 = new Level(
  [new ChickenSmall(), new ChickenSmall(), new ChickenSmall(), new EndbossLevel1()],
  [new Cloud(), new Cloud(), new Cloud()],
  [
    new BackgroundObject('img/5_background/layers/air.png', 0),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
    new BackgroundObject('img/5_background/layers/air.png', 719),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),
    new BackgroundObject('img/5_background/layers/air.png', -720),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -720),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -720),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -720),
    new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 2),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 2),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 2),
    new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 3),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 3),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 3),
  ],
  [
    new CollectableBottle(300, 350),
    new CollectableBottle(350, 300),
    new CollectableBottle(400, 300),
    new CollectableBottle(500, 300),
    new CollectableBottle(700, 350),
    new CollectableBottle(750, 300),
    new CollectableBottle(850, 300),
    new CollectableBottle(850, 350),
    new CollectableBottle(900, 350),
    new CollectableBottle(1000, 350),
    new CollectableBottle(1900, 350),
    new CollectableBottle(1950, 350),
    new CollectableBottle(1850, 350),
    new CollectableBottle(1800, 350),
    new CollectableBottle(2000, 350),
  ],
  [
    new CollectableCoin(100, 350),
    new CollectableCoin(150, 300),
    new CollectableCoin(200, 300),
    new CollectableCoin(150, 350),
    new CollectableCoin(200, 350),
    new CollectableCoin(250, 350),
    new CollectableCoin(400, 350),
    new CollectableCoin(700, 350)
  ]
);
*/
