import { signOut } from "firebase/auth";
import { auth } from "../lib/Firebase";

const signOutApi = () => {
  return signOut(auth);
};

export default signOutApi;
