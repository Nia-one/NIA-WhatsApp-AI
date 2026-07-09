import {
  Boxes,
  PackageCheck,
  AlertTriangle,
  PackageX,
} from "lucide-react";


export default function InventoryAnalytics({ data }) {

  const cards = [
    {
      title: "Total Products",
      value: data?.total_products ?? 0,
      icon: Boxes,
    },
    {
      title: "In Stock",
      value: data?.in_stock ?? 0,
      icon: PackageCheck,
    },
    {
      title: "Low Stock",
      value: data?.low_stock ?? 0,
      icon: AlertTriangle,
    },
    {
      title: "Out Of Stock",
      value: data?.out_of_stock ?? 0,
      icon: PackageX,
    },
  ];


  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold text-slate-800">
        Inventory Analytics
      </h2>

      <p className="mt-2 text-slate-500">
        Stock availability and inventory health.
      </p>


      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">

        {cards.map((card) => {

          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border bg-slate-50 p-6"
            >

              <div className="flex items-center justify-between">

                <p className="text-sm text-slate-500">
                  {card.title}
                </p>

                <Icon
                  size={22}
                  className="text-blue-600"
                />

              </div>


              <h3 className="mt-4 text-3xl font-bold text-slate-800">
                {card.value}
              </h3>

            </div>
          );

        })}

      </div>


      <div className="mt-6 rounded-xl bg-slate-100 p-5">

        <p className="text-sm text-slate-500">
          Total Available Stock
        </p>

        <p className="mt-1 text-3xl font-bold text-slate-800">
          {data?.total_available_stock ?? 0}
        </p>

      </div>


    </div>
  );
}