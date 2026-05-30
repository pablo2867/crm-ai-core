export default function AIInsights() {

  const insights = [

    {
      title:
        "HOT leads aumentaron",
      value:
        "+24%",
    },

    {
      title:
        "Leads olvidados detectados",
      value:
        "3",
    },

    {
      title:
        "Probabilidad de cierre alta",
      value:
        "78%",
    },

    {
      title:
        "Pipeline saludable",
      value:
        "Excelente",
    },

  ];

  return (

    <div
      className="
        mt-10

        bg-[#111113]

        border
        border-zinc-800

        rounded-3xl

        p-6
      "
    >

      <div className="mb-8">

        <p
          className="
            text-zinc-500
            text-sm
          "
        >
          CRM AI
        </p>

        <h2
          className="
            text-3xl
            font-black

            text-white

            mt-2
          "
        >
          AI Insights
        </h2>

      </div>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4

          gap-6
        "
      >

        {

          insights.map(
            (
              insight,
              index
            ) => (

              <div
                key={index}
                className="
                  bg-[#18181B]

                  border
                  border-zinc-800

                  rounded-2xl

                  p-5
                "
              >

                <p
                  className="
                    text-zinc-400
                    text-sm
                  "
                >
                  {insight.title}
                </p>

                <h3
                  className="
                    text-3xl
                    font-black

                    text-white

                    mt-3
                  "
                >
                  {insight.value}
                </h3>

              </div>

            )
          )

        }

      </div>

    </div>

  );

}