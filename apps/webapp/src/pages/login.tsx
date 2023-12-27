import { Link, Navigate, useNavigate } from "react-router-dom";
import signInApi from "../api/signIn";
import { useAuthState } from "../store";
import { App, Button, Carousel, Form, Input } from "antd";
import { useState } from "react";
interface LoginValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { user } = useAuthState();
  const { notification } = App.useApp();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(values: LoginValues) {
    setSubmitting(true);
    try {
      await signInApi(values.email, values.password);
      setSubmitting(false);
      navigate("/");
      notification.success({
        message: "Success",
        description: "You have successfully logged in",
      });
    } catch (e) {
      notification.error({
        message: "Error",
        description: "Invalid email or password",
      });
      setSubmitting(false);
    }
  }

  if (user) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div className="grid grid-cols-3">
      <div className="col-span-2 hidden md:block">
        <Carousel autoplay effect="fade" dots={false} autoplaySpeed={5000}>
          <div className="bg-orange-300 h-[100svh]"></div>
          <div className="bg-blue-300 h-[100svh]"></div>
          <div className="bg-green-300 h-[100svh] flex items-center justi"></div>
          <div className="bg-red-300 h-[100svh] flex items-center justi"></div>
        </Carousel>
      </div>
      <div className="col-span-3 md:col-span-1 h-[100svh] flex flex-col justify-start items-center">
        <div className="mt-20 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="logo"
            className="w-[300px] h-[300px] mx-auto"
          />
        </div>
        <Form<LoginValues>
          layout="vertical"
          className="w-full px-10 md:px-20"
          onFinish={handleLogin}
        >
          <Form.Item name="email">
            <Input type="email" name="email" placeholder="Email" />
          </Form.Item>
          <Form.Item name="password">
            <Input type="password" name="password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <div className="flex justify-end gap-5 items-center">
              <Link to="/signup">Sign up</Link>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Login
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
