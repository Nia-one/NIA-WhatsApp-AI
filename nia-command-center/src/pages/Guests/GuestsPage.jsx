import { useState } from "react";

import { useGuests } from "../../hooks/useGuests";

import AddGuestModal from "../../components/guests/AddGuestModal";

import { exportGuests } from "../../services/guestService";

import {
    Search,
    Upload,
    Download
} from "lucide-react";


const GuestsPage = () => {


    const [showAddGuest, setShowAddGuest] = useState(false);

    const [search, setSearch] = useState("");



    const {
        data: guests = [],
        isLoading,
        isError,
    } = useGuests();



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

    const filteredGuests = guests.filter((guest) => {


        const value =
            search.toLowerCase();



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


                    </div>


                </div>





                <div className="flex gap-3">





                    <button

                        className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100"

                    >

                        <Upload size={18}/>

                        Import


                    </button>






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

                            className="border-t"

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
                                {guest.theatre_name}
                            </td>


                            <td className="p-3">
                                {guest.studio_code}
                            </td>


                            <td className="p-3">
                                {guest.studio_name}
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




        </div>


    );


};



export default GuestsPage;