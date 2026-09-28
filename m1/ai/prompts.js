function buildIncidentAnalysisPrompt({
  incident,
  historicalEvidence = [],
  reflection = {}
}) {
  const evidenceText = historicalEvidence.length
    ? historicalEvidence
        .map(
          (item, index) =>
            `[EVIDENCE ${index + 1}]
memoryId: ${item.memoryId}
type: ${item.type}
relevance: ${item.relevance}
summary: ${item.summary}
source: ${item.source || "hindsight"}
tags: ${(item.tags || []).join(", ")}`
        )
        .join("\n\n")
    : "No historical Hindsight evidence was retrieved.";

  const reflectionText =
    typeof reflection?.text === "string"
      ? reflection.text
      : "No Hindsight reflection was returned.";

  return `
Analyze the following factory incident using the current incident,
retrieved Hindsight evidence, and Hindsight reflection.

CURRENT INCIDENT
incidentId: ${incident.incidentId}
machineId: ${incident.machineId}
timestamp: ${incident.timestamp}
title: ${incident.title}
description: ${incident.description}
symptoms: ${(incident.symptoms || []).join(", ")}
context: ${incident.context || "None"}

HINDSIGHT EVIDENCE
${evidenceText}

HINDSIGHT REFLECTION
${reflectionText}

RULES

1. Keep the current incident separate from historical evidence.
2. Never invent a previous incident, previous repair, machine history,
   measurement, or outcome.
3. A historical claim may only use a memoryId that exists in the supplied
   Hindsight evidence.
4. likelyCauses must contain:
   - cause
   - evidenceMemoryIds
5. recommendations must contain:
   - step
   - action
   - reason
   - evidenceMemoryIds
6. Use evidenceMemoryIds when a cause or recommendation is supported by
   historical Hindsight evidence.
7. Use an empty evidenceMemoryIds array when a conclusion comes only from
   the current incident or model reasoning.
8. Every warning must identify exactly one source:
   - hindsight
   - current_incident
   - model_reasoning
9. Do not present general engineering knowledge as historical evidence.
10. lessonsLearned should only reflect lessons present in the supplied
    Hindsight evidence or reflection.
11. Prefer concise, practical factory investigation steps.
12. Return JSON only.
`;
}

module.exports = {
  buildIncidentAnalysisPrompt
};