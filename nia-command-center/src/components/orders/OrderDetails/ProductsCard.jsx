import { Package2 } from "lucide-react";

export default function ProductsCard({ order }) {
  if (!order) return null;

  const products = order.items || [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Package2 className="h-5 w-5 text-indigo-600" />

        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          Products
        </h3>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          No products found.
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : (
                    <Package2 className="h-7 w-7 text-slate-400" />
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">
                    {item.productName}
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    SKU : {item.productCode}
                  </p>

                  <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500">Qty</p>
                      <p className="font-semibold">
                        {item.quantity}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">Price</p>
                      <p className="font-semibold">
                        ₹{Number(item.price).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">Total</p>
                      <p className="font-semibold text-indigo-600">
                        ₹{Number(item.total).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}