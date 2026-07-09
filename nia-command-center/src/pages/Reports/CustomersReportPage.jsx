import CustomerAnalytics from "../../components/dashboard/CustomerAnalytics";
import { useCustomerAnalytics } from "../../hooks/useReports";
import ExportButtons from "../../components/common/ExportButtons";


export default function CustomersReportPage() {

  const {
    data: customerAnalytics = {},
    isLoading,
    error,
  } = useCustomerAnalytics();


  if (isLoading) {
    return (
      <div className="p-6 text-xl font-semibold">
        Loading Customers Report...
      </div>
    );
  }


  if (error) {
    return (
      <div className="p-6 text-red-600">
        Failed to load Customers Report.
      </div>
    );
  }


  return (

    <div className="space-y-8 p-6">


      <div className="rounded-3xl bg-white p-8 shadow-sm">

    <div className="flex justify-between items-center">

        <div>

            <h1 className="text-3xl font-bold text-slate-800">
              Customers Report
            </h1>

            <p className="mt-2 text-slate-500">
              Customer behaviour and revenue insights.
            </p>

        </div>


        <ExportButtons report="customers" />

    </div>

</div>


      <CustomerAnalytics
        data={customerAnalytics}
      />


    </div>

  );
}