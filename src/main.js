import {renderTemplate} from "./utils";
import {generateFilm} from "./mock/film";
import {generateNavigation} from "./mock/navigation";
import ProfileView from "./view/profile.js";
import MainNavigationVeiw from "./view/main-navigation";
import SortView from "./view/sort";
import FilmsView from "./view/films";
import FilmCardView from "./view/film-card";
import FilmDetailView from "./view/film-details";
import ShowMoreButtonView from "./view/show-more-button";
import FotterStatisticView from "./view/footer-statictics";

const FILMS_COUNT = 18;
const FILMS_COUNT_PER_STEP = 5;
const FILMS_EXTRA_COUNT = 2;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filmsExtra = films.slice(0, FILMS_EXTRA_COUNT);
const navigationItems = generateNavigation(films);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const statisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

renderTemplate(siteHeaderElement, new ProfileView().getTemplate());
renderTemplate(siteMainElement, new MainNavigationVeiw(navigationItems).getTemplate());
renderTemplate(siteMainElement, new SortView().getTemplate());
renderTemplate(siteMainElement, new FilmsView().getTemplate());

const filmsElement = siteMainElement.querySelector(`.films`);
const filmsContainerElement = filmsElement.querySelector(`.films-list:not(films-list--extra) .films-list__container`);
const filmsExtraContainerElements = filmsElement.querySelectorAll(`.films-list--extra .films-list__container`);

for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  renderTemplate(filmsContainerElement, new FilmCardView(films[i]).getTemplate());
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmCount = FILMS_COUNT_PER_STEP;

  renderTemplate(filmsContainerElement, new ShowMoreButtonView().getTemplate(), `afterend`);

  const showMoreButton = filmsElement.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => renderTemplate(filmsContainerElement, new FilmCardView(film).getTemplate()));

    renderedFilmCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmCount > films.length) {
      showMoreButton.remove();
    }
  });
}

filmsExtraContainerElements.forEach((filmsExtraContainerElement) => {
  for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
    renderTemplate(filmsExtraContainerElement, new FilmCardView(filmsExtra[i]).getTemplate());
  }
});

renderTemplate(siteFooterElement, new FilmDetailView(films[0]).getTemplate(), `afterend`);

const filmDetailElement = document.querySelector(`.film-details`);
const filmDetailCloseButton = filmDetailElement.querySelector(`.film-details__close-btn`);

filmDetailCloseButton.addEventListener(`click`, () => filmDetailElement.remove());

renderTemplate(statisticsElement, new FotterStatisticView(FILMS_COUNT).getTemplate());
