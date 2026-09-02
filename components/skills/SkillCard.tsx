import {
  SkillDefinition,
} from "@/platform/skills";

interface SkillCardProps {
  skill: SkillDefinition;
}

export default function SkillCard({
  skill,
}: SkillCardProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-zinc-800
        bg-[#111113]
        p-6
      "
    >
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-bold">
            {skill.name}
          </h2>

          <p className="text-zinc-500 mt-2">
            {skill.description}
          </p>
        </div>

        <span
          className="
            text-xs
            bg-green-600
            px-3
            py-1
            rounded-full
            h-fit
          "
        >
          ENABLED
        </span>
      </div>

      <div className="mt-6 text-sm text-zinc-400">
        Skill ID:

        <span className="ml-2 text-white">
          {skill.id}
        </span>
      </div>
    </div>
  );
}