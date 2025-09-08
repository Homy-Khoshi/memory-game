/**
 * Script.js
 * Author: Homayoun Khoshi
 * Entry point for the memory game.
 * Note: ChatGPT was used for ideation and debugging.
 */

import MemoryGame from "./MemoryGame.js";

const SELECTORS = Object.freeze({
  playfield: "#playfield",
  goBtn: "#goBtn",
  countInput: "#btnCount",
  status: "#status",
  countLabel: "#countLabel"
});

document.addEventListener("DOMContentLoaded", () => {
  const ui = {
    playfield: document.querySelector(SELECTORS.playfield),
    goBtn: document.querySelector(SELECTORS.goBtn),
    countInput: document.querySelector(SELECTORS.countInput),
    status: document.querySelector(SELECTORS.status),
    countLabel: document.querySelector(SELECTORS.countLabel)
  };

  if (window.USER_MSG) {
    ui.countLabel.textContent = window.USER_MSG.labelCount;
    ui.countInput.placeholder = window.USER_MSG.askCountPlaceholder;
  }

  const game = new MemoryGame(ui);

  ui.goBtn.addEventListener("click", async () => {
    const n = Number(ui.countInput.value);
    try { game.validateCount(n); }
    catch (err) { game.setStatus(err.message); return; }

    ui.goBtn.disabled = true;
    await game.start(n);
    ui.goBtn.disabled = false;
  });
});
