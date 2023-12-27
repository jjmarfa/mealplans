import { Recipe } from "@social-recipes/core";
import { Tag } from "antd";
import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";

interface RecipesCardProps {
  recipe: Recipe;
  actions?: ReactNode;
}

const RecipeCard: FC<RecipesCardProps> = ({ recipe, actions }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-lg" key={recipe.id}>
      <Link to={`recipes/${recipe.id}`} className="bg-black h-[300px] block">
        <img className="object-cover w-full h-full" src={recipe.image} />
      </Link>
      <Link
        to={`recipes/${recipe.id}`}
        className="absolute z-10 bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black to-transparent"
      />
      <div className="absolute z-20 bottom-0 left-0 w-full py-3 px-5">
        <div className="flex justify-between">
          <Link to={`recipes/${recipe.id}`} className="text-lg text-white">
            {recipe.name}
          </Link>
          {actions && <div className="flex gap-1">{actions}</div>}
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
  );
};

export default RecipeCard;
