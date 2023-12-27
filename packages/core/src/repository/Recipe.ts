import { Recipe } from "../types";
import BaseRepository from "./Base";

export default class RecipeRepository extends BaseRepository<Recipe> {
  protected model: string = "recipes";
  protected searchable = ["name"] as const;
}
