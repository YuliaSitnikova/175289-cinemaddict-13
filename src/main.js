import MenuView from "./view/menu";
import StatisticsView from "./view/statistics";
import FooterStatisticsView from "./view/footer-statictics";
import {generateFilm} from "./mock/film";
import FilterModel from "./model/filter";
import FilmsModel from "./model/films";
import ProfilePresenter from "./presenter/profile";
import FilterPresenter from "./presenter/filter";
import FilmsPresenter from "./presenter/films";
import {RenderPlace, render, remove} from "./utils/render";
import {UpdateType} from "./constants";

const FILMS_COUNT = 52;

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const profilePresenter = new ProfilePresenter(siteHeader, filmsModel);
profilePresenter.init();

const menuComponent = new MenuView();
render(siteMain, menuComponent, RenderPlace.BEFOREEND);

const filterPresenter = new FilterPresenter(menuComponent, filterModel, filmsModel);
filterPresenter.init();

const filmsPresenter = new FilmsPresenter(siteMain, filmsModel, filterModel);
filmsPresenter.init();

render(siteFooter, new FooterStatisticsView(films.length), RenderPlace.BEFOREEND);

let statisticsComponent = null;

const handleFilterTypeChange = () => {
  if (statisticsComponent !== null) {
    remove(statisticsComponent);
    statisticsComponent = null;
    menuComponent.resetActiveItem();
    filmsPresenter.init();
  }
};

const handleStatisticsMenuClick = () => {
  filmsPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, null);
  statisticsComponent = new StatisticsView(filmsModel.getFilms().filter((film) => film.isWatched));
  render(siteMain, statisticsComponent, RenderPlace.BEFOREEND);
};


filterModel.addObserver(handleFilterTypeChange);
menuComponent.setStatisticsClickHandler(handleStatisticsMenuClick);
