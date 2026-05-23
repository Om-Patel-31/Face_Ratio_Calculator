import { AdvicePanel } from "@/components/advice-panel";
import { SiteFrame } from "@/components/site-frame";
import { demoAnalysis } from "@/lib/mock-analysis";

export default function ReportPage() {
  return (
    <SiteFrame>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass rounded-[2rem] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">AI report</p>
          <h1 className="mt-2 font-display text-4xl text-white">Analytical summary</h1>
          <div className="mt-6 space-y-4 text-white/72 leading-8">
            <p>Facial Harmony: {demoAnalysis.harmonyScore.toFixed(1)}/100</p>
            <p>Symmetry: {demoAnalysis.symmetryScore}%</p>
            <p>Golden Ratio Match: {demoAnalysis.goldenRatioMatch}%</p>
            <p>Skin Quality Estimate: {demoAnalysis.skinQualityScore.toFixed(1)}/10</p>
            <p>Confidence: {demoAnalysis.confidence}%</p>
          </div>
          <div className="mt-6 rounded-3xl border border-white/8 bg-white/[0.04] p-5">
            <p className="text-sm uppercase tracking-[0.26em] text-white/45">Disclaimers</p>
            <div className="mt-3 space-y-2 text-sm leading-7 text-white/65">
              {demoAnalysis.disclaimer.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </section>
        <AdvicePanel title="Optimized next steps" suggestions={demoAnalysis.recommendations} />
      </div>
      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-[2rem] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">Download</p>
          <h2 className="mt-2 font-display text-2xl text-white">PDF / JSON report</h2>
          <p className="mt-4 text-sm leading-7 text-white/70">Reports can be exported with annotated metrics, landmark overlays, and recommendation summaries.</p>
        </div>
        <div className="glass rounded-[2rem] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">Explainability</p>
          <h2 className="mt-2 font-display text-2xl text-white">Metric provenance</h2>
          <p className="mt-4 text-sm leading-7 text-white/70">Each score is backed by ratio math, landmark confidence, and normalized confidence bands.</p>
        </div>
        <div className="glass rounded-[2rem] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">Premium tone</p>
          <h2 className="mt-2 font-display text-2xl text-white">Supportive language</h2>
          <p className="mt-4 text-sm leading-7 text-white/70">The report language avoids shaming, insult, or harmful framing by design.</p>
        </div>
      </section>
    </SiteFrame>
  );
}
