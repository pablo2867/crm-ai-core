import {
  skillEngine,
} from "@/platform/skills";

import SkillCard from "./SkillCard";

export default function SkillList() {

  const skills =
    skillEngine.getSkills();

  return (
    <div
      className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
      "
    >

      {skills.map((skill) => (

        <SkillCard
          key={skill.id}
          skill={skill}
        />

      ))}

    </div>
  );

}