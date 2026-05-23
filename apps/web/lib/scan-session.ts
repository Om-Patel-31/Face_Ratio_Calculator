import { deriveRatioMetrics } from "./ratio-formulas";
import type { AnalysisResult, LandmarkPoint } from "./types";

export type ScanSource = "camera" | "upload";

export type ScanSessionResult = {
  analysis: AnalysisResult;
  imageUrl: string;
  imageLabel: string;
  source: ScanSource;
  imageSize: {
    width: number;
    height: number;
  };
  landmarks: Record<string, LandmarkPoint>;
  rawMesh?: Array<{ x: number; y: number; z?: number }>;
};

const baseLandmarks: Record<string, LandmarkPoint> = {
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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hashString(input: string) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function jitter(seed: number, index: number, magnitude: number) {
  const angle = (seed + index * 37) % 360;
  return Math.sin((angle * Math.PI) / 180) * magnitude;
}

function generateLandmarks(seed: number, aspectRatio: number, source: ScanSource) {
  const sourceBias = source === "camera" ? 0.004 : -0.002;
  const aspectBias = clamp((aspectRatio - 1) * 0.01, -0.01, 0.01);

  return Object.entries(baseLandmarks).reduce<Record<string, LandmarkPoint>>((accumulator, [key, point], index) => {
    accumulator[key] = {
      x: clamp(point.x + sourceBias + aspectBias + jitter(seed, index, 0.012), 0.05, 0.95),
      y: clamp(point.y + jitter(seed, index + 18, 0.01), 0.05, 0.95)
    };
    return accumulator;
  }, {});
}

function loadImageMetadata(src: string) {
  // Use createImageBitmap when available for faster decoding and to avoid blocking the main thread unnecessarily.
  return new Promise<{ width: number; height: number }>(async (resolve, reject) => {
    try {
      if (typeof createImageBitmap === 'function') {
        // For data URLs and cross-origin images this should work in modern browsers
        const resp = await fetch(src);
        const blob = await resp.blob();
        const bitmap = await createImageBitmap(blob);
        resolve({ width: bitmap.width, height: bitmap.height });
        bitmap.close();
        return;
      }
    } catch (err) {
      // fallback to standard Image
    }

    const image = new Image();
    image.onload = () => {
      resolve({ width: image.naturalWidth || image.width, height: image.naturalHeight || image.height });
    };
    image.onerror = () => reject(new Error("Unable to read image metadata."));
    image.src = src;
  });
}

export async function createScanSession(input: {
  imageUrl: string;
  imageLabel: string;
  source: ScanSource;
}): Promise<ScanSessionResult> {
  const imageSize = await loadImageMetadata(input.imageUrl);
  const aspectRatio = imageSize.width / Math.max(imageSize.height, 1);
  const seed = hashString(`${input.source}:${input.imageLabel}:${imageSize.width}x${imageSize.height}:${input.imageUrl.slice(0, 64)}`);
  const landmarks = generateLandmarks(seed, aspectRatio, input.source);
  const ratioPack = deriveRatioMetrics(landmarks);

  const eyePairDelta = Math.abs(landmarks.leftEyeInner.y - landmarks.rightEyeInner.y);
  const mouthPairDelta = Math.abs(landmarks.mouthLeft.y - landmarks.mouthRight.y);
  const symmetryScore = Number(clamp(100 - (eyePairDelta * 160) - (mouthPairDelta * 120), 0, 100).toFixed(1));
  const harmonyScore = ratioPack.harmonyScore;
  const skinQualityScore = Number(clamp(73 + (input.source === "camera" ? 3 : 0) + (aspectRatio > 1 ? 1.5 : 0), 0, 100).toFixed(1));
  const attractivenessScore = Number(clamp((harmonyScore * 0.045) + (symmetryScore * 0.028) + (skinQualityScore * 0.015), 0, 10).toFixed(1));
  const confidence = Number(clamp(84 + (input.source === "camera" ? 3 : 0) - ((seed % 7) * 0.6), 0, 100).toFixed(1));
  const ageEstimate = Math.round(clamp(26 + ((seed % 9) - 4), 18, 44));

  return {
    analysis: {
      scanId: `scan_${seed}`,
      attractivenessScore,
      symmetryScore,
      harmonyScore,
      goldenRatioMatch: ratioPack.goldenRatioCompatibility,
      balanceScore: ratioPack.facialBalance,
      skinQualityScore,
      ageEstimate,
      confidence,
      metrics: ratioPack.metrics,
      recommendations: [
        "Use soft frontal lighting to stabilize cheek and under-eye contours.",
        "Keep the face centered and level so the ratio overlay stays reliable.",
        "Maintain a clean background to improve the perceived clarity of the scan."
      ],
      disclaimer: [
        "Beauty is subjective.",
        "Results are AI-generated estimates.",
        "This report is advisory, not a value judgment."
      ]
    },
    imageUrl: input.imageUrl,
    imageLabel: input.imageLabel,
    source: input.source,
    imageSize,
    landmarks
  };
}

export function createScanSessionFromLandmarks(input: {
  imageUrl: string;
  imageLabel: string;
  source: ScanSource;
  imageSize: { width: number; height: number };
  landmarks: Record<string, LandmarkPoint>;
  rawMesh?: Array<{ x: number; y: number; z?: number }>;
}): ScanSessionResult {
  const { imageUrl, imageLabel, source, imageSize, landmarks } = input;
  const rawMesh = input.rawMesh;
  const ratioPack = deriveRatioMetrics(landmarks);

  function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
  }

  const eyePairDelta = Math.abs(landmarks.leftEyeInner.y - landmarks.rightEyeInner.y);
  const mouthPairDelta = Math.abs(landmarks.mouthLeft.y - landmarks.mouthRight.y);
  const symmetryScore = Number(clamp(100 - (eyePairDelta * 160) - (mouthPairDelta * 120), 0, 100).toFixed(1));
  const harmonyScore = ratioPack.harmonyScore;
  const skinQualityScore = Number(clamp(73 + (source === "camera" ? 3 : 0) + (imageSize.width / Math.max(imageSize.height, 1) > 1 ? 1.5 : 0), 0, 100).toFixed(1));
  const attractivenessScore = Number(clamp((harmonyScore * 0.045) + (symmetryScore * 0.028) + (skinQualityScore * 0.015), 0, 10).toFixed(1));
  const confidence = Number(clamp(84 + (source === "camera" ? 3 : 0), 0, 100).toFixed(1));
  const ageEstimate = Math.round(clamp(26, 18, 44));

  return {
    analysis: {
      scanId: `scan_custom_${Date.now()}`,
      attractivenessScore,
      symmetryScore,
      harmonyScore,
      goldenRatioMatch: ratioPack.goldenRatioCompatibility,
      balanceScore: ratioPack.facialBalance,
      skinQualityScore,
      ageEstimate,
      confidence,
      metrics: ratioPack.metrics,
      recommendations: [
        "Use soft frontal lighting to stabilize cheek and under-eye contours.",
        "Keep the face centered and level so the ratio overlay stays reliable.",
        "Maintain a clean background to improve the perceived clarity of the scan."
      ],
      disclaimer: ["Beauty is subjective.", "Results are AI-generated estimates.", "This report is advisory, not a value judgment."]
    },
    imageUrl,
    imageLabel,
    source,
    imageSize,
    landmarks,
    rawMesh
  };
}
