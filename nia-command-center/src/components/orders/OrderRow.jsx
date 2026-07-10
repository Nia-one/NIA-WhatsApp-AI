import StatusBadge from "./StatusBadge";

export default function OrderRow({
  order,
  onClick,
}) {
  return (
    <tr
  onClick={onClick}
  className="cursor-pointer border-b border-slate-200 transition duration-200 hover:bg-slate-50"
>
      <td className="px-4 py-3 font-medium">
        {order.order_number}
      </td>

      <td className="px-4 py-3">
        {order.customer_name}
      </td>

     <td className="px-4 py-3">
  {order.customer_mobile}
</td>

<td className="px-4 py-3">
  {order.studio_name ? (
    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
      {order.studio_name}
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
      Pending Mapping
    </span>
  )}
</td>

<td className="px-4 py-3">
  {order.theatre_name ? (
    order.theatre_name
  ) : (
    <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
      Not Assigned
    </span>
  )}
</td>

<td className="px-4 py-3">
  ₹{Number(order.grand_total ?? 0).toLocaleString("en-IN")}
</td>

      <td className="px-4 py-3">
        <StatusBadge status={order.order_status} />
      </td>

      <td className="px-4 py-3">
        {new Date(order.created_at).toLocaleDateString("en-IN")}
      </td>
    </tr>
  );
}