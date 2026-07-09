import OrderRow from "./OrderRow";

export default function OrdersTable({
  orders = [],
  onRowClick,
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <table className="min-w-full">

        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Order No.</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Mobile</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Total</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Date</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className="py-10 text-center text-slate-500"
              >
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <OrderRow
  key={order.id}
  order={order}
  onClick={() => onRowClick(order)}
/>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
}