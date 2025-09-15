/**
 * Lab 1
 * Author: Homayoun Khoshi
 * Note: ChatGPT was used for ideation and debugging.
 */
"use strict";
import { L1Storage } from "./storage.js";
import { Note, fmtTime } from "./components.js";

const M = window.USER_MESSAGES;
const AUTO_MS = 2000;

const dom = {
  title: document.getElementById("title"),
  time: document.getElementById("time"),
  stack: document.getElementById("stack"),
  back: document.getElementById("backBtn")
};

dom.title.textContent = `${M.readerHeader}`;
dom.back.textContent = M.backLabel;

let currentSavedAt = 0;

function renderNotes(bundle) {
  dom.stack.innerHTML = "";
  for (const n of bundle.notes) {
    new Note({ text: n.text, messages: M, readOnly: true }).mount(dom.stack);
  }
  dom.time.textContent = `${M.retrievedAtLabel} ${fmtTime(Date.now())}`;
  currentSavedAt = bundle.savedAt;
}

function pull() {
  const bundle = L1Storage.load();
  if (bundle.savedAt !== currentSavedAt) renderNotes(bundle);
}

function init() {
  renderNotes(L1Storage.load());
  setInterval(pull, AUTO_MS);
  window.addEventListener("storage", (e) => {
    if (e.key === L1Storage.key()) pull();
  });
}

init();
