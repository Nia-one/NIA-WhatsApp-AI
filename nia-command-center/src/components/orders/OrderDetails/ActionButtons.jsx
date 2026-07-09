import {
  Check,
  Package,
  Truck,
  CheckCircle2,
  X,
} from "lucide-react";

const ACTIONS = {
  pending: [
    {
      key: "confirmed",
      label: "Confirm",
      icon: Check,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      key: "cancelled",
      label: "Cancel",
      icon: X,
      color: "bg-red-600 hover:bg-red-700",
    },
  ],

  confirmed: [
    {
      key: "packed",
      label: "Pack",
      icon: Package,
      color: "bg-indigo-600 hover:bg-indigo-700",
    },
    {
      key: "cancelled",
      label: "Cancel",
      icon: X,
      color: "bg-red-600 hover:bg-red-700",
    },
  ],

  packed: [
    {
      key: "shipped",
      label: "Ship",
      icon: Truck,
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ],

  shipped: [
    {
      key: "delivered",
      label: "Deliver",
      icon: CheckCircle2,
      color: "bg-emerald-600 hover:bg-emerald-700",
    },
  ],

  delivered: [],

  cancelled: [],
};

export default function ActionButtons({
  order,
  onStatusChange,
  loading = false,
}) {
  if (!order) return null;

  const status = (order.status || "pending").toLowerCase();

  const actions = ACTIONS[status] || [];

  if (actions.length === 0) return null;

  return (
    <div className="border-t bg-white p-5">
      <div
        className={`grid gap-3 ${
          actions.length === 1
            ? "grid-cols-1"
            : "grid-cols-2"
        }`}
      >
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
  key={action.key}
  disabled={loading}
  onClick={() => onStatusChange(action.key)}
  className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition ${action.color} disabled:cursor-not-allowed disabled:opacity-50`}
>
  {loading ? (
    <>
      <svg
        className="h-4 w-4 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          opacity="0.25"
        />

        <path
          fill="currentColor"
          d="M22 12a10 10 0 00-10-10v3a7 7 0 017 7h3z"
        />
      </svg>

      Updating...
    </>
  ) : (
    <>
      <Icon className="h-4 w-4" />
      {action.label}
    </>
  )}
</button>
          );
        })}
      </div>
    </div>
  );
}