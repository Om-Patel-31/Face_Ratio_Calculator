import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import { analyzeScanPayload } from "./services/analysis-service";
import type { ScanRequest } from "./types";

dotenv.config();

const app = express();
app.use(express.json({ limit: "8mb" }));
app.use(cors({ origin: true, credentials: true }));

app.get("/health", (_request, response) => {
  response.json({ ok: true, service: "faceratio-api", timestamp: new Date().toISOString() });
});

app.post("/v1/scans/analyze", (request, response) => {
  const payload = request.body as ScanRequest;
  if (!payload?.landmarks) {
    response.status(400).json({ error: "Missing landmarks payload." });
    return;
  }

  const analysis = analyzeScanPayload(payload);
  response.json({ scanId: `scan_${Date.now()}`, analysis });
});

app.get("/v1/reports/:scanId", (request, response) => {
  response.json({
    scanId: request.params.scanId,
    summary: "Supportive AI report generated from approximate landmark ratios.",
    recommendations: [
      "Use balanced lighting for the cleanest landmark extraction.",
      "Keep the face centered and level during scans.",
      "Review the progress history to compare multiple sessions."
    ]
  });
});

app.get("/v1/progress/:userId", (request, response) => {
  response.json({
    userId: request.params.userId,
    entries: [
      { title: "Golden ratio", value: 87, delta: 6 },
      { title: "Symmetry", value: 91, delta: 4 },
      { title: "Harmony", value: 82, delta: 7 }
    ]
  });
});

app.post("/v1/advice", (request, response) => {
  const tone = typeof request.body?.tone === "string" ? request.body.tone : "premium";
  response.json({
    tone,
    suggestions: [
      "A clean haircut with controlled volume can improve vertical proportion in portraits.",
      "Soft neutral tones near the face help the complexion read more evenly.",
      "Use daylight-balanced front lighting for the most stable analysis." 
    ]
  });
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`FaceRatio API running on port ${port}`);
});
