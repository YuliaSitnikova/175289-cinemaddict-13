import FilmsModel from "../model/films";
import {toast} from "../utils/toast/toast";

const createStoreStructure = (items) => {
  return items.reduce((accumulator, current) => {
    return Object.assign({}, accumulator, {
      [current.id]: current
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._syncedWithServer = false;
  }

  getFilms() {
    if (this.isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._store.setItems(items);
          this._syncedWithServer = true;
          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());

    return Promise.resolve(storeFilms.map(FilmsModel.adaptToClient));
  }

  getComments(id) {
    if (this.isOnline()) {
      return this._api.getComments(id);
    }

    return Promise.reject(new Error(`Load comments failed`));
  }

  updateFilm(film) {
    if (this.isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItem(updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));
          return updatedFilm;
        });
    }

    this._store.setItem(film.id, FilmsModel.adaptToServer(Object.assign({}, film)));
    this._syncedWithServer = false;

    return Promise.resolve(film);
  }

  addComment(data) {
    if (this.isOnline()) {
      return this._api.addComment(data)
        .then(({updatedFilm, comments}) => {
          this._store.setItem(updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));
          return {updatedFilm, comments};
        });
    }

    toast(`You can't add comment offline`);
    return Promise.reject(new Error(`Add comment failed`));
  }

  deleteComment(data) {
    if (this.isOnline()) {
      return this._api.deleteComment(data)
        .then(() => {
          this._store.setItem(data.film.id, FilmsModel.adaptToServer(data.film));
        });
    }

    toast(`You can't delete comment offline`);
    return Promise.reject(new Error(`Delete comment failed`));
  }

  sync() {
    if (this.isOnline()) {
      const storeFilms = Object.values(this._store.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          const items = createStoreStructure(response.updated);

          this._store.setItems(items);
          this._syncedWithServer = true;
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  isOnline() {
    return window.navigator.onLine;
  }

  isSynced() {
    return this._syncedWithServer;
  }
}
