export default function CustomerRow({
  customer,
  onClick,
}) {
  const customerName =
    customer.customer_name?.trim() || "Guest Customer";

  const mobile =
    customer.mobile_number || "-";

  const totalSpent = Number(
    customer.total_spent || 0
  ).toLocaleString("en-IN");

  const lastOrder =
    customer.last_order_date
      ? new Date(
          customer.last_order_date
        ).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

  return (
    <tr
      onClick={() => onClick(customer)}
      className="cursor-pointer border-b border-slate-100 transition-all duration-200 hover:bg-slate-50"
    >
      {/* Customer */}
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">
            {customerName}
          </span>

          <span className="text-xs text-slate-500">
            Customer ID: {customer.id}
          </span>
        </div>
      </td>

      {/* Mobile */}
      <td className="px-6 py-4">
        <span className="font-medium">
          {mobile}
        </span>
      </td>

{/* Studio */}
<td className="px-6 py-4">

    {customer.studio_name ? (

        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {customer.studio_name}
        </span>

    ) : (

        <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            Pending Mapping
        </span>

    )}

</td>

{/* Theatre */}
<td className="px-6 py-4">

    {customer.theatre_name ? (

        <span className="text-slate-700">
            {customer.theatre_name}
        </span>

    ) : (

        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            Not Assigned
        </span>

    )}

</td>

      {/* Orders */}
      <td className="px-6 py-4 text-center font-semibold">
        {customer.total_orders ?? 0}
      </td>

      {/* Revenue */}
      <td className="px-6 py-4 font-semibold text-green-700">
        ₹ {totalSpent}
      </td>

      {/* Last Order */}
      <td className="px-6 py-4 text-slate-600">
        {lastOrder}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            customer.is_active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {customer.is_active ? "Active" : "Inactive"}
        </span>
      </td>
    </tr>
  );
}