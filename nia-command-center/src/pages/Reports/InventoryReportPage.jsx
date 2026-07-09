import InventoryAnalytics from "../../components/dashboard/InventoryAnalytics";
import ExportButtons from "../../components/common/ExportButtons";
import {
  useInventoryAnalytics,
} from "../../hooks/useReports";


export default function InventoryReportPage() {

  const {
    data: inventoryAnalytics = {},
    isLoading,
    error,
  } = useInventoryAnalytics();


  if (isLoading) {
    return (
      <div className="p-6 text-xl font-semibold">
        Loading Inventory Report...
      </div>
    );
  }


  if (error) {
    return (
      <div className="p-6 text-red-600">
        Failed to load Inventory Report.
      </div>
    );
  }


  return (
    <div className="space-y-8 p-6">


      {/* Header */}

      <div className="rounded-3xl bg-white p-8 shadow-sm">

    <div className="flex justify-between items-center">

        <div>

            <h1 className="text-3xl font-bold text-slate-800">
                Inventory Report
            </h1>

            <p className="mt-2 text-slate-500">
                Stock availability and inventory insights.
            </p>

        </div>


        <ExportButtons report="inventory" />

    </div>

</div>


      {/* Inventory Analytics */}

      <InventoryAnalytics
        data={inventoryAnalytics}
      />


    </div>
  );
}