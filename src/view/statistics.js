import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Smart from "./smart";
import {StatisticsFilterType} from "../constants";
import {getRank, getTotalDuration, getGenresStats, getTopGenre, filter} from "../utils/statistics";

const renderChart = (statisticCtx, films) => {
  if (films.length === 0) {
    return null;
  }

  const BAR_HEIGHT = 50;

  const genres = [];
  const counts = [];

  Object
    .entries(getGenresStats(films))
    .sort((a, b) => b[1] - a[1])
    .forEach(([genre, count]) => {
      genres.push(genre);
      counts.push(count);
    });

  statisticCtx.height = BAR_HEIGHT * Object.values(genres).length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: counts,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticRankTemplate = (userRank) => {
  return `<p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${userRank}</span>
  </p>`;
};

const createStatisticTemplate = (data) => {
  const {films, currentFilter, userRank} = data;
  const rankTemplate = userRank ? createStatisticRankTemplate(userRank) : ``;
  const {hours, minutes} = getTotalDuration(films);
  const topGenre = getTopGenre(films);

  return `<section class="statistic">

    ${rankTemplate}

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${StatisticsFilterType.ALL === currentFilter ? `checked` : ``}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${StatisticsFilterType.TODAY === currentFilter ? `checked` : ``}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${StatisticsFilterType.WEEK === currentFilter ? `checked` : ``}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${StatisticsFilterType.MONTH === currentFilter ? `checked` : ``}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${StatisticsFilterType.YEAR === currentFilter ? `checked` : ``}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${films.length} <span class="statistic__item-description">${films.length === 1 ? `movie` : `movies`}</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class Statistics extends Smart {
  constructor(films) {
    super();

    this._films = films;

    this._data = {
      films: filter[StatisticsFilterType.ALL](this._films),
      currentFilter: StatisticsFilterType.ALL,
      userRank: getRank(this._films.length)
    };

    this._chart = null;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);

    this._setHandlers();
    this._renderChart();
  }

  getTemplate() {
    return createStatisticTemplate(this._data);
  }

  restoreHandlers() {
    this._setHandlers();
    this._renderChart();
  }

  _setHandlers() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, this._filterTypeChangeHandler)
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    const newFilter = evt.target.value;
    if (this._data.currentFilter === newFilter) {
      return;
    }

    this.updateData({
      films: filter[newFilter](this._films),
      currentFilter: newFilter
    }, true);

  }

  _renderChart() {
    if (this._chart !== null) {
      this._chart = null;
    }

    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);
    this._chart = renderChart(statisticCtx, this._data.films);
  }
}
