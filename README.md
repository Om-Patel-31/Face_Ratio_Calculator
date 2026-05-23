# FaceRatio AI

FaceRatio AI is a premium facial analysis platform for approximate aesthetic analysis, ratio mapping, and supportive improvement guidance. The application is structured as a production-ready monorepo with a Next.js web experience, an Express API layer, a FastAPI ML microservice, Prisma database schema, and shared facial ratio math.

## What is included

- Futuristic landing page, upload flow, analytics dashboard, report view, progress tracking, and settings
- Facial ratio formulas for thirds, fifths, symmetry, canthal tilt, and balance metrics
- API skeleton for scan ingestion, report generation, and progress tracking
- FastAPI ML microservice skeleton for model inference and score normalization
- Prisma schema for scans, metric snapshots, reports, and user progress
- Deployment notes and safety language for approximate AI-generated estimates

## Project structure

- apps/web: Next.js frontend
- apps/api: Express backend
- services/ml: FastAPI inference service
- prisma: database schema and migrations

## Core principles

- Beauty is subjective.
- Results are AI-generated estimates.
- No insulting, shaming, or discriminatory labels.
- Metrics are shown as approximate analytical signals.

## Ratio formulas

The ratio engine is implemented in [apps/web/lib/ratio-formulas.ts](apps/web/lib/ratio-formulas.ts) and mirrored in the backend service layer.

### Main metrics

- Facial thirds: trichion-to-brow, brow-to-base-of-nose, base-of-nose-to-chin
- Facial fifths: eye spacing compared with face width segments
- Eye spacing ratio: interocular distance divided by eye width
- Nose width ratio: alar width divided by mouth width or face width
- Lip-to-nose ratio: vermilion height relative to nose length
- Jawline proportion: gonial width relative to facial width
- Face length-to-width ratio: overall balance proxy
- Symmetry score: left-right landmark delta normalized by face scale
- Canthal tilt: outer-canthus vs inner-canthus slope angle
- Midface ratio: brow-to-base-of-nose divided by nose-to-chin
- Lower third ratio: subnasale-to-menton divided by full face height

### Golden ratio compatibility

Each metric is compared against a target ideal. A compatibility score is computed as:

$$
score = max(0, 1 - |actual - target| / target)
$$

A weighted average of metric scores yields the final golden ratio compatibility percentage, harmony score, and balance score.

## API endpoints

- `POST /v1/scans/analyze` - analyze uploaded landmark payload or ML response
- `GET /v1/scans/:id` - fetch a previous scan
- `GET /v1/reports/:scanId` - generate a report payload
- `GET /v1/progress/:userId` - return progress timeline entries
- `POST /v1/advice` - generate supportive appearance optimization guidance

## FastAPI endpoints

- `GET /health` - service health check
- `POST /infer` - run the inference pipeline and return normalized scores
- `POST /landmarks` - analyze raw landmark vectors and ratios

## Database schema

The Prisma schema is in [prisma/schema.prisma](prisma/schema.prisma).

## Deployment

### Frontend

1. Deploy `apps/web` to Vercel.
2. Set `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_ML_BASE_URL`.
3. Configure authentication provider secrets.

### API

1. Deploy `apps/api` to Render or Railway.
2. Set `DATABASE_URL`, CORS origin, and ML service URL.
3. Run Prisma migrations before production traffic.

### ML service

1. Deploy `services/ml` to Render, Railway, or a GPU-enabled container host.
2. Mount model artifacts and cache weights.
3. Keep inference stateless and return normalized scores only.

## Training pipeline overview

1. Collect aesthetic and landmark datasets with explicit consent.
2. Detect and normalize faces to a canonical pose and scale.
3. Extract landmarks and engineered ratio features.
4. Train a multi-head model for attractiveness, symmetry, harmony, and skin-quality proxies.
5. Calibrate scores with temperature scaling and confidence estimation.
6. Validate fairness across demographics and lighting conditions.
7. Export to ONNX or TensorFlow.js for inference.

## Next steps

- Install dependencies for each workspace package.
- Connect the frontend upload flow to the API and ML service.
- Replace the sample heuristics with trained model inference endpoints.
