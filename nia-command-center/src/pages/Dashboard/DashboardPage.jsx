import {
  DollarSign,
  ShoppingCart,
  Users,
  Boxes,
} from "lucide-react";

import KpiCard from "../../components/dashboard/KpiCard";
import { useDashboard } from "../../hooks/useDashboard";

export default function DashboardPage() {

  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="p-10 text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-red-600">
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <h2 className="text-3xl font-bold">
          Dashboard
        </h2>

        <p className="mt-2 text-slate-500">
          Welcome to the Nia Command Center.
        </p>

      </div>

      <div className="grid grid-cols-4 gap-6">

        <KpiCard
          title="Revenue"
          value={`₹${Number(data?.total_revenue ?? 0).toLocaleString("en-IN")}`}
          change="+0%"
          positive
          icon={DollarSign}
        />

        <KpiCard
          title="Orders"
          value={data?.total_orders ?? 0}
          change="+0%"
          positive
          icon={ShoppingCart}
        />

        <KpiCard
          title="Customers"
          value={data?.total_customers ?? 0}
          change="+0%"
          positive
          icon={Users}
        />

        <KpiCard
          title="Products"
          value={data?.total_products ?? 0}
          change="+0%"
          positive
          icon={Boxes}
        />

      </div>

    </div>
  );
}