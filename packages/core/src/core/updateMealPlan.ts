import authorize from "../authorization";
import MealPlanRepository from "../repository/MealPlan";
import { MealPlan } from "../types";
import { CoreFn } from "./types";

const updateMealPlan: CoreFn<MealPlan> = async (userId, params) => {
  const mealPlanDB = new MealPlanRepository();

  const mealPlan = await mealPlanDB.find(params.id);

  authorize(userId, "mealPlan", { type: "update", data: mealPlan });

  const buildMealPlan = {
    ...mealPlan,
    ...params,
  };

  return mealPlanDB.update(params.id, buildMealPlan);
};

export default updateMealPlan;
