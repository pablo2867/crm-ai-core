export default function PipelineFilters({
  search,
  setSearch,
  filter,
  setFilter,
}: any) {

  return (

    <div className="mb-8 space-y-4">

      <input
        type="text"
        placeholder="🔎 Buscar lead..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        className="
          w-full

          bg-[#111113]

          border
          border-zinc-800

          rounded-2xl

          px-5 py-4

          text-white

          outline-none

          focus:ring-2
          focus:ring-blue-500
        "
      />

      <div className="flex flex-wrap gap-3">

        {[
          "ALL",
          "HOT",
          "WARM",
          "COLD",
        ].map((item) => (

          <button
            key={item}
            onClick={() =>
              setFilter(item)
            }
            className={`
              px-4 py-2
              rounded-xl
              text-sm
              font-medium
              transition

              ${
                filter === item
                  ? "bg-blue-600 text-white"
                  : "bg-[#111113] border border-zinc-800 text-white"
              }
            `}
          >

            {item}

          </button>

        ))}

      </div>

    </div>

  );

}