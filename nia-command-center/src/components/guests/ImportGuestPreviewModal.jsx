const ImportGuestPreviewModal = ({
    isOpen,
    data = [],
    onClose,
    onImport
}) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-[95%] max-w-6xl max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center border-b p-5">

                    <div>
                        <h2 className="text-2xl font-bold">
                            Guest Import Preview
                        </h2>

                        <p className="text-gray-500 mt-1">
                            {data.length} rows ready to import
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-2xl"
                    >
                        ×
                    </button>

                </div>

                {/* Table */}

                <div className="overflow-auto max-h-[60vh]">

                   <table className="w-full text-sm">

    <thead className="bg-gray-100 sticky top-0">

        <tr>

            <th className="p-3 border">#</th>

            {data.length > 0 &&
                Object.keys(data[0]).map((column) => (

                    <th
                        key={column}
                        className="p-3 border text-left whitespace-nowrap"
                    >
                        {column}
                    </th>

                ))}

        </tr>

    </thead>

    <tbody>

        {data.map((row, index) => (

            <tr
                key={index}
                className="border-b"
            >

                <td className="p-3 border">
                    {index + 1}
                </td>

                {Object.keys(row).map((column) => (

                    <td
                        key={column}
                        className="p-3 border whitespace-nowrap"
                    >
                        {String(row[column] ?? "")}
                    </td>

                ))}

            </tr>

        ))}

    </tbody>

</table>

                </div>

                {/* Footer */}

                <div className="border-t p-5 flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="px-5 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onImport}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Import {data.length} Guests
                    </button>

                </div>

            </div>

        </div>
    );

};

export default ImportGuestPreviewModal;