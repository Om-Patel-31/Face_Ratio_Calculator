const progressData = [
  { label: "Golden ratio", value: 87, delta: "+6" },
  { label: "Symmetry", value: 91, delta: "+4" },
  { label: "Harmony", value: 82, delta: "+7" },
  { label: "Skin clarity", value: 78, delta: "+3" }
];

export function ProgressTimeline() {
  return (
    <div className="glass rounded-[2rem] p-5">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/45">Progress tracking</p>
        <h3 className="mt-2 font-display text-2xl text-white">Trend over time</h3>
      </div>
      <div className="space-y-4">
        {progressData.map((item) => {
            const gradientId = `progress-gradient-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

            return (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-white/80">{item.label}</span>
              <span className="text-white/45">{item.delta}</span>
            </div>
            <svg viewBox="0 0 100 12" className="h-3 w-full overflow-hidden rounded-full bg-white/6">
              <rect x="0" y="0" width="100" height="12" rx="6" fill="rgba(255,255,255,0.04)" />
              <rect x="0" y="0" width={item.value} height="12" rx="6" fill={`url(#${gradientId})`} />
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#43f0d1" />
                  <stop offset="60%" stopColor="#7ee6ff" />
                  <stop offset="100%" stopColor="#e8c766" />
                </linearGradient>
              </defs>
            </svg>
          </div>
            );
          })}
      </div>
    </div>
  );
}
