import { useMemo, useState } from "react";
import {
    Eye,
    Pencil,
    Power,
    ArrowUpDown,
} from "lucide-react";

import { toast } from "sonner";

import { updateStudioStatus } from "../../services/studioService";

import { useQueryClient } from "@tanstack/react-query";

import StudioDrawer from "./StudioDrawer";

// ======================================
// Sort Header
// ======================================

function SortHeader({
    label,
    field,
    sortField,
    onSort,
}) {
    return (
        <th
            onClick={() => onSort(field)}
            className="cursor-pointer p-4 text-left transition hover:bg-slate-200"
        >
            <div className="flex items-center gap-2">
                {label}

                <ArrowUpDown
                    size={15}
                    className={
                        sortField === field
                            ? "text-blue-600"
                            : "text-slate-400"
                    }
                />
            </div>
        </th>
    );
}

export default function StudioTable({
    studios = [],
    onEdit,
}) {

    const [selectedStudio, setSelectedStudio] = useState(null);

    const queryClient = useQueryClient();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [sortField, setSortField] = useState("studio_name");
    const [sortDirection, setSortDirection] = useState("asc");

    const openDrawer = (studio) => {
        setSelectedStudio(studio);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setSelectedStudio(null);
    };

const handleStatusToggle = async (studio) => {

    const action = studio.is_active
        ? "deactivate"
        : "activate";

    const confirmed = window.confirm(
        `Are you sure you want to ${action} "${studio.studio_name}"?`
    );

    if (!confirmed) return;

    try {

        await updateStudioStatus(
            studio.id,
            !studio.is_active
        );

toast.success(
    studio.is_active
        ? "Studio deactivated successfully."
        : "Studio activated successfully."
);

        queryClient.invalidateQueries({
            queryKey: ["studios"],
        });

    } catch (err) {

        console.error(err);

        toast.error(
            err?.response?.data?.message ||
            err.message
        );

    }

};

    const handleSort = (field) => {

        if (sortField === field) {

            setSortDirection((prev) =>
                prev === "asc" ? "desc" : "asc"
            );

        } else {

            setSortField(field);
            setSortDirection("asc");

        }

    };

    const sortedStudios = useMemo(() => {

        if (!studios.length) return [];

        return [...studios].sort((a, b) => {

            const first = (a[sortField] || "")
                .toString()
                .toLowerCase();

            const second = (b[sortField] || "")
                .toString()
                .toLowerCase();

            if (first < second)
                return sortDirection === "asc" ? -1 : 1;

            if (first > second)
                return sortDirection === "asc" ? 1 : -1;

            return 0;

        });

    }, [studios, sortField, sortDirection]);

    return (

        <>

            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

                <table className="min-w-full">

                    <thead className="bg-slate-100">

                        <tr>

                            <SortHeader
                                label="Studio"
                                field="studio_name"
                                sortField={sortField}
                                onSort={handleSort}
                            />

                            <SortHeader
                                label="Theatre"
                                field="theatre_name"
                                sortField={sortField}
                                onSort={handleSort}
                            />

                            <SortHeader
                                label="City"
                                field="city"
                                sortField={sortField}
                                onSort={handleSort}
                            />

                            <SortHeader
                                label="State"
                                field="state"
                                sortField={sortField}
                                onSort={handleSort}
                            />

                            <th className="p-4 text-left">
                                Status
                            </th>

                            <th className="p-4 text-center">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {sortedStudios.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={6}
                                    className="p-10 text-center text-slate-500"
                                >
                                    No studios found.
                                </td>

                            </tr>

                        ) : (

                            sortedStudios.map((studio) => (

                                <tr
                                    key={studio.id}
                                    className="border-t transition hover:bg-slate-50"
                                >

                                    <td className="p-4 font-medium">
                                        {studio.studio_name}
                                    </td>

                                    <td className="p-4">
                                        {studio.theatre_name}
                                    </td>

                                    <td className="p-4">
                                        {studio.city}
                                    </td>

                                    <td className="p-4">
                                        {studio.state}
                                    </td>

                                    <td className="p-4">

                                        <span
                                            className={
                                                studio.is_active
                                                    ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                                                    : "rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700"
                                            }
                                        >
                                            {studio.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>

                                    </td>

<td className="p-4 text-center">

    <div className="flex justify-center gap-2">

        <button
            type="button"
            onClick={() => onEdit(studio)}
            className="rounded-lg p-2 transition hover:bg-blue-100"
            title="Edit Studio"
        >
            <Pencil size={18} />
        </button>

        <button
            type="button"
            onClick={() => handleStatusToggle(studio)}
            className="rounded-lg p-2 transition hover:bg-yellow-100"
            title={
                studio.is_active
                    ? "Deactivate Studio"
                    : "Activate Studio"
            }
        >
            <Power
                size={18}
                className={
                    studio.is_active
                        ? "text-green-600"
                        : "text-red-600"
                }
            />
        </button>

        <button
            type="button"
            onClick={() => openDrawer(studio)}
            className="rounded-lg p-2 transition hover:bg-slate-100"
            title="View Studio"
        >
            <Eye size={18} />
        </button>

    </div>

</td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

            <StudioDrawer
                open={drawerOpen}
                studio={selectedStudio}
                onClose={closeDrawer}
            />

        </>

    );

}