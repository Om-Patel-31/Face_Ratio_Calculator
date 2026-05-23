"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";

export type RadarDatum = {
  subject: string;
  score: number;
  fullMark: number;
};

export function RadarVisual({ data }: { data: RadarDatum[] }) {
  return (
    <div className="h-80 rounded-[28px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-2xl">
      <div className="mb-4 flex items-center justify-between px-1">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-muted">Harmony radar</p>
          <p className="mt-1 text-sm text-white/70">Golden ratio, symmetry, and facial balance</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.10)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.78)", fontSize: 12 }} />
          <Radar
            dataKey="score"
            stroke="#53e6ff"
            fill="rgba(83,230,255,0.34)"
            fillOpacity={1}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(7, 11, 22, 0.9)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 16,
              color: "white"
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
