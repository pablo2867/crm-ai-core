"use client";

type FinancialMetric = {
  name: string;
  label: string;
  value: number;
  unit: string;
  currency?: string;
};

type FinancialFinding = {
  type: string;
  metric: string;
  message: string;
  evidence?: string[];
  severity: string;
};

type IncomeStatementLine = {
  key: string;
  label: string;
  amount: number;
  currency: string;
  percentageOfBase?: number;
};

type FinancialDashboardProps = {
  data: {
    currency?: string;
    metrics?: FinancialMetric[];
    findings?: FinancialFinding[];
    dataQuality?: {
      transactionCount?: number;
      completeness?: number;
      unclassifiedTransactions?: number;
      balanceSheetAvailable?: boolean;
      incomeStatementAvailable?: boolean;
      cashFlowAvailable?: boolean;
      warnings?: string[];
    };
    summary?: {
      revenue?: number;
      costOfSales?: number;
      grossProfit?: number;
      operatingExpenses?: number;
      operatingProfit?: number;
      netProfit?: number;
      grossMargin?: number;
      operatingMargin?: number;
      netMargin?: number;
    };
    statements?: {
      incomeStatement?: {
        available?: boolean;
        lines?: IncomeStatementLine[];
      };
      balanceSheet?: {
        available?: boolean;
      };
      cashFlow?: {
        available?: boolean;
        completeness?: number;
        warnings?: string[];
      };
    };
  };
};

function money(value: number, currency: string) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function getMetric(
  metrics: FinancialMetric[] | undefined,
  name: string
) {
  return metrics?.find((metric) => metric.name === name)?.value ?? 0;
}

