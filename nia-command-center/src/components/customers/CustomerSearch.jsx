import { Search } from "lucide-react";

export default function CustomerSearch({
  value,
  onChange,
}) {
  return (
    <div className="relative">

      <Search
        className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        placeholder="Search customer..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-80 rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-500"
      />

    </div>
  );
}