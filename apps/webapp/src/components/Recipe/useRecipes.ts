import { Recipe } from "@social-recipes/core";
import { create } from "zustand";

const useRecipes = create<Record<string, Recipe>>(() => ({}));

export default useRecipes;