export default function FinancialDashboard({
  data,
}: FinancialDashboardProps) {
  const currency = data.currency || "MXN";
  const summary = data.summary || {};

  const revenue =
    summary.revenue ?? getMetric(data.metrics, "revenue");

  const expenses =
    summary.operatingExpenses ??
    getMetric(data.metrics, "operating_expenses");

  const netProfit =
    summary.netProfit ??
    getMetric(data.metrics, "net_profit");

  const grossProfit =
    summary.grossProfit ??
    getMetric(data.metrics, "gross_profit");

  const netMargin =
    summary.netMargin ??
    getMetric(data.metrics, "net_margin");

  const operatingMargin =
    summary.operatingMargin ??
    getMetric(data.metrics, "operating_margin");

  const quality = data.dataQuality;

  const incomeStatement =
    data.statements?.incomeStatement;

  return (
    <div className="space-y-6">
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-5
          gap-4
        "
      >
        <div className="bg-[#111113] border border-zinc-800 rounded-3xl p-6">
          <p className="text-zinc-500 text-sm">Ingresos</p>
          <h2 className="text-3xl font-black mt-3">
            {money(revenue, currency)}
          </h2>
        </div>

        <div className="bg-[#111113] border border-zinc-800 rounded-3xl p-6">
          <p className="text-zinc-500 text-sm">Gastos operativos</p>
          <h2 className="text-3xl font-black mt-3">
            {money(expenses, currency)}
          </h2>
        </div>

        <div className="bg-[#111113] border border-zinc-800 rounded-3xl p-6">
          <p className="text-zinc-500 text-sm">Utilidad bruta</p>
          <h2 className="text-3xl font-black mt-3">
            {money(grossProfit, currency)}
          </h2>
        </div>

        <div className="bg-[#111113] border border-zinc-800 rounded-3xl p-6">
          <p className="text-zinc-500 text-sm">Utilidad neta</p>
          <h2 className="text-3xl font-black mt-3">
            {money(netProfit, currency)}
          </h2>
        </div>

        <div className="bg-[#111113] border border-zinc-800 rounded-3xl p-6">
          <p className="text-zinc-500 text-sm">Margen neto</p>
          <h2 className="text-3xl font-black mt-3">
            {netMargin.toFixed(2)}%
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="bg-[#111113] border border-zinc-800 rounded-3xl p-6">
          <div className="mb-6">
            <p className="text-zinc-500 text-sm">
              Financial Intelligence
            </p>
            <h2 className="text-2xl font-black mt-2">
              Estado de Resultados
            </h2>
          </div>

          {incomeStatement?.available ? (
            <div className="space-y-3">
              {(incomeStatement.lines || []).map((line) => (
                <div
                  key={line.key}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    bg-[#18181B]
                    border
                    border-zinc-800
                    rounded-2xl
                    px-5
                    py-4
                  "
                >
                  <div>
                    <p className="font-medium">
                      {line.label}
                    </p>

                    {typeof line.percentageOfBase === "number" && (
                      <p className="text-xs text-zinc-500 mt-1">
                        {line.percentageOfBase.toFixed(2)}%
                      </p>
                    )}
                  </div>

                  <p className="font-bold">
                    {money(line.amount, line.currency)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500">
              Estado de Resultados no disponible.
            </p>
          )}
        </section>

        <section className="bg-[#111113] border border-zinc-800 rounded-3xl p-6">
          <div className="mb-6">
            <p className="text-zinc-500 text-sm">
              Rentabilidad
            </p>
            <h2 className="text-2xl font-black mt-2">
              Márgenes financieros
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">
                  Margen bruto
                </span>
                <span>
                  {(summary.grossMargin ?? 0).toFixed(2)}%
                </span>
              </div>

              <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      Math.max(summary.grossMargin ?? 0, 0),
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">
                  Margen operativo
                </span>
                <span>
                  {operatingMargin.toFixed(2)}%
                </span>
              </div>

              <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      Math.max(operatingMargin, 0),
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">
                  Margen neto
                </span>
                <span>
                  {netMargin.toFixed(2)}%
                </span>
              </div>

              <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      Math.max(netMargin, 0),
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="bg-[#111113] border border-zinc-800 rounded-3xl p-6">
          <div className="mb-6">
            <p className="text-zinc-500 text-sm">
              Calidad de datos
            </p>

            <h2 className="text-2xl font-black mt-2">
              Integridad financiera
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#18181B] rounded-2xl p-4">
              <p className="text-zinc-500 text-sm">
                Completitud
              </p>
              <p className="text-2xl font-black mt-2">
                {quality?.completeness ?? 0}%
              </p>
            </div>

            <div className="bg-[#18181B] rounded-2xl p-4">
              <p className="text-zinc-500 text-sm">
                Transacciones
              </p>
              <p className="text-2xl font-black mt-2">
                {quality?.transactionCount ?? 0}
              </p>
            </div>

            <div className="bg-[#18181B] rounded-2xl p-4">
              <p className="text-zinc-500 text-sm">
                Sin clasificar
              </p>
              <p className="text-2xl font-black mt-2">
                {quality?.unclassifiedTransactions ?? 0}
              </p>
            </div>

            <div className="bg-[#18181B] rounded-2xl p-4">
              <p className="text-zinc-500 text-sm">
                Estado de resultados
              </p>
              <p className="text-2xl font-black mt-2">
                {quality?.incomeStatementAvailable
                  ? "Disponible"
                  : "No disponible"}
              </p>
            </div>
          </div>

          {(quality?.warnings || []).length > 0 && (
            <div className="mt-5 space-y-2">
              {quality?.warnings?.map((warning, index) => (
                <div
                  key={`${warning}-${index}`}
                  className="
                    rounded-2xl
                    border
                    border-amber-500/20
                    bg-amber-500/10
                    p-4
                    text-sm
                    text-amber-300
                  "
                >
                  {warning}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-[#111113] border border-zinc-800 rounded-3xl p-6">
          <div className="mb-6">
            <p className="text-zinc-500 text-sm">
              Hallazgos
            </p>

            <h2 className="text-2xl font-black mt-2">
              Diagnóstico financiero
            </h2>
          </div>

          {(data.findings || []).length === 0 ? (
            <p className="text-zinc-500">
              No hay hallazgos registrados.
            </p>
          ) : (
            <div className="space-y-4">
              {data.findings?.map((finding, index) => (
                <div
                  key={`${finding.metric}-${index}`}
                  className="
                    bg-[#18181B]
                    border
                    border-zinc-800
                    rounded-2xl
                    p-5
                  "
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-bold">
                      {finding.metric}
                    </h3>

                    <span className="text-xs text-zinc-500 uppercase">
                      {finding.severity}
                    </span>
                  </div>

                  <p className="text-zinc-300 mt-3">
                    {finding.message}
                  </p>

                  {(finding.evidence || []).length > 0 && (
                    <div className="mt-3 space-y-1">
                      {finding.evidence?.map((evidence, evidenceIndex) => (
                        <p
                          key={`${evidence}-${evidenceIndex}`}
                          className="text-sm text-zinc-500"
                        >
                          {evidence}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="bg-[#111113] border border-zinc-800 rounded-3xl p-6">
        <div className="mb-6">
          <p className="text-zinc-500 text-sm">
            Disponibilidad
          </p>

          <h2 className="text-2xl font-black mt-2">
            Estados financieros
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#18181B] rounded-2xl p-5">
            <p className="text-zinc-500 text-sm">
              Estado de Resultados
            </p>
            <p className="font-bold mt-2">
              {incomeStatement?.available
                ? "Disponible"
                : "No disponible"}
            </p>
          </div>

          <div className="bg-[#18181B] rounded-2xl p-5">
            <p className="text-zinc-500 text-sm">
              Balance General
            </p>
            <p className="font-bold mt-2">
              {data.statements?.balanceSheet?.available
                ? "Disponible"
                : "No disponible"}
            </p>
          </div>

          <div className="bg-[#18181B] rounded-2xl p-5">
            <p className="text-zinc-500 text-sm">
              Flujo de Efectivo
            </p>
            <p className="font-bold mt-2">
              {data.statements?.cashFlow?.available
                ? "Disponible"
                : "No disponible"}
            </p>

            {data.statements?.cashFlow?.completeness !== undefined && (
              <p className="text-xs text-zinc-500 mt-2">
                Completitud:{" "}
                {data.statements.cashFlow.completeness}%
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
