import { Navigate, useLocation } from "react-router-dom";
import { useAuthState } from "./store";

const Authorize: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, loaded } = useAuthState();
  const location = useLocation();

  if (loaded && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default Authorize;
