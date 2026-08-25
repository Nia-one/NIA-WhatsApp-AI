import OrderStatusChart from "../../components/dashboard/OrderStatusChart";
import { useOrderStatusAnalytics } from "../../hooks/useReports";
import ExportButtons from "../../components/common/ExportButtons";
import { useOrders } from "../../hooks/useOrders";


export default function OrdersReportPage() {

  const {
    data: orderStatus = [],
    isLoading,
    error,
  } = useOrderStatusAnalytics();
  const { data: ordersData, isLoading: ordersLoading } = useOrders({ limit: 100 });
  const orders = ordersData?.orders ?? [];


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

      <div className="overflow-x-auto rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-slate-800">Customer and Retailer Attribution</h2>
        {ordersLoading ? <p>Loading attribution...</p> : (
          <table className="min-w-full text-left text-sm">
            <thead><tr className="border-b text-slate-500">
              <th className="p-3">Order</th><th className="p-3">Source</th>
              <th className="p-3">Customer</th><th className="p-3">Customer Mobile</th>
              <th className="p-3">Placed By</th><th className="p-3">Retailer Mobile</th>
              <th className="p-3">Total</th><th className="p-3">Status</th>
            </tr></thead>
            <tbody>{orders.map(order => <tr key={order.id} className="border-b last:border-0">
              <td className="p-3 font-medium">{order.order_number}</td>
              <td className="p-3">{order.order_source === "RETAILER" ? "Retailer" : "Direct Customer"}</td>
              <td className="p-3">{order.customer_name}</td><td className="p-3">{order.customer_mobile}</td>
              <td className="p-3">{order.placed_by_name || order.customer_name}</td>
              <td className="p-3">{order.placed_by_mobile || order.customer_mobile}</td>
              <td className="p-3">₹{Number(order.grand_total || 0).toLocaleString("en-IN")}</td>
              <td className="p-3">{order.order_status}</td>
            </tr>)}</tbody>
          </table>
        )}
      </div>


    </div>

  );
}
