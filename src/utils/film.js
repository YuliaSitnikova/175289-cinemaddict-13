import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export const formatFilmDuration = (durationInMinutes) => {
  if (!durationInMinutes) {
    return ``;
  }

  const millisecondsPerMinute = 60000;
  const durationsInMilliseconds = durationInMinutes * millisecondsPerMinute;
  const hours = dayjs.duration(durationsInMilliseconds).hours() > 0
    ? `${dayjs.duration(durationsInMilliseconds).hours()}h `
    : ``;
  const minutes = `${dayjs.duration(durationsInMilliseconds).minutes()}m`;

  return hours + minutes;
};

export const formatShortFilmRelease = (release) => {
  if (!release) {
    return ``;
  }

  return dayjs(release).format(`YYYY`);
};

export const formatFullFilmRelease = (release) => {
  if (!release) {
    return ``;
  }

  return dayjs(release).format(`D MMMM YYYY`);
};
