import { callableV1 } from "../lib/Firebase";

const signUpApi = async (email: string, password: string) => {
  return callableV1({ action: "createUser", data: { email, password } });
};

export default signUpApi;
