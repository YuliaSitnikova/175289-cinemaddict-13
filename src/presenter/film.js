import FilmCardView from "../view/film-card";
import FilmPopupView from "../view/film-popup";
import {FilmMode, UserAction, UpdateType} from "../constants";
import {RenderPlace, render, remove, replace} from "../utils/render";
import {generateId, generateUserName} from "../utils/common";
import dayjs from "dayjs";

export default class Film {
  constructor(filmContainer, changeData, changeModeHandler, showPopupHandler, closePopupHandler) {
    this._filmsListComponent = filmContainer;
    this._changeData = changeData;
    this._changeModeHandler = changeModeHandler;
    this._showPopupHandler = showPopupHandler;
    this._closePopupHandler = closePopupHandler;
    this._filmContainer = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
    this._filmPopupContainer = document.body;
    this._film = null;
    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._mode = FilmMode.DEFAULT;

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
    const prevFilmComponent = this._filmComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._film = film;

    this._filmComponent = new FilmCardView(film);
    this._filmComponent.setOpenClickHandler(this._handleOpenClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._filmPopupComponent = new FilmPopupView(this._film);
    this._filmPopupComponent.setCloseClickHandler(this._handleCloseClick);
    this._filmPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmPopupComponent.setFormKeypressHandler(this._handleFormKeypress);
    this._filmPopupComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);

    if (prevFilmComponent === null && prevFilmPopupComponent === null) {
      render(this._filmContainer, this._filmComponent, RenderPlace.BEFOREEND);
      return;
    }

    if (this._mode === FilmMode.DEFAULT) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._mode === FilmMode.POPUP) {
      replace(this._filmPopupComponent, prevFilmPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevFilmPopupComponent);
  }

  destroy() {
    remove(this._filmComponent);

    if (this._mode === FilmMode.DEFAULT) {
      remove(this._filmPopupComponent);
    }
  }

  getMode() {
    return this._mode;
  }

  // updatePopup(update) {
  //   this._filmPopupComponent.updateData(update, true);
  // }

  hidePopup() {
    if (this._mode === FilmMode.POPUP) {
      this._hidePopup();
    }
  }

  _hidePopup() {
    this._filmPopupContainer.removeChild(this._filmPopupComponent.getElement());
    this._filmPopupContainer.classList.remove(`hide-overflow`);
    this._mode = FilmMode.DEFAULT;
    document.removeEventListener(`keydown`, this._documentKeydownHandler);
    this._closePopupHandler();
  }

  _showPopup() {
    this._changeModeHandler();
    this._filmPopupContainer.appendChild(this._filmPopupComponent.getElement());
    this._filmPopupContainer.classList.add(`hide-overflow`);
    this._mode = FilmMode.POPUP;
    document.addEventListener(`keydown`, this._documentKeydownHandler);
    this._showPopupHandler(this._film.id);
  }

  _documentKeydownHandler(evt) {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      evt.preventDefault();
      this._hidePopup();
    }
  }

  _handleOpenClick() {
    this._showPopup();
  }

  _handleCloseClick() {
    this._hidePopup();
  }

  _handleWatchlistClick() {
    const update = Object.assign({}, this._film, {
      isWatch: !this._film.isWatch
    });
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, update);
  }

  _handleWatchedClick() {
    const update = Object.assign({}, this._film, {
      isWatched: !this._film.isWatched
    });
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, update);
  }

  _handleFavoriteClick() {
    const update = Object.assign({}, this._film, {
      isFavorite: !this._film.isFavorite
    });
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, update);
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

    this._changeData(UserAction.ADD_COMMENT, UpdateType.MINOR, update);
  }

  _handleDeleteCommentClick(id) {
    const update = Object.assign({}, this._film, {
      comments: this._film.comments.filter((comment) => comment.id !== Number(id))
    });
    this._changeData(UserAction.DELETE_COMMENT, UpdateType.MINOR, update);
  }
}
