import { SUBSCRIPTION_STATUS } from "./constant";

export interface Recipe {
  id: string;
  name: string;
  notes?: string;
  image?: string;
  videoUrl?: string;
  ingredients: {
    name: string;
    quantity: number;
    category: string;
    unit: string;
  }[];
  public: boolean;
  steps?: string[];
  tools?: string[];
  categories?: string[];
  userId: string;
  createdAt: number;
  updatedAt: number;
}

export interface Ingredients {
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  subscriptionStatus: keyof typeof SUBSCRIPTION_STATUS;
  subscriptionId: string;
  subscriptionActiveStatusAt: number;
  subscriptionPendingStatusAt: number;
  subscriptionCancelledStatusAt: number;
}

export interface MealPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  meals: Meals[];
  ingredients: Recipe["ingredients"];
}

export interface Meals {
  name: string;
  meal: Meal[];
}
export interface Meal {
  name: string;
  recipeIds: string[];
}
