import { Divider, Typography } from "antd";
import MealPlanForm from "../../components/MealPlan/Form";
import { MealPlan } from "@social-recipes/core";
import createMealPlanApi from "../../api/createMealPlan";
import { useNavigate } from "react-router-dom";

const NewMealPlanPage: React.FC = () => {
  const navigate = useNavigate();

  async function handleSubmit(value: MealPlan) {
    await createMealPlanApi(value);
    navigate("/meal_plans");
  }

  return (
    <div>
      <Typography.Title>Create Meal Plan</Typography.Title>
      <Divider />
      <MealPlanForm onSubmit={handleSubmit} />
    </div>
  );
};

export default NewMealPlanPage;
