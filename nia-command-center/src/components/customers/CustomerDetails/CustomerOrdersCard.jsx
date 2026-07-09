import {
  ShoppingCart,
  Package,
  CalendarDays,
} from "lucide-react";

export default function CustomerOrdersCard({
  orders = [],
  onOrderClick,
}) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      {/* Header */}

      <div className="mb-6 flex items-center gap-3">

        <ShoppingCart className="h-5 w-5 text-blue-600" />

        <h3 className="text-lg font-semibold">
          Recent Orders
        </h3>

      </div>

      {orders.length === 0 ? (

        <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center">

          <Package className="mx-auto mb-3 h-10 w-10 text-slate-300" />

          <p className="text-sm text-slate-500">
            No Orders Available
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {orders.map((order) => (

            <div
  key={order.order_number}
  onClick={() => onOrderClick?.(order)}
  className="cursor-pointer rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
>

              <div className="flex items-center justify-between">

                <div>

                  <h4 className="font-semibold">
                    {order.order_number}
                  </h4>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">

                    <CalendarDays className="h-4 w-4" />

                    {new Date(
                      order.order_date
                    ).toLocaleDateString("en-IN")}

                  </div>

                </div>

                <div className="text-right">

                  <div className="text-lg font-bold">

                    ₹
                    {Number(
                      order.total_amount || 0
                    ).toLocaleString("en-IN")}

                  </div>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold
                    ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >

                    {order.status}

                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}