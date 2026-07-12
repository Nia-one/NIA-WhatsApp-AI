import { useState } from "react";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getStudios } from "../../../services/studioService";
import { assignStudio } from "../../../services/customerService";
export default function AssignStudioModal({
    open,
    onClose,
    customer,
}) {

const {
    data: studios = [],
    isLoading,
} = useQuery({
    queryKey: ["studios"],
    queryFn: getStudios,
});

const activeStudios = studios.filter(
    (studio) => studio.is_active
);

const theatres = [
    ...new Map(
        activeStudios.map((studio) => [
            studio.theatre_name,
            studio,
        ])
    ).values(),
];

const [selectedTheatre, setSelectedTheatre] = useState("");

const [selectedStudio, setSelectedStudio] = useState("");

const filteredStudios = activeStudios.filter(
    (studio) => studio.theatre_name === selectedTheatre
);

    if (!open) return null;

    const handleSave = async () => {

    if (!selectedStudio) {
        alert("Please select a studio.");
        return;
    }

    try {

        await assignStudio(
            customer.id,
            selectedStudio
        );

        onClose();

    } catch (error) {

        console.error(error);

        alert("Failed to assign studio.");

    }

};

    return (
        <div className="fixed inset-0 z-[100]">

            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="absolute left-1/2 top-1/2 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b p-6">

                    <div>

                        <h2 className="text-xl font-bold">
                            Assign Studio
                        </h2>

                        <p className="text-sm text-slate-500">
                            {customer?.customer_name}
                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-slate-100"
                    >
                        <X className="h-5 w-5" />
                    </button>

                </div>

                {/* Body */}

                <div className="space-y-6 p-6">

                    <div>

                        <label className="mb-2 block text-sm font-medium">
                            Theatre
                        </label>

                        <select
    value={selectedTheatre}
    onChange={(e) => setSelectedTheatre(e.target.value)}
    className="w-full rounded-xl border p-3"
>

    <option value="">
        Select Theatre
    </option>

    {theatres.map((theatre) => (

        <option
            key={theatre.theatre_name}
            value={theatre.theatre_name}
        >
            {theatre.theatre_name}
        </option>

    ))}

</select>

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-medium">
                            Studio
                        </label>

                        <select
    value={selectedStudio}
    onChange={(e) => setSelectedStudio(e.target.value)}
    className="w-full rounded-xl border p-3"
    disabled={!selectedTheatre}
>

    <option value="">
        Select Studio
    </option>

    {filteredStudios.map((studio) => (

        <option
            key={studio.id}
            value={studio.studio_code}
        >
            {studio.studio_name}
        </option>

    ))}

</select>

                    </div>

                </div>

                {/* Footer */}

                <div className="flex justify-end gap-3 border-t p-6">

                    <button
                        onClick={onClose}
                        className="rounded-xl border px-5 py-2"
                    >
                        Cancel
                    </button>

                    <button
    onClick={handleSave}
    className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
>
    Save
</button>

                </div>

            </div>

        </div>
    );

}