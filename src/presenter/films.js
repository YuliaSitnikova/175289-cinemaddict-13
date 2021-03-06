import SortView from "../view/sort";
import FilmsView from "../view/films";
import FilmsListView from "../view/films-list";
import FilmsPopularListView from "../view/films-popular-list";
import FilmsCommentedListView from "../view/films-commented-list";
import NoFilmsView from "../view/no-films";
import Loading from "../view/loading";
import ShowMoreButtonView from "../view/show-more-button";
import FilmPresenter from "./film";
import {FilterType, SortType, FilmMode, FilmState, UserAction, UpdateType} from "../constants";
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
  constructor(filmsContainer, filmsModel, commentsModel, filterModel, api) {
    this._filmsContainer = filmsContainer;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;
    this._api = api;
    this._filmPresenters = {
      main: {},
      popular: {},
      commented: {},
      popup: {
        id: null,
        presenter: null
      }
    };
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._sortComponent = null;
    this._showMoreButtonComponent = null;
    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsPopularListComponent = new FilmsPopularListView();
    this._filmsCommentedListComponent = new FilmsCommentedListView();
    this._noFilmsComponent = new NoFilmsView();
    this._loadingComponent = new Loading();

    this._handleViewChange = this._handleViewChange.bind(this);
    this._handleModelChange = this._handleModelChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleChangeMode = this._handleChangeMode.bind(this);
    this._handlePopupShow = this._handlePopupShow.bind(this);
    this._handlePopupClose = this._handlePopupClose.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init() {
    render(this._filmsContainer, this._filmsComponent, RenderPlace.BEFOREEND);

    this._filmsModel.addObserver(this._handleModelChange);
    this._filterModel.addObserver(this._handleModelChange);

    this._renderFilms();
  }

  destroy() {
    this._clearFilms({resetRenderedFilmCount: true, resetSortType: true});

    remove(this._filmsComponent);

    this._filmsModel.removeObserver(this._handleModelChange);
    this._filterModel.removeObserver(this._handleModelChange);
  }

  _handleViewChange(changeType, updateType, update) {
    switch (changeType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update).then((response) => {
          this._filmsModel.update(updateType, response);
        });
        break;
      case UserAction.ADD_COMMENT:
        this._filmPresenters.popup.presenter.setViewState(FilmState.SAVING_COMMENT);
        this._api.addComment(update)
          .then(({updatedFilm, comments}) => {
            this._commentsModel.setComments(updatedFilm.id, comments);
            this._filmsModel.update(updateType, updatedFilm);
            this._handleCommentUpdate();
          })
          .catch(() => this._filmPresenters.popup.presenter.setViewState(FilmState.ABORTING));
        break;
      case UserAction.DELETE_COMMENT:
        this._filmPresenters.popup.presenter.setViewState(FilmState.DELETING_COMMENT, update.comment.id);
        this._api.deleteComment(update)
          .then(() => {
            this._commentsModel.deleteComment(update.film.id, update.comment.id);
            this._filmsModel.update(updateType, update.film);
            this._handleCommentUpdate();
          })
          .catch(() => this._filmPresenters.popup.presenter.setViewState(FilmState.ABORTING));
        break;
    }
  }

  _handleModelChange(updateType, update) {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this._filmPresenters.main[update.id]) {
          this._filmPresenters.main[update.id].update(update);
        }
        if (this._filmPresenters.popular[update.id]) {
          this._filmPresenters.popular[update.id].update(update);
        }
        if (this._filmPresenters.commented[update.id]) {
          this._filmPresenters.commented[update.id].update(update);
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilms();
        break;
    }

    if (update && update.id === this._filmPresenters.popup.id) {
      this._filmPresenters.popup.presenter.updatePopup(update);
    }
  }

  _handleCommentUpdate() {
    remove(this._filmsCommentedListComponent);

    const commentedFilms = this._getCommentedFilms();
    const commentedFilmsCount = commentedFilms.length;

    if (commentedFilmsCount > 0) {
      this._renderCommentedFilmsList(commentedFilms.slice(0, Math.min(commentedFilmsCount, FILMS_EXTRA_COUNT)));
    }
  }

  _handleSortTypeChange(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilms({resetRenderedFilmCount: true});
    this._renderFilms();
  }

  _getFilms() {
    const films = this._filmsModel.getFilms();
    const filterType = this._filterModel.getFilter() || FilterType.ALL;
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
    const films = this._filmsModel.getFilms();
    const filteredFilms = films.filter((film) => film.rating !== 0);

    return filteredFilms.sort(sortByRating);
  }

  _getCommentedFilms() {
    const films = this._filmsModel.getFilms();
    const filteredFilms = films.filter((film) => film.comments.length !== 0);

    return filteredFilms.sort(sortByCommentCount);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setTypeChangeHandler(this._handleSortTypeChange);

    this._filmsContainer.insertBefore(this._sortComponent.getElement(), this._filmsComponent.getElement());
  }

  _renderLoading() {
    render(this._filmsComponent, this._loadingComponent, RenderPlace.BEFOREEND);
  }

  _renderNoFilms() {
    render(this._filmsComponent, this._noFilmsComponent, RenderPlace.BEFOREEND);
  }

  _handleChangeMode() {
    Object
      .values(this._filmPresenters.main)
      .forEach((presenter) => presenter.hidePopup());

    Object
      .values(this._filmPresenters.popular)
      .forEach((presenter) => presenter.hidePopup());

    Object
      .values(this._filmPresenters.commented)
      .forEach((presenter) => presenter.hidePopup());

    if (this._filmPresenters.popup.presenter) {
      this._filmPresenters.popup.presenter.hidePopup();
    }
  }

  _handlePopupShow(id) {
    this._filmPresenters.popup.id = id;

    if (this._filmPresenters.main[id] && this._filmPresenters.main[id].getMode() === FilmMode.POPUP) {
      this._filmPresenters.popup.presenter = this._filmPresenters.main[id];
      return;
    }

    if (this._filmPresenters.popular[id] && this._filmPresenters.popular[id].getMode() === FilmMode.POPUP) {
      this._filmPresenters.popup.presenter = this._filmPresenters.popular[id];
      return;
    }

    if (this._filmPresenters.commented[id] && this._filmPresenters.commented[id].getMode() === FilmMode.POPUP) {
      this._filmPresenters.popup.presenter = this._filmPresenters.commented[id];
      return;
    }
  }

  _handlePopupClose() {
    this._filmPresenters.popup.id = null;
    this._filmPresenters.popup.presenter = null;
  }

  _renderFilm(filmContainer, filmPresenters, film) {
    const filmPresenter = new FilmPresenter(
        filmContainer,
        this._handleViewChange,
        this._handleChangeMode,
        this._handlePopupShow,
        this._handlePopupClose,
        this._api,
        this._commentsModel
    );
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

  _renderPopularFilmsList(films) {
    films.forEach((film) => this._renderFilm(this._filmsPopularListComponent, this._filmPresenters.popular, film));
    render(this._filmsComponent, this._filmsPopularListComponent, RenderPlace.BEFOREEND);
  }

  _renderCommentedFilmsList(films) {
    films.forEach((film) => this._renderFilm(this._filmsCommentedListComponent, this._filmPresenters.commented, film));
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

    remove(this._loadingComponent);
    remove(this._noFilmsComponent);
    remove(this._sortComponent);
    remove(this._filmsListComponent);
    remove(this._showMoreButtonComponent);
    remove(this._filmsPopularListComponent);
    remove(this._filmsCommentedListComponent);

    this._renderedFilmsCount = resetRenderedFilmCount ? FILMS_COUNT_PER_STEP : Math.min(this._getFilms().length, this._renderedFilmsCount);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderFilms() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const films = this._getFilms();
    const filmsCount = films.length;

    if (filmsCount === 0) {
      this._renderNoFilms();
    } else {
      this._renderSort();
      this._renderFilmsElements(films.slice(0, Math.min(filmsCount, this._renderedFilmsCount)));
      if (filmsCount > this._renderedFilmsCount) {
        this._renderShowMoreButton();
      }
      render(this._filmsComponent, this._filmsListComponent, RenderPlace.BEFOREEND);
    }

    const popularFilms = this._getPopularFilms();
    const popularFilmsCount = popularFilms.length;

    if (popularFilmsCount > 0) {
      this._renderPopularFilmsList(popularFilms.slice(0, Math.min(popularFilmsCount, FILMS_EXTRA_COUNT)));
    }

    const commentedFilms = this._getCommentedFilms();
    const commentedFilmsCount = commentedFilms.length;

    if (commentedFilmsCount > 0) {
      this._renderCommentedFilmsList(commentedFilms.slice(0, Math.min(commentedFilmsCount, FILMS_EXTRA_COUNT)));
    }
  }
}
