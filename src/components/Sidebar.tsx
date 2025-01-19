import React from "react";
import { LayoutDashboard, Calculator, ShoppingCart } from "lucide-react";

type TabType = "orders" | "ingredients" | "calculator";

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const tabs = [
    {
      id: "orders",
      label: "Orders",
      icon: LayoutDashboard,
    },
    {
      id: "ingredients",
      label: "Ingredients",
      icon: ShoppingCart,
    },
    {
      id: "calculator",
      label: "Recipe Calculator",
      icon: Calculator,
    },
  ];

  return (
    <div className="h-full w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Paella Catering</h1>
      </div>
      <nav className="space-y-1 px-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as TabType)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === tab.id
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
