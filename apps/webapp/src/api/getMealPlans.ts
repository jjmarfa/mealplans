import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../lib/Firebase";
import { MealPlan } from "@social-recipes/core";

export default async function getMealPlansApi(id: string): Promise<MealPlan[]> {
  const q = query(
    collection(db, "mealPlans"),
    where("userId", "==", id),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => doc.data() as MealPlan);
}
