import type { FaceAnalysis } from "@/types/analysis";

export const demoAnalysis: FaceAnalysis = {
  attractivenessScore: 8.2,
  symmetryScore: 91,
  goldenRatioMatch: 87,
  harmonyScore: 84,
  balanceScore: 79,
  confidence: 93,
  skinQuality: 86,
  ageEstimate: 27,
  landmarkCount: 468,
  ratios: [
    { label: "Facial thirds", value: 0.34, target: 0.33, score: 88, delta: 0.01, description: "Upper, middle, and lower face balance" },
    { label: "Eye spacing", value: 1.02, target: 1, score: 96, delta: 0.02, description: "Interocular spacing against eye width" },
    { label: "Nose width", value: 0.17, target: 0.18, score: 95, delta: 0.01, description: "Nose width relative to the face" },
    { label: "Lip-to-nose", value: 1.59, target: 1.618, score: 98, delta: 0.028, description: "Mouth width compared with nose width" },
    { label: "Jaw proportion", value: 0.9, target: 0.88, score: 97, delta: 0.02, description: "Mandible width relative to face width" },
    { label: "Face length / width", value: 1.58, target: 1.618, score: 96, delta: 0.038, description: "Overall craniofacial proportion" },
    { label: "Midface ratio", value: 0.32, target: 0.33, score: 93, delta: 0.01, description: "Midface depth and volume balance" },
    { label: "Lower third", value: 0.34, target: 0.33, score: 91, delta: 0.01, description: "Lower face balance and chin placement" },
    { label: "Canthal tilt", value: 7.3, target: 7, score: 94, delta: 0.3, description: "Upper eye angle and ocular lift" }
  ],
  notes: [
    { title: "Structural harmony", description: "The face reads as balanced with strong proportional continuity across the thirds." },
    { title: "Symmetry confidence", description: "Left-right balance is high enough for a confident analytical estimate." },
    { title: "Aesthetic signal", description: "Results are AI-generated estimates and should be treated as approximate." }
  ],
  recommendations: [
    "Premium side lighting will sharpen the face's dimensional contrast.",
    "A slightly elevated camera angle tends to flatter the jawline and eye area.",
    "Keep hair away from the midface region for a cleaner ratio readout."
  ]
};
