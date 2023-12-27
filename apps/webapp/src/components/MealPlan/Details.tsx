import { MealPlan } from "@social-recipes/core";
import { FC, ReactNode, useEffect } from "react";
import useMealPlans from "./useMealPlans";
import getMealPlanApi from "../../api/getMealPlan";

interface MealPlanDetailsProps {
  id: string;
  children: (val: MealPlan) => ReactNode;
}

const MealPlanDetails: FC<MealPlanDetailsProps> = ({ id, children }) => {
  const setMealPlans = useMealPlans.setState;
  const mealPlan = useMealPlans((s) => s[id]);

  useEffect(() => {
    if (!mealPlan?.id) {
      getMealPlanApi(id).then((mealPlan) => {
        setMealPlans((state) => ({ ...state, [id]: mealPlan }));
      });
    }
  }, [mealPlan?.id, setMealPlans, id]);

  return mealPlan ? children(mealPlan) : null;
};

export default MealPlanDetails;
