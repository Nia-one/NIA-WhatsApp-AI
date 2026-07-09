import { User, Phone, Building2 } from "lucide-react";

export default function CustomerCard({ order }) {
  if (!order) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <User className="h-5 w-5 text-indigo-600" />

        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          Customer
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-slate-500">Customer Name</p>

          <p className="mt-1 font-medium text-slate-900">
            {order.customerName || "-"}
          </p>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 h-4 w-4 text-slate-400" />

          <div>
            <p className="text-xs text-slate-500">Mobile Number</p>

            <p className="font-medium text-slate-900">
              {order.mobile || "-"}
            </p>
          </div>
        </div>

        {order.studio && (
          <div className="flex items-start gap-3">
            <Building2 className="mt-0.5 h-4 w-4 text-slate-400" />

            <div>
              <p className="text-xs text-slate-500">Studio</p>

              <p className="font-medium text-slate-900">
                {order.studio}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}