import { X } from "lucide-react";

export default function OrderDetailsDrawer({
  open,
  onClose,
  order,
}) {
  if (!open) return null;

  return (
    <div className="fixed right-0 top-0 z-50 h-screen w-[420px] border-l border-slate-200 bg-white shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b p-6">

        <div>
          <h2 className="text-2xl font-bold">
            Order Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            View complete order information
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-2 transition hover:bg-slate-100"
        >
          <X size={22} />
        </button>

      </div>

      {/* Content */}
      <div className="space-y-5 p-6">

        {order && (
          <>
            <div>
              <p className="text-xs text-slate-500">Order Number</p>
              <p className="font-semibold">{order.order_number}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Customer</p>
              <p className="font-semibold">{order.customer_name}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Mobile</p>
              <p className="font-semibold">{order.customer_mobile}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Order Total</p>
              <p className="font-semibold">
                ₹{Number(order.grand_total ?? 0).toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Status</p>
              <p className="font-semibold">{order.order_status}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Created</p>
              <p className="font-semibold">
                {new Date(order.created_at).toLocaleString("en-IN")}
              </p>
            </div>
{/* Products */}
<div className="border-t pt-5">
  <h3 className="mb-3 text-lg font-semibold">
    Products
  </h3>

  {order.order_items?.length > 0 ? (
    order.order_items.map((item) => (
      <div
        key={item.id}
        className="mb-3 rounded-xl border p-3"
      >
        <p className="font-semibold">
          {item.product_name}
        </p>

        <div className="mt-2 flex justify-between text-sm text-slate-600">
          <span>Qty: {item.quantity}</span>

          <span>
            ₹{Number(item.total_price).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    ))
  ) : (
    <p className="text-sm text-slate-500">
      No products found.
    </p>
  )}
</div>
            
          </>
        )}

        

      </div>

    </div>
  );
}