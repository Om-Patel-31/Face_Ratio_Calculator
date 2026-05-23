from pydantic import BaseModel, Field
from typing import Dict, List


class LandmarkPoint(BaseModel):
    x: float
    y: float


class InferenceRequest(BaseModel):
    image_url: str | None = None
    age_hint: int = Field(default=27, ge=13, le=120)
    landmarks: Dict[str, LandmarkPoint]


class InferenceMetric(BaseModel):
    name: str
    actual: float
    target: float
    score: float


class InferenceResponse(BaseModel):
    attractiveness_score: float
    symmetry_score: float
    harmony_score: float
    golden_ratio_score: float
    skin_quality_score: float
    confidence: float
    age_estimate: int
    metrics: List[InferenceMetric]
    recommendations: List[str]
