import { shuffle } from "lodash";

/**
 * Picks random number of items from an array of data.
 *
 * @param {Array} data An array of data to pick items from.
 * @param {Number} num The number of itemst o pick
 * @returns {Object|Array} An array of items pulled from the array, or a single object if there is only one.
 */
const pickRandom = (data = [], num = 5) => {
  // Invariants here
  const randomData = shuffle(data).slice(0, num);
  return num > 1 ? randomData : randomData[0];
};

export default pickRandom;
