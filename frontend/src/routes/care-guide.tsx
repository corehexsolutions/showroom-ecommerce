import { createFileRoute } from "@tanstack/react-router";
import CareGuidePage from "@/pages/CareGuidePage";

export const Route = createFileRoute("/care-guide")({
  component: CareGuidePage,
});