import {
  ActionFunctionArgs,
  Form,
  json,
  redirect,
  useActionData,
} from "react-router-dom";
import FormItem from "../components/FormItem";
import signUpApi from "../api/signUp";
import signInApi from "../api/signIn";
import { Button, Input } from "antd";

const SignUpPage = () => {
  const actionData = useActionData() as { error: string };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="prose w-1/3 rounded border p-5">
        <h1>Sign Up</h1>
        {actionData?.error}
        <Form className="flex flex-col gap-5" method="put" action="/signup">
          <FormItem label="Email">
            <Input type="email" name="email" />
          </FormItem>
          <FormItem label="Password">
            <Input type="password" name="password" />
          </FormItem>
          <FormItem>
            <Button htmlType="submit">Sign Up</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  );
};

SignUpPage.action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  try {
    await signUpApi(email, password);
    await signInApi(email, password);
  } catch (e) {
    return json({ error: "Failed to create user" }, 400);
  }

  return redirect("/");
};

export default SignUpPage;
