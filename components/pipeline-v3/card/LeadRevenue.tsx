interface Props {
  revenue: number;
}

export default function LeadRevenue({
  revenue,
}: Props) {

  return (

    <div className="mt-4">

      <div
        className="
          text-xs
          uppercase
          tracking-wider
          text-zinc-500
        "
      >
        Revenue
      </div>

      <div
        className="
          text-xl
          font-bold
          text-emerald-400
          mt-1
        "
      >
        $
        {revenue.toLocaleString()}
      </div>

    </div>

  );

}