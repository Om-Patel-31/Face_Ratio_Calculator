import type { FaceMetric, Vec2 } from "@/types/analysis";

export const GOLDEN_RATIO = 1.618;

const metricWeight = 100;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function safeDivide(numerator: number, denominator: number) {
  return denominator === 0 ? 0 : numerator / denominator;
}

export function distance(a: Vec2, b: Vec2) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function midpoint(a: Vec2, b: Vec2): Vec2 {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2
  };
}

function point(landmarks: Vec2[], index: number, width: number, height: number) {
  const source = landmarks[index] ?? { x: 0.5, y: 0.5 };
  return {
    x: source.x > 1 ? source.x : source.x * width,
    y: source.y > 1 ? source.y : source.y * height,
    z: source.z ?? 0
  };
}

export function ratioScore(value: number, target: number, tolerance = 0.2) {
  const distanceFromTarget = Math.abs(Math.log(safeDivide(value, target) || 1));
  const normalized = clamp(1 - distanceFromTarget / Math.log(1 + tolerance), 0, 1);
  return Math.round(normalized * metricWeight);
}

export function calculateCanthalTilt(outer: Vec2, inner: Vec2) {
  return (Math.atan2(inner.y - outer.y, inner.x - outer.x) * 180) / Math.PI;
}

export function calculateSymmetryScore(left: Vec2[], right: Vec2[]) {
  const pairs = Math.min(left.length, right.length);
  if (pairs === 0) return 50;
  const differences = left.slice(0, pairs).map((leftPoint, index) => {
    const mirrorPoint = right[index];
    const mirroredDistance = Math.abs(leftPoint.x + mirrorPoint.x);
    const verticalDistance = Math.abs(leftPoint.y - mirrorPoint.y);
    return mirroredDistance * 0.65 + verticalDistance * 0.35;
  });
  const average = differences.reduce((sum, value) => sum + value, 0) / differences.length;
  return clamp(Math.round(100 - average * 80), 0, 100);
}

