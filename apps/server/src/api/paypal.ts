import express from "express";
import "dotenv/config";
import { https, logger } from "firebase-functions/v2";
import adapter from "../lib/SocialRecipe";
import { firebasAuth } from "../lib/Firebase";
import { createSubscription } from "../lib/paypal";
import cors from "cors";
import { AxiosError } from "axios";

const app = express();

// parse post params sent in body in json format
app.use(express.json());
app.use(cors());

// create authorization middleware for express app
const authorize: express.RequestHandler = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    logger.error("Failed to find authorization header");
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  const idToken = req.headers.authorization.split("Bearer ")[1];

  try {
    const tokenData = await firebasAuth.verifyIdToken(idToken, false);

    if (!tokenData) {
      logger.error("Token not found");
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    (req as express.Request & { userId: string }).userId = tokenData.uid;

    next();
  } catch (e) {
    logger.error(e);
    res.status(403).send({ message: "Unauthorized" });
  }
  return;
};

app.post("/subscriptions", authorize, async (req: any, res) => {
  try {
    const subscription = await createSubscription();

    await adapter.createSubscription(req.userId, {
      subscriptionId: subscription.id,
    });

    logger.info(subscription);

    res.status(200).json(subscription);
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error(error.message);
    } else {
      logger.error(error);
    }
    res.status(500).json({ error: "Failed to create order." });
  }
});

app.post("/webhook", async (req, res) => {
  try {
    const { event_type, resource } = req.body;
    console.log("Received event type: " + event_type);
    console.log("Received event resource: " + resource);
    logger.info("Received Request: ", req.body);

    if (event_type === "BILLING.SUBSCRIPTION.CREATED") {
      const { id, amount, payment_mode, state } = resource as {
        id: string;
        amount: {
          total: string;
          currency: string;
        };
        payment_mode: string;
        state: string;
      };

      const user = await adapter.confirmSubscription({ id });

      logger.info(
        "Subscription created for order " + id + " for user " + user.id
      );
    }

    if (
      [
        "BILLING.SUBSCRIPTION.CANCELLED",
        "BILLING.SUBSCRIPTION.EXPIRED",
        "BILLING.SUBSCRIPTION.SUSPENDED",
      ].includes(event_type)
    ) {
      const user = await adapter.cancelSubscription({ id: resource.id });
      logger.info(
        "Subscription cancelled for order " +
          resource.id +
          " for user " +
          user.id
      );
    }

    res.status(200).json({ received: true });
  } catch (e) {
    logger.error(e);
    res.status(500).json({ error: "Failed to process webhook." });
  }
});

const handler = https.onRequest(
  { region: "asia-east1", timeoutSeconds: 300 },
  app
);

export default handler;
