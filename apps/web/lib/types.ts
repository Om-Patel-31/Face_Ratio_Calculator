export type LandmarkPoint = {
  x: number;
  y: number;
  z?: number;
  confidence?: number;
};

export type RatioMetric = {
  name: string;
  actual: number;
  target: number;
  score: number;
  note: string;
};

export type AnalysisResult = {
  scanId: string;
  attractivenessScore: number;
  symmetryScore: number;
  harmonyScore: number;
  goldenRatioMatch: number;
  balanceScore: number;
  skinQualityScore: number;
  ageEstimate: number;
  confidence: number;
  metrics: RatioMetric[];
  recommendations: string[];
  disclaimer: string[];
};
