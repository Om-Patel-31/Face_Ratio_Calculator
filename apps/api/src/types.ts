export type LandmarkPoint = {
  x: number;
  y: number;
};

export type ScanRequest = {
  userId?: string;
  imageUrl?: string;
  landmarks: Record<string, LandmarkPoint>;
  ageHint?: number;
};

export type ScanAnalysis = {
  attractivenessScore: number;
  symmetryScore: number;
  harmonyScore: number;
  goldenRatioScore: number;
  balanceScore: number;
  skinQualityScore: number;
  confidence: number;
  ageEstimate: number;
  metrics: Array<{
    name: string;
    actual: number;
    target: number;
    score: number;
  }>;
  recommendations: string[];
};
