import adapter from "./adapter";
import { AuthenticationError, AuthorizationError } from "./errors";
import UserRepository from "./repository/User";
import { User } from "./types";

type AuthorizeCreateAction = {
  type: "create";
};

type AuthorizeUpdateAction = {
  type: "update";
  data: {
    id: string;
    userId: string;
  };
};

type AuthorizeDeleteAction = {
  type: "delete";
  data: {
    id: string;
    userId: string;
  };
};

type AuthorizeActions =
  | AuthorizeUpdateAction
  | AuthorizeDeleteAction
  | AuthorizeCreateAction;

export default async function authorize(
  userId: string,
  entity: string,
  action: AuthorizeActions
): Promise<User> {
  if (!userId) {
    throw new AuthenticationError();
  }

  const user = await new UserRepository().find(userId);

  switch (action.type) {
    case "update":
    case "delete":
      if (userId !== action.data.userId) {
        throw new AuthorizationError(entity, action.data.id);
      }
      break;
  }

  return user;
}
