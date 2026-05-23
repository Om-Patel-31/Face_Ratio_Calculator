// Client-side MediaPipe FaceMesh helper (lazy-loaded). Uses CDN UMD bundles to avoid bundler resolution.

type Landmark = { x: number; y: number; z?: number };

function loadScriptOnce(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = (e) => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

async function ensureMediaPipe() {
  // Load UMD bundles from jsDelivr if globals are not present
  const faceMeshGlobal = (window as any).FaceMesh;
  const cameraUtilsGlobal = (window as any).Camera;
  if (faceMeshGlobal && cameraUtilsGlobal) return;

  const faceMeshUrl = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js';
  const cameraUrl = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';

  await Promise.all([loadScriptOnce(faceMeshUrl), loadScriptOnce(cameraUrl)]);
  // give globals a moment
  await new Promise((r) => setTimeout(r, 50));
}

export async function initFaceMeshCamera(video: HTMLVideoElement, onLandmarks: (lm: Landmark[]) => void) {
  if (typeof window === 'undefined') return null;
  try {
    await ensureMediaPipe();
    const FaceMesh = (window as any).FaceMesh;
    const Camera = (window as any).Camera;
    if (!FaceMesh || !Camera) throw new Error('MediaPipe globals not available');

    const faceMesh = new FaceMesh({ locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });
    faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
    faceMesh.onResults((results: any) => {
      if (!results?.multiFaceLandmarks || !results.multiFaceLandmarks[0]) return;
      const lm = results.multiFaceLandmarks[0].map((p: any) => ({ x: p.x, y: p.y, z: p.z }));
      onLandmarks(lm);
    });

    const camera = new Camera(video, {
      onFrame: async () => {
        try {
          await faceMesh.send({ image: video });
        } catch (e) {
          // ignore
        }
      }
    });
    await camera.start();
    return { faceMesh, camera } as any;
  } catch (error) {
    if ((error as any)?.name === 'NotAllowedError' || String(error).toLowerCase().includes('permission')) {
      console.info('MediaPipe FaceMesh init aborted: camera permission denied.');
    } else {
      console.warn('MediaPipe FaceMesh init failed', error);
    }
    return null;
  }
}

export async function estimateLandmarksFromImage(image: HTMLImageElement) {
  if (typeof window === 'undefined') return [] as Landmark[];
  try {
    await ensureMediaPipe();
    const FaceMesh = (window as any).FaceMesh;
    if (!FaceMesh) throw new Error('FaceMesh not available');

    const faceMesh = new FaceMesh({ locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });
    faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });

    return await new Promise<Landmark[]>((resolve) => {
      faceMesh.onResults((results: any) => {
        if (!results?.multiFaceLandmarks || !results.multiFaceLandmarks[0]) {
          resolve([]);
          return;
        }
        const lm = results.multiFaceLandmarks[0].map((p: any) => ({ x: p.x, y: p.y, z: p.z }));
        resolve(lm);
      });
      try {
        faceMesh.send({ image });
      } catch (e) {
        resolve([]);
      }
    });
  } catch (error) {
    if ((error as any)?.name === 'NotAllowedError' || String(error).toLowerCase().includes('permission')) {
      console.info('MediaPipe estimate aborted: camera permission denied.');
    } else {
      console.warn('MediaPipe estimate failed', error);
    }
    return [] as Landmark[];
  }
}
