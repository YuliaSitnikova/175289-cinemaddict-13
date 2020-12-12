export const getRandomInteger = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomElement = (elements) => {
  return elements[Math.floor(Math.random() * (elements.length))];
};

export const getRandomElements = (elements, count) => {
  const randomElements = elements.slice();
  for (let i = randomElements.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * randomElements.length);
    const swap = randomElements[j];
    randomElements[j] = randomElements[i];
    randomElements[i] = swap;
  }
  return randomElements.slice(0, count);
};

export const RenderPlace = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const renderElement = (container, template, place) => {
  switch (place) {
    case RenderPlace.AFTERBEGIN:
      container.prepend(template);
      break;
    case RenderPlace.BEFOREEND:
      container.append(template);
      break;
  }
};

export const renderTemplate = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};
