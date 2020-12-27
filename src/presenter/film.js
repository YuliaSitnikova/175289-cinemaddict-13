import FilmCardView from "../view/film-card";
import FilmDetailView from "../view/film-details";
import {render, RenderPlace} from "../utils/render";

export default class Film {
  constructor(filmsListContainer) {
    this._film = null;
    this._filmComponent = null;
    this._filmDetailComponent = null;
    this._filmsListContainer = filmsListContainer;
    this._filmDetailContainer = document.body;
    this._handleTaskClick = this._handleTaskClick.bind(this);
    this._handleTaskDetailClick = this._handleTaskDetailClick.bind(this);
    this._onEscKeydown = this._onEscKeydown.bind(this);
  }

  init(film) {
    this._film = film;
    this._filmComponent = new FilmCardView(this._film);
    this._filmDetailComponent = new FilmDetailView(this._film);

    this._filmComponent.setClickHandler(this._handleTaskClick);
    this._filmDetailComponent.setClickHandler(this._handleTaskDetailClick);

    render(this._filmsListContainer, this._filmComponent, RenderPlace.BEFOREEND);
  }

  _onEscKeydown(evt) {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      evt.preventDefault();
      this._closeFilmDetail();
    }
  }

  _showFilmDetail() {
    this._filmDetailContainer.classList.add(`hide-overflow`);
    this._filmDetailContainer.appendChild(this._filmDetailComponent.getElement());
    document.addEventListener(`keydown`, this._onEscKeydown);
  }

  _closeFilmDetail() {
    this._filmDetailContainer.classList.remove(`hide-overflow`);
    this._filmDetailContainer.removeChild(this._filmDetailComponent.getElement());
    document.removeEventListener(`keydown`, this._onEscKeydown);
  }

  _handleTaskClick() {
    this._showFilmDetail();
  }

  _handleTaskDetailClick() {
    this._closeFilmDetail();
  }
}
