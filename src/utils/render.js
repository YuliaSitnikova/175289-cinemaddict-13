import Abstract from "../view/abstract";

export const RenderPlace = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const render = (container, child, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (child instanceof Abstract) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPlace.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPlace.BEFOREEND:
      container.append(child);
      break;
  }
};

export const renderTemplate = (container, template, place = `beforeend`) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};
