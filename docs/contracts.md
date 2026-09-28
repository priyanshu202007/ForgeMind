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
  "summary": "Historical analysis summary",
  "recommendations": [],
  "historicalEvidence": [
    {
      "memoryId": "memory-id",
      "relevance": 1.08,
      "type": "root_cause",
      "summary": "Previous CNC-001 overheating incident linked to a restricted coolant filter.",
      "source": "hindsight",
      "tags": [
        "incident:INC-001",
        "machine:CNC-001",
        "domain:factory"
      ]
    }
  ],
  "memory": {
    "used": true,
    "retrievedCount": 1
  },
  "reflection": {
    "rawText": "Historical reasoning from Hindsight."
  }
}
{
  "incidentId": "INC-001",
  "actionTaken": "Replaced coolant filter",
  "result": "Overheating stopped",
  "resolutionStatus": "resolved",
  "notes": "Machine returned to normal operation."
}