import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/Firebase";
import { MealPlan } from "@social-recipes/core";

export default async function getMealPlanApi(id: string) {
  const docRef = doc(db, "mealPlans", id);

  const snap = await getDoc(docRef);

  if (!snap.exists()) throw new Error("Meal Plan not found");

  return snap.data() as MealPlan;
}
