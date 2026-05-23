from fastapi import FastAPI
from .schemas import InferenceRequest
from .pipeline import run_inference

app = FastAPI(title="FaceRatio ML", version="1.0.0")


@app.get("/health")
def health():
    return {"ok": True, "service": "faceratio-ml"}


@app.post("/infer")
def infer(payload: InferenceRequest):
    return run_inference(payload)


@app.post("/landmarks")
def landmarks(payload: InferenceRequest):
    return run_inference(payload)
