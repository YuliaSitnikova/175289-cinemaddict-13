import {render, RenderPlace} from "./utils";
import {generateFilm} from "./mock/film";
import {generateNavigation} from "./mock/navigation";
import ProfileView from "./view/profile.js";
import MainNavigationVeiw from "./view/main-navigation";
import SortView from "./view/sort";
import FilmsView from "./view/films";
import FilmsListView from "./view/films-list";
import FilmsPopularListView from "./view/films-popular-list";
import FilmsCommentedListView from "./view/films-commented-list";
import FilmCardView from "./view/film-card";
import FilmDetailView from "./view/film-details";
import ShowMoreButtonView from "./view/show-more-button";
import FotterStatisticView from "./view/footer-statictics";

const FILMS_COUNT = 18;
const FILMS_COUNT_PER_STEP = 5;
const FILMS_EXTRA_COUNT = 2;

const renderFilm = (filmsContainerElement, film) => {
  const filmComponent = new FilmCardView(film);
  const filmPosterElement = filmComponent.getElement().querySelector(`.film-card__poster`);
  const filmTitleElement = filmComponent.getElement().querySelector(`.film-card__title`);
  const filmCommentsElement = filmComponent.getElement().querySelector(`.film-card__comments`);

  const onFilmClick = (evt) => {
    evt.preventDefault();
    renderFilmDetail(film);
  };

  filmPosterElement.addEventListener(`click`, onFilmClick);
  filmTitleElement.addEventListener(`click`, onFilmClick);
  filmCommentsElement.addEventListener(`click`, onFilmClick);

  render(filmsContainerElement, filmComponent.getElement(), RenderPlace.BEFOREEND);
};

const renderFilmDetail = (film) => {
  const filmDetailComponent = new FilmDetailView(film);
  const filmDetailCloseButton = filmDetailComponent.getElement().querySelector(`.film-details__close-btn`);

  filmDetailCloseButton.addEventListener(`click`, () => {
    filmDetailComponent.getElement().remove();
    filmDetailComponent.removeElement();
  });

  render(document.body, filmDetailComponent.getElement(), RenderPlace.BEFOREEND);
};

const renderFilmsList = () => {
  const filmsListComponent = new FilmsListView();
  const filmsContainerElement = filmsListComponent.getElement().querySelector(`.films-list__container`);

  for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
    renderFilm(filmsContainerElement, films[i]);
  }

  if (films.length > FILMS_COUNT_PER_STEP) {
    let renderedFilmCount = FILMS_COUNT_PER_STEP;

    const showMoreButtonComponent = new ShowMoreButtonView();

    render(filmsListComponent.getElement(), showMoreButtonComponent.getElement(), RenderPlace.BEFOREEND);

    showMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      films
        .slice(renderedFilmCount, renderedFilmCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => renderFilm(filmsContainerElement, film));

      renderedFilmCount += FILMS_COUNT_PER_STEP;

      if (renderedFilmCount > films.length) {
        showMoreButtonComponent.getElement().remove();
        showMoreButtonComponent.removeElement();
      }
    });
  }

  render(filmsComponent.getElement(), filmsListComponent.getElement(), RenderPlace.BEFOREEND);
};

const renderFilmsPopularList = () => {
  const filmsPopularListComponent = new FilmsPopularListView();
  const filmsContainerElement = filmsPopularListComponent.getElement().querySelector(`.films-list__container`);

  for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
    renderFilm(filmsContainerElement, filmsPopular[i]);
  }

  render(filmsComponent.getElement(), filmsPopularListComponent.getElement(), RenderPlace.BEFOREEND);
};

const renderFilmsCommentedList = () => {
  const filmsCommentedListComponent = new FilmsCommentedListView();
  const filmsContainerElement = filmsCommentedListComponent.getElement().querySelector(`.films-list__container`);

  for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
    renderFilm(filmsContainerElement, filmsCommented[i]);
  }

  render(filmsComponent.getElement(), filmsCommentedListComponent.getElement(), RenderPlace.BEFOREEND);
};

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filmsPopular = films.slice(0, FILMS_EXTRA_COUNT);
const filmsCommented = films.slice(0, FILMS_EXTRA_COUNT);
const navigationItems = generateNavigation(films);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const statisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

render(siteHeaderElement, new ProfileView().getElement(), RenderPlace.BEFOREEND);
render(siteMainElement, new MainNavigationVeiw(navigationItems).getElement(), RenderPlace.BEFOREEND);
render(siteMainElement, new SortView().getElement(), RenderPlace.BEFOREEND);

const filmsComponent = new FilmsView();

render(siteMainElement, filmsComponent.getElement(), RenderPlace.BEFOREEND);

renderFilmsList();
renderFilmsPopularList();
renderFilmsCommentedList();

render(statisticsElement, new FotterStatisticView(FILMS_COUNT).getElement(), RenderPlace.BEFOREEND);
