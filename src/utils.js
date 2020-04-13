export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

export const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const parseTime = (date) => {
  date = new Date(date);
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const parseDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.getDate() + `/` + (date.getMonth() + 1) + `/` + date.getFullYear().toString().slice(2);
};

export const createDay = (template) => {
  const newDay = document.createElement(`span`);
  newDay.innerHTML = template;

  return newDay.firstChild;
};

export const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};
