/**
 * Lab 1
 * Author: Homayoun Khoshi
 * Note: ChatGPT was used for ideation and debugging.
 */
"use strict";
import { L1Storage } from "./storage.js";
import { Note, ActionButton, fmtTime } from "./components.js";

const M = window.USER_MESSAGES;
const AUTO_MS = 2000;

const state = {
  notes: /** @type {Note[]} */([]),
  dirty: false,
  intervalHandle: 0
};

const dom = {
  title: document.getElementById("title"),
  time: document.getElementById("time"),
  stack: document.getElementById("stack"),
  addWrap: document.getElementById("addWrap"),
  back: document.getElementById("backBtn")
};

dom.title.textContent = `${M.writerHeader}`;
dom.back.textContent = M.backLabel;

function renderSavedAt(ts) {
  dom.time.textContent = `${M.savedAtLabel} ${fmtTime(ts)}`;
}

function addNote(initialText = "") {
  const note = new Note({
    text: initialText,
    messages: M,
    onChange: () => { state.dirty = true; },
    onRemove: (n) => {
      state.notes = state.notes.filter(x => x !== n);
      n.destroy();
      const savedAt = L1Storage.save(state.notes.map(x => x.toJSON()));
      renderSavedAt(savedAt);
    }
  }).mount(dom.stack);
  state.notes.push(note);
}

function loadFromStorage() {
  const bundle = L1Storage.load();
  dom.stack.innerHTML = "";
  state.notes = [];
  for (const n of bundle.notes) addNote(n.text);
  renderSavedAt(bundle.savedAt);
}

function startAutoSave() {
  state.intervalHandle = window.setInterval(() => {
    if (!state.dirty) return;
    const savedAt = L1Storage.save(state.notes.map(n => n.toJSON()));
    renderSavedAt(savedAt);
    state.dirty = false;
  }, AUTO_MS);
}

function init() {
  const addBtn = new ActionButton({
    label: M.addLabel,
    className: "btn btn-green",
    onClick: () => addNote("")
  });
  dom.addWrap.appendChild(addBtn.el);

  loadFromStorage();
  startAutoSave();
}

init();
