import React from "react";
import {
  LayoutDashboard,
  Calculator,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";

type TabType = "orders" | "ingredients" | "calculator";

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-40 
        transform lg:transform-none transition-transform duration-200 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
        h-full w-64 bg-white border-r border-gray-200
      `}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">Paella Catering</h1>
        </div>
        <nav className="space-y-1 px-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id as TabType);
                  setIsMobileMenuOpen(false);
                }}
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

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
