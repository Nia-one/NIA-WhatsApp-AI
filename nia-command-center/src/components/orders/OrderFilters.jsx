export default function OrderFilters({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-slate-300 bg-white px-6 py-3 outline-none focus:border-blue-500"
    >
      <option value="">All Status</option>

      <option value="pending">Pending</option>

      <option value="confirmed">Confirmed</option>

      <option value="packed">Packed</option>

      <option value="shipped">Shipped</option>

      <option value="delivered">Delivered</option>

      <option value="cancelled">Cancelled</option>
    </select>
  );
}