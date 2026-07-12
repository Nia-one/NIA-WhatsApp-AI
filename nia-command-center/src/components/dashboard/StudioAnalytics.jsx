export default function StudioAnalytics({ data = [] }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Studio Analytics
        </h2>

        <p className="text-slate-500">
          Studio-wise sales performance.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-slate-50">
    <tr className="text-left text-slate-600">

        <th className="py-3 px-3">Studio</th>

        <th className="py-3 px-3">Theatre</th>

        <th className="py-3 px-3">Status</th>

        <th className="py-3 px-3">Customers</th>

        <th className="py-3 px-3">Products Sold</th>

        <th className="py-3 px-3">Orders</th>

        <th className="py-3 px-3">Revenue</th>

        <th className="py-3 px-3">Cost</th>

        <th className="py-3 px-3">Profit</th>

        <th className="py-3 px-3">Margin %</th>

        <th className="py-3 px-3">Avg Order</th>

    </tr>
</thead>

          <tbody>
            {data.map((studio, index) => (
              <tr
    key={index}
    className="border-b hover:bg-slate-50 transition"
>

    <td className="py-4 px-3 font-medium">
        {studio.studio_name}
    </td>

    <td className="py-4 px-3">
        {studio.theatre_name}
    </td>

    <td className="py-4 px-3">
        <span
            className={
                studio.is_active
                    ? "rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                    : "rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700"
            }
        >
            {studio.is_active ? "Active" : "Inactive"}
        </span>
    </td>

    <td className="py-4 px-3">
        {studio.total_customers || 0}
    </td>

    <td className="py-4 px-3">
        {studio.products_sold || 0}
    </td>

    <td className="py-4 px-3">
        {studio.total_orders || 0}
    </td>

    <td className="py-4 px-3 font-semibold text-green-600">
        ₹ {Number(studio.total_revenue || 0).toLocaleString("en-IN")}
    </td>

    <td className="py-4 px-3">
        ₹ {Number(studio.total_cost || 0).toLocaleString("en-IN")}
    </td>

    <td className="py-4 px-3 font-semibold">
        ₹ {Number(studio.gross_profit || 0).toLocaleString("en-IN")}
    </td>

    <td className="py-4 px-3">
        {Number(studio.gross_margin || 0).toFixed(2)}%
    </td>

    <td className="py-4 px-3">
        ₹ {Number(studio.average_order_value || 0).toLocaleString("en-IN")}
    </td>

</tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={11}
                  className="py-8 text-center text-slate-400"
                >
                  No studio data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}