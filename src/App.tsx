import React from "react";
import { PaellaOrder, OrderSummary } from "./types/order";
import { OrderList } from "./components/OrderList";
import { Summary } from "./components/Summary";
import { OrderForm } from "./components/OrderForm";
import { PlusCircle, X, Package } from "lucide-react";
import {
  useOrders,
  useCreateOrder,
  useUpdateOrder,
  useCreateIngredientPurchase,
  useIngredientPurchases,
} from "./lib/api";
import { IngredientPurchaseForm } from "./components/IngredientPurchaseForm";
import { IngredientPurchaseList } from "./components/IngredientPurchaseList";
import { Sidebar } from "./components/Sidebar";
import { RecipeCalculator } from "./components/RecipeCalculator";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function AppContent() {
  const { data: orders = [], isLoading } = useOrders();
  const { data: purchases = [], isLoading: purchasesLoading } =
    useIngredientPurchases();
  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();
  const createIngredientPurchase = useCreateIngredientPurchase();
  const [showNewOrderForm, setShowNewOrderForm] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<PaellaOrder | null>(
    null
  );
  const [editingOrder, setEditingOrder] = React.useState<PaellaOrder | null>(
    null
  );
  const [showIngredientPurchaseForm, setShowIngredientPurchaseForm] =
    React.useState(false);
  const [activeTab, setActiveTab] = React.useState<
    "orders" | "ingredients" | "calculator"
  >("orders");

  const handleModalOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowNewOrderForm(false);
      setSelectedOrder(null);
      setEditingOrder(null);
    }
  };

  const summary: OrderSummary = React.useMemo(() => {
    if (orders.length === 0) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        totalCosts: 0,
        totalProfit: 0,
        averageProfit: 0,
      };
    }

    const totalRevenue = orders.reduce((sum, order) => sum + order.price, 0);
    const totalCosts = orders.reduce(
      (sum, order) =>
        sum + Object.values(order.costs).reduce((a, b) => a + b, 0),
      0
    );

    return {
      totalOrders: orders.length,
      totalRevenue,
      totalCosts,
      totalProfit: totalRevenue - totalCosts,
      averageProfit: (totalRevenue - totalCosts) / orders.length,
    };
  }, [orders]);

  const handleCreateOrder = (orderData: Omit<PaellaOrder, "id">) => {
    createOrder.mutate(orderData, {
      onSuccess: () => setShowNewOrderForm(false),
      onError: (error) => console.error("Error creating order:", error),
    });
  };

  const handleUpdateOrder = (orderData: Omit<PaellaOrder, "id">) => {
    if (!editingOrder) return;

    updateOrder.mutate(
      { id: editingOrder.id, orderData },
      {
        onSuccess: () => setEditingOrder(null),
        onError: (error) => console.error("Error updating order:", error),
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 lg:pt-8">
            <div className="flex flex-col sm:flex-row sm:justify-end mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setShowIngredientPurchaseForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Package className="w-5 h-5 mr-2" />
                <span className="whitespace-nowrap">
                  Add Ingredient Purchase
                </span>
              </button>
              <button
                onClick={() => setShowNewOrderForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                <span className="whitespace-nowrap">Create New Order</span>
              </button>
            </div>

            {activeTab !== "calculator" && <Summary summary={summary} />}

            {activeTab === "orders" ? (
              isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <OrderList orders={orders} onSelectOrder={setSelectedOrder} />
              )
            ) : activeTab === "ingredients" ? (
              purchasesLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <IngredientPurchaseList purchases={purchases} />
              )
            ) : activeTab === "calculator" ? (
              <RecipeCalculator />
            ) : null}
          </div>
        </div>
      </div>

      {/* New Order Modal */}
      {showNewOrderForm && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={handleModalOutsideClick}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Order
              </h2>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNewOrderForm(false);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <OrderForm
              onSubmit={handleCreateOrder}
              onCancel={() => setShowNewOrderForm(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={handleModalOutsideClick}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Order
              </h2>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingOrder(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <OrderForm
              initialData={editingOrder}
              onSubmit={handleUpdateOrder}
              onCancel={() => setEditingOrder(null)}
            />
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={handleModalOutsideClick}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Details
              </h2>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOrder(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedOrder.customerName}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(selectedOrder.date).toLocaleDateString()}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Servings
                  </p>
                  <p className="mt-1">
                    {selectedOrder.items.reduce(
                      (total, item) => total + item.servings,
                      0
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1 capitalize">{selectedOrder.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ingredient Purchase Modal */}
      {showIngredientPurchaseForm && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4"
          onClick={handleModalOutsideClick}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Add Ingredient Purchase
              </h2>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowIngredientPurchaseForm(false);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <IngredientPurchaseForm
              onSubmit={(purchaseData) => {
                createIngredientPurchase.mutate(purchaseData, {
                  onSuccess: () => setShowIngredientPurchaseForm(false),
                  onError: (error) =>
                    console.error("Error creating purchase:", error),
                });
              }}
              onCancel={() => setShowIngredientPurchaseForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <React.Suspense fallback={<div>Loading...</div>}>
        <AppContent />
      </React.Suspense>
    </QueryClientProvider>
  );
}