export function calculateFaceMetrics(landmarks: Vec2[], width: number, height: number): FaceMetric[] {
  const forehead = point(landmarks, 10, width, height);
  const browCenter = midpoint(point(landmarks, 70, width, height), point(landmarks, 300, width, height));
  const eyeCenterLeft = midpoint(point(landmarks, 33, width, height), point(landmarks, 159, width, height));
  const eyeCenterRight = midpoint(point(landmarks, 263, width, height), point(landmarks, 386, width, height));
  const noseLeft = point(landmarks, 94, width, height);
  const noseRight = point(landmarks, 331, width, height);
  const noseBase = midpoint(noseLeft, noseRight);
  const mouthLeft = point(landmarks, 61, width, height);
  const mouthRight = point(landmarks, 291, width, height);
  const chin = point(landmarks, 152, width, height);
  const cheekLeft = point(landmarks, 234, width, height);
  const cheekRight = point(landmarks, 454, width, height);
  const jawLeft = point(landmarks, 172, width, height);
  const jawRight = point(landmarks, 397, width, height);

  const faceWidth = distance(cheekLeft, cheekRight);
  const faceLength = distance(forehead, chin);
  const upperThird = distance(forehead, browCenter);
  const middleThird = distance(browCenter, noseBase);
  const lowerThird = distance(noseBase, chin);
  const eyeDistance = distance(eyeCenterLeft, eyeCenterRight);
  const leftEyeWidth = distance(point(landmarks, 33, width, height), point(landmarks, 133, width, height));
  const rightEyeWidth = distance(point(landmarks, 362, width, height), point(landmarks, 263, width, height));
  const noseWidth = distance(noseLeft, noseRight);
  const mouthWidth = distance(mouthLeft, mouthRight);
  const jawWidth = distance(jawLeft, jawRight);

  return [
    {
      label: "Facial thirds",
      value: safeDivide(upperThird + middleThird + lowerThird, 3),
      target: safeDivide(faceLength, 3),
      score: ratioScore(safeDivide(upperThird + middleThird + lowerThird, 3), safeDivide(faceLength, 3)),
      delta: Math.abs(safeDivide(upperThird + middleThird + lowerThird, 3) - safeDivide(faceLength, 3)),
      description: "Upper, middle, and lower face balance"
    },
    {
      label: "Eye spacing",
      value: safeDivide(eyeDistance, leftEyeWidth + rightEyeWidth),
      target: 1,
      score: ratioScore(safeDivide(eyeDistance, leftEyeWidth + rightEyeWidth), 1),
      delta: Math.abs(safeDivide(eyeDistance, leftEyeWidth + rightEyeWidth) - 1),
      description: "Interocular spacing against eye width"
    },
    {
      label: "Nose width",
      value: safeDivide(noseWidth, faceWidth),
      target: 0.18,
      score: ratioScore(safeDivide(noseWidth, faceWidth), 0.18),
      delta: Math.abs(safeDivide(noseWidth, faceWidth) - 0.18),
      description: "Nose width relative to the face"
    },
    {
      label: "Lip-to-nose",
      value: safeDivide(mouthWidth, noseWidth),
      target: GOLDEN_RATIO,
      score: ratioScore(safeDivide(mouthWidth, noseWidth), GOLDEN_RATIO),
      delta: Math.abs(safeDivide(mouthWidth, noseWidth) - GOLDEN_RATIO),
      description: "Mouth width compared with nose width"
    },
    {
      label: "Jaw proportion",
      value: safeDivide(jawWidth, faceWidth),
      target: 0.88,
      score: ratioScore(safeDivide(jawWidth, faceWidth), 0.88),
      delta: Math.abs(safeDivide(jawWidth, faceWidth) - 0.88),
      description: "Mandible width relative to face width"
    },
    {
      label: "Face length / width",
      value: safeDivide(faceLength, faceWidth),
      target: GOLDEN_RATIO,
      score: ratioScore(safeDivide(faceLength, faceWidth), GOLDEN_RATIO),
      delta: Math.abs(safeDivide(faceLength, faceWidth) - GOLDEN_RATIO),
      description: "Overall craniofacial proportion"
    },
    {
      label: "Midface ratio",
      value: safeDivide(middleThird, faceLength),
      target: 0.33,
      score: ratioScore(safeDivide(middleThird, faceLength), 0.33),
      delta: Math.abs(safeDivide(middleThird, faceLength) - 0.33),
      description: "Midface depth and volume balance"
    },
    {
      label: "Lower third",
      value: safeDivide(lowerThird, faceLength),
      target: 0.33,
      score: ratioScore(safeDivide(lowerThird, faceLength), 0.33),
      delta: Math.abs(safeDivide(lowerThird, faceLength) - 0.33),
      description: "Lower face balance and chin placement"
    },
    {
      label: "Canthal tilt",
      value: Math.abs(calculateCanthalTilt(point(landmarks, 33, width, height), point(landmarks, 133, width, height))),
      target: 7,
      score: ratioScore(Math.abs(calculateCanthalTilt(point(landmarks, 33, width, height), point(landmarks, 133, width, height))), 7, 0.45),
      delta: Math.abs(Math.abs(calculateCanthalTilt(point(landmarks, 33, width, height), point(landmarks, 133, width, height))) - 7),
      description: "Upper eye angle and ocular lift"
    }
  ];
}

export function summarizeMetrics(metrics: FaceMetric[]) {
  const score = metrics.reduce((sum, metric) => sum + metric.score, 0) / Math.max(metrics.length, 1);
  const harmony = clamp(Math.round(score), 0, 100);
  const compatibility = clamp(Math.round(score * 0.96 + 3), 0, 100);
  const balance = clamp(Math.round(metrics.filter((metric) => metric.score > 70).length / Math.max(metrics.length, 1) * 100), 0, 100);

  return {
    harmony,
    compatibility,
    balance
  };
}
