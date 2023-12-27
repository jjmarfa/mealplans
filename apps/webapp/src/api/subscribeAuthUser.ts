import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/Firebase";
import { User } from "@social-recipes/core";
import getUser from "./getUser";

export default function subscribeAuthUser(
  callback: (user: User | null) => void
) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      getUser(user.uid)
        .then((u) => {
          callback(u);
        })
        .catch((e) => {
          console.log(e);
          callback(null);
        });
    } else {
      callback(null);
    }
  });
}
