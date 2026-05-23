import type { LandmarkPoint, RatioMetric } from "./types";

const IDEAL_GOLDEN = 1.618;

function scoreAgainstTarget(actual: number, target: number) {
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
  const faceHeight = Math.abs(landmarks.chin.y - landmarks.forehead.y);
  const faceWidth = Math.abs(landmarks.leftCheek.x - landmarks.rightCheek.x);
  const upperThird = Math.abs(landmarks.brow.y - landmarks.forehead.y);
  const midThird = Math.abs(landmarks.noseBase.y - landmarks.brow.y);
  const lowerThird = Math.abs(landmarks.chin.y - landmarks.noseBase.y);
  const eyeSpacing = Math.abs(landmarks.rightEyeInner.x - landmarks.leftEyeInner.x);
  const eyeWidth = Math.abs(landmarks.leftEyeOuter.x - landmarks.leftEyeInner.x);
  const noseWidth = Math.abs(landmarks.noseLeft.x - landmarks.noseRight.x);
  const mouthWidth = Math.abs(landmarks.mouthLeft.x - landmarks.mouthRight.x);
  const lipHeight = Math.abs(landmarks.mouthUpper.y - landmarks.mouthLower.y);
  const noseLength = Math.abs(landmarks.noseBase.y - landmarks.noseBridge.y);
  const jawWidth = Math.abs(landmarks.jawLeft.x - landmarks.jawRight.x);

  const metrics: RatioMetric[] = [
    {
      name: "Facial thirds",
      actual: faceHeight / Math.max(1, upperThird + midThird + lowerThird),
      target: IDEAL_GOLDEN,
      score: scoreAgainstTarget(faceHeight / Math.max(1, upperThird + midThird + lowerThird), IDEAL_GOLDEN),
      note: "Vertical segmentation is balanced against the canonical ideal."
    },
    {
      name: "Eye spacing ratio",
      actual: eyeSpacing / Math.max(1, eyeWidth),
      target: 1,
      score: scoreAgainstTarget(eyeSpacing / Math.max(1, eyeWidth), 1),
      note: "Measures whether the interocular distance supports symmetry." 
    },
    {
      name: "Nose width ratio",
      actual: noseWidth / Math.max(1, faceWidth),
      target: 0.28,
      score: scoreAgainstTarget(noseWidth / Math.max(1, faceWidth), 0.28),
      note: "Nasal width is normalized against overall facial width."
    },
    {
      name: "Lip-to-nose ratio",
      actual: lipHeight / Math.max(1, noseLength),
      target: 0.5,
      score: scoreAgainstTarget(lipHeight / Math.max(1, noseLength), 0.5),
      note: "Lip volume is measured relative to nasal length."
    },
    {
      name: "Jawline proportion",
      actual: jawWidth / Math.max(1, faceWidth),
      target: 0.84,
      score: scoreAgainstTarget(jawWidth / Math.max(1, faceWidth), 0.84),
      note: "Jaw breadth is compared with the cheekbone span."
    },
    {
      name: "Face length-to-width",
      actual: faceHeight / Math.max(1, faceWidth),
      target: 1.55,
      score: scoreAgainstTarget(faceHeight / Math.max(1, faceWidth), 1.55),
      note: "Classic proportion signal for overall facial balance."
    },
    {
      name: "Midface ratio",
      actual: midThird / Math.max(1, lowerThird),
      target: 1,
      score: scoreAgainstTarget(midThird / Math.max(1, lowerThird), 1),
      note: "Compares the central facial region to the lower third."
    },
    {
      name: "Lower third ratio",
      actual: lowerThird / Math.max(1, faceHeight),
      target: 0.35,
      score: scoreAgainstTarget(lowerThird / Math.max(1, faceHeight), 0.35),
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
