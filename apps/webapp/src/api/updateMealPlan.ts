import { MealPlan } from "@social-recipes/core";
import { callableV1 } from "../lib/Firebase";

export default async function updateMealPlanApi(
  id: string,
  mealPlan: MealPlan
) {
  const result = await callableV1<MealPlan>({
    action: "updateMealPlan",
    data: { ...mealPlan, id },
  });

  return result.data;
}
