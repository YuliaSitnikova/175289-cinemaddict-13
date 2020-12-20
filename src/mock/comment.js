import dayjs from "dayjs";
import {EMOJIES} from "../constants";
import {getRandomElement, getRandomInteger} from "../utils/common";

const generateName = () => {
  const names = [
    `Tim Macoveev`,
    `John Doe`
  ];

  return getRandomElement(names);
};

const generateDate = () => {
  const maxMinutesGap = 7 * 24 * 60;
  const daysGap = getRandomInteger(0, maxMinutesGap);
  return dayjs().subtract(daysGap, `minute`).toDate();
};

const generateEmoji = () => {
  return getRandomElement(EMOJIES);
};

const generateMessage = () => {
  const messages = [
    `Almost two hours? Seriously?`,
    `Booooooooooring`,
    `Interesting setting and a good cast`,
    `Very very old. Meh`
  ];

  return getRandomElement(messages);
};

export const generateComment = () => {
  return {
    name: generateName(),
    date: generateDate(),
    emoji: generateEmoji(),
    message: generateMessage()
  };
};
