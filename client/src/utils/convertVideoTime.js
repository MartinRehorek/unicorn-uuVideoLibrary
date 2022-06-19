export const convertVideoTime = (time) => {
  const splitted = time.split('').slice(2);
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let result = '';

  if (splitted[splitted.length - 1] === 'S') {
    seconds = Number(splitted[splitted.length - 3] + splitted[splitted.length - 2]);
  }
  if (splitted[splitted.length - 4] === 'M') {
    minutes = Number(splitted[splitted.length - 6] + splitted[splitted.length - 5]);
  }
  if (splitted[2] === 'H') {
    hours = Number(splitted[0] + splitted[1]);
  }

  if (hours) result += `${hours}:`;
  if (minutes) result += `${minutes}:`;
  if (seconds) result += seconds;

  return result;
};
