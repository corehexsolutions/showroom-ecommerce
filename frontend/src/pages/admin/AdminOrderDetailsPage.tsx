import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  Save,
  Truck,
  User,
  XCircle,
} from "lucide-react";

import {
  getAdminOrder,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,
  type AdminOrder,
} from "@/lib/adminApi";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams({
    from: "/admin/orders/$orderId",
  });

  const [order, setOrder] = useState<AdminOrder | null>(null);

  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);

  const [status, setStatus] =
    useState<AdminOrder["orderStatus"]>("pending");

  const [paymentStatus, setPaymentStatus] =
    useState<AdminOrder["paymentStatus"]>("pending");

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await getAdminOrder(orderId);

        setOrder(data);
        setStatus(data.orderStatus);
        setPaymentStatus(data.paymentStatus);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load order"
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  async function saveStatus() {
    if (!order) return;

    try {
      setSavingStatus(true);

      const updated = await updateAdminOrderStatus(
        order._id,
        status
      );

      setOrder({
        ...order,
        ...updated,
      });
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update status"
      );
    } finally {
      setSavingStatus(false);
    }
  }

  async function savePaymentStatus() {
    if (!order) return;

    try {
      setSavingPayment(true);

      const updated =
        await updateAdminPaymentStatus(
          order._id,
          paymentStatus
        );

      setOrder({
        ...order,
        ...updated,
      });
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update payment"
      );
    } finally {
      setSavingPayment(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F1EA]">
        <Loader2
          size={28}
          className="animate-spin text-[#60745e]"
        />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F1EA]">
        <div className="text-center">
          <XCircle
            size={40}
            className="mx-auto text-red-500"
          />

          <h2 className="mt-4 text-xl font-medium">
            Order not found
          </h2>

          <p className="mt-2 text-sm text-black/50">
            {error}
          </p>

          <Link
            to="/admin/orders"
            className="inline-flex mt-5 rounded-full bg-[#20251F] px-5 py-2.5 text-sm text-white"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F1EA]">
      <div className="mx-auto max-w-[1400px] px-5 py-7 sm:px-8 lg:px-10">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="mt-6 mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-black/40">
              Order Management
            </div>

            <h1 className="mt-2 text-3xl font-medium">
              #{order.orderNumber}
            </h1>

            <p className="mt-2 text-sm text-black/45">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="text-sm">
            <span className="text-black/40">
              Order ID:
            </span>{" "}
            <span className="font-mono">
              {order._id}
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left */}
          <div className="space-y-6">
            {/* Products */}
            <section className="rounded-3xl border border-black/10 bg-white">
              <div className="border-b border-black/10 px-6 py-5">
                <h2 className="font-medium">
                  Ordered Products
                </h2>
              </div>

              <div className="divide-y divide-black/5">
                {order.items.map((item, index) => {
                  const image =
                  
                    item.product?.images?.[0]?.url;

                  return (
                    <div
                      key={`${item.name}-${index}`}
                      className="flex gap-4 px-6 py-5"
                    >
                      <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F6F1EA]">
                        {image ? (
                          <img
                            src={image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package
                              size={22}
                              className="text-black/20"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-sm font-medium">
                          {item.name}
                        </h3>

                        {item.variant && (
                          <p className="mt-1 text-xs text-black/40">
                            Variant: {item.variant}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-black/40">
                          ₹
                          {Number(
                            item.price
                          ).toLocaleString("en-IN")}{" "}
                          × {item.quantity}
                        </p>
                      </div>

                      <div className="text-sm font-medium">
                        {formatPrice(
                          item.price * item.quantity
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Customer */}
            <section className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <User
                  size={19}
                  className="text-[#60745e]"
                />

                <h2 className="font-medium">
                  Customer
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Info
                  label="Name"
                  value={
                    order.shippingAddress.name ||
                    order.user?.name ||
                    "-"
                  }
                />

                <Info
                  label="Email"
                  value={
                    order.shippingAddress.email ||
                    order.user?.email ||
                    "-"
                  }
                />

                <Info
                  label="Phone"
                  value={
                    order.shippingAddress.phone || "-"
                  }
                />

                <Info
                  label="Payment Method"
                  value={order.paymentMethod.toUpperCase()}
                />
              </div>
            </section>

            {/* Address */}
            <section className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <MapPin
                  size={19}
                  className="text-[#60745e]"
                />

                <h2 className="font-medium">
                  Shipping Address
                </h2>
              </div>

              <div className="text-sm leading-6 text-black/60">
                <p className="font-medium text-black">
                  {order.shippingAddress.name}
                </p>

                <p>
                  {order.shippingAddress.addressLine1}
                </p>

                {order.shippingAddress.addressLine2 && (
                  <p>
                    {order.shippingAddress.addressLine2}
                  </p>
                )}

                <p>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.postalCode}
                </p>

                <p>
                  {order.shippingAddress.country}
                </p>
              </div>
            </section>

            {/* Razorpay */}
            {(order.razorpayOrderId ||
              order.razorpayPaymentId) && (
              <section className="rounded-3xl border border-black/10 bg-white p-6">
                <div className="mb-5 flex items-center gap-3">
                  <CreditCard
                    size={19}
                    className="text-[#60745e]"
                  />

                  <h2 className="font-medium">
                    Razorpay Information
                  </h2>
                </div>

                <div className="space-y-4">
                  {order.razorpayOrderId && (
                    <Info
                      label="Razorpay Order ID"
                      value={order.razorpayOrderId}
                      mono
                    />
                  )}

                  {order.razorpayPaymentId && (
                    <Info
                      label="Razorpay Payment ID"
                      value={order.razorpayPaymentId}
                      mono
                    />
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Update order */}
            <section className="rounded-3xl border border-black/10 bg-white p-6">
              <h2 className="font-medium">
                Order Status
              </h2>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as AdminOrder["orderStatus"]
                  )
                }
                className="mt-4 h-12 w-full rounded-xl border border-black/10 bg-[#F8F7F4] px-4 text-sm outline-none focus:border-[#9CAF88]"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">
                  Processing
                </option>
                <option value="shipped">Shipped</option>
                <option value="delivered">
                  Delivered
                </option>
                <option value="cancelled">
                  Cancelled
                </option>
              </select>

              <button
                onClick={saveStatus}
                disabled={savingStatus}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#20251F] py-3 text-sm font-medium text-white disabled:opacity-50"
              >
                {savingStatus ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={16} />
                )}

                Update Order Status
              </button>
            </section>

            {/* Payment */}
            <section className="rounded-3xl border border-black/10 bg-white p-6">
              <h2 className="font-medium">
                Payment Status
              </h2>

              <select
                value={paymentStatus}
                onChange={(e) =>
                  setPaymentStatus(
                    e.target.value as AdminOrder["paymentStatus"]
                  )
                }
                className="mt-4 h-12 w-full rounded-xl border border-black/10 bg-[#F8F7F4] px-4 text-sm outline-none"
              >
                <option value="pending">
                  Pending
                </option>
                <option value="paid">Paid</option>
                <option value="failed">
                  Failed
                </option>
                <option value="refunded">
                  Refunded
                </option>
                <option value="partially_refunded">
                  Partially Refunded
                </option>
              </select>

              <button
                onClick={savePaymentStatus}
                disabled={savingPayment}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 py-3 text-sm font-medium hover:bg-black/5 disabled:opacity-50"
              >
                {savingPayment ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={16} />
                )}

                Update Payment Status
              </button>
            </section>

            {/* Summary */}
            <section className="rounded-3xl border border-black/10 bg-white p-6">
              <h2 className="font-medium">
                Order Summary
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-black/45">
                    Subtotal
                  </span>

                  <span>
                    {formatPrice(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-black/45">
                    Shipping
                  </span>

                  <span>
                    {order.shipping === 0
                      ? "Free"
                      : formatPrice(order.shipping)}
                  </span>
                </div>

                <div className="border-t border-black/10 pt-4">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      Total
                    </span>

                    <span className="text-xl font-semibold">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function Info({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-black/40">
        {label}
      </p>

      <p
        className={`mt-1 text-sm ${
          mono ? "font-mono break-all" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}