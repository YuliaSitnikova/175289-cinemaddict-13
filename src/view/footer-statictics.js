import {createElement} from "../utils";

const createFooterStatisticTemplate = (count) => {
  return `<p>${count} movies inside</p>`;
};

export default class FooterStatistics {
  constructor(count) {
    this._count = count;
    this._element = null;
  }

  getTemplate() {
    return createFooterStatisticTemplate(this._count);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
