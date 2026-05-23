import type { RatioMetric } from "@/lib/types";

type RatioTableProps = {
  metrics: RatioMetric[];
};

export function RatioTable({ metrics }: RatioTableProps) {
  return (
    <div className="glass rounded-[2rem] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">Metric table</p>
          <h3 className="mt-1 font-display text-2xl text-white">Golden ratio alignment</h3>
        </div>
        <span className="text-sm text-white/55">Approximate only</span>
      </div>
      <div className="space-y-3">
        {metrics.map((metric) => (
          <div key={metric.name} className="rounded-2xl border border-white/8 bg-white/3 p-4 transition hover:border-white/14 hover:bg-white/[0.06]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-white">{metric.name}</p>
                <p className="mt-1 text-sm text-white/55">{metric.note}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-xl text-white">{metric.score.toFixed(1)}%</p>
                <p className="text-xs text-white/45">Target {metric.target.toFixed(2)}</p>
              </div>
            </div>
            <svg viewBox="0 0 100 8" className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/6">
              <rect x="0" y="0" width="100" height="8" rx="4" fill="rgba(255,255,255,0.04)" />
              <rect x="0" y="0" width={Math.max(8, metric.score)}" height="8" rx="4" fill="url(#ratioGradient)" />
              <defs>
                <linearGradient id="ratioGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#43f0d1" />
                  <stop offset="55%" stopColor="#7ee6ff" />
                  <stop offset="100%" stopColor="#e8c766" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
