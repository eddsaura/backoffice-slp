import { useState, useEffect } from "react";
import { Recipe, RecipeIngredient, Ingredient } from "../types/order";
import { Input, TextArea } from "./ui/Input";
import { Button } from "./ui/Button";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Select } from "./ui/Select";
import { supabase } from "../lib/supabase";

export function CustomRecipeBuilder() {
  const [recipe, setRecipe] = useState<Partial<Recipe>>({
    name: "",
    baseServings: 1,
    ingredients: [],
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");

  useEffect(() => {
    async function loadIngredients() {
      const { data, error } = await supabase
        .from("ingredients")
        .select("id, name, unit");

      if (error) {
        console.error("Error loading ingredients:", error);
        return;
      }

      setIngredients(data);
    }

    loadIngredients();
  }, []);

  const addIngredient = () => {
    if (!selectedIngredient || !quantity || Number(quantity) <= 0) return;

    const ingredient = ingredients.find((i) => i.id === selectedIngredient);
    if (!ingredient) return;

    const newIngredient: RecipeIngredient = {
      id: crypto.randomUUID(),
      recipeId: "",
      ingredientId: selectedIngredient,
      ingredient,
      quantity: Number(quantity),
      createdAt: new Date().toISOString(),
    };

    setRecipe({
      ...recipe,
      ingredients: [...(recipe.ingredients || []), newIngredient],
    });

    setSelectedIngredient("");
    setQuantity("");
  };

  const removeIngredient = (id: string) => {
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients?.filter((i) => i.id !== id) || [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipe.name || !recipe.baseServings || !recipe.ingredients?.length) {
      return;
    }

    try {
      // Insert recipe
      const { data: recipeData, error: recipeError } = await supabase
        .from("recipes")
        .insert({
          name: recipe.name,
          description: recipe.description,
          cooking_time_minutes: recipe.cookingTimeMinutes,
          base_servings: recipe.baseServings,
        })
        .select()
        .single();

      if (recipeError) throw recipeError;

      // Insert recipe ingredients
      const { error: ingredientsError } = await supabase
        .from("recipe_ingredients")
        .insert(
          recipe.ingredients.map((ing) => ({
            recipe_id: recipeData.id,
            ingredient_id: ing.ingredientId,
            quantity: ing.quantity,
          }))
        );

      if (ingredientsError) throw ingredientsError;

      // Reset form
      setRecipe({
        name: "",
        baseServings: 1,
        ingredients: [],
      });
      setSelectedIngredient("");
      setQuantity("");

      alert("Recipe saved successfully!");
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert("Error saving recipe. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Create New Recipe
          </h2>

          {/* Basic Recipe Info */}
          <div className="space-y-4">
            <Input
              label="Recipe Name"
              value={recipe.name}
              onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
              required
            />

            <TextArea
              label="Description"
              value={recipe.description || ""}
              onChange={(e) =>
                setRecipe({ ...recipe, description: e.target.value })
              }
              rows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Base Servings"
                type="number"
                min="1"
                value={recipe.baseServings}
                onChange={(e) =>
                  setRecipe({ ...recipe, baseServings: Number(e.target.value) })
                }
                required
              />

              <Input
                label="Cooking Time (minutes)"
                type="number"
                min="1"
                value={recipe.cookingTimeMinutes || ""}
                onChange={(e) =>
                  setRecipe({
                    ...recipe,
                    cookingTimeMinutes: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Ingredients
          </h3>

          <div className="space-y-4">
            {/* Add Ingredient Form */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Select
                  label="Ingredient"
                  value={selectedIngredient}
                  onChange={(e) => setSelectedIngredient(e.target.value)}
                >
                  <option value="">Select ingredient...</option>
                  {ingredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="w-32">
                <Input
                  label="Quantity"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <Button
                type="button"
                onClick={addIngredient}
                className="mb-0.5"
                variant="secondary"
              >
                <PlusIcon className="h-5 w-5" />
              </Button>
            </div>

            {/* Ingredients List */}
            <div className="space-y-2">
              {recipe.ingredients?.map((ing) => (
                <div
                  key={ing.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <span className="font-medium">{ing.ingredient.name}</span>
                    <span className="text-gray-500 ml-2">
                      {ing.quantity} {ing.ingredient.unit}
                    </span>
                  </div>
                  <Button
                    type="button"
                    onClick={() => removeIngredient(ing.id)}
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Save Recipe
        </Button>
      </form>
    </div>
  );
}
