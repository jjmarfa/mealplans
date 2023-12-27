import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/Firebase";

const signInApi = async (email: string, password: string) => {
  try {
    return signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error("Invalid username or password");
  }
};

export default signInApi;
