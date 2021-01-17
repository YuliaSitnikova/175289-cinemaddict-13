import Observer from "../utils/ovserver";

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
}
