
# ForgeMind — Factory Data

## Purpose
This folder contains synthetic factory data for the ForgeMind hackathon prototype.

The data helps demonstrate how an AI assistant can retrieve similar historical incidents and provide evidence-based troubleshooting suggestions.

## Files

| File | Description |
|---|---|
| machines.json | 5 sample factory machines |
| incidents.json | 10 synthetic historical incidents |
| test_cases.json | 5 test queries with expected results |
| seed_data/demo_incidents.json | Reserved for demo seed data |

## Data Structure

### Machines
Each machine includes:
- Machine ID
- Name and machine type
- Production line
- Operational status

### Incidents
Each incident includes:
- Incident ID and machine ID
- Date and defect
- Symptoms
- Root cause
- Resolution
- Outcome and severity

### Test Cases
Each test case includes:
- Test ID
- User query
- Expected incident ID
- Expected root cause

## Important Note
All factory data is fictional and created for demonstration purposes. It does not represent real factory equipment or maintenance records.

ForgeMind provides suggestions for investigation and does not replace qualified maintenance personnel or authorized safety procedures.
