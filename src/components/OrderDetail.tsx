import React from "react";
import { X } from "lucide-react";
import { PaellaOrder } from "../types/order";
import { OrderForm } from "./OrderForm";
import {
  calculateAllIngredients,
  formatAmount,
} from "../lib/proportions/calculator";
import { IngredientUnit } from "../lib/proportions/types";

interface OrderDetailProps {
  order: PaellaOrder;
  isEditing: boolean;
  onClose: () => void;
  onEdit: () => void;
  onUpdate: (orderData: Omit<PaellaOrder, "id">) => void;
}

export function OrderDetail({
  order,
  isEditing,
  onClose,
  onEdit,
  onUpdate,
}: OrderDetailProps) {
  const calculateOrderIngredients = React.useCallback((order: PaellaOrder) => {
    const allIngredients: Record<
      string,
      { amount: number; unit: IngredientUnit }
    > = {};

    order.items.forEach((item) => {
      const ingredients = calculateAllIngredients(item.type, item.servings);
      Object.entries(ingredients).forEach(([name, { amount, unit }]) => {
        if (allIngredients[name]) {
          allIngredients[name].amount += amount;
        } else {
          allIngredients[name] = { amount, unit };
        }
      });
    });

    return allIngredients;
  }, []);

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Edit Order</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <OrderForm initialData={order} onSubmit={onUpdate} onCancel={onClose} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto m-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Edit
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {order.customerName}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(order.date).toLocaleDateString()}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Servings</p>
            <p className="mt-1">
              {order.items.reduce((total, item) => total + item.servings, 0)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className="mt-1 capitalize">{order.status}</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Paellas</h4>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.type}</span>
                  <span>{item.servings} servings</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Required Ingredients
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(calculateOrderIngredients(order)).map(
                ([ingredient, { amount, unit }]) => (
                  <div key={ingredient} className="flex justify-between">
                    <span className="capitalize">{ingredient}:</span>
                    <span className="font-medium">
                      {formatAmount({ amount, unit })}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Costs & Price
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              {Object.entries(order.costs).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="capitalize">{key}:</span>
                  <span>€{value.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Total Price:</span>
                  <span>€{order.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Profit:</span>
                  <span>
                    €
                    {(
                      order.price -
                      Object.values(order.costs).reduce((a, b) => a + b, 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {order.notes && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
            <p className="text-sm text-gray-600">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
