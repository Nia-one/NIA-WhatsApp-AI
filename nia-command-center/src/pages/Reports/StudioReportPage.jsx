import StudioAnalytics from "../../components/dashboard/StudioAnalytics";

import {
  useStudioAnalytics,
} from "../../hooks/useReports";

export default function StudioReportPage() {

  const {
    data: studioAnalytics = [],
    isLoading,
    error,
  } = useStudioAnalytics();

  console.log(
  "Studio Analytics Data:",
  studioAnalytics
);

  if (isLoading) {
    return (
      <div className="p-6 text-xl font-semibold">
        Loading Studio Report...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Failed to load Studio Report.
      </div>
    );
  }

  return (

    <div className="space-y-8 p-6">

      {/* Header */}

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <h1 className="text-3xl font-bold text-slate-800">
          Studio Report
        </h1>

        <p className="mt-2 text-slate-500">
          Studio-wise revenue and order performance.
        </p>

      </div>

      {/* Studio Analytics */}

      <StudioAnalytics
        data={studioAnalytics}
      />

    </div>

  );
}