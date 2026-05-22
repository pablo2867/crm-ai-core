export default function DashboardStats({
  leads,
}: any) {

  const total =
    leads.length;

  const nuevos =
    leads.filter(
      (lead: any) =>
        lead.status === "Nuevo"
    ).length;

  const contactados =
    leads.filter(
      (lead: any) =>
        lead.status ===
        "Contactado"
    ).length;

  const cerrados =
    leads.filter(
      (lead: any) =>
        lead.status ===
        "Cerrado"
    ).length;

  const stats = [

    {
      title: "Total Leads",
      value: total,
    },

    {
      title: "Nuevos",
      value: nuevos,
    },

    {
      title: "Contactados",
      value: contactados,
    },

    {
      title: "Cerrados",
      value: cerrados,
    },

  ];

  return (

    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4

        gap-5

        mb-8
      "
    >

      {

        stats.map((stat) => (

          <div

            key={stat.title}

            className="
              bg-white
              dark:bg-[#111113]

              border
              border-zinc-200
              dark:border-zinc-800

              rounded-3xl

              p-6
            "
          >

            <p
              className="
                text-zinc-500
                text-sm
              "
            >
              {stat.title}
            </p>

            <h2
              className="
                text-4xl
                font-black

                text-black
                dark:text-white

                mt-3
              "
            >
              {stat.value}
            </h2>

          </div>

        ))

      }

    </div>

  );

}