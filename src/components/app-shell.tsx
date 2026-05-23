"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, BrainCircuit, Camera, ChartNoAxesCombined, Layers3, Settings2, Sparkles, SquareUserRound } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/components/utils";

const navigation = [
  { href: "/", label: "Landing", icon: Sparkles },
  { href: "/upload", label: "Upload", icon: Camera },
  { href: "/dashboard", label: "Dashboard", icon: ChartNoAxesCombined },
  { href: "/report", label: "AI Report", icon: BrainCircuit },
  { href: "/progress", label: "Progress", icon: Layers3 },
  { href: "/settings", label: "Settings", icon: Settings2 }
];

export function AppShell({
  title,
  subtitle,
  children,
  actionHref = "/upload",
  actionLabel = "Start scan"
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  actionHref?: string;
  actionLabel?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen overflow-hidden bg-base text-text">
      <div className="pointer-events-none absolute inset-0 bg-aurora opacity-90" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(83,230,255,0.13),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(216,184,106,0.14),transparent_25%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 flex-col rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-soft backdrop-blur-2xl lg:flex">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 shadow-glow">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan/90 to-gold/90 text-slate-950 shadow-[0_0_40px_rgba(83,230,255,0.28)]">
              <SquareUserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-muted">FaceRatio AI</p>
              <p className="text-sm text-white/80">Aesthetic intelligence suite</p>
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition duration-300",
                    active
                      ? "border-cyan/30 bg-cyan/10 text-white shadow-[0_0_0_1px_rgba(83,230,255,0.12)]"
                      : "border-white/5 bg-white/[0.02] text-muted hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-[24px] border border-white/10 bg-white/[0.03] p-4 text-sm text-muted">
            <p className="text-white/80">Beauty is subjective.</p>
            <p className="mt-2 leading-6">Results are AI-generated estimates designed to help with presentation, framing, and proportion awareness.</p>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-6">
          <header className="flex items-center justify-between rounded-[28px] border border-white/10 bg-white/[0.04] px-5 py-4 shadow-soft backdrop-blur-2xl">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-cyan/80">Premium face analytics</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted md:block">
                v1.0 preview
              </div>
              <Link
                href={actionHref}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:scale-[1.02]"
              >
                {actionLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </header>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="min-h-0 flex-1"
          >
            {children}
          </motion.section>
        </main>
      </div>
    </div>
  );
}
