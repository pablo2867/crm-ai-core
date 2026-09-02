import type {
  ValidationCardProps,
} from "./types";

export function ValidationCard({

  validation,

}: ValidationCardProps) {

  if (!validation) {

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
        "
      >
        Validation
      </h3>

      <p
        className={
          validation.valid

            ? "text-green-400 mt-4"

            : "text-red-400 mt-4"
        }
      >

        {validation.valid

          ? "Workflow validado"

          : "Workflow rechazado"}

      </p>

    </div>

  );

}