import AbstractView from "./abstract";

const createFooterStatisticTemplate = (count) => {
  return `<p>${count} movies inside</p>`;
};

export default class FooterStatistics extends AbstractView {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return createFooterStatisticTemplate(this._count);
  }
}
