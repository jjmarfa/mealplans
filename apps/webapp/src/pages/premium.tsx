import { useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import { getAuth } from "firebase/auth";
import { useAuthState } from "../store";
import getUser from "../api/getUser";
import { Typography } from "antd";
import { CrownOutlined } from "@ant-design/icons";

// Renders errors or successfull transactions on the screen.
function Message({ content }: { content: string }) {
  return <p>{content}</p>;
}

const initialOptions: ReactPayPalScriptOptions = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
  enableFunding: "paylater,card",
  disableFunding: "",
  dataSdkIntegrationSource: "integrationbuilder_sc",
  vault: "true",
  intent: "subscription",
};

function PremiumPage() {
  const { user, setUser } = useAuthState();
  const [message, setMessage] = useState("");

  async function handleSubscription() {
    try {
      const authToken = await getAuth().currentUser?.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_PAYPAL_API_URL}/subscriptions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ userAction: "SUBSCRIBE_NOW" }),
        }
      );
      const data = await response.json();
      if (data?.id) {
        setMessage(`Successful subscription...`);

        const updatedUser = await getUser(user!.id);

        setUser(updatedUser);

        return data.id;
      } else {
        console.error(
          { callback: "createSubscription", serverResponse: data },
          JSON.stringify(data, null, 2)
        );
        // (Optional) The following hides the button container and shows a message about why checkout can't be initiated
        const errorDetail = data?.details?.[0];
        setMessage(
          `Could not initiate PayPal Subscription...<br><br>${
            errorDetail?.issue || ""
          } ${errorDetail?.description || data?.message || ""} ` +
            (data?.debug_id ? `(${data.debug_id})` : "")
        );
      }
    } catch (error) {
      console.error(error);
      setMessage(`Could not initiate PayPal Subscription...${error}`);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="mt-10 w-full md:w-1/3 mb-10">
        <Typography.Title
          className="!mb-10 flex gap-3 justify-center"
          level={2}
        >
          <CrownOutlined />
          Premium
        </Typography.Title>
        <div>
          <Typography.Title level={4}>Features</Typography.Title>
          <ul>
            <li>Create Meal Plans</li>
          </ul>
          <Typography.Paragraph>
            <Typography.Text type="danger">
              * This is a demo app. The payment will not be charged.
              <br />* Uses Paypal sandbox
            </Typography.Text>
          </Typography.Paragraph>
        </div>
      </div>
      <div className="w-full md:w-1/3">
        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons
            style={{
              shape: "rect",
              layout: "vertical",
            }}
            createSubscription={handleSubscription}
            onApprove={async (data) => {
              /*
              No need to activate manually since SUBSCRIBE_NOW is being used.
              Learn how to handle other user actions from our docs:
              https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_create
            */
              if (data.orderID) {
                setMessage(
                  `You have successfully subscribed to the plan. Your subscription id is: ${data.subscriptionID}`
                );
              } else {
                setMessage(
                  `Failed to activate the subscription: ${data.subscriptionID}`
                );
              }
            }}
          />
        </PayPalScriptProvider>
        <Message content={message} />
      </div>
    </div>
  );
}

export default PremiumPage;
