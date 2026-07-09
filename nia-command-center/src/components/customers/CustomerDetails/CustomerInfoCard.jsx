import {
  User,
  Phone,
  Languages,
  Calendar,
} from "lucide-react";

export default function CustomerInfoCard({
  customer,
}) {
  if (!customer) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <h3 className="mb-5 text-lg font-semibold">
        Customer Information
      </h3>

      <div className="space-y-4">

        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-xs text-slate-500">Customer Name</p>
            <p className="font-medium">
              {customer.customer_name || "Guest Customer"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-xs text-slate-500">Mobile Number</p>
            <p className="font-medium">
              {customer.mobile_number}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Languages className="h-5 w-5 text-purple-600" />
          <div>
            <p className="text-xs text-slate-500">Language</p>
            <p className="font-medium">
              {customer.preferred_language || "English"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-orange-600" />
          <div>
            <p className="text-xs text-slate-500">Customer Since</p>
            <p className="font-medium">
              {new Date(customer.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}