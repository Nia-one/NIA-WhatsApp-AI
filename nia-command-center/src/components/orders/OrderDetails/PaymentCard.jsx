import { CreditCard } from "lucide-react";

function PaymentRow({ label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-600">{label}</span>

      <span
        className={`font-medium ${
          highlight ? "text-lg font-bold text-indigo-600" : "text-slate-900"
        }`}
      >
        ₹{Number(value).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </div>
  );
}

export default function PaymentCard({ order }) {
  if (!order) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-indigo-600" />

        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          Payment
        </h3>
      </div>

      <div className="space-y-3">
        <PaymentRow
          label="Subtotal"
          value={order.subtotal}
        />

        <PaymentRow
          label="Discount"
          value={order.discount}
        />

        <PaymentRow
          label="Delivery Charges"
          value={order.deliveryCharge}
        />

        <div className="border-t pt-3">
          <PaymentRow
            label="Grand Total"
            value={order.grandTotal}
            highlight
          />
        </div>

        <div className="mt-5 rounded-lg bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">
              Payment Method
            </span>

            <span className="font-semibold text-slate-900">
              {order.paymentMethod}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}