export default function AgendaWidget() {

  const tasks = [
    {
      title: "Llamar Hotel Rivera",
      time: "3:00 PM",
    },
    {
      title: "Demo con gimnasio",
      time: "Mañana",
    },
    {
      title: "Seguimiento lead premium",
      time: "Viernes",
    },
  ];

  return (
    <div className="bg-[#111113] border border-zinc-800 rounded-3xl p-6 shadow-2xl">

      <div className="mb-8">

        <p className="text-zinc-500 text-sm">
          Agenda
        </p>

        <h2 className="text-3xl font-black text-white mt-2">
          Próximas Tareas
        </h2>

      </div>

      <div className="space-y-4">

        {tasks.map((task, index) => (

          <div
            key={index}
            className="bg-[#18181B] border border-zinc-700 rounded-2xl p-4 hover:bg-zinc-800 transition"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="font-bold text-white">
                  {task.title}
                </p>

                <p className="text-zinc-500 text-sm mt-1">
                  {task.time}
                </p>

              </div>

              <div className="w-3 h-3 rounded-full bg-green-500" />

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}