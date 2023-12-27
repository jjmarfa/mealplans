import { Typography } from "antd";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import RecipeForm from "../../components/Recipe/Form";
import { Recipe } from "@social-recipes/core";
import { useEffect, useState } from "react";
import getRecipeApi from "../../api/getRecipe";
import updateRecipeApi from "../../api/updateRecipe";
import Divider from "../../components/Divider";
import { uploadImageApi } from "../../api/uploadImage";
import { useAuthState } from "../../store";

const RecipeEditPage = () => {
  const { user } = useAuthState();
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getRecipeApi(id)
        .then((result) => setRecipe(result))
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);

  if (recipe && recipe.userId !== user?.id) {
    return <Navigate to="/not-found" replace={true} />;
  }

  async function handleSubmit(value: Recipe & { image?: File | string }) {
    if (value.image && typeof value.image !== "string") {
      value.image = await uploadImageApi("recipes", id!, value.image);
    }

    await updateRecipeApi(id!, value);

    setRecipe((v) => ({ ...v, ...value }));

    navigate(`/recipes/${id}`);
  }

  return !recipe ? (
    <div />
  ) : (
    <div>
      <Typography.Title>Update Recipe</Typography.Title>
      <Divider />
      <div className="grid grid-cols-3">
        <div className="col-span-3 md:col-span-2">
          <RecipeForm data={recipe} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default RecipeEditPage;
