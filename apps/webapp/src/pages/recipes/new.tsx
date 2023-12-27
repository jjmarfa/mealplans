import { Typography } from "antd";
import RecipeForm from "../../components/Recipe/Form";
import { Recipe } from "@social-recipes/core";
import createRecipeApi from "../../api/createRecipe";
import { useNavigate } from "react-router-dom";
import Divider from "../../components/Divider";
import { uploadImageApi } from "../../api/uploadImage";
import updateRecipeApi from "../../api/updateRecipe";

const RecipeNewPage = () => {
  const navigate = useNavigate();

  async function handleSubmit(value: Recipe & { image?: File | string }) {
    const { image, ...rest } = value;
    const createdRecipe = await createRecipeApi({
      ...rest,
    });

    if (image) {
      const imageUrl = await uploadImageApi(
        "recipes",
        createdRecipe.id,
        image as File
      );

      await updateRecipeApi(createdRecipe.id, { ...rest, image: imageUrl });
    }

    navigate("/recipes");
  }

  return (
    <div>
      <Typography.Title>Create Recipe</Typography.Title>
      <Divider />

      <div className="grid grid-cols-3">
        <div className="col-span-3 md:col-span-2">
          <RecipeForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default RecipeNewPage;
