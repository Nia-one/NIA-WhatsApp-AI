import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function UpdateStockModal({
  open,
  onClose,
  product,
  onSubmit,
  loading = false,
}) {
  const [newStock, setNewStock] = useState(0);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (product) {
      setNewStock(0);
      setReason("");
    }
  }, [product]);

  if (!open || !product) return null;

  console.log(product);

  const currentStock = Number(product.available_stock || 0);
const addStock = Number(newStock || 0);
const updatedStock = currentStock + addStock;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      stock: addStock,
      reason,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-4">

          <h2 className="text-lg font-semibold">
            Update Stock
          </h2>

          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-slate-100"
          >
            <X size={18} />
          </button>

        </div>

        {/* Body */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          {/* Product Name */}

          <div>

            <label className="mb-1 block text-sm font-medium">
              Product Name
            </label>

            <input
              type="text"
              value={product.product_name}
              readOnly
              className="w-full rounded-lg border bg-slate-100 px-3 py-2"
            />

          </div>

          {/* Current Stock */}

          <div>

            <label className="mb-1 block text-sm font-medium">
              Current Stock
            </label>

            <input
              type="number"
              value={currentStock}
              readOnly
              className="w-full rounded-lg border bg-slate-100 px-3 py-2"
            />

          </div>

          {/* Add Stock */}

          <div>

            <label className="mb-1 block text-sm font-medium">
  Add Stock
</label>

            <input
              type="number"
              min="0"
              required
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Stock Difference */}


          {/* New Stock Preview */}

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">

            <div className="flex items-center justify-between">

              <span className="text-sm text-slate-600">
                New Stock (After Update)
              </span>

              <span className="text-lg font-semibold text-green-600">
                {updatedStock}
              </span>

            </div>

          </div>


          {/* Reason */}

          <div>

            <label className="mb-1 block text-sm font-medium">
              Reason (Optional)
            </label>

            <textarea
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Example: Physical stock verification"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Stock"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}