const getSeconds = (time, precision = 2) =>
  Number.parseFloat(time / 1000).toPrecision(precision);

export default getSeconds;
