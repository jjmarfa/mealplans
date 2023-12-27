import { useNavigate, useParams } from "react-router-dom";
import MealPlanDetails from "../../components/MealPlan/Details";
import { Typography } from "antd";
import MealPlanForm from "../../components/MealPlan/Form";
import { MealPlan } from "@social-recipes/core";
import updateMealPlanApi from "../../api/updateMealPlan";
import useMealPlans from "../../components/MealPlan/useMealPlans";
import Divider from "../../components/Divider";

const MealPlanEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const setMealPlans = useMealPlans.setState;

  async function handleSubmit(val: MealPlan) {
    const result = await updateMealPlanApi(id!, val);

    setMealPlans((state) => ({ ...state, [id!]: result }));

    navigate(`/meal_plans/${id}`);
  }

  return (
    <MealPlanDetails id={id!}>
      {(mealPlan) => (
        <div>
          <Typography.Title>Edit Meal Plan</Typography.Title>
          <Divider />
          <MealPlanForm data={mealPlan} onSubmit={handleSubmit} />
        </div>
      )}
    </MealPlanDetails>
  );
};

export default MealPlanEditPage;
