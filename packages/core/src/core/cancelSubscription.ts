import { SUBSCRIPTION_STATUS } from "../constant";
import NotFoundError from "../errors/NotFoundError";
import RequirementError from "../errors/RequirementError";
import { today } from "../helper";
import UserRepository from "../repository/User";

type Params = {
  id: string;
};

const cancelSubscription = async (params: Params) => {
  const userDb = new UserRepository();

  const [user] = await userDb.list([["subscriptionId", "==", params.id]], {
    limit: 1,
  });

  if (!user) {
    throw new NotFoundError("users", params.id);
  }

  if (!user.subscriptionId) {
    throw new RequirementError(`User ${params.id} has no subscription`);
  }

  user.subscriptionStatus = SUBSCRIPTION_STATUS.CANCELLED;
  user.subscriptionCancelledStatusAt = today();

  await userDb.update(user.id, user);

  return user;
};

export default cancelSubscription;
