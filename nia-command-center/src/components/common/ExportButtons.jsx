import React from "react";
import api from "../../services/api";


const ExportButtons = ({ report }) => {


    const downloadReport = async (type) => {

        try {

            const response = await api.get(
                `/reports/export/${report}?type=${type}`,
                {
                    responseType: "blob"
                }
            );


            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );


            const link = document.createElement("a");

            link.href = url;


            link.download =
                `nia_${report}_report.${type === "csv" ? "csv" : "xlsx"}`;


            document.body.appendChild(link);

            link.click();

            link.remove();


        } catch(error) {

            console.error(
                "Export failed",
                error
            );

            alert("Export failed");

        }

    };


    return (

        <div className="flex gap-3">

            <button
                onClick={() => downloadReport("xlsx")}
                className="px-3 py-2 rounded bg-green-600 text-white"
            >
                Export Excel
            </button>


            <button
                onClick={() => downloadReport("csv")}
                className="px-3 py-2 rounded bg-blue-600 text-white"
            >
                Export CSV
            </button>

        </div>

    );

};


export default ExportButtons;