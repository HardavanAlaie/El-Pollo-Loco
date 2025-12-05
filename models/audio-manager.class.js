/**
 * ------------------------------------------------------------
 * Handles all audio-related logic for the world: SFX, music,
 * enemy sounds and global stop logic.
 *
 * @class AudioManager
 * ------------------------------------------------------------
 */
class AudioManager {
  /**
   * @param {World} world - Reference to the game world instance.
   */
  constructor(world) {
    this.world = world;
    this._bgMusic = null;
  }

  /**
   * Hilfsfunktion: liest die globale soundEnabled-Variable sicher aus.
   * Falls sie nicht existiert, wird so getan, als wäre Sound AN.
   */
  isSoundEnabled() {
    try {
      // soundEnabled global (wie in deinem restlichen Code)
      if (typeof soundEnabled !== "undefined") {
        return !!soundEnabled;
      }
    } catch (e) {
      // falls irgendwas schief geht: lieber Sound erlauben als alles blocken
    }
    return true;
  }

  /**
   * Plays a simple sound effect if sound is enabled.
   * @param {string} path - Audio file path.
   * @param {boolean} [loop=false] - Whether the sound should loop.
   */
  playSound(path, loop = false) {
    if (!this.isSoundEnabled()) return;
    const s = new Audio(path);
    s.volume = 0.7;
    s.loop = loop;
    s.play().catch(() => {});
  }

  /** Stops all enemy scream sounds. */
  stopEnemySounds() {
    const w = this.world;
    (w.level?.enemies || []).forEach((e) => e.stopScreamSound?.());
  }

  /** Hartes Stoppen aller Gegner-Audios (v. a. Boss-Schrei) */
  hardStopEnemyAudio() {
    try {
      (this.world.level?.enemies || []).forEach((e) => {
        if (typeof e.stopScreamSound === "function") {
          e.stopScreamSound();
        }
        if (e.screamSound) {
          e.screamSound.pause();
          e.screamSound.currentTime = 0;
        }
        if ("isScreaming" in e) e.isScreaming = false;
      });
    } catch {}
  }

  /** Stoppt nur die hinterlegte Hintergrundmusik (Win/GameOver). */
  stopBackgroundMusic() {
    try {
      if (this._bgMusic) {
        this._bgMusic.pause();
        this._bgMusic.currentTime = 0;
      }
    } catch (e) {
      console.warn("stopBackgroundMusic failed:", e);
    }
    this._bgMusic = null;
  }

  /**
   * Stops all sounds, both enemy and global audio elements.
   */
  stopAllSounds() {
    try {
      this.stopEnemySounds();
      document.querySelectorAll("audio").forEach((a) => {
        a.pause();
        a.currentTime = 0;
      });
      this.stopBackgroundMusic?.();
    } catch (err) {}
  }

  /**
   * Sets and plays background music, stopping previous music if
   * necessary and respecting global sound settings.
   *
   * @param {string} path - Path to the audio file.
   * @param {boolean} [loop=false] - Whether the music should loop.
   */
  setBackgroundMusic(path, loop = false) {
    try {
      if (this._bgMusic) {
        this._stopCurrentBgMusic();
      }
      if (!this.isSoundEnabled()) {
        this._bgMusic = null;
        return;
      }
      const a = new Audio(path);
      a.volume = 0.7;
      a.loop = loop;
      this._bgMusic = a;
      a.play().catch(() => {});
    } catch (e) {
      console.warn("setBackgroundMusic failed:", e);
    }
  }

  _stopCurrentBgMusic() {
    this._bgMusic.pause();
    this._bgMusic.currentTime = 0;
  }
}
