import { createFileRoute } from "@tanstack/react-router";
import OrderDetailsPage from "@/pages/OrderDetailsPage";

export const Route = createFileRoute("/orders/$orderId")({
  component: OrderDetailsPage,
});