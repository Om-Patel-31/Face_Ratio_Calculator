import { AdvicePanel } from "@/components/advice-panel";
import { ScanPreview } from "@/components/scan-preview";
import { SiteFrame } from "@/components/site-frame";

const uploadSteps = [
  "Upload a front-facing image with even lighting.",
  "Optionally connect the webcam for live landmark extraction.",
  "FaceRatio AI detects landmarks, maps ratios, and generates an advisory report."
];

const advice = [
  "Use soft front lighting to minimize harsh shadow falloff across the midface.",
  "Keep the head level and camera centered to preserve landmark accuracy.",
  "A plain background improves face segmentation and overlay precision."
];

export default function UploadPage() {
  return (
    <SiteFrame>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="glass rounded-[2rem] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">Input</p>
          <h1 className="mt-2 font-display text-4xl text-white">Upload or camera capture</h1>
          <div className="mt-6 space-y-4">
            {uploadSteps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/8 bg-white/4 p-4 text-white/75">
                <span className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-aurora-400/15 text-sm text-aurora-50">{index + 1}</span>
                <p className="mt-2 leading-7">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-3xl border border-dashed border-white/12 bg-white/[0.03] p-6 text-center text-white/60">
            Drag and drop is ready in the production build. Camera stream and local file input can attach to the shared analysis pipeline.
          </div>
        </section>
        <ScanPreview label="Upload scan" accent="gold" />
      </div>
      <section className="mt-6 lg:max-w-3xl">
        <AdvicePanel title="Preview-level suggestions" suggestions={advice} />
      </section>
    </SiteFrame>
  );
}
