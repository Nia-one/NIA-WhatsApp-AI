import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "bg-blue-600 hover:bg-blue-700",
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-amber-100 p-3">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-xl font-bold text-slate-900">
          {title}
        </h2>

        {/* Message */}
        <p className="mt-3 text-center text-slate-600">
          {message}
        </p>

        {/* Buttons */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-medium hover:bg-slate-100 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-xl px-4 py-3 font-medium text-white disabled:opacity-50 ${confirmColor}`}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}