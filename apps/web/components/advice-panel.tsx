type AdvicePanelProps = {
  title?: string;
  suggestions: string[];
};

export function AdvicePanel({ title = "AI looksmaxing advisor", suggestions }: AdvicePanelProps) {
  return (
    <div className="glass rounded-[2rem] p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-white/45">Supportive guidance</p>
      <h3 className="mt-2 font-display text-2xl text-white">{title}</h3>
      <div className="mt-5 space-y-3">
        {suggestions.map((item) => (
          <div key={item} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-4 text-sm leading-6 text-white/75 transition hover:border-white/15 hover:bg-white/[0.08]">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
