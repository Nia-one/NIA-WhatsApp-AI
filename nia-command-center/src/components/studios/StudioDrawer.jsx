import { X, Building2, Landmark, MapPin, Phone, User } from "lucide-react";

export default function StudioDrawer({
  open,
  studio,
  onClose,
}) {
  if (!open || !studio) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-50 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">

          <div>

            <h2 className="text-2xl font-bold">
              Studio Details
            </h2>

            <p className="text-slate-500 text-sm">
              View Studio Information
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={22} />
          </button>

        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          <InfoRow
            icon={<Building2 size={18} />}
            label="Studio Name"
            value={studio.studio_name}
          />

          <InfoRow
            icon={<Building2 size={18} />}
            label="Studio Code"
            value={studio.studio_code}
          />

          <InfoRow
            icon={<Landmark size={18} />}
            label="Theatre"
            value={studio.theatre_name}
          />

          <InfoRow
            icon={<Landmark size={18} />}
            label="Theatre Code"
            value={studio.theatre_code}
          />

          <InfoRow
            icon={<MapPin size={18} />}
            label="City"
            value={studio.city}
          />

          <InfoRow
            icon={<MapPin size={18} />}
            label="State"
            value={studio.state}
          />

          <InfoRow
            icon={<MapPin size={18} />}
            label="Address"
            value={studio.address || "-"}
          />

          <InfoRow
            icon={<User size={18} />}
            label="Contact Person"
            value={studio.contact_person || "-"}
          />

          <InfoRow
            icon={<Phone size={18} />}
            label="Contact Number"
            value={studio.contact_number || "-"}
          />

          <div>

            <p className="text-sm text-slate-500 mb-2">
              Status
            </p>

            {studio.is_active ? (

              <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium">
                Active
              </span>

            ) : (

              <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-medium">
                Inactive
              </span>

            )}

          </div>

        </div>

      </div>
    </>
  );
}

function InfoRow({
  icon,
  label,
  value,
}) {
  return (

    <div className="flex gap-4">

      <div className="mt-1 text-blue-600">
        {icon}
      </div>

      <div>

        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="font-semibold">
          {value}
        </p>

      </div>

    </div>

  );
}