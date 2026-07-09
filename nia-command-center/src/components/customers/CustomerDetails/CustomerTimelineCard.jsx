import {
  Clock3,
  UserPlus,
  ShoppingBag,
  CalendarClock,
} from "lucide-react";

export default function CustomerTimelineCard({
  customer,
  stats,
}) {

  if (!customer) return null;

  const timeline = [
    {
      title: "Customer Registered",
      value: customer.created_at,
      icon: UserPlus,
      color: "text-blue-600",
    },
    {
      title: "Last Order",
      value: stats?.last_order_date,
      icon: ShoppingBag,
      color: "text-green-600",
    },
    {
      title: "Last Activity",
      value:
        stats?.last_order_date ||
        customer.created_at,
      icon: CalendarClock,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <div className="mb-5 flex items-center gap-2">

        <Clock3 className="h-5 w-5 text-orange-600" />

        <h3 className="text-lg font-semibold">
          Activity Timeline
        </h3>

      </div>

      <div className="space-y-6">

        {timeline.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.title}
              className="flex gap-4"
            >

              <div className="mt-1">

                <Icon
                  className={`h-5 w-5 ${item.color}`}
                />

              </div>

              <div>

                <div className="font-medium">
                  {item.title}
                </div>

                <div className="text-sm text-slate-500">

                  {item.value
                    ? new Date(
                        item.value
                      ).toLocaleString("en-IN")
                    : "-"}

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}