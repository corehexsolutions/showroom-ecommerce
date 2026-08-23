import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Truck,
  XCircle,
  Loader2,
  CreditCard,
} from "lucide-react";

import { getMyOrder, type Order } from "@/lib/orders";

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
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const trackingSteps = [
  {
    status: "pending",
    title: "Order Placed",
    description: "Your order has been placed successfully.",
    icon: Package,
  },
  {
    status: "confirmed",
    title: "Order Confirmed",
    description: "Your order has been confirmed.",
    icon: CheckCircle2,
  },
  {
    status: "processing",
    title: "Processing",
    description: "Your order is being prepared.",
    icon: Clock3,
  },
  {
    status: "shipped",
    title: "Shipped",
    description: "Your order is on its way.",
    icon: Truck,
  },
  {
    status: "delivered",
    title: "Delivered",
    description: "Your order has been delivered.",
    icon: Check,
  },
];

const statusOrder = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

function getTrackingIndex(status: Order["orderStatus"]) {
  return statusOrder.indexOf(status);
}

export default function OrderDetailsPage() {
  const { orderId } = useParams({
    from: "/orders/$orderId",
  });

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);

        const data = await getMyOrder(orderId);

        setOrder(data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Unable to load this order."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-[#6b8068]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <XCircle className="w-10 h-10 mx-auto text-red-500" />

          <h2 className="mt-4 text-xl font-semibold">
            Order not found
          </h2>

          <p className="mt-2 text-gray-500">
            {error || "We couldn't find this order."}
          </p>

          <Link
            to="/orders"
            className="inline-flex mt-6 px-5 py-2.5 rounded-xl bg-[#60745e] text-white"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = getTrackingIndex(order.orderStatus);

  return (
    <main className="min-h-screen bg-[#fafaf8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="mb-7">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500">
                Order #{order.orderNumber}
              </p>

              <h1 className="text-3xl font-semibold text-gray-900 mt-1">
                Order Details
              </h1>
            </div>

            <p className="text-sm text-gray-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Cancelled */}
        {order.orderStatus === "cancelled" && (
          <div className="mb-6 p-5 rounded-2xl bg-red-50 border border-red-100 flex gap-3">
            <XCircle className="w-5 h-5 text-red-500 shrink-0" />

            <div>
              <h3 className="font-semibold text-red-800">
                Order Cancelled
              </h3>

              <p className="text-sm text-red-700 mt-1">
                This order has been cancelled.
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* Left */}
          <div className="space-y-6">
            {/* Tracking */}
            <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-full bg-[#e9eee7] flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[#60745e]" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Track Order
                  </h2>

                  <p className="text-sm text-gray-500">
                    Current status:{" "}
                    <span className="font-medium capitalize">
                      {order.orderStatus.replaceAll("_", " ")}
                    </span>
                  </p>
                </div>
              </div>

              <div className="relative">
                {trackingSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const completed =
                    currentIndex >= index;

                  return (
                    <div
                      key={step.status}
                      className="relative flex gap-4 pb-7 last:pb-0"
                    >
                      {/* Line */}
                      {index < trackingSteps.length - 1 && (
                        <div
                          className={`absolute left-[17px] top-9 w-0.5 h-[calc(100%-20px)] ${
                            currentIndex > index
                              ? "bg-[#60745e]"
                              : "bg-gray-200"
                          }`}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          completed
                            ? "bg-[#60745e] text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <StepIcon className="w-4 h-4" />
                      </div>

                      <div className="pt-1">
                        <h3
                          className={`font-medium ${
                            completed
                              ? "text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          {step.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {step.description}
                        </p>

                        {step.status === "pending" && (
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDateTime(order.createdAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Items */}
            <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-5 sm:px-7 py-5 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">
                  Items in this order
                </h2>
              </div>

              <div className="p-5 sm:p-7 space-y-5">
                {order.items.map((item, index) => {
                  const image =
                    item.product?.images?.[0]?.url;

                  return (
                    <div
                      key={`${item.name}-${index}`}
                      className="flex gap-4"
                    >
                      <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                        {image ? (
                          <img
                            src={image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-7 h-7 text-gray-300" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {item.name}
                        </h3>

                        {item.variant && (
                          <p className="text-sm text-gray-500 mt-1">
                            Variant: {item.variant}
                          </p>
                        )}

                        <p className="text-sm text-gray-500 mt-2">
                          Quantity: {item.quantity}
                        </p>

                        <p className="font-semibold text-gray-900 mt-2">
                          {formatPrice(
                            item.price * item.quantity
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Shipping Address */}
            <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">
              <div className="flex items-center gap-3 mb-5">
                <MapPin className="w-5 h-5 text-[#60745e]" />

                <h2 className="font-semibold text-gray-900">
                  Delivery Address
                </h2>
              </div>

              <div className="text-sm text-gray-600 leading-6">
                <p className="font-medium text-gray-900">
                  {order.shippingAddress.name}
                </p>

                <p>{order.shippingAddress.addressLine1}</p>

                {order.shippingAddress.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}

                <p>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.postalCode}
                </p>

                <p className="mt-2">
                  Phone: {order.shippingAddress.phone}
                </p>

                {order.shippingAddress.email && (
                  <p>
                    Email: {order.shippingAddress.email}
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Summary */}
            <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
              <h2 className="font-semibold text-gray-900 mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="text-gray-900">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span className="text-gray-900">
                    {order.shipping === 0
                      ? "Free"
                      : formatPrice(order.shipping)}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-between">
                  <span className="font-semibold text-gray-900">
                    Total
                  </span>

                  <span className="text-xl font-semibold text-gray-900">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <CreditCard className="w-5 h-5 text-[#60745e]" />

                <h2 className="font-semibold text-gray-900">
                  Payment
                </h2>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Method
                  </span>

                  <span className="font-medium capitalize">
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Status
                  </span>

                  <span
                    className={`font-medium capitalize ${
                      order.paymentStatus === "paid"
                        ? "text-green-600"
                        : order.paymentStatus === "failed"
                          ? "text-red-600"
                          : "text-amber-600"
                    }`}
                  >
                    {order.paymentStatus.replaceAll(
                      "_",
                      " "
                    )}
                  </span>
                </div>

                {order.razorpayPaymentId && (
                  <div className="pt-2">
                    <p className="text-gray-500">
                      Payment ID
                    </p>

                    <p className="font-mono text-xs text-gray-700 mt-1 break-all">
                      {order.razorpayPaymentId}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Order info */}
            <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
              <h2 className="font-semibold text-gray-900 mb-4">
                Order Information
              </h2>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">
                    Order Number
                  </p>

                  <p className="font-medium mt-1">
                    #{order.orderNumber}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Order Date
                  </p>

                  <p className="font-medium mt-1">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                {order.razorpayOrderId && (
                  <div>
                    <p className="text-gray-500">
                      Razorpay Order ID
                    </p>

                    <p className="font-mono text-xs mt-1 break-all">
                      {order.razorpayOrderId}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}