import { createFileRoute } from "@tanstack/react-router";
import AdminOrderDetailsPage from "@/pages/admin/AdminOrderDetailsPage";

export const Route = createFileRoute(
  "/admin/orders/$orderId"
)({
  component: AdminOrderDetailsPage,
});