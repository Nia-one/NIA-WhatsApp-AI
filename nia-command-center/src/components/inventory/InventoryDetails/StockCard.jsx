export default function StockCard({ product }) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">

      <h3 className="mb-4 text-lg font-semibold">
        Stock Details
      </h3>

      <div className="space-y-3">

        <div className="flex justify-between">
          <span>Total Stock</span>
          <span className="font-semibold">
            {product.total_stock}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Reserved Stock</span>
          <span className="font-semibold">
            {product.reserved_stock}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Available Stock</span>
          <span className="font-semibold text-green-600">
            {product.available_stock}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Reorder Level</span>
          <span className="font-semibold text-orange-500">
            {product.reorder_level}
          </span>
        </div>

        <div className="flex justify-between">
  <span className="text-slate-500">MRP</span>

  <span className="font-medium">
    ₹{product.product_master?.mrp ?? "-"}
  </span>
</div>

<div className="flex justify-between">
  <span className="text-slate-500">NIA Price</span>

  <span className="font-medium text-green-600">
    ₹{product.product_master?.nia_price ?? "-"}
  </span>
</div>

<div className="flex justify-between">
  <span className="text-slate-500">Savings</span>

  <span className="font-medium text-blue-600">
    ₹{product.product_master?.nia_savings ?? "-"}
  </span>
</div>

<div className="flex justify-between">
  <span className="text-slate-500">Purchase Rate</span>

  <span className="font-medium">
    ₹{product.product_master?.purchase_rate ?? "-"}
  </span>
</div>

      </div>

    </div>
  );
}