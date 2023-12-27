import { MealPlan } from "@social-recipes/core";
import { App, Button, Form, Input } from "antd";
import { DAYS_OF_THE_WEEK } from "../../constant";
import RecipeListInput from "../Recipe/ListInput";

interface MealPlanFormProps {
  data?: MealPlan;
  onSubmit: (data: MealPlan) => Promise<void>;
}

const MealPlanForm: React.FC<MealPlanFormProps> = ({ data, onSubmit }) => {
  const { notification } = App.useApp();
  const [form] = Form.useForm();

  async function handleSubmit(value: MealPlan) {
    try {
      await onSubmit(value);
      notification.success({
        message: "Success",
        description: "Meal plan created successfully",
      });
    } catch (e) {
      notification.error({
        message: "Error",
        description: "Unable to create meal plan",
      });
    }
  }

  const actionType = data ? "Update" : "Create";
  const initialValues: Partial<MealPlan> = {
    meals: [
      {
        name: "Monday",
        meal: [
          { name: "Breakfast", recipeIds: [] },
          { name: "Lunch", recipeIds: [] },
          { name: "Dinner", recipeIds: [] },
        ],
      },
    ],
    ...(data || {}),
  };

  return (
    <Form<MealPlan>
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Required" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Meals">
        <Form.List name="meals">
          {(fields, { add, remove }, { errors }) => (
            <div className="flex flex-col gap-1">
              {fields.map(({ key, name, ...rest }, i) => (
                <div
                  className="flex flex-col gap-1 border-solid rounded px-2 py-2 border-slate-300"
                  key={key}
                >
                  <div className="flex gap-1 items-center justify-right">
                    <Button
                      className="mt-1"
                      size="small"
                      danger
                      onClick={() => remove(name)}
                    >
                      &times;
                    </Button>
                    <div>Plan: {i + 1}</div>
                  </div>
                  <Form.Item
                    {...rest}
                    name={[name, "name"]}
                    className="grow mb-1"
                    rules={[
                      {
                        required: true,
                        message: "Required",
                      },
                    ]}
                  >
                    <Input placeholder={`Ex. Monday, Tuesday...`} />
                  </Form.Item>

                  <Form.List name={[name, "meal"]}>
                    {(
                      fieldMeal,
                      { add: addMeal, remove: removeMeal },
                      { errors: errorMeals }
                    ) => (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                          {fieldMeal.map(
                            ({ key: keyMeal, name: nameMeal, ...restMeal }) => (
                              <div key={keyMeal} className="flex gap-1">
                                <Button
                                  className="mt-1"
                                  danger
                                  size="small"
                                  onClick={() => removeMeal(nameMeal)}
                                >
                                  &times;
                                </Button>
                                <div className="grow">
                                  <Form.Item
                                    {...restMeal}
                                    name={[nameMeal, "name"]}
                                    className="mb-1"
                                    rules={[
                                      { required: true, message: "Required" },
                                    ]}
                                  >
                                    <Input placeholder="Breakfast, Lunch, ..." />
                                  </Form.Item>
                                  <Form.Item
                                    {...restMeal}
                                    className="mb-1"
                                    name={[nameMeal, "recipeIds"]}
                                    rules={[
                                      { required: true, message: "Required" },
                                    ]}
                                  >
                                    <RecipeListInput />
                                  </Form.Item>
                                </div>
                              </div>
                            )
                          )}
                          {fieldMeal.length < 3 && (
                            <Button
                              className="h-full min-h-[116px]"
                              block
                              onClick={() => addMeal()}
                            >
                              + Add
                            </Button>
                          )}
                        </div>

                        <Form.ErrorList errors={errorMeals} />
                      </>
                    )}
                  </Form.List>
                </div>
              ))}
              {fields.length < DAYS_OF_THE_WEEK.length && (
                <Button
                  onClick={() => {
                    add({
                      name: DAYS_OF_THE_WEEK[fields.length],
                      meal: [
                        { name: "Breakfast", recipeIds: [] },
                        { name: "Lunch", recipeIds: [] },
                        { name: "Dinner", recipeIds: [] },
                      ],
                    });
                  }}
                >
                  + Meal
                </Button>
              )}

              <Form.ErrorList errors={errors} />
            </div>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item>
        <Button
          className="w-full md:w-auto"
          type="primary"
          onClick={form.submit}
        >
          {actionType}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MealPlanForm;
