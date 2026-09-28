# ForgeMind — M1 AI + Hindsight Architecture

## Goal

ForgeMind is an AI-powered factory operational memory system.

The AI must become more useful as historical incidents, actions, and outcomes accumulate.

## Core learning loop

New incident
  -> normalize incident
  -> recall relevant historical memories
  -> reflect/synthesize historical evidence
  -> AI recommendation
  -> engineer action
  -> observed outcome
  -> retain incident + outcome
  -> future recommendations improve

## M1 responsibilities

- Define incident and outcome contracts.
- Own Hindsight retain/recall/reflect adapters.
- Own the AI reasoning boundary.
- Preserve historical evidence separately from current AI reasoning.
- Return memory provenance so the frontend can show why a recommendation was made.
- Never fabricate historical evidence.
- Surface Hindsight failures explicitly.

## Integration boundary

M2 owns the application API and backend orchestration.

M3 consumes the stable analysis response and renders:
- incident information
- historical evidence
- recommendation
- outcome
- learning state

M4 and M5 integrate through the shared contracts rather than creating competing memory implementations.

## Hackathon demonstration

The system must support a visible learning curve:

1. First incident with little or no relevant history.
2. Engineer takes an action.
3. The outcome is retained.
4. A later similar incident retrieves the previous experience.
5. The recommendation uses that historical evidence.

The goal is to make the difference between a stateless AI and ForgeMind's memory-powered AI obvious.