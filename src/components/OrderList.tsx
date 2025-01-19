import React from 'react';
import { PaellaOrder } from '../types/order';
import { ChevronRight, Circle } from 'lucide-react';

interface OrderListProps {
  orders: PaellaOrder[];
  onSelectOrder: (order: PaellaOrder) => void;
}

const statusColors = {
  'pending': 'text-yellow-500',
  'in-progress': 'text-blue-500',
  'completed': 'text-green-500',
};

export function OrderList({ orders, onSelectOrder }: OrderListProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Paella Orders</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {orders.map((order) => (
          <button
            key={order.id}
            onClick={() => onSelectOrder(order)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Circle className={`w-4 h-4 ${statusColors[order.status]}`} />
              <div className="text-left">
                <p className="font-medium text-gray-900">{order.customerName}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString()} ·{' '}
                  {order.items.reduce((total, item) => total + item.servings, 0)} servings
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  €{order.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  Profit: €{(order.price - Object.values(order.costs).reduce((a, b) => a + b, 0)).toFixed(2)}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}