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