import AbstractView from "./abstract";

export default class Smart extends AbstractView {
  constructor() {
    super();
    this._data = {};
  }

  updateData(newProperties, updateElement) {
    if (!newProperties) {
      return;
    }

    this._data = Object.assign({}, this._data, newProperties);

    if (updateElement) {
      this.updateElement();
    }
  }

  updateElement() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: restoreHandlers`);
  }
}
