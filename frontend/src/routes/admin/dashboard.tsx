import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Archive,
  ArrowLeft,
  CheckCircle2,
  Edit3,
  Eye,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

import type { Product } from "@/types/product";
import {
  archiveProduct,
  deleteProduct,
  getAdminProducts,
} from "@/lib/adminApi";
import ProductForm from "@/components/admin/ProductForm";
import { createFileRoute } from "@tanstack/react-router";



export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin — Decor Den" },
      { name: "description", content: "Manage your products and inventory." },
    ],
  }),
  component: AdminPage,
});

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "archived">("all");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [error, setError] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminProducts();
      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.slug.toLowerCase().includes(query);

      const matchesStatus =
        status === "all" ||
        (status === "active" && product.isActive) ||
        (status === "archived" && !product.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [products, search, status]);

  const stats = useMemo(() => {
    const active = products.filter((p) => p.isActive).length;

    const lowStock = products.filter(
      (p) => p.isActive && p.totalStock > 0 && p.totalStock <= 5
    ).length;

    const outOfStock = products.filter(
      (p) => p.isActive && (!p.inStock || p.totalStock <= 0)
    ).length;

    const inventoryValue = products.reduce(
      (total, product) =>
        total + Number(product.price || 0) * Number(product.totalStock || 0),
      0
    );

    return {
      total: products.length,
      active,
      lowStock,
      outOfStock,
      inventoryValue,
    };
  }, [products]);

  async function handleArchive(product: Product) {
    const confirmed = window.confirm(
      `${product.isActive ? "Archive" : "Restore"} "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      await archiveProduct(product._id);
      await loadProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Operation failed");
    }
  }

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Permanently delete "${product.name}"?\n\nThis cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteProduct(product._id);
      await loadProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setShowForm(true);
  }

  function handleCreate() {
    setEditingProduct(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingProduct(null);
  }

  return (
    <div className="min-h-screen bg-[#F6F1EA] text-[#24241F]">
      {/* Mobile header */}
      <header className="flex items-center justify-between border-b border-black/10 bg-white px-5 py-4 lg:hidden">
        <div>
          <div className="text-lg font-semibold tracking-tight">Decorden.</div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-black/40">
            Admin
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-xl border border-black/10 p-2"
        >
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
                active
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

        {/* Overlay mobile */}
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          />
        )}

        {/* Main */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 lg:px-10">
            {/* Header */}
            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-black/40">
                  <LayoutDashboard size={13} />
                  Dashboard
                </div>

                <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
                  Product Management
                </h1>

                <p className="mt-2 text-sm text-black/50">
                  Manage Decorden sofas, inventory, pricing and product content.
                </p>
              </div>

              <button
                onClick={handleCreate}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#20251F] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#9CAF88] hover:text-[#20251F]"
              >
                <Plus size={17} />
                Add Sofa
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                <X size={17} />
                {error}
              </div>
            )}

            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <StatCard
                title="Total Sofas"
                value={stats.total}
                icon={<Package size={18} />}
              />

              <StatCard
                title="Active"
                value={stats.active}
                icon={<CheckCircle2 size={18} />}
              />

              <StatCard
                title="Low Stock"
                value={stats.lowStock}
                icon={<Archive size={18} />}
              />

              <StatCard
                title="Out of Stock"
                value={stats.outOfStock}
                icon={<ShoppingBag size={18} />}
              />

              <StatCard
                title="Inventory Value"
                value={`₹${stats.inventoryValue.toLocaleString("en-IN")}`}
                icon={<span className="text-base">₹</span>}
              />
            </div>

            {/* Product section */}
            <section className="overflow-hidden rounded-3xl border border-black/10 bg-white">
              {/* Toolbar */}
              <div className="border-b border-black/10 p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="font-medium">Sofas</h2>
                    <p className="mt-1 text-xs text-black/40">
                      {filteredProducts.length} products shown
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
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search sofas..."
                        className="h-11 w-full rounded-full border border-black/10 bg-[#F8F7F4] pl-11 pr-4 text-sm outline-none transition focus:border-[#9CAF88] sm:w-[250px]"
                      />
                    </div>

                    {/* Status */}
                    <select
                      value={status}
                      onChange={(e) =>
                        setStatus(
                          e.target.value as
                          | "all"
                          | "active"
                          | "archived"
                        )
                      }
                      className="h-11 rounded-full border border-black/10 bg-[#F8F7F4] px-4 text-sm outline-none focus:border-[#9CAF88]"
                    >
                      <option value="all">All products</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="space-y-3 p-6">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div
                        key={item}
                        className="h-20 animate-pulse rounded-2xl bg-black/5"
                      />
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                    <div className="mb-4 rounded-full bg-[#F6F1EA] p-4">
                      <Package size={25} className="text-black/40" />
                    </div>

                    <h3 className="font-medium">No sofas found</h3>

                    <p className="mt-1 max-w-sm text-sm text-black/40">
                      Try changing your search or add your first sofa.
                    </p>

                    <button
                      onClick={handleCreate}
                      className="mt-5 rounded-full bg-[#20251F] px-5 py-2.5 text-sm text-white"
                    >
                      Add Sofa
                    </button>
                  </div>
                ) : (
                  <table className="w-full min-w-[950px] border-collapse">
                    <thead>
                      <tr className="border-b border-black/10 text-left">
                        <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-black/40">
                          Product
                        </th>

                        <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-black/40">
                          Category
                        </th>

                        <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-black/40">
                          Price
                        </th>

                        <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-black/40">
                          Stock
                        </th>

                        <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-black/40">
                          Status
                        </th>

                        <th className="px-6 py-4 text-right text-[10px] font-medium uppercase tracking-[0.2em] text-black/40">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredProducts.map((product) => (
                        <ProductRow
                          key={product._id}
                          product={product}
                          onEdit={() => handleEdit(product)}
                          onArchive={() => handleArchive(product)}
                          onDelete={() => handleDelete(product)}
                        />
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Product form */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={closeForm}
          onSaved={async () => {
            closeForm();
            await loadProducts();
          }}
        />
      )}
    </div>
  );
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

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-black/10 bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <div className="text-xs text-black/45">{title}</div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F6F1EA] text-black/60">
          {icon}
        </div>
      </div>

      <div className="mt-4 text-2xl font-medium tracking-tight">
        {value}
      </div>
    </motion.div>
  );
}

function ProductRow({
  product,
  onEdit,
  onArchive,
  onDelete,
}: {
  product: Product;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const image = product.images?.[0]?.url;

  return (
    <tr className="border-b border-black/5 transition hover:bg-[#FBFAF8]">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F6F1EA]">
            {image ? (
              <img
                src={image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package size={20} className="text-black/20" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="max-w-[260px] truncate text-sm font-medium">
              {product.name}
            </div>

            <div className="mt-1 max-w-[260px] truncate text-xs text-black/35">
              {product.slug}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className="text-sm text-black/60">
          {product.category}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm font-medium">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </div>

        {product.compareAtPrice && (
          <div className="text-xs text-black/30 line-through">
            ₹{Number(product.compareAtPrice).toLocaleString("en-IN")}
          </div>
        )}
      </td>

      <td className="px-6 py-4">
        <div
          className={`text-sm font-medium ${product.totalStock <= 0
            ? "text-red-600"
            : product.totalStock <= 5
              ? "text-amber-600"
              : "text-black/70"
            }`}
        >
          {product.totalStock}
        </div>

        <div className="text-xs text-black/35">
          {product.inStock ? "In stock" : "Unavailable"}
        </div>
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider ${product.isActive
            ? "bg-[#E7EEE1] text-[#536348]"
            : "bg-black/5 text-black/40"
            }`}
        >
          {product.isActive ? "Active" : "Archived"}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          <Link
            to="/product/$id"
            params={{ id: product.slug }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black/45 transition hover:bg-black/5 hover:text-black"
            title="View"
          >
            <Eye size={16} />
          </Link>

          <button
            onClick={onEdit}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black/45 transition hover:bg-black/5 hover:text-black"
            title="Edit"
          >
            <Edit3 size={16} />
          </button>

          <button
            onClick={onArchive}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black/45 transition hover:bg-black/5 hover:text-black"
            title={product.isActive ? "Archive" : "Restore"}
          >
            <Archive size={16} />
          </button>

          <button
            onClick={onDelete}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-red-100 text-red-400 transition hover:bg-red-50 hover:text-red-600"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}