import { AdvicePanel } from "@/components/advice-panel";
import { MetricRing } from "@/components/metric-ring";
import { RadarChart } from "@/components/radar-chart";
import { RatioTable } from "@/components/ratio-table";
import { ScanPreview } from "@/components/scan-preview";
import { SiteFrame } from "@/components/site-frame";
import { demoAnalysis } from "@/lib/mock-analysis";

export default function DashboardPage() {
  return (
    <SiteFrame>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.25fr]">
        <ScanPreview label="Active analysis" />
        <div className="grid gap-4 sm:grid-cols-2">
          <MetricRing label="Facial harmony" value={demoAnalysis.harmonyScore} />
          <MetricRing label="Balance score" value={demoAnalysis.balanceScore} accent="gold" />
          <MetricRing label="Skin quality" value={demoAnalysis.skinQualityScore * 10} />
          <MetricRing label="Confidence" value={demoAnalysis.confidence} accent="gold" />
        </div>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <RadarChart metrics={demoAnalysis.metrics} />
        <AdvicePanel suggestions={demoAnalysis.recommendations} />
      </div>
      <div className="mt-6">
        <RatioTable metrics={demoAnalysis.metrics} />
      </div>
      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-[2rem] p-6 lg:col-span-2">
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">AI score</p>
          <h2 className="mt-2 font-display text-3xl text-white">{demoAnalysis.attractivenessScore.toFixed(1)}/10 facial harmony</h2>
          <p className="mt-4 max-w-3xl text-white/70 leading-8">
            The current scan shows a strong balance profile with high confidence in symmetry and above-average ratio alignment. The output is intentionally framed as an estimate rather than a fixed judgment.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-sm text-white/70">Golden ratio compatibility: {demoAnalysis.goldenRatioMatch}%</div>
            <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-sm text-white/70">Symmetry confidence: {demoAnalysis.symmetryScore}%</div>
            <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-sm text-white/70">Estimated age: {demoAnalysis.ageEstimate}</div>
          </div>
        </div>
        <div className="glass rounded-[2rem] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">Comparison</p>
          <h3 className="mt-2 font-display text-2xl text-white">Before / after mode</h3>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <p>Drop in a second image to compare the same facial map across different lighting, angles, or grooming states.</p>
            <p>The platform normalizes for scale so ratio deltas remain readable.</p>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
