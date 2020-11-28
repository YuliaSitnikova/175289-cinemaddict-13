const getRandomInteger = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1))
};

const getRandomElement = (elements) => {
  return elements[Math.floor(Math.random() * (elements.length))];
};

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

const generateYear = () => {
  const years = [
    `30 March 1945`,
    `01 April 1995`
  ];

  return getRandomElement(years);
};

const generateDuration = () => {
  const durations = [
    `1h 55m`,
    `54m`,
    `1h 59m`
  ];

  return getRandomElement(durations);
};

const generateGenre = () => {
  const genres = [
    `Musical`,
    `Western`,
    `Drama`,
    `Comedy`,
    `Cartoon`
  ];

  return getRandomElement(genres);
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

const generateComments = () => {
  const comments = [
    `5`,
    `34`,
    `1`
  ];
  return comments;
};

export const generateFilm = () => {
  return {
    poster: generatePoster(),
    title: generateTitle(),
    titleOriginal: generateTitle(),
    rating: 2.3,
    producer: ``,
    screenwriters: ``,
    cast: [],
    release: generateYear(),
    duration: generateDuration(),
    genre: generateGenre(),
    country: ``,
    description: generateDescription(),
    age: ``,
    comments: generateComments()
  };
};
