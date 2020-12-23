import SortView from "../view/sort";
import FilmsView from "../view/films";
import FilmsListView from "../view/films-list";
import FilmsPopularListView from "../view/films-popular-list";
import FilmsCommentedListView from "../view/films-commented-list";
import FilmCardView from "../view/film-card";
import FilmDetailView from "../view/film-details";
import NoFilmsView from "../view/no-films";
import ShowMoreButtonView from "../view/show-more-button";
import {render, RenderPlace} from "../utils/render";

const FILMS_COUNT_PER_STEP = 5;
const FILMS_EXTRA_COUNT = 2;

export default class Films {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._sortComponent = new SortView();
    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsPopularListComponent = new FilmsPopularListView();
    this._filmsCommentedListComponent = new FilmsCommentedListView();
    this._noFilmsComponent = new NoFilmsView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._films = null;
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);

    this._filmsListContainer = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
  }

  init(films) {
    this._films = films.slice();

    if (this._films.length === 0) {
      this._renderNoFilms();
    } else {
      this._renderSort();
      this._renderFilmsList();
      this._renderPopularFilmsList();
      this._renderCommentedFilmsList();
    }

    render(this._filmsContainer, this._filmsComponent, RenderPlace.BEFOREEND);
  }

  _renderFilm(filmsContainerElement, film) {
    const filmComponent = new FilmCardView(film);
    const filmDetailComponent = new FilmDetailView(film);
    const siteBodyElement = document.body;

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
  }

  _renderFilms(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilm(this._filmsListContainer, film));
  }

  _renderFilmsList() {
    this._renderFilms(0, Math.min(this._films.length, FILMS_COUNT_PER_STEP));

    if (this._films.length > FILMS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }

    render(this._filmsComponent, this._filmsListComponent, RenderPlace.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);

    this._renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this._renderedFilmsCount > this._films.length) {
      this._showMoreButtonComponent.getElement().remove();
      this._showMoreButtonComponent.removeElement();
    }
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPlace.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderPopularFilmsList() {
    const filmsPopular = this._films.slice(0, FILMS_EXTRA_COUNT);

    const filmsContainerElement = this._filmsPopularListComponent.getElement().querySelector(`.films-list__container`);

    for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
      this._renderFilm(filmsContainerElement, filmsPopular[i]);
    }

    render(this._filmsComponent, this._filmsPopularListComponent, RenderPlace.BEFOREEND);
  }

  _renderCommentedFilmsList() {
    const filmsCommented = this._films.slice(0, FILMS_EXTRA_COUNT);

    const filmsContainerElement = this._filmsCommentedListComponent.getElement().querySelector(`.films-list__container`);

    for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
      this._renderFilm(filmsContainerElement, filmsCommented[i]);
    }

    render(this._filmsComponent, this._filmsCommentedListComponent, RenderPlace.BEFOREEND);
  }

  _renderNoFilms() {
    render(this._filmsComponent, this._noFilmsComponent, RenderPlace.BEFOREEND);
  }

  _renderSort() {
    render(this._filmsContainer, this._sortComponent, RenderPlace.BEFOREEND);
  }
}
