import LogoutButton from "@/components/LogoutButton";
import NotificationBell from "@/components/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardHeader() {

  return (

    <div className="mb-10 mt-16 lg:mt-0 flex items-center justify-between">

      <div>

        <p className="text-zinc-600 dark:text-zinc-500 text-sm">
          CRM AI
        </p>

        <h1 className="text-3xl md:text-5xl font-bold mt-2">
          Dashboard
        </h1>

        <div className="mt-4">
          <LogoutButton />
        </div>

      </div>

      <div className="flex items-center gap-3">

        <ThemeToggle />

        <NotificationBell />

      </div>

    </div>

  );

}