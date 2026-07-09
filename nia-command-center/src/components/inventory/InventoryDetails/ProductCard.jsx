export default function ProductCard({ product }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <h3 className="mb-4 text-lg font-semibold">
        Product Details
      </h3>

      <div className="space-y-4">

        <div>
          <p className="text-sm text-slate-500">
            Product Name
          </p>

          <p className="font-semibold">
            {product.product_name}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Product Code
          </p>

          <p>{product.product_code}</p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Brand
          </p>

          <p>{product.product_master?.brand || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Category
          </p>

          <p>{product.product_master?.category || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            SKU
          </p>

          <p>{product.product_master?.sku || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Unit
          </p>

          <p>{product.product_master?.unit || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Product ID
          </p>

          <p className="break-all text-sm">
            {product.product_id}
          </p>
        </div>

      </div>

    </div>
  );
}