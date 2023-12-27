import { MealPlan } from "../types";
import BaseRepository from "./Base";

export default class MealPlanRepository extends BaseRepository<MealPlan> {
  protected model = "mealPlans";
  protected searchable = ["name"] as const;
}
