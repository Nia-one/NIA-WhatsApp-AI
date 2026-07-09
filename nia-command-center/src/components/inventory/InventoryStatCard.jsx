export default function InventoryStatCard({
  title,
  value,
  color = "text-slate-800",
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h2 className={`mt-3 text-4xl font-bold ${color}`}>
        {value}
      </h2>

    </div>
  );
}