import ProfileView from "./view/profile.js";
import MainNavigationView from "./view/main-navigation";
import FooterStatisticsView from "./view/footer-statictics";
import FilmsPresenter from "./presenter/films";
import {generateFilm} from "./mock/film";
import {generateNavigation} from "./mock/navigation";
import {render, RenderPlace} from "./utils/render";

const FILMS_COUNT = 18;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const statisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const navigationItems = generateNavigation(films);

if (films.length !== 0) {
  render(siteHeaderElement, new ProfileView(), RenderPlace.BEFOREEND);
}

render(siteMainElement, new MainNavigationView(navigationItems), RenderPlace.BEFOREEND);

const filmsPresenter = new FilmsPresenter(siteMainElement);
filmsPresenter.init(films);

render(statisticsElement, new FooterStatisticsView(FILMS_COUNT), RenderPlace.BEFOREEND);
