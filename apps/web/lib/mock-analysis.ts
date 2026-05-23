import type { AnalysisResult } from "./types";
import { deriveRatioMetrics } from "./ratio-formulas";

const landmarkSeed = {
  forehead: { x: 0.5, y: 0.12 },
  brow: { x: 0.5, y: 0.25 },
  noseBridge: { x: 0.5, y: 0.38 },
  noseBase: { x: 0.5, y: 0.53 },
  chin: { x: 0.5, y: 0.89 },
  leftCheek: { x: 0.2, y: 0.5 },
  rightCheek: { x: 0.8, y: 0.5 },
  leftEyeInner: { x: 0.42, y: 0.3 },
  leftEyeOuter: { x: 0.34, y: 0.3 },
  rightEyeInner: { x: 0.58, y: 0.3 },
  rightEyeOuter: { x: 0.66, y: 0.3 },
  noseLeft: { x: 0.45, y: 0.48 },
  noseRight: { x: 0.55, y: 0.48 },
  mouthLeft: { x: 0.38, y: 0.66 },
  mouthRight: { x: 0.62, y: 0.66 },
  mouthUpper: { x: 0.5, y: 0.63 },
  mouthLower: { x: 0.5, y: 0.69 },
  jawLeft: { x: 0.27, y: 0.78 },
  jawRight: { x: 0.73, y: 0.78 }
};

const ratioPack = deriveRatioMetrics(landmarkSeed);

export const demoAnalysis: AnalysisResult = {
  scanId: "scan_demo_042",
  attractivenessScore: 8.2,
  symmetryScore: 91,
  harmonyScore: ratioPack.harmonyScore,
  goldenRatioMatch: ratioPack.goldenRatioCompatibility,
  balanceScore: ratioPack.facialBalance,
  skinQualityScore: 7.8,
  ageEstimate: 27,
  confidence: 86,
  metrics: ratioPack.metrics,
  recommendations: [
    "A softly structured hairstyle with side volume would increase vertical balance in photos.",
    "Use a slightly higher key light angle to reduce shadow compression around the midface.",
    "Neutral-toned clothing near the collar can help the jawline read cleaner in portrait framing.",
    "A short grooming routine focused on skin texture consistency can improve perceived clarity in future scans."
  ],
  disclaimer: [
    "Beauty is subjective.",
    "Results are AI-generated estimates.",
    "This report should be used as approximate analysis, not a value judgment."
  ]
};
