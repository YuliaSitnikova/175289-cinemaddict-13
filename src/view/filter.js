import Abstract from "./abstract";

const createFilterItem = (item, currentFilter) => {
  const {name, count} = item;
  const isAll = name === `all`;

  return `<a href="#${name}" class="main-navigation__item ${currentFilter === name ? `main-navigation__item--active` : ``}" data-name="${name}">
    ${isAll ? `All movies` : `${name[0].toUpperCase() + name.slice(1)} <span class="main-navigation__item-count">${count}</span>`}
  </a>`;
};

const createFilterTemplate = (items, currentFilter) => {
  const itemsTemplate = items.map((item) => createFilterItem(item, currentFilter)).join(``);

  return `<div class="main-navigation__items">
    ${itemsTemplate}
  </div>`;
};

export default class Filter extends Abstract {
  constructor(items, currentFilter) {
    super();

    this._items = items;
    this._currentFilter = currentFilter;
    this._itemClickHandler = this._itemClickHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._items, this._currentFilter);
  }

  _itemClickHandler(evt) {
    evt.preventDefault();
    this._callback.itemClick(evt.target.dataset.name);
  }

  setItemClickHandler(callback) {
    this._callback.itemClick = callback;
    this.getElement()
      .querySelectorAll(`.main-navigation__item`)
      .forEach((item) => item.addEventListener(`click`, this._itemClickHandler));
  }
}
