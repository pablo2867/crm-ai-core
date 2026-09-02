import type {
  PlannerCardProps,
} from "./types";

export function PlannerCard({

  plan,

}: PlannerCardProps) {

  if (!plan) {

    return null;

  }

  return (

    <div
      className="
        rounded-2xl
        border
        border-zinc-800
        bg-[#18181B]
        p-5
      "
    >

      <h3
        className="
          text-sm
          font-semibold
          text-zinc-300
        "
      >
        Planner
      </h3>

      <p className="mt-4 text-zinc-400">

        Plan generado correctamente.

      </p>

    </div>

  );

}

export default PlannerCard;