export default function FinancialCard({ product }) {
  const mrp = Number(product.product_master?.mrp || 0);
  const niaPrice = Number(product.product_master?.nia_price || 0);
  const purchaseRate = Number(product.product_master?.purchase_rate || 0);
  const stock = Number(product.available_stock || 0);

  const margin = niaPrice - purchaseRate;

  const marginPercent =
    niaPrice > 0
      ? ((margin / niaPrice) * 100).toFixed(1)
      : 0;

  const inventoryValue = purchaseRate * stock;

  const potentialRevenue = niaPrice * stock;

  const potentialProfit = margin * stock;

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">

      <h3 className="mb-4 text-lg font-semibold">
        Financial Summary
      </h3>

      <div className="space-y-3">

        <div className="flex justify-between">
          <span>Purchase Rate</span>
          <span className="font-semibold">
            ₹{purchaseRate}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Selling Price</span>
          <span className="font-semibold text-green-600">
            ₹{niaPrice}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Gross Margin</span>
          <span className="font-semibold text-blue-600">
            ₹{margin}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Margin %</span>
          <span className="font-semibold text-indigo-600">
            {marginPercent}%
          </span>
        </div>

        <hr />

        <div className="flex justify-between">
          <span>Inventory Value</span>
          <span className="font-semibold">
            ₹{inventoryValue.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Potential Revenue</span>
          <span className="font-semibold text-green-600">
            ₹{potentialRevenue.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Potential Profit</span>
          <span className="font-semibold text-blue-600">
            ₹{potentialProfit.toLocaleString()}
          </span>
        </div>

      </div>

    </div>
  );
}