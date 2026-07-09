import { Search } from "lucide-react";

export default function InventorySearch({
  value,
  onChange,
}) {
  return (
    <div className="relative w-full max-w-md">

      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={20}
      />

      <input
        type="text"
        placeholder="Search by Product Name or Code..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-base outline-none transition focus:border-blue-500"
      />

    </div>
  );
}