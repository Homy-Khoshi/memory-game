/**
 * Lab 1
 * Author: Homayoun Khoshi
 * Note: ChatGPT was used for ideation and debugging.
 */
"use strict";

export const fmtTime = (ts) =>
  ts ? new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--";


export class ActionButton {
  constructor({ label, className = "btn", onClick }) {
    this.el = document.createElement("button");
    this.el.className = className;
    this.el.textContent = label;
    if (onClick) this.el.addEventListener("click", onClick);
  }
}

export class Note {
  constructor({ id, text, onChange, onRemove, messages, readOnly = false }) {
    this.id = id ?? crypto.randomUUID();
    this.onChange = onChange;
    this.onRemove = onRemove;
    this.messages = messages;
    this.readOnly = readOnly;

    this.row = document.createElement("div");
    this.row.className = "note-row";

    this.textarea = document.createElement("textarea");
    this.textarea.className = "note";
    this.textarea.placeholder = messages.notePlaceholder;
    this.textarea.value = text ?? "";
    this.textarea.readOnly = readOnly;


    if (!readOnly) {
      this.textarea.addEventListener("input", () => this.onChange?.(this));
    }

    this.row.appendChild(this.textarea);

    // Only render a remove button when editable
    if (!readOnly) {
      const removeBtn = new ActionButton({
        label: messages.removeLabel,
        className: "btn btn-orange",
        onClick: () => this.onRemove?.(this)
      });
      this.row.appendChild(removeBtn.el);
    }
  }

  toJSON() { return { id: this.id, text: this.textarea.value }; }

  mount(parent) { parent.appendChild(this.row); return this; }

  destroy() { this.row.remove(); }
}
