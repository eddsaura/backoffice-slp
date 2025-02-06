import React from "react";
import { Recipe } from "../types/order";
import { RecipeItem } from "./RecipeItem";

interface RecipeListProps {
  recipes: Recipe[];
  onEditRecipe?: (recipe: Recipe) => void;
}

export function RecipeList({ recipes, onEditRecipe }: RecipeListProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Recipes</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {recipes.map((recipe) => (
          <RecipeItem key={recipe.id} recipe={recipe} onEdit={onEditRecipe} />
        ))}
        {recipes.length === 0 && (
          <div className="px-4 py-6 text-center text-gray-500">
            No recipes found
          </div>
        )}
      </div>
    </div>
  );
}
