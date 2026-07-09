import { X, Loader2, AlertCircle } from "lucide-react";

import { useCustomerDetails } from "../../../hooks/useCustomerDetails";

import CustomerInfoCard from "./CustomerInfoCard";
import CustomerStatsCard from "./CustomerStatsCard";
import CustomerOrdersCard from "./CustomerOrdersCard";
import CustomerAddressCard from "./CustomerAddressCard";
import CustomerTimelineCard from "./CustomerTimelineCard";

export default function CustomerDetailsDrawer({
  open,
  customer,
  onClose,
  onOrderClick,
}) {

  const customerId = customer?.id;

  const {
    customer: customerQuery,
    orders,
    stats,
  } = useCustomerDetails(customerId);

  const customerData = customerQuery.data;
  const customerOrders = orders.data || [];
  const customerStats = stats.data;

  const loading =
    customerQuery.isLoading ||
    orders.isLoading ||
    stats.isLoading;

  const error =
    customerQuery.isError ||
    orders.isError ||
    stats.isError;
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-screen w-[500px] overflow-y-auto bg-white shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-6">

          <div>
            <h2 className="text-2xl font-bold">
              Customer Details
            </h2>

            <p className="text-sm text-slate-500">
              Customer profile & history
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X className="h-6 w-6" />
          </button>

        </div>

        {/* Body */}
        <div className="space-y-6 p-6">

  {loading && (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  )}

  {error && (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-6 w-6 text-red-600" />
        <div>
          <h3 className="font-semibold text-red-700">
            Unable to load customer details
          </h3>
          <p className="text-sm text-red-600">
            Please try again.
          </p>
        </div>
      </div>
    </div>
  )}

  {!loading && !error && (
    <>
      <CustomerInfoCard customer={customerData} />

      <CustomerStatsCard stats={customerStats} />

      <CustomerOrdersCard
  orders={customerOrders}
  onOrderClick={onOrderClick}
/>

      <CustomerAddressCard customer={customerData} />

      <CustomerTimelineCard
        customer={customerData}
        stats={customerStats}
      />
    </>
  )}

</div>

      </div>

    </div>
  );
}