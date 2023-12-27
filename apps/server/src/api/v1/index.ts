import { HttpsError, onCall } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v1";
import core from "../../lib/SocialRecipe";
import { secureLogInfo } from "../../helpers";
import { AuthenticationError, AuthorizationError } from "@social-recipes/core";

const publicActions = {
  createUser: core.createUser,
  createRecipe: core.createRecipe,
  updateRecipe: core.updateRecipe,
  deleteRecipe: core.deleteRecipe,
  searchRecipes: core.searchRecipes,
  createMealPlan: core.createMealPlan,
  updateMealPlan: core.updateMealPlan,
  deleteMealPlan: core.deleteMealPlan,
  feedRecipes: core.feedRecipes,
} as const;

const v1 = onCall<{ action: keyof typeof publicActions; data: any }>(
  { region: "asia-east1" },
  async (req) => {
    const { auth, data: requestData } = req;
    const { action, data } = requestData;

    const calledAction = publicActions[action];

    try {
      logger.info("Called action", secureLogInfo({ action, data }));

      const result = calledAction(auth?.uid || "", data);
      return result;
    } catch (e) {
      if (e instanceof AuthorizationError) {
        throw new HttpsError("permission-denied", e.message);
      }
      if (e instanceof AuthenticationError) {
        throw new HttpsError("unauthenticated", e.message);
      }

      logger.error(e);
      throw new HttpsError("internal", "Something went wrong");
    }
  }
);

export default v1;
