import MenuView from "./view/menu";
import StatisticsView from "./view/statistics";
import FooterStatisticsView from "./view/footer-statictics";
import FilterModel from "./model/filter";
import FilmsModel from "./model/films";
import CommentsModel from "./model/comments";
import ProfilePresenter from "./presenter/profile";
import FilterPresenter from "./presenter/filter";
import FilmsPresenter from "./presenter/films";
import {RenderPlace, render, remove} from "./utils/render";
import {UpdateType} from "./constants";
import Api from "./api/api";
import Store from "./api/store";
import Provider from "./api/provider"

const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;
const AUTHORIZATION = `Basic 1lgrFiAqmJHH`;
const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v13`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const profilePresenter = new ProfilePresenter(siteHeader, filmsModel);
const menuComponent = new MenuView();
const filterPresenter = new FilterPresenter(menuComponent, filterModel, filmsModel);
const filmsPresenter = new FilmsPresenter(siteMain, filmsModel, commentsModel, filterModel, apiWithProvider);
const footerStatisticsComponent = new FooterStatisticsView();

profilePresenter.init();
render(siteMain, menuComponent, RenderPlace.BEFOREEND);
filterPresenter.init();
filmsPresenter.init();
render(siteFooter, footerStatisticsComponent, RenderPlace.BEFOREEND);

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

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);

    filterModel.addObserver(handleFilterTypeChange);
    menuComponent.setStatisticsClickHandler(handleStatisticsMenuClick);

    footerStatisticsComponent.setCount(films.length);
    remove(footerStatisticsComponent);
    render(siteFooter, footerStatisticsComponent, RenderPlace.BEFOREEND);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);

    filterModel.addObserver(handleFilterTypeChange);
    menuComponent.setStatisticsClickHandler(handleStatisticsMenuClick);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});
