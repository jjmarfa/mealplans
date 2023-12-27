import { App, Button, Divider, Typography } from "antd";
import { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import getMealPlansApi from "../../api/getMealPlans";
import { useAuthState } from "../../store";
import { MealPlan } from "@social-recipes/core";
import { CloseOutlined, FormOutlined } from "@ant-design/icons";
import deleteMealPlanApi from "../../api/deleteMealPlan";

const MealPlansPage: FC = () => {
  const { modal, notification } = App.useApp();
  const { user } = useAuthState();
  const navigate = useNavigate();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

  useEffect(() => {
    if (user?.id) {
      getMealPlansApi(user.id).then((mealPlans) => {
        setMealPlans(mealPlans);
      });
    }
  }, [user?.id]);

  async function handleRemoveRecipe(id: string) {
    modal.confirm({
      title: "Delete Meal Plan",
      content: "Are you sure you want to delete this Meal Plan?",
      onOk: async () => {
        try {
          await deleteMealPlanApi(id);

          notification.success({
            message: "Success",
            description: "Meal Plan deleted successfully",
          });

          setMealPlans((mealPlans) => mealPlans.filter((p) => p.id !== id));
        } catch (e) {
          console.error(e);
          notification.error({
            message: "Error",
            description: "An error occurred while deleting the Meal Plan",
          });
        }
      },
    });
  }

  return (
    <div className="flex flex-col">
      <div className="block md:flex justify-between items-center">
        <Typography.Title>My Meal Plans</Typography.Title>
        <div>
          <Button type="primary" onClick={() => navigate("new")}>
            Create
          </Button>
        </div>
      </div>
      <Divider className="my-2 md:my-5" />
      <div className="grid grid-cols-1 gap-2 md:gap-3">
        {mealPlans.map((mealPlan) => (
          <div
            className="rounded border-slate-300 border-solid py-2 md:py-5 px-3 md:px-8 relative"
            key={mealPlan.id}
          >
            <div className="flex justify-between">
              <Link to={mealPlan.id}>{mealPlan.name}</Link>
              <div className="flex gap-1">
                <Button
                  size="small"
                  onClick={() => navigate(`${mealPlan.id}/edit`)}
                >
                  <FormOutlined />
                </Button>
                <Button
                  size="small"
                  danger
                  onClick={() => handleRemoveRecipe(mealPlan.id)}
                >
                  <CloseOutlined />
                </Button>
              </div>
            </div>
            <div className="mb-3">{mealPlan.description}</div>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2 md:gap-3">
              {mealPlan.meals.map((plan, i) => (
                <div
                  key={i}
                  className="border border-solid rounded border-slate-200 py-3 px-5 flex flex-col gap-1 h-full"
                >
                  <div className="font-bold">{plan.name}</div>
                  <div className="grid grid-cols-3 md:block">
                    {plan.meal.map((m, mi) => (
                      <div key={mi}>
                        {m.name} - {m.recipeIds.length}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlansPage;
