import authorize from "../authorization";
import RecipeRepository from "../repository/Recipe";
import { Recipe } from "../types";

const deleteRecipe = async (userId: string, params: Pick<Recipe, "id">) => {
  const recipeDB = new RecipeRepository();
  const recipe = await recipeDB.find(params.id);

  authorize(userId, "recipe", { type: "delete", data: recipe });

  if (recipe.userId !== userId) {
    throw new Error("You can't delete this recipe");
  }

  await recipeDB.delete(params.id);
};

export default deleteRecipe;
