"use client";

export default function LeadActivity({
  lead,
}: any) {

  return (

    <div className="mt-10">

      <h3
        className="
          text-xl
          font-bold
          text-black
          dark:text-white
          mb-5
        "
      >
        Actividad
      </h3>

      <div className="space-y-4">

        {

          Array.isArray(
            lead.activities
          ) &&
          lead.activities.length > 0 ? (

            lead.activities.map(
              (activity: any) => (

                <div
                  key={activity.id}
                  className="
                    border
                    border-zinc-200
                    dark:border-zinc-800
                    rounded-2xl
                    p-4
                  "
                >

                  <p
                    className="
                      text-sm
                      text-black
                      dark:text-white
                    "
                  >
                    {activity.description}
                  </p>

                  <p
                    className="
                      text-xs
                      text-zinc-500
                      mt-2
                    "
                  >
                    {
                      new Date(
                        activity.created_at
                      ).toLocaleString()
                    }
                  </p>

                </div>

              )

            )

          ) : (

            <p className="text-zinc-500">
              Sin actividad todavía.
            </p>

          )

        }

      </div>

    </div>

  );

}
