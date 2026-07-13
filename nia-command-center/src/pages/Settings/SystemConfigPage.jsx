import {
  Server,
  Database,
  Globe,
  MessageCircle,
  Settings,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function SystemConfigPage() {
  return (
    <div className="space-y-8 p-6">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          System Configuration
        </h1>

        <p className="mt-2 text-slate-500">
          Application configuration, integrations and environment details.
        </p>
      </div>

      {/* Status Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Environment
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Production
              </h2>
            </div>

            <Server className="text-blue-600" size={30} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Database
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Supabase
              </h2>
            </div>

            <Database className="text-green-600" size={30} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                WhatsApp API
              </p>

              <h2 className="mt-2 text-2xl font-bold text-green-600">
                Connected
              </h2>
            </div>

            <MessageCircle className="text-green-600" size={30} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Scheduler
              </p>

              <h2 className="mt-2 text-2xl font-bold text-green-600">
                Running
              </h2>
            </div>

            <Settings className="text-purple-600" size={30} />
          </div>
        </div>

      </div>

      {/* Configuration Form */}

      <div className="rounded-2xl bg-white p-8 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold">
          Application Settings
        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Company Name
            </label>

            <input
              className="w-full rounded-xl border p-3"
              defaultValue="NIA Essentials"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Support Email
            </label>

            <input
              className="w-full rounded-xl border p-3"
              defaultValue="support@nia.one"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Support Phone
            </label>

            <input
              className="w-full rounded-xl border p-3"
              defaultValue="+91 XXXXX XXXXX"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Currency
            </label>

            <input
              className="w-full rounded-xl border p-3"
              defaultValue="INR"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              GST (%)
            </label>

            <input
              className="w-full rounded-xl border p-3"
              defaultValue="18"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Delivery Charge (₹)
            </label>

            <input
              className="w-full rounded-xl border p-3"
              defaultValue="0"
            />
          </div>

        </div>

        <button
          className="mt-8 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
        >
          <Save size={18} />
          Save Configuration
        </button>

      </div>

      {/* Integrations */}

      <div className="rounded-2xl bg-white p-8 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold">
          Connected Integrations
        </h2>

        <div className="space-y-5">

          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <Globe className="text-blue-600" />
              <span>Backend API</span>
            </div>

            <span className="flex items-center gap-2 font-medium text-green-600">
              <CheckCircle2 size={18} />
              Connected
            </span>
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <Database className="text-green-600" />
              <span>Supabase Database</span>
            </div>

            <span className="flex items-center gap-2 font-medium text-green-600">
              <CheckCircle2 size={18} />
              Connected
            </span>
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="text-green-600" />
              <span>WhatsApp Cloud API</span>
            </div>

            <span className="flex items-center gap-2 font-medium text-green-600">
              <CheckCircle2 size={18} />
              Connected
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="text-purple-600" />
              <span>Google Sheets Sync</span>
            </div>

            <span className="flex items-center gap-2 font-medium text-green-600">
              <CheckCircle2 size={18} />
              Enabled
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}