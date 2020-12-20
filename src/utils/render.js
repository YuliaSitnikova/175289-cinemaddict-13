export const RenderPlace = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const render = (container, template, place) => {
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

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};
