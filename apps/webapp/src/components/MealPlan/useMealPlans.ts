import { MealPlan } from "@social-recipes/core";
import { create } from "zustand";

const useMealPlans = create<Record<string, MealPlan>>(() => ({}));

export default useMealPlans;
