import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Wait one render cycle so Zustand can update after login
    const timer = setTimeout(() => {
      const { user, isAuthenticated } = useAuthStore.getState();

      console.log("ADMIN AUTH:", {
        user,
        role: user?.role,
        isAuthenticated,
      });

      if (!isAuthenticated || !user) {
        navigate({
          to: "/login",
          replace: true,
        });
        return;
      }

      if (user.role !== "admin") {
        navigate({
          to: "/",
          replace: true,
        });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated, user]);

  // Don't render admin pages until auth has been checked
  if (!isAuthenticated || !user) {
    return null;
  }

  // Logged in but not admin
  if (user.role !== "admin") {
    return null;
  }

  return <Outlet />;
}