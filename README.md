ForgeMind

«Factory operational memory that learns from every incident.»

ForgeMind is an AI-powered factory operations system that connects new incidents with historical operational experience.

Instead of treating every machine failure as a new problem, ForgeMind uses Hindsight memory to recall relevant incidents, reflect on historical evidence, generate investigation guidance, and retain the final outcome for future use.

The result is a continuous operational learning loop:

New Incident
     ↓
Historical Memory Recall
     ↓
Relevant Evidence
     ↓
AI Reflection & Investigation
     ↓
Engineer Action
     ↓
Observed Outcome
     ↓
Memory Retention
     ↓
Better Future Investigations

---

Why ForgeMind?

Factory teams repeatedly encounter similar operational problems:

- The same machine develops recurring issues.
- Experienced engineers may know the previous solution, but that knowledge is difficult to retrieve.
- Incident reports often contain useful historical information that is not actively reused.
- A conventional AI assistant can generate a recommendation without remembering what actually happened previously.

ForgeMind addresses this by turning resolved incidents into reusable operational memory.

When a similar incident occurs again, the system can retrieve previous experiences and use them as evidence during investigation.

---

Core Workflow

1. Report an incident

An engineer provides:

- Machine
- Issue / symptom
- Severity
- Error information
- Observed symptoms

2. Recall factory memory

ForgeMind sends the incident context to Hindsight and searches for historically relevant operational experiences.

3. Generate an investigation

Historical evidence is passed into the reasoning process to produce:

- Investigation summary
- Relevant historical evidence
- Recommended investigation steps
- Memory provenance

4. Resolve the incident

The engineer records:

- Confirmed root cause
- Action taken
- Result
- Resolution status
- Additional notes

5. Retain the outcome

The resolution becomes a new operational memory.

That experience can subsequently influence investigation of similar incidents.

---

Hindsight Memory

Hindsight is central to ForgeMind rather than being an optional search layer.

ForgeMind uses Hindsight for three core memory operations:

Recall

Retrieve operational experiences relevant to the current incident.

Current incident
      ↓
Hindsight Recall
      ↓
Historical experiences

Reflect

Use historical evidence to reason about the current incident.

Current incident + historical evidence
                ↓
        Hindsight Reflection
                ↓
       Investigation guidance

Retain

Store the result of an engineer's resolution so it can be reused later.

Engineer action + observed outcome
                ↓
        Hindsight Retention
                ↓
        Future operational memory

This creates the ForgeMind learning loop:

RECALL → REFLECT → ACT → RETAIN → RECALL

---

Architecture

┌─────────────────────────────────────────────┐
│                 React Frontend              │
│                                             │
│ Dashboard · Incident · Investigation        │
│ Resolution · Factory Memory · History       │
└──────────────────────┬──────────────────────┘
                       │ HTTP
                       ▼
┌─────────────────────────────────────────────┐
│              FastAPI Backend                │
│                                             │
│ Machines · Incidents · Search               │
│ Assessment · Analysis · Outcomes            │
└──────────────────────┬──────────────────────┘
                       │
                       │ Analysis / Outcome
                       ▼
┌─────────────────────────────────────────────┐
│              M1 AI + Memory Layer           │
│                                             │
│ Incident reasoning                          │
│ Hindsight Recall                            │
│ Hindsight Reflection                        │
│ Hindsight Retention                         │
└──────────────────────┬──────────────────────┘
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
      ┌──────────────┐    ┌──────────────┐
      │   Hindsight  │    │  LLM Layer   │
      │    Memory    │    │    / Groq    │
      └──────────────┘    └──────────────┘

---

Application Components

Frontend

The frontend is built with:

- React
- Vite
- React Router
- Lucide React

Main application areas include:

- Factory Overview
- Incident Reporting
- AI Investigation
- Incident Resolution
- Factory Memory
- Machine Health
- Incident History
- Settings

Backend

The application API is built with:

