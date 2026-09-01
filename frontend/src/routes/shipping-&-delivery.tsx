import { createFileRoute } from "@tanstack/react-router";
import ShippingDeliveryPage from "@/pages/ShippingDeliveryPage";

export const Route = createFileRoute("/shipping-&-delivery")({
  component: ShippingDeliveryPage,
});