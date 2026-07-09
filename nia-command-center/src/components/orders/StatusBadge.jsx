const statusStyles = {
  pending: "bg-amber-100 text-amber-800",

  confirmed: "bg-blue-100 text-blue-800",

  packed: "bg-indigo-100 text-indigo-800",

  shipped: "bg-purple-100 text-purple-800",

  delivered: "bg-emerald-100 text-emerald-800",

  cancelled: "bg-red-100 text-red-800",
};

export default function StatusBadge({ status = "" }) {
  const normalizedStatus = status.toLowerCase();

  const classes =
    statusStyles[normalizedStatus] ||
    "bg-slate-100 text-slate-700";

  const label =
    normalizedStatus.charAt(0).toUpperCase() +
    normalizedStatus.slice(1);

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {label}
    </span>
  );
}