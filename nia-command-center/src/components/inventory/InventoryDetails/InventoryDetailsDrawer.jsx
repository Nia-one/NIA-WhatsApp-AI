import { useState } from "react";

import ProductCard from "./ProductCard";
import StockCard from "./StockCard";
import WarehouseCard from "./WarehouseCard";
import StatusCard from "./StatusCard";
import FinancialCard from "./FinancialCard";
import UpdateStockModal from "../UpdateStockModal";
import useUpdateInventory from "../../../hooks/useUpdateInventory";

export default function InventoryDetailsDrawer({
  open,
  onClose,
  product,
}) {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const updateInventory = useUpdateInventory();

  if (!open || !product) return null;
  console.log(JSON.stringify(product, null, 2));

  return (
    <>
      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-screen w-[420px] border-l border-slate-200 bg-slate-50 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b bg-white p-6">

          <h2 className="text-xl font-bold">
            Inventory Details
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 transition hover:bg-slate-100"
          >
            ✕
          </button>

        </div>

        {/* Content */}
        <div className="flex h-[calc(100vh-80px)] flex-col overflow-y-auto p-6 space-y-6">

          <ProductCard product={product} />

          <StockCard product={product} />

          <FinancialCard product={product} />

          <WarehouseCard product={product} />

          <StatusCard
  product={product}
  onUpdateStock={() => setOpenUpdateModal(true)}
/>

          

        </div>

      </div>

      {/* Update Stock Modal */}
      <UpdateStockModal
        open={openUpdateModal}
        product={product}
        loading={updateInventory.isPending}
        onClose={() => setOpenUpdateModal(false)}
        onSubmit={(payload) => {
  updateInventory.mutate(
    {
      productId: product.id,
      payload,
    },
    {
      onSuccess: () => {
        setOpenUpdateModal(false);
      },
    }
  );
}}
      />
    </>
  );
}