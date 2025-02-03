import React from "react";
import { PaellaOrder, PaellaItem } from "../types/order";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  calculateAllIngredients,
  formatAmount,
} from "../lib/proportions/calculator";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";

interface OrderFormProps {
  initialData?: PaellaOrder;
  onSubmit: (order: Omit<PaellaOrder, "id">) => void;
  onCancel: () => void;
}

export function OrderForm({ initialData, onSubmit, onCancel }: OrderFormProps) {
  const [formData, setFormData] = React.useState({
    customerName: initialData?.customerName || "",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    items: initialData?.items || [
      {
        id: crypto.randomUUID(),
        type: "Valenciana" as PaellaItem["type"],
        servings: 10,
      },
    ],
    price: initialData?.price || 0,
    costs: initialData?.costs || {
      ingredients: 0,
      labor: 0,
      transport: 0,
      other: 0,
    },
    notes: initialData?.notes || "",
    status: initialData?.status || ("pending" as PaellaOrder["status"]),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addPaella = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: crypto.randomUUID(),
          type: "Valenciana",
          servings: 10,
        },
      ],
    }));
  };

  const removePaella = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updatePaella = (
    index: number,
    field: keyof PaellaItem,
    value: PaellaItem[keyof PaellaItem]
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const currentIngredients = formData.items.map((item) => {
    const ingredients = calculateAllIngredients(item.type, item.servings);
    return { type: item.type, ingredients };
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Customer Name"
            type="text"
            required
            value={formData.customerName}
            onChange={(e) =>
              setFormData({ ...formData, customerName: e.target.value })
            }
          />
        </div>
        <div>
          <Input
            label="Date"
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Paellas</h3>
          <button
            type="button"
            onClick={addPaella}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Add Paella
          </button>
        </div>
        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-4 relative">
                <div className="absolute top-4 right-4">
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePaella(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Select
                      label="Type"
                      value={item.type}
                      onChange={(e) =>
                        updatePaella(
                          index,
                          "type",
                          e.target.value as PaellaItem["type"]
                        )
                      }
                    >
                      <option value="Valenciana">Valenciana</option>
                      <option value="Seafood">Seafood</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Mixed">Mixed</option>
                    </Select>
                  </div>
                  <div>
                    <Input
                      label="Servings"
                      type="number"
                      min="1"
                      required
                      value={item.servings}
                      onChange={(e) =>
                        updatePaella(index, "servings", Number(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Required Ingredients
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(currentIngredients[index].ingredients).map(
                      ([ingredient, proportion]) => (
                        <div key={ingredient} className="flex justify-between">
                          <span className="capitalize">{ingredient}:</span>
                          <span className="font-medium">
                            {formatAmount(proportion)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Costs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(formData.costs).map(([key, value]) => {
            return (
              <div key={key}>
                <Input
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  isCurrency
                  value={value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      costs: {
                        ...formData.costs,
                        [key]: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <Input
          label="Total Price"
          type="number"
          min="0"
          step="0.01"
          required
          isCurrency
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: Number(e.target.value) })
          }
        />
      </div>

      <div>
        <textarea
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          aria-label="Notes"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {initialData ? "Update Order" : "Create Order"}
        </button>
      </div>
    </form>
  );
}
