import { Recipe } from "@social-recipes/core";

export const getRecipesIngredients = (recipes: Recipe[]) => {
  return recipes
    .reduce(
      (acc, recipe) => {
        recipe.ingredients.forEach((ingredient) => {
          const index = acc.findIndex(
            (i) => i.name === ingredient.name && i.unit === ingredient.unit
          );
          if (index === -1) {
            acc.push({ ...ingredient });
          } else {
            acc[index].quantity += ingredient.quantity;
          }
        });

        return acc;
      },
      [] as Recipe["ingredients"]
    )
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const formatIngredient = (ingredients: Recipe["ingredients"]) => {
  return ingredients.reduce((acc, ingredient) => {
    acc += `${ingredient.quantity} ${ingredient.unit} - ${ingredient.name}\n`;
    return acc;
  }, "" as string);
};

export const groupIngredientsByCategory = (
  ingredients: Recipe["ingredients"] = []
) => {
  return ingredients.reduce(
    (acc, ingredient) => {
      acc[ingredient.category] ||= [];
      acc[ingredient.category].push(ingredient);
      return acc;
    },
    {} as { [key: string]: Recipe["ingredients"] }
  );
};

export const isOwner = (
  userId: string | null | undefined,
  entity: { userId: string }
) => {
  return userId === entity.userId;
};
