import {
  Users,
  UserCheck,
  IndianRupee,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

export default function CustomerKPICards({
  customers = [],
}) {

  const totalCustomers = customers.length;

  const activeCustomers =
    customers.filter((c) => c.is_active).length;

  const inactiveCustomers =
    totalCustomers - activeCustomers;

  const totalRevenue =
    customers.reduce(
      (sum, c) => sum + Number(c.total_spent || 0),
      0
    );

  const totalOrders =
    customers.reduce(
      (sum, c) => sum + Number(c.total_orders || 0),
      0
    );

  const averageOrderValue =
    totalOrders > 0
      ? totalRevenue / totalOrders
      : 0;

  const activePercentage =
    totalCustomers > 0
      ? ((activeCustomers / totalCustomers) * 100).toFixed(1)
      : 0;

  const cards = [
    {
      title: "Total Customers",
      value: totalCustomers.toLocaleString("en-IN"),
      subtitle: `${inactiveCustomers} inactive`,
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Customers",
      value: activeCustomers.toLocaleString("en-IN"),
      subtitle: `${activePercentage}% active`,
      icon: UserCheck,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Lifetime Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      subtitle: `${totalOrders} total orders`,
      icon: IndianRupee,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Average Order Value",
      value: `₹${averageOrderValue.toLocaleString("en-IN", {
        maximumFractionDigits: 0,
      })}`,
      subtitle: "Per completed order",
      icon: TrendingUp,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-800">
                  {card.value}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {card.subtitle}
                </p>

              </div>

              <div
                className={`rounded-2xl p-3 ${card.iconBg}`}
              >
                <Icon
                  className={`h-7 w-7 ${card.iconColor}`}
                />
              </div>

            </div>

          </div>

        );

      })}

    </div>
  );
}