import AnimatedCard from "@/components/AnimatedCard";
import AnimatedCounter from "@/components/AnimatedCounter";

interface DashboardStatsProps {
  totalLeads: number;
  contactados: number;
  cerrados: number;
  conversionRate: number;
  estimatedRevenue: number;
}

export default function DashboardStats({
  totalLeads,
  contactados,
  cerrados,
  conversionRate,
  estimatedRevenue,
}: DashboardStatsProps) {

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">

      <AnimatedCard>

        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-7 shadow-2xl">

          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />

          <p className="text-blue-100 text-sm">
            Total Leads
          </p>

          <h2 className="text-6xl font-black mt-4 text-white">

            <AnimatedCounter
              value={totalLeads}
            />

          </h2>

          <p className="text-blue-200 mt-4 text-sm">
            Leads registrados en CRM
          </p>

        </div>

      </AnimatedCard>

      <AnimatedCard>

        <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-7 shadow-2xl">

          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />

          <p className="text-green-100 text-sm">
            Contactados
          </p>

          <h2 className="text-6xl font-black mt-4 text-white">

            <AnimatedCounter
              value={contactados}
            />

          </h2>

          <p className="text-green-200 mt-4 text-sm">
            Leads trabajados
          </p>

        </div>

      </AnimatedCard>

      <AnimatedCard>

        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-7 shadow-2xl">

          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />

          <p className="text-purple-100 text-sm">
            Cerrados
          </p>

          <h2 className="text-6xl font-black mt-4 text-white">

            <AnimatedCounter
              value={cerrados}
            />

          </h2>

          <p className="text-purple-200 mt-4 text-sm">
            Conversión finalizada
          </p>

        </div>

      </AnimatedCard>

      <AnimatedCard>

        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl p-7 shadow-2xl">

          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />

          <p className="text-orange-100 text-sm">
            Conversión
          </p>

          <h2 className="text-6xl font-black mt-4 text-white">
            {conversionRate}%
          </h2>

          <p className="text-orange-200 mt-4 text-sm">
            Ratio de cierre
          </p>

        </div>

      </AnimatedCard>

      <AnimatedCard>

        <div className="relative overflow-hidden bg-gradient-to-br from-pink-600 to-pink-800 rounded-3xl p-7 shadow-2xl">

          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />

          <p className="text-pink-100 text-sm">
            Revenue
          </p>

          <h2 className="text-5xl font-black mt-4 text-white">
            ${estimatedRevenue}
          </h2>

          <p className="text-pink-200 mt-4 text-sm">
            Revenue estimado
          </p>

        </div>

      </AnimatedCard>

    </div>

  );

}