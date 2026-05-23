import Link from "next/link";
import { AnimatedOrb } from "@/components/animated-orb";
import { MetricRing } from "@/components/metric-ring";
import { ScanPreview } from "@/components/scan-preview";
import { SiteFrame } from "@/components/site-frame";
import { demoAnalysis } from "@/lib/mock-analysis";

const highlights = [
  "MediaPipe-style landmark mapping",
  "Golden ratio compatibility scoring",
  "Supportive AI guidance with confidence bands",
  "Real-time, premium dashboard presentation"
];

export default function LandingPage() {
  return (
    <SiteFrame>
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(8,17,31,0.92),rgba(7,12,22,0.82))] px-6 py-8 shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:px-8 lg:px-10">
        <AnimatedOrb />
        <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-aurora-400/20 bg-aurora-400/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-aurora-50">
              AI facial aesthetics lab
            </div>
            <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[0.95] text-white sm:text-6xl lg:text-7xl">
              Premium facial analysis with scientific framing.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              FaceRatio AI combines facial landmark detection, ratio math, and explainable scoring to produce approximate, supportive aesthetic insights from uploaded images or live camera capture.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/upload" className="rounded-full bg-gradient-to-r from-aurora-400 to-emerald-300 px-6 py-3 font-semibold text-ink-950 shadow-glow transition hover:scale-[1.01]">
                Start scan
              </Link>
              <Link href="/dashboard" className="rounded-full border border-white/12 bg-white/5 px-6 py-3 font-semibold text-white/85 transition hover:border-white/20 hover:bg-white/10">
                View dashboard
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white/75 backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <ScanPreview label="Landing preview" />
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <MetricRing label="Attractiveness" value={demoAnalysis.attractivenessScore * 10} accent="gold" suffix="/100" />
        <MetricRing label="Symmetry" value={demoAnalysis.symmetryScore} />
        <MetricRing label="Golden ratio match" value={demoAnalysis.goldenRatioMatch} accent="gold" />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass rounded-[2rem] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">Why it feels premium</p>
          <h2 className="mt-2 font-display text-3xl text-white">A startup-grade aesthetic intelligence workspace</h2>
          <p className="mt-4 max-w-3xl text-white/70 leading-8">
            The platform is designed to feel like a luxury AI lab while keeping the analysis language calm, precise, and non-judgmental. It is built for a production stack with a web client, API, ML microservice, and database-backed reporting.
          </p>
        </div>
        <div className="glass rounded-[2rem] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">Safety</p>
          <h2 className="mt-2 font-display text-3xl text-white">Ethics-first scoring</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/70">
            <p>Beauty is subjective.</p>
            <p>Results are AI-generated estimates.</p>
            <p>All metrics are approximate and should be used as advisory context only.</p>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
