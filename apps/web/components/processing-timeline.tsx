type ProcessingStep = {
  title: string;
  detail: string;
};

type ProcessingTimelineProps = {
  steps: ProcessingStep[];
  currentIndex: number;
  title?: string;
  subtitle?: string;
};

export function ProcessingTimeline({
  steps,
  currentIndex,
  title = "Post-image processing",
  subtitle = "Every scan runs through the same normalization and landmark overlay flow."
}: ProcessingTimelineProps) {
  return (
    <div className="glass rounded-[2rem] p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-white/45">Pipeline</p>
      <h3 className="mt-2 font-display text-2xl text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/60">{subtitle}</p>
      <div className="mt-5 space-y-3">
        {steps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const statusLabel = isComplete ? "Complete" : isCurrent ? "Running" : "Queued";

          return (
            <div key={step.title} className="rounded-2xl border border-white/8 bg-white/4 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm ${isComplete ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100" : isCurrent ? "border-aurora-300/30 bg-aurora-300/10 text-aurora-50" : "border-white/10 bg-white/5 text-white/45"}`}>
                      {index + 1}
                    </span>
                    <p className="font-medium text-white">{step.title}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/60">{step.detail}</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${isComplete ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100" : isCurrent ? "border-aurora-300/20 bg-aurora-300/10 text-aurora-50" : "border-white/10 bg-white/5 text-white/45"}`}>
                  {statusLabel}
                </span>
              </div>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/6">
                <div className={`h-full rounded-full ${isComplete ? "w-full bg-gradient-to-r from-emerald-300 to-aurora-400" : isCurrent ? "w-3/4 bg-gradient-to-r from-aurora-400 to-gold-400" : "w-0 bg-white/20"}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
