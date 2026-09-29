# ForgeMind

ForgeMind is a factory operations app that connects incidents to historical operational memory. Teams can review machine health and incident history, submit a new incident for investigation, and capture outcomes for future recall.

## Screenshots

### Factory overview

Dashboard with incident, machine, resolution, and memory summaries.

![ForgeMind Factory Overview dashboard](screenshots/01-dashboard.png)

### Incident reporting

Capture a machine, issue, severity, and observed symptoms before starting an investigation.

![Report a factory incident](screenshots/02-incident-report.png)

### Factory Memory

Review operational memories from resolved incidents and search prior experience.

![Factory Memory and operational memories](screenshots/03-historical-memory.png)

### Machine health

Review machine status, reported load, current issues, and maintenance information.

![Machine Health screen](screenshots/04-machine-health.png)

### Incident history

Review recorded incidents, investigation status, and resolutions.

![Incident History screen](screenshots/05-incident-history.png)

### Backend API

The FastAPI OpenAPI UI documents the machine, incident, analysis, and outcome endpoints.

![ForgeMind API endpoint overview](screenshots/06-backend-api.png)

### API response

Example successful `GET /api/machines` request in Swagger UI.

![Successful machines API request and response](screenshots/07-api-response.png)

## What the app includes

- A React and Vite interface for the factory overview, incident reporting, investigation, resolution, Factory Memory, machine health, and incident history.
- A FastAPI backend that serves machine and incident records from the repository's JSON data and exposes search, incident assessment, analysis, and outcome endpoints.
- An M1 Node service that connects incident analysis and outcome retention to Hindsight memory and Groq.
- Swagger UI at `/docs` when the backend is running.

Dashboard summary figures are illustrative demo values in the frontend. Machine and incident lists are loaded from the backend, with frontend fallback records if those requests fail.

## Run locally

The frontend and data-backed API can run independently. Incident analysis and outcome retention also require the M1 service, Hindsight, and Groq credentials.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite prints the local frontend URL when it starts.

### FastAPI backend

From the repository root:

```bash
python -m venv .venv
python -m pip install -r backend/requirements.txt
python -m uvicorn app.main:app --app-dir backend --reload --port 8000
```

The API is available at `http://127.0.0.1:8000`; interactive documentation is at `http://127.0.0.1:8000/docs`.

### M1 analysis and memory service

Configure `m1-runtime/.env` with `HINDSIGHT_BASE_URL`, `HINDSIGHT_API_KEY`, `HINDSIGHT_BANK_ID`, and `GROQ_API_KEY`. Start the Hindsight service separately, then run:

```bash
cd m1-runtime
npm install
npm run m1
```

M1 listens on port `8101` by default. The FastAPI `/api/analyze` and `/api/outcome` routes forward requests to that service.

## API endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/health` | Backend health check |
| `GET` | `/api/machines` | List factory machines |
| `GET` | `/api/incidents` | List historical incidents |
| `POST` | `/api/incidents/search` | Search historical incidents |
| `POST` | `/api/incidents/assess` | Assess a stored incident by ID |
| `POST` | `/api/analyze` | Analyze an incident through M1 |
| `POST` | `/api/outcome` | Send an incident outcome to M1 for retention |

## Repository layout

```text
backend/       FastAPI application and Pydantic schemas
data/          Machine, incident, and test-case JSON records
docs/          Architecture and shared contract notes
frontend/      React and Vite application
m1-runtime/    M1 Node service, AI analysis, and Hindsight integration
screenshots/   README screenshots
```
