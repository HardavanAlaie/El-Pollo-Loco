/**
 * 🌍 Hauptklasse, die das gesamte Spiel verwaltet
 * - steuert Spiellogik, Rendering, Kollisionen, Sounds, UI und Eingaben
 */
class World {
  constructor(canvas, keyboard) {
    /** --- Basis Setup --- */
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;

    this.canThrow = true;

    /** --- Statusflags --- */
    this.levelEnded = false;
    this.playerDied = false;
    this.endbossDefeated = false;
    this.uiScreen = null;

    /** --- Spielobjekte --- */
    this.statusBar = new StatusBar();
    this.statusBarBottle = new StatusBarBottle();
    this.statusBarCoin = new StatusBarCoin();
    this.throwableObjects = [];

    /** --- Level / Charakter laden --- */
    this.level = level1(this);
    this.character = new Character(this);
    this.enemies = this.level.enemies;
    this.clouds = this.level.clouds;
    this.backgroundObjects = this.level.backgroundObjects;
    this.collectableBottles = this.level.collectableObjects || [];
    this.collectableCoins = this.level.collectableCoins || [];

    /** --- Initialisierung --- */
    this.setWorld();
    this.setupCanvasControls();
    this.draw();
    this.run();
  }

  /** 🔧 Welt konfigurieren */
  setWorld() {
    this.character.world = this;
    this.spawnEnemyLoop();
  }

  /** ♻️ Spiel-Loop */
  run() {
    this.gameInterval = setInterval(() => {
      // ⛔ Wenn das Spiel schon vorbei ist, nichts mehr tun
      if (this.levelEnded) return;

      // 🔍 Hauptprüfungen pro Tick
      this.checkCollisions(); // prüft Kollisionen mit Gegnern & Items
      this.checkThrowableObjects(); // verwaltet fliegende Flaschen
      this.checkEndbossDefeated(); // prüft, ob Endboss tot ist
      this.removeOffscreenEnemies(); // entfernt Gegner außerhalb des Bildschirms
      this.checkEndboss1Hit(); // prüft, ob Spieler vom Boss getroffen wurde

      // 💀 Prüfen, ob Spieler tot ist
      if (
        this.character.energy <= 0 && // keine Energie mehr
        !this.playerDied && // noch kein Tod markiert
        !this.endbossDefeated // kein Win-Screen aktiv
      ) {
        this.playerDied = true;
        this.stopGameLoopHard(); // stoppt alle Intervalle / Animationen
        this.showGameOverScreen(); // zeigt Game-Over-Screen + Sound
      }
    }, 200);
  }

  /** 🛑 Spiel stoppen */
  stopGameLoopHard(isWin = false) {
    clearInterval(this.gameInterval);
    clearInterval(this.enemySpawnInterval);
    cancelAnimationFrame(this.animationFrame);
    this.levelEnded = true;
    this.gameOver = !isWin;
  }

  /** Prüft alle Kollisionen */
  checkCollisions() {
    this.level.enemies.forEach((e) => this.characterColliding(e));
    this.checkThrowableObjects();
    this.characterCollidingBottle();
    this.checkCoins();
  }

  /** Prüft Kollision mit Endboss */
  checkEndboss1Hit() {
    const boss = this.level.enemies.find(
      (e) => e instanceof EndbossLevel1 || e instanceof EndbossLevel2
    );
    if (!boss || this.character.energy <= 0) return;

    if (this.character.isColliding(boss) && !this.character.isHurtTimer) {
      this.character.hit();
      this.character.isHurtTimer = true;
      setTimeout(() => (this.character.isHurtTimer = false), 1000);
    }
  }

