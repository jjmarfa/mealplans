import { useEffect } from "react";
import subscribeAuthUser from "./api/subscribeAuthUser";
import { useAuthState } from "./store";
import { Spin } from "antd";
import { useShallow } from "zustand/react/shallow";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [loaded, setUser] = useAuthState(
    useShallow((s) => [s.loaded, s.setUser])
  );

  useEffect(() => {
    const unsubscribe = subscribeAuthUser((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, [setUser]);

  if (!loaded) {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <div className="flex gap-5 shadow-sm rounded border py-5 px-10">
          <Spin />
          Checking authentication...
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
