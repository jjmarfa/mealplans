import axios from "axios";
import { defineString } from "firebase-functions/params";

export const createSubscription = async () => {
  const PAYPAL_API_URL = defineString("PAYPAL_API_URL").value();
  const PAYPAL_PLAN_ID = defineString("PAYPAL_PLAN_ID").value();
  const url = `${PAYPAL_API_URL}/v1/billing/subscriptions`;
  const accessToken = await generateAccessToken();
  const response = await axios.post<{ id: string; status: string }>(
    url,
    JSON.stringify({
      plan_id: PAYPAL_PLAN_ID,
      application_context: {
        user_action: "SUBSCRIBE_NOW",
      },
    }),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        Prefer: "return=representation",
      },
    }
  );

  return response.data;
};

const generateAccessToken = async () => {
  const PAYPAL_CLIENT_ID = defineString("PAYPAL_CLIENT_ID").value();
  const PAYPAL_CLIENT_SECRET = defineString("PAYPAL_CLIENT_SECRET").value();
  const PAYPAL_API_URL = defineString("PAYPAL_API_URL").value();

  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
    ).toString("base64");
    const response = await axios.post(
      `${PAYPAL_API_URL}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const data = response.data as {
      access_token: string;
    };

    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};
