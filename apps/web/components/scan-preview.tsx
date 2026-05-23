import type { LandmarkPoint } from "@/lib/types";

type ScanPreviewProps = {
  label: string;
  accent?: "aurora" | "gold";
  imageSrc?: string;
  imageAlt?: string;
  subtitle?: string;
  statusLabel?: string;
  landmarks?: LandmarkPoint[];
  connections?: Array<LandmarkPoint[]>;
};

const fallbackLandmarks = [
  { x: 0.48, y: 0.37 },
  { x: 0.57, y: 0.37 },
  { x: 0.42, y: 0.53 },
  { x: 0.62, y: 0.53 },
  { x: 0.5, y: 0.46 },
  { x: 0.5, y: 0.59 },
  { x: 0.44, y: 0.69 },
  { x: 0.56, y: 0.69 }
];

export function ScanPreview(props: ScanPreviewProps) {
  const { label, accent = "aurora", imageSrc, imageAlt = "Processed face preview", subtitle = "Live scan", statusLabel = "Live scan", landmarks, connections } = props;
  const points = landmarks?.length ? landmarks : fallbackLandmarks;

  return (
    <div className="glass-strong relative overflow-hidden rounded-[2rem] p-5">
      <div className="absolute inset-0 scan-grid opacity-40" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-white/50">{label}</p>
          <h3 className="mt-2 font-display text-2xl text-white">Precision face mapping</h3>
          <p className="mt-2 text-sm leading-6 text-white/60">{subtitle}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs ${accent === "aurora" ? "border-aurora-400/30 bg-aurora-400/10 text-aurora-50" : "border-gold-400/30 bg-gold-400/10 text-gold-300"}`}>
          {statusLabel}
        </span>
      </div>
      <div className="relative mt-6 aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-black">
        {imageSrc ? (
          <img src={imageSrc} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(67,240,209,0.18),transparent_24%),radial-gradient(circle_at_50%_70%,rgba(232,199,102,0.14),transparent_22%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_30%,transparent_70%,rgba(255,255,255,0.04))]" />
        <div className="absolute left-1/2 top-1/2 h-[72%] w-[62%] -translate-x-1/2 -translate-y-[46%] rounded-[42%_42%_46%_46%/34%_34%_58%_58%] border border-aurora-400/30 bg-gradient-to-b from-[#2c3648] via-[#162132] to-[#0a101a] shadow-[0_0_80px_rgba(67,240,209,0.05)]" />
        <div className="absolute left-1/2 top-[28%] h-24 w-20 -translate-x-1/2 rounded-[42%] bg-[radial-gradient(circle_at_50%_30%,rgba(255,224,198,0.85),rgba(196,170,140,0.7)_50%,rgba(72,62,58,0.65)_100%)] blur-[1px]" />
        <div className="absolute left-1/2 top-[49%] h-20 w-[30%] -translate-x-1/2 rounded-[50%] border border-white/10 bg-white/[0.03]" />
        <div className="absolute left-1/2 top-[66%] h-7 w-[26%] -translate-x-1/2 rounded-[100%] border border-aurora-400/30 bg-gradient-to-r from-aurora-400/12 via-white/5 to-gold-400/12" />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          {connections?.map((conn, i) => {
            const d = conn.map((p) => `${p.x * 100},${p.y * 100}`).join(" ");
            return <polyline key={`conn-${i}`} points={d} fill="none" stroke="#43f0d1" strokeWidth="0.5" strokeOpacity={0.9} strokeLinecap="round" strokeLinejoin="round" />;
          })}
          {points.map((point, index) => (
            <circle key={`${point.x}-${point.y}-${index}`} cx={point.x * 100} cy={point.y * 100} r="1.25" fill="#43f0d1" stroke="rgba(255,255,255,0.8)" strokeWidth="0.35" />
          ))}
        </svg>
        <div className="absolute inset-0 animate-pulseRing rounded-[inherit] border border-aurora-400/25" />
        {imageSrc ? <div className="absolute inset-x-4 bottom-4 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs tracking-[0.2em] text-white/70">Post-processing overlay active</div> : null}
      </div>
    </div>
  );
}
