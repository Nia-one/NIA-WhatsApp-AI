import { Navigate, Outlet, useLocation } from "react-router-dom";

const rolePermissions = {
  // Full system access
  admin: ["*"],

  // Operational team
  operations: [
    "/",
    "/orders",
    "/inventory",
    "/customers",
    "/guests",
    "/studios",

    "/reports",
    "/reports/sales",
    "/reports/orders",
    "/reports/customers",
    "/reports/products",
    "/reports/inventory",
    "/reports/studios",
    "/reports/notifications",

    "/settings",
  ],

  // Read-only business access
  founder: [
    "/",
    "/orders",
    "/inventory",
    "/customers",
    "/guests",
    "/studios",

    "/reports",
    "/reports/sales",
    "/reports/orders",
    "/reports/customers",
    "/reports/products",
    "/reports/inventory",
    "/reports/studios",
  ],

  // Analytics only
  analytics: [
    "/",

    "/reports",
    "/reports/sales",
    "/reports/orders",
    "/reports/customers",
    "/reports/products",
    "/reports/inventory",
    "/reports/studios",
  ],
};

export default function ProtectedRoute() {
  const location = useLocation();

  const token = localStorage.getItem("nia_token");

  const user = JSON.parse(
  localStorage.getItem("nia_user") || "{}"
);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role || "analytics";

  const allowedRoutes = rolePermissions[role] || [];

  const currentPath = location.pathname;

  const hasAccess =
    allowedRoutes.includes("*") ||
    allowedRoutes.includes(currentPath);

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}