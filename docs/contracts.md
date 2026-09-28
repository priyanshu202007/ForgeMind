# ForgeMind — Shared AI / Memory Contracts

## Incident Input

```json
{
  "incidentId": "INC-001",
  "machineId": "CNC-001",
  "timestamp": "2026-09-28T10:30:00Z",
  "title": "Spindle overheating",
  "description": "Temperature rises after approximately three hours of operation.",
  "symptoms": [
    "spindle temperature rising",
    "coolant flow reduced"
  ],
  "context": {
    "operatorNotes": "Machine restarted once before escalation"
  }
}
{
  "incidentId": "INC-001",
  "summary": "Likely coolant-flow restriction",
  "recommendations": [
    {
      "step": 1,
      "action": "Inspect coolant filter and flow path",
      "reason": "A similar historical incident was resolved after identifying a blocked filter."
    }
  ],
  "historicalEvidence": [
    {
      "memoryId": "memory-id",
      "relevance": "high",
      "summary": "Previous CNC-001 overheating incident linked to a restricted coolant filter.",
      "outcome": "Filter replacement restored normal operation.",
      "source": "hindsight"
    }
  ],
  "memory": {
    "used": true,
    "retrievedCount": 1
  }
}
{
  "incidentId": "INC-001",
  "actionTaken": "Replaced coolant filter",
  "result": "Overheating stopped",
  "resolutionStatus": "resolved",
  "notes": "Machine returned to normal operation."
}