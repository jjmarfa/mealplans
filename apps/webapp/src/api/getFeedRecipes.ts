import { Recipe } from "@social-recipes/core";
import { callableV1 } from "../lib/Firebase";

const getFeedRecipesApi = async (
  search?: string,
  pagination?: { page: number; limit: number }
) => {
  const result = await callableV1<Recipe[]>({
    action: "feedRecipes",
    data: {
      search,
      pagination,
    },
  });

  return result.data;
};

export default getFeedRecipesApi;
