import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";
import getTypesenseClient from ".";
import { addPrefix } from "./helper";

const setup = async () => {
  const typesenseClient = getTypesenseClient();

  const recipeResult = await typesenseClient
    .collections(addPrefix("recipes"))
    .exists();
  if (!recipeResult) {
    const recipeSchema: CollectionCreateSchema = {
      name: addPrefix("recipes"),
      fields: [
        {
          name: "id",
          type: "string",
        },
        {
          name: "name",
          type: "string",
        },
        {
          name: "public",
          type: "bool",
        },
      ],
    };

    await typesenseClient.collections().create(recipeSchema);
  }

  const mealPlanResult = await typesenseClient
    .collections(addPrefix("mealPlans"))
    .exists();

  if (!mealPlanResult) {
    const mealPlanSchema: CollectionCreateSchema = {
      name: addPrefix("mealPlans"),
      fields: [
        {
          name: "id",
          type: "string",
        },
        {
          name: "name",
          type: "string",
        },
        {
          name: "description",
          type: "string",
        },
      ],
    };

    await typesenseClient.collections().create(mealPlanSchema);
  }

  const userResult = await typesenseClient
    .collections(addPrefix("users"))
    .exists();

  if (!userResult) {
    const userSchema: CollectionCreateSchema = {
      name: addPrefix("users"),
      fields: [
        {
          name: "id",
          type: "string",
        },
        {
          name: "email",
          type: "string",
        },
      ],
    };

    await typesenseClient.collections().create(userSchema);
  }
};

try {
  setup().then(() => {
    console.log("SETUP COMPLETE");
  });
} catch (e) {
  throw e;
}
