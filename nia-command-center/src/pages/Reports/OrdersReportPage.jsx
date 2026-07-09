import OrderStatusChart from "../../components/dashboard/OrderStatusChart";
import { useOrderStatusAnalytics } from "../../hooks/useReports";
import ExportButtons from "../../components/common/ExportButtons";


export default function OrdersReportPage() {

  const {
    data: orderStatus = [],
    isLoading,
    error,
  } = useOrderStatusAnalytics();


  if (isLoading) {
    return (
      <div className="p-6 text-xl font-semibold">
        Loading Orders Report...
      </div>
    );
  }


  if (error) {
    return (
      <div className="p-6 text-red-600">
        Failed to load Orders Report.
      </div>
    );
  }


  return (

    <div className="space-y-8 p-6">


      <div className="rounded-3xl bg-white p-8 shadow-sm">

    <div className="flex justify-between items-center">

        <div>

            <h1 className="text-3xl font-bold text-slate-800">
                Orders Report
            </h1>

            <p className="mt-2 text-slate-500">
                Order status distribution and performance.
            </p>

        </div>


        <ExportButtons report="orders" />

    </div>

</div>


      <OrderStatusChart
        data={orderStatus}
      />


    </div>

  );
}