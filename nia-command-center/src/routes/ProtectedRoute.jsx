import { Navigate, Outlet, useLocation } from "react-router-dom";
import { rolePermissions } from "../config/permissions";

export default function ProtectedRoute() {
  const location = useLocation();

  const token = localStorage.getItem("nia_token");

  const user = JSON.parse(
    localStorage.getItem("nia_user") || "{}"
  );

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Current user role
  const role = user?.role || "analytics";

  // Allowed routes for this role
  const allowedRoutes = rolePermissions[role] || [];

  // Current URL
  const currentPath = location.pathname;

  // Check access
  const hasAccess =
    allowedRoutes.includes("*") ||
    allowedRoutes.includes(currentPath);

  // Block unauthorized access
  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}