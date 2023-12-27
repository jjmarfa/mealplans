import { Recipe } from "@social-recipes/core";
import { callableV1 } from "../lib/Firebase";

export default async function updateRecipeApi(id: string, recipe: Recipe) {
  return callableV1({ action: "updateRecipe", data: { ...recipe, id } });
}
