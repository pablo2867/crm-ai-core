export default function ActivityFeed() {

  const activities = [
    {
      user: "Carlos",
      action: "movió lead a Contactado",
      time: "Hace 2 min",
    },
    {
      user: "Ana",
      action: "creó nuevo lead",
      time: "Hace 10 min",
    },
    {
      user: "Hotel Rivera",
      action: "cerró una venta",
      time: "Hace 30 min",
    },
  ];

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

        {activities.map((activity, index) => (

          <div
            key={index}
            className="flex items-start gap-4"
          >

            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">

              {activity.user.charAt(0)}

            </div>

            <div className="flex-1">

              <p className="text-white">

                <span className="font-bold">
                  {activity.user}
                </span>

                {" "}

                <span className="text-zinc-400">
                  {activity.action}
                </span>

              </p>

              <p className="text-zinc-500 text-sm mt-1">
                {activity.time}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}