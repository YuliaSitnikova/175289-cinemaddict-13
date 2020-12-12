const createFooterStatisticTemplate = (count) => {
  return `<p>${count} movies inside</p>`;
};

export default class FotterStatistic {
  constructor(count) {
    this._count = count;
  }

  getTemplate() {
    return createFooterStatisticTemplate(this._count);
  }
}
