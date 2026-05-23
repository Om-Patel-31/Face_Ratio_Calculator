type ScanPreviewProps = {
  label: string;
  accent?: "aurora" | "gold";
};

export function ScanPreview({ label, accent = "aurora" }: ScanPreviewProps) {
  return (
    <div className="glass-strong relative overflow-hidden rounded-[2rem] p-5">
      <div className="absolute inset-0 scan-grid opacity-40" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-white/50">{label}</p>
          <h3 className="mt-2 font-display text-2xl text-white">Precision face mapping</h3>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs ${accent === "aurora" ? "border-aurora-400/30 bg-aurora-400/10 text-aurora-50" : "border-gold-400/30 bg-gold-400/10 text-gold-300"}`}>
          Live scan
        </span>
      </div>
      <div className="relative mt-6 aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(67,240,209,0.18),transparent_24%),radial-gradient(circle_at_50%_70%,rgba(232,199,102,0.14),transparent_22%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_30%,transparent_70%,rgba(255,255,255,0.04))]" />
        <div className="absolute left-1/2 top-1/2 h-[72%] w-[62%] -translate-x-1/2 -translate-y-[46%] rounded-[42%_42%_46%_46%/34%_34%_58%_58%] border border-aurora-400/30 bg-gradient-to-b from-[#2c3648] via-[#162132] to-[#0a101a] shadow-[0_0_80px_rgba(67,240,209,0.05)]" />
        <div className="absolute left-1/2 top-[28%] h-24 w-20 -translate-x-1/2 rounded-[42%] bg-[radial-gradient(circle_at_50%_30%,rgba(255,224,198,0.85),rgba(196,170,140,0.7)_50%,rgba(72,62,58,0.65)_100%)] blur-[1px]" />
        <div className="absolute left-1/2 top-[49%] h-20 w-[30%] -translate-x-1/2 rounded-[50%] border border-white/10 bg-white/[0.03]" />
        <div className="absolute left-1/2 top-[66%] h-7 w-[26%] -translate-x-1/2 rounded-[100%] border border-aurora-400/30 bg-gradient-to-r from-aurora-400/12 via-white/5 to-gold-400/12" />
        {[
          "left-[48%] top-[37%]",
          "left-[57%] top-[37%]",
          "left-[42%] top-[53%]",
          "left-[62%] top-[53%]",
          "left-[50%] top-[44%]",
          "left-[50%] top-[56%]",
          "left-[44%] top-[69%]",
          "left-[56%] top-[69%]",
          "left-[38%] top-[51%]",
          "left-[66%] top-[51%]",
          "left-[30%] top-[74%]",
          "left-[70%] top-[74%]"
        ].map((position, index) => (
          <span
            key={index}
            className={`absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 bg-aurora-400 shadow-[0_0_14px_rgba(67,240,209,0.85)] ${position}`}
          />
        ))}
        <div className="absolute inset-0 animate-pulseRing rounded-[inherit] border border-aurora-400/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>
    </div>
  );
}
