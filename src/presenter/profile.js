import ProfileView from "../view/profile";
import {RenderPlace, render, remove} from "../utils/render";

export default class Profile {
  constructor(profileContainer, filmsModel) {
    this._profileContainer = profileContainer;
    this._filmsModel = filmsModel;
    this._profileComponent = null;

    this._handleModelChange = this._handleModelChange.bind(this);

    this._filmsModel.addObserver(this._handleModelChange);
  }

  init() {
    const watchedFilmsCount = this._getWatchedFilmCount();

    if (watchedFilmsCount !== 0) {
      this._profileComponent = new ProfileView();
      render(this._profileContainer, this._profileComponent, RenderPlace.BEFOREEND);
    }
  }

  _update() {
    remove(this._profileComponent);
    this.init();
  }

  _getWatchedFilmCount() {
    const films = this._filmsModel.getFilms();
    const watchedFilms = films.filter((film) => film.isWatched);
    return watchedFilms.length;
  }

  _handleModelChange() {
    this._update();
  }
}
