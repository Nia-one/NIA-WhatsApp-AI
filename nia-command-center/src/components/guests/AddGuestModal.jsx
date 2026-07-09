import { useState, useEffect } from "react";
import { toast } from "sonner";

import { createGuest } from "../../services/guestService";
import { useStudios } from "../../hooks/useStudios";


const initialFormData = {

    guest_name: "",

    mobile_number: "",

    aadhaar_number: "",

    theatre_name: "",

    studio_code: "",

    studio_name: "",

    room_number: "",

    guest_status: "Active"

};

const AddGuestModal = ({
    isOpen,
    onClose,
    onSuccess
}) => {


const [formData, setFormData] = useState(initialFormData);
const { data: studios = [] } = useStudios();

const theatres = [...new Set(

    studios.map(studio => studio.theatre_name)

)];

const filteredStudios = studios.filter(

    studio => studio.theatre_name === formData.theatre_name

);

useEffect(() => {

    if (isOpen) {

        setFormData(initialFormData);

    }

}, [isOpen]);



    if (!isOpen) return null;



    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };



    const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        const response = await createGuest(formData);

        console.log("Guest Created:", response);

        toast.success("Guest created successfully");

        onClose();

        onSuccess();

    } catch (error) {

        console.error("Create Guest Error:", error);

        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to create guest";

        toast.error(message);

    }

};



    return (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">


            <div className="bg-white rounded-lg p-6 w-[600px]">


                <h2 className="text-xl font-bold mb-5">
                    Add New Guest
                </h2>



                <form onSubmit={handleSubmit}>



                    <div className="grid grid-cols-2 gap-4">



                        <input
                            name="guest_name"
                            placeholder="Guest Name"
                            value={formData.guest_name}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            required
                        />



                        <input
                            name="mobile_number"
                            placeholder="Mobile Number"
                            value={formData.mobile_number}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            required
                        />



                        <input
                            name="aadhaar_number"
                            placeholder="Aadhaar Number"
                            value={formData.aadhaar_number}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />



                        <select
    name="theatre_name"
    value={formData.theatre_name}
    onChange={handleChange}
    className="border p-2 rounded"
    required
>

    <option value="">
        Select Theatre
    </option>

    {theatres.map((theatre) => (

        <option
            key={theatre}
            value={theatre}
        >
            {theatre}
        </option>

    ))}

</select>



                        <input
    name="studio_code"
    value={formData.studio_code}
    readOnly
    className="border p-2 rounded bg-gray-100"
/>



                        <select
    name="studio_name"
    value={formData.studio_name}
    onChange={(e) => {

        const selectedStudio = studios.find(

            studio => studio.studio_name === e.target.value

        );

        setFormData({

            ...formData,

            studio_name: selectedStudio?.studio_name || "",

            studio_code: selectedStudio?.studio_code || ""

        });

    }}
    className="border p-2 rounded"
    required
>

    <option value="">
        Select Studio
    </option>

    {filteredStudios.map((studio) => (

        <option
            key={studio.studio_code}
            value={studio.studio_name}
        >
            {studio.studio_name}
        </option>

    ))}

</select>



                        <input
                            name="room_number"
                            placeholder="Room Number"
                            value={formData.room_number}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />


                    </div>





                    <div className="flex justify-end gap-3 mt-6">


                        <button

                            type="button"

                            onClick={onClose}

                            className="px-4 py-2 border rounded"

                        >

                            Cancel

                        </button>



                        <button

                            type="submit"

                            className="px-4 py-2 bg-blue-600 text-white rounded"

                        >

                            Save Guest

                        </button>



                    </div>


                </form>


            </div>


        </div>

    );

};


export default AddGuestModal;