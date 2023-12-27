import { ActionFunctionArgs, redirect } from "react-router-dom";
import signOutApi from "../api/signOut";

const Logout = async ({ request }: ActionFunctionArgs) => {
  if (request.method === "DELETE") {
    await signOutApi();
  }

  redirect("/login");
};

export default Logout;
