type MetricRingProps = {
  label: string;
  value: number;
  accent?: "aurora" | "gold";
  suffix?: string;
};

export function MetricRing({ label, value, accent = "aurora", suffix = "%" }: MetricRingProps) {
  const stroke = accent === "aurora" ? "stroke-[rgba(67,240,209,0.9)]" : "stroke-[rgba(232,199,102,0.95)]";
  const track = "stroke-[rgba(255,255,255,0.08)]";
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (Math.min(value, 100) / 100) * circumference;

  return (
    <div className="glass rounded-3xl p-5 shadow-glow">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">{label}</p>
          <p className="mt-2 font-display text-3xl text-white">{value.toFixed(1)}{suffix}</p>
        </div>
        <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
          <circle cx="56" cy="56" r={radius} className={track} strokeWidth="10" fill="none" />
          <circle
            cx="56"
            cy="56"
            r={radius}
            className={stroke}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
      </div>
    </div>
  );
}
