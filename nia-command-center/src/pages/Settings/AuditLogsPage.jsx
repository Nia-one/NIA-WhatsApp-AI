import {
  ClipboardList,
  Search,
  Filter,
  ShieldCheck,
  Clock,
} from "lucide-react";

const auditLogs = [];

export default function AuditLogsPage() {
  return (
    <div className="space-y-8 p-6">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Audit Logs
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor user activities and system changes across the NIA Command Center.
        </p>
      </div>

      {/* KPI Cards */}

      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Logs
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {auditLogs.length}
              </h2>
            </div>

            <ClipboardList
              className="text-blue-600"
              size={30}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Security Events
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                0
              </h2>
            </div>

            <ShieldCheck
              className="text-green-600"
              size={30}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Last Activity
              </p>

              <h2 className="mt-2 text-xl font-bold">
                --
              </h2>
            </div>

            <Clock
              className="text-orange-500"
              size={30}
            />
          </div>
        </div>

      </div>

      {/* Search */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 md:w-96">

            <Search size={18} />

            <input
              placeholder="Search audit logs..."
              className="w-full outline-none"
            />

          </div>

          <button className="flex items-center gap-2 rounded-xl border px-5 py-3 transition hover:bg-slate-50">

            <Filter size={18} />

            Filter

          </button>

        </div>

      </div>

      {/* Audit Table */}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-5 py-4 text-left">Date</th>

              <th className="text-left">User</th>

              <th className="text-left">Module</th>

              <th className="text-left">Action</th>

              <th className="text-left">Status</th>

            </tr>

          </thead>

          <tbody>

            {auditLogs.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="py-16"
                >

                  <div className="flex flex-col items-center justify-center">

                    <ClipboardList
                      size={56}
                      className="mb-5 text-slate-300"
                    />

                    <h3 className="text-xl font-semibold text-slate-700">
                      No Audit Logs Available
                    </h3>

                    <p className="mt-3 max-w-md text-center text-sm leading-6 text-slate-500">
                      Audit logging is enabled.
                      <br />
                      New user activities, order updates and system changes
                      will automatically appear here once they occur.
                    </p>

                  </div>

                </td>

              </tr>

            ) : (

              auditLogs.map((log) => (

                <tr
                  key={log.id}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="px-5 py-4">{log.date}</td>
                  <td>{log.user}</td>
                  <td>{log.module}</td>
                  <td>{log.action}</td>
                  <td>{log.status}</td>
                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}