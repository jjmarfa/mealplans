import authorize from "../authorization";
import RecipeRepository from "../repository/Recipe";
import { Recipe } from "../types";

const updateRecipe = async (userId: string, params: Recipe) => {
  const recipeDB = new RecipeRepository();
  const recipe = await recipeDB.find(params.id);

  authorize(userId, "recipe", { type: "update", data: recipe });

  const buildRecipe = {
    ...recipe,
    ...params,
    userId,
  };

  await recipeDB.update(params.id, buildRecipe);

  return buildRecipe;
};

export default updateRecipe;
