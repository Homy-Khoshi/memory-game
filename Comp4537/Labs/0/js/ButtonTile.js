/**
 * Class: ButtonTile
 * Author: Homayoun Khoshi
 * Responsible for re-positioning buttons randomly inside the browser window.
 * Note: ChatGPT was used for ideation and debugging.
 */
export default class ButtonTile {
  constructor(order, color, parent) {
    this.order = order;
    this.color = color;
    this.parent = parent;

    this.el = document.createElement("button");
    this.el.className = "btn-tile";
    this.el.style.background = this.color;

    this.setNumberVisible(true);
    this.el.textContent = String(this.order);
    this.el.setAttribute("aria-disabled", "true");

    parent.appendChild(this.el);
  }

  setNumberVisible(visible) {
    this.el.dataset.numberVisible = String(visible);
    this.el.textContent = visible ? String(this.order) : "";
  }

  setRowMode() {
    this.el.classList.remove("btn-absolute");
    this.el.style.top = "";
    this.el.style.left = "";
  }

  setAbsoluteMode() { this.el.classList.add("btn-absolute"); }

  sizePx() {
    const r = this.el.getBoundingClientRect();
    return { w: r.width, h: r.height };
  }

  setPosition(leftPx, topPx) {
    this.el.style.left = `${leftPx}px`;
    this.el.style.top  = `${topPx}px`;
  }

  setClickable(canClick) {
    this.el.setAttribute("aria-disabled", String(!canClick));
    this.el.style.cursor = canClick ? "pointer" : "default";
  }

  onClick(listener) { this.el.addEventListener("click", listener); }
}
