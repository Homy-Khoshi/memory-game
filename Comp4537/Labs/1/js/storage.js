/**
 * Lab 1
 * Author: Homayoun Khoshi
 * Note: ChatGPT was used for ideation and debugging.
 */
"use strict";

export class L1Storage {
  static #KEY = "l1_notes_bundle";
  static #EMPTY = { savedAt: 0, notes: [] };

  static load() {
    try {
      const raw = localStorage.getItem(this.#KEY);
      if (!raw) return structuredClone(this.#EMPTY);
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.notes)) return structuredClone(this.#EMPTY);
      return parsed;
    } catch {
      return structuredClone(this.#EMPTY);
    }
  }

  static save(notes) {
    const bundle = { savedAt: Date.now(), notes };
    localStorage.setItem(this.#KEY, JSON.stringify(bundle));
    return bundle.savedAt;
  }

  /** Helpers */
  static key() { return this.#KEY; }
}
