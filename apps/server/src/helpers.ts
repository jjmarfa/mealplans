type NestedObject = {
  [key: string]: any | any[];
};

const DISALLOWED_KEYS = ["password"];

/**
 * Secure Log Info
 *
 * Replace specified keys from an object recursively with "****".
 * @param object - The object to replace keys from.
 * @returns A new object with the specified keys replaced with "*****".
 */
export const secureLogInfo = (object: NestedObject): NestedObject => {
  const result: NestedObject = {};

  for (const key in object) {
    const value = object[key];

    if (DISALLOWED_KEYS.includes(key)) {
      result[key] = "*****";
    } else if (typeof value === "object") {
      result[key] = secureLogInfo(value);
    } else {
      result[key] = value;
    }
  }

  return result;
};
