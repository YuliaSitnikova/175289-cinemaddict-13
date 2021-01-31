import FilmCardView from "../view/film-card";
import FilmPopupView from "../view/film-popup";
import {FilmMode, FilmState, UserAction, UpdateType} from "../constants";
import {RenderPlace, render, remove, replace} from "../utils/render";
import dayjs from "dayjs";

export default class Film {
  constructor(filmContainer, changeData, changeModeHandler, showPopupHandler, closePopupHandler, api, commentsModel) {
    this._filmsListComponent = filmContainer;
    this._changeData = changeData;
    this._changeModeHandler = changeModeHandler;
    this._showPopupHandler = showPopupHandler;
    this._closePopupHandler = closePopupHandler;
    this._api = api;
    this._commentsModel = commentsModel;

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
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._documentKeydownHandler = this._documentKeydownHandler.bind(this);
    this._documentKeypressHandler = this._documentKeypressHandler.bind(this);
  }

  init(film) {
    this._film = film;

    this._filmComponent = new FilmCardView(film);
    this._setHandlers();

    render(this._filmContainer, this._filmComponent, RenderPlace.BEFOREEND);
  }

  update(film) {
    const prevFilmComponent = this._filmComponent;

    this._film = film;
    this._filmComponent = new FilmCardView(film);
    this._setHandlers();

    replace(this._filmComponent, prevFilmComponent);
    remove(prevFilmComponent);
  }

  updatePopup(film) {
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._film = film;
    this._comments = this._commentsModel.getComments(this._film.id);
    this._filmPopupComponent = new FilmPopupView(film, this._comments);
    this._setPopupHandlers();

    replace(this._filmPopupComponent, prevFilmPopupComponent);
    remove(prevFilmPopupComponent);
  }

  hidePopup() {
    if (this._mode === FilmMode.POPUP) {
      this._hidePopup();
    }
  }

  setViewState(state, comment) {
    const resetViewState = () => {
      this._filmPopupComponent.updateData({
        isSavingComment: false,
        isDeletingComment: false,
        deletingComment: null
      }, true);
    };

    switch (state) {
      case FilmState.SAVING_COMMENT:
        this._filmPopupComponent.updateData({
          isSavingComment: true
        }, true);
        break;
      case FilmState.DELETING_COMMENT:
        this._filmPopupComponent.updateData({
          isDeletingComment: true,
          deletingComment: comment
        }, true);
        break;
      case FilmState.ABORTING:
        this._filmPopupComponent.shake(resetViewState);
        break;
    }
  }

  destroy() {
    remove(this._filmComponent);
  }

  getMode() {
    return this._mode;
  }

  _hidePopup() {
    remove(this._filmPopupComponent);
    this._filmPopupContainer.classList.remove(`hide-overflow`);
    this._mode = FilmMode.DEFAULT;

    document.removeEventListener(`keydown`, this._documentKeydownHandler);
    document.removeEventListener(`keypress`, this._documentKeypressHandler);

    this._closePopupHandler();
  }

  _showPopup() {
    this._changeModeHandler();

    this._comments = this._commentsModel.getComments(this._film.id);
    this._filmPopupComponent = new FilmPopupView(this._film, this._comments);
    this._setPopupHandlers();

    render(this._filmPopupContainer, this._filmPopupComponent, RenderPlace.BEFOREEND);
    this._filmPopupContainer.classList.add(`hide-overflow`);
    this._mode = FilmMode.POPUP;

    document.addEventListener(`keydown`, this._documentKeydownHandler);
    document.addEventListener(`keypress`, this._documentKeypressHandler);

    this._showPopupHandler(this._film.id);

    this._api.getComments(this._film.id)
      .then((comments) => {
        this._commentsModel.setComments(this._film.id, comments);
        this._comments = comments;
        this.updatePopup(this._film);
      })
      .catch(() => this._commentsModel.setComments(this._film.id, []));
  }

  _documentKeypressHandler(evt) {
    if (evt.ctrlKey && evt.keyCode === 10) {
      const data = this._filmPopupComponent.getData();
      const emoji = data.selectedEmoji;
      const message = data.message;

      if (data.isSavingComment || emoji === null || message === ``) {
        return;
      }

      const update = {
        id: this._film.id,
        comment: {
          date: dayjs().toDate(),
          emoji,
          message
        }
      };

      this._changeData(UserAction.ADD_COMMENT, UpdateType.PATCH, update);
    }
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
      isWatched: !this._film.isWatched,
      watchingDate: !this._film.isWatched ? dayjs() : null
    });
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, update);
  }

  _handleFavoriteClick() {
    const update = Object.assign({}, this._film, {
      isFavorite: !this._film.isFavorite
    });
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, update);
  }

  _handleDeleteCommentClick(id) {
    const update = {
      film: Object.assign({}, this._film, {
        comments: this._film.comments.filter((comment) => comment !== id)
      }),
      id
    };
    this._changeData(UserAction.DELETE_COMMENT, UpdateType.MINOR, update);
  }

  _setHandlers() {
    this._filmComponent.setOpenClickHandler(this._handleOpenClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  _setPopupHandlers() {
    this._filmPopupComponent.setCloseClickHandler(this._handleCloseClick);
    this._filmPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmPopupComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);
  }
}
