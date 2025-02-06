import { Recipe, RecipeIngredient } from "../types/order";

export interface CalculatedIngredient {
  name: string;
  quantity: number;
  unit: string;
  originalQuantity: number;
}

export interface RecipeCalculation {
  recipe: Recipe;
  servings: number;
  ingredients: CalculatedIngredient[];
  scalingFactor: number;
}

export function calculateRecipeIngredients(recipe: Recipe, targetServings: number): RecipeCalculation {
  const scalingFactor = targetServings / recipe.baseServings;

  const calculatedIngredients = recipe.ingredients.map((ing): CalculatedIngredient => ({
    name: ing.ingredient.name,
    quantity: ing.quantity * scalingFactor,
    unit: ing.ingredient.unit,
    originalQuantity: ing.quantity,
  }));

  return {
    recipe,
    servings: targetServings,
    ingredients: calculatedIngredients,
    scalingFactor,
  };
}

// Helper to format quantities nicely
export function formatQuantity(quantity: number, unit: string): string {
  // Handle common unit conversions for better readability
  if (unit === 'g' && quantity >= 1000) {
    return `${(quantity / 1000).toFixed(2)}kg`;
  }
  if (unit === 'ml' && quantity >= 1000) {
    return `${(quantity / 1000).toFixed(2)}L`;
  }
  
  // For small quantities, show more decimal places
  if (quantity < 1) {
    return `${quantity.toFixed(2)}${unit}`;
  }
  
  // For whole numbers, don't show decimals
  if (Number.isInteger(quantity)) {
    return `${quantity}${unit}`;
  }
  
  // Default to 1 decimal place
  return `${quantity.toFixed(1)}${unit}`;
} 