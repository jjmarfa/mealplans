import { SearchOperators } from "@social-recipes/core";

export const parseOperator = (operator: SearchOperators) => {
  switch (operator) {
    case "==":
      return "=";

    default:
      return operator;
  }
};

export const addPrefix = (collection: string) => {
  return `meal-${collection}`;
};
