const createShowMoreButton = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class ShowMoreButton {
  constructor() {

  }

  getTemplate() {
    return createShowMoreButton();
  }
}
