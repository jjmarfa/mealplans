import { Recipe } from "@social-recipes/core";
import { callableV1 } from "../lib/Firebase";

const deleteRecipeApi = async (id: Recipe["id"]) => {
  return callableV1({ action: "deleteRecipe", data: { id } });
};

export default deleteRecipeApi;
