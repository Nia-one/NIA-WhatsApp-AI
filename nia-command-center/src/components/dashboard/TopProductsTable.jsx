export default function TopProductsTable({ data = [] }) {

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">

      <div className="mb-6">

        <h2 className="text-xl font-semibold text-slate-800">
          Top Products
        </h2>

        <p className="text-sm text-slate-500">
          Best performing products by sales
        </p>

      </div>


      <div className="overflow-x-auto">

        <table className="w-full text-left">

          <thead>

            <tr className="border-b text-sm text-slate-500">

              <th className="pb-3">
                Product
              </th>

              <th className="pb-3">
                Qty Sold
              </th>

              <th className="pb-3">
                Revenue
              </th>

              <th className="pb-3">
                Profit
              </th>

              <th className="pb-3">
                Margin
              </th>

            </tr>

          </thead>


          <tbody>

            {data.map((item) => (

              <tr
                key={item.product_code}
                className="border-b last:border-none"
              >

                <td className="py-4 font-medium text-slate-800">
                  {item.product_name}
                </td>


                <td className="py-4">
                  {item.total_quantity}
                </td>


                <td className="py-4">
                  ₹{item.total_revenue.toLocaleString("en-IN")}
                </td>


                <td className="py-4 text-green-600">
                  ₹{item.gross_profit.toLocaleString("en-IN")}
                </td>


                <td className="py-4">
                  {item.gross_margin}%
                </td>


              </tr>

            ))}

          </tbody>


        </table>

      </div>


    </div>
  );
}