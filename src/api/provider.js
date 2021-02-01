import FilmModel from "../model/films";

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (this._isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmModel.adaptToServer));
          this._store.setItems(items);
          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());

    return Promise.resolve(storeFilms.map(FilmModel.adaptToClient));
  }

  getComments(filmId) {
    if (this._isOnline()) {
      return this._api.getComments(filmId);
    }
  }

  updateFilm(film) {
    if (this._isOnline()) {
      return this._api.updateFilm(film);
    }
  }

  addComment(data) {
    if (this._isOnline()) {
      return this._api.addComment(data);
    }
  }

  deleteComment(commentId) {
    if (this._isOnline()) {
      return this._api.deleteComment(commentId);
    }
  }

  sync() {
    if (this._isOnline()) {
      return this._api.sync();
    }
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
