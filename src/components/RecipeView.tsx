import React from "react";
import { Recipe } from "../types/order";
import { PlusCircle, X } from "lucide-react";
import { RecipeList } from "./RecipeList";
import { CustomRecipeBuilder } from "./CustomRecipeBuilder";

interface RecipeViewProps {
  recipes: Recipe[];
  isLoading?: boolean;
}

export function RecipeView({ recipes = [], isLoading }: RecipeViewProps) {
  const [showRecipeBuilder, setShowRecipeBuilder] = React.useState(false);
  const [editingRecipe, setEditingRecipe] = React.useState<Recipe | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  const handleCloseBuilder = () => {
    setShowRecipeBuilder(false);
    setEditingRecipe(null);
  };

  return (
    <div className="space-y-6">
      {(showRecipeBuilder || editingRecipe) && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {editingRecipe ? "Edit Recipe" : "Create New Recipe"}
            </h2>
            <button
              onClick={handleCloseBuilder}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">
            <CustomRecipeBuilder
              initialRecipe={editingRecipe}
              onSuccess={handleCloseBuilder}
            />
          </div>
        </div>
      )}
      <div className="flex justify-end mb-6">
        {!showRecipeBuilder && !editingRecipe && (
          <button
            onClick={() => setShowRecipeBuilder(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create New Recipe
          </button>
        )}
      </div>
      <RecipeList recipes={recipes} onEditRecipe={setEditingRecipe} />
    </div>
  );
}
