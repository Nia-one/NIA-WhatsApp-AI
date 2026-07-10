import {
    Building2,
    CheckCircle2,
    MapPin,
    Landmark,
} from "lucide-react";

export default function StudioKPICards({ studios }) {

    const totalStudios = studios.length;

    const activeStudios = studios.filter(
        (studio) => studio.is_active
    ).length;

    const totalCities = new Set(
        studios.map((studio) => studio.city)
    ).size;

    const totalTheatres = new Set(
        studios.map((studio) => studio.theatre_name)
    ).size;

    const cards = [
        {
            title: "Total Studios",
            value: totalStudios,
            icon: Building2,
        },
        {
            title: "Active Studios",
            value: activeStudios,
            icon: CheckCircle2,
        },
        {
            title: "Cities",
            value: totalCities,
            icon: MapPin,
        },
        {
            title: "Theatres",
            value: totalTheatres,
            icon: Landmark,
        },
    ];

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {cards.map((card) => {

                const Icon = card.icon;

                return (

                    <div
                        key={card.title}
                        className="bg-white rounded-3xl shadow-sm p-6"
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm text-slate-500">
                                    {card.title}
                                </p>

                                <h2 className="text-3xl font-bold mt-2">
                                    {card.value}
                                </h2>

                            </div>

                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">

                                <Icon
                                    size={28}
                                    className="text-blue-600"
                                />

                            </div>

                        </div>

                    </div>

                );

            })}

        </div>

    );

}