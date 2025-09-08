/**
 * Class: MemoryGame
 * Author: Homayoun Khoshi
 * The main game controller that manages state, timing, and interaction.
 * Note: ChatGPT was used for ideation and debugging.
 */
import ButtonTile from "./ButtonTile.js";
import Scrambler from "./Scrambler.js";

const LIMITS = Object.freeze({ MIN: 3, MAX: 7 });
const TIMING = Object.freeze({ SCRAMBLE_INTERVAL_MS: 2000 });

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomColor = () => {
  const h = randInt(0, 359);
  const s = randInt(60, 90);
  const l = randInt(45, 60);
  return `hsl(${h} ${s}% ${l}%)`;
};

export default class MemoryGame {
  constructor(ui) {
    this.ui = ui;
    this.tiles = [];
    this.expected = 1;
    this.running = false;
    this.timers = [];
    this.scrambler = new Scrambler(ui.playfield);
  }

  clearTimers() { for (const id of this.timers) clearTimeout(id); this.timers = []; }
  setStatus(msg) { this.ui.status.textContent = msg; }

  destroy() {
    this.clearTimers();
    this.running = false;
    this.tiles.forEach(t => t.el.remove());
    this.tiles = [];
    this.expected = 1;
    this.ui.playfield.classList.remove("playfield--fixed");
    this.ui.playfield.classList.add("playfield--row");
    this.setStatus(window.USER_MSG?.cleared ?? "");
  }

  validateCount(n) {
    if (Number.isNaN(n) || !Number.isInteger(n)) {
      throw new Error(window.USER_MSG?.invalidNaN ?? "Invalid number.");
    }
    if (n < LIMITS.MIN || n > LIMITS.MAX) {
      throw new Error(window.USER_MSG?.invalidRange ?? "Number out of range.");
    }
  }

  createTiles(n) {
    const colors = Array.from({ length: n }, () => randomColor());
    for (let i = 0; i < n; i++) {
      const tile = new ButtonTile(i + 1, colors[i], this.ui.playfield);
      tile.setRowMode();
      this.tiles.push(tile);
    }
  }

  makeTilesClickable(canClick) { for (const t of this.tiles) t.setClickable(canClick); }

  attachClickHandlers() {
    const onTileClick = (ev) => {
      if (!this.running) return;
      const btn = ev.currentTarget;
      const tile = this.tiles.find(t => t.el === btn);
      if (!tile) return;

      if (tile.order === this.expected) {
        tile.setNumberVisible(true);
        tile.setClickable(false);
        this.expected++;
        if (this.expected > this.tiles.length) this.win();
      } else {
        this.lose();
      }
    };
    for (const t of this.tiles) t.onClick(onTileClick);
  }

  async start(n) {
    this.destroy();
    this.setStatus(window.USER_MSG?.restarted ?? "New game started.");
    this.running = true;

    this.ui.playfield.classList.add("playfield--row");
    this.ui.playfield.classList.remove("playfield--fixed");

    this.createTiles(n);
    this.makeTilesClickable(false);
    this.setStatus(window.USER_MSG?.startedMemorize ?? "Memorize...");

    await delay(n * 1000);
    if (!this.running) return;

    this.setStatus(window.USER_MSG?.scrambling ?? "Scrambling...");
    this.ui.playfield.classList.remove("playfield--row");
    this.ui.playfield.classList.add("playfield--fixed");
    for (const t of this.tiles) t.setAbsoluteMode();

    for (let i = 0; i < n; i++) {
      this.scrambler.scatter(this.tiles);
      if (i < n - 1) {
        await delay(TIMING.SCRAMBLE_INTERVAL_MS);
        if (!this.running) return;
      }
    }

    for (const t of this.tiles) t.setNumberVisible(false);
    this.makeTilesClickable(true);
    this.attachClickHandlers();
    this.setStatus(window.USER_MSG?.clickNow ?? "Click in original order.");
  }

  win() {
    if (!this.running) return;
    this.running = false;
    this.makeTilesClickable(false);
    this.setStatus(window.USER_MSG?.excellent ?? "Excellent memory!");
  }

  lose() {
    if (!this.running) return;
    this.running = false;
    for (const t of this.tiles) {
      t.setNumberVisible(true);
      t.setClickable(false);
    }
    this.setStatus(window.USER_MSG?.wrong ?? "Wrong order!");
  }
}
