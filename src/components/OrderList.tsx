import { PaellaOrder } from "../types/order";
import { ChevronRight, Circle } from "lucide-react";
import { Select } from "./ui/Select";
import { useUpdateOrder } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface OrderListProps {
  orders: PaellaOrder[];
  onSelectOrder: (order: PaellaOrder) => void;
}

const statusColors = {
  pending: "text-yellow-500",
  "in-progress": "text-blue-500",
  completed: "text-green-500",
};

const statusBgColors = {
  pending: "bg-yellow-50 text-yellow-800",
  "in-progress": "bg-blue-50 text-blue-800",
  completed: "bg-green-50 text-green-800",
};

export function OrderList({ orders, onSelectOrder }: OrderListProps) {
  const updateOrder = useUpdateOrder();
  const queryClient = useQueryClient();

  const handleStatusChange = (
    order: PaellaOrder,
    newStatus: PaellaOrder["status"]
  ) => {
    // Get current orders from cache
    const previousOrders = queryClient.getQueryData<PaellaOrder[]>(["orders"]);

    // Optimistically update the UI
    queryClient.setQueryData<PaellaOrder[]>(["orders"], (old) =>
      old?.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
    );

    // Send update to server
    updateOrder.mutate(
      {
        id: order.id,
        orderData: { ...order, status: newStatus },
      },
      {
        onError: () => {
          // Revert to previous state on error
          if (previousOrders) {
            queryClient.setQueryData(["orders"], previousOrders);
          }
          toast.error("Failed to update order status");
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Paella Orders</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {orders.map((order) => (
          <div
            key={order.id}
            className="w-full px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
              <Circle className={`w-4 h-4 ${statusColors[order.status]}`} />
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {order.customerName}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString()} ·{" "}
                  {order.items.reduce(
                    (total, item) => total + item.servings,
                    0
                  )}{" "}
                  servings
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto sm:space-x-4">
              <div className="text-left sm:text-right">
                <p className="font-medium text-gray-900">
                  €{order.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  Profit: €
                  {(
                    order.price -
                    Object.values(order.costs).reduce((a, b) => a + b, 0)
                  ).toFixed(2)}
                </p>
              </div>
              <div className="w-32">
                <Select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(
                      order,
                      e.target.value as PaellaOrder["status"]
                    )
                  }
                  onClick={(e) => e.stopPropagation()}
                  className={statusBgColors[order.status]}
                >
                  <option value="pending" className={statusBgColors["pending"]}>
                    Pending
                  </option>
                  <option
                    value="in-progress"
                    className={statusBgColors["in-progress"]}
                  >
                    In Progress
                  </option>
                  <option
                    value="completed"
                    className={statusBgColors["completed"]}
                  >
                    Completed
                  </option>
                </Select>
              </div>
              <button onClick={() => onSelectOrder(order)}>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
