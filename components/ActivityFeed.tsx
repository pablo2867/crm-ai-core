import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

interface ActivityFeedProps {
  userId: string;
}

export default async function ActivityFeed({
  userId,
}: ActivityFeedProps) {

  const {
    data: activities,
    error,
  } = await supabaseAdmin

    .from("activities")

    .select(`
      id,
      type,
      description,
      created_at
    `)

    .eq(
      "user_id",
      userId
    )

    .order(
      "created_at",
      {
        ascending: false,
      }
    )

    .limit(10);

  if (error) {

    console.error(
      "ACTIVITY FEED ERROR:",
      error
    );

  }

  return (

    <div className="bg-[#111113] border border-zinc-800 rounded-3xl p-6 shadow-2xl">

      <div className="mb-8">

        <p className="text-zinc-500 text-sm">
          Activity
        </p>

        <h2 className="text-3xl font-black text-white mt-2">
          Live Feed
        </h2>

      </div>

      <div className="space-y-5">

        {activities?.map(
          (activity) => (

            <div
              key={activity.id}
              className="flex items-start gap-4"
            >

              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-gradient-to-br
                  from-blue-500
                  to-purple-600
                  flex
                  items-center
                  justify-center
                  font-bold
                  text-white
                "
              >

                {activity.type?.charAt(0)}

              </div>

              <div className="flex-1">

                <p className="text-white">

                  <span className="font-bold">
                    {activity.type}
                  </span>

                  {" "}

                  <span className="text-zinc-400">
                    {activity.description}
                  </span>

                </p>

                <p className="text-zinc-500 text-sm mt-1">

                  {new Date(
                    activity.created_at
                  ).toLocaleString()}

                </p>

              </div>

            </div>

          )
        )}

        {(!activities || activities.length === 0) && (

          <div
            className="
              bg-[#18181B]
              border
              border-zinc-700
              rounded-2xl
              p-4
              text-zinc-400
            "
          >
            No hay actividades registradas.
          </div>

        )}

      </div>

    </div>

  );

}