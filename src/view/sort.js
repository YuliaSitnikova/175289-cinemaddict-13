import AbstractView from "./abstract";
import {SortType} from "../constants";

const createSortTemplate = (currentSortType) => {
  return `<ul class="sort">
    <li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? `sort__button--active` : ``}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.DATE ? `sort__button--active` : ``}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.RATING ? `sort__button--active` : ``}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`;
};

export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;

    this._typeChangeHandler = this._typeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _typeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.typeChange(evt.target.dataset.sortType);
  }

  setTypeChangeHandler(callback) {
    this._callback.typeChange = callback;
    this.getElement().addEventListener(`click`, this._typeChangeHandler);
  }
}
