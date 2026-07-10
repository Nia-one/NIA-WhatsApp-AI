import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Download, FileSpreadsheet } from "lucide-react";

export default function ExportButtons({
    data = [],
    fileName = "Export",
}) {

    const exportCSV = () => {

        if (!data.length) return;

        const worksheet = XLSX.utils.json_to_sheet(data);

        const csv = XLSX.utils.sheet_to_csv(worksheet);

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;",
        });

        saveAs(blob, `${fileName}.csv`);

    };

    const exportExcel = () => {

        if (!data.length) return;

        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Data"
        );

        XLSX.writeFile(
            workbook,
            `${fileName}.xlsx`
        );

    };

    return (

        <div className="flex gap-3">

            <button
                onClick={exportCSV}
                className="flex items-center gap-2 rounded-xl bg-slate-700 text-white px-4 py-2 hover:bg-slate-800 transition"
            >
                <Download size={18} />
                Export CSV
            </button>

            <button
                onClick={exportExcel}
                className="flex items-center gap-2 rounded-xl bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition"
            >
                <FileSpreadsheet size={18} />
                Export Excel
            </button>

        </div>

    );

}