import type { RatioMetric } from "@/lib/types";

type RadarChartProps = {
  metrics: RatioMetric[];
};

export function RadarChart({ metrics }: RadarChartProps) {
  const points = metrics.slice(0, 6).map((metric, index) => {
    const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
    const radius = 110 * (metric.score / 100);
    const x = 130 + Math.cos(angle) * radius;
    const y = 130 + Math.sin(angle) * radius;
    return `${x},${y}`;
  }).join(" ");

  const axes = metrics.slice(0, 6).map((metric, index) => {
    const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
    const x = 130 + Math.cos(angle) * 110;
    const y = 130 + Math.sin(angle) * 110;
    return { x, y, name: metric.name };
  });

  return (
    <div className="glass rounded-[2rem] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">Ratio radar</p>
          <h3 className="mt-1 font-display text-2xl text-white">Balance topology</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">
          6-axis view
        </span>
      </div>
      <div className="flex justify-center">
        <svg viewBox="0 0 260 260" className="h-[260px] w-[260px] overflow-visible">
          {[0.25, 0.5, 0.75, 1].map((level) => (
            <polygon
              key={level}
              points={axes.map((axis) => `${130 + (axis.x - 130) * level},${130 + (axis.y - 130) * level}`).join(" ")}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          ))}
          {axes.map((axis, index) => (
            <g key={axis.name}>
              <line x1="130" y1="130" x2={axis.x} y2={axis.y} stroke="rgba(67,240,209,0.14)" strokeWidth="1" />
              <text x={axis.x} y={axis.y} fill="rgba(234,242,255,0.65)" fontSize="10" textAnchor="middle" dy="-8">
                {index + 1}
              </text>
            </g>
          ))}
          <polygon points={points} fill="rgba(67,240,209,0.2)" stroke="rgba(67,240,209,0.95)" strokeWidth="2" />
          {metrics.slice(0, 6).map((metric, index) => {
            const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
            const radius = 110 * (metric.score / 100);
            const x = 130 + Math.cos(angle) * radius;
            const y = 130 + Math.sin(angle) * radius;
            return <circle key={metric.name} cx={x} cy={y} r="4" fill="rgba(232,199,102,0.95)" />;
          })}
        </svg>
      </div>
    </div>
  );
}
