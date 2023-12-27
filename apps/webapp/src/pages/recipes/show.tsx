import { Recipe } from "@social-recipes/core";
import { useEffect, useState } from "react";
import getRecipeApi from "../../api/getRecipe";
import { App, Button, Checkbox, List, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import deleteRecipeApi from "../../api/deleteRecipe";
import Divider from "../../components/Divider";
import YouTube, { YouTubeProps } from "react-youtube";
import { useAuthState } from "../../store";
import { isOwner } from "../../helpers";

const RecipeShowPage = () => {
  const { modal, notification } = App.useApp();
  const { user } = useAuthState();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>();

  useEffect(() => {
    if (id) {
      getRecipeApi(id)
        .then((result) => {
          setRecipe(result);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [id]);

  async function handleDelete() {
    modal.confirm({
      title: "Delete Recipe",
      content: "Are you sure you want to delete this recipe?",
      onOk: async () => {
        try {
          await deleteRecipeApi(id!);

          notification.success({
            message: "Recipe deleted",
            description: "Recipe successfully deleted",
          });

          navigate("/recipes");
        } catch (e) {
          notification.error({
            message: "Failed to delete recipe",
            description: `${(e as Error).message}`,
          });
        }
      },
    });
  }

  const videoCode = recipe?.videoUrl
    ? new URL(recipe.videoUrl).searchParams.get("v") || ""
    : "";
  const opts: YouTubeProps["opts"] = {
    height: "479",
    width: "853",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  return !recipe ? (
    <div />
  ) : (
    <div>
      <div className="block md:flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="w-[60px] h-[50px] rounded overflow-hidden bg-black">
            <img
              className="object-cover object-center w-full h-full"
              src={recipe.image || "/logo-black.svg"}
            />
          </div>
          <Typography.Title>{recipe.name}</Typography.Title>
        </div>

        {isOwner(user?.id, recipe) && (
          <div className="flex gap-1">
            <Button onClick={handleDelete} danger>
              Delete
            </Button>
            <Button type="primary" onClick={() => navigate("edit")}>
              Edit
            </Button>
          </div>
        )}
      </div>
      <Divider />
      <div className="flex flex-col gap-5 md:gap-10">
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-3 md:col-span-2">
            <YouTube
              className="flex justify-center items-center border border-solid border-black rounded-xl h-[200px] md:h-[500px] overflow-hidden bg-black"
              videoId={videoCode}
              opts={opts}
              iframeClassName="object-contain w-full"
            />
          </div>
          <div className="col-span-3 md:col-span-1 flex flex-col gap-5">
            <Typography.Title level={2}>Instructions</Typography.Title>
            <List
              className="overflow-auto md:overflow-scroll h-full md:h-[444px]"
              bordered
              dataSource={recipe.steps || []}
              renderItem={(item, i) => (
                <List.Item key={i}>
                  <div className="w-full">
                    <Checkbox>
                      <Typography.Title level={3}>
                        Step {i + 1}:
                      </Typography.Title>
                    </Checkbox>
                    <div className="grow pl-10 pt-3">{item}</div>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </div>
        {recipe.notes && (
          <div>
            <Typography.Title level={2}>Notes</Typography.Title>
            <Typography.Text>{recipe.notes}</Typography.Text>
          </div>
        )}
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
            <Typography.Title level={2}>Ingredients</Typography.Title>
            <List
              bordered
              dataSource={recipe.ingredients}
              renderItem={(item) => (
                <List.Item key={item.name}>
                  <div className="flex justify-between w-full">
                    <Checkbox>
                      <Typography.Text>{item.name}</Typography.Text>
                    </Checkbox>
                    <div>
                      {item.quantity} {item.unit}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
          <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
            <Typography.Title level={2}>Cooking Material</Typography.Title>
            <List
              bordered
              dataSource={recipe.tools || []}
              renderItem={(item) => (
                <List.Item key={item}>
                  <div className="flex justify-between w-full">
                    <Checkbox>
                      <Typography.Text>{item}</Typography.Text>
                    </Checkbox>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-5"></div>
      </div>
    </div>
  );
};

export default RecipeShowPage;
