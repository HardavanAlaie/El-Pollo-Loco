/**
 * 🌵 Class: Level
 * Represents a single game level configuration.
 * Holds all entities, background layers, and collectible items for the world.
 */
class Level {
  enemies = [];             // 🐔 Array of enemy objects (e.g., chickens, boss)
  clouds = [];              // ☁️ Array of moving cloud objects
  backgroundObjects = [];   // 🏜️ Array of background layers (parallax scenery)
  collectableObjects = [];  // 🧴 Array of collectible bottles
  collectableCoins = [];    // 🪙 Array of collectible coins
  level_end_x = 2250;       // 📏 Level width limit (where level ends)

  /**
   * Creates a new Level instance with all required components.
   * 
   * @param {Array} enemies - Array of enemy objects.
   * @param {Array} clouds - Array of clouds for background animation.
   * @param {Array} backgroundObjects - All background image layers.
   * @param {Array} collectableObjects - Collectible bottles in the level.
   * @param {Array} collectableCoins - Collectible coins in the level.
   * @param {Object} config - Optional config (e.g., enemy spawn settings).
   */
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
    this.config = config; // ⚙️ Optional: extra settings like spawn rules or difficulty
  }
}
