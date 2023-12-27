import { Recipe } from "@social-recipes/core";
import { callableV1 } from "../lib/Firebase";

export default async function searchRecipesApi(text: string) {
  const result = await callableV1<Recipe[]>({
    action: "searchRecipes",
    data: { text },
  });

  return result.data;
}
