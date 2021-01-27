import dayjs from "dayjs";
import {EMOJIES} from "../constants";
import {getRandomElement, getRandomInteger, generateUserName, generateId} from "../utils/common";

const generateDate = () => {
  const maxMinutesGap = (365 + 365 + 365 + 366) * 24 * 60; // Последние четыре года
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
    id: generateId(),
    name: generateUserName(),
    date: generateDate(),
    emoji: generateEmoji(),
    message: generateMessage()
  };
};
