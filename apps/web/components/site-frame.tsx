import Link from "next/link";

const navItems = [
  { href: "/upload", label: "Scan" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/report", label: "Report" },
  { href: "/progress", label: "Progress" },
  { href: "/settings", label: "Settings" }
];

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[28rem] bg-gradient-to-b from-aurora-500/10 via-transparent to-transparent blur-3xl" />
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-glow transition duration-300 group-hover:scale-105">
            <div className="h-3.5 w-3.5 rounded-full bg-gradient-to-br from-aurora-400 to-gold-400" />
          </div>
          <div>
            <p className="font-display text-lg tracking-wide text-white">FaceRatio AI</p>
            <p className="text-xs uppercase tracking-[0.28em] text-white/42">Aesthetic analysis lab</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-white/72 transition hover:border-white/16 hover:bg-white/[0.08] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">{children}</main>
      <footer className="relative z-10 mx-auto max-w-7xl px-4 pb-8 text-xs text-white/35 sm:px-6 lg:px-8">
        FaceRatio AI presents approximate analytical insights only. Beauty is subjective.
      </footer>
    </div>
  );
}
