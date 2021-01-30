import AbstractView from "./abstract";

const createMenuTemplate = () => {
  return `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._statisticsClickHandler = this._statisticsClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _statisticsClickHandler(evt) {
    evt.preventDefault();
    evt.target.classList.add(`main-navigation__additional--active`);
    this._callback.statisticksClick();
  }

  setStatisticsClickHandler(callback) {
    this._callback.statisticksClick = callback;
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, this._statisticsClickHandler);
  }

  resetActiveItem() {
    const item = this.getElement().querySelector(`.main-navigation__additional--active`);

    if (item) {
      item.classList.remove(`main-navigation__additional--active`);
    }
  }
}
