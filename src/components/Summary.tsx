import React from 'react';
import { OrderSummary } from '../types/order';
import { DollarSign, ShoppingCart, TrendingUp, Wallet } from 'lucide-react';

interface SummaryProps {
  summary: OrderSummary;
}

export function Summary({ summary }: SummaryProps) {
  const stats = [
    {
      title: 'Total Orders',
      value: summary.totalOrders,
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Revenue',
      value: `€${summary.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total Costs',
      value: `€${summary.totalCosts.toFixed(2)}`,
      icon: Wallet,
      color: 'bg-red-500',
    },
    {
      title: 'Total Profit',
      value: `€${summary.totalProfit.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-lg shadow p-4 flex items-center space-x-4"
        >
          <div className={`${stat.color} p-3 rounded-lg`}>
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}