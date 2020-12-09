import {render} from "./utils";
import {createProfileTemplate} from "./view/profile.js";
import {createMainNavigationTemplate} from "./view/main-navigation";
import {createSortTemplate} from "./view/sort";
import {createFilmsTemplate} from "./view/films";
import {createFilmCardTemplate} from "./view/film-card";
import {createFilmDetailsTemplate} from "./view/film-details";
import {createShowMoreButton} from "./view/show-more-button";
import {createFooterStatisticTemplate} from "./view/footer-statictics";
import {generateFilm} from "./mock/film";
import {generateNavigation} from "./mock/navigation";

const FILMS_COUNT = 18;
const FILMS_COUNT_PER_STEP = 5;
const FILMS_EXTRA_COUNT = 2;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filmsExtra = films.slice(0, FILMS_EXTRA_COUNT);
const navigation = generateNavigation(films);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const statisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

render(siteHeaderElement, createProfileTemplate());
render(siteMainElement, createMainNavigationTemplate(navigation));
render(siteMainElement, createSortTemplate());
render(siteMainElement, createFilmsTemplate());

const filmsElement = siteMainElement.querySelector(`.films`);
const filmsContainerElement = filmsElement.querySelector(`.films-list:not(films-list--extra) .films-list__container`);
const filmsExtraContainerElements = filmsElement.querySelectorAll(`.films-list--extra .films-list__container`);

for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  render(filmsContainerElement, createFilmCardTemplate(films[i]));
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmCount = FILMS_COUNT_PER_STEP;

  render(filmsContainerElement, createShowMoreButton(), `afterend`);

  const showMoreButton = filmsElement.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => render(filmsContainerElement, createFilmCardTemplate(film)));

    renderedFilmCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmCount > films.length) {
      showMoreButton.remove();
    }
  });
}

filmsExtraContainerElements.forEach((filmsExtraContainerElement) => {
  for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
    render(filmsExtraContainerElement, createFilmCardTemplate(filmsExtra[i]));
  }
});

render(siteFooterElement, createFilmDetailsTemplate(films[0]), `afterend`);

const filmDetailElement = document.querySelector(`.film-details`);
const filmDetailCloseButton = filmDetailElement.querySelector(`.film-details__close-btn`);

filmDetailCloseButton.addEventListener(`click`, () => filmDetailElement.remove());

render(statisticsElement, createFooterStatisticTemplate(FILMS_COUNT));
