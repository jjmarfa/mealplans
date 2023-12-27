import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/Firebase";
import { Recipe } from "@social-recipes/core";

export default async function getRecipeApi(id: string) {
  const docRef = doc(db, "recipes", id);

  const snap = await getDoc(docRef);

  if (!snap.exists()) throw new Error("Recipe not found");

  return snap.data() as Recipe;
}
