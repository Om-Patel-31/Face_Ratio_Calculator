import { ProgressTimeline } from "@/components/progress-timeline";
import { SiteFrame } from "@/components/site-frame";

export default function ProgressPage() {
  return (
    <SiteFrame>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="glass rounded-[2rem] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">Progress tracking</p>
          <h1 className="mt-2 font-display text-4xl text-white">Aesthetic trends over time</h1>
          <p className="mt-4 text-white/70 leading-8">
            Track ratio improvements, photo-quality consistency, and landmark confidence across multiple scans. The timeline is built for monthly review and coaching-style summaries.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-sm text-white/70">Multi-angle support</div>
            <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-sm text-white/70">Scans grouped by date</div>
            <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-sm text-white/70">Goal-based progress bars</div>
            <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-sm text-white/70">Exportable report history</div>
          </div>
        </section>
        <ProgressTimeline />
      </div>
    </SiteFrame>
  );
}
