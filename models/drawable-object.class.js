/**
 * Class: DrawableObject
 * Base class for all visible game objects.
 * Handles image loading, caching, and rendering on the canvas.
 */
class DrawableObject {
  img;                      
  imageCache = {};            
  currentImage = 0;           
  x = 120;                    
  y = 280;                    
  height = 150;               
  width = 100;                

  /**
   * Loads a single image from a specified path and assigns it to `this.img`.
   * @param {string} path - The path to the image file.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the current image on the provided canvas context.
   * @param {CanvasRenderingContext2D} ctx - The drawing context of the canvas.
   */
  draw(ctx) {
    if (!this.img) return;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws an outline around certain classes (for debugging/visibility).
   * Only applies to main character and enemies.
   * @param {CanvasRenderingContext2D} ctx - The drawing context.
   */
  drawFrame(ctx) {
    const highlightClasses = [
      Character,
      ChickenSmall,
      ChickenNormal,
      EndbossLevel1,
    ];
    if (highlightClasses.some((cls) => this instanceof cls)) {
      ctx.beginPath();
      ctx.lineWidth = 2;
    }
  }

  /**
   * Loads and caches multiple images for animation or state transitions.
   * @param {string[]} arr - Array of image paths to preload.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
