import {
  App,
  AutoComplete,
  Button,
  Form,
  Input,
  InputNumber,
  Switch,
} from "antd";
import InputTag from "../../components/InputTag";
import { Recipe } from "@social-recipes/core";
import { useState } from "react";
import { INGREDIENT_CATEGORIES } from "../../constant";
import UploadInput from "../UploadInput";

interface RecipeFormProps {
  data?: Recipe;
  onSubmit: (recipe: Recipe & { image?: string | File }) => Promise<void>;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ data, onSubmit }) => {
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const [submitting, setSubmitting] = useState(false);
  const actionType = data ? "Update" : "Create";

  async function handleSubmit(value: Recipe) {
    setSubmitting(true);
    try {
      value.public = value.public || false;
      if (value) await onSubmit(value);
      notification.success({
        message: `Recipe ${actionType}`,
        description: `Recipe successfully ${actionType.toLowerCase()}d`,
        placement: "top",
        duration: 2,
      });
    } catch (e) {
      notification.error({
        message: "Error",
        description: (e as Error).message,
        placement: "top",
      });
      setSubmitting(false);
    }
  }

  const ingredientCategoryOptions = INGREDIENT_CATEGORIES.map((category) => ({
    value: category,
  }));

  return (
    <Form<Recipe>
      layout="vertical"
      onFinish={(val) => handleSubmit(val)}
      initialValues={data}
      form={form}
    >
      <Form.Item label="Image" name="image">
        <UploadInput />
      </Form.Item>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Required" }]}
      >
        <Input placeholder="Recipe name" />
      </Form.Item>
      <Form.Item label="Video URL" name="videoUrl">
        <Input placeholder="Video Url" />
      </Form.Item>

      <Form.Item label="Public" name="public" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="Ingredients" required>
        <Form.List
          name="ingredients"
          rules={[
            {
              validator: (_, ing) => {
                if (!ing || ing.length < 1) {
                  return Promise.reject(new Error("Required"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <div className="flex flex-col gap-1">
              {fields.map(({ key, name, ...rest }) => (
                <div
                  className="block md:grid md:grid-cols-10 gap-1 md:gap-2 mt-2 first:mt-0"
                  key={key}
                >
                  <div className="flex gap-1 col-span-10 md:col-span-4">
                    <Button
                      className="mt-1"
                      size="small"
                      danger
                      onClick={() => remove(name)}
                    >
                      &times;
                    </Button>
                    <Form.Item
                      {...rest}
                      className="grow mb-1"
                      name={[name, "name"]}
                      rules={[
                        {
                          required: true,
                          message: "Required",
                        },
                      ]}
                    >
                      <Input placeholder="name" />
                    </Form.Item>
                  </div>
                  <div className="col-span-10 md:col-span-2">
                    <Form.Item
                      {...rest}
                      className="mb-1"
                      name={[name, "category"]}
                      rules={[
                        {
                          required: true,
                          message: "Required",
                        },
                      ]}
                    >
                      <AutoComplete
                        placeholder="type"
                        options={ingredientCategoryOptions}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-span-10 md:col-span-2">
                    <Form.Item
                      {...rest}
                      className="mb-1"
                      name={[name, "quantity"]}
                      rules={[
                        {
                          required: true,
                          message: "Required",
                        },
                      ]}
                    >
                      <InputNumber className="w-full" placeholder="quantity" />
                    </Form.Item>
                  </div>
                  <div className="col-span-10 md:col-span-2">
                    <Form.Item
                      {...rest}
                      className="mb-1"
                      name={[name, "unit"]}
                      rules={[
                        {
                          required: true,
                          message: "Required",
                        },
                      ]}
                    >
                      <Input placeholder="unit" />
                    </Form.Item>
                  </div>
                </div>
              ))}
              <Button onClick={() => add()}>+ Ingredient</Button>
              <Form.ErrorList errors={errors} />
            </div>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item label="Cooking Materials">
        <Form.List name="tools">
          {(fields, { add, remove }, { errors }) => (
            <div className="flex flex-col gap-1">
              {fields.map(({ key, ...rest }) => (
                <div className="flex gap-1" key={key}>
                  <Button
                    className="mt-1"
                    size="small"
                    danger
                    onClick={() => remove(rest.name)}
                  >
                    &times;
                  </Button>
                  <Form.Item
                    {...rest}
                    className="grow mb-1"
                    rules={[
                      {
                        required: true,
                        message: "Required",
                      },
                    ]}
                  >
                    <Input placeholder={`Ex. Spatula, Wok, Pan...`} />
                  </Form.Item>
                </div>
              ))}
              <Button
                onClick={() => {
                  add();
                }}
              >
                + Tools
              </Button>
              <Form.ErrorList errors={errors} />
            </div>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item label="Steps">
        <Form.List name="steps">
          {(fields, { add, remove }, { errors }) => (
            <div className="flex flex-col gap-1">
              {fields.map(({ key, ...rest }, index) => (
                <div className="flex gap-1" key={key}>
                  <Button
                    className="mt-1"
                    size="small"
                    danger
                    onClick={() => remove(rest.name)}
                  >
                    &times;
                  </Button>
                  <Form.Item
                    {...rest}
                    className="grow"
                    rules={[
                      {
                        required: true,
                        message: "Required",
                      },
                    ]}
                  >
                    <Input.TextArea placeholder={`Step ${index + 1}`} />
                  </Form.Item>
                </div>
              ))}
              <Button
                onClick={() => {
                  add();
                }}
              >
                + Step
              </Button>
              <Form.ErrorList errors={errors} />
            </div>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item label="Notes" name="notes">
        <Input.TextArea placeholder="Notes" />
      </Form.Item>
      <Form.Item label="Categories" name="categories">
        <InputTag placeholder="Press 'Enter' to add category" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={form.submit} loading={submitting}>
          {actionType}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RecipeForm;
