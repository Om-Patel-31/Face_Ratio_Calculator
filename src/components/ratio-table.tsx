import type { FaceMetric } from "@/types/analysis";

export function RatioTable({ metrics }: { metrics: FaceMetric[] }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-[11px] uppercase tracking-[0.35em] text-muted">Facial ratios</p>
      </div>
      <div className="divide-y divide-white/5">
        {metrics.map((metric) => (
          <div key={metric.label} className="grid gap-3 px-5 py-4 md:grid-cols-[1.2fr,0.8fr,0.7fr,1fr] md:items-center">
            <div>
              <p className="font-medium text-white">{metric.label}</p>
              <p className="text-sm text-muted">{metric.description}</p>
            </div>
            <div className="text-sm text-white/80">
              <span className="text-muted">Value:</span> {metric.value.toFixed(2)}
            </div>
            <div className="text-sm text-white/80">
              <span className="text-muted">Target:</span> {metric.target.toFixed(2)}
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted">
                <span>Compatibility</span>
                <span>{metric.score}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan via-gold to-rose" style={{ width: `${metric.score}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
