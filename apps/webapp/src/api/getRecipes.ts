import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../lib/Firebase";
import { Recipe } from "@social-recipes/core";

export default async function getRecipesApi(id: string): Promise<Recipe[]> {
  const q = query(
    collection(db, "recipes"),
    where("userId", "==", id),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => doc.data() as Recipe);
}
