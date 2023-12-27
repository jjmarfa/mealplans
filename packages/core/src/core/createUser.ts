import adapter from "../adapter";
import UserRepository from "../repository/User";
import { User } from "../types";
import { CoreFn } from "./types";

type CreateUserParams = User & {
  password: string;
};

const createUser: CoreFn<CreateUserParams, string> = async (
  _userId: string,
  params: User & { password: string }
) => {
  const userDB = new UserRepository();
  const { password, ...rest } = params;

  const result = await adapter.getAuth().create(params.email, password);
  await userDB.create({ ...rest, id: result });

  return result;
};

export default createUser;
