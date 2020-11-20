import {createProfileTemplate} from "./view/profile.js";
import {createMainNavigationTemplate} from "./view/main-navigation";
import {createSortTemplate} from "./view/sort";
import {createFilmsTemplate} from "./view/films";
import {createFilmCardTemplate} from "./view/film-card";
import {createShowMoreButton} from "./view/show-more-button";
import {createFooterStatisticTemplate} from "./view/footer-statictics";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const statisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

render(siteHeaderElement, createProfileTemplate(), `beforeend`);
render(siteMainElement, createMainNavigationTemplate(), `beforeend`);
render(siteMainElement, createSortTemplate(), `beforeend`);
render(siteMainElement, createFilmsTemplate(), `beforeend`);

const filmsElement = siteMainElement.querySelector(`.films`);
const filmsListElements = filmsElement.querySelectorAll(`.films-list`);

filmsListElements.forEach((filmsList) => {
  const FILMS_COUNT = filmsList.classList.contains(`films-list--extra`) ? 2 : 5;
  const filmsContainerElement = filmsList.querySelector(`.films-list__container`);
  for (let i = 0; i < FILMS_COUNT; i++) {
    render(filmsContainerElement, createFilmCardTemplate(), `beforeend`);
  }
  if (!filmsList.classList.contains(`films-list--extra`)) {
    render(filmsList, createShowMoreButton(), `beforeend`);
  }
});

render(statisticsElement, createFooterStatisticTemplate(), `beforeend`);

