import {
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  Calendar,
} from "lucide-react";

export default function CustomerStatsCard({ stats }) {
  if (!stats) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-5 text-lg font-semibold">
          Customer Statistics
        </h3>

        <div className="text-sm text-slate-500">
          No statistics available.
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Orders",
      value: stats.total_orders ?? 0,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Lifetime Value",
      value: `₹${Number(stats.total_spent || 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Average Order Value",
      value: `₹${Number(
        stats.average_order_value || 0
      ).toLocaleString("en-IN")}`,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Last Purchase",
      value: stats.last_order_date
        ? new Date(stats.last_order_date).toLocaleDateString("en-IN")
        : "-",
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <h3 className="mb-5 text-lg font-semibold">
        Customer Statistics
      </h3>

      <div className="grid grid-cols-2 gap-4">

        {cards.map((card) => {

          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`rounded-xl ${card.bg} p-4`}
            >

              <div className="mb-3 flex items-center justify-between">

                <Icon className={`h-5 w-5 ${card.color}`} />

              </div>

              <div className="text-2xl font-bold">
                {card.value}
              </div>

              <div className="mt-1 text-xs text-slate-500">
                {card.title}
              </div>

            </div>
          );

        })}

      </div>

    </div>
  );
}