import { Sparkles } from "lucide-react";

export function AdviceList({ items }: { items: string[] }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-cyan" />
        <p className="text-[11px] uppercase tracking-[0.35em] text-muted">Looksmaxing advisor</p>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm leading-6 text-white/78">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
