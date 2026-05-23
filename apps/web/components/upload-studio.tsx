"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MetricRing } from "@/components/metric-ring";
import { ProcessingTimeline } from "@/components/processing-timeline";
import { RatioTable } from "@/components/ratio-table";
import { ScanPreview } from "@/components/scan-preview";
import { createScanSession, createScanSessionFromLandmarks, type ScanSessionResult, type ScanSource } from "@/lib/scan-session";
import { initFaceMeshCamera, estimateLandmarksFromImage } from "@/lib/face-mesh-client";
import { FACE_OVAL, LIPS, LEFT_EYE, RIGHT_EYE, NOSE } from "@/lib/face-mesh-indices";
import { demoAnalysis } from "@/lib/mock-analysis";

const pipelineSteps = [
  { title: "Decode image", detail: "Read the uploaded frame or camera capture into a consistent pixel buffer." },
  { title: "Normalize crop", detail: "Center the face region and standardize the portrait framing." },
  { title: "Estimate landmarks", detail: "Place the facial mesh points used for ratio and symmetry mapping." },
  { title: "Compute scores", detail: "Run the ratio engine to produce harmony, balance, and confidence outputs." }
];

function dataUrlFromFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read the selected file."));
    reader.readAsDataURL(file);
  });
}

function captureVideoFrame(video: HTMLVideoElement) {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 800;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not prepare the capture canvas.");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.95);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function UploadStudio() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceMeshRef = useRef<any | null>(null);
  const lastMeshRef = useRef<Array<{ x: number; y: number; z?: number }> | null>(null);
  const lastRawMeshRef = useRef<Array<{ x: number; y: number; z?: number }> | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const mountedRef = useRef(true);

  const [session, setSession] = useState<ScanSessionResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLabel, setPreviewLabel] = useState<string>("Ready to scan");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraMessage, setCameraMessage] = useState("Start the camera to capture a live portrait.");
  const [isScanning, setIsScanning] = useState(false);
  const [scanIndex, setScanIndex] = useState(0);
  const [scanError, setScanError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [liveLandmarks, setLiveLandmarks] = useState<Array<{ x: number; y: number }> | undefined>(undefined);

  useEffect(() => {
    let raf = 0;
    let running = true;

    const loop = () => {
      if (!running) return;
      const mesh = lastRawMeshRef.current ?? lastMeshRef.current;
      if (mesh && mesh.length) {
        setLiveLandmarks(mesh.map((p) => ({ x: p.x, y: p.y })));
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      mountedRef.current = false;
      try {
        faceMeshRef.current?.camera?.stop?.();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const analysis = session?.analysis ?? demoAnalysis;
  const landmarks = session?.landmarks ? Object.values(session.landmarks) : undefined;

  const statusLabel = isScanning ? pipelineSteps[scanIndex]?.title ?? "Processing" : session ? "Scan ready" : "Awaiting image";

  async function runDemoAnalysis(imageUrl: string, label: string, source: ScanSource) {
    setIsScanning(true);
    setScanError(null);
    for (let i = 0; i < pipelineSteps.length; i++) {
      setScanIndex(i);
      await sleep(80);
    }
    if (!mountedRef.current) return;
    const res = await createScanSession({ imageUrl, imageLabel: label, source });
    setSession(res);
    setPreviewUrl(imageUrl);
    setPreviewLabel(label);
    setIsScanning(false);
    setScanIndex(pipelineSteps.length - 1);
  }

  async function startCamera() {
    setScanError(null);
    const el = videoRef.current;
    if (!el) return setScanError("Video element missing.");
    if (!navigator.mediaDevices?.getUserMedia) {
      setScanError("This browser does not support camera capture.");
      return;
    }

    let stream: MediaStream | null = null;
    try {
      // Prompt for camera permission first so MediaPipe's Camera won't fail with NotAllowedError
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      el.srcObject = stream;
      await el.play();
    } catch (err) {
      setCameraActive(false);
      const msg = err instanceof Error ? err.message : String(err);
      if ((err as any)?.name === 'NotAllowedError' || msg.toLowerCase().includes('permission')) {
        setScanError('Camera access denied. Please allow camera permissions and try again.');
      } else {
        setScanError(msg);
      }
      setCameraMessage('Camera unavailable.');
      // stop any tracks if partially opened
      try { stream?.getTracks().forEach((t) => t.stop()); } catch {}
      return;
    }

    try {
      const controller = await initFaceMeshCamera(el, (lm) => {
        lastMeshRef.current = lm;
        lastRawMeshRef.current = lm;
      });
      if (controller) {
        faceMeshRef.current = controller;
      }
      setCameraActive(true);
      setCameraMessage('Camera live. Capture a frame when you are centered and well lit.');
    } catch (err) {
      // If MediaPipe initialization fails, keep the stream and show fallback preview
      setCameraActive(true);
      setCameraMessage('Camera live (no MediaPipe). Capture a frame when you are centered and well lit.');
    }
  }

  function stopCamera() {
    try {
      faceMeshRef.current?.camera?.stop?.();
    } catch (e) {
      // ignore
    }
    const video = videoRef.current;
    if (video && video.srcObject) {
      (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      video.srcObject = null;
    }
    faceMeshRef.current = null;
    lastMeshRef.current = null;
    setCameraActive(false);
    setCameraMessage("Camera stopped. You can restart it any time.");
  }

  function normalizeMeshToNamed(mesh: Array<{ x: number; y: number }>) {
    // heuristics: compute bbox and pick nearest points
    if (!mesh || !mesh.length) return {} as Record<string, { x: number; y: number }>;
    const xs = mesh.map((p) => p.x);
    const ys = mesh.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    const nearest = (fn: (p: { x: number; y: number }) => number) => {
      let best = mesh[0];
      let bestScore = Infinity;
      for (const p of mesh) {
        const s = fn(p);
        if (s < bestScore) {
          bestScore = s;
          best = p;
        }
      }
      return best;
    };

    const clamp = (v: number) => Math.min(1, Math.max(0, v));

    const forehead = nearest((p) => p.y - minY);
    const chin = nearest((p) => Math.abs(p.y - maxY));
    const leftCheek = nearest((p) => p.x - minX);
    const rightCheek = nearest((p) => Math.abs(p.x - maxX));
    const noseBase = nearest((p) => Math.abs(p.x - midX) + Math.abs(p.y - midY * 1.05));
    const brow = nearest((p) => Math.abs(p.x - midX) + Math.abs(p.y - (minY + (maxY - minY) * 0.15)));
    const mouthLeft = nearest((p) => Math.abs(p.y - (midY + (maxY - midY) * 0.2)) + Math.abs(p.x - minX));
    const mouthRight = nearest((p) => Math.abs(p.y - (midY + (maxY - midY) * 0.2)) + Math.abs(p.x - maxX));
    const mouthUpper = nearest((p) => Math.abs(p.y - (midY + (maxY - midY) * 0.15)));
    const mouthLower = nearest((p) => Math.abs(p.y - (midY + (maxY - midY) * 0.25)));

    const leftEyeInner = nearest((p) => Math.abs(p.x - (midX - (maxX - minX) * 0.12)) + Math.abs(p.y - (midY - (maxY - minY) * 0.08)));
    const leftEyeOuter = nearest((p) => Math.abs(p.x - (minX + (maxX - minX) * 0.12)) + Math.abs(p.y - (midY - (maxY - minY) * 0.08)));
    const rightEyeInner = nearest((p) => Math.abs(p.x - (midX + (maxX - minX) * 0.12)) + Math.abs(p.y - (midY - (maxY - minY) * 0.08)));
    const rightEyeOuter = nearest((p) => Math.abs(p.x - (maxX - (maxX - minX) * 0.12)) + Math.abs(p.y - (midY - (maxY - minY) * 0.08)));

    const noseLeft = nearest((p) => Math.abs(p.x - (midX - (maxX - minX) * 0.05)) + Math.abs(p.y - midY));
    const noseRight = nearest((p) => Math.abs(p.x - (midX + (maxX - minX) * 0.05)) + Math.abs(p.y - midY));
    const jawLeft = nearest((p) => Math.abs(p.x - (minX + (maxX - minX) * 0.18)) + Math.abs(p.y - maxY));
    const jawRight = nearest((p) => Math.abs(p.x - (maxX - (maxX - minX) * 0.18)) + Math.abs(p.y - maxY));

    return {
      forehead: { x: clamp(forehead.x), y: clamp(forehead.y) },
      brow: { x: clamp(brow.x), y: clamp(brow.y) },
      noseBridge: { x: clamp(noseBase.x), y: clamp(noseBase.y - 0.05) },
      noseBase: { x: clamp(noseBase.x), y: clamp(noseBase.y) },
      chin: { x: clamp(chin.x), y: clamp(chin.y) },
      leftCheek: { x: clamp(leftCheek.x), y: clamp(leftCheek.y) },
      rightCheek: { x: clamp(rightCheek.x), y: clamp(rightCheek.y) },
      leftEyeInner: { x: clamp(leftEyeInner.x), y: clamp(leftEyeInner.y) },
      leftEyeOuter: { x: clamp(leftEyeOuter.x), y: clamp(leftEyeOuter.y) },
      rightEyeInner: { x: clamp(rightEyeInner.x), y: clamp(rightEyeInner.y) },
      rightEyeOuter: { x: clamp(rightEyeOuter.x), y: clamp(rightEyeOuter.y) },
      noseLeft: { x: clamp(noseLeft.x), y: clamp(noseLeft.y) },
      noseRight: { x: clamp(noseRight.x), y: clamp(noseRight.y) },
      mouthLeft: { x: clamp(mouthLeft.x), y: clamp(mouthLeft.y) },
      mouthRight: { x: clamp(mouthRight.x), y: clamp(mouthRight.y) },
      mouthUpper: { x: clamp(mouthUpper.x), y: clamp(mouthUpper.y) },
      mouthLower: { x: clamp(mouthLower.x), y: clamp(mouthLower.y) },
      jawLeft: { x: clamp(jawLeft.x), y: clamp(jawLeft.y) },
      jawRight: { x: clamp(jawRight.x), y: clamp(jawRight.y) }
    };
  }

  function namedToArray(named: Record<string, { x: number; y: number }>) {
    return Object.values(named);
  }

  function buildConnections(named: Record<string, { x: number; y: number }> | undefined) {
    if (!named) return undefined;
    // Define some contour paths using our named landmarks
    const faceOval = [
      named.jawLeft,
      named.leftCheek,
      named.leftEyeOuter,
      named.leftEyeInner,
      named.noseBridge,
      named.rightEyeInner,
      named.rightEyeOuter,
      named.rightCheek,
      named.jawRight,
      named.chin
    ].filter(Boolean) as Array<{ x: number; y: number }>;

    const mouth = [named.mouthLeft, named.mouthUpper, named.mouthRight, named.mouthLower].filter(Boolean) as Array<{ x: number; y: number }>;

    const nose = [named.noseLeft, named.noseBridge, named.noseRight].filter(Boolean) as Array<{ x: number; y: number }>;

    const leftEye = [named.leftEyeOuter, named.leftEyeInner].filter(Boolean) as Array<{ x: number; y: number }>;
    const rightEye = [named.rightEyeInner, named.rightEyeOuter].filter(Boolean) as Array<{ x: number; y: number }>;

    return [faceOval, mouth, nose, leftEye, rightEye].filter((c) => c.length > 1);
  }

  function buildConnectionsFromMesh(mesh: Array<{ x: number; y: number; z?: number }> | null | undefined) {
    if (!mesh || !mesh.length) return undefined;
    const pick = (indices: number[]) => indices.map((i) => ({ x: mesh[i]?.x ?? 0, y: mesh[i]?.y ?? 0 })).filter((p) => p.x !== undefined && p.y !== undefined);
    const face = pick(FACE_OVAL);
    const lips = pick(LIPS);
    const leftEye = pick(LEFT_EYE);
    const rightEye = pick(RIGHT_EYE);
    const nose = pick(NOSE);
    return [face, lips, nose, leftEye, rightEye].filter((c) => c.length > 1);
  }

  async function captureFrameFromCamera() {
    const video = videoRef.current;
    if (!video) return;

    // ensure video is not visually mirrored
    try { video.style.transform = 'none'; video.style.webkitTransform = 'none'; } catch {}

    // If MediaPipe produced landmarks, use them
    if (lastMeshRef.current && lastMeshRef.current.length) {
      const mesh = lastMeshRef.current.map((p) => ({ x: p.x, y: p.y }));
      const named = normalizeMeshToNamed(mesh);
      const url = captureVideoFrame(video);
      const size = { width: video.videoWidth || 640, height: video.videoHeight || 800 };
      const s = createScanSessionFromLandmarks({ imageUrl: url, imageLabel: "Camera capture", source: "camera", imageSize: size, landmarks: named, rawMesh: lastRawMeshRef.current ?? lastMeshRef.current ?? undefined });
      setSession(s);
      setPreviewUrl(url);
      setPreviewLabel("Camera capture");
      return;
    }

    // fallback
    const data = captureVideoFrame(video);
    await runDemoAnalysis(data, "Camera capture", "camera");
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await dataUrlFromFile(file);
      setPreviewUrl(dataUrl);
      setPreviewLabel(file.name);

      // attempt client-side landmark extraction
      const img = new Image();
      img.src = dataUrl;
      await img.decode();
      const mesh = await estimateLandmarksFromImage(img);
      lastRawMeshRef.current = mesh;
      if (mesh && mesh.length) {
        const named = normalizeMeshToNamed(mesh.map((p) => ({ x: p.x, y: p.y })));
        const size = { width: img.naturalWidth || 640, height: img.naturalHeight || 800 };
        const s = createScanSessionFromLandmarks({ imageUrl: dataUrl, imageLabel: file.name, source: "upload", imageSize: size, landmarks: named, rawMesh: mesh });
        setSession(s);
        return;
      }

      await runDemoAnalysis(dataUrl, file.name, "upload");
    } catch (err) {
      setScanError(err instanceof Error ? err.message : String(err));
    } finally {
      e.target.value = "";
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <section className="glass rounded-[2rem] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Input</p>
            <h1 className="mt-2 font-display text-4xl text-white">Upload or camera capture</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/62">Scan a portrait and review processing steps.</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/55">{statusLabel}</span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button onClick={() => fileInputRef.current?.click()} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-white">File upload</button>
          <button onClick={() => (cameraActive ? stopCamera() : startCamera())} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-white">{cameraActive ? "Stop camera" : "Start camera"}</button>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" aria-label="Upload portrait image" onChange={handleFileChange} className="sr-only" />

        <div ref={previewContainerRef} className="mt-6 relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/35">
          <video ref={videoRef} playsInline muted className={`aspect-[4/5] h-full w-full object-cover ${cameraActive ? "" : "hidden"}`} style={{ transform: 'none' }} />
          {!cameraActive && <div className="flex aspect-[4/5] items-center justify-center text-white/60">{cameraMessage}</div>}

          {/* debug overlay */}
          {showDebug && (
            <div className="absolute inset-0 pointer-events-none">
              {(() => {
                const mesh = lastRawMeshRef.current ?? lastMeshRef.current;
                if (!mesh || !mesh.length) return null;
                const rect = previewContainerRef.current?.getBoundingClientRect();
                const width = rect?.width ?? 480;
                const height = rect?.height ?? 600;
                return mesh.map((p, i) => {
                  const left = Math.round((p.x ?? 0) * width);
                  const top = Math.round((p.y ?? 0) * height);
                  return (
                    <div key={i} style={{ position: 'absolute', left, top, transform: 'translate(-50%,-50%)' }}>
                      <div style={{ background: 'rgba(0,120,255,0.9)', color: '#fff', fontSize: 10, padding: '2px 4px', borderRadius: 6 }}>{i}</div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-3 items-center">
          <button onClick={() => captureFrameFromCamera()} disabled={!cameraActive} className="rounded-full bg-gradient-to-r from-aurora-400 to-emerald-300 px-5 py-3 font-semibold text-ink-950">Capture frame</button>
          <button onClick={() => { setSession(null); setPreviewUrl(null); setPreviewLabel("Ready to scan"); }} className="rounded-full border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white/82">Reset</button>
          <label className="ml-3 flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" checked={showDebug} onChange={(e) => setShowDebug(e.target.checked)} />
            <span>Show landmark indices</span>
          </label>
          {session?.rawMesh ? (
            <>
              <button onClick={() => {
                const blob = new Blob([JSON.stringify(session.rawMesh, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${session.imageLabel || 'scan'}-rawMesh.json`;
                a.click();
                URL.revokeObjectURL(url);
              }} className="ml-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/82">Export raw mesh</button>
              <button onClick={async () => {
                try {
                  const resp = await fetch('http://localhost:4000/v1/scans/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ landmarks: session.landmarks, rawMesh: session.rawMesh })
                  });
                  if (!resp.ok) throw new Error(`Upload failed: ${resp.status}`);
                  const data = await resp.json();
                  setScanError(null);
                  // Merge server analysis into session.analysis (optional)
                  setSession((prev) => prev ? { ...prev, analysis: data.analysis ?? prev.analysis } : prev);
                  alert('Uploaded scan to API and received analysis.');
                } catch (err) {
                  setScanError(err instanceof Error ? err.message : String(err));
                }
              }} className="ml-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Upload to API</button>
            </>
          ) : null}
        </div>

        {scanError ? <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{scanError}</div> : null}

        <div className="mt-6"><ProcessingTimeline steps={pipelineSteps} currentIndex={isScanning ? scanIndex : pipelineSteps.length - 1} /></div>
      </section>

      <div className="space-y-6">
        {(() => {
          const liveNamed = liveLandmarks ? normalizeMeshToNamed(liveLandmarks) : session?.landmarks ?? undefined;
          const conn = buildConnections(liveNamed as any);
          const displayPoints = liveNamed ? Object.values(liveNamed) : landmarks;
          return (
            <ScanPreview
              label={session ? `${session.imageLabel} · ${session.source === "camera" ? "Camera" : "Upload"}` : "Processed preview"}
              accent={session?.source === "camera" ? "aurora" : "gold"}
              imageSrc={previewUrl ?? undefined}
              imageAlt={previewLabel}
              statusLabel={session ? "Annotated output" : "Awaiting input"}
              subtitle={session ? `${session.imageSize.width} × ${session.imageSize.height} · image normalized and annotated` : "Your scan output will appear here after upload or capture."}
              landmarks={displayPoints}
              connections={conn}
            />
          );
        })()}

        <div className="grid gap-4 sm:grid-cols-2">
          <MetricRing label="Attractiveness" value={analysis.attractivenessScore * 10} accent="gold" suffix="/100" />
          <MetricRing label="Symmetry" value={analysis.symmetryScore} />
          <MetricRing label="Harmony" value={analysis.harmonyScore} accent="gold" />
          <MetricRing label="Confidence" value={analysis.confidence} />
        </div>

        <div className="glass rounded-[2rem] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Scan summary</p>
              <h2 className="mt-2 font-display text-3xl text-white">{analysis.attractivenessScore.toFixed(1)}/10 facial harmony</h2>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">{session ? `${session.imageSize.width}×${session.imageSize.height}` : "Demo"}</div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-sm text-white/72">Golden ratio match: {analysis.goldenRatioMatch}%</div>
            <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-sm text-white/72">Balance score: {analysis.balanceScore}%</div>
            <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-sm text-white/72">Estimated age: {analysis.ageEstimate}</div>
          </div>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/68">{session ? "The image was normalized and annotated with landmarks." : "Upload or capture to run the scan."}</p>
        </div>

        <RatioTable metrics={analysis.metrics} />
      </div>
    </div>
  );
}
