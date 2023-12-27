import createMealPlan from "./createMealPlan";
import MealPlanRepository from "../repository/MealPlan";
import { MealPlan } from "../types";
import authorize from "../authorization";
import { mealPlanFactory } from "../factory";

jest.mock("../authorization");
jest.mock("../repository/MealPlan");

describe("createMealPlan", () => {
  it("should create a meal plan", async () => {
    const userId = "user123";
    const { id, ...params } = mealPlanFactory();

    (authorize as jest.Mock).mockImplementationOnce(() => {});
    (MealPlanRepository.prototype.create as jest.Mock).mockResolvedValueOnce({
      id,
      ...params,
    });

    const result = await createMealPlan(userId, params);

    expect(authorize).toHaveBeenCalledWith(userId, "mealPlan", {
      type: "create",
    });
    expect(MealPlanRepository.prototype.create).toHaveBeenCalledWith({
      ...params,
      userId,
    });
    expect(result).toEqual({
      id,
      ...params,
    });
  });
});
