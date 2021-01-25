import FilmCardView from "../view/film-card";
import FilmPopupView from "../view/film-popup";
import {UserAction, UpdateType} from "../constants";
import {RenderPlace, render, remove, replace} from "../utils/render";
import {generateId, generateUserName} from "../utils/common";
import dayjs from "dayjs";

export default class Film {
  constructor(filmContainer, changeData, changeMode) {
    this._filmsListComponent = filmContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._filmContainer = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
    this._filmPopupContainer = document.body;
    this._film = null;
    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._isOpen = false;

    this._handleOpenClick = this._handleOpenClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormKeypress = this._handleFormKeypress.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._documentKeydownHandler = this._documentKeydownHandler.bind(this);
  }

  init(film) {
    this._film = film;
    this._filmComponent = new FilmCardView(film);

    this._filmComponent.setOpenClickHandler(this._handleOpenClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    render(this._filmContainer, this._filmComponent, RenderPlace.BEFOREEND);
  }

  update(film) {
    const prevFilmComponent = this._filmComponent;

    this._film = film;
    this._filmComponent = new FilmCardView(film);

    this._filmComponent.setOpenClickHandler(this._handleOpenClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (this._filmContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._isOpen) {
      this._filmPopupComponent.updateData(film, true);
    }

    remove(prevFilmComponent);
  }

  getId() {
    return this._film.id;
  }

  closePopup() {
    if (this._isOpen) {
      this._closePopup();
    }
  }

  destroy() {
    remove(this._filmComponent);
  }

  _documentKeydownHandler(evt) {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _closePopup() {
    remove(this._filmPopupComponent);
    this._filmPopupContainer.classList.remove(`hide-overflow`);
    this._isOpen = false;
    document.removeEventListener(`keydown`, this._documentKeydownHandler);
  }

  _showPopup() {
    this._changeMode();

    this._filmPopupComponent = new FilmPopupView(this._film);

    this._filmPopupComponent.setCloseClickHandler(this._handleCloseClick);
    this._filmPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmPopupComponent.setFormKeypressHandler(this._handleFormKeypress);
    this._filmPopupComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);

    this._filmPopupContainer.appendChild(this._filmPopupComponent.getElement());
    this._filmPopupContainer.classList.add(`hide-overflow`);
    this._isOpen = true;
    document.addEventListener(`keydown`, this._documentKeydownHandler);
  }

  _handleOpenClick() {
    this._showPopup();
  }

  _handleCloseClick() {
    this._closePopup();
  }

  _handleWatchlistClick() {
    const update = Object.assign({}, this._film, {
      isWatch: !this._film.isWatch
    });
    this._changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, update);
  }

  _handleWatchedClick() {
    const update = Object.assign({}, this._film, {
      isWatched: !this._film.isWatched
    });
    this._changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, update);
  }

  _handleFavoriteClick() {
    const update = Object.assign({}, this._film, {
      isFavorite: !this._film.isFavorite
    });
    this._changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, update);
  }

  _handleFormKeypress(emoji, message) {
    const newComment = {
      id: generateId(),
      name: generateUserName(),
      date: dayjs(),
      emoji,
      message
    };

    const update = Object.assign({}, this._film, {
      comments: [...this._film.comments, newComment]
    });

    this._changeData(UserAction.ADD_COMMENT, UpdateType.PATCH, update);
  }

  _handleDeleteCommentClick(id) {
    const update = Object.assign({}, this._film, {
      comments: this._film.comments.filter((comment) => comment.id !== Number(id))
    });
    this._changeData(UserAction.DELETE_COMMENT, UpdateType.PATCH, update);
  }
}
