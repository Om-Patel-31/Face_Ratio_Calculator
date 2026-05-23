import { calculateFaceMetrics, clamp, summarizeMetrics } from "@/lib/face-math";
import type { FaceAnalysis, ScanInput, Vec2 } from "@/types/analysis";

function createNarrative(harmony: number, symmetry: number) {
  const narratives = [
    {
      title: "Structural harmony",
      description: harmony >= 80 ? "The facial proportions read as exceptionally balanced in the current frame." : "The structure is stable, with room to refine proportion continuity across the facial thirds."
    },
    {
      title: "Symmetry confidence",
      description: symmetry >= 85 ? "Left-right balance is strong enough for a confident analytical read." : "The scan suggests natural asymmetry that can be softened by lighting, angle, and posture."
    },
    {
      title: "Aesthetic signal",
      description: "The model treats this as an approximate beauty-analysis estimate, not a verdict."
    }
  ];

  return narratives;
}

function buildRecommendations(metrics: ReturnType<typeof calculateFaceMetrics>, harmony: number, symmetry: number) {
  const notes: string[] = [];
  if (harmony < 75) notes.push("Use frontal lighting and a slightly elevated camera angle to refine ratio presentation.");
  if (symmetry < 80) notes.push("Keep the head level and avoid lens distortion for a cleaner symmetry read.");
  if (metrics.find((metric) => metric.label === "Eye spacing" && metric.score < 70)) notes.push("Use a tighter crop to center the eyes and emphasize interocular balance.");
  if (metrics.find((metric) => metric.label === "Jaw proportion" && metric.score < 70)) notes.push("A sharper neckline, better posture, and side-lit portrait framing can strengthen jaw definition.");
  if (notes.length === 0) notes.push("The current composition already presents a strong baseline for a premium portrait analysis.");
  return notes;
}

function estimateAge(landmarks: Vec2[]) {
  const variance = landmarks.reduce((sum, point) => sum + Math.abs(point.y - 0.5), 0) / Math.max(landmarks.length, 1);
  const age = 22 + variance * 40;
  return clamp(Math.round(age), 18, 42);
}

export function analyzeFace(input: ScanInput): FaceAnalysis {
  const metrics = calculateFaceMetrics(input.landmarks, input.imageWidth, input.imageHeight);
  const { harmony, compatibility, balance } = summarizeMetrics(metrics);
  const symmetry = clamp(Math.round((metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length) * 0.93 + 6), 0, 100);
  const attractivenessScore = clamp(Number((harmony * 0.062 + symmetry * 0.025 + compatibility * 0.028).toFixed(1)), 1, 10);
  const skinQuality = clamp(Math.round(74 + harmony * 0.18), 0, 100);
  const confidence = clamp(Math.round(76 + metrics.length * 1.8), 0, 99);

  return {
    attractivenessScore,
    symmetryScore: symmetry,
    goldenRatioMatch: compatibility,
    harmonyScore: harmony,
    balanceScore: balance,
    confidence,
    skinQuality,
    ageEstimate: estimateAge(input.landmarks),
    ratios: metrics,
    notes: createNarrative(harmony, symmetry),
    recommendations: buildRecommendations(metrics, harmony, symmetry),
    landmarkCount: input.landmarks.length
  };
}
