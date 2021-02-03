import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(duration);
dayjs.extend(relativeTime);

export const formatFilmDuration = (filmDuration) => {
  if (!filmDuration) {
    return ``;
  }

  const hoursCount = Math.floor(dayjs.duration(filmDuration, `minutes`).asHours());
  const minutesCount = dayjs.duration(filmDuration, `minutes`).minutes();

  return `${hoursCount > 0 ? `${hoursCount}h` : ``} ${minutesCount}m`;
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

  return dayjs(release).format(`DD MMMM YYYY`);
};

export const formatCommentDate = (date) => {
  if (!date) {
    return ``;
  }

  return dayjs(date).fromNow();
};
