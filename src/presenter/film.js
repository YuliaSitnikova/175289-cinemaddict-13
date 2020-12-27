import FilmCardView from "../view/film-card";
import FilmPopupView from "../view/film-popup";
import {RenderPlace, render, remove, replace} from "../utils/render";

export default class Film {
  constructor(filmsListComponent, changeData) {
    this._filmsListComponent = filmsListComponent;
    this._changeData = changeData;
    this._filmsListContainer = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
    this._filmPopupContainer = document.body;
    this._film = null;
    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._handleOpenClick = this._handleOpenClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._onEscKeydown = this._onEscKeydown.bind(this);
  }

  init(film) {
    this._film = film;
    this._filmComponent = new FilmCardView(film);
    this._filmPopupComponent = new FilmPopupView(film);
    this._setHandlers();
    render(this._filmsListContainer, this._filmComponent, RenderPlace.BEFOREEND);
  }

  update(film) {
    this._film = film;
    const prevFilmComponent = this._filmComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;
    this._filmComponent = new FilmCardView(film);
    this._filmPopupComponent = new FilmPopupView(film);

    this._setHandlers();

    if (this._filmsListContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._filmPopupContainer.contains(prevFilmPopupComponent.getElement())) {
      replace(this._filmPopupComponent, prevFilmPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevFilmPopupComponent);
  }

  _setHandlers() {
    this._filmComponent.setOpenClickHandler(this._handleOpenClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmPopupComponent.setCloseClickHandler(this._handleCloseClick);
    this._filmPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  _onEscKeydown(evt) {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      evt.preventDefault();
      this._closeFilmDetail();
    }
  }

  _showFilmDetail() {
    this._filmPopupContainer.classList.add(`hide-overflow`);
    this._filmPopupContainer.appendChild(this._filmPopupComponent.getElement());
    document.addEventListener(`keydown`, this._onEscKeydown);
  }

  _closeFilmDetail() {
    this._filmPopupContainer.classList.remove(`hide-overflow`);
    this._filmPopupContainer.removeChild(this._filmPopupComponent.getElement());
    document.removeEventListener(`keydown`, this._onEscKeydown);
  }

  _handleOpenClick() {
    this._showFilmDetail();
  }

  _handleWatchlistClick() {
    this._changeData(Object.assign({}, this._film, {isWatch: !this._film.isWatch}));
  }

  _handleWatchedClick() {
    this._changeData(Object.assign({}, this._film, {isWatched: !this._film.isWatched}));
  }

  _handleFavoriteClick() {
    this._changeData(Object.assign({}, this._film, {isFavorite: !this._film.isFavorite}));
  }

  _handleCloseClick() {
    this._closeFilmDetail();
  }
}
