"use client";

interface Props {
  summary: string;
  forecastRevenue?: number;
  hotLeads?: number;
  conversionRate?: number;
}

export default function AIBusinessSummary({
  summary,
  forecastRevenue = 0,
  hotLeads = 0,
  conversionRate = 0,
}: Props) {

  return (

    <div
      className="
        bg-gradient-to-br
        from-purple-500/10
        to-blue-500/10
        border
        border-purple-500/20
        rounded-3xl
        p-6
        mb-8
      "
    >

      <p className="text-purple-400 text-sm">
        AI Business Summary
      </p>

      <h2 className="text-2xl font-black mt-3">
        Resumen Ejecutivo IA
      </h2>

      <div
        className="
          mt-5
          text-zinc-300
          leading-relaxed
          whitespace-pre-wrap
        "
      >
        {summary}
      </div>

      <div
        className="
          mt-6
          pt-4
          border-t
          border-zinc-800
          text-sm
          text-zinc-500
        "
      >
        Revenue Forecast:
        {" "}
        $
        {forecastRevenue.toLocaleString()}
        {" • "}
        HOT Leads:
        {" "}
        {hotLeads}
        {" • "}
        Conversion:
        {" "}
        {conversionRate}%
      </div>

    </div>

  );

}