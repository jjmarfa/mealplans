import { App, ConfigProvider } from "antd";
import AuthProvider from "./AuthProvider";
import theme from "./theme";

const Config: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ConfigProvider theme={theme}>
      <App>
        <AuthProvider>{children}</AuthProvider>
      </App>
    </ConfigProvider>
  );
};

export default Config;
