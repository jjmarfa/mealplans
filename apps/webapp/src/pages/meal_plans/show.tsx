import { Link, useNavigate, useParams } from "react-router-dom";
import MealPlanDetails from "../../components/MealPlan/Details";
import { App, Button, FormInstance, Typography } from "antd";
import RecipeDetails from "../../components/Recipe/Details";
import deleteMealPlanApi from "../../api/deleteMealPlan";
import useRecipes from "../../components/Recipe/useRecipes";
import { MealPlan, Recipe } from "@social-recipes/core";
import {
  formatIngredient,
  getRecipesIngredients,
  groupIngredientsByCategory,
} from "../../helpers";
import updateMealPlanApi from "../../api/updateMealPlan";
import useMealPlans from "../../components/MealPlan/useMealPlans";
import { createRef } from "react";
import IngredientsForm from "../../components/IngredientsForm";
import Divider from "../../components/Divider";

const MealPlanShowPage = () => {
  const { id } = useParams<{ id: string }>();
  const recipes = useRecipes();
  const setMealPlan = useMealPlans.setState;
  const { modal, notification } = App.useApp();
  const ingredientFormRef = createRef<FormInstance<Recipe>>();
  const navigate = useNavigate();

  async function handleResetIngredients(mealPlan: MealPlan) {
    const mealRecipes = mealPlan.meals.reduce((acc, plan) => {
      plan.meal.forEach((m) => {
        m.recipeIds.forEach((recipeId) => {
          acc.push(recipes[recipeId]);
        });
      });
      return acc;
    }, [] as Recipe[]);

    const ingredients = getRecipesIngredients(mealRecipes);

    modal.confirm({
      title: "Reset ingredients",
      content: "Are you sure you want to reset the ingredients?",
      onOk: async () => {
        try {
          const result = await updateMealPlanApi(id!, {
            ...mealPlan,
            ingredients,
          });

          setMealPlan((s) => ({ ...s, [id!]: result }));

          notification.success({
            message: "Success",
            description: "Meal Plan ingredients updated successfully",
          });
        } catch (e) {
          console.error(e);

          notification.error({
            message: "Error",
            description: "An error occurred while updating the Meal Plan",
          });
        }
      },
    });
  }

  function handleDelete() {
    modal.confirm({
      title: "Delete Meal Plan",
      content: "Are you sure you want to delete this Meal Plan?",
      onOk: async () => {
        try {
          await deleteMealPlanApi(id!);
          navigate("/meal_plans");
          notification.success({
            message: "Success",
            description: "Meal Plan deleted successfully",
          });
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

  async function handleCopyIngredients(mealPlan: MealPlan) {
    const group = groupIngredientsByCategory(mealPlan.ingredients);
    let text: string = "";

    Object.keys(group).forEach((category) => {
      text += `${category}\n`;
      text += formatIngredient(group[category]);
      text += `\n`;
    });

    await navigator.clipboard.writeText(text);

    notification.success({
      message: "Success",
      description: "Ingredients copied to clipboard",
    });
  }

  async function handleCopyPlans(mealPlan: MealPlan) {
    let text = "";

    mealPlan.meals.forEach((plan) => {
      text += `${plan.name}\n`;
      plan.meal.forEach((m) => {
        text += `  ${m.name}\n`;
        m.recipeIds.forEach((recipeId) => {
          const recipe = recipes[recipeId];
          text += `    * ${recipe.name}\n`;
          recipe.ingredients.forEach((ingredient) => {
            text += `       - ${ingredient.quantity} ${ingredient.unit} : ${ingredient.name}\n`;
          });
        });
      });
      text += `\n`;
    });

    await navigator.clipboard.writeText(text);
    notification.success({
      message: "Success",
      description: "Meal Plans copied to clipboard",
    });
  }

  function renderIngredients(mealPlan: MealPlan) {
    const group = groupIngredientsByCategory(mealPlan.ingredients);

    return Object.keys(group).map((category) => (
      <div key={category}>
        <Typography.Title level={4}>{category}</Typography.Title>
        <div>
          {group[category].map((ingredient, i) => (
            <div key={i}>
              {ingredient.quantity} {ingredient.unit} - {ingredient.name}
            </div>
          ))}
        </div>
      </div>
    ));
  }

  function handleUpdate(mealPlan: MealPlan) {
    const { ingredients } = mealPlan;

    modal.confirm({
      title: "All Ingredients",
      style: { top: "1svh" },
      icon: null,
      content: (
        <div className="overflow-y-scroll overflow-x-hidden h-[85svh] w-full">
          <IngredientsForm ref={ingredientFormRef} ingredients={ingredients} />
        </div>
      ),
      width: "800px",
      centered: true,
      onOk: async () => {
        if (ingredientFormRef.current) {
          const values = ingredientFormRef.current.getFieldsValue();

          try {
            const result = await updateMealPlanApi(id!, {
              ...mealPlan,
              ingredients: values.ingredients,
            });

            setMealPlan((s) => ({ ...s, [id!]: result }));
            notification.success({
              message: "Success",
              description: "Meal Plan ingredients updated successfully",
            });
          } catch (e) {
            console.error(e);

            notification.error({
              message: "Error",
              description: "An error occurred while updating the Meal Plan",
            });
          }
        }
      },
      okText: "Confirm",
    });
  }

  return (
    <MealPlanDetails id={id!}>
      {(mealPlan) => (
        <div>
          <div className="block md:flex justify-between items-center">
            <Typography.Title>{mealPlan.name}</Typography.Title>
            <div className="flex gap-1">
              <Button type="primary" danger onClick={handleDelete}>
                Delete
              </Button>

              <Button type="primary" onClick={() => navigate("edit")}>
                Update
              </Button>
            </div>
          </div>
          <Divider />
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-5">
              <Typography.Title level={2}>Descriptions</Typography.Title>
              <Typography.Text>{mealPlan.description}</Typography.Text>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <Typography.Title level={2}>Plans</Typography.Title>
                <div>
                  <Button onClick={() => handleCopyPlans(mealPlan)}>
                    Copy
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {mealPlan.meals.map((plan, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <Typography.Title level={3}>{plan.name}</Typography.Title>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {plan.meal.map((m, mi) => (
                        <div
                          key={mi}
                          className="flex flex-col gap-5 py-3 px-5 border border-solid border-slate-300 rounded"
                        >
                          <Typography.Title level={4}>
                            {m.name}
                          </Typography.Title>
                          <div>
                            {m.recipeIds.map((recipeId) => (
                              <RecipeDetails key={recipeId} id={recipeId}>
                                {(recipe) => (
                                  <div>
                                    <Link to={`/recipes/${recipeId}`}>
                                      {recipe.name}
                                    </Link>
                                  </div>
                                )}
                              </RecipeDetails>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="block md:flex justify-between items-center">
                <Typography.Title level={2}>Ingredients</Typography.Title>
                <div className="flex gap-1">
                  <Button
                    type="primary"
                    onClick={() => handleResetIngredients(mealPlan)}
                  >
                    Reset
                  </Button>

                  <Button
                    type="primary"
                    onClick={() => handleCopyIngredients(mealPlan)}
                  >
                    Copy
                  </Button>
                  <Button type="primary" onClick={() => handleUpdate(mealPlan)}>
                    Update
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {renderIngredients(mealPlan)}
              </div>
            </div>
          </div>
        </div>
      )}
    </MealPlanDetails>
  );
};

export default MealPlanShowPage;
