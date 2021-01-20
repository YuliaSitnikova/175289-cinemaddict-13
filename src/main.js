import ProfileView from "./view/profile.js";
import FooterStatisticsView from "./view/footer-statictics";
import {generateFilm} from "./mock/film";
import FilterModel from "./model/filter";
import FilmsModel from "./model/films";
import FilterPresenter from "./presenter/filter";
import FilmsPresenter from "./presenter/films";
import {render, RenderPlace} from "./utils/render";

const FILMS_COUNT = 18;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const statisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

if (films.length !== 0) {
  render(siteHeaderElement, new ProfileView(), RenderPlace.BEFOREEND);
}

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
filterPresenter.init();

const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, filterModel);
filmsPresenter.init();

render(statisticsElement, new FooterStatisticsView(FILMS_COUNT), RenderPlace.BEFOREEND);
