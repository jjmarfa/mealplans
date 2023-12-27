import { Recipe } from "@social-recipes/core";
import { FC, ReactNode, useEffect } from "react";
import useRecipes from "./useRecipes";
import getRecipeApi from "../../api/getRecipe";
import { Spin } from "antd";

interface RecipeDetailsProps {
  id: string;
  children: (value: Recipe) => ReactNode;
}

const RecipeDetails: FC<RecipeDetailsProps> = ({ id, children }) => {
  const addRecipe = useRecipes.setState;
  const record = useRecipes()[id];

  useEffect(() => {
    if (!record?.id) {
      getRecipeApi(id).then((recipe) => {
        addRecipe((s) => ({ ...s, [id]: recipe }));
      });
    }
  }, [id, addRecipe, record?.id]);

  return record ? children(record) : <Spin />;
};

export default RecipeDetails;
