import FilterView from "../view/filter";
import {RenderPlace, render, remove} from "../utils/render";
import {UpdateType} from "../constants";

export default class Filter {
  constructor(navigationContainer, filterModel, filmsModel) {
    this._filterContainer = navigationContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._items = null;
    this._currentFilter = null;

    this._filterComponent = null;

    this._handleFilterTypeClick = this._handleFilterTypeClick.bind(this);
    this._handleModelChange = this._handleModelChange.bind(this);

    this._filterModel.addObserver(this._handleModelChange);
    this._filmsModel.addObserver(this._handleModelChange);
  }

  init() {
    this._items = this._getItems();
    this._currentFilter = this._filterModel.getFilter();
    this._filterComponent = new FilterView(this._items, this._currentFilter);
    this._filterComponent.setItemClickHandler(this._handleFilterTypeClick);
    render(this._filterContainer, this._filterComponent, RenderPlace.AFTERBEGIN);
  }

  _update() {
    if (this._filterContainer.contains(this._filterComponent.getElement())) {
      remove(this._filterComponent);
    }

    this.init();
  }

  _handleFilterTypeClick(filter) {
    if (this._currentFilter === filter) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filter);
  }

  _handleModelChange() {
    this._update();
  }

  _getItems() {
    const films = this._filmsModel.getFilms();

    return [{
      name: `all`,
      count: films.length
    }, {
      name: `watchlist`,
      count: films.filter((film) => film.isWatch).length
    }, {
      name: `history`,
      count: films.filter((film) => film.isWatched).length,
    }, {
      name: `favorites`,
      count: films.filter((film) => film.isFavorite).length
    }];
  }
}
