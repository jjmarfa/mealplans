import { AuthAdapter } from "@social-recipes/core";
import { firebasAuth } from "../Firebase";

class FirebaseAuthAdapter implements AuthAdapter {
  async create(email: string, password: string): Promise<string> {
    const result = await firebasAuth.createUser({
      email,
      password,
    });

    return result.uid;
  }
}

const auth = new FirebaseAuthAdapter();

export default auth;
