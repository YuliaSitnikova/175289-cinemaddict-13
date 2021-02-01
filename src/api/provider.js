export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    this._api.getFilms();
  }

  getComments(filmId) {
    this._api.getComments(filmId);
  }

  updateFilm(film) {
    this._api.updateFilm(film);
  }

  addComment(data) {
    this._api.addComment(data);
  }

  deleteComment(commentId) {
    this._api.deleteComment(commentId);
  }

  sync() {
    this._api.sync();
  }
}
