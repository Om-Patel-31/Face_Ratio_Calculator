import type { ScanAnalysis, ScanRequest } from "../types";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function score(actual: number, target: number) {
  return Number((Math.max(0, 1 - Math.abs(actual - target) / target) * 100).toFixed(1));
}

export function analyzeScanPayload(payload: ScanRequest): ScanAnalysis {
  const { landmarks, ageHint = 27 } = payload;
  const faceHeight = Math.abs(landmarks.chin.y - landmarks.forehead.y);
  const faceWidth = Math.abs(landmarks.leftCheek.x - landmarks.rightCheek.x);
  const eyeSpacing = Math.abs(landmarks.rightEyeInner.x - landmarks.leftEyeInner.x);
  const eyeWidth = Math.abs(landmarks.leftEyeOuter.x - landmarks.leftEyeInner.x);
  const noseWidth = Math.abs(landmarks.noseLeft.x - landmarks.noseRight.x);
  const mouthWidth = Math.abs(landmarks.mouthLeft.x - landmarks.mouthRight.x);
  const lowerThird = Math.abs(landmarks.chin.y - landmarks.noseBase.y);
  const midface = Math.abs(landmarks.noseBase.y - landmarks.brow.y);
  const jawWidth = Math.abs(landmarks.jawLeft.x - landmarks.jawRight.x);

  const metrics = [
    { name: "Face length-to-width", actual: faceHeight / Math.max(1e-4, faceWidth), target: 1.55 },
    { name: "Eye spacing ratio", actual: eyeSpacing / Math.max(1e-4, eyeWidth), target: 1 },
    { name: "Nose width ratio", actual: noseWidth / Math.max(1e-4, faceWidth), target: 0.28 },
    { name: "Mouth balance", actual: mouthWidth / Math.max(1e-4, jawWidth), target: 0.62 },
    { name: "Midface ratio", actual: midface / Math.max(1e-4, lowerThird), target: 1 },
    { name: "Lower third ratio", actual: lowerThird / Math.max(1e-4, faceHeight), target: 0.35 }
  ].map((metric) => ({ ...metric, score: score(metric.actual, metric.target) }));

  const goldenRatioScore = Number((metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length).toFixed(1));
  const symmetryScore = Number(clamp(100 - Math.abs(landmarks.leftEyeInner.y - landmarks.rightEyeInner.y) * 120 - Math.abs(landmarks.mouthLeft.y - landmarks.mouthRight.y) * 90, 0, 100).toFixed(1));
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
