import { SUBSCRIPTION_STATUS } from "../constant";
import NotFoundError from "../errors/NotFoundError";
import RequirementError from "../errors/RequirementError";
import { today } from "../helper";
import UserRepository from "../repository/User";

type Params = {
  id: string;
};

const confirmSubscription = async (params: Params) => {
  const userDb = new UserRepository();

  const [user] = await userDb.list([["subscriptionId", "==", params.id]], {
    limit: 1,
  });

  if (!user) {
    throw new NotFoundError("users", params.id);
  }

  if (!user.subscriptionId) {
    console.log(user);
    throw new RequirementError(`User ${user.id} has no subscription`);
  }

  user.subscriptionStatus = SUBSCRIPTION_STATUS.ACTIVE;
  user.subscriptionActiveStatusAt = today();

  await userDb.update(user.id, user);

  return user;
};

export default confirmSubscription;
