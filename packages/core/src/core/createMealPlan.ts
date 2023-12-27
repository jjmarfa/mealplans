import authorize from "../authorization";
import MealPlanRepository from "../repository/MealPlan";
import { MealPlan } from "../types";
import { CoreFn } from "./types";

const createMealPlan: CoreFn<Omit<MealPlan, "id">> = async (
  userId: string,
  params
) => {
  authorize(userId, "mealPlan", { type: "create" });

  const buildMealPlan = {
    ...params,
    userId,
  };

  const mealDb = new MealPlanRepository();

  return mealDb.create(buildMealPlan);
};

export default createMealPlan;
