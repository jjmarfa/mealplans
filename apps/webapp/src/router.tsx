import { createBrowserRouter } from "react-router-dom";
import ApplicationLayout from "./layout/Application";
import HomePage from "./pages";
import LoginPage from "./pages/login";
import Authorize from "./Authorize";
import SignUpPage from "./pages/signup";
import Logout from "./pages/logout";
import RecipesPage from "./pages/recipes";
import RecipeShowPage from "./pages/recipes/show";
import RecipeNewPage from "./pages/recipes/new";
import RecipeEditPage from "./pages/recipes/edit";
import MealPlansPage from "./pages/meal_plans";
import NewMealPlanPage from "./pages/meal_plans/new";
import MealPlanShowPage from "./pages/meal_plans/show";
import MealPlanEditPage from "./pages/meal_plans/edit";
import Subscription from "./Subscription";
import PremiumPage from "./pages/premium";
import NotFoundPage from "./pages/notFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Authorize>
        <ApplicationLayout />
      </Authorize>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "recipes",
        children: [
          {
            index: true,
            element: <RecipesPage />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <RecipeShowPage />,
              },
              {
                path: "edit",
                element: <RecipeEditPage />,
              },
            ],
          },
          {
            path: "new",
            element: <RecipeNewPage />,
          },
        ],
      },
      {
        path: "meal_plans",
        element: <Subscription />,
        children: [
          {
            index: true,
            element: <MealPlansPage />,
          },
          {
            path: "new",
            element: <NewMealPlanPage />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <MealPlanShowPage />,
              },
              {
                path: "edit",
                element: <MealPlanEditPage />,
              },
            ],
          },
        ],
      },
      {
        path: "premium",
        element: <PremiumPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
    action: SignUpPage.action,
  },
  {
    path: "/logout",
    action: Logout,
  },
  {
    path: "/not-found",
    element: <NotFoundPage />,
  },
]);

export default router;
