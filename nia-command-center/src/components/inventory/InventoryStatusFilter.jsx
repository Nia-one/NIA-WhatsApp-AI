export default function InventoryStatusFilter({
  value,
  onChange,
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
    >
      <option value="">All Status</option>
      <option value="In Stock">In Stock</option>
      <option value="Low Stock">Low Stock</option>
      <option value="Out Of Stock">Out Of Stock</option>
    </select>
  );
}