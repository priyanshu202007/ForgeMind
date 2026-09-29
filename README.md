# ForgeMind

> AI-powered factory operational memory that learns from past incidents and helps teams investigate and resolve new defects.

ForgeMind is a factory incident intelligence prototype that combines historical factory knowledge, Hindsight memory, and AI reasoning to help operators investigate new incidents using evidence from previous incidents.

## Current Project Status

The core services are implemented and being integrated:

- ✅ Factory data and domain logic
- ✅ Hindsight memory integration
- ✅ AI-powered incident analysis
- ✅ FastAPI backend
- ✅ Incident search
- ✅ Risk/domain assessment
- ✅ Outcome-to-memory learning loop
- ✅ Frontend UI structure
- 🔄 Frontend ↔ backend integration
- 🔄 Final end-to-end integration and testing

## How ForgeMind Works

```text
                    ┌─────────────────────┐
                    │   Factory Operator  │
                    │   Reports Incident  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      (M3)           │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   FastAPI Backend   │
                    │      (M2)            │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
      ┌─────────────────┐           ┌─────────────────┐
      │ Factory Data &  │           │ AI + Hindsight  │
      │ Domain Rules    │           │      (M1)       │
      │      (M4)       │           └────────┬────────┘
      └─────────────────┘                    │
                                             ▼
                                    ┌─────────────────┐
                                    │ Historical      │
                                    │ Memory + AI     │
                                    │ Reasoning       │
                                    └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │ Recommendations │
                                    │ + Evidence      │
                                    └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │ Operator Action │
                                    └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │ /api/outcome    │
                                    │ Memory Retain   │
                                    └─────────────────┘
