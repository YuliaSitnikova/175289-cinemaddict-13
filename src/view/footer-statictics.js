import AbstractView from "./abstract";

const createFooterStatisticTemplate = (count) => {
  return `<section class="footer__statistics">
    <p>${count} movies inside</p>
  </section>`;
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
