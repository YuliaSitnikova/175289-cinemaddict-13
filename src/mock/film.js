import {getRandomElement, getRandomInteger} from "../utils";
import dayjs from "dayjs";

const generatePoster = () => {
  const posters = [
    `./images/posters/made-for-each-other.png`,
    `./images/posters/popeye-meets-sinbad.png`,
    `./images/posters/sagebrush-trail.jpg`,
    `./images/posters/santa-claus-conquers-the-martians.jpg`,
    `./images/posters/the-dance-of-life.jpg`,
    `./images/posters/the-great-flamarion.jpg`,
    `./images/posters/the-man-with-the-golden-arm.jpg`
  ];

  return getRandomElement(posters);
};

const generateTitle = () => {
  const titles = [
    `The Dance of Life`,
    `Sagebrush Trail`,
    `The Man with the Golden Arm`,
    `Santa Claus Conquers the Martians`,
    `Popeye the Sailor Meets Sindbad the Sailor`
  ];

  return getRandomElement(titles);
};

const generateRating = () => {
  return getRandomInteger(0, 100) / 10;
};

const generateDirector = () => {
  const directorsNames = [
    `Anthony Mann`,
    `Woody Allen`,
    `Christopher Nolan`,
  ];

  return getRandomElement(directorsNames);
};

const generateWriters = () => {
  const writersNames = [
    `Anne Wigton`,
    `Heinz Herald`,
    `Richard Weil`,
  ];

  const writers = new Set();

  for (let i = 0; i < getRandomInteger(1, 3); i++) {
    writers.add(getRandomElement(writersNames));
  }

  return Array.from(writers);
};

const generateActors = () => {
  const actorsNames = [
    `Erich von Stroheim`,
    `Mary Beth Hughes`,
    `Dan Duryea`,
  ];

  const actors = new Set();

  for (let i = 0; i < getRandomInteger(1, 3); i++) {
    actors.add(getRandomElement(actorsNames));
  }

  return Array.from(actors);
};

const generateRelease = () => {
  const maxDaysGap = 36500;
  const daysGap = getRandomInteger(-maxDaysGap, 0);

  return dayjs().add(daysGap, `day`).toDate();
};

const generateDuration = () => {
  const durations = [
    `1h 55m`,
    `54m`,
    `1h 59m`
  ];

  return getRandomElement(durations);
};

const generateCountry = () => {
  const countries = [
    `USA`,
    `Spain`,
    `India`
  ];

  return getRandomElement(countries);
};

const generateGenres = () => {
  const genresNames = [
    `Cartoon`,
    `Comedy`,
    `Drama`,
    `Film-Noir`,
    `Musical`,
    `Mystery`,
    `Western`
  ];

  const genres = new Set();

  for (let i = 0; i < getRandomInteger(1, 3); i++) {
    genres.add(getRandomElement(genresNames));
  }

  return Array.from(genres);
};

const generateDescription = () => {
  const sentences = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ];

  const sentencesCount = getRandomInteger(1, 5);

  return new Array(sentencesCount).fill().map(() => getRandomElement(sentences)).join(` `);
};

const generateAgeLimit = () => {
  const ages = [
    `0+`,
    `6+`,
    `12+`,
    `16+`,
    `18+`
  ];

  return getRandomElement(ages);
};

const generateComments = () => {
  const comments = [
    `1`,
    `2`,
    `3`,
    `4`,
    `5`
  ];

  const commentsCount = getRandomInteger(0, 5);

  return comments.slice(0, commentsCount);
};

export const generateFilm = () => {
  return {
    poster: generatePoster(),
    title: generateTitle(),
    titleOriginal: generateTitle(),
    rating: generateRating(),
    director: generateDirector(),
    writers: generateWriters(),
    actors: generateActors(),
    release: generateRelease(),
    duration: generateDuration(),
    country: generateCountry(),
    genres: generateGenres(),
    description: generateDescription(),
    age: generateAgeLimit(),
    comments: generateComments(),
    isWatch: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};
