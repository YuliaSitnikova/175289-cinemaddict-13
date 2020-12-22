import ProfileView from "./view/profile.js";
import MainNavigationVeiw from "./view/main-navigation";
import SortView from "./view/sort";
import FilmsView from "./view/films";
import FilmsListView from "./view/films-list";
import FilmsPopularListView from "./view/films-popular-list";
import FilmsCommentedListView from "./view/films-commented-list";
import FilmCardView from "./view/film-card";
import FilmDetailView from "./view/film-details";
import NoFilmsView from "./view/no-films";
import ShowMoreButtonView from "./view/show-more-button";
import FooterStatisticsView from "./view/footer-statictics";
import {generateFilm} from "./mock/film";
import {generateNavigation} from "./mock/navigation";
import {render, RenderPlace} from "./utils/render";

const FILMS_COUNT = 18;
const FILMS_COUNT_PER_STEP = 5;
const FILMS_EXTRA_COUNT = 2;

const siteBodyElement = document.body;
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const statisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

const renderFilm = (filmsContainerElement, film) => {
  const filmComponent = new FilmCardView(film);
  const filmDetailComponent = new FilmDetailView(film);

  const onEscKeydown = (evt) => {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      evt.preventDefault();
      closeFilmDetail();
    }
  };

  const showFilmDetail = () => {
    siteBodyElement.classList.add(`hide-overflow`);
    siteBodyElement.appendChild(filmDetailComponent.getElement());
    document.addEventListener(`keydown`, onEscKeydown);
  };

  const closeFilmDetail = () => {
    siteBodyElement.classList.remove(`hide-overflow`);
    siteBodyElement.removeChild(filmDetailComponent.getElement());
    document.removeEventListener(`keydown`, onEscKeydown);
  };

  filmComponent.setClickHandler(showFilmDetail);

  filmDetailComponent.setClickHandler(closeFilmDetail);

  render(filmsContainerElement, filmComponent, RenderPlace.BEFOREEND);
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

    render(filmsListComponent, showMoreButtonComponent, RenderPlace.BEFOREEND);

    showMoreButtonComponent.setClickHandler(() => {
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

  render(filmsComponent, filmsListComponent, RenderPlace.BEFOREEND);
};

const renderFilmsPopularList = () => {
  const filmsPopularListComponent = new FilmsPopularListView();
  const filmsContainerElement = filmsPopularListComponent.getElement().querySelector(`.films-list__container`);

  for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
    renderFilm(filmsContainerElement, filmsPopular[i]);
  }

  render(filmsComponent, filmsPopularListComponent, RenderPlace.BEFOREEND);
};

const renderFilmsCommentedList = () => {
  const filmsCommentedListComponent = new FilmsCommentedListView();
  const filmsContainerElement = filmsCommentedListComponent.getElement().querySelector(`.films-list__container`);

  for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
    renderFilm(filmsContainerElement, filmsCommented[i]);
  }

  render(filmsComponent, filmsCommentedListComponent, RenderPlace.BEFOREEND);
};

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filmsPopular = films.slice(0, FILMS_EXTRA_COUNT);
const filmsCommented = films.slice(0, FILMS_EXTRA_COUNT);
const navigationItems = generateNavigation(films);

if (films.length !== 0) {
  render(siteHeaderElement, new ProfileView(), RenderPlace.BEFOREEND);
}

render(siteMainElement, new MainNavigationVeiw(navigationItems), RenderPlace.BEFOREEND);

if (films.length !== 0) {
  render(siteMainElement, new SortView(), RenderPlace.BEFOREEND);
}

const filmsComponent = new FilmsView();

if (films.length !== 0) {
  renderFilmsList();
  renderFilmsPopularList();
  renderFilmsCommentedList();
} else {
  render(filmsComponent, new NoFilmsView(), RenderPlace.BEFOREEND);
}

render(siteMainElement, filmsComponent, RenderPlace.BEFOREEND);

render(statisticsElement, new FooterStatisticsView(FILMS_COUNT), RenderPlace.BEFOREEND);
