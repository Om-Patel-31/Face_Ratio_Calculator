"use client";

import { motion } from "framer-motion";

export function ScoreRing({ value, label, tone = "#53e6ff" }: { value: number; label: string; tone?: string }) {
  const circumference = 2 * Math.PI * 46;
  const offset = circumference - (clamp(value, 0, 100) / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
          <motion.circle
            cx="60"
            cy="60"
            r="46"
            fill="none"
            stroke={tone}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 16px rgba(83,230,255,0.25))" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-white/[0.03]">
          <span className="text-3xl font-semibold text-white">{value}</span>
          <span className="text-[11px] uppercase tracking-[0.3em] text-muted">{label}</span>
        </div>
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
