export default function Pagination({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
}) {
  const startRecord =
    totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const endRecord = Math.min(
    currentPage * pageSize,
    totalRecords
  );

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">

      <p className="text-sm text-slate-500">
        Showing <strong>{startRecord}</strong> - <strong>{endRecord}</strong> of{" "}
        <strong>{totalRecords}</strong> records
      </p>

      <div className="flex items-center gap-2">

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg border disabled:opacity-40 hover:bg-slate-100"
        >
          Previous
        </button>

        {Array.from(
          { length: totalPages },
          (_, i) => i + 1
        ).map((page) => (

          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "border hover:bg-slate-100"
            }`}
          >
            {page}
          </button>

        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg border disabled:opacity-40 hover:bg-slate-100"
        >
          Next
        </button>

      </div>

    </div>
  );
}