import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/Firebase";
import { User } from "@social-recipes/core";

export default async function getUser(id: string): Promise<User> {
  const docRef = doc(db, "users", id);

  const snap = await getDoc(docRef);

  if (!snap.exists()) throw new Error("User not found");

  return snap.data() as User;
}
