import AbstractView from "./abstract";

const createFooterStatisticTemplate = (count) => {
  return `<section class="footer__statistics">
    <p>${count} movies inside</p>
  </section>`;
};

export default class FooterStatistics extends AbstractView {
  constructor() {
    super();
    this._count = 0;
  }

  getTemplate() {
    return createFooterStatisticTemplate(this._count);
  }

  setCount(count) {
    this._count = count;
  }
}
