/**
 * Class: Scrambler
 * Author: Homayoun Khoshi
 * Responsible for re-positioning buttons randomly inside the browser window.
 * Note: ChatGPT was used for ideation and debugging.
 */
export default class Scrambler {
  constructor(playfield) { this.playfield = playfield; }

  currentBounds() {
    const rect = this.playfield.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }

  randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  randomPositionFor(tile) {
    const { width, height } = this.currentBounds();
    const { w, h } = tile.sizePx();
    const maxLeft = Math.max(0, Math.floor(width - w));
    const maxTop  = Math.max(0, Math.floor(height - h));
    return { left: this.randomInt(0, maxLeft), top: this.randomInt(0, maxTop) };
  }

  scatter(tiles) {
    for (const t of tiles) {
      const { left, top } = this.randomPositionFor(t);
      t.setPosition(left, top);
    }
  }
}
