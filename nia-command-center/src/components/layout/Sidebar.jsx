import {
  LayoutDashboard,
  ShoppingBag,
  Boxes,
  Users,
  Building2,
  BarChart3,
  FileText,
  Settings,
} from "lucide-react";

import { NavLink, useLocation } from "react-router-dom";
import { rolePermissions } from "../../config/permissions";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/",
  },
  {
    icon: ShoppingBag,
    label: "Orders",
    path: "/orders",
  },
  {
    icon: Boxes,
    label: "Inventory",
    path: "/inventory",
  },
  {
    icon: Users,
    label: "Customers",
    path: "/customers",
  },
  {
    icon: Building2,
    label: "Studios",
    path: "/studios",
  },
  {
    icon: Users,
    label: "Guests",
    path: "/guests",
  },
  {
    icon: BarChart3,
    label: "Reports & Analytics",
    path: "/reports",
  },
  {
    icon: FileText,
    label: "Sales Report",
    path: "/reports/sales",
  },
  {
    icon: FileText,
    label: "Orders Report",
    path: "/reports/orders",
  },
  {
    icon: FileText,
    label: "Customers Report",
    path: "/reports/customers",
  },
  {
    icon: FileText,
    label: "Products Report",
    path: "/reports/products",
  },
  {
    icon: FileText,
    label: "Inventory Report",
    path: "/reports/inventory",
  },
  {
    icon: FileText,
    label: "Studio Report",
    path: "/reports/studios",
  },
  {
    icon: FileText,
    label: "Notifications",
    path: "/reports/notifications",
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
  },
];

export default function Sidebar() {

  const location = useLocation();

  const user = JSON.parse(
  localStorage.getItem("nia_user") || "{}"
);

  const role = user?.role || "analytics";

  const allowedRoutes = rolePermissions[role] || [];

  const visibleMenus = menuItems.filter((item) => {
  if (allowedRoutes.includes("*")) return true;

  return allowedRoutes.includes(item.path);
});

  return (
    <aside className="flex h-screen w-72 flex-col bg-slate-950 text-white">

      {/* Logo */}
      <div className="border-b border-slate-800 p-8">
        <h1 className="text-3xl font-bold tracking-wide text-blue-400">
          Nia.one
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Command Center
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">

        {visibleMenus.map((item) => {

            const Icon = item.icon;

            const isDashboard = item.path === "/";
            const isReports = item.path === "/reports";

            const isActive = isDashboard
              ? location.pathname === "/"
              : isReports
              ? location.pathname === "/reports"
              : location.pathname === item.path;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4">
        <p className="text-xs text-slate-500">
          Nia.one Command Center
        </p>

        <p className="mt-1 text-xs text-slate-600">
          Version 1.0
        </p>
      </div>

    </aside>
  );
}