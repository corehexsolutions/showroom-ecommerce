import { createFileRoute } from "@tanstack/react-router";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";

export const Route = createFileRoute("/admin/orders/")({
  component: AdminOrdersPage,
});