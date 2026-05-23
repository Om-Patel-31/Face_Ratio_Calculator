import { cn } from "@/components/utils";

export function MetricCard({
  label,
  value,
  subtitle,
  accent = false
}: {
  label: string;
  value: string;
  subtitle: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] border p-5 backdrop-blur-2xl transition duration-300 hover:-translate-y-1",
        accent ? "border-cyan/20 bg-cyan/10 shadow-[0_0_45px_rgba(83,230,255,0.12)]" : "border-white/10 bg-white/[0.04]"
      )}
    >
      <p className="text-[11px] uppercase tracking-[0.35em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>
    </div>
  );
}
