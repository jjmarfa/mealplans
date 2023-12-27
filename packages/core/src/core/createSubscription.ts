import { SUBSCRIPTION_STATUS } from "../constant";
import { today } from "../helper";
import UserRepository from "../repository/User";
import { User } from "../types";
import { CoreFn } from "./types";

type Params = {
  subscriptionId: string;
};

const createSubscription: CoreFn<Params, User> = async (userId, params) => {
  const userDB = new UserRepository();

  const user = await userDB.find(userId);

  user.subscriptionId = params.subscriptionId;
  user.subscriptionStatus = SUBSCRIPTION_STATUS.PENDING;
  user.subscriptionPendingStatusAt = today();

  const updatedUser = await userDB.update(userId, user);

  return updatedUser;
};

export default createSubscription;
