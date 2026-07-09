import { TrendingUp, TrendingDown } from "lucide-react";

export default function KpiCard({
  title,
  value,
  change,
  positive = true,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {value}
          </h2>
        </div>

        <div className="rounded-xl bg-blue-50 p-3">
          <Icon className="text-blue-600" size={26} />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2">
        {positive ? (
          <TrendingUp size={18} className="text-green-600" />
        ) : (
          <TrendingDown size={18} className="text-red-600" />
        )}

        <span
          className={`font-semibold ${
            positive ? "text-green-600" : "text-red-600"
          }`}
        >
          {change}
        </span>

        <span className="text-sm text-slate-400">
          vs yesterday
        </span>
      </div>
    </div>
  );
}