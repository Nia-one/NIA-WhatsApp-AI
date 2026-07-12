import { Navigate, Outlet } from "react-router-dom";

const rolePermissions = {

    super_admin: ["*"],

    admin: [
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
        "/reports/notifications"
    ],

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
        "/reports/studios"
    ],

    analytics: [
        "/",
        "/reports",
        "/reports/sales",
        "/reports/orders",
        "/reports/customers",
        "/reports/products",
        "/reports/inventory",
        "/reports/studios"
    ]

};

export default function ProtectedRoute() {

    const token = localStorage.getItem("nia_token");

    const user = JSON.parse(
        localStorage.getItem("nia_user")
    );

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const role = user?.role || "analytics";

    const allowedRoutes =
        rolePermissions[role] || [];

    const currentPath =
        window.location.pathname;

    if (
        !allowedRoutes.includes("*") &&
        !allowedRoutes.includes(currentPath)
    ) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;

}