interface RevenueAnalyticsProps {
  estimatedRevenue: number;
  forecastRevenue: number;
  totalLeads: number;
  cerrados: number;
}

export default function RevenueAnalytics({
  estimatedRevenue,
  forecastRevenue,
  totalLeads,
  cerrados,
}: RevenueAnalyticsProps) {

  const revenuePerLead =
    totalLeads > 0
      ? Math.round(
          estimatedRevenue /
          totalLeads
        )
      : 0;

  const revenuePerClose =
    cerrados > 0
      ? Math.round(
          estimatedRevenue /
          cerrados
        )
      : 0;

  return (

    <div
      className="
        mt-10
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
      "
    >

      <div className="bg-[#111113] border border-zinc-800 rounded-3xl p-6">

        <p className="text-zinc-400">
          Revenue Actual
        </p>

        <h2 className="text-4xl font-black mt-3 text-white">
          $
          {estimatedRevenue.toLocaleString()}
        </h2>

      </div>

      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-3xl p-6">

        <p className="text-cyan-400">
          Forecast IA
        </p>

        <h2 className="text-4xl font-black mt-3 text-white">
          $
          {forecastRevenue.toLocaleString()}
        </h2>

      </div>

      <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-6">

        <p className="text-green-400">
          Promedio por Lead
        </p>

        <h2 className="text-4xl font-black mt-3 text-white">
          $
          {revenuePerLead.toLocaleString()}
        </h2>

      </div>

      <div className="bg-purple-500/10 border border-purple-500/20 rounded-3xl p-6">

        <p className="text-purple-400">
          Promedio por Cierre
        </p>

        <h2 className="text-4xl font-black mt-3 text-white">
          $
          {revenuePerClose.toLocaleString()}
        </h2>

      </div>

    </div>

  );

}