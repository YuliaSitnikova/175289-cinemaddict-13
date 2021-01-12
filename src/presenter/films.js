import SortView from "../view/sort";
import FilmsView from "../view/films";
import FilmsListView from "../view/films-list";
import FilmsPopularListView from "../view/films-popular-list";
import FilmsCommentedListView from "../view/films-commented-list";
import NoFilmsView from "../view/no-films";
import ShowMoreButtonView from "../view/show-more-button";
import FilmPresenter from "./film";
import {update} from "../utils/common";
import {render, RenderPlace} from "../utils/render";
import {SortType} from "../constants";
import dayjs from "dayjs";

const FILMS_COUNT_PER_STEP = 5;
const FILMS_EXTRA_COUNT = 2;

const sortByDate = (filmA, filmB) => {
  return dayjs(filmB.release).diff(dayjs(filmA.release));
};

const sortByRating = (filmA, filmB) => {
  if (filmA.rating === filmB.rating) {
    return 0;
  }
  return (filmA.rating < filmB.rating) ? 1 : -1;
};

export default class Films {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._filmPresenter = new Map();
    this._films = null;
    this._sourcedFilms = null;
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = new SortView();
    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsPopularListComponent = new FilmsPopularListView();
    this._filmsCommentedListComponent = new FilmsCommentedListView();
    this._noFilmsComponent = new NoFilmsView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();

    if (this._films.length === 0) {
      this._renderNoFilms();
    } else {
      this._renderSort();
      this._renderFilmsList();
      render(this._filmsComponent, this._filmsListComponent, RenderPlace.BEFOREEND);
      // this._renderPopularFilmsList();
      // this._renderCommentedFilmsList();
    }

    render(this._filmsContainer, this._filmsComponent, RenderPlace.BEFOREEND);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films.sort(sortByDate);
        break;
      case SortType.RATING:
        this._films.sort(sortByRating);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _clearFilmsList() {
    this._filmPresenter.forEach((presenter) => presenter.destroy());
  }

  _handleSortTypeChange(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmsList();
    this._renderFilmsList();
  }

  _renderSort() {
    render(this._filmsContainer, this._sortComponent, RenderPlace.BEFOREEND);
    this._sortComponent.setTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleFilmChange(film) {
    this._films = update(this._films, film);
    this._filmPresenter.get(film.id).update(film);
  }

  _handleModeChange() {
    this._filmPresenter.forEach((presenter) => presenter.closePopup());
  }

  _renderFilm(filmsListComponent, film) {
    const filmPresenter = new FilmPresenter(filmsListComponent, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter.set(film.id, filmPresenter);
  }

  _renderFilms(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilm(this._filmsListComponent, film));
  }

  _renderFilmsList() {
    this._renderFilms(0, Math.min(this._films.length, FILMS_COUNT_PER_STEP));

    if (this._films.length > FILMS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
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
      this._renderFilm(this._filmsPopularListComponent, filmsPopular[i]);
    }

    render(this._filmsComponent, this._filmsPopularListComponent, RenderPlace.BEFOREEND);
  }

  _renderCommentedFilmsList() {
    const filmsCommented = this._films.slice(0, FILMS_EXTRA_COUNT);

    for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
      this._renderFilm(this._filmsCommentedListComponent, filmsCommented[i]);
    }

    render(this._filmsComponent, this._filmsCommentedListComponent, RenderPlace.BEFOREEND);
  }

  _renderNoFilms() {
    render(this._filmsComponent, this._noFilmsComponent, RenderPlace.BEFOREEND);
  }
}
