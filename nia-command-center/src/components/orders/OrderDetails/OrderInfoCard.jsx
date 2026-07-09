import {
  Package,
  CalendarDays,
  Hash,
  ShoppingBag,
} from "lucide-react";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  packed: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrderInfoCard({ order }) {
  if (!order) return null;

  const totalItems = (order.items || []).reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Package className="h-5 w-5 text-indigo-600" />

        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          Order
        </h3>
      </div>

      <div className="space-y-4">
        {/* Order Number */}
        <div className="flex items-center gap-3">
          <Hash className="h-4 w-4 text-slate-400" />

          <div>
            <p className="text-xs text-slate-500">
              Order Number
            </p>

            <p className="font-medium text-slate-900">
              {order.orderNumber}
            </p>
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="mb-1 text-xs text-slate-500">
            Status
          </p>

          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              statusStyles[order.status] ??
              "bg-slate-100 text-slate-700"
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-3">
          <CalendarDays className="h-4 w-4 text-slate-400" />

          <div>
            <p className="text-xs text-slate-500">
              Order Date
            </p>

            <p className="font-medium text-slate-900">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString("en-IN")
                : "-"}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-600">
              Total Items
            </span>
          </div>

          <span className="font-semibold">
            {totalItems}
          </span>
        </div>

        {/* Grand Total */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">
            Grand Total
          </span>

          <span className="text-lg font-bold text-indigo-600">
            ₹{Number(order.grandTotal).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}