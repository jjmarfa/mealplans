import authorize from "../authorization";
import RecipeRepository from "../repository/Recipe";
import { Recipe } from "../types";
import { CoreFn } from "./types";

const createRecipe: CoreFn<Omit<Recipe, "id">> = async (
  userId: string,
  params
) => {
  authorize(userId, "recipe", { type: "create" });
  const buildRecipe = {
    ...params,
    userId,
  };

  const recipeDb = new RecipeRepository();

  return recipeDb.create(buildRecipe);
};

export default createRecipe;
