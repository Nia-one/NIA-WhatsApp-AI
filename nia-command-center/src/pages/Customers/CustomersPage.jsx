import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getOrderById,
  updateOrderStatus,
} from "../../services/orderService";
import { useCustomers } from "../../hooks/useCustomers";
import CustomerTable from "../../components/customers/CustomerTable";
import CustomerSearch from "../../components/customers/CustomerSearch";
import CustomerKPICards from "../../components/customers/CustomerKPICards";
import CustomerDetailsDrawer from "../../components/customers/CustomerDetails/CustomerDetailsDrawer";
import OrderDetailsDrawer from "../../components/orders/OrderDetails/OrderDetailsDrawer";

export default function CustomersPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
const [drawerOpen, setDrawerOpen] = useState(false);
const [selectedOrder, setSelectedOrder] = useState(null);
const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);

const [currentPage, setCurrentPage] = useState(1);

const ITEMS_PER_PAGE = 10;

const handleOrderClick = async (order) => {
  try {
    const response = await getOrderById(order.id);

    console.log("========== API RESPONSE ==========");
    console.log(response);

    const fullOrder = response.data || response;

    console.log("========== FULL ORDER ==========");
    console.log(fullOrder);

    setSelectedOrder(fullOrder);
    setOrderDrawerOpen(true);
  } catch (error) {
    console.error("Failed to load order details:", error);
  }
};

const handleOrderStatusChange = async (orderId, status) => {
  try {
    // Update order status
    await updateOrderStatus(orderId, status);

    // Reload updated order
    const response = await getOrderById(orderId);

    const fullOrder = response.data || response;

    // Update the Order Details Drawer
    setSelectedOrder(fullOrder);

    // Refresh customer list
    await queryClient.invalidateQueries({
      queryKey: ["customers"],
    });

    console.log("Order status updated successfully.");
  } catch (error) {
    console.error("Failed to update order status:", error);
  }
};

  const {
    data,
    isLoading,
    error,
  } = useCustomers();

  const customers = data ?? [];
  const filteredCustomers = customers.filter((customer) => {

  const searchText = search.toLowerCase();

  const matchesSearch =
    (customer.customer_name || "")
      .toLowerCase()
      .includes(searchText) ||

    (customer.mobile_number || "")
      .includes(search);

  const matchesStatus =
    status === "all" ||
    customer.is_active ===
      (status === "active");

  return matchesSearch && matchesStatus;

});

// Pagination
const totalPages = Math.ceil(
  filteredCustomers.length / ITEMS_PER_PAGE
);

const paginatedCustomers = filteredCustomers.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);

  if (isLoading) {
    return (
      <div className="p-10 text-xl font-semibold">
        Loading Customers...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-red-600">
        Failed to load customers.
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <h2 className="text-3xl font-bold">
          Customers
        </h2>

        <p className="mt-2 text-slate-500">
          Manage customer information.
        </p>

      </div>

<CustomerKPICards customers={customers} />

<div className="mb-6 flex flex-wrap items-center gap-4">

  <CustomerSearch
    value={search}
    onChange={setSearch}
  />

  <select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    className="rounded-xl border border-slate-300 bg-white px-4 py-3"
  >
    <option value="all">
      All Customers
    </option>

    <option value="active">
      Active
    </option>

    <option value="inactive">
      Inactive
    </option>
  </select>

  <button
    onClick={() => {
      setSearch("");
      setStatus("all");
    }}
    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium hover:bg-slate-100"
  >
    Clear Filters
  </button>

</div>

<CustomerTable
  customers={paginatedCustomers}
  onRowClick={(customer) => {
    setSelectedCustomer(customer);
    setDrawerOpen(true);
  }}
/>

{/* Pagination */}
{totalPages > 1 && (
  <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((prev) => prev - 1)}
      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      ← Previous
    </button>

    <div className="text-sm font-semibold text-slate-600">
      Page {currentPage} of {totalPages}
    </div>

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((prev) => prev + 1)}
      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Next →
    </button>

  </div>
)}

<CustomerDetailsDrawer
  open={drawerOpen}
  customer={selectedCustomer}
  onClose={() => setDrawerOpen(false)}
  onOrderClick={handleOrderClick}
/>

<OrderDetailsDrawer
  open={orderDrawerOpen}
  order={selectedOrder}
  onClose={() => {
    setOrderDrawerOpen(false);
    setSelectedOrder(null);
  }}
  onStatusChange={handleOrderStatusChange}
/>

    </div>
  );
}