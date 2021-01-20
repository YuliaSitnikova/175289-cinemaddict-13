import SortView from "../view/sort";
import FilmsView from "../view/films";
import FilmsListView from "../view/films-list";
import FilmsPopularListView from "../view/films-popular-list";
import FilmsCommentedListView from "../view/films-commented-list";
import NoFilmsView from "../view/no-films";
import ShowMoreButtonView from "../view/show-more-button";
import FilmPresenter from "./film";
import {SortType, UserAction, UpdateType} from "../constants";
import {RenderPlace, render, remove} from "../utils/render";
import {filter} from "../utils/filter";
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

const sortByCommentCount = (filmA, filmB) => {
  if (filmA.comments.length === filmB.comments.length) {
    return 0;
  }
  return (filmA.comments.length < filmB.comments.length) ? 1 : -1;
};

export default class Films {
  constructor(filmsContainer, filmsModel, filterModel) {
    this._filmsContainer = filmsContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._filmPresenter = new Map();
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = null;
    this._showMoreButtonComponent = null;
    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsPopularListComponent = new FilmsPopularListView();
    this._filmsCommentedListComponent = new FilmsCommentedListView();
    this._noFilmsComponent = new NoFilmsView();

    this._handleViewChange = this._handleViewChange.bind(this);
    this._handleModelChange = this._handleModelChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleFilmModeChange = this._handleFilmModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);

    this._filmsModel.addObserver(this._handleModelChange);
    this._filterModel.addObserver(this._handleModelChange);
  }

  init() {
    render(this._filmsContainer, this._filmsComponent, RenderPlace.BEFOREEND);
    this._renderFilms();
  }

  _getFilms() {
    // debugger;
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortByRating);
    }

    return filteredFilms;
  }

  _getPopularFilms() {
    return this._filmsModel.getFilms().slice().sort(sortByRating);
  }

  _getCommentedFilms() {
    return this._filmsModel.getFilms().slice().sort(sortByCommentCount);
  }

  _handleViewChange(changeType, updateType, update) {
    switch (changeType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _handleModelChange(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmPresenter.forEach((presenter) => {
          if (presenter.getId() === data.id) {
            presenter.update(data);
          }
        });
        break;
      case UpdateType.MINOR:
        this._clearFilms();
        this._renderFilms();
        break;
      case UpdateType.MAJOR:
        this._clearFilms({resetSortType: true});
        this._renderFilms();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilms();
    this._renderFilms();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setTypeChangeHandler(this._handleSortTypeChange);

    this._filmsContainer.insertBefore(this._sortComponent.getElement(), this._filmsComponent.getElement());
  }

  _renderNoFilms() {
    render(this._filmsComponent, this._noFilmsComponent, RenderPlace.BEFOREEND);
  }

  _handleFilmModeChange() {
    this._filmPresenter.forEach((presenter) => presenter.closePopup());
  }

  _renderFilm(filmContainer, film) {
    const filmPresenter = new FilmPresenter(filmContainer, this._handleViewChange, this._handleFilmModeChange);
    filmPresenter.init(film);
    this._filmPresenter.set(filmPresenter, filmPresenter);
  }

  _renderFilmsElements(films) {
    films.forEach((film) => this._renderFilm(this._filmsListComponent, film));
  }

  _handleShowMoreButtonClick() {
    const films = this._getFilms();
    const filmsCount = films.length;
    const newRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);
    const renderedfilms = films.slice(this._renderedFilmsCount, newRenderedFilmsCount);

    this._renderFilmsElements(renderedfilms);
    this._renderedFilmsCount = newRenderedFilmsCount;

    if (this._renderedFilmsCount >= filmsCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPlace.BEFOREEND);
  }

  _renderPopularFilmsList() {
    const filmsPopular = this._getPopularFilms().slice(0, FILMS_EXTRA_COUNT);

    for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
      this._renderFilm(this._filmsPopularListComponent, filmsPopular[i]);
    }

    render(this._filmsComponent, this._filmsPopularListComponent, RenderPlace.BEFOREEND);
  }

  _renderCommentedFilmsList() {
    const filmsCommented = this._getCommentedFilms().slice(0, FILMS_EXTRA_COUNT);

    for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
      this._renderFilm(this._filmsCommentedListComponent, filmsCommented[i]);
    }

    render(this._filmsComponent, this._filmsCommentedListComponent, RenderPlace.BEFOREEND);
  }

  _clearFilms({resetSortType = false} = {}) {
    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;

    remove(this._noFilmsComponent);
    remove(this._sortComponent);
    remove(this._filmsListComponent);
    remove(this._showMoreButtonComponent);
    remove(this._filmsPopularListComponent);
    remove(this._filmsCommentedListComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderFilms() {
    const films = this._getFilms();
    const filmsCount = films.length;

    if (filmsCount === 0) {
      this._renderNoFilms();
    } else {
      this._renderSort();

      render(this._filmsComponent, this._filmsListComponent, RenderPlace.BEFOREEND);
      this._renderFilmsElements(films.slice(0, Math.min(filmsCount, this._renderedFilmsCount)));
      if (filmsCount > FILMS_COUNT_PER_STEP) {
        this._renderShowMoreButton();
      }
    }

    this._renderPopularFilmsList();
    this._renderCommentedFilmsList();
  }
}
