import {
  Users,
  IndianRupee,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";


export default function CustomerAnalytics({
  data = {},
}) {

  return (

    <div className="rounded-3xl bg-white p-8 shadow-sm">

      <div className="mb-6">

        <h2 className="text-xl font-bold text-slate-800">
          Customer Analytics
        </h2>

        <p className="text-sm text-slate-500">
          Customer behaviour and revenue insights.
        </p>

      </div>


      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">


        <MetricCard
          title="Total Customers"
          value={data.total_customers ?? 0}
          icon={Users}
        />


        <MetricCard
  title="Lifetime Revenue"
  value={`₹${Number(
    data.total_spent ?? 0
  ).toLocaleString("en-IN")}`}
  icon={IndianRupee}
/>


        <MetricCard
          title="Total Orders"
          value={data.total_orders ?? 0}
          icon={ShoppingBag}
        />


        <MetricCard
  title="Average Spend"
  value={`₹${Number(
    data.average_spent ?? 0
  ).toLocaleString("en-IN")}`}
  icon={TrendingUp}
/>


      </div>


    </div>

  );
}



function MetricCard({
  title,
  value,
  icon: Icon,
}) {

  return (

    <div className="rounded-2xl border bg-slate-50 p-5">

      <div className="flex items-center justify-between">

        <p className="text-sm text-slate-500">
          {title}
        </p>


        <Icon
          size={22}
          className="text-blue-600"
        />

      </div>


      <h3 className="mt-3 text-2xl font-bold text-slate-800">
        {value}
      </h3>


    </div>

  );
}