- Python
- FastAPI
- Pydantic
- HTTPX
- Uvicorn

The backend provides endpoints for:

Method| Endpoint| Purpose
"GET"| "/api/health"| Backend health check
"GET"| "/api/machines"| Retrieve factory machines
"GET"| "/api/incidents"| Retrieve historical incidents
"POST"| "/api/incidents/search"| Search historical incidents
"POST"| "/api/incidents/assess"| Assess a stored incident
"POST"| "/api/analyze"| Analyze a new incident through M1
"POST"| "/api/outcome"| Retain an incident outcome through M1

Interactive API documentation is available through FastAPI Swagger UI at:

http://127.0.0.1:8000/docs

M1 — AI + Hindsight Memory

The M1 layer owns the AI and operational-memory boundary.

Responsibilities include:

- Hindsight integration
- Memory recall
- Memory reflection
- Memory retention
- Historical evidence extraction
- Incident analysis
- Investigation recommendations
- Outcome-to-memory learning

---

Repository Structure

ForgeMind/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   └── schemas/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
├── m1/
│   ├── ai/
│   ├── hindsight/
│   ├── services/
│   └── README.md
│
├── data/
│   ├── machines.json
│   ├── incidents.json
│   └── test_cases.json
│
├── docs/
│   └── architecture.md
│
├── screenshots/
│
├── package.json
├── package-lock.json
└── README.md

---

Demo Data

ForgeMind includes synthetic factory data covering machines and historical incidents.

The current dataset contains examples involving:

- CNC machines
- Hydraulic presses
- Coolant systems
- Conveyors
- Surface-finish defects
- Dimensional inaccuracies
- Machine vibration
- Coolant problems
- Hydraulic pressure problems
- Conveyor issues

The data is intended for demonstration and hackathon prototyping rather than production factory deployment.

---

Running ForgeMind Locally

ForgeMind consists of three logical layers:

Frontend
   ↓
FastAPI Backend
   ↓
M1 AI + Hindsight

Prerequisites

Install:

- Git
- Node.js
- npm
- Python 3
- pip
- Access to the configured Hindsight service
- Hindsight API credentials
- Groq API credentials when using the Groq reasoning layer

---

1. Start the Frontend

From the repository root:

cd frontend
npm install
npm run dev

Vite will print the local development URL.

The frontend API client uses:

http://127.0.0.1:8000

by default.

You can override the backend URL with:

VITE_API_BASE_URL

---

2. Start the FastAPI Backend

From the repository root:

python -m venv .venv

Activate the environment.

Windows

.venv\Scripts\activate

macOS / Linux

source .venv/bin/activate

Install the backend dependencies:

python -m pip install -r backend/requirements.txt

Start FastAPI:

python -m uvicorn app.main:app --app-dir backend --reload --port 8000

Backend:

http://127.0.0.1:8000

Swagger:

http://127.0.0.1:8000/docs

Health check:

http://127.0.0.1:8000/api/health

---

3. Configure M1 + Hindsight

The M1 layer requires the Hindsight configuration used by the memory adapters.

Required environment variables include:

HINDSIGHT_BASE_URL=
HINDSIGHT_API_KEY=
HINDSIGHT_BANK_ID=

The AI reasoning integration also requires:

GROQ_API_KEY=

Do not commit real credentials to GitHub.

Use a local ".env" file for development.

---

End-to-End Flow

Once the frontend, backend, and M1 services are running:

1. Open ForgeMind
        ↓
2. Report a factory incident
        ↓
3. Click "Investigate with Factory Memory"
        ↓
4. Backend sends the incident to M1
        ↓
5. M1 recalls relevant Hindsight memories
        ↓
6. Historical evidence is returned
        ↓
7. AI generates investigation guidance
        ↓
8. Engineer records the resolution
        ↓
9. Outcome is retained in Hindsight
        ↓
10. A future similar incident can retrieve that experience

---

Demonstrating the Learning Effect

