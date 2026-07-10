import { useState, useRef } from "react";

import { useGuests } from "../../hooks/useGuests";

import AddGuestModal from "../../components/guests/AddGuestModal";

import ImportGuestPreviewModal from "../../components/guests/ImportGuestPreviewModal";

import {
    exportGuests,
    importGuests,
    downloadGuestTemplate
} from "../../services/guestService";
import * as XLSX from "xlsx";

import {
    Search,
    Upload,
    Download
} from "lucide-react";


const GuestsPage = () => {


    const [showAddGuest, setShowAddGuest] = useState(false);

    const [search, setSearch] = useState("");

    const [mappingFilter, setMappingFilter] = useState("all");

const [importPreview, setImportPreview] = useState([]);
const [showImportPreview, setShowImportPreview] = useState(false);

    const fileInputRef = useRef(null);



    const {
        data: guests = [],
        isLoading,
        isError,
    } = useGuests();

    // ==========================
// Guest Mapping KPIs
// ==========================

const totalGuests = guests.length;

const mappedGuests = guests.filter(
    guest => guest.studio_code
).length;

const pendingGuests = guests.filter(
    guest => !guest.studio_code
).length;

// ==========================
// Import Guests
// ==========================

const handleImport = (event) => {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {

        try {

            const data = new Uint8Array(e.target.result);

            const workbook = XLSX.read(data, {
                type: "array"
            });

            console.log("Workbook:", workbook);

            const sheetName = workbook.SheetNames[0];

            console.log("Sheet:", sheetName);

            const worksheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet);

console.log("Imported Guests:", jsonData);

console.log("First Row:", jsonData[0]);
console.log("Setting Preview...");

setImportPreview(jsonData);

console.log("Opening Modal...");

setShowImportPreview(true);

console.log("showImportPreview should now be true");

        } catch (err) {

            console.error(err);

            alert("Invalid Excel or CSV file");

        }

    };

    reader.readAsArrayBuffer(file);

};

    // ==========================
    // Export Guests CSV
    // ==========================

    

    const handleExport = async () => {

        

    try {

        const response = await exportGuests();

        console.log(
            "EXPORT RESPONSE:",
            response
        );


        const guests = response.data;


        if (!guests || guests.length === 0) {

            alert("No guest data available");

            return;

        }


        const csvHeaders = Object.keys(
            guests[0]
        );


        const csvRows = guests.map(row =>

            csvHeaders.map(field =>

                `"${row[field] ?? ""}"`

            ).join(",")

        );


        const csvContent = [

            csvHeaders.join(","),

            ...csvRows

        ].join("\n");



        const blob = new Blob(

            [csvContent],

            {
                type: "text/csv;charset=utf-8;"
            }

        );



        const url = window.URL.createObjectURL(blob);



        const link = document.createElement("a");


        link.href = url;


        link.download = "Guest_Master.csv";


        document.body.appendChild(link);


        link.click();


        document.body.removeChild(link);


        window.URL.revokeObjectURL(url);



    } catch (error) {


        console.error(
            "Export failed:",
            error
        );


    }

};






    // ==========================
    // Search Filter
    // ==========================

    // ==========================
// Search + Mapping Filter
// ==========================

let filtered = guests;

if (mappingFilter === "mapped") {
    filtered = filtered.filter(
        guest => guest.studio_code
    );
}

if (mappingFilter === "pending") {
    filtered = filtered.filter(
        guest => !guest.studio_code
    );
}

