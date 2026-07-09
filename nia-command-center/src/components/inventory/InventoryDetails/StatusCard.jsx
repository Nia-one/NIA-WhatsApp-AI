export default function StatusCard({
  product,
  onUpdateStock,
}) {
  const status = product.inventory_status || "Unknown";

  const color =
    status === "In Stock"
      ? "bg-green-100 text-green-700"
      : status === "Low Stock"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">

      {/* Heading */}
      <h3 className="mb-4 text-lg font-semibold">
        Inventory Status
      </h3>

      {/* Status Badge */}
      <span
        className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${color}`}
      >
        {status}
      </span>

      {/* Update Stock Button */}
      <button
        type="button"
        onClick={onUpdateStock}
        className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        Update Stock
      </button>

    </div>
  );
}