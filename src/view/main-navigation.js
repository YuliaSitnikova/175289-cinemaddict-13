const createMainNavigationItem = (item, isActive) => {
  const {name, count} = item;
  const isAll = name === `all`;

  return `<a href="#${name}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">
    ${isAll ? `All movies` : `${name[0].toUpperCase() + name.slice(1)} <span class="main-navigation__item-count">${count}</span>`}
  </a>`;
};

export const createMainNavigationTemplate = (navigationItems) => {
  const navigationItemsTemplate = navigationItems.map((item, index) => createMainNavigationItem(item, index === 0)).join(``);

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${navigationItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};
