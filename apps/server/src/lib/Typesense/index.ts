import { defineInt, defineString } from "firebase-functions/params";
import Typesense from "typesense";
import dotEnv from "dotenv";

dotEnv.config({ path: ".env" });

const getTypesenseClient = () => {
  const host = defineString("TYPESENSE_HOST").value();
  const port = defineInt("TYPESENSE_PORT").value();
  const protocol = defineString("TYPESENSE_PROTOCOL").value();
  const apiKey = defineString("TYPESENSE_API_KEY").value();

  return new Typesense.Client({
    nodes: [
      {
        host,
        port,
        protocol,
      },
    ],
    apiKey,
    connectionTimeoutSeconds: 2,
  });
};

export default getTypesenseClient;
