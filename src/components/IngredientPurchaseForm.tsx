import React from "react";
import { IngredientPurchase } from "../types/order";
import { useIngredients, useCreateIngredient } from "../lib/api";
import { PlusCircle } from "lucide-react";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";

interface IngredientPurchaseFormProps {
  orderId?: string;
  onSubmit: (purchase: Omit<IngredientPurchase, "id">) => void;
  onCancel: () => void;
}

export function IngredientPurchaseForm({
  orderId,
  onSubmit,
  onCancel,
}: IngredientPurchaseFormProps) {
  const { data: ingredients = [] } = useIngredients();
  const createIngredient = useCreateIngredient();
  const [showNewIngredient, setShowNewIngredient] = React.useState(false);
  const [newIngredient, setNewIngredient] = React.useState({
    name: "",
    unit: "",
  });
  const [formData, setFormData] = React.useState<
    Omit<IngredientPurchase, "id">
  >({
    ingredientId: "",
    orderId,
    quantity: 0,
    price: 0,
    unit_price: 0,
    isUnitPrice: true,
    supplier: "",
    purchaseDate: new Date().toISOString().split("T")[0],
  });

  const totalPrice = formData.isUnitPrice
    ? formData.price * formData.quantity
    : formData.price;

  const unitPrice = formData.isUnitPrice
    ? formData.price
    : formData.quantity > 0
    ? formData.price / formData.quantity
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: totalPrice, // Save total price
      unit_price: unitPrice, // Save unit price
    });
  };

  const handleCreateIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createIngredient.mutateAsync(newIngredient);
      setShowNewIngredient(false);
      setNewIngredient({ name: "", unit: "" });
    } catch (error) {
      console.error("Error creating ingredient:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {showNewIngredient ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              New Ingredient
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Name"
                  type="text"
                  required
                  value={newIngredient.name}
                  onChange={(e) =>
                    setNewIngredient({ ...newIngredient, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Input
                  label="Unit"
                  type="text"
                  required
                  placeholder="kg, liters, units..."
                  value={newIngredient.unit}
                  onChange={(e) =>
                    setNewIngredient({ ...newIngredient, unit: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowNewIngredient(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateIngredient}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Ingredient
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium text-gray-700">Ingredient</h4>
              <button
                type="button"
                onClick={() => setShowNewIngredient(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="w-4 h-4 mr-1.5" />
                New Ingredient
              </button>
            </div>
            <Select
              required
              label="Select an ingredient"
              value={formData.ingredientId}
              onChange={(e) =>
                setFormData({ ...formData, ingredientId: e.target.value })
              }
            >
              <option value="">Select an ingredient</option>
              {ingredients.map((ingredient) => (
                <option key={ingredient.id} value={ingredient.id}>
                  {ingredient.name} ({ingredient.unit})
                </option>
              ))}
            </Select>
          </div>
        )}

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Pricing</h4>
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    isUnitPrice: !prev.isUnitPrice,
                    price: prev.isUnitPrice ? totalPrice : unitPrice,
                  }))
                }
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Switch to {formData.isUnitPrice ? "total" : "unit"} price
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Quantity"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.quantity}
                  onChange={(e) => {
                    const newQuantity = Number(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      quantity: newQuantity,
                      price: prev.isUnitPrice
                        ? prev.price
                        : newQuantity > 0
                        ? prev.price
                        : 0,
                    }));
                  }}
                />
              </div>
              <div>
                <Input
                  label={formData.isUnitPrice ? "Unit Price" : "Total Price"}
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  isCurrency
                  value={formData.price}
                  onChange={(e) => {
                    const newPrice = Number(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      price: newPrice,
                    }));
                  }}
                />
                {formData.quantity > 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.isUnitPrice
                      ? `Total: €${totalPrice.toFixed(2)}`
                      : `Per unit: €${unitPrice.toFixed(2)}`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <Input
            label="Supplier"
            type="text"
            required
            value={formData.supplier}
            onChange={(e) =>
              setFormData({ ...formData, supplier: e.target.value })
            }
          />
        </div>

        <div>
          <Input
            label="Purchase Date"
            type="date"
            required
            value={formData.purchaseDate}
            onChange={(e) =>
              setFormData({ ...formData, purchaseDate: e.target.value })
            }
          />
        </div>

        <div>
          <textarea
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            aria-label="Notes"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Add Purchase
        </button>
      </div>
    </form>
  );
}
