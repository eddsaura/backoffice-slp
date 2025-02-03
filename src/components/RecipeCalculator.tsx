import { PaellaItem } from "../types/order";
import {
  calculateAllIngredients,
  formatAmount,
} from "../lib/proportions/calculator";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { useState } from "react";

export function RecipeCalculator() {
  const [recipe, setRecipe] = useState<PaellaItem>({
    id: "1",
    type: "Valenciana",
    servings: 10,
  });

  const ingredients = calculateAllIngredients(recipe.type, recipe.servings);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Paella Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Select
            label="Paella Type"
            value={recipe.type}
            onChange={(e) =>
              setRecipe({
                ...recipe,
                type: e.target.value as PaellaItem["type"],
              })
            }
          >
            <option value="Valenciana">Valenciana</option>
            <option value="Seafood">Seafood</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Mixed">Mixed</option>
          </Select>
          <Input
            label="Number of Servings"
            type="number"
            min="1"
            value={recipe.servings}
            onChange={(e) =>
              setRecipe({ ...recipe, servings: Number(e.target.value) })
            }
          />
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Required Ingredients
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(ingredients).map(([ingredient, proportion]) => (
              <div
                key={ingredient}
                className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
              >
                <span className="text-gray-900 capitalize">{ingredient}</span>
                <span className="font-medium text-gray-900">
                  {formatAmount(proportion)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
