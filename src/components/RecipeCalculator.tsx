import React from "react";
import { Recipe } from "../types/order";
import { Select } from "./ui/Select";
import { Input } from "./ui/Input";
import {
  calculateRecipeIngredients,
  formatQuantity,
  type CalculatedIngredient,
} from "../lib/recipeCalculator";

interface RecipeCalculatorProps {
  recipes: Recipe[];
}

export function RecipeCalculator({ recipes }: RecipeCalculatorProps) {
  const [selectedRecipeId, setSelectedRecipeId] = React.useState<string>("");
  const [servings, setServings] = React.useState<number>(1);
  const [calculation, setCalculation] = React.useState<
    CalculatedIngredient[] | null
  >(null);

  const selectedRecipe = React.useMemo(
    () => recipes.find((r) => r.id === selectedRecipeId),
    [recipes, selectedRecipeId]
  );

  const handleCalculate = () => {
    if (!selectedRecipe) return;
    const result = calculateRecipeIngredients(selectedRecipe, servings);
    setCalculation(result.ingredients);
  };

  React.useEffect(() => {
    if (selectedRecipe) {
      setServings(selectedRecipe.baseServings);
      setCalculation(null);
    }
  }, [selectedRecipe]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recipe Calculator
        </h2>
        <div className="space-y-4">
          <Select
            label="Select Recipe"
            value={selectedRecipeId}
            onChange={(e) => setSelectedRecipeId(e.target.value)}
          >
            <option value="">Choose a recipe...</option>
            {recipes.map((recipe) => (
              <option key={recipe.id} value={recipe.id}>
                {recipe.name} ({recipe.baseServings} servings)
              </option>
            ))}
          </Select>

          {selectedRecipe && (
            <>
              <Input
                type="number"
                min="1"
                label="Number of Servings"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
              />
              <button
                onClick={handleCalculate}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Calculate Ingredients
              </button>
            </>
          )}
        </div>
      </div>

      {calculation && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Required Ingredients for {servings} servings
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {calculation.map((ing, index) => (
              <div
                key={index}
                className="px-4 py-3 flex items-center justify-between"
              >
                <span className="font-medium text-gray-900">{ing.name}</span>
                <div className="text-gray-500 space-x-2">
                  <span>{formatQuantity(ing.quantity, ing.unit)}</span>
                  <span className="text-gray-400">
                    (originally {formatQuantity(ing.originalQuantity, ing.unit)}
                    )
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
