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

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};

export const replace = (newChild, oldChild) => {
  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  const container = oldChild.parentElement;

  if (container === null || newChild === null || oldChild === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  container.replaceChild(newChild, oldChild);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};
