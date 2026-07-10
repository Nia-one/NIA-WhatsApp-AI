import { Search } from "lucide-react";

export default function StudioFilters({
  search,
  setSearch,
  studios,
  selectedTheatre,
  setSelectedTheatre,
  selectedCity,
  setSelectedCity,
}) {

  const theatres = [
    ...new Set(
      studios
        .map((studio) => studio.theatre_name)
        .filter(Boolean)
    ),
  ].sort();

  const cities = [
    ...new Set(
      studios
        .map((studio) => studio.city)
        .filter(Boolean)
    ),
  ].sort();

  return (

    <div className="bg-white rounded-3xl shadow-sm p-6">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-3.5 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search Studio, Theatre or City..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* Theatre */}

        <select
          value={selectedTheatre}
          onChange={(e) => setSelectedTheatre(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3"
        >

          <option value="">
            All Theatres
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

        {/* City */}

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3"
        >

          <option value="">
            All Cities
          </option>

          {cities.map((city) => (

            <option
              key={city}
              value={city}
            >
              {city}
            </option>

          ))}

        </select>

      </div>

    </div>

  );

}