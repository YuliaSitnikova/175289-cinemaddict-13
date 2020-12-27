import SortView from "../view/sort";
import FilmsView from "../view/films";
import FilmsListView from "../view/films-list";
import FilmsPopularListView from "../view/films-popular-list";
import FilmsCommentedListView from "../view/films-commented-list";
import NoFilmsView from "../view/no-films";
import ShowMoreButtonView from "../view/show-more-button";
import FilmPresenter from "./film";
import {render, RenderPlace} from "../utils/render";

const FILMS_COUNT_PER_STEP = 5;
const FILMS_EXTRA_COUNT = 2;

export default class Films {
  constructor(filmsContainer) {
    this._sortComponent = new SortView();
    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsPopularListComponent = new FilmsPopularListView();
    this._filmsCommentedListComponent = new FilmsCommentedListView();
    this._noFilmsComponent = new NoFilmsView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._films = null;
    this._filmsContainer = filmsContainer;
    this._filmsListContainer = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
    this._filmsPopularListContainer = this._filmsPopularListComponent.getElement().querySelector(`.films-list__container`);
    this._filmsCommentedListContainer = this._filmsCommentedListComponent.getElement().querySelector(`.films-list__container`);
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
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

  _renderFilm(filmsListContainer, film) {
    const filmPresenter = new FilmPresenter(filmsListContainer);
    filmPresenter.init(film);
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

    for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
      this._renderFilm(this._filmsPopularListContainer, filmsPopular[i]);
    }

    render(this._filmsComponent, this._filmsPopularListComponent, RenderPlace.BEFOREEND);
  }

  _renderCommentedFilmsList() {
    const filmsCommented = this._films.slice(0, FILMS_EXTRA_COUNT);

    for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
      this._renderFilm(this._filmsCommentedListContainer, filmsCommented[i]);
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
