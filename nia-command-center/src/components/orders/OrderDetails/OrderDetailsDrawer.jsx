import { useState } from "react";
import { X } from "lucide-react";

import CustomerCard from "./CustomerCard";
import OrderInfoCard from "./OrderInfoCard";
import ProductsCard from "./ProductsCard";
import PaymentCard from "./PaymentCard";
import DeliveryCard from "./DeliveryCard";
import TimelineCard from "./TimelineCard";
import ActionButtons from "./ActionButtons";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { normalizeOrder } from "./orderHelpers";

export default function OrderDetailsDrawer({
  open,
  onClose,
  order,
  onStatusChange,
  loading = false,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  if (!open || !order) return null;

  // Normalize backend response once
  const data = normalizeOrder(order);

  const statusLabels = {
    confirmed: "Confirm",
    packed: "Pack",
    shipped: "Ship",
    delivered: "Deliver",
    cancelled: "Cancel",
  };

  const handleActionClick = (status) => {
    setPendingStatus(status);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);

    if (pendingStatus) {
      onStatusChange(order.id, pendingStatus);
    }

    setPendingStatus(null);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setPendingStatus(null);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-screen w-[560px] flex-col border-l border-slate-200 bg-slate-50 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b bg-white px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Order Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {data.orderNumber}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            <CustomerCard order={data} />

            <OrderInfoCard order={data} />

            <ProductsCard order={data} />

            <PaymentCard order={data} />

            <DeliveryCard order={data} />

            <TimelineCard order={data} />
          </div>
        </div>

        {/* Footer Actions */}
        <ActionButtons
          order={data}
          loading={loading}
          onStatusChange={handleActionClick}
        />
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={showConfirm}
        loading={loading}
        title="Confirm Status Change"
        message={`Are you sure you want to mark this order as ${
          statusLabels[pendingStatus] || pendingStatus
        }?`}
        confirmText={statusLabels[pendingStatus] || "Confirm"}
        cancelText="Cancel"
        confirmColor={
          pendingStatus === "cancelled"
            ? "bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700"
        }
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}