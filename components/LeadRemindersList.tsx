"use client";

import {
  useState,
} from "react";

export default function LeadRemindersList({
  reminders,
}: any) {

  const [
    localReminders,
    setLocalReminders,
  ] = useState(reminders);

  const completeReminder =
    async (id: number) => {

      await fetch(
        "/api/complete-reminder",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id,
          }),

        }
      );

      const updated =
        localReminders.map(
          (reminder: any) =>

            reminder.id === id
              ? {
                  ...reminder,
                  completed: true,
                }
              : reminder

        );

      setLocalReminders(
        updated
      );

    };

  return (

    <div className="mt-6 space-y-4">

      {

        localReminders &&
        localReminders.length > 0 ? (

          localReminders.map(
            (reminder: any) => (

              <div

                key={reminder.id}

                className="
                  border
                  border-zinc-200
                  dark:border-zinc-800

                  rounded-2xl

                  p-4
                "
              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p
                      className="
                        text-black
                        dark:text-white

                        font-medium
                      "
                    >
                      {

                        reminder.completed
                          ? "✅"
                          : "📅"

                      }

                      {" "}

                      {reminder.title}
                    </p>

                    <p
                      className="
                        text-sm
                        text-zinc-500
                        mt-2
                      "
                    >
                      ⏰ {

                        new Date(
                          reminder.remind_at
                        ).toLocaleString()

                      }
                    </p>

                  </div>

                  {

                    !reminder.completed && (

                      <button

                        onClick={() =>
                          completeReminder(
                            reminder.id
                          )
                        }

                        className="
                          bg-green-600
                          hover:bg-green-700

                          text-white

                          text-sm

                          px-4 py-2

                          rounded-xl

                          transition
                        "
                      >
                        Completar
                      </button>

                    )

                  }

                </div>

              </div>

            )

          )

        ) : (

          <p className="text-zinc-500">

            Sin reminders todavía.

          </p>

        )

      }

    </div>

  );

}