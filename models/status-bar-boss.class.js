class StatusBarBoss extends DrawableObject {
  IMAGES = [
    "img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
  ];

  constructor(enemy) {
    super();
    this.enemy = enemy;
    this.width = 300; // 👑 groß im HUD
    this.height = 50;
    this.x = 380; // rechts oben im HUD (kannst anpassen)
    this.y = 20;
    this.loadImages(this.IMAGES);
    this.setPercentage(enemy.energy);
  }

  /** Energieanzeige aktualisieren */
  setPercentage(percentage) {
    this.percentage = percentage;
    const thresholds = [100, 80, 60, 40, 20, 0];
    const index = thresholds.findIndex((t) => percentage >= t);
    this.img = this.imageCache[this.IMAGES[index === -1 ? 5 : index]];
  }

  /** Zeichnet festen Balken (keine Position-Updates nötig) */
  draw(ctx) {
    super.draw(ctx);
  }
}
