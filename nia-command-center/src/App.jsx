import { Routes, Route } from "react-router-dom";

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