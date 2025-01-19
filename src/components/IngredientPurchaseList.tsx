import React from 'react';
import { IngredientPurchase } from '../types/order';
import { ChevronRight, Package } from 'lucide-react';

interface IngredientPurchaseListProps {
  purchases: (IngredientPurchase & { ingredient: { name: string; unit: string } })[];
}

export function IngredientPurchaseList({ purchases }: IngredientPurchaseListProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Ingredient Purchases</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Package className="w-5 h-5 text-gray-400" />
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {purchase.ingredient.name}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(purchase.purchaseDate).toLocaleDateString()} · {purchase.supplier}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  €{purchase.unit_price.toFixed(2)}/unit
                </p>
                <p className="text-sm text-gray-500">
                  Total: €{purchase.price.toFixed(2)} · {purchase.quantity} {purchase.ingredient.unit}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        ))}
        {purchases.length === 0 && (
          <div className="px-4 py-6 text-center text-gray-500">
            No ingredient purchases found
          </div>
        )}
      </div>
    </div>
  );
}