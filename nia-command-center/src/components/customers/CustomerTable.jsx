import {
  Users,
} from "lucide-react";

import CustomerRow from "./CustomerRow";

export default function CustomerTable({
  customers = [],
  onRowClick,
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          {/* Header */}

          <thead className="sticky top-0 bg-slate-100">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-slate-600">
                Customer
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-slate-600">
                Mobile
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-600">
                Orders
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-slate-600">
                Lifetime Value
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-slate-600">
                Last Order
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-slate-600">
                Status
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100">

            {customers.length > 0 ? (

              customers.map((customer) => (

                <CustomerRow
                  key={customer.id}
                  customer={customer}
                  onClick={onRowClick}
                />

              ))

            ) : (

              <tr>

                <td
                  colSpan={6}
                  className="py-16"
                >

                  <div className="flex flex-col items-center justify-center">

                    <Users className="mb-4 h-12 w-12 text-slate-300" />

                    <h3 className="text-lg font-semibold text-slate-700">
                      No Customers Found
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Try changing your search or filters.
                    </p>

                  </div>

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}