The key ForgeMind demonstration is not simply:

«"AI gives a recommendation."»

The important demonstration is:

First incident

Incident
   ↓
Little / no relevant historical memory
   ↓
Investigation
   ↓
Engineer resolves incident
   ↓
Outcome retained

Similar incident later

Similar incident
       ↓
Hindsight recall
       ↓
Previous experience retrieved
       ↓
Historical evidence displayed
       ↓
AI investigation informed by previous outcome

This demonstrates the difference between a stateless AI workflow and a memory-powered operational workflow.

---

API Examples

Health Check

curl http://127.0.0.1:8000/api/health

Expected response:

{
  "status": "ok"
}

Retrieve Machines

curl http://127.0.0.1:8000/api/machines

Retrieve Historical Incidents

curl http://127.0.0.1:8000/api/incidents

Analyze an Incident

POST /api/analyze
Content-Type: application/json

Example payload:

{
  "incidentId": "INC-DEMO-001",
  "machineId": "CNC-01",
  "timestamp": "2026-09-30T10:00:00Z",
  "title": "Spindle overheating",
  "description": "Spindle temperature is increasing after extended operation.",
  "symptoms": [
    "increased spindle temperature",
    "reduced coolant flow"
  ]
}

Retain an Outcome

POST /api/outcome
Content-Type: application/json

Example:

{
  "incidentId": "INC-DEMO-001",
  "actionTaken": "Cleaned the coolant filter and verified coolant flow.",
  "result": "Temperature returned to normal.",
  "resolutionStatus": "resolved",
  "notes": "Resolved during maintenance inspection."
}

---

Safety and Data Scope

ForgeMind is a hackathon prototype.

The repository uses synthetic factory data and does not directly control physical machinery.

Recommendations generated by ForgeMind are intended to support investigation and knowledge retrieval, not replace qualified engineering procedures, safety controls, lockout/tagout procedures, or authorized maintenance decisions.

---

Project Documentation

Architecture documentation:

docs/architecture.md

M1 documentation:

m1/README.md

The architecture documentation describes the intended:

Recall
→ Reflect
→ Recommend
→ Act
→ Retain
→ Recall

learning loop.

---

Screenshots

Factory Overview

"ForgeMind Factory Overview" (screenshots/01-dashboard.png)

Incident Reporting

"ForgeMind Incident Reporting" (screenshots/02-incident-report.png)

Factory Memory

"ForgeMind Factory Memory" (screenshots/03-historical-memory.png)

Machine Health

"ForgeMind Machine Health" (screenshots/04-machine-health.png)

Incident History

"ForgeMind Incident History" (screenshots/05-incident-history.png)

Backend API

"ForgeMind Backend API" (screenshots/06-backend-api.png)

API Response

"ForgeMind API Response" (screenshots/07-api-response.png)

---

Technology Stack

Layer| Technology
Frontend| React
Build Tool| Vite
Routing| React Router
UI Icons| Lucide React
Backend| FastAPI
API Validation| Pydantic
Backend HTTP| HTTPX
Runtime| Uvicorn
AI / Reasoning| LLM integration
AI Provider| Groq
Persistent Memory| Hindsight
Data| JSON
Language| JavaScript / Python

---

What Makes ForgeMind Different?

ForgeMind is designed around operational memory, not simply conversational AI.

The core idea is:

Past operational experience
          ↓
     becomes memory
          ↓
   memory becomes evidence
          ↓
 evidence informs investigation
          ↓
 new outcome becomes memory

Every resolved incident can therefore contribute to the knowledge available for future incidents.

---

Team

ForgeMind — Hack with Hyderabad 3.0

Built as a collaborative hackathon prototype focused on AI-powered factory operational memory.

---

Status

ForgeMind is a hackathon prototype demonstrating:

- Factory incident management
- Historical operational memory
- Hindsight recall
- Hindsight reflection
- AI-assisted investigation
- Outcome retention
- Memory-powered future investigations
