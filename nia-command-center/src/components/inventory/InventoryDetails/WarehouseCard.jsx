export default function WarehouseCard({ product }) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">

      <h3 className="mb-4 text-lg font-semibold">
        Warehouse Details
      </h3>

      <div className="space-y-3">

        <div>
          <p className="text-sm text-slate-500">
            Warehouse
          </p>

          <p className="font-medium">
            {product.warehouse_location}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Last Updated
          </p>

          <p>
            {new Date(product.last_stock_update).toLocaleString()}
          </p>
        </div>

      </div>

    </div>
  );
}