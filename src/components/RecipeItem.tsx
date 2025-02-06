import React from "react";
import { Recipe } from "../types/order";
import { ChevronRight, Clock, Users } from "lucide-react";

interface RecipeItemProps {
  recipe: Recipe;
  onEdit?: (recipe: Recipe) => void;
}

export function RecipeItem({ recipe, onEdit }: RecipeItemProps) {
  return (
    <div
      className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => onEdit?.(recipe)}
    >
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{recipe.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {recipe.baseServings} servings
            </div>
            {recipe.cookingTimeMinutes && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {recipe.cookingTimeMinutes}min
              </div>
            )}
          </div>
        </div>
        {recipe.description && (
          <p className="mt-1 text-sm text-gray-500">{recipe.description}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          {recipe.ingredients.map((ing) => (
            <span
              key={ing.id}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
            >
              {ing.ingredient.name} ({ing.quantity} {ing.ingredient.unit})
            </span>
          ))}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
    </div>
  );
}
