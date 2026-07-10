import { useMemo, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import AddStudioModal from "../../components/studios/AddStudioModal";

import { useStudios } from "../../hooks/useStudios";

import StudioKPICards from "../../components/studios/StudioKPICards";
import StudioFilters from "../../components/studios/StudioFilters";
import StudioTable from "../../components/studios/StudioTable";

import ExportButtons from "../../components/common/ExportButtons";
import Pagination from "../../components/common/Pagination";

export default function StudiosPage() {

    const {
        data: studios = [],
        isLoading,
        error,
    } = useStudios();

    const [search, setSearch] = useState("");

    const [selectedTheatre, setSelectedTheatre] = useState("");

    const queryClient = useQueryClient();

const [addStudioOpen, setAddStudioOpen] = useState(false);

    const [selectedCity, setSelectedCity] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const pageSize = 10;

    const filteredStudios = useMemo(() => {

        return studios.filter((studio) => {

            const matchesSearch =
                (studio.studio_name || "")
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||

                (studio.theatre_name || "")
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||

                (studio.city || "")
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesTheatre =
                !selectedTheatre ||
                studio.theatre_name === selectedTheatre;

            const matchesCity =
                !selectedCity ||
                studio.city === selectedCity;

            return (
                matchesSearch &&
                matchesTheatre &&
                matchesCity
            );

        });

    }, [
        studios,
        search,
        selectedTheatre,
        selectedCity,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredStudios.length / pageSize)
    );

    const paginatedStudios = filteredStudios.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    if (isLoading) {

        return (
            <div className="p-8">
                <h2 className="text-2xl font-bold">
                    Loading Studios...
                </h2>
            </div>
        );

    }

    if (error) {

        return (
            <div className="p-8 text-red-600">
                Failed to load studios.
            </div>
        );

    }

    return (

        <div className="space-y-6">

            <StudioKPICards
                studios={studios}
            />

            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">

                <div className="flex-1 w-full">

                    <StudioFilters

                        studios={studios}

                        search={search}

                        setSearch={(value) => {

                            setSearch(value);
                            setCurrentPage(1);

                        }}

                        selectedTheatre={selectedTheatre}

                        setSelectedTheatre={(value) => {

                            setSelectedTheatre(value);
                            setCurrentPage(1);

                        }}

                        selectedCity={selectedCity}

                        setSelectedCity={(value) => {

                            setSelectedCity(value);
                            setCurrentPage(1);

                        }}

                    />

                </div>

                <div className="flex items-center gap-3">

    <button
        onClick={() => setAddStudioOpen(true)}
        className="rounded-xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition"
    >
        + Add Studio
    </button>

    <ExportButtons
    report="studios"
/>

</div>

            </div>

            <StudioTable
                studios={paginatedStudios}
            />

            <Pagination

                currentPage={currentPage}

                totalPages={totalPages}

                totalRecords={filteredStudios.length}

                pageSize={pageSize}

                onPageChange={setCurrentPage}

            />

            <AddStudioModal
    open={addStudioOpen}
    onClose={() => setAddStudioOpen(false)}
    onSuccess={() => {

        queryClient.invalidateQueries({

            queryKey: ["studios"],

        });

    }}
/>

        </div>

    );

}