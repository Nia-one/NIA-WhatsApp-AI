import RevenueChart from "../../components/dashboard/RevenueChart";
import { useSalesTrend } from "../../hooks/useReports";
import ExportButtons from "../../components/common/ExportButtons";


export default function SalesReportPage() {

  const {
    data: salesTrend = [],
    isLoading,
    error,
  } = useSalesTrend();


  if (isLoading) {
    return (
      <div className="p-6 text-xl font-semibold">
        Loading Sales Report...
      </div>
    );
  }


  if (error) {
    return (
      <div className="p-6 text-red-600">
        Failed to load Sales Report.
      </div>
    );
  }


  return (

    <div className="space-y-8 p-6">


      <div className="rounded-3xl bg-white p-8 shadow-sm">

    <div className="flex justify-between items-center">

        <div>

            <h1 className="text-3xl font-bold text-slate-800">
                Sales Report
            </h1>

            <p className="mt-2 text-slate-500">
                Sales performance and trends.
            </p>

        </div>


       <ExportButtons report="sales" />

    </div>

</div>


      <RevenueChart
        data={salesTrend}
      />


    </div>

  );
}