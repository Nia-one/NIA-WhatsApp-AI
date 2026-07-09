import { Building2, ShoppingBag, IndianRupee } from "lucide-react";

export default function StudioAnalytics({ data = [] }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Studio Analytics
        </h2>

        <p className="text-slate-500">
          Studio-wise sales performance.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr className="text-left text-slate-600">
              <th className="py-3">Studio</th>
              <th className="py-3">Orders</th>
              <th className="py-3">Revenue</th>
            </tr>
          </thead>

          <tbody>
            {data.map((studio, index) => (
              <tr
                key={index}
                className="border-b hover:bg-slate-50 transition"
              >
                <td className="py-4 flex items-center gap-2">
                  <Building2 size={18} className="text-blue-600" />
                  {studio.studio_name || studio.studio_id}
                </td>

                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={16} />
                    {studio.total_orders}
                  </div>
                </td>

                <td className="py-4">
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <IndianRupee size={16} />
                    {Number(studio.total_revenue).toLocaleString("en-IN")}
                  </div>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="py-8 text-center text-slate-400"
                >
                  No studio data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}