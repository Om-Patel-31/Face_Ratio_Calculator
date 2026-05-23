from math import fabs
from .schemas import InferenceMetric, InferenceRequest, InferenceResponse


def _point(landmarks, key):
    return landmarks.get(key)


def _safe_divide(numerator: float, denominator: float, fallback: float = 0.0) -> float:
    return fallback if denominator == 0 else numerator / denominator


def _score(actual: float, target: float) -> float:
    if target == 0:
        return 0.0

    return round(max(0.0, 1.0 - fabs(actual - target) / target) * 100.0, 1)


def run_inference(payload: InferenceRequest) -> InferenceResponse:
    landmarks = payload.landmarks
    forehead = _point(landmarks, "forehead") or type("Point", (), {"x": 0.0, "y": 0.0})()
    brow = _point(landmarks, "brow") or type("Point", (), {"x": 0.0, "y": 0.0})()
    nose_base = _point(landmarks, "noseBase") or type("Point", (), {"x": 0.0, "y": 0.0})()
    chin = _point(landmarks, "chin") or type("Point", (), {"x": 0.0, "y": 0.0})()
    left_cheek = _point(landmarks, "leftCheek") or type("Point", (), {"x": 0.0, "y": 0.0})()
    right_cheek = _point(landmarks, "rightCheek") or type("Point", (), {"x": 0.0, "y": 0.0})()
    left_eye_inner = _point(landmarks, "leftEyeInner") or type("Point", (), {"x": 0.0, "y": 0.0})()
    left_eye_outer = _point(landmarks, "leftEyeOuter") or type("Point", (), {"x": 0.0, "y": 0.0})()
    right_eye_inner = _point(landmarks, "rightEyeInner") or type("Point", (), {"x": 0.0, "y": 0.0})()
    nose_left = _point(landmarks, "noseLeft") or type("Point", (), {"x": 0.0, "y": 0.0})()
    nose_right = _point(landmarks, "noseRight") or type("Point", (), {"x": 0.0, "y": 0.0})()
    jaw_left = _point(landmarks, "jawLeft") or type("Point", (), {"x": 0.0, "y": 0.0})()
    jaw_right = _point(landmarks, "jawRight") or type("Point", (), {"x": 0.0, "y": 0.0})()
    mouth_left = _point(landmarks, "mouthLeft") or type("Point", (), {"x": 0.0, "y": 0.0})()
    mouth_right = _point(landmarks, "mouthRight") or type("Point", (), {"x": 0.0, "y": 0.0})()

    face_height = fabs(chin.y - forehead.y)
    face_width = fabs(left_cheek.x - right_cheek.x)
    eye_spacing = fabs(right_eye_inner.x - left_eye_inner.x)
    eye_width = fabs(left_eye_outer.x - left_eye_inner.x)
    nose_width = fabs(nose_left.x - nose_right.x)
    lower_third = fabs(chin.y - nose_base.y)
    midface = fabs(nose_base.y - brow.y)
    jaw_width = fabs(jaw_left.x - jaw_right.x)
    mouth_width = fabs(mouth_left.x - mouth_right.x)

    metrics = [
        InferenceMetric(name="Face length-to-width", actual=_safe_divide(face_height, face_width), target=1.55, score=_score(_safe_divide(face_height, face_width), 1.55)),
        InferenceMetric(name="Eye spacing ratio", actual=_safe_divide(eye_spacing, eye_width), target=1.0, score=_score(_safe_divide(eye_spacing, eye_width), 1.0)),
        InferenceMetric(name="Nose width ratio", actual=_safe_divide(nose_width, face_width), target=0.28, score=_score(_safe_divide(nose_width, face_width), 0.28)),
        InferenceMetric(name="Midface ratio", actual=_safe_divide(midface, lower_third), target=1.0, score=_score(_safe_divide(midface, lower_third), 1.0)),
        InferenceMetric(name="Lower third ratio", actual=_safe_divide(lower_third, face_height), target=0.35, score=_score(_safe_divide(lower_third, face_height), 0.35)),
        InferenceMetric(name="Jawline proportion", actual=_safe_divide(jaw_width, face_width), target=0.84, score=_score(_safe_divide(jaw_width, face_width), 0.84)),
        InferenceMetric(name="Mouth balance", actual=_safe_divide(mouth_width, jaw_width), target=0.62, score=_score(_safe_divide(mouth_width, jaw_width), 0.62))
    ]

    golden_ratio_score = round(sum(metric.score for metric in metrics) / len(metrics), 1)
    symmetry_score = round(max(0.0, 100.0 - fabs(left_eye_inner.y - right_eye_inner.y) * 120.0), 1)
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
