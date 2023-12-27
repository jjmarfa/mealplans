import { Recipe } from "@social-recipes/core";
import {
  App,
  Button,
  Checkbox,
  Divider,
  FormInstance,
  Tag,
  Typography,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import getRecipesApi from "../../api/getRecipes";
import { createRef, useEffect, useState } from "react";
import { useAuthState } from "../../store";
import {
  CheckSquareFilled,
  CheckSquareOutlined,
  CloseOutlined,
  FormOutlined,
} from "@ant-design/icons";
import deleteRecipeApi from "../../api/deleteRecipe";
import IngredientsForm from "../../components/IngredientsForm";
import { getRecipesIngredients } from "../../helpers";

const RecipesPage = () => {
  const { modal, notification } = App.useApp();
  const navigate = useNavigate();
  const { user } = useAuthState();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectView, setSelectView] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const ingredientFormRef = createRef<FormInstance<Recipe>>();

  useEffect(() => {
    if (user?.id) {
      getRecipesApi(user.id)
        .then((recipes) => {
          setRecipes(recipes);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user?.id]);

  async function handleRemoveRecipe(recipeId: string) {
    modal.confirm({
      title: "Delete Recipe",
      content: "Are you sure you want to delete this recipe?",
      onOk: async () => {
        try {
          await deleteRecipeApi(recipeId);

          setRecipes((recipes) => recipes.filter((r) => r.id !== recipeId));

          notification.success({
            message: "Recipe deleted",
            description: "Recipe successfully deleted",
          });
        } catch (e) {
          notification.error({
            message: "Failed to delete recipe",
            description: `${(e as Error).message}`,
          });
        }
      },
    });
  }

  function handleListIngredients() {
    const ingredients = getRecipesIngredients(
      selectedRecipes.map((recipeId) => recipes.find((r) => r.id === recipeId)!)
    );

    modal.info({
      title: "Selected Recipe Ingredients",
      content: (
        <div className="overflow-y-scroll h-[500px]">
          <IngredientsForm ref={ingredientFormRef} ingredients={ingredients} />
        </div>
      ),
      icon: false,
      className: "!w-[700px]",
      centered: false,
      onOk: async () => {
        if (ingredientFormRef.current) {
          const values = ingredientFormRef.current.getFieldsValue();

          const text = values.ingredients.reduce((acc, ingredient) => {
            acc += `${ingredient.quantity} ${ingredient.unit} - ${ingredient.name}\n`;
            return acc;
          }, "" as string);

          await navigator.clipboard.writeText(text);
        }
      },
      okText: "Copy to clipboard",
    });
  }

  function isSelected(recipeId: string) {
    return selectedRecipes.includes(recipeId);
  }

  function handleSelect(recipeId: string) {
    const index = selectedRecipes.indexOf(recipeId);
    const newState = [...selectedRecipes];

    if (index === -1) {
      newState.push(recipeId);
    } else {
      newState.splice(index, 1);
    }

    setSelectedRecipes(newState);
  }

  return (
    <div className="flex flex-col">
      <div className="bloc justify-between items-center md:flex">
        <Typography.Title className="shrink-0 m-0">Recipes</Typography.Title>
        <div className="flex gap-2">
          <Button
            type={selectView ? "dashed" : "primary"}
            onClick={() => setSelectView((s) => !s)}
          >
            {selectView ? <CheckSquareFilled /> : <CheckSquareOutlined />}
            Select
          </Button>
          <Button type="primary" onClick={() => navigate("new")}>
            Create
          </Button>
        </div>
      </div>
      <Divider className="my-2 md:my-5" />
      {selectView && (
        <div className="flex mb-5 items-center justify-between">
          <div>Selected: {selectedRecipes.length}</div>
          <div>
            <Button type="primary" onClick={() => handleListIngredients()}>
              List Ingredients
            </Button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-6">
        {recipes.map((recipe) => (
          <div
            className="relative w-full overflow-hidden rounded-lg"
            key={recipe.id}
          >
            {selectView && (
              <div
                className="absolute w-full h-full top-0 left-0 py-2 px-2 cursor-pointer"
                onClick={() => handleSelect(recipe.id)}
              >
                <Checkbox checked={isSelected(recipe.id)} />
              </div>
            )}
            <Link to={recipe.id} className="bg-black h-[300px] block">
              <img
                className="object-cover w-full h-full"
                src={recipe.image || "/logo-black.svg"}
              />
            </Link>
            <Link
              to={recipe.id}
              className="absolute z-10 bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black to-transparent"
            />
            <div className="absolute z-20 bottom-0 left-0 w-full py-3 px-5">
              <div className="flex justify-between">
                <Link to={recipe.id} className="text-lg text-white">
                  {recipe.name}
                </Link>
                <div className="flex gap-1">
                  <Button
                    size="small"
                    onClick={() => navigate(`${recipe.id}/edit`)}
                  >
                    <FormOutlined />
                  </Button>
                  <Button
                    size="small"
                    danger
                    onClick={() => handleRemoveRecipe(recipe.id)}
                  >
                    <CloseOutlined />
                  </Button>
                </div>
              </div>
              <div className="text-slate-500">
                <div>Ingredients: {recipe.ingredients.length}</div>
                {recipe.categories?.map((category) => (
                  <Tag key={category} color="blue">
                    {category}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipesPage;
