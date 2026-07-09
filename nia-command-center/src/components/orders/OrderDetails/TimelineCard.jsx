import { CheckCircle2, Circle } from "lucide-react";

const STEPS = [
  { key: "pending", label: "Order Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

export default function TimelineCard({ order }) {
  if (!order) return null;

  const currentStatus = (order.status || "pending").toLowerCase();

  let currentIndex = STEPS.findIndex(
    (step) => step.key === currentStatus
  );

  if (currentIndex === -1) {
    currentIndex = 0;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          Timeline
        </h3>
      </div>

      <div className="space-y-5">
        {STEPS.map((step, index) => {
          const completed = index <= currentIndex;

          return (
            <div
              key={step.key}
              className="flex items-start gap-3"
            >
              <div className="flex flex-col items-center">
                {completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-300" />
                )}

                {index !== STEPS.length - 1 && (
                  <div
                    className={`mt-1 h-8 w-px ${
                      completed
                        ? "bg-emerald-400"
                        : "bg-slate-200"
                    }`}
                  />
                )}
              </div>

              <div>
                <p
                  className={`font-medium ${
                    completed
                      ? "text-slate-900"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>

                {completed && (
                  <p className="text-xs text-emerald-600">
                    Completed
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}