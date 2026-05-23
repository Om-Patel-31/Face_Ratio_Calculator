export type Vec2 = {
  x: number;
  y: number;
  z?: number;
};

export type FaceMetric = {
  label: string;
  value: number;
  target: number;
  score: number;
  delta: number;
  description: string;
};

export type AnalysisNarrative = {
  title: string;
  description: string;
};

export type FaceAnalysis = {
  attractivenessScore: number;
  symmetryScore: number;
  goldenRatioMatch: number;
  harmonyScore: number;
  balanceScore: number;
  confidence: number;
  skinQuality: number;
  ageEstimate: number;
  ratios: FaceMetric[];
  notes: AnalysisNarrative[];
  recommendations: string[];
  landmarkCount: number;
};

export type ScanInput = {
  imageWidth: number;
  imageHeight: number;
  landmarks: Vec2[];
};
