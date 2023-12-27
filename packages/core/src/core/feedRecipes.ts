import authorize from "../authorization";
import RecipeRepository from "../repository/Recipe";
import { Recipe } from "../types";
import { CoreFn } from "./types";

type FeedRecipeParams = {
  search?: string;
  pagination?: {
    page: number;
    limit: number;
  };
};

const feedRecipes: CoreFn<FeedRecipeParams, Recipe[]> = async (
  userId,
  params
) => {
  const recipeDB = new RecipeRepository();
  const { pagination = { page: 1, limit: 12 } } = params;

  authorize(userId, "recipe", { type: "create" });

  const recipes = await recipeDB.search(
    params.search || "*",
    "name",
    [["public", "==", true]],
    pagination
  );

  return recipes;
};

export default feedRecipes;
