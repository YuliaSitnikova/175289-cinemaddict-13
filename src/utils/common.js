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

export const generateId = () => {
  return Date.now() + parseInt(Math.random() * 10000, 10);
};

export const generateUserName = () => {
  const names = [
    `Tim Macoveev`,
    `John Doe`
  ];

  return getRandomElement(names);
};
