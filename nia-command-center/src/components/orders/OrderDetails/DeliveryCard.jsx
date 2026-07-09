import { MapPin, Home } from "lucide-react";

export default function DeliveryCard({ order }) {
  if (!order) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-indigo-600" />

        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          Delivery
        </h3>
      </div>

      {order.address ? (
        <div className="flex gap-3">
          <Home className="mt-1 h-4 w-4 text-slate-400" />

          <div className="space-y-1">
            <p className="font-medium text-slate-900">
              {order.address}
            </p>

            {(order.city || order.state || order.pincode) && (
              <p className="text-sm text-slate-500">
                {[order.city, order.state, order.pincode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          No delivery address available
        </div>
      )}
    </div>
  );
}