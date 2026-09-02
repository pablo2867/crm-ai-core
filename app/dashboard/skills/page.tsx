import SkillList from "@/components/skills/SkillList";

export default function SkillsPage() {

  return (
    <main className="p-8 space-y-8">

      <div>

        <h1 className="text-4xl font-black">
          AI Skills Center
        </h1>

        <p className="text-zinc-500 mt-2">
          Skills registradas en AI CORE.
        </p>

      </div>

      <SkillList />

    </main>
  );

}