import {
  DollarSign,
  ShoppingCart,
  Users,
  Boxes,
} from "lucide-react";

import KpiCard from "../../components/dashboard/KpiCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import TopProductsTable from "../../components/dashboard/TopProductsTable";
import InventoryAnalytics from "../../components/dashboard/InventoryAnalytics";
import CustomerAnalytics from "../../components/dashboard/CustomerAnalytics";
import OrderStatusChart from "../../components/dashboard/OrderStatusChart";


import {
  useDashboardKPIs,
  useSalesTrend,
  useTopProducts,
  useOrderStatusAnalytics,
   useCustomerAnalytics,
   useInventoryAnalytics,
} from "../../hooks/useReports";

export default function DashboardPage() {

  const {
    data,
    isLoading,
    error,
  } = useDashboardKPIs();

  const {
    data: salesTrend = [],
  } = useSalesTrend();

  const {
    data: topProducts = [],
  } = useTopProducts();

const {
  data: inventoryAnalytics = {},
} = useInventoryAnalytics();

  const {
  data: customerAnalytics = {},
} = useCustomerAnalytics();

  const {
    data: orderStatus = [],
  } = useOrderStatusAnalytics();

  if (isLoading) {
    return (
      <div className="p-6 text-xl font-semibold">
        Loading Executive Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Failed to load Executive Dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">

      {/* Header */}

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <h1 className="text-3xl font-bold text-slate-800">
          Executive Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Business performance overview.
        </p>

      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        <KpiCard
          title="Revenue"
          value={`₹${Number(
            data?.total_revenue ?? 0
          ).toLocaleString("en-IN")}`}
          icon={DollarSign}
        />

        <KpiCard
          title="Orders"
          value={data?.total_orders ?? 0}
          icon={ShoppingCart}
        />

        <KpiCard
          title="Customers"
          value={data?.total_customers ?? 0}
          icon={Users}
        />

        <KpiCard
          title="Products"
          value={data?.total_products ?? 0}
          icon={Boxes}
        />

      </div>

      {/* Sales Trend */}

      <RevenueChart
        data={salesTrend}
      />

      {/* Top Products */}

      <TopProductsTable
        data={topProducts}
      />

      <InventoryAnalytics
  data={inventoryAnalytics}
/>

{/* Customer Analytics */}

<CustomerAnalytics
  data={customerAnalytics}
/>

      {/* Order Status */}

      <OrderStatusChart
        data={orderStatus}
      />

    </div>
  );
}