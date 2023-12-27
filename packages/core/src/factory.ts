import { MealPlan } from "./types";

export const mealPlanFactory = (mealPlan?: Partial<MealPlan>): MealPlan => ({
  id: "mealPlan123",
  userId: "user123",
  ingredients: [],
  name: "mealPlan123",
  meals: [],
  ...mealPlan,
});
