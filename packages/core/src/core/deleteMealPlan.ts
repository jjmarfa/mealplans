import authorize from "../authorization";
import MealPlanRepository from "../repository/MealPlan";
import { CoreFn } from "./types";

const deleteMealPlan: CoreFn<{ id: string }, void> = async (userId, params) => {
  const mealPlanDB = new MealPlanRepository();
  const mealPlan = await mealPlanDB.find(params.id);

  authorize(userId, "mealPlan", { type: "delete", data: mealPlan });

  return mealPlanDB.delete(params.id);
};

export default deleteMealPlan;
