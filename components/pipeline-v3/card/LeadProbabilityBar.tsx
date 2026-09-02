interface Props {
  probability: number;
}

export default function LeadProbabilityBar({
  probability,
}: Props) {

  return (

    <div className="mt-4">

      <div
        className="
          flex
          justify-between
          text-xs
          text-zinc-400
          mb-1
        "
      >
        <span>
          Probabilidad
        </span>

        <span>
          {probability}%
        </span>
      </div>

      <div
        className="
          h-2
          bg-zinc-800
          rounded-full
          overflow-hidden
        "
      >
        <div
          className="
            h-full
            bg-gradient-to-r
            from-cyan-500
            to-blue-500
            transition-all
            duration-500
          "
          style={{
            width: `${probability}%`,
          }}
        />
      </div>

    </div>

  );

}