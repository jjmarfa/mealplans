import { Recipe } from "@social-recipes/core";
import {
  AutoComplete,
  Button,
  Form,
  FormInstance,
  Input,
  InputNumber,
} from "antd";
import React, { forwardRef } from "react";
import { INGREDIENT_CATEGORIES } from "../constant";

interface IngredientsFormProps {
  ref?: React.Ref<FormInstance>;
  ingredients: Recipe["ingredients"];
}

const IngredientsForm: React.FC<IngredientsFormProps> = forwardRef<
  FormInstance,
  IngredientsFormProps
>(({ ingredients }, ref) => {
  const categoryOptions = INGREDIENT_CATEGORIES.map((c) => ({ value: c }));

  return (
    <Form ref={ref} layout="vertical" initialValues={{ ingredients }}>
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
                      options={categoryOptions}
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
    </Form>
  );
});

export default IngredientsForm;
