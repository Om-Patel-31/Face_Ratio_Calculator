import type { ScanAnalysis, ScanRequest } from "../types";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function safePoint(landmarks: ScanRequest["landmarks"], key: string) {
  return landmarks[key] ?? { x: 0, y: 0 };
}

function safeDivide(numerator: number, denominator: number, fallback = 0) {
  return denominator === 0 ? fallback : numerator / denominator;
}

function score(actual: number, target: number) {
  if (target === 0) {
    return 0;
  }

  return Number((Math.max(0, 1 - Math.abs(actual - target) / target) * 100).toFixed(1));
}

export function analyzeScanPayload(payload: ScanRequest): ScanAnalysis {
  const { landmarks, ageHint = 27 } = payload;
  const forehead = safePoint(landmarks, "forehead");
  const brow = safePoint(landmarks, "brow");
  const noseBase = safePoint(landmarks, "noseBase");
  const chin = safePoint(landmarks, "chin");
  const leftCheek = safePoint(landmarks, "leftCheek");
  const rightCheek = safePoint(landmarks, "rightCheek");
  const leftEyeInner = safePoint(landmarks, "leftEyeInner");
  const leftEyeOuter = safePoint(landmarks, "leftEyeOuter");
  const rightEyeInner = safePoint(landmarks, "rightEyeInner");
  const noseLeft = safePoint(landmarks, "noseLeft");
  const noseRight = safePoint(landmarks, "noseRight");
  const mouthLeft = safePoint(landmarks, "mouthLeft");
  const mouthRight = safePoint(landmarks, "mouthRight");
  const jawLeft = safePoint(landmarks, "jawLeft");
  const jawRight = safePoint(landmarks, "jawRight");

  const faceHeight = Math.abs(chin.y - forehead.y);
  const faceWidth = Math.abs(leftCheek.x - rightCheek.x);
  const eyeSpacing = Math.abs(rightEyeInner.x - leftEyeInner.x);
  const eyeWidth = Math.abs(leftEyeOuter.x - leftEyeInner.x);
  const noseWidth = Math.abs(noseLeft.x - noseRight.x);
  const mouthWidth = Math.abs(mouthLeft.x - mouthRight.x);
  const lowerThird = Math.abs(chin.y - noseBase.y);
  const midface = Math.abs(noseBase.y - brow.y);
  const jawWidth = Math.abs(jawLeft.x - jawRight.x);

  const metrics = [
    { name: "Face length-to-width", actual: safeDivide(faceHeight, faceWidth), target: 1.55 },
    { name: "Eye spacing ratio", actual: safeDivide(eyeSpacing, eyeWidth), target: 1 },
    { name: "Nose width ratio", actual: safeDivide(noseWidth, faceWidth), target: 0.28 },
    { name: "Mouth balance", actual: safeDivide(mouthWidth, jawWidth), target: 0.62 },
    { name: "Midface ratio", actual: safeDivide(midface, lowerThird), target: 1 },
    { name: "Lower third ratio", actual: safeDivide(lowerThird, faceHeight), target: 0.35 }
  ].map((metric) => ({ ...metric, score: score(metric.actual, metric.target) }));

  const goldenRatioScore = Number((metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length).toFixed(1));
  const symmetryScore = Number(clamp(100 - Math.abs(leftEyeInner.y - rightEyeInner.y) * 120 - Math.abs(mouthLeft.y - mouthRight.y) * 90, 0, 100).toFixed(1));
  const harmonyScore = Number(clamp((goldenRatioScore * 0.52) + (symmetryScore * 0.32) + 12, 0, 100).toFixed(1));
  const balanceScore = Number(clamp((metrics[0].score * 0.34) + (metrics[5].score * 0.33) + (metrics[3].score * 0.33), 0, 100).toFixed(1));
  const skinQualityScore = Number(clamp(72 + (payload.imageUrl ? 4 : 0) + (symmetryScore * 0.05), 0, 100).toFixed(1));
  const attractivenessScore = Number(clamp((harmonyScore * 0.045) + (symmetryScore * 0.028) + (skinQualityScore * 0.015), 0, 10).toFixed(1));
  const confidence = Number(clamp(82 + (goldenRatioScore * 0.03), 0, 100).toFixed(1));

  return {
    attractivenessScore,
    symmetryScore,
    harmonyScore,
    goldenRatioScore,
    balanceScore,
    skinQualityScore,
    confidence,
    ageEstimate: ageHint,
    metrics,
    recommendations: [
      "Use soft frontal lighting to stabilize the cheek and under-eye contour signal.",
      "A slightly lifted camera angle can improve perceived jawline structure in portraits.",
      "Keep grooming and framing consistent so progress comparisons remain meaningful."
    ]
  };
}
