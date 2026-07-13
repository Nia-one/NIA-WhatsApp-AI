import {
  Shield,
  CheckCircle2,
  Eye,
  XCircle,
  Users,
  Lock,
  Key,
} from "lucide-react";

const roles = [
  {
    role: "Admin",
    description: "Complete access to all modules.",
    permissions: ["✓","✓","✓","✓","✓","✓","✓","✓","✓"],
  },
  {
    role: "Operations",
    description: "Manage day-to-day business operations.",
    permissions: ["✓","✓","✓","✓","✓","✓","✓","✓","✗"],
  },
  {
    role: "Founder",
    description: "View business performance and reports.",
    permissions: ["👁","👁","👁","👁","👁","👁","✓","✗","✗"],
  },
  {
    role: "Analytics",
    description: "Access dashboard insights and reports only.",
    permissions: ["✓","✗","✗","✗","✗","✗","✓","✗","✗"],
  },
];

const modules = [
  "Dashboard",
  "Orders",
  "Inventory",
  "Customers",
  "Guests",
  "Studios",
  "Reports",
  "Notifications",
  "Settings",
];

export default function RolesPage() {
  return (
    <div className="space-y-8 p-6">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Roles & Permissions
        </h1>

        <p className="mt-2 text-slate-500">
          Role Based Access Control (RBAC) configuration for the NIA Command Center.
        </p>
      </div>

      {/* KPI Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Roles</p>
              <h2 className="mt-2 text-3xl font-bold">4</h2>
            </div>

            <Users className="text-blue-600" size={32}/>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Full Access</p>
              <h2 className="mt-2 text-3xl font-bold">1</h2>
            </div>

            <Shield className="text-green-600" size={32}/>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Restricted Roles</p>
              <h2 className="mt-2 text-3xl font-bold">3</h2>
            </div>

            <Lock className="text-orange-500" size={32}/>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Permission Model</p>
              <h2 className="mt-2 text-2xl font-bold">RBAC</h2>
            </div>

            <Key className="text-purple-600" size={32}/>
          </div>
        </div>

      </div>

      {/* Permission Matrix */}

      <div className="overflow-auto rounded-2xl bg-white shadow-sm">

        <table className="min-w-full border-collapse">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-5 py-4 text-left font-semibold">
                Role
              </th>

              {modules.map((module) => (
                <th
                  key={module}
                  className="px-4 py-4 text-center text-sm font-semibold"
                >
                  {module}
                </th>
              ))}

            </tr>

          </thead>

          <tbody>

            {roles.map((role) => (

              <tr
                key={role.role}
                className="border-t hover:bg-slate-50"
              >

                <td className="px-5 py-5">

                  <div className="font-semibold">
                    {role.role}
                  </div>

                  <div className="text-sm text-slate-500">
                    {role.description}
                  </div>

                </td>

                {role.permissions.map((permission, index) => (

                  <td
                    key={index}
                    className="text-center text-lg"
                  >

                    {permission === "✓" && (
                      <CheckCircle2
                        className="mx-auto text-green-600"
                        size={20}
                      />
                    )}

                    {permission === "👁" && (
                      <Eye
                        className="mx-auto text-blue-600"
                        size={20}
                      />
                    )}

                    {permission === "✗" && (
                      <XCircle
                        className="mx-auto text-red-500"
                        size={20}
                      />
                    )}

                  </td>

                ))}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Legend */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <h3 className="mb-5 text-lg font-semibold">
          Permission Legend
        </h3>

        <div className="grid gap-4 md:grid-cols-3">

          <div className="flex items-center gap-3">

            <CheckCircle2
              className="text-green-600"
              size={20}
            />

            <span>Full Access</span>

          </div>

          <div className="flex items-center gap-3">

            <Eye
              className="text-blue-600"
              size={20}
            />

            <span>View Only</span>

          </div>

          <div className="flex items-center gap-3">

            <XCircle
              className="text-red-500"
              size={20}
            />

            <span>No Access</span>

          </div>

        </div>

      </div>

    </div>
  );
}