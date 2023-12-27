import { MealPlan } from "@social-recipes/core";
import { callableV1 } from "../lib/Firebase";

const deleteMealPlanApi = async (id: MealPlan["id"]) => {
  return callableV1({ action: "deleteMealPlan", data: { id } });
};

export default deleteMealPlanApi;
