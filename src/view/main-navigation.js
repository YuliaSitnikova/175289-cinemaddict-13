import {createElement} from "../utils";

const createMainNavigationItem = (item, isActive) => {
  const {name, count} = item;
  const isAll = name === `all`;

  return `<a href="#${name}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">
    ${isAll ? `All movies` : `${name[0].toUpperCase() + name.slice(1)} <span class="main-navigation__item-count">${count}</span>`}
  </a>`;
};

const createMainNavigationTemplate = (items) => {
  const itemsTemplate = items.map((item, index) => createMainNavigationItem(item, index === 0)).join(``);

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${itemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class MainNavigation {
  constructor(items) {
    this._items = items;
    this._element = null;
  }

  getTemplate() {
    return createMainNavigationTemplate(this._items);
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
