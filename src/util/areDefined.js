import { get, compact } from "lodash";

/**
 * Checks if all properties on an object are defined.
 *
 * @param {Object} object An object to check for undefined arguments against.
 * @param  {...String} args String values of properties to check are defined on the object.
 * @returns {boolean} true if all properties are defined.
 */
const areDefined = (object, ...args) => {
  const argsDefined = args.map(arg => get(object, arg));
  return compact(argsDefined).length === args.length;
};

export default areDefined;
