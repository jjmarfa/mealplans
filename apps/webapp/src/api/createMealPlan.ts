import { MealPlan } from "@social-recipes/core";
import { callableV1 } from "../lib/Firebase";

const createMealPlanApi = (data: MealPlan) => {
  return callableV1<MealPlan>({ action: "createMealPlan", data });
};

export default createMealPlanApi;
