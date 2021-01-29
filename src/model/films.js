import Observer from "../utils/ovserver";

export default class Films extends Observer {
  constructor() {
    super();

    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  update(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign({}, film, {
      poster: film.film_info.poster,
      title: film.film_info.title,
      titleOriginal: film.film_info.alternative_title,
      rating: film.film_info.total_rating,
      director: film.film_info.director,
      writers: film.film_info.writers,
      actors: film.film_info.actors,
      release: film.film_info.release.date,
      duration: film.film_info.runtime,
      country: film.film_info.release.release_country,
      genres: film.film_info.genre,
      description: film.film_info.description,
      age: film.film_info.age_rating,
      isWatch: film.user_details.watchlist,
      isWatched: film.user_details.already_watched,
      watchingDate: film.user_details.watching_date,
      isFavorite: film.user_details.favorite
    });

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign({}, film, {

    });

    return adaptedFilm;
  }
}
