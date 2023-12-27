import authorize from "../authorization";
import RecipeRepository from "../repository/Recipe";

type Params = {
  text: string;
};

const searchRecipes = async (userId: string, params: Params) => {
  const recipeDB = new RecipeRepository();
  authorize(userId, "recipe", { type: "create" });

  return recipeDB.search(params.text, "name");
};

export default searchRecipes;