  /** Prüft geworfene Flaschen */
  checkThrowableObjects() {
    // Entferne zerstörte Flaschen
    this.throwableObjects = this.throwableObjects.filter((b) => !b.isDead?.());

    // Prüfe Kollision jeder aktiven Flasche mit jedem Gegner
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (!enemy.isDead?.() && bottle.isColliding(enemy)) {
          enemy.hit?.();
          bottle.break?.();
        }
      });
    });

    // Flaschenwurf prüfen (Taste D)
    this.throwableBottles();
  }

  /** Flaschenwurf */
  throwableBottles() {
    if (
      this.keyboard.D &&
      this.canThrow &&
      this.statusBarBottle.availableBottles > 0
    ) {
      this.canThrow = false;
      this.statusBarBottle.availableBottles--;
      this.statusBarBottle.update?.();

      const bottle = new ThrowableObject(
        this.character.x + (this.character.otherDirection ? -30 : 30),
        this.character.y + 100,
        this.character.otherDirection
      );
      bottle.world = this;
      this.throwableObjects.push(bottle);

      setTimeout(() => (this.canThrow = true), 400);
    }
  }

  /** Kollision mit Münzen */
  checkCoins() {
    this.collectableCoins = this.collectableCoins.filter((coin) => {
      if (this.character.isColliding(coin)) {
        this.statusBarCoin.availableCoins++;
        this.statusBarCoin.update();
        if (soundEnabled) {
          const s = new Audio("audio/coins.mp3");
          s.volume = 0.5;
          s.play().catch(() => {});
        }
        return false;
      }
      return true;
    });
  }

  /** Kollision Spieler ↔ Gegner */
  characterColliding(enemy) {
    if (!this.character.isColliding(enemy)) return;

    const isAbove =
      this.character.y + this.character.height <=
        enemy.y + enemy.height * 0.25 && this.character.speedY > 0;

    if (isAbove) {
      enemy.hit?.();
      this.character.jump();
      if (enemy.isDead?.()) enemy.die?.();
    } else {
      this.character.hit();
      this.statusBar.setPercentage(this.character.energy);
    }
  }

  /** Kollision Spieler ↔ Flaschen */
  characterCollidingBottle() {
    this.collectableBottles = this.collectableBottles.filter((bottle) => {
      if (this.character.isColliding(bottle)) {
        if (this.statusBarBottle.availableBottles < 5) {
          this.statusBarBottle.availableBottles++;
          this.statusBarBottle.update();
        } else this.showBottleLimitMessage();
        return false;
      }
      return true;
    });
  }

  /** Prüft, ob Endboss besiegt wurde */
  checkEndbossDefeated() {
    const endboss = this.level.enemies.find((e) => e instanceof EndbossLevel1);
    if (!endboss || this.endbossDefeated || this.playerDied) return;

    if (endboss.isDead?.()) {
      this.endbossDefeated = true;
      this.stopGameLoopHard(true);
      this.showWinScreen();
    }
  }

  /** Beendet das Spiel */
  endGame() {
    this.stopGameLoopHard();
    this.stopEnemySounds();
    this.playSound("audio/gameover.mp3");
    this.showGameOverScreen();
  }

  playSound(path, loop = false) {
    if (!soundEnabled) return;
    const s = new Audio(path);
    s.volume = 0.7;
    s.loop = loop;
    s.play().catch(() => {});
  }

  stopEnemySounds() {
    this.level.enemies.forEach((e) => e.stopScreamSound?.());
  }

  showWinScreen() {
    // Verhindert doppeltes Aufrufen
    if (this._winShown) return;
    this._winShown = true;
    this._gameOverPlayed = true; // verhindert, dass Game-Over danach triggert

    this.stopGameLoopHard(true);
    this.playSound("audio/win.mp3", true); // Dauerschleife bis Neustart

    // Hintergrund leicht abdunkeln, Spielbild bleibt sichtbar
    this.fadeOverlay(0.3);

    this.drawEndScreen("img/You won, you lost/You win B.png", "#fca534ff");
  }

  showGameOverScreen() {
    // Nur einmal ausführen
    if (this._gameOverPlayed) return;
    this._gameOverPlayed = true;
    this._winShown = true; // verhindert Win danach

    this.stopGameLoopHard(false);
    this.playSound("audio/gameover.mp3", false); // einmal abspielen

    // Spielbild stark abdunkeln
    this.fadeOverlay(0.8);

    this.drawEndScreen("img/You won, you lost/Game Over.png", "#fca534ff");
  }

  fadeOverlay(alpha = 0.2) {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawEndScreen(imgSrc, btnColor) {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const img = new Image();

    img.src = imgSrc;
    img.onload = () => {
      const scale = Math.min(
        (canvas.width * 0.6) / img.width,
        (canvas.height * 0.3) / img.height
      );
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(
        img,
        canvas.width / 2 - w / 2,
        canvas.height / 2 - h - 40,
        w,
        h
      );
      this.drawRestartButton(btnColor);
    };
  }

  drawRestartButton(color) {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const w = 250,
      h = 60;
    const x = canvas.width / 2 - w / 2;
    const y = canvas.height / 2;

    // 🌟 Pulsierende Animation
    let pulse = 0;
    const animatePulse = () => {
      if (this.levelEnded) {
        // Nur animieren, wenn das Spiel vorbei ist
        ctx.save();
        ctx.globalAlpha = 0.2 + Math.sin(Date.now() / 400) * 0.2; // Leichte Transparenzbewegung
        ctx.fillStyle = "#c07512ff"; // heller Schein
        ctx.beginPath();
        ctx.roundRect(x - 5, y - 5, w + 10, h + 10, 10);
        ctx.fill();
        ctx.restore();

        // 🔳 Hauptbutton
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
        ctx.font = "24px Comic Sans MS";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Spiel neu starten", canvas.width / 2, y + 38);

        // ♻️ Wiederholen (sanftes Leuchten)
        pulse = requestAnimationFrame(animatePulse);
      } else {
        cancelAnimationFrame(pulse);
      }
    };

    // Erste Zeichnung
    animatePulse();

    // Klickbereich speichern
    this.restartButtonArea = { x, y, width: w, height: h };

    // Listener nur einmal hinzufügen
    if (!this.canvasClickListenerAdded) {
      const boundHandler = this.handleRestartClick.bind(this);
      canvas.addEventListener("click", boundHandler);
      canvas.addEventListener("touchstart", boundHandler, { passive: false });
      canvas.addEventListener("pointerdown", boundHandler);
      this.canvasClickListenerAdded = true;
    }
  }

  handleRestartClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const btn = this.restartButtonArea;
    if (!btn) return;

    // Prüfen, ob Klick auf Button erfolgte
    const inside =
      x >= btn.x &&
      x <= btn.x + btn.width &&
      y >= btn.y &&
      y <= btn.y + btn.height;

    if (inside) {

      // 🧹 Sauber aufräumen vor Reload
      this.stopAllSounds();
      this.stopGameLoopHard();
      this._winShown = false;
      this._gameOverPlayed = false;

      // ⏳ kleine Verzögerung für bessere UX
      setTimeout(() => location.reload(), 300);
    }
  }

  handleCanvasClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const btn = this.restartButtonArea;
    if (
      btn &&
      x >= btn.x &&
      x <= btn.x + btn.width &&
      y >= btn.y &&
      y <= btn.y + btn.height
    )
      location.reload();
  }

  draw() {
    if (this.playerDied) return this.showGameOverScreen();
    if (this.endbossDefeated) return this.showWinScreen();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateCanvasRect();

    // --- Hintergrund & Kamera ---
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);

    // --- HUD (Statusleisten des Spielers) ---
    [this.statusBar, this.statusBarBottle, this.statusBarCoin].forEach((bar) =>
      this.addToMap(bar)
    );

    // --- Spielfiguren & Gegner ---
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);

    // 🐔 Gegner und ihre Lebensleisten zeichnen
    this.level.enemies.forEach((enemy) => {
      this.addToMap(enemy); // Gegner selbst
      if (enemy.statusBar) this.addToMap(enemy.statusBar); // Lebensbalken drüber
    });

    // --- Sammelobjekte & Wurfobjekte ---
    this.addObjectsToMap(this.collectableBottles);
    this.addObjectsToMap(this.collectableCoins);
    this.addObjectsToMap(this.throwableObjects);

    // --- Kamera zurücksetzen ---
    this.ctx.translate(-this.camera_x, 0);

    // --- Mobile Steuerung (Buttons) ---
    this.drawMobileControls();

    // --- Nächster Frame ---
    if (!this.levelEnded)
      this.animationFrame = requestAnimationFrame(() => this.draw());
  }

  addObjectsToMap(objects = []) {
    objects.forEach((o) => this.addToMap(o));
  }

  addToMap(mo) {
    if (!mo) return;
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x *= -1;
  }

  flipImageBack(mo) {
    this.ctx.restore();
    mo.x *= -1;
  }

  setupCanvasControls() {
    if (this.uiClickListenerAdded) return;
    this.uiClickListenerAdded = true;

    const handleDown = (e) => {
      if (e.cancelable) e.preventDefault();

      const { x, y } = this.getCanvasCoordinates(e);

      // 👉 Debug-Overlay zeichnen (zeigt Klickpunkt)
      const ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,0,0,0.6)";
      ctx.fill();
      ctx.restore();

      this.keyboard.LEFT = this.isInsideButton(x, y, this.leftBtnArea);
      this.keyboard.RIGHT = this.isInsideButton(x, y, this.rightBtnArea);
      this.keyboard.UP = this.isInsideButton(x, y, this.jumpBtnArea);
      this.keyboard.D = this.isInsideButton(x, y, this.throwBtnArea);
    };

    const handleUp = () => {
      this.keyboard.LEFT = false;
      this.keyboard.RIGHT = false;
      this.keyboard.UP = false;
      this.keyboard.D = false;
    };

    // 📱 Unterstützt Maus, Touch und Pointer Events
    ["pointerdown", "touchstart", "mousedown"].forEach((type) =>
      this.canvas.addEventListener(type, handleDown, { passive: false })
    );

    ["pointerup", "touchend", "mouseup", "touchcancel"].forEach((type) =>
      this.canvas.addEventListener(type, handleUp)
    );
  }

  updateCanvasRect() {
    this.canvasRect = this.canvas.getBoundingClientRect();
  }

  getCanvasCoordinates(e) {
    if (!this.canvasRect) this.updateCanvasRect();
    const rect = this.canvasRect;

    // Berechne Verhältnis zwischen echter und logischer Canvasgröße
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    // Tatsächliche Klick-Position
    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;

    // 🔧 NEU: korrigiert horizontale Verschiebung durch zentriertes Canvas
    const offsetX = rect.left;
    const offsetY = rect.top;

    const x = (clientX - offsetX) * scaleX;
    const y = (clientY - offsetY) * scaleY;

    // 💡 Wenn Canvas horizontal zentriert (z. B. im Querformat),
    // prüfen wir, ob rechts/links Ränder entstanden sind
    const pageWidth = window.innerWidth;
    const pageHeight = window.innerHeight;
    const aspectRatio = this.canvas.width / this.canvas.height;
    const windowRatio = pageWidth / pageHeight;

    if (windowRatio > aspectRatio) {
      // Bildschirm breiter als Canvas → schwarzer Rand links/rechts
      const displayedWidth = pageHeight * aspectRatio;
      const horizontalOffset = (pageWidth - displayedWidth) / 2;
      return {
        x: (clientX - horizontalOffset) * (this.canvas.width / displayedWidth),
        y: y,
      };
    }

    // normaler Fall
    return { x, y };
  }

  drawMobileControls() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // relative Größe (funktioniert auch bei Skalierung)
    const size = 60;
    const margin = 20;

    // Definiere Positionen in Prozent, damit sie sich mit Canvas-Größe mitverändern
    this.leftBtnArea = {
      x: margin,
      y: h - size - margin,
      width: size,
      height: size,
      label: "⬅️",
    };
    this.rightBtnArea = {
      x: margin + size + 20,
      y: h - size - margin,
      width: size,
      height: size,
      label: "➡️",
    };
    this.jumpBtnArea = {
      x: w - size * 2 - 40,
      y: h - size - margin,
      width: size,
      height: size,
      label: "⤴️",
    };
    this.throwBtnArea = {
      x: w - size - margin,
      y: h - size - margin,
      width: size,
      height: size,
      label: "🧴",
    };

    // Buttons zeichnen
    [
      this.leftBtnArea,
      this.rightBtnArea,
      this.jumpBtnArea,
      this.throwBtnArea,
    ].forEach((b) => {
      ctx.save();
      ctx.fillStyle = "#fca534ff";
      ctx.beginPath();
      ctx.arc(
        b.x + b.width / 2,
        b.y + b.height / 2,
        b.width / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = `${Math.floor(b.width / 2)}px Comic Sans MS`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(b.label, b.x + b.width / 2, b.y + b.height / 2);
      ctx.restore();
    });
  }

  toCanvasXY(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  isInsideButton(x, y, b) {
    return (
      b && x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height
    );
  }

  showBottleLimitMessage() {
    this.bottleLimitMessage = "Flaschenlimit erreicht!";
    clearTimeout(this.bottleLimitTimeout);
    this.bottleLimitTimeout = setTimeout(
      () => (this.bottleLimitMessage = ""),
      2000
    );
  }

  spawnEnemyLoop() {
    const configs = this.level.config?.spawnConfig || [];
    this.spawnIntervals = [];

    configs.forEach((cfg) => {
      const id = setInterval(() => {
        if (typeof cfg.condition === "function" && !cfg.condition(this.level))
          return;
        const current = this.level.enemies.filter((e) => e instanceof cfg.type);
        if (current.length < cfg.maxCount) {
          const newEnemy = new cfg.type();
          newEnemy.x = 900 + Math.random() * 400;
          this.level.enemies.push(newEnemy);
        }
      }, cfg.interval);
      this.spawnIntervals.push(id);
    });
  }

  /** Entfernt Gegner, die vom Bildschirm verschwinden */
  removeOffscreenEnemies() {
    this.level.enemies = this.level.enemies.filter(
      (e) =>
        !(e instanceof ChickenSmall || e instanceof ChickenNormal) || e.x > -50
    );
  }

  stopAllSounds() {
    try {
      // Stoppe alle Gegner-Sounds
      this.stopEnemySounds();

      // Stoppe globale Sounds, falls aktiv
      const audios = document.querySelectorAll("audio");
      audios.forEach((a) => {
        a.pause();
        a.currentTime = 0;
      });
    } catch (err) {
    }
  }
}
