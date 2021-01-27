import SortView from "../view/sort";
import FilmsView from "../view/films";
import FilmsListView from "../view/films-list";
import FilmsPopularListView from "../view/films-popular-list";
import FilmsCommentedListView from "../view/films-commented-list";
import NoFilmsView from "../view/no-films";
import ShowMoreButtonView from "../view/show-more-button";
import FilmPresenter from "./film";
import {SortType, FilmMode, UserAction, UpdateType} from "../constants";
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
    this._filmPresenters = {
      'main': {},
      'popular': {},
      'commented': {},
      'popup': null
    };
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
    this._handleBeforeModeChange = this._handleBeforeModeChange.bind(this);
    this._handleAfterModeChange = this._handleAfterModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init() {
    render(this._filmsContainer, this._filmsComponent, RenderPlace.BEFOREEND);

    this._filmsModel.addObserver(this._handleModelChange);
    this._filterModel.addObserver(this._handleModelChange);

    this._renderFilms();
  }

  destroy() {
    this._clearFilms({resetSortType: true});

    remove(this._filmsComponent);

    this._filmsModel.removeObserver(this._handleModelChange);
    this._filterModel.removeObserver(this._handleModelChange);
  }

  _getFilms() {
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
        this._filmsModel.update(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._filmsModel.update(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._filmsModel.update(updateType, update);
        break;
    }
  }

  _handleModelChange(updateType, update) {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this._filmPresenters.main[update.id]) {
          this._filmPresenters.main[update.id].init(update);
        }
        if (this._filmPresenters.popular[update.id]) {
          this._filmPresenters.popular[update.id].init(update);
        }
        if (this._filmPresenters.commented[update.id]) {
          this._filmPresenters.commented[update.id].init(update);
        }
        break;
      case UpdateType.MINOR:
        this._clearFilms();
        this._renderFilms();
        break;
      case UpdateType.MAJOR:
        this._clearFilms({resetRenderedFilmCount: true, resetSortType: true});
        this._renderFilms();
        break;
    }

    if (this._filmPresenters.popup) {
      this._filmPresenters.popup.init(update);
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

  _handleBeforeModeChange() {
    Object
      .values(this._filmPresenters.main)
      .forEach((presenter) => presenter.hidePopup());

    Object
      .values(this._filmPresenters.popular)
      .forEach((presenter) => presenter.hidePopup());

    Object
      .values(this._filmPresenters.commented)
      .forEach((presenter) => presenter.hidePopup());
  }

  _handleAfterModeChange() {
    for (const id of Object.keys(this._filmPresenters.main)) {
      if (this._filmPresenters.main[id].getMode() === FilmMode.POPUP) {
        this._filmPresenters.popup = this._filmPresenters.main[id];
        return;
      }
    }

    for (const id of Object.keys(this._filmPresenters.popular)) {
      if (this._filmPresenters.popular[id].getMode() === FilmMode.POPUP) {
        this._filmPresenters.popup = this._filmPresenters.popular[id];
        return;
      }
    }

    for (const id of Object.keys(this._filmPresenters.commented)) {
      if (this._filmPresenters.commented[id].getMode() === FilmMode.POPUP) {
        this._filmPresenters.popup = this._filmPresenters.commented[id];
        return;
      }
    }

    this._filmPresenters.popup = null;
  }

  _renderFilm(filmContainer, filmPresenters, film) {
    const filmPresenter = new FilmPresenter(filmContainer, this._handleViewChange, this._handleBeforeModeChange, this._handleAfterModeChange);
    filmPresenter.init(film);
    filmPresenters[film.id] = filmPresenter;
  }

  _renderFilmsElements(films) {
    films.forEach((film) => this._renderFilm(this._filmsListComponent, this._filmPresenters.main, film));
  }

  _handleShowMoreButtonClick() {
    const films = this._getFilms();
    const filmsCount = films.length;
    const newRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);
    const renderedFilms = films.slice(this._renderedFilmsCount, newRenderedFilmsCount);

    this._renderFilmsElements(renderedFilms);
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
    const films = this._getPopularFilms();
    const filmsCount = films.length;
    const renderedFilms = films.slice(0, Math.min(filmsCount, FILMS_EXTRA_COUNT));

    renderedFilms.forEach((film) => this._renderFilm(this._filmsPopularListComponent, this._filmPresenters.popular, film));
    render(this._filmsComponent, this._filmsPopularListComponent, RenderPlace.BEFOREEND);
  }

  _renderCommentedFilmsList() {
    const films = this._getCommentedFilms();
    const filmsCount = films.length;
    const renderedFilms = films.slice(0, Math.min(filmsCount, FILMS_EXTRA_COUNT));

    renderedFilms.forEach((film) => this._renderFilm(this._filmsCommentedListComponent, this._filmPresenters.commented, film));
    render(this._filmsComponent, this._filmsCommentedListComponent, RenderPlace.BEFOREEND);
  }

  _clearFilms({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    Object
      .values(this._filmPresenters.main)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenters.main = {};

    Object
      .values(this._filmPresenters.popular)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenters.popular = {};

    Object
      .values(this._filmPresenters.commented)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenters.commented = {};

    remove(this._noFilmsComponent);
    remove(this._sortComponent);
    remove(this._filmsListComponent);
    remove(this._showMoreButtonComponent);
    remove(this._filmsPopularListComponent);
    remove(this._filmsCommentedListComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(this._getFilms().length, this._renderedFilmsCount);
    }

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
      if (filmsCount > this._renderedFilmsCount) {
        this._renderShowMoreButton();
      }
    }

    this._renderPopularFilmsList();
    this._renderCommentedFilmsList();
  }
}
