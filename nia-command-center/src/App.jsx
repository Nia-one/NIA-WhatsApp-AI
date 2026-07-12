import { Routes, Route } from "react-router-dom";

{/* Settings */}
import SettingsPage from "./pages/Settings/SettingsPage";
import UsersPage from "./pages/Settings/UsersPage";
import RolesPage from "./pages/Settings/RolesPage";
import SystemConfigPage from "./pages/Settings/SystemConfigPage";
import AuditLogsPage from "./pages/Settings/AuditLogsPage";

import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";



// Authentication
import LoginPage from "./pages/Auth/LoginPage";

// Dashboard
import DashboardPage from "./pages/Dashboard/DashboardPage";

// Modules
import OrdersPage from "./pages/Orders/OrdersPage";
import InventoryPage from "./pages/Inventory/InventoryPage";
import CustomersPage from "./pages/Customers/CustomersPage";

import StudiosPage from "./pages/Studios/StudiosPage";

import GuestsPage from "./pages/Guests/GuestsPage";

// Reports
import DashboardReportPage from "./pages/Reports/DashboardPage";
import SalesReportPage from "./pages/Reports/SalesReportPage";
import OrdersReportPage from "./pages/Reports/OrdersReportPage";
import CustomersReportPage from "./pages/Reports/CustomersReportPage";
import ProductsReportPage from "./pages/Reports/ProductsReportPage";
import InventoryReportPage from "./pages/Reports/InventoryReportPage";
import StudioReportPage from "./pages/Reports/StudioReportPage";
import NotificationsReportPage from "./pages/Reports/NotificationsReportPage";

function App() {
  return (
    <Routes>

      {/* Public Route */}
      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>

        <Route element={<AppLayout />}>

          {/* Dashboard */}
          <Route
            path="/"
            element={<DashboardPage />}
          />

<Route
  path="/settings"
  element={<SettingsPage />}
/>

<Route
  path="/settings/users"
  element={<UsersPage />}
/>

<Route
  path="/settings/roles"
  element={<RolesPage />}
/>

<Route
  path="/settings/system"
  element={<SystemConfigPage />}
/>

<Route
  path="/settings/audit"
  element={<AuditLogsPage />}
/>

          {/* Main Modules */}
          <Route
            path="/orders"
            element={<OrdersPage />}
          />

          <Route
            path="/inventory"
            element={<InventoryPage />}
          />

          <Route
            path="/customers"
            element={<CustomersPage />}
          />

<Route path="/guests" element={<GuestsPage />} />

<Route
  path="/studios"
  element={<StudiosPage />}
/>

          {/* Reports */}
          <Route
            path="/reports"
            element={<DashboardReportPage />}
          />

          <Route
            path="/reports/sales"
            element={<SalesReportPage />}
          />

          <Route
            path="/reports/orders"
            element={<OrdersReportPage />}
          />

          <Route
            path="/reports/customers"
            element={<CustomersReportPage />}
          />

          <Route
            path="/reports/products"
            element={<ProductsReportPage />}
          />

          <Route
            path="/reports/inventory"
            element={<InventoryReportPage />}
          />

          <Route
            path="/reports/studios"
            element={<StudioReportPage />}
          />

          <Route
            path="/reports/notifications"
            element={<NotificationsReportPage />}
          />

        </Route>

      </Route>

    </Routes>
  );
}

export default App;