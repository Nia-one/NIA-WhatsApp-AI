import {
  MapPin,
  Home,
  Building2,
  Landmark,
} from "lucide-react";

export default function CustomerAddressCard({
  customer,
}) {

  if (!customer) return null;

  const address =
    customer.delivery_address ||
    customer.address ||
    null;

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <div className="mb-5 flex items-center gap-2">

        <MapPin className="h-5 w-5 text-red-500" />

        <h3 className="text-lg font-semibold">
          Delivery Address
        </h3>

      </div>

      {!address ? (

        <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center">

          <MapPin className="mx-auto mb-3 h-10 w-10 text-slate-300" />

          <p className="text-sm text-slate-500">
            Delivery address not available.
          </p>

        </div>

      ) : (

        <div className="space-y-5">

          <div className="flex gap-3">

            <Home className="mt-1 h-5 w-5 text-blue-600" />

            <div>

              <p className="text-xs text-slate-500">
                Address
              </p>

              <p className="font-medium">
                {address.address_line_1 || "-"}
              </p>

              {address.address_line_2 && (
                <p className="text-sm text-slate-500">
                  {address.address_line_2}
                </p>
              )}

            </div>

          </div>

          <div className="flex gap-3">

            <Building2 className="mt-1 h-5 w-5 text-green-600" />

            <div>

              <p className="text-xs text-slate-500">
                City
              </p>

              <p className="font-medium">
                {address.city || "-"}
              </p>

            </div>

          </div>

          <div className="flex gap-3">

            <Landmark className="mt-1 h-5 w-5 text-purple-600" />

            <div>

              <p className="text-xs text-slate-500">
                State / PIN
              </p>

              <p className="font-medium">
                {address.state || "-"}{" "}
                {address.pincode || ""}
              </p>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}