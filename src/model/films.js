import Observer from "../utils/ovserver";
import {update} from "../utils/common";

export default class Films extends Observer {
  constructor() {
    super();

    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }

  updateFilm(film) {
    this._films = update(this._films, film);
  }
}
