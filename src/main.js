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

const FILMS_COUNT = 5;
const FILMS_EXTRA_COUNT = 2;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filmsExtra = new Array(FILMS_EXTRA_COUNT).fill().map(generateFilm);
const navigation = generateNavigation(films);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

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

for (let i = 0; i < FILMS_COUNT; i++) {
  render(filmsContainerElement, createFilmCardTemplate(films[i]));
}
render(filmsContainerElement, createShowMoreButton(), `afterend`);

filmsExtraContainerElements.forEach((filmsExtraContainerElement) => {
  for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
    render(filmsExtraContainerElement, createFilmCardTemplate(filmsExtra[i]));
  }
});

render(siteFooterElement, createFilmDetailsTemplate(films[0]), `afterend`);

const filmDetailElement = document.querySelector(`.film-details`);
const filmDetailCloseButton = filmDetailElement.querySelector(`.film-details__close-btn`);

filmDetailCloseButton.addEventListener(`click`, () => filmDetailElement.remove());

render(statisticsElement, createFooterStatisticTemplate(`130 291`));
