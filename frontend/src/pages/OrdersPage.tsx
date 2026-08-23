import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Package,
  ChevronRight,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
  Loader2,
  ShoppingBag,
} from "lucide-react";

import { getMyOrders, type Order } from "@/lib/orders";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusInfo(status: Order["orderStatus"]) {
  switch (status) {
    case "confirmed":
      return {
        label: "Confirmed",
        icon: CheckCircle2,
        className: "text-blue-600 bg-blue-50",
      };

    case "processing":
      return {
        label: "Processing",
        icon: Clock3,
        className: "text-amber-600 bg-amber-50",
      };

    case "shipped":
      return {
        label: "Shipped",
        icon: Truck,
        className: "text-purple-600 bg-purple-50",
      };

    case "delivered":
      return {
        label: "Delivered",
        icon: CheckCircle2,
        className: "text-green-600 bg-green-50",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        icon: XCircle,
        className: "text-red-600 bg-red-50",
      };

    default:
      return {
        label: "Order Placed",
        icon: Clock3,
        className: "text-gray-600 bg-gray-100",
      };
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);

        const data = await getMyOrders();
        console.log(data)
        setOrders(data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-[#6b8068]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <XCircle className="w-10 h-10 mx-auto mb-4 text-red-500" />

          <h2 className="text-xl font-semibold">
            Unable to load orders
          </h2>

          <p className="mt-2 text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#e9eee7] flex items-center justify-center">
              <Package className="w-5 h-5 text-[#60745e]" />
            </div>

            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                My Orders
              </h1>

              <p className="text-gray-500 mt-1">
                View and track all your orders
              </p>
            </div>
          </div>
        </div>

        {/* Empty */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <ShoppingBag className="w-12 h-12 mx-auto text-gray-300" />

            <h2 className="mt-5 text-xl font-semibold text-gray-900">
              No orders yet
            </h2>

            <p className="mt-2 text-gray-500">
              Your orders will appear here after you make a purchase.
            </p>

            <Link
              to="/"
              className="inline-flex mt-6 px-6 py-3 rounded-xl bg-[#60745e] text-white font-medium hover:bg-[#526450] transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const status = getStatusInfo(order.orderStatus);
              const StatusIcon = status.icon;

              return (
                <div
                  key={order._id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                >
                  {/* Order header */}
                  <div className="px-5 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-sm text-gray-500">
                          Order number
                        </p>

                        <p className="font-semibold text-gray-900">
                          #{order.orderNumber}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-sm text-gray-500">
                          Ordered on
                        </p>

                        <p className="font-medium text-gray-800">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="p-5 sm:p-6">
                    <div className="space-y-4">
                      {order.items.slice(0, 3).map((item, index) => {
                        const image =
                          item.product?.images?.[0]?.url;

                        return (
                          <div
                            key={`${order._id}-${index}`}
                            className="flex gap-4"
                          >
                            <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                              {image ? (
                                <img
                                  src={image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-300" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 truncate">
                                {item.name}
                              </h3>

                              {item.variant && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {item.variant}
                                </p>
                              )}

                              <p className="text-sm text-gray-500 mt-1">
                                Qty: {item.quantity}
                              </p>
                            </div>

                            <p className="font-medium text-gray-900">
                              {formatPrice(
                                item.price * item.quantity
                              )}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {order.items.length > 3 && (
                      <p className="text-sm text-gray-500 mt-4">
                        + {order.items.length - 3} more item
                        {order.items.length - 3 > 1 ? "s" : ""}
                      </p>
                    )}

                    {/* Bottom */}
                    <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${status.className}`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {status.label}
                        </div>

                        <span className="text-sm text-gray-500">
                          {order.items.length}{" "}
                          {order.items.length === 1
                            ? "item"
                            : "items"}
                        </span>
                      </div>

                      <div className="flex items-center gap-5">
                        <div>
                          <p className="text-xs text-gray-500">
                            Total
                          </p>

                          <p className="text-lg font-semibold text-gray-900">
                            {formatPrice(order.total)}
                          </p>
                        </div>

                        <Link
                          to="/orders/$orderId"
                          params={{
                            orderId: order._id,
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
                        >
                          View Order
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}