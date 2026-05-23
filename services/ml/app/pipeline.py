from math import fabs
from .schemas import InferenceMetric, InferenceRequest, InferenceResponse


def _score(actual: float, target: float) -> float:
    return round(max(0.0, 1.0 - fabs(actual - target) / target) * 100.0, 1)


def run_inference(payload: InferenceRequest) -> InferenceResponse:
    landmarks = payload.landmarks
    face_height = fabs(landmarks["chin"].y - landmarks["forehead"].y)
    face_width = fabs(landmarks["leftCheek"].x - landmarks["rightCheek"].x)
    eye_spacing = fabs(landmarks["rightEyeInner"].x - landmarks["leftEyeInner"].x)
    eye_width = fabs(landmarks["leftEyeOuter"].x - landmarks["leftEyeInner"].x)
    nose_width = fabs(landmarks["noseLeft"].x - landmarks["noseRight"].x)
    lower_third = fabs(landmarks["chin"].y - landmarks["noseBase"].y)
    midface = fabs(landmarks["noseBase"].y - landmarks["brow"].y)
    jaw_width = fabs(landmarks["jawLeft"].x - landmarks["jawRight"].x)

    metrics = [
        InferenceMetric(name="Face length-to-width", actual=face_height / max(1e-4, face_width), target=1.55, score=_score(face_height / max(1e-4, face_width), 1.55)),
        InferenceMetric(name="Eye spacing ratio", actual=eye_spacing / max(1e-4, eye_width), target=1.0, score=_score(eye_spacing / max(1e-4, eye_width), 1.0)),
        InferenceMetric(name="Nose width ratio", actual=nose_width / max(1e-4, face_width), target=0.28, score=_score(nose_width / max(1e-4, face_width), 0.28)),
        InferenceMetric(name="Midface ratio", actual=midface / max(1e-4, lower_third), target=1.0, score=_score(midface / max(1e-4, lower_third), 1.0)),
        InferenceMetric(name="Lower third ratio", actual=lower_third / max(1e-4, face_height), target=0.35, score=_score(lower_third / max(1e-4, face_height), 0.35)),
        InferenceMetric(name="Jawline proportion", actual=jaw_width / max(1e-4, face_width), target=0.84, score=_score(jaw_width / max(1e-4, face_width), 0.84))
    ]

    golden_ratio_score = round(sum(metric.score for metric in metrics) / len(metrics), 1)
    symmetry_score = round(max(0.0, 100.0 - fabs(landmarks["leftEyeInner"].y - landmarks["rightEyeInner"].y) * 120.0), 1)
    harmony_score = round(min(100.0, (golden_ratio_score * 0.52) + (symmetry_score * 0.32) + 12.0), 1)
    skin_quality_score = round(min(100.0, 72.0 + (4.0 if payload.image_url else 0.0) + symmetry_score * 0.05), 1)
    attractiveness_score = round(min(10.0, (harmony_score * 0.045) + (symmetry_score * 0.028) + (skin_quality_score * 0.015)), 1)
    confidence = round(min(100.0, 82.0 + golden_ratio_score * 0.03), 1)

    return InferenceResponse(
      attractiveness_score=attractiveness_score,
      symmetry_score=symmetry_score,
      harmony_score=harmony_score,
      golden_ratio_score=golden_ratio_score,
      skin_quality_score=skin_quality_score,
      confidence=confidence,
      age_estimate=payload.age_hint,
      metrics=metrics,
      recommendations=[
          "Use soft frontal lighting to stabilize texture and symmetry readings.",
          "Keep the head level and centered for the cleanest landmark mapping.",
          "Consistency across sessions improves trend tracking quality."
      ]
    )