const filteredGuests = filtered.filter((guest) => {

    const value = search.toLowerCase();

    return (

        guest.guest_name
            ?.toLowerCase()
            .includes(value)

        ||

        guest.mobile_number
            ?.toString()
            .includes(value)

        ||

        guest.guest_code
            ?.toLowerCase()
            .includes(value)

        ||

        guest.studio_name
            ?.toLowerCase()
            .includes(value)

        ||

        guest.theatre_name
            ?.toLowerCase()
            .includes(value)

    );

});






    if (isLoading) {

        return (

            <div className="p-6">

                Loading guests...

            </div>

        );

    }





    if (isError) {

        return (

            <div className="p-6 text-red-500">

                Failed to load guests

            </div>

        );

    }





    return (

        <div className="p-6">



            {/* Header */}

            <div className="flex justify-between items-center mb-6">



                <div>


                    <h1 className="text-3xl font-bold">

                        Guest Master

                    </h1>



                    <p className="text-gray-500">

                        Manage all guests

                    </p>





                    {/* Search */}

                    <div className="mt-4 relative">


                        <Search

                            className="absolute left-3 top-3 text-gray-400"

                            size={18}

                        />



                        <input


                            type="text"


                            placeholder="Search by name, mobile, guest code, studio..."


                            value={search}


                            onChange={(e)=>
                                setSearch(e.target.value)
                            }


                            className="pl-10 pr-4 py-2 border rounded-lg w-96"


                        />

                        <div className="flex gap-2 mt-3">

    <button
        onClick={() => setMappingFilter("all")}
        className={`px-4 py-2 rounded-lg border ${
            mappingFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white"
        }`}
    >
        All
    </button>

    <button
        onClick={() => setMappingFilter("mapped")}
        className={`px-4 py-2 rounded-lg border ${
            mappingFilter === "mapped"
                ? "bg-green-600 text-white"
                : "bg-white"
        }`}
    >
        Mapped
    </button>

    <button
        onClick={() => setMappingFilter("pending")}
        className={`px-4 py-2 rounded-lg border ${
            mappingFilter === "pending"
                ? "bg-orange-500 text-white"
                : "bg-white"
        }`}
    >
        Pending Mapping
    </button>

</div>


                    </div>


                </div>





                <div className="flex gap-3">





        <>

<button
    onClick={downloadGuestTemplate}
    className="px-4 py-2 border rounded-lg hover:bg-gray-100 flex items-center gap-2"
>
    📄 Template
</button>

    <button
        onClick={() => fileInputRef.current.click()}
        className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100"
    >
        <Upload size={18} />
        Import
    </button>

    <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        style={{ display: "none" }}
        onChange={handleImport}
    />
</>
                    <button


                        onClick={handleExport}


                        className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100"


                    >

                        <Download size={18}/>

                        Export


                    </button>






                    <button


                        onClick={() =>
                            setShowAddGuest(true)
                        }


                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"


                    >

                        + Add Guest


                    </button>



                </div>



            </div>






{/* ==========================
    Guest Mapping KPIs
========================== */}

<div className="grid grid-cols-3 gap-4 mb-6">

    <div className="bg-white rounded-lg shadow p-5 border">
        <p className="text-gray-500 text-sm">
            Total Guests
        </p>

        <h2 className="text-3xl font-bold mt-2">
            {totalGuests}
        </h2>
    </div>

    <div className="bg-white rounded-lg shadow p-5 border">
        <p className="text-gray-500 text-sm">
            Mapped Guests
        </p>

        <h2 className="text-3xl font-bold text-green-600 mt-2">
            {mappedGuests}
        </h2>
    </div>

    <div className="bg-white rounded-lg shadow p-5 border">
        <p className="text-gray-500 text-sm">
            Pending Mapping
        </p>

        <h2 className="text-3xl font-bold text-orange-600 mt-2">
            {pendingGuests}
        </h2>
    </div>

</div>



            {/* Table */}


            <div className="bg-white rounded-lg shadow overflow-x-auto">



                <table className="min-w-max w-full">



                    <thead className="bg-gray-100">


                        <tr>

                            <th className="p-3 text-left">
                                Guest Code
                            </th>

                            <th className="p-3 text-left">
                                Guest Name
                            </th>

                            <th className="p-3 text-left">
                                Mobile
                            </th>

                            <th className="p-3 text-left">
                                Aadhaar
                            </th>

                            <th className="p-3 text-left">
                                Theatre
                            </th>

                            <th className="p-3 text-left">
                                Studio Code
                            </th>

                            <th className="p-3 text-left">
                                Studio
                            </th>

                            <th className="p-3 text-left">
                                Room
                            </th>

                            <th className="p-3 text-left">
                                Status
                            </th>

                            <th className="p-3 text-left">
                                WhatsApp
                            </th>

                            <th className="p-3 text-left">
                                Active
                            </th>

                            <th className="p-3 text-left">
                                Created
                            </th>

                            <th className="p-3 text-left">
                                Updated
                            </th>


                        </tr>


                    </thead>





                    <tbody>



                    {
                    filteredGuests.length === 0 ?


                    (

                        <tr>

                            <td

                                colSpan="13"

                                className="p-5 text-center text-gray-500"

                            >

                                No guests found


                            </td>


                        </tr>


                    )


                    :


                    filteredGuests.map((guest)=>(



                        <tr
    key={guest.id}
    className={`border-t ${
        !guest.studio_code
            ? "bg-yellow-50"
            : ""
    }`}
>


                            <td className="p-3">
                                {guest.guest_code}
                            </td>


                            <td className="p-3">
                                {guest.guest_name}
                            </td>


                            <td className="p-3">
                                {guest.mobile_number}
                            </td>


                            <td className="p-3">
                                {guest.aadhaar_number || "-"}
                            </td>


                            <td className="p-3">

    {guest.theatre_name ? (

        <span className="text-gray-800">
            {guest.theatre_name}
        </span>

    ) : (

        <span className="inline-flex px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
            Not Assigned
        </span>

    )}

</td>


                            <td className="p-3">

    {guest.studio_code ? (

        <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            {guest.studio_code}
        </span>

    ) : (

        <span className="inline-flex px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
            ⚠ Pending Mapping
        </span>

    )}

</td>


                           <td className="p-3">

    {guest.studio_name ? (

        guest.studio_name

    ) : (

        <span className="inline-flex px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
            Pending Mapping
        </span>

    )}

</td>


                            <td className="p-3">
                                {guest.room_number}
                            </td>


                            <td className="p-3">
                                {guest.guest_status}
                            </td>


                            <td className="p-3">
                                {
                                guest.whatsapp_enabled
                                ?
                                "Yes"
                                :
                                "No"
                                }
                            </td>


                            <td className="p-3">
                                {
                                guest.is_active
                                ?
                                "Yes"
                                :
                                "No"
                                }
                            </td>



                            <td className="p-3">

                                {
                                guest.created_at
                                ?
                                new Date(
                                    guest.created_at
                                )
                                .toLocaleDateString()
                                :
                                "-"
                                }

                            </td>



                            <td className="p-3">

                                {
                                guest.updated_at
                                ?
                                new Date(
                                    guest.updated_at
                                )
                                .toLocaleDateString()
                                :
                                "-"
                                }

                            </td>



                        </tr>


                    ))


                    }



                    </tbody>



                </table>



            </div>







            <AddGuestModal


                isOpen={showAddGuest}


                onClose={() =>
                    setShowAddGuest(false)
                }


                onSuccess={() =>
                    window.location.reload()
                }


            />

            <ImportGuestPreviewModal
    isOpen={showImportPreview}
    data={importPreview}
    onClose={() => setShowImportPreview(false)}
    onImport={async () => {

    try {

        const response = await importGuests(importPreview);

console.log("IMPORT RESPONSE:", response);

alert(
`Guest Import Completed

Imported : ${response.imported}
Updated  : ${response.updated}
Failed   : ${response.failed}`
);


        setShowImportPreview(false);

        window.location.reload();

    } catch (error) {

        console.error(error);

        alert("Guest import failed.");

    }

}}
/>




        </div>


    );


};



export default GuestsPage;