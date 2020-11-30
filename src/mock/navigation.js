const filmToNavigationMap = {
  all: (films) => films.length,
  watchlist: (films) => films.filter((film) => film.isWatch).length,
  history: (films) => films.filter((film) => film.isWatched).length,
  favorites: (films) => films.filter((film) => film.isFavorite).length
};

export const generateNavigation = (films) => {
  return Object.entries(filmToNavigationMap).map(([itemName, filmsCount]) => {
    return {
      name: itemName,
      count: filmsCount(films),
    };
  });
};
