import TopProductsTable from "../../components/dashboard/TopProductsTable";
import { useTopProducts } from "../../hooks/useReports";
import ExportButtons from "../../components/common/ExportButtons";

export default function ProductsReportPage() {

  const {
    data: topProducts = [],
    isLoading,
    error,
  } = useTopProducts();


  if (isLoading) {
    return (
      <div className="p-6 text-xl font-semibold">
        Loading Products Report...
      </div>
    );
  }


  if (error) {
    return (
      <div className="p-6 text-red-600">
        Failed to load Products Report.
      </div>
    );
  }


  return (

    <div className="space-y-8 p-6">


      <div className="rounded-3xl bg-white p-8 shadow-sm">

    <div className="flex justify-between items-center">

        <div>

            <h1 className="text-3xl font-bold text-slate-800">
                Products Report
            </h1>

            <p className="mt-2 text-slate-500">
                Product catalogue and performance insights.
            </p>

        </div>


        <ExportButtons report="products" />

    </div>

</div>


      <TopProductsTable
        data={topProducts}
      />


    </div>

  );
}