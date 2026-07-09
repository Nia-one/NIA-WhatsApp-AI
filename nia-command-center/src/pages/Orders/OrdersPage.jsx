import { useOrders } from "../../hooks/useOrders";
import OrdersTable from "../../components/orders/OrdersTable";
import OrderSearch from "../../components/orders/OrderSearch";
import OrderFilters from "../../components/orders/OrderFilters";
import { useState } from "react";
import OrderDetailsDrawer from "../../components/orders/OrderDetails/OrderDetailsDrawer";

export default function OrdersPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");

    const [selectedOrder, setSelectedOrder] = useState(null);
const [drawerOpen, setDrawerOpen] = useState(false);

const handleStatusChange = async (orderId, status) => {
  try {
    console.log("================================");
    console.log("STATUS UPDATE START");
    console.log("Order ID:", orderId);
    console.log("New Status:", status);

    const result = await updateOrderStatus({
      orderId,
      status,
    });

    console.log("Update API Response:");
    console.log(result);

    const updatedOrder = await getOrderDetails(orderId);

    console.log("Updated Order:");
    console.log(updatedOrder);

    setSelectedOrder(updatedOrder);

    console.log("STATUS UPDATE COMPLETE");
    console.log("================================");
  } catch (err) {
    console.error("STATUS UPDATE FAILED");
    console.error(err);
  }
};

const clearFilters = () => {
  setSearch("");
  setStatus("");
  setFromDate("");
  setToDate("");
};

  const {
  data,
  isLoading,
  error,
  getOrderDetails,
  updateOrderStatus,
  isUpdatingStatus,
} = useOrders({
  search,
  status,
  fromDate,
  toDate,
});

console.log("Orders from API", data?.orders);

console.log("Search:", search);

  const filteredOrders = (data?.orders ?? []).filter((order) => {

  const searchText = search.toLowerCase();

  const matchesSearch =
    order.order_number?.toLowerCase().includes(searchText) ||
    order.customer_name?.toLowerCase().includes(searchText) ||
    order.customer_mobile?.includes(search);

  const matchesStatus =
  status === "" ||
  (order.order_status || "").toLowerCase() ===
    status.toLowerCase();

  return matchesSearch && matchesStatus;

});

console.log("Orders from API", data?.orders);
console.log("Search:", search);
console.log("Filtered Orders:", filteredOrders);

  if (isLoading) {
    return (
      <div className="p-10 text-xl font-semibold">
        Loading Orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-red-600">
        Failed to load orders.
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-bold">
          Orders
        </h2>

        <p className="mt-2 text-slate-500">
          Manage customer orders.
        </p>
      </div>

      {/* Toolbar */}
<div className="mb-6 flex flex-wrap items-center gap-4">

  <OrderSearch
    value={search}
    onChange={setSearch}
  />

  <OrderFilters
    value={status}
    onChange={setStatus}
  />

  {/* From Date */}
  <input
    type="date"
    value={fromDate}
    onChange={(e) => setFromDate(e.target.value)}
    className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
  />

  {/* To Date */}
  <input
    type="date"
    value={toDate}
    onChange={(e) => setToDate(e.target.value)}
    className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
  />

  <button
  onClick={clearFilters}
  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
>
  Clear Filters
</button>

</div>



{/* Orders Table */}
<OrdersTable
  orders={filteredOrders}
  onRowClick={async (order) => {
  try {
    const fullOrder = await getOrderDetails(order.id);
    console.log("FULL ORDER", fullOrder);

    setSelectedOrder(fullOrder);

    setDrawerOpen(true);
  } catch (err) {
    console.error(err);
  }
}}
/>
  
  <OrderDetailsDrawer
  open={drawerOpen}
  order={selectedOrder}
  onClose={() => setDrawerOpen(false)}
  onStatusChange={handleStatusChange}
  loading={isUpdatingStatus}
/>

    </div>
  );
}