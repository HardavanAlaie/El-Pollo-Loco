/**
 * Class: Level
 * Represents a single game level configuration.
 * Holds all entities, background layers, and collectible items for the world.
 */
class Level {
  enemies = [];             
  clouds = [];              
  backgroundObjects = [];   
  collectableObjects = [];  
  collectableCoins = [];    
  level_end_x = 2250;       

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
    this.config = config; 
  }
}
