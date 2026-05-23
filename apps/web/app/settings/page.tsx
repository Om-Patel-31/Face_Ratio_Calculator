import { SiteFrame } from "@/components/site-frame";

const settingsSections = [
  {
    title: "Analysis preferences",
    items: ["Enable live webcam scan", "Auto-generate report cards", "Show landmark confidence overlays"]
  },
  {
    title: "Privacy controls",
    items: ["Store scans locally only", "Auto-delete raw images after report", "Use anonymous profile mode"]
  },
  {
    title: "Model options",
    items: ["Use balanced confidence scoring", "Prefer fast inference mode", "Enable experimental glow-up simulator"]
  }
];

export default function SettingsPage() {
  return (
    <SiteFrame>
      <section className="glass rounded-[2rem] p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-white/45">Settings</p>
        <h1 className="mt-2 font-display text-4xl text-white">Configure the lab</h1>
        <p className="mt-4 max-w-3xl text-white/70 leading-8">
          These controls are designed for a privacy-aware, production deployment. The UI is structured to let users choose how much data is stored, how the model runs, and which advisory features are visible.
        </p>
      </section>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {settingsSections.map((section) => (
          <section key={section.title} className="glass rounded-[2rem] p-6">
            <h2 className="font-display text-2xl text-white">{section.title}</h2>
            <div className="mt-4 space-y-3">
              {section.items.map((item) => (
                <label key={item} className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-4 text-sm text-white/75">
                  <span>{item}</span>
                  <span className="h-5 w-10 rounded-full border border-white/10 bg-white/10 p-1">
                    <span className="block h-full w-1/2 rounded-full bg-gradient-to-r from-aurora-400 to-gold-400" />
                  </span>
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>
    </SiteFrame>
  );
}
