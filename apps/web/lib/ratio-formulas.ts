import type { LandmarkPoint, RatioMetric } from "./types";

const IDEAL_GOLDEN = 1.618;

function safePoint(landmarks: Record<string, LandmarkPoint>, key: string): LandmarkPoint {
  return landmarks[key] ?? { x: 0, y: 0 };
}

function safeDivide(numerator: number, denominator: number, fallback = 0) {
  return denominator === 0 ? fallback : numerator / denominator;
}

function scoreAgainstTarget(actual: number, target: number) {
  if (target === 0) {
    return 0;
  }

  const normalized = Math.max(0, 1 - Math.abs(actual - target) / target);
  return Number((normalized * 100).toFixed(1));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function calculateSymmetryScore(left: LandmarkPoint[], right: LandmarkPoint[]) {
  const count = Math.min(left.length, right.length);
  if (!count) return 0;
  let delta = 0;
  for (let index = 0; index < count; index += 1) {
    const lx = left[index].x;
    const rx = right[index].x;
    const ly = left[index].y;
    const ry = right[index].y;
    delta += Math.hypot(lx - rx, ly - ry);
  }
  const avgDelta = delta / count;
  return Number(clamp(100 - avgDelta * 18, 0, 100).toFixed(1));
}

export function calculateCanthalTilt(inner: LandmarkPoint, outer: LandmarkPoint) {
  const angle = Math.atan2(outer.y - inner.y, outer.x - inner.x) * (180 / Math.PI);
  return Number(angle.toFixed(2));
}

export function deriveRatioMetrics(landmarks: Record<string, LandmarkPoint>) {
  const forehead = safePoint(landmarks, "forehead");
  const brow = safePoint(landmarks, "brow");
  const noseBridge = safePoint(landmarks, "noseBridge");
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
  const mouthUpper = safePoint(landmarks, "mouthUpper");
  const mouthLower = safePoint(landmarks, "mouthLower");
  const jawLeft = safePoint(landmarks, "jawLeft");
  const jawRight = safePoint(landmarks, "jawRight");

  const faceHeight = Math.abs(chin.y - forehead.y);
  const faceWidth = Math.abs(leftCheek.x - rightCheek.x);
  const upperThird = Math.abs(brow.y - forehead.y);
  const midThird = Math.abs(noseBase.y - brow.y);
  const lowerThird = Math.abs(chin.y - noseBase.y);
  const eyeSpacing = Math.abs(rightEyeInner.x - leftEyeInner.x);
  const eyeWidth = Math.abs(leftEyeOuter.x - leftEyeInner.x);
  const noseWidth = Math.abs(noseLeft.x - noseRight.x);
  const mouthWidth = Math.abs(mouthLeft.x - mouthRight.x);
  const lipHeight = Math.abs(mouthUpper.y - mouthLower.y);
  const noseLength = Math.abs(noseBase.y - noseBridge.y);
  const jawWidth = Math.abs(jawLeft.x - jawRight.x);

  const metrics: RatioMetric[] = [
    {
      name: "Facial thirds",
      actual: safeDivide(faceHeight, upperThird + midThird + lowerThird),
      target: IDEAL_GOLDEN,
      score: scoreAgainstTarget(safeDivide(faceHeight, upperThird + midThird + lowerThird), IDEAL_GOLDEN),
      note: "Vertical segmentation is balanced against the canonical ideal."
    },
    {
      name: "Eye spacing ratio",
      actual: safeDivide(eyeSpacing, eyeWidth),
      target: 1,
      score: scoreAgainstTarget(safeDivide(eyeSpacing, eyeWidth), 1),
      note: "Measures whether the interocular distance supports symmetry." 
    },
    {
      name: "Nose width ratio",
      actual: safeDivide(noseWidth, faceWidth),
      target: 0.28,
      score: scoreAgainstTarget(safeDivide(noseWidth, faceWidth), 0.28),
      note: "Nasal width is normalized against overall facial width."
    },
    {
      name: "Lip-to-nose ratio",
      actual: safeDivide(lipHeight, noseLength),
      target: 0.5,
      score: scoreAgainstTarget(safeDivide(lipHeight, noseLength), 0.5),
      note: "Lip volume is measured relative to nasal length."
    },
    {
      name: "Jawline proportion",
      actual: safeDivide(jawWidth, faceWidth),
      target: 0.84,
      score: scoreAgainstTarget(safeDivide(jawWidth, faceWidth), 0.84),
      note: "Jaw breadth is compared with the cheekbone span."
    },
    {
      name: "Face length-to-width",
      actual: safeDivide(faceHeight, faceWidth),
      target: 1.55,
      score: scoreAgainstTarget(safeDivide(faceHeight, faceWidth), 1.55),
      note: "Classic proportion signal for overall facial balance."
    },
    {
      name: "Midface ratio",
      actual: safeDivide(midThird, lowerThird),
      target: 1,
      score: scoreAgainstTarget(safeDivide(midThird, lowerThird), 1),
      note: "Compares the central facial region to the lower third."
    },
    {
      name: "Lower third ratio",
      actual: safeDivide(lowerThird, faceHeight),
      target: 0.35,
      score: scoreAgainstTarget(safeDivide(lowerThird, faceHeight), 0.35),
      note: "Subnasale-to-chin length relative to full facial height."
    }
  ];

  const goldenRatioCompatibility = Number(
    (
      metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length
    ).toFixed(1)
  );

  return {
    metrics,
    goldenRatioCompatibility,
    facialBalance: Number(clamp((goldenRatioCompatibility * 0.55) + (metrics[5].score * 0.45), 0, 100).toFixed(1)),
    harmonyScore: Number(clamp((goldenRatioCompatibility * 0.4) + (metrics[6].score * 0.3) + (metrics[4].score * 0.3), 0, 100).toFixed(1))
  };
}

export function buildMetricBars(metrics: RatioMetric[]) {
  return metrics.map((metric) => ({
    ...metric,
    fill: clamp(metric.score, 0, 100)
  }));
}
