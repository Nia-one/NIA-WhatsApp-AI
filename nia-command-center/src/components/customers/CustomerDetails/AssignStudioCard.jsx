import { useState } from "react";
import { Building2 } from "lucide-react";
import AssignStudioModal from "./AssignStudioModal";

export default function AssignStudioCard({ customer }) {

    const [open, setOpen] = useState(false);

    const mapped = !!customer?.studio_id;

    return (
    <>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <div className="mb-4 flex items-center gap-3">

                <Building2 className="h-6 w-6 text-blue-600" />

                <h3 className="text-lg font-semibold">
                    Studio Mapping
                </h3>

            </div>

            {mapped ? (

                <div className="space-y-3">

                    <div>

                        <p className="text-sm text-slate-500">
                            Studio
                        </p>

                        <p className="font-semibold">
                            {customer.studio_name}
                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">
                            Theatre
                        </p>

                        <p className="font-semibold">
                            {customer.theatre_name}
                        </p>

                    </div>

                </div>

            ) : (

                <div className="space-y-4">

                    <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                        Pending Mapping
                    </span>

                    <button
                        onClick={() => setOpen(true)}
                        className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                    >
                        Assign Studio
                    </button>

                </div>

            )}

                </div>

        <AssignStudioModal
            open={open}
            onClose={() => setOpen(false)}
            customer={customer}
        />

    </>

);
}