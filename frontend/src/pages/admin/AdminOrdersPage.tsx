import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronRight,
  Clock3,
  Loader2,
  Menu,
  Package,
  Search,
  ShoppingBag,
  Truck,
  CheckCircle2,
  XCircle,
  CreditCard,
  LogOut,
  LayoutDashboard,
  Users,
  Settings,
} from "lucide-react";

import {
  getAdminOrders,
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
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatus(status: AdminOrder["orderStatus"]) {
  switch (status) {
    case "confirmed":
      return {
        label: "Confirmed",
        icon: CheckCircle2,
        className: "bg-blue-50 text-blue-700",
      };

    case "processing":
      return {
        label: "Processing",
        icon: Clock3,
        className: "bg-amber-50 text-amber-700",
      };

    case "shipped":
      return {
        label: "Shipped",
        icon: Truck,
        className: "bg-purple-50 text-purple-700",
      };

    case "delivered":
      return {
        label: "Delivered",
        icon: CheckCircle2,
        className: "bg-green-50 text-green-700",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        icon: XCircle,
        className: "bg-red-50 text-red-700",
      };

    default:
      return {
        label: "Pending",
        icon: Clock3,
        className: "bg-gray-100 text-gray-700",
      };
  }
}

function AdminNavItem({
  icon,
  label,
  to,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${active
        ? "bg-white text-[#20251F]"
        : "text-white/55 hover:bg-white/5 hover:text-white"
        }`}
    >
      {icon}
      {label}
    </Link>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminOrders({
        search,
        orderStatus,
        paymentStatus,
      });

      setOrders(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, [orderStatus, paymentStatus]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return orders;

    return orders.filter((order) => {
      return (
        order.orderNumber
          .toLowerCase()
          .includes(query) ||
        order.shippingAddress.name
          ?.toLowerCase()
          .includes(query) ||
        order.shippingAddress.email
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [orders, search]);

  const stats = useMemo(() => {
    return {
      total: orders.length,

      pending: orders.filter(
        (order) => order.orderStatus === "pending"
      ).length,

      processing: orders.filter(
        (order) =>
          order.orderStatus === "processing"
      ).length,

      shipped: orders.filter(
        (order) => order.orderStatus === "shipped"
      ).length,

      delivered: orders.filter(
        (order) => order.orderStatus === "delivered"
      ).length,

      revenue: orders
        .filter(
          (order) =>
            order.paymentStatus === "paid"
        )
        .reduce(
          (sum, order) => sum + Number(order.total),
          0
        ),
    };
  }, [orders]);

  return (
    <div className="min-h-screen bg-[#F6F1EA] text-[#24241F]">
      <header className="flex items-center justify-between border-b border-black/10 bg-white px-5 py-4 lg:hidden">
        <div>
          <div className="text-lg font-semibold">
            Decorden.
          </div>

          <div className="text-[10px] uppercase tracking-[0.25em] text-black/40">
            Admin
          </div>
        </div>

        <button className="rounded-xl border border-black/10 p-2">
          <Menu size={20} />
        </button>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-[250px] border-r border-black/10
            bg-[#20251F] text-white transition-transform duration-300
            lg:static lg:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 px-7 py-7">
              <div className="text-xl font-semibold tracking-tight">
                Decorden<span className="text-[#9CAF88]">.</span>
              </div>

              <div className="mt-1 text-[9px] uppercase tracking-[0.3em] text-white/40">
                Administration
              </div>
            </div>

            <nav className="flex-1 space-y-1 px-4 py-6">
              <AdminNavItem
                icon={<LayoutDashboard size={18} />}
                label="Dashboard"
                to="/admin/dashboard"
              />

              <AdminNavItem
                icon={<Package size={18} />}
                label="Sofas"
                to="/admin/sofas"
              />

              <AdminNavItem
                icon={<ShoppingBag size={18} />}
                label="Orders"
                to="/admin/orders"
                active
              />

              <AdminNavItem
                icon={<Users size={18} />}
                label="Customers"
                to="/admin/customers"
              />

              <AdminNavItem
                icon={<Settings size={18} />}
                label="Settings"
                to="/admin/settings"
              />
            </nav>

            <div className="border-t border-white/10 p-4">
              <Link
                to="/"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                <ArrowLeft size={17} />
                Back to Store
              </Link>

              <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white">
                <LogOut size={17} />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 lg:px-10">
            {/* Header */}
            <div className="mb-8">
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-black/40">
                <ShoppingBag size={13} />
                Orders
              </div>

              <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
                Order Management
              </h1>

              <p className="mt-2 text-sm text-black/50">
                Manage customer orders, payments and delivery status.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
              <Stat
                title="Total Orders"
                value={stats.total}
                icon={<ShoppingBag size={18} />}
              />

              <Stat
                title="Pending"
                value={stats.pending}
                icon={<Clock3 size={18} />}
              />

              <Stat
                title="Processing"
                value={stats.processing}
                icon={<Package size={18} />}
              />

              <Stat
                title="Shipped"
                value={stats.shipped}
                icon={<Truck size={18} />}
              />

              <Stat
                title="Delivered"
                value={stats.delivered}
                icon={<CheckCircle2 size={18} />}
              />

              <Stat
                title="Paid Revenue"
                value={formatPrice(stats.revenue)}
                icon={<CreditCard size={18} />}
              />
            </div>

            {/* Orders */}
            <section className="overflow-hidden rounded-3xl border border-black/10 bg-white">
              {/* Toolbar */}
              <div className="border-b border-black/10 p-5 sm:p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <h2 className="font-medium">
                      Customer Orders
                    </h2>

                    <p className="mt-1 text-xs text-black/40">
                      {filteredOrders.length} orders shown
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    {/* Search */}
                    <div className="relative">
                      <Search
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
                      />

                      <input
                        value={search}
                        onChange={(e) =>
                          setSearch(e.target.value)
                        }
                        placeholder="Search orders..."
                        className="h-11 w-full rounded-full border border-black/10 bg-[#F8F7F4] pl-11 pr-4 text-sm outline-none focus:border-[#9CAF88] sm:w-[240px]"
                      />
                    </div>

                    {/* Order status */}
                    <select
                      value={orderStatus}
                      onChange={(e) =>
                        setOrderStatus(e.target.value)
                      }
                      className="h-11 rounded-full border border-black/10 bg-[#F8F7F4] px-4 text-sm outline-none"
                    >
                      <option value="all">
                        All order statuses
                      </option>
                      <option value="pending">
                        Pending
                      </option>
                      <option value="confirmed">
                        Confirmed
                      </option>
                      <option value="processing">
                        Processing
                      </option>
                      <option value="shipped">
                        Shipped
                      </option>
                      <option value="delivered">
                        Delivered
                      </option>
                      <option value="cancelled">
                        Cancelled
                      </option>
                    </select>

                    {/* Payment status */}
                    <select
                      value={paymentStatus}
                      onChange={(e) =>
                        setPaymentStatus(e.target.value)
                      }
                      className="h-11 rounded-full border border-black/10 bg-[#F8F7F4] px-4 text-sm outline-none"
                    >
                      <option value="all">
                        All payments
                      </option>
                      <option value="pending">
                        Pending
                      </option>
                      <option value="paid">
                        Paid
                      </option>
                      <option value="failed">
                        Failed
                      </option>
                      <option value="refunded">
                        Refunded
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex min-h-[300px] items-center justify-center">
                    <Loader2
                      size={28}
                      className="animate-spin text-[#60745e]"
                    />
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                    <ShoppingBag
                      size={28}
                      className="text-black/20"
                    />

                    <h3 className="mt-4 font-medium">
                      No orders found
                    </h3>

                    <p className="mt-1 text-sm text-black/40">
                      Try changing your search or filters.
                    </p>
                  </div>
                ) : (
                  <table className="w-full min-w-[1100px] border-collapse">
                    <thead>
                      <tr className="border-b border-black/10 text-left">
                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-black/40">
                          Order
                        </th>

                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-black/40">
                          Customer
                        </th>

                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-black/40">
                          Items
                        </th>

                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-black/40">
                          Total
                        </th>

                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-black/40">
                          Payment
                        </th>

                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-black/40">
                          Status
                        </th>

                        <th className="px-6 py-4 text-right text-[10px] uppercase tracking-[0.2em] text-black/40">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredOrders.map((order) => {
                        const status = getStatus(
                          order.orderStatus
                        );

                        const StatusIcon = status.icon;

                        return (
                          <tr
                            key={order._id}
                            className="border-b border-black/5 hover:bg-[#FBFAF8]"
                          >
                            <td className="px-6 py-5">
                              <div className="font-medium text-sm">
                                #{order.orderNumber}
                              </div>

                              <div className="mt-1 text-xs text-black/40">
                                {formatDate(
                                  order.createdAt
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="text-sm font-medium">
                                {order.shippingAddress.name ||
                                  order.user?.name ||
                                  "Customer"}
                              </div>

                              <div className="mt-1 text-xs text-black/40">
                                {order.shippingAddress.email ||
                                  order.user?.email}
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="text-sm">
                                {order.items.length}{" "}
                                {order.items.length === 1
                                  ? "item"
                                  : "items"}
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="font-medium text-sm">
                                {formatPrice(order.total)}
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-[10px] font-medium uppercase ${order.paymentStatus ===
                                  "paid"
                                  ? "bg-green-50 text-green-700"
                                  : order.paymentStatus ===
                                    "failed"
                                    ? "bg-red-50 text-red-700"
                                    : "bg-amber-50 text-amber-700"
                                  }`}
                              >
                                {order.paymentStatus.replaceAll(
                                  "_",
                                  " "
                                )}
                              </span>
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-medium uppercase ${status.className}`}
                              >
                                <StatusIcon size={13} />
                                {status.label}
                              </span>
                            </td>

                            <td className="px-6 py-5 text-right">
                              <Link
                                to="/admin/orders/$orderId"
                                params={{
                                  orderId: order._id,
                                }}
                                className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-xs font-medium hover:bg-black/5"
                              >
                                View
                                <ChevronRight size={14} />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function Stat({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-black/45">
          {title}
        </span>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F6F1EA]">
          {icon}
        </div>
      </div>

      <div className="mt-4 text-xl font-medium">
        {value}
      </div>
    </div>
  );
}