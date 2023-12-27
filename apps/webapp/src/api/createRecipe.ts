import { Recipe } from "@social-recipes/core";
import { callableV1 } from "../lib/Firebase";

const createRecipeApi = async (data: Recipe) => {
  const result = await callableV1<Recipe>({ action: "createRecipe", data });

  return result.data;
};

export default createRecipeApi;
