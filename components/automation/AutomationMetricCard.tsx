interface AutomationMetricCardProps {
  title: string;
  value: string | number;
}

export default function AutomationMetricCard({
  title,
  value,
}: AutomationMetricCardProps) {
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
      <div className="text-zinc-500">
        {title}
      </div>

      <div className="text-4xl font-black mt-2">
        {value}
      </div>
    </div>
  );
}