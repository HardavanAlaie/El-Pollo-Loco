class CollectableCoin extends MovableObject {
  constructor(x, y) {
    super().loadImage('img/8_coin/coin_1.png');
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 60;
  }
}