export default function InventoryTable({
  products,
  onView,
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

      <table className="min-w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Product
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              SKU
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Category
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Available
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Reorder Level
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Status
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {products.map((product) => (

            <tr
              key={product.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="px-6 py-4 font-medium">
                {product.product_name}
              </td>

              <td className="px-6 py-4">
  {product.product_master?.sku || "-"}
</td>

              <td className="px-6 py-4">
  {product.product_master?.category || "-"}
</td>

              <td className="px-6 py-4">
                {product.available_stock}
              </td>

              <td className="px-6 py-4">
                {product.reorder_level}
              </td>

              <td className="px-6 py-4">

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">

                  In Stock

                </span>

              </td>

              <td className="px-6 py-4">

                <button
  onClick={() => onView(product)}
  className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
>
  View
</button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}