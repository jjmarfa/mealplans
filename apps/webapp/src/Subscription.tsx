import { useAuthState } from "./store";
import { Navigate, Outlet } from "react-router-dom";

const Subscription = () => {
  const { user } = useAuthState();

  if (!user?.subscriptionId && user?.subscriptionStatus === "ACTIVE") {
    return <Navigate to="/premium" replace />;
  }

  return <Outlet />;
};

export default Subscription;
