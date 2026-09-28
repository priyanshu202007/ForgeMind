# Hindsight Integration

This module is the only M1 layer that communicates directly with Hindsight.

The rest of ForgeMind should use application-level functions such as:

- `retainIncident()`
- `recallRelevantIncidents()`
- `reflectOnIncident()`

M2 and M3 should not import the Hindsight SDK directly.

This keeps the Hindsight implementation replaceable and prevents the rest of the application from depending on vendor-specific response shapes.