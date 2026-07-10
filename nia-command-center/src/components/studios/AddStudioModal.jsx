import { useState } from "react";
import { toast } from "sonner";

import { createStudio } from "../../services/studioService";

const initialForm = {
    studio_code: "",
    studio_name: "",
    theatre_code: "",
    theatre_name: "",
    city: "",
    state: "",
    address: "",
    contact_person: "",
    contact_number: "",
};

export default function AddStudioModal({
    open,
    onClose,
    onSuccess,
}) {

    const [formData, setFormData] = useState(initialForm);

    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value,

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await createStudio(formData);

            toast.success("Studio created successfully.");

            setFormData(initialForm);

            onSuccess();

            onClose();

        } catch (err) {

            console.error(err);

            toast.error(
                err?.response?.data?.message ||
                err.message
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-full max-w-3xl rounded-2xl bg-white p-8">

                <h2 className="mb-6 text-2xl font-bold">
                    Add Studio
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-2 gap-4"
                >

                    <input
                        name="studio_code"
                        placeholder="Studio Code"
                        value={formData.studio_code}
                        onChange={handleChange}
                        className="rounded-lg border p-3"
                        required
                    />

                    <input
                        name="studio_name"
                        placeholder="Studio Name"
                        value={formData.studio_name}
                        onChange={handleChange}
                        className="rounded-lg border p-3"
                        required
                    />

                    <input
                        name="theatre_code"
                        placeholder="Theatre Code"
                        value={formData.theatre_code}
                        onChange={handleChange}
                        className="rounded-lg border p-3"
                        required
                    />

                    <input
                        name="theatre_name"
                        placeholder="Theatre Name"
                        value={formData.theatre_name}
                        onChange={handleChange}
                        className="rounded-lg border p-3"
                        required
                    />

                    <input
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        className="rounded-lg border p-3"
                        required
                    />

                    <input
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleChange}
                        className="rounded-lg border p-3"
                        required
                    />

                    <input
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                        className="col-span-2 rounded-lg border p-3"
                    />

                    <input
                        name="contact_person"
                        placeholder="Contact Person"
                        value={formData.contact_person}
                        onChange={handleChange}
                        className="rounded-lg border p-3"
                    />

                    <input
                        name="contact_number"
                        placeholder="Contact Number"
                        value={formData.contact_number}
                        onChange={handleChange}
                        className="rounded-lg border p-3"
                    />

                    <div className="col-span-2 mt-4 flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border px-5 py-2"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-6 py-2 text-white"
                        >
                            {loading ? "Saving..." : "Save Studio"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}