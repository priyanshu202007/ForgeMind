const { retainIncident } = require("../hindsight/retain");
const { recallRelevantIncidents } = require("../hindsight/recall");
const { reflectOnIncident } = require("../hindsight/reflect");

function mapHistoricalEvidence(recallResult) {
  const results = Array.isArray(recallResult?.results)
    ? recallResult.results
    : [];

  return results.map((item) => ({
    memoryId: item.id,
    relevance: item.scores?.final ?? null,
    summary: item.text,
    source: "hindsight",
    tags: item.tags || []
  }));
}

async function analyzeIncidentWithMemory(incident) {
  if (!incident?.incidentId) {
    throw new Error("incidentId is required.");
  }

  // 1. Find relevant historical memories.
  const recallResult = await recallRelevantIncidents(incident);

  const historicalEvidence = mapHistoricalEvidence(recallResult);

  // 2. Ask Hindsight to synthesize the historical context.
  const reflection = await reflectOnIncident(incident);

  return {
    incidentId: incident.incidentId,

    summary:
      reflection?.text ||
      "No reflection was returned.",

    historicalEvidence,

    memory: {
      used: historicalEvidence.length > 0,
      retrievedCount: historicalEvidence.length
    },

    reflection: {
      rawText: reflection?.text || null
    }
  };
}

async function retainIncidentOutcome(outcome) {
  if (!outcome?.incidentId) {
    throw new Error("incidentId is required.");
  }

  const content = [
    "ForgeMind factory incident outcome",
    `Incident ID: ${outcome.incidentId}`,
    `Action taken: ${outcome.actionTaken || "unknown"}`,
    `Result: ${outcome.result || "unknown"}`,
    `Resolution status: ${outcome.resolutionStatus || "unknown"}`,
    `Notes: ${outcome.notes || ""}`
  ].join("\n");

  const { hindsight, bankId } = require("../hindsight/client");

  return hindsight.retain(bankId, content, {
    context: "ForgeMind factory incident outcome",
    timestamp: new Date().toISOString(),
    document_id: `incident-${outcome.incidentId}-outcome`,
    tags: [
      `incident:${outcome.incidentId}`,
      "domain:factory",
      "type:outcome"
    ]
  });
}

module.exports = {
  analyzeIncidentWithMemory,
  retainIncidentOutcome